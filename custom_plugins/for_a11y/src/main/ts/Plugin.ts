/* ==================================================================
 *  for_a11y plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  On-Demand Accessibility-Check des aktuellen Editor-Inhalts.
 *
 *  Regeln (per Option `a11y_rules` einzeln abschaltbar):
 *    img-missing-alt        – <img> ohne alt-Attribut               (error)
 *    img-alt-in-text-link   – nicht-leeres alt, obwohl Link-Text da  (warn)
 *    img-empty-alt-nondeco  – alt="" ohne Link-Text-Kontext          (warn)
 *    link-generic-text      – "hier", "weiterlesen", "klick hier"…  (warn)
 *    link-no-accname        – <a> ohne erkennbaren accessible name  (error)
 *    link-new-window        – target="_blank" ohne Hinweis          (info)
 *    heading-empty          – leere Überschrift                     (warn)
 *    heading-skip           – Heading-Hierarchie-Sprung             (warn)
 *    table-no-th            – Tabelle ohne <th>                     (warn)
 *    table-no-caption       – Tabelle ohne <caption>                (info)
 *    table-th-no-scope      – <th> ohne scope in Matrix-Tabelle     (info)
 *    iframe-no-title        – <iframe> ohne title                   (warn)
 *
 *  Toolbar:  for_a11y
 *  Menü:     for_a11y
 *  Command:  forA11yCheck
 * ================================================================== */

declare const tinymce: any;

type Severity = 'error' | 'warn' | 'info';

interface Finding {
    id: string;         // Regel-Id (z.B. img-missing-alt)
    severity: Severity;
    title: string;      // Kurze Überschrift
    message: string;    // Beschreibung / Tipp
    element: HTMLElement;
    preview: string;    // kurzer HTML/Text-Auszug
}

const DEFAULT_GENERIC_LINK_TEXTS = [
    'hier', 'klick hier', 'klicken', 'klicke hier', 'klicken sie hier',
    'mehr', 'mehr erfahren', 'mehr lesen',
    'weiter', 'weiterlesen', 'weiter lesen',
    'link', 'dieser link', 'mehr infos', 'infos',
    'read more', 'click here', 'more', 'here', 'learn more', 'details'
];

const DEFAULT_RULES: Record<string, boolean> = {
    'img-missing-alt':       true,
    'img-alt-in-text-link':  true,
    'img-empty-alt-nondeco': true,
    'link-generic-text':     true,
    'link-no-accname':       true,
    'link-new-window':       true,
    'heading-empty':         true,
    'heading-skip':          true,
    'table-no-th':           true,
    'table-no-caption':      true,
    'table-th-no-scope':     true,
    'iframe-no-title':       true
};

const SEVERITY_ORDER: Record<Severity, number> = { error: 0, warn: 1, info: 2 };
const SEVERITY_LABEL: Record<Severity, string> = {
    error: 'Fehler',
    warn:  'Warnung',
    info:  'Hinweis'
};
const SEVERITY_ICON: Record<Severity, string> = {
    error: '⛔',
    warn:  '⚠️',
    info:  'ℹ️'
};

/* ---------------- Helpers ---------------- */

function getRules(editor: any): Record<string, boolean> {
    try {
        const raw = editor.getParam('a11y_rules');
        if (raw && typeof raw === 'object') {
            return { ...DEFAULT_RULES, ...raw };
        }
    } catch (_e) { /* noop */ }
    return DEFAULT_RULES;
}

function getGenericLinkTexts(editor: any): string[] {
    try {
        const raw = editor.getParam('a11y_generic_link_texts');
        if (Array.isArray(raw) && raw.length) {
            return raw.map((s) => String(s).toLowerCase().trim()).filter(Boolean);
        }
    } catch (_e) { /* noop */ }
    return DEFAULT_GENERIC_LINK_TEXTS;
}

function getNewWindowWarning(editor: any): boolean {
    try {
        const raw = editor.getParam('a11y_new_window_warning');
        if (typeof raw === 'boolean') return raw;
    } catch (_e) { /* noop */ }
    return true;
}

function truncate(s: string, n = 80): string {
    const trimmed = s.replace(/\s+/g, ' ').trim();
    return trimmed.length > n ? trimmed.slice(0, n - 1) + '…' : trimmed;
}

