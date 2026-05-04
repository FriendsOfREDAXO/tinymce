/* ==================================================================
 *  for_a11y plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  On-Demand Accessibility-Check des aktuellen Editor-Inhalts.
 *
 *  Regeln (per Option `a11y_rules` einzeln abschaltbar):
 *    img-missing-alt        – <img> ohne alt-Attribut               (error)
 *    img-alt-in-text-link   – nicht-leeres alt, obwohl Link-Text da  (warn)
 *    img-empty-alt-nondeco  – alt="" ohne Link-Text-Kontext          (warn)
 *    img-alt-too-long       – alt > 150 Zeichen                      (warn)
 *    img-alt-filename       – alt sieht wie Dateiname aus            (warn)
 *    img-alt-redundant      – alt beginnt mit „Bild von …" etc.      (info)
 *    link-generic-text      – "hier", "weiterlesen", "klick hier"…  (warn)
 *    link-no-accname        – <a> ohne erkennbaren accessible name  (error)
 *    link-new-window        – target="_blank" ohne Hinweis          (info)
 *    link-raw-url           – Linktext ist eine URL                 (warn)
 *    link-duplicate-text    – gleicher Linktext, anderes Ziel       (info)
 *    link-file-no-format    – PDF/Doc-Link ohne Format-Hinweis      (info)
 *    heading-empty          – leere Überschrift                     (warn)
 *    heading-skip           – Heading-Hierarchie-Sprung             (warn)
 *    heading-allcaps        – Überschrift komplett in VERSALIEN     (warn)
 *    text-bold-as-heading   – fetter Absatz als Pseudo-Überschrift  (warn)
 *    list-fake              – Absatz beginnt wie Listeneintrag      (info)
 *    list-single-item       – Liste mit nur einem Eintrag           (info)
 *    blank-paragraphs       – mehrere leere Absätze hintereinander  (info)
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
    'img-alt-too-long':      true,
    'img-alt-filename':      true,
    'img-alt-redundant':     true,
    'link-generic-text':     true,
    'link-no-accname':       true,
    'link-new-window':       true,
    'link-raw-url':          true,
    'link-duplicate-text':   true,
    'link-file-no-format':   true,
    'heading-empty':         true,
    'heading-skip':          true,
    'heading-allcaps':       true,
    'text-bold-as-heading':  true,
    'list-fake':             true,
    'list-single-item':      true,
    'blank-paragraphs':      true,
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

        // Nur prüfen, wenn alt gefüllt (leerer + fehlender alt wird oben abgehandelt)
        const altTrim = alt.trim();
        if (hasAlt && altTrim.length > 0) {
            // Zu langer alt-Text
            if (rules['img-alt-too-long'] && altTrim.length > 150) {
                findings.push({
                    id: 'img-alt-too-long',
                    severity: 'warn',
                    title: `alt-Text zu lang (${altTrim.length} Zeichen)`,
                    message: 'Halte alt-Texte prägnant (Faustregel: < 150 Zeichen). Sehr lange Beschreibungen gehören in den Fließtext oder in eine Bildunterschrift.',
                    element: img,
                    preview: shortHtml(img)
                });
            }
            // alt = Dateiname: IMG_1234.jpg, DSC00012, bild-001.png, screenshot-2024-01-01.jpg …
            if (rules['img-alt-filename'] && /^(img[_-]?\d+|dsc[_-]?\d+|dscn?\d+|p\d{6,}|screenshot[\s_-]|bild[_\s-]?\d+|foto[_\s-]?\d+|image[_\s-]?\d+|[a-z0-9_-]+\.(jpe?g|png|gif|webp|svg|avif))$/i.test(altTrim)) {
                findings.push({
                    id: 'img-alt-filename',
                    severity: 'warn',
                    title: 'alt-Text sieht wie ein Dateiname aus',
                    message: `Der alt-Text „${truncate(altTrim, 50)}" wirkt wie ein Dateiname. Beschreibe stattdessen, was auf dem Bild zu sehen ist.`,
                    element: img,
                    preview: shortHtml(img)
                });
            }
            // Redundante Präfixe: „Bild von …", „Foto von …", „Grafik mit …"
            if (rules['img-alt-redundant'] && /^(bild|foto|grafik|abbildung|image|picture|photo)\s+(von|mit|eines?|einer|der|des|the|of)\b/i.test(altTrim)) {
                findings.push({
                    id: 'img-alt-redundant',
                    severity: 'info',
                    title: 'Redundanter Präfix im alt-Text',
                    message: `Screenreader kündigen Bilder bereits als „Grafik" an. Ein Präfix wie „Bild von …" ist doppelt. Entferne ihn im Bild-Dialog.`,
                    element: img,
                    preview: shortHtml(img)
                });
            }
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

        // Linktext ist eine URL
        if (rules['link-raw-url'] && text && /^(https?:\/\/|www\.)\S+$/i.test(text)) {
            findings.push({
                id: 'link-raw-url',
                severity: 'warn',
                title: 'URL als Linktext',
                message: 'Screenreader lesen URLs Zeichen für Zeichen vor. Ersetze den Linktext durch eine kurze Beschreibung des Ziels (z. B. „Pressemitteilung vom 12.3.2024").',
                element: a,
                preview: shortHtml(a)
            });
        }

        // Link auf Datei (PDF/DOC/XLS/ZIP) ohne Format-Hinweis im Linktext
        if (rules['link-file-no-format'] && text) {
            const href = (a.getAttribute('href') || '').toLowerCase();
            const m = href.match(/\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|zip|rar|7z|epub|csv)(?:$|[?#])/);
            if (m) {
                const fmt = m[1].toUpperCase().replace(/^DOCX?$/, 'DOC').replace(/^XLSX?$/, 'XLS').replace(/^PPTX?$/, 'PPT');
                // Erwähnt der Linktext/aria-label/title das Format?
                const aria = (a.getAttribute('aria-label') || '') + ' ' + (a.getAttribute('title') || '');
                const haystack = (text + ' ' + aria).toLowerCase();
                if (haystack.indexOf(fmt.toLowerCase()) === -1 && haystack.indexOf(m[1].toLowerCase()) === -1) {
                    findings.push({
                        id: 'link-file-no-format',
                        severity: 'info',
                        title: `Download-Link ohne Format-Hinweis (${fmt})`,
                        message: `Der Link zeigt auf eine .${m[1]}-Datei. Ergänze das Format im Linktext (z. B. „Jahresbericht 2023 (${fmt})"), damit Nutzer:innen wissen, was sie herunterladen.`,
                        element: a,
                        preview: shortHtml(a)
                    });
                }
            }
        }
    });

    // Duplikate: gleicher Linktext, verschiedene href → irritiert Screenreader-Linkliste
    if (rules['link-duplicate-text']) {
        const textMap = new Map<string, Set<string>>();
        const firstEl = new Map<string, HTMLAnchorElement>();
        links.forEach((a) => {
            const t = (a.textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
            const href = (a.getAttribute('href') || '').trim();
            if (!t || !href) return;
            if (!textMap.has(t)) {
                textMap.set(t, new Set());
                firstEl.set(t, a);
            }
            textMap.get(t)!.add(href);
        });
        textMap.forEach((hrefs, t) => {
            if (hrefs.size > 1) {
                const a = firstEl.get(t)!;
                findings.push({
                    id: 'link-duplicate-text',
                    severity: 'info',
                    title: `Gleicher Linktext – ${hrefs.size} verschiedene Ziele`,
                    message: `Der Linktext „${truncate(t, 40)}" zeigt an ${hrefs.size} Stellen auf unterschiedliche Seiten. Formuliere die Linktexte so, dass sie auch aus dem Kontext gerissen eindeutig sind.`,
                    element: a,
                    preview: shortHtml(a)
                });
            }
        });
    }

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
        // Überschrift komplett in Großbuchstaben eingetippt
        if (rules['heading-allcaps']) {
            const txt = (h.textContent || '').trim();
            const letters = txt.replace(/[^\p{L}]/gu, '');
            if (letters.length >= 6 && letters === letters.toUpperCase() && letters !== letters.toLowerCase()) {
                findings.push({
                    id: 'heading-allcaps',
                    severity: 'warn',
                    title: `${h.tagName} komplett in VERSALIEN`,
                    message: 'Schreibe die Überschrift in normaler Gross-/Kleinschreibung. Großbuchstaben werden von manchen Screenreadern Buchstabe für Buchstabe vorgelesen. Für eine Versalien-Optik nutze besser CSS (`text-transform: uppercase`) im Frontend.',
                    element: h,
                    preview: shortHtml(h)
                });
            }
        }
        prevLevel = level;
    });

    /* --- Absätze / Pseudo-Überschriften / Fake-Listen / Leer-Absätze --- */
    if (rules['text-bold-as-heading'] || rules['list-fake'] || rules['blank-paragraphs']) {
        const paragraphs = Array.from(body.querySelectorAll('p')) as HTMLElement[];
        let blankRun: HTMLElement[] = [];
        const flushBlankRun = () => {
            if (rules['blank-paragraphs'] && blankRun.length >= 2) {
                findings.push({
                    id: 'blank-paragraphs',
                    severity: 'info',
                    title: `${blankRun.length} leere Absätze hintereinander`,
                    message: 'Leere Absätze werden von Screenreadern als „leer" angekündigt. Entferne sie und erzeuge Abstände lieber über CSS (margin) statt <p>&nbsp;</p>.',
                    element: blankRun[0],
                    preview: shortHtml(blankRun[0])
                });
            }
            blankRun = [];
        };
        paragraphs.forEach((p) => {
            const plain = (p.textContent || '').replace(/\u00A0/g, ' ').trim();

            // Leerer Absatz?
            if (plain.length === 0) {
                blankRun.push(p);
                return;
            }
            flushBlankRun();

            // Fetter Pseudo-Heading: ganzer Absatz ist strong/b, Text kurz, kein Fließtext
            if (rules['text-bold-as-heading'] && plain.length <= 120) {
                const hasNonBoldText = Array.from(p.childNodes).some((n) => {
                    if (n.nodeType === 3) return (n.nodeValue || '').trim().length > 0;
                    if (n.nodeType !== 1) return false;
                    const el = n as Element;
                    const tag = el.tagName.toLowerCase();
                    if (tag === 'strong' || tag === 'b') return false;
                    // br, wbr etc. ignorieren
                    if (tag === 'br' || tag === 'wbr') return false;
                    return (el.textContent || '').trim().length > 0;
                });
                if (!hasNonBoldText && p.querySelector('strong, b') && !/[.!?…]$/.test(plain)) {
                    findings.push({
                        id: 'text-bold-as-heading',
                        severity: 'warn',
                        title: 'Fetter Absatz als Pseudo-Überschrift',
                        message: 'Ein fett gesetzter Absatz ohne Satzzeichen wirkt wie eine Überschrift, ist für Screenreader aber Fließtext. Markiere den Absatz und wandle ihn über das Format-/Block-Dropdown in eine echte Überschrift (h2/h3/…) um.',
                        element: p,
                        preview: shortHtml(p)
                    });
                }
            }

            // Fake-Liste: Absatz beginnt mit Aufzählungs-Zeichen
            if (rules['list-fake'] && /^\s*([-*•·●○►▶→]|\d{1,2}[.\)]|[a-z][.\)])\s+/i.test(plain)) {
                // in echter Liste drin? dann ok
                if (!p.closest('ul, ol')) {
                    findings.push({
                        id: 'list-fake',
                        severity: 'info',
                        title: 'Absatz beginnt wie ein Listeneintrag',
                        message: 'Der Absatz beginnt mit „-", „*", „•" oder einer Nummerierung. Markiere ihn und nutze den Listen-Button (Aufzählung/Nummerierung), damit Screenreader die Liste als solche erkennen.',
                        element: p,
                        preview: shortHtml(p)
                    });
                }
            }
        });
        flushBlankRun();
    }

    /* --- Listen: nur ein Eintrag → meist keine echte Liste --- */
    if (rules['list-single-item']) {
        const lists = Array.from(body.querySelectorAll('ul, ol')) as HTMLElement[];
        lists.forEach((l) => {
            // Nested-Lists ausschließen (innerste Ebene zählen wir nur, wenn sie alleine stehen)
            const items = Array.from(l.children).filter((c) => c.tagName.toLowerCase() === 'li');
            if (items.length === 1) {
                findings.push({
                    id: 'list-single-item',
                    severity: 'info',
                    title: `${l.tagName.toLowerCase()}-Liste mit nur einem Eintrag`,
                    message: 'Eine Liste mit einem einzigen Eintrag ist semantisch unnötig. Wandle sie in einen normalen Absatz um oder ergänze weitere Punkte.',
                    element: l,
                    preview: shortHtml(l)
                });
            }
        });
    }

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