function shortHtml(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase();
    const txt = truncate(el.textContent || '', 60);
    if (tag === 'img') {
        const src = el.getAttribute('src') || '';
        const alt = el.getAttribute('alt');
        return `<img src="${truncate(src, 40)}"${alt === null ? '' : ` alt="${truncate(alt, 20)}"`}>`;
    }
    if (tag === 'a') {
        const href = el.getAttribute('href') || '';
        return `<a href="${truncate(href, 40)}">${txt || '(leer)'}</a>`;
    }
    if (tag === 'iframe') {
        const src = el.getAttribute('src') || '';
        return `<iframe src="${truncate(src, 40)}">`;
    }
    return `<${tag}>${txt || '(leer)'}</${tag}>`;
}

function hasVisibleTextContent(el: Element): boolean {
    // textContent ohne alt-Fallbacks
    const clone = el.cloneNode(true) as Element;
    // Bilder entfernen (deren alt zählt separat)
    Array.from(clone.querySelectorAll('img')).forEach((n) => n.remove());
    return ((clone.textContent || '').trim().length > 0);
}

function accessibleName(el: Element): string {
    const label = (el.getAttribute('aria-label') || '').trim();
    if (label) return label;
    // aria-labelledby: wir resolven nicht – ist im Editor-Kontext selten relevant
    const title = (el.getAttribute('title') || '').trim();
    const text = (el.textContent || '').trim();
    if (text) return text;
    if (title) return title;
    const img = el.querySelector('img');
    if (img) {
        const alt = (img.getAttribute('alt') || '').trim();
        if (alt) return alt;
    }
    return '';
}

function isInTextLink(img: HTMLElement): boolean {
    // Bild ist in <a> eingewickelt und der Link hat sichtbaren Text abseits des Bildes
    const link = img.closest('a');
    if (!link) return false;
    return hasVisibleTextContent(link);
}

/* ---------------- Analyse ---------------- */