function escHtml(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const DIALOG_CSS = `
.for-a11y-panel {
    position: fixed;
    z-index: 1300;
    width: 420px; max-width: calc(100vw - 20px);
    background: #fff; color: #222;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,.2), 0 2px 6px rgba(0,0,0,.1);
    font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex; flex-direction: column;
    user-select: none;
}
.for-a11y-panel__drag {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #e91e63, #9c27b0);
    color: #fff;
    border-top-left-radius: 8px; border-top-right-radius: 8px;
    cursor: move;
    font-weight: 600; font-size: 12px;
    letter-spacing: .3px;
}
.for-a11y-panel__drag-grip { opacity: .7; font-size: 14px; line-height: 1; }
.for-a11y-panel__drag-title { flex: 1 1 auto; }
.for-a11y-panel__close { background: transparent; border: 0; color: #fff; cursor: pointer; font-size: 16px; padding: 0 4px; line-height: 1; opacity: .85; }
.for-a11y-panel__close:hover { opacity: 1; }
.for-a11y-panel__body {
    padding: 14px 16px;
    user-select: text;
    max-height: 50vh; overflow: auto;
}
.for-a11y-panel__foot {
    padding: 8px 12px;
    border-top: 1px solid #eee;
    display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
    background: #fafafa;
    border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;
}
.for-a11y-panel__foot .for-a11y-btn { font: inherit; padding: 6px 12px; border: 1px solid #d0d0d0; background: #fff; color: #222; border-radius: 4px; cursor: pointer; font-size: 13px; line-height: 1.2; }
.for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #f0f0f0; }
.for-a11y-panel__foot .for-a11y-btn:disabled { opacity: .4; cursor: not-allowed; }
.for-a11y-panel__foot .for-a11y-btn--nav { min-width: 36px; padding: 6px 10px; }
.for-a11y-panel__foot .for-a11y-btn--primary { background: #1976d2; color: #fff; border-color: #1976d2; }
.for-a11y-panel__foot .for-a11y-btn--primary:hover:not(:disabled) { background: #1565c0; border-color: #1565c0; }
.for-a11y-panel__foot .for-a11y-spacer { flex: 1 1 auto; }

.for-a11y-dlg { color: inherit; }
.for-a11y-dlg__progress { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .6; margin-bottom: 10px; }
.for-a11y-dlg__head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.for-a11y-dlg__badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
    padding: 4px 10px; border-radius: 999px;
}
.for-a11y-dlg__badge--error { background: rgba(229, 57, 53, .12); color: #c62828; }
.for-a11y-dlg__badge--warn  { background: rgba(251, 140, 0, .14); color: #ef6c00; }
.for-a11y-dlg__badge--info  { background: rgba(30, 136, 229, .12); color: #1565c0; }
.for-a11y-dlg__title { margin: 0; font-size: 15px; font-weight: 600; flex: 1 1 auto; min-width: 0; }
.for-a11y-dlg__rule { font-size: 10px; opacity: .5; font-family: Menlo, Consolas, monospace; }

.for-a11y-dlg__msg { margin: 0 0 12px; font-size: 13px; line-height: 1.55; }
.for-a11y-dlg__preview-label { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .6; margin-bottom: 4px; }
.for-a11y-dlg__preview { margin: 0; font-family: Menlo, Consolas, monospace; font-size: 11px; background: #f6f6f6; color: #222; font-style: normal; padding: 8px 10px; border-radius: 4px; white-space: pre-wrap; word-break: break-all; border-left: 3px solid #bbb; }
.for-a11y-dlg__preview--error { border-left-color: #e53935; }
.for-a11y-dlg__preview--warn  { border-left-color: #fb8c00; }
.for-a11y-dlg__preview--info  { border-left-color: #1e88e5; }

.for-a11y-dlg--ok { text-align: center; padding: 20px 0; }
.for-a11y-dlg--ok .for-a11y-dlg__icon { font-size: 40px; color: #4caf50; margin-bottom: 8px; }
.for-a11y-dlg--ok h3 { margin: 0 0 4px; font-size: 16px; font-weight: 600; }
.for-a11y-dlg--ok p { margin: 0; opacity: .7; font-size: 12px; }

/* dark mode */
body.rex-theme-dark .for-a11y-panel,
body.tox-dialog__body-iframe-dark .for-a11y-panel { background: #2d2d2d; color: #eee; }
body.rex-theme-dark .for-a11y-panel__foot { background: #222; border-top-color: #3a3a3a; }
body.rex-theme-dark .for-a11y-panel__foot .for-a11y-btn { background: #3a3a3a; color: #eee; border-color: #4a4a4a; }
body.rex-theme-dark .for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #4a4a4a; }
body.rex-theme-dark .for-a11y-dlg__preview { background: #222; color: #eee; }
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel { background: #2d2d2d; color: #eee; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot { background: #222; border-top-color: #3a3a3a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn { background: #3a3a3a; color: #eee; border-color: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-panel__foot .for-a11y-btn:hover:not(:disabled) { background: #4a4a4a; }
    body.rex-has-theme:not(.rex-theme-light) .for-a11y-dlg__preview { background: #222; color: #eee; }
}
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

const markerStyleEditors = new Set<string>();
const activePanels = new Map<string, HTMLElement>();

function getEditorStateKey(editor: any): string {
    return String(editor?.id || editor?.targetElm?.id || 'default');
}

/** Fügt die Marker-CSS-Regeln einmalig in den Editor-IFrame ein. */
function ensureMarkerStyle(editor: any): void {
    const editorKey = getEditorStateKey(editor);
    if (markerStyleEditors.has(editorKey)) return;
    try {
        editor.dom.addStyle(EDITOR_MARKER_CSS);
        markerStyleEditors.add(editorKey);
    } catch (_e) { /* noop */ }
}

/** Setzt `data-a11y-mark` auf allen Befund-Elementen. Gleiches Element mit mehreren
 *  Befunden bekommt die höchste Schwere (error > warn > info). */
function applyMarkers(editor: any, findings: Finding[]): void {
    ensureMarkerStyle(editor);
    clearMarkers(editor); // evtl. vorherige zuerst entfernen

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

let styleInjected = false;
function ensurePanelStyle(): void {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.id = 'for-a11y-panel-style';
    style.textContent = DIALOG_CSS;
    document.head.appendChild(style);
    styleInjected = true;
}

function openReportDialog(editor: any, findings: Finding[]): void {
    // Schwebendes, draggbares Panel – KEIN Modal-Backdrop, KEIN Overlay.
    // Element bleibt sichtbar, Panel kann verschoben werden.
    const editorKey = getEditorStateKey(editor);
    const existingPanel = activePanels.get(editorKey);
    if (existingPanel) {
        try { existingPanel.remove(); } catch (_e) { /* noop */ }
        activePanels.delete(editorKey);
    }
    ensurePanelStyle();

    let remaining = findings.slice();
    let currentIndex = 0;

    const fireEvent = (name: string, data?: any) => {
        try { editor.fire(name, data || {}); } catch (_e) { /* noop */ }
    };

    const panel = document.createElement('div');
    panel.className = 'for-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Barrierefreiheits-Check');

    // Initial-Position: rechts-unten im Viewport, sodass der Editor-Content meist sichtbar bleibt.
    panel.style.right = '24px';
    panel.style.bottom = '24px';

    const onResize = () => {
        if (!panel.isConnected) return;
        const r = panel.getBoundingClientRect();
        if (r.right > window.innerWidth) panel.style.left = Math.max(4, window.innerWidth - panel.offsetWidth - 4) + 'px';
        if (r.bottom > window.innerHeight) panel.style.top = Math.max(4, window.innerHeight - panel.offsetHeight - 4) + 'px';
    };

    const closePanel = () => {
        window.removeEventListener('resize', onResize);
        try { panel.remove(); } catch (_e) { /* noop */ }
        if (activePanels.get(editorKey) === panel) {
            activePanels.delete(editorKey);
        }
        clearMarkers(editor);
        fireEvent('A11ycheckStop');
    };

    const renderBodyHtml = (): string => {
        if (remaining.length === 0) {
            return `<div class="for-a11y-dlg for-a11y-dlg--ok">` +
                `<div class="for-a11y-dlg__icon">✓</div>` +
                `<h3>Keine Probleme gefunden</h3>` +
                `<p>Der Inhalt ist nach den aktivierten Regeln barrierefrei.</p>` +
            `</div>`;
        }
        const f = remaining[currentIndex];
        return `<div class="for-a11y-dlg">` +
            `<div class="for-a11y-dlg__progress">Befund ${currentIndex + 1} von ${remaining.length}</div>` +
            `<div class="for-a11y-dlg__head">` +
                `<span class="for-a11y-dlg__badge for-a11y-dlg__badge--${f.severity}">` +
                    `${SEVERITY_ICON[f.severity]} ${escHtml(SEVERITY_LABEL[f.severity])}` +
                `</span>` +
                `<h3 class="for-a11y-dlg__title">${escHtml(f.title)}</h3>` +
                `<span class="for-a11y-dlg__rule">${escHtml(f.id)}</span>` +
            `</div>` +
            `<p class="for-a11y-dlg__msg">${escHtml(f.message)}</p>` +
            `<div class="for-a11y-dlg__preview-label">Betroffenes Element</div>` +
            `<pre class="for-a11y-dlg__preview for-a11y-dlg__preview--${f.severity}">${escHtml(f.preview)}</pre>` +
        `</div>`;
    };

    const render = () => {
        const hasCurrent = remaining.length > 0;
        panel.innerHTML =
            `<div class="for-a11y-panel__drag" data-role="drag">` +
                `<span class="for-a11y-panel__drag-grip" aria-hidden="true">⠿</span>` +
                `<span class="for-a11y-panel__drag-title">Barrierefreiheits-Check</span>` +
                `<button type="button" class="for-a11y-panel__close" data-act="close" aria-label="Schließen" title="Schließen">✕</button>` +
            `</div>` +
            `<div class="for-a11y-panel__body">${renderBodyHtml()}</div>` +
            `<div class="for-a11y-panel__foot">` +
                (hasCurrent ? (
                    `<button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="prev" ${currentIndex <= 0 ? 'disabled' : ''} title="Vorheriger Befund">◀</button>` +
                    `<button type="button" class="for-a11y-btn for-a11y-btn--nav" data-act="next" ${currentIndex >= remaining.length - 1 ? 'disabled' : ''} title="Nächster Befund">▶</button>` +
                    `<button type="button" class="for-a11y-btn" data-act="ignore">Ignorieren</button>` +
                    `<button type="button" class="for-a11y-btn for-a11y-btn--primary" data-act="edit">Element bearbeiten</button>`
                ) : '') +
                `<span class="for-a11y-spacer"></span>` +
                `<button type="button" class="for-a11y-btn" data-act="recheck">Neu prüfen</button>` +
            `</div>`;
    };

    const focusCurrent = () => {
        const curr = remaining[currentIndex];
        if (curr && curr.element && curr.element.isConnected) {
            try { curr.element.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_e) { /* noop */ }
            pulseActive(curr.element);
        }
    };

    // Klick-Delegation
    panel.addEventListener('click', (ev) => {
        const t = (ev.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
        if (!t) return;
        const act = t.getAttribute('data-act');
        const curr = remaining[currentIndex];
        switch (act) {
            case 'close': closePanel(); return;
            case 'prev':
                if (currentIndex > 0) currentIndex--;
                break;
            case 'next':
                if (currentIndex < remaining.length - 1) currentIndex++;
                break;
            case 'ignore':
                if (curr) {
                    fireEvent('A11ycheckIgnore', { issue: curr });
                    remaining.splice(currentIndex, 1);
                    if (currentIndex >= remaining.length) currentIndex = Math.max(0, remaining.length - 1);
                    applyMarkers(editor, remaining);
                }
                break;
            case 'edit':
                if (curr && curr.element && curr.element.isConnected) {
                    highlightElement(editor, curr.element);
                    closePanel();
                    return;
                }
                break;
            case 'recheck':
                remaining = runAudit(editor.getBody() as HTMLElement, editor);
                currentIndex = 0;
                applyMarkers(editor, remaining);
                break;
        }
        render();
        focusCurrent();
    });

    // Drag – Panel per Header-Balken verschieben.
    const onDragStart = (ev: MouseEvent) => {
        const handle = (ev.target as HTMLElement).closest('[data-role="drag"]');
        if (!handle) return;
        if ((ev.target as HTMLElement).closest('[data-act="close"]')) return;
        ev.preventDefault();
        const rect = panel.getBoundingClientRect();
        const offX = ev.clientX - rect.left;
        const offY = ev.clientY - rect.top;
        // Von right/bottom auf left/top umstellen, damit Drag eindeutig ist.
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.left = rect.left + 'px';
        panel.style.top = rect.top + 'px';

        const onMove = (e: MouseEvent) => {
            const maxX = window.innerWidth - panel.offsetWidth - 4;
            const maxY = window.innerHeight - panel.offsetHeight - 4;
            const nx = Math.max(4, Math.min(maxX, e.clientX - offX));
            const ny = Math.max(4, Math.min(maxY, e.clientY - offY));
            panel.style.left = nx + 'px';
            panel.style.top = ny + 'px';
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };
    panel.addEventListener('mousedown', onDragStart);

    // Reposition bei Viewport-Resize, falls das Panel sonst rausläuft.
    window.addEventListener('resize', onResize);

    // Auto-Close wenn Editor entfernt wird.
    editor.once('remove', closePanel);

    render();
    document.body.appendChild(panel);
    activePanels.set(editorKey, panel);

    applyMarkers(editor, remaining);
    fireEvent('A11ycheckStart', { total: remaining.length });
    setTimeout(focusCurrent, 80);
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

        /* Public API – vergleichbar mit dem kommerziellen a11ychecker.
         * Verwendung:
         *   tinymce.activeEditor.plugins.for_a11y.toggleaudit();
         *   const issues = tinymce.activeEditor.plugins.for_a11y.getReport();
         */
        return {
            toggleaudit: () => {
                runAndShow(editor);
            },
            getReport: (): Array<{ id: string; severity: Severity; title: string; message: string; element: HTMLElement; preview: string }> => {
                const body = editor.getBody();
                if (!body) return [];
                return runAudit(body as HTMLElement, editor);
            }
        };
    });
};

export default Plugin;