function runAudit(body: HTMLElement, editor: any): Finding[] {
    const rules = getRules(editor);
    const genericTexts = getGenericLinkTexts(editor);
    const warnNewWindow = getNewWindowWarning(editor);
    const findings: Finding[] = [];

    /* --- Bilder --- */
    const imgs = Array.from(body.querySelectorAll('img')) as HTMLImageElement[];
    imgs.forEach((img) => {
        const hasAlt = img.hasAttribute('alt');
        const alt = (img.getAttribute('alt') || '');
        const role = (img.getAttribute('role') || '').trim().toLowerCase();
        const isPresentation = role === 'presentation' || role === 'none';
        const inTextLink = isInTextLink(img);

        if (rules['img-missing-alt'] && !hasAlt) {
            if (inTextLink) {
                // Sonderfall: besser alt="" setzen, damit Screenreader nicht doppelt vorliest
                findings.push({
                    id: 'img-missing-alt',
                    severity: 'warn',
                    title: 'Bild in Textlink ohne alt-Attribut',
                    message: 'Das Bild ist in einem Link mit sichtbarem Text. Setze alt="" (leeres alt), damit Screenreader den Link-Text nicht doppelt ausgeben.',
                    element: img,
                    preview: shortHtml(img)
                });
            } else {
                findings.push({
                    id: 'img-missing-alt',
                    severity: 'error',
                    title: 'Bild ohne alt-Attribut',
                    message: 'Jedes Bild braucht ein alt-Attribut. Für rein dekorative Bilder: alt="" oder role="presentation".',
                    element: img,
                    preview: shortHtml(img)
                });
            }
            return;
        }

        if (hasAlt && alt.trim().length > 0 && inTextLink && rules['img-alt-in-text-link']) {
            findings.push({
                id: 'img-alt-in-text-link',
                severity: 'warn',
                title: 'Bild in Textlink mit gefülltem alt',
                message: 'Das Bild steht in einem Link mit sichtbarem Text. Ein leeres alt="" ist hier meist besser, damit der Link-Text nicht verdoppelt wird.',
                element: img,
                preview: shortHtml(img)
            });
            return;
        }

        if (hasAlt && alt.trim().length === 0 && !inTextLink && !isPresentation && rules['img-empty-alt-nondeco']) {
            findings.push({
                id: 'img-empty-alt-nondeco',
                severity: 'warn',
                title: 'Leeres alt-Attribut',
                message: 'Leeres alt ist nur für rein dekorative Bilder gedacht. Ist das Bild informativ, ergänze einen beschreibenden alt-Text.',
                element: img,
                preview: shortHtml(img)
            });
        }
    });

    /* --- Links --- */
    const links = Array.from(body.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    links.forEach((a) => {
        const accName = accessibleName(a);
        const text = (a.textContent || '').trim();
        const normalized = text.toLowerCase();

        if (rules['link-no-accname'] && !accName) {
            findings.push({
                id: 'link-no-accname',
                severity: 'error',
                title: 'Link ohne Beschriftung',
                message: 'Der Link hat keinen sichtbaren Text, kein aria-label und kein Bild mit alt. Screenreader können das Ziel nicht benennen.',
                element: a,
                preview: shortHtml(a)
            });
            return;
        }

        if (rules['link-generic-text'] && text && genericTexts.indexOf(normalized) !== -1) {
            findings.push({
                id: 'link-generic-text',
                severity: 'warn',
                title: `Generischer Linktext: „${truncate(text, 30)}"`,
                message: 'Linktexte sollten das Ziel beschreiben, damit sie auch aus dem Kontext gerissen verständlich sind (Screenreader-Linkliste).',
                element: a,
                preview: shortHtml(a)
            });
        }

        if (rules['link-new-window'] && warnNewWindow) {
            const target = (a.getAttribute('target') || '').toLowerCase();
            if (target === '_blank') {
                const ariaLabel = (a.getAttribute('aria-label') || '').toLowerCase();
                const title = (a.getAttribute('title') || '').toLowerCase();
                const hintRegex = /neue[rm]?\s*(fenster|tab)|new\s*(window|tab)|öffnet in|opens in/;
                const hasHint = hintRegex.test(normalized) || hintRegex.test(ariaLabel) || hintRegex.test(title);
                if (!hasHint) {
                    findings.push({
                        id: 'link-new-window',
                        severity: 'info',
                        title: 'Link öffnet in neuem Fenster',
                        message: 'Der Link öffnet mit target="_blank". Gib Nutzer:innen einen Hinweis im Linktext, aria-label oder title (z.B. „(öffnet in neuem Fenster)").',
                        element: a,
                        preview: shortHtml(a)
                    });
                }
            }
        }
    });

    /* --- Überschriften --- */
    const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
    let prevLevel = 0;
    headings.forEach((h) => {
        const level = parseInt(h.tagName.substring(1), 10);
        if (rules['heading-empty'] && !(h.textContent || '').trim()) {
            findings.push({
                id: 'heading-empty',
                severity: 'warn',
                title: `Leere ${h.tagName}-Überschrift`,
                message: 'Überschriften sollten nicht leer sein.',
                element: h,
                preview: shortHtml(h)
            });
        }
        if (rules['heading-skip'] && prevLevel > 0 && level > prevLevel + 1) {
            findings.push({
                id: 'heading-skip',
                severity: 'warn',
                title: `Hierarchie-Sprung: ${h.tagName} nach h${prevLevel}`,
                message: `Überschriften sollten nicht mehr als eine Ebene überspringen (von h${prevLevel} direkt zu ${h.tagName}).`,
                element: h,
                preview: shortHtml(h)
            });
        }
        prevLevel = level;
    });

    /* --- Tabellen --- */
    const tables = Array.from(body.querySelectorAll('table')) as HTMLElement[];
    tables.forEach((t) => {
        const ths = t.querySelectorAll('th');
        const caption = t.querySelector('caption');

        if (rules['table-no-th'] && ths.length === 0) {
            findings.push({
                id: 'table-no-th',
                severity: 'warn',
                title: 'Tabelle ohne <th>',
                message: 'Datentabellen brauchen mindestens eine Kopfzelle (<th>), damit Screenreader Zeilen/Spalten ordnen können.',
                element: t,
                preview: shortHtml(t)
            });
        }

        if (rules['table-no-caption'] && !caption) {
            findings.push({
                id: 'table-no-caption',
                severity: 'info',
                title: 'Tabelle ohne <caption>',
                message: 'Eine <caption> beschreibt den Inhalt der Tabelle und hilft bei der Orientierung.',
                element: t,
                preview: shortHtml(t)
            });
        }

        if (rules['table-th-no-scope'] && ths.length > 0) {
            // Matrix-Tabelle = hat sowohl row- als auch col-headers
            let hasRowHeader = false;
            let hasColHeader = false;
            const rows = Array.from(t.querySelectorAll('tr'));
            rows.forEach((row) => {
                const cells = Array.from(row.children);
                if (cells.length > 0 && cells[0].tagName.toLowerCase() === 'th') hasRowHeader = true;
            });
            const firstRowCells = rows.length ? Array.from(rows[0].children) : [];
            hasColHeader = firstRowCells.every((c) => c.tagName.toLowerCase() === 'th') && firstRowCells.length > 0;
            const isMatrix = hasRowHeader && hasColHeader;
            const thsWithoutScope = Array.from(ths).filter((th) => !th.getAttribute('scope'));
            if (isMatrix && thsWithoutScope.length > 0) {
                findings.push({
                    id: 'table-th-no-scope',
                    severity: 'info',
                    title: '<th> ohne scope in komplexer Tabelle',
                    message: 'Bei Tabellen mit Zeilen- und Spaltenköpfen sollten alle <th> ein scope="row" oder scope="col" haben.',
                    element: thsWithoutScope[0] as HTMLElement,
                    preview: shortHtml(thsWithoutScope[0] as HTMLElement)
                });
            }
        }
    });

    /* --- iframes --- */
    if (rules['iframe-no-title']) {
        const iframes = Array.from(body.querySelectorAll('iframe')) as HTMLElement[];
        iframes.forEach((f) => {
            const title = (f.getAttribute('title') || '').trim();
            if (!title) {
                findings.push({
                    id: 'iframe-no-title',
                    severity: 'warn',
                    title: 'iframe ohne title',
                    message: 'iframes brauchen ein title-Attribut, das den Inhalt für Screenreader beschreibt.',
                    element: f,
                    preview: shortHtml(f)
                });
            }
        });
    }

    // Sortieren: severity, dann Reihenfolge im DOM
    findings.sort((a, b) => {
        const s = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        if (s !== 0) return s;
        const pos = a.element.compareDocumentPosition(b.element);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
    });

    return findings;
}

/* ---------------- UI ---------------- */

function renderReportHtml(findings: Finding[]): string {
    if (findings.length === 0) {
        return (
            `<div class="for-a11y-report for-a11y-report--ok">` +
                `<p><strong>✓ Keine Probleme gefunden.</strong></p>` +
                `<p>Der geprüfte Inhalt ist nach den aktivierten Regeln barrierefrei.</p>` +
            `</div>`
        );
    }

    const counts = findings.reduce<Record<Severity, number>>((acc, f) => {
        acc[f.severity] = (acc[f.severity] || 0) + 1;
        return acc;
    }, { error: 0, warn: 0, info: 0 });

    const summary =
        `<p class="for-a11y-report__summary">` +
            `${SEVERITY_ICON.error} <strong>${counts.error}</strong> ${counts.error === 1 ? 'Fehler' : 'Fehler'}, ` +
            `${SEVERITY_ICON.warn} <strong>${counts.warn}</strong> ${counts.warn === 1 ? 'Warnung' : 'Warnungen'}, ` +
            `${SEVERITY_ICON.info} <strong>${counts.info}</strong> ${counts.info === 1 ? 'Hinweis' : 'Hinweise'}` +
        `</p>`;

    const rows = findings.map((f, idx) => (
        `<tr class="for-a11y-row for-a11y-row--${f.severity}" data-a11y-index="${idx}">` +
            `<td class="for-a11y-sev">${SEVERITY_ICON[f.severity]} <span>${SEVERITY_LABEL[f.severity]}</span></td>` +
            `<td class="for-a11y-title"><strong>${escHtml(f.title)}</strong><br><span>${escHtml(f.message)}</span></td>` +
            `<td class="for-a11y-preview"><code>${escHtml(f.preview)}</code></td>` +
            `<td class="for-a11y-action"><button type="button" class="for-a11y-goto" data-a11y-index="${idx}">Anzeigen</button></td>` +
        `</tr>`
    )).join('');

    return (
        `<div class="for-a11y-report">` +
            summary +
            `<table class="for-a11y-table">` +
                `<thead><tr><th>Schwere</th><th>Regel</th><th>Stelle</th><th></th></tr></thead>` +
                `<tbody>${rows}</tbody>` +
            `</table>` +
        `</div>`
    );
}

function escHtml(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const DIALOG_CSS = `
.for-a11y-report { font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.for-a11y-report--ok { padding: 1em; background: #e8f5e9; border-radius: 4px; color: #1b5e20; }
.for-a11y-report__summary { margin: 0 0 .75em; font-size: 13px; }
.for-a11y-table { width: 100%; border-collapse: collapse; }
.for-a11y-table th { text-align: left; font-weight: 600; padding: 6px 8px; border-bottom: 1px solid #ddd; background: #f6f6f6; }
.for-a11y-table td { padding: 8px; vertical-align: top; border-bottom: 1px solid #eee; }
.for-a11y-row--error { background: #fff5f5; }
.for-a11y-row--warn  { background: #fffbea; }
.for-a11y-row--info  { background: #f0f7ff; }
.for-a11y-sev { white-space: nowrap; font-weight: 600; }
.for-a11y-preview code { display: block; font-size: 11px; background: #fafafa; padding: 4px 6px; border-radius: 3px; white-space: pre-wrap; word-break: break-all; }
.for-a11y-goto { padding: 4px 10px; border: 1px solid #ccc; background: #fff; border-radius: 3px; cursor: pointer; font-size: 12px; }
.for-a11y-goto:hover { background: #f0f0f0; }
`;

/** In den Editor-IFrame injizierte Marker-Styles. Werden nur hinzugefügt, solange der Report-Dialog offen ist. */
const EDITOR_MARKER_CSS = `
[data-a11y-mark] {
    outline-offset: 2px !important;
    transition: outline-color .15s ease, box-shadow .15s ease !important;
}
[data-a11y-mark="error"] {
    outline: 2px solid #e53935 !important;
    box-shadow: 0 0 0 4px rgba(229, 57, 53, .15) !important;
}
[data-a11y-mark="warn"] {
    outline: 2px solid #fb8c00 !important;
    box-shadow: 0 0 0 4px rgba(251, 140, 0, .15) !important;
}
[data-a11y-mark="info"] {
    outline: 2px dashed #1e88e5 !important;
    box-shadow: 0 0 0 4px rgba(30, 136, 229, .10) !important;
}
[data-a11y-mark-active="1"] {
    outline-width: 3px !important;
    box-shadow: 0 0 0 6px rgba(255, 152, 0, .25) !important;
    animation: for-a11y-pulse 1s ease-in-out 0s 2;
}
@keyframes for-a11y-pulse {
    0%, 100% { outline-color: #ff9800; }
    50% { outline-color: #ffc107; }
}
`;

let markerStyleInjected = false;
let activeFindings: Finding[] = [];

/** Fügt die Marker-CSS-Regeln einmalig in den Editor-IFrame ein. */
function ensureMarkerStyle(editor: any): void {
    if (markerStyleInjected) return;
    try {
        editor.dom.addStyle(EDITOR_MARKER_CSS);
        markerStyleInjected = true;
    } catch (_e) { /* noop */ }
}

/** Setzt `data-a11y-mark` auf allen Befund-Elementen. Gleiches Element mit mehreren
 *  Befunden bekommt die höchste Schwere (error > warn > info). */
function applyMarkers(editor: any, findings: Finding[]): void {
    ensureMarkerStyle(editor);
    clearMarkers(editor); // evtl. vorherige zuerst entfernen
    activeFindings = findings.slice();

    // Pro Element die höchste Schwere bestimmen
    const map = new Map<HTMLElement, Severity>();
    findings.forEach((f) => {
        if (!f.element || !f.element.isConnected) return;
        const cur = map.get(f.element);
        if (!cur || SEVERITY_ORDER[f.severity] < SEVERITY_ORDER[cur]) {
            map.set(f.element, f.severity);
        }
    });
    map.forEach((sev, el) => {
        el.setAttribute('data-a11y-mark', sev);
    });
}

/** Entfernt alle Marker-Attribute aus dem Editor-Body. */
function clearMarkers(editor: any): void {
    try {
        const body = editor.getBody();
        if (!body) return;
        const marked = body.querySelectorAll('[data-a11y-mark], [data-a11y-mark-active]');
        marked.forEach((el: Element) => {
            el.removeAttribute('data-a11y-mark');
            el.removeAttribute('data-a11y-mark-active');
        });
    } catch (_e) { /* noop */ }
    activeFindings = [];
}

/** Hebt ein einzelnes Element temporär hervor (Pulse-Animation + „active"-Marker). */
function pulseActive(el: HTMLElement): void {
    // andere „active"-Marker entfernen
    const doc = el.ownerDocument;
    if (doc) {
        doc.querySelectorAll('[data-a11y-mark-active]').forEach((n) => n.removeAttribute('data-a11y-mark-active'));
    }
    el.setAttribute('data-a11y-mark-active', '1');
    setTimeout(() => {
        if (el.getAttribute('data-a11y-mark-active') === '1') {
            el.removeAttribute('data-a11y-mark-active');
        }
    }, 2000);
}

function highlightElement(editor: any, el: HTMLElement): void {
    try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (_e) { /* noop */ }
    try {
        editor.selection.select(el);
        editor.nodeChanged();
        editor.focus();
    } catch (_e) { /* noop */ }

    // Pulse-Highlight (Marker-Attribut, CSS-Animation)
    pulseActive(el);
}

function openReportDialog(editor: any, findings: Finding[]): void {
    // Persistent markieren, solange der Dialog offen ist
    applyMarkers(editor, findings);

    const html = `<style>${DIALOG_CSS}</style>` + renderReportHtml(findings);
    const dlg = editor.windowManager.open({
        title: 'Accessibility-Check',
        size: 'large',
        body: {
            type: 'panel',
            items: [{ type: 'htmlpanel', html }]
        },
        buttons: [
            { type: 'custom', name: 'recheck', text: 'Erneut prüfen' },
            { type: 'cancel', text: 'Schließen', primary: true }
        ],
        onAction: (api: any, details: any) => {
            if (details.name === 'recheck') {
                api.close();
                // onClose entfernt die alten Marker, runAndShow setzt neue.
                runAndShow(editor);
            }
        },
        onClose: () => {
            clearMarkers(editor);
        }
    });

    // Klick-Delegation auf die "Anzeigen"-Buttons – erst nach dem Rendern des Dialogs verfügbar
    setTimeout(() => {
        const root = document.querySelector('.tox-dialog .for-a11y-report');
        if (!root) return;
        root.addEventListener('click', (ev) => {
            const btn = (ev.target as HTMLElement).closest('.for-a11y-goto') as HTMLElement | null;
            if (!btn) return;
            const idx = parseInt(btn.getAttribute('data-a11y-index') || '-1', 10);
            if (idx < 0 || idx >= findings.length) return;
            const f = findings[idx];
            if (f.element && f.element.isConnected) {
                highlightElement(editor, f.element);
            }
        });
    }, 100);
}

function runAndShow(editor: any): void {
    const body = editor.getBody();
    if (!body) return;
    const findings = runAudit(body as HTMLElement, editor);
    openReportDialog(editor, findings);
}

/* ==================================================================
 *  Plugin
 * ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('for_a11y', (editor: any) => {

        editor.addCommand('forA11yCheck', () => runAndShow(editor));

        // Beim Neusetzen von Content / Undo-Restore etwaige Marker-Reste entfernen
        editor.on('SetContent Undo Redo', () => {
            clearMarkers(editor);
        });
        editor.on('remove', () => {
            clearMarkers(editor);
        });

        editor.ui.registry.addIcon('for-a11y-icon',
            '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>'
        );

        editor.ui.registry.addButton('for_a11y', {
            icon: 'for-a11y-icon',
            tooltip: 'Barrierefreiheit prüfen',
            onAction: () => editor.execCommand('forA11yCheck')
        });

        editor.ui.registry.addMenuItem('for_a11y', {
            icon: 'for-a11y-icon',
            text: 'Barrierefreiheit prüfen…',
            onAction: () => editor.execCommand('forA11yCheck')
        });
    });
};

export default Plugin;
