/* ==================================================================
 *  oEmbed plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  YouTube & Vimeo per URL-Paste einfügen, mit Live-Vorschau im
 *  Editor. CKEditor-5-kompatibles Save-Format:
 *
 *      <figure class="media"><oembed url="…"></oembed></figure>
 *
 *  Im Editor wird das beim Laden in eine klickbare iframe-Vorschau
 *  umgewandelt (contenteditable=false, Overlay gegen Klick-Klau),
 *  beim Speichern (GetContent) wieder in das <oembed>-Format.
 *
 *  Im Frontend entweder den mitgelieferten Helper
 *      assets/js/for_oembed.js
 *  einbinden oder serverseitig parsen.
 *
 *  Toolbar:  for_oembed
 *  Menü:     for_oembed
 *  Commands: forOembedInsert, forOembedEdit
 * ================================================================== */

declare const tinymce: any;

type ProviderKey = 'youtube' | 'vimeo';

interface ProviderMatch {
    provider: ProviderKey;
    id: string;
    embedSrc: string; // iframe src (Preview + Frontend-Helper)
    canonicalUrl: string; // wird in oembed url= abgelegt
    allow: string;
    poster?: string; // Vorschau-Bild für Editor
    suggestedRatio?: string; // z.B. "9:16" für Shorts, sonst 16:9
}

interface Preset { label: string; value: string; }

/** Interne Marker, die beim Speichern entfernt werden. */
const INTERNAL_CLASSES = ['for-oembed', 'for-oembed--youtube', 'for-oembed--vimeo'];

/** Default-Presets für Seitenverhältnis (überschreibbar via `oembedratio_presets`). */
const DEFAULT_RATIO_PRESETS: Preset[] = [
    { label: '16:9 (Querformat)', value: '' }, // default, keine Klasse
    { label: '4:3',              value: 'for-oembed--ratio-4-3' },
    { label: '1:1 (Quadrat)',    value: 'for-oembed--ratio-1-1' },
    { label: '9:16 (Hochkant)',  value: 'for-oembed--ratio-9-16' },
    { label: '21:9 (Cinemascope)', value: 'for-oembed--ratio-21-9' }
];

/** Ordnet `suggestedRatio` (z.B. "9:16") einer Preset-Klasse zu. */
const RATIO_TO_CLASS: Record<string, string> = {
    '16:9': '',
    '4:3': 'for-oembed--ratio-4-3',
    '1:1': 'for-oembed--ratio-1-1',
    '9:16': 'for-oembed--ratio-9-16',
    '21:9': 'for-oembed--ratio-21-9'
};

/** Default-Presets für Breite (werden durch Profil-Option `oembedwidth_presets` überschrieben). */
const DEFAULT_WIDTH_PRESETS: Preset[] = [
    { label: 'Original', value: '' },
    { label: 'Klein',    value: 'for-oembed--w-sm' },
    { label: 'Mittel',   value: 'for-oembed--w-md' },
    { label: 'Groß',     value: 'for-oembed--w-lg' },
    { label: 'Volle Breite', value: 'for-oembed--w-full' }
];

/** Default-Presets für Ausrichtung / Textumlauf. */
const DEFAULT_ALIGN_PRESETS: Preset[] = [
    { label: 'Keine',       value: '' },
    { label: 'Links (Umlauf)',  value: 'for-oembed--align-left' },
    { label: 'Zentriert',   value: 'for-oembed--align-center' },
    { label: 'Rechts (Umlauf)', value: 'for-oembed--align-right' }
];

function getPresets(editor: any, option: string, fallback: Preset[]): Preset[] {
    try {
        const raw = editor.getParam(option);
        if (Array.isArray(raw) && raw.length) {
            return raw.map((p: any) => ({
                label: String(p.label ?? p.title ?? p.value ?? p.class ?? ''),
                // Profil-Option nutzt teils `class`, teils `value`
                value: String(p.value ?? p.class ?? '').trim()
            })).filter((p: Preset) => p.label);
        }
    } catch (_e) { /* noop */ }
    return fallback;
}

/** URL → Provider-Erkennung. Erweiterbar um weitere Patterns. */
function parseUrl(url: string): ProviderMatch | null {
    const clean = (url || '').trim();
    if (!clean) return null;

    // YouTube
    const ytPatterns: Array<{ re: RegExp; shorts?: boolean }> = [
        { re: /(?:youtube\.com\/watch\?(?:[^#]*&)*v=([a-zA-Z0-9_-]{6,}))/ },
        { re: /(?:youtu\.be\/([a-zA-Z0-9_-]{6,}))/ },
        { re: /(?:youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,}))/, shorts: true },
        { re: /(?:youtube\.com\/embed\/([a-zA-Z0-9_-]{6,}))/ },
        { re: /(?:youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,}))/ }
    ];
    for (const pat of ytPatterns) {
        const m = clean.match(pat.re);
        if (m) {
            return {
                provider: 'youtube',
                id: m[1],
                // mute=1 für Vorschau & Default-Frontend, damit Autoplay/Click nicht
                // ungewollt Ton produziert.
                embedSrc: `https://www.youtube.com/embed/${m[1]}?mute=1&rel=0`,
                canonicalUrl: pat.shorts
                    ? `https://www.youtube.com/shorts/${m[1]}`
                    : `https://www.youtube.com/watch?v=${m[1]}`,
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                poster: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`,
                suggestedRatio: pat.shorts ? '9:16' : '16:9'
            };
        }
    }

    // Vimeo
    const vimeoPatterns = [
        /(?:vimeo\.com\/(?:video\/)?(\d{5,}))/,
        /(?:player\.vimeo\.com\/video\/(\d{5,}))/
    ];
    for (const re of vimeoPatterns) {
        const m = clean.match(re);
        if (m) {
            return {
                provider: 'vimeo',
                id: m[1],
                embedSrc: `https://player.vimeo.com/video/${m[1]}?muted=1`,
                canonicalUrl: `https://vimeo.com/${m[1]}`,
                allow: 'autoplay; fullscreen; picture-in-picture; clipboard-write'
                // Vimeo-Poster braucht API-Call – wird asynchron nachgeladen.
            };
        }
    }

    return null;
}

/** Liefert die vom User gesetzten (nicht-internen) Klassen einer Figure. */
function extractUserClasses(el: Element | null): string[] {
    if (!el) return [];
    const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
    return cls.filter((c) => c !== 'media' && !INTERNAL_CLASSES.includes(c));
}

/** Preview-Figure fürs Editor-DOM (Poster als img, contenteditable=false). */
function buildPreviewHtml(match: ProviderMatch, userClasses: string[] = []): string {
    const providerClass = `for-oembed--${match.provider}`;
    const providerLabel = match.provider === 'youtube' ? 'YouTube' : 'Vimeo';
    const allClasses = ['media', 'for-oembed', providerClass, ...userClasses].filter(Boolean).join(' ');
    const posterImg = match.poster
        ? `<img class="for-oembed__poster" src="${escapeAttr(match.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer" draggable="false">`
        : '';
    const posterDataAttr = match.poster ? ` data-for-oembed-poster="${escapeAttr(match.poster)}"` : '';
    return (
        `<figure class="${escapeAttr(allClasses)}" contenteditable="false" data-for-oembed-url="${escapeAttr(match.canonicalUrl)}" data-for-oembed-provider="${escapeAttr(match.provider)}" data-for-oembed-id="${escapeAttr(match.id)}"${posterDataAttr}>` +
            `<div class="for-oembed__toolbar" data-for-oembed-toolbar>` +
                `<span class="for-oembed__badge for-oembed__badge--${escapeAttr(match.provider)}">${providerLabel}</span>` +
                `<span class="for-oembed__url" title="${escapeAttr(match.canonicalUrl)}">${escapeAttr(match.canonicalUrl)}</span>` +
                `<button type="button" class="for-oembed__btn for-oembed__btn--stop" data-for-oembed-stop title="Stoppen" aria-label="Stoppen">` +
                    `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="1.5" ry="1.5" fill="currentColor"/></svg>` +
                `</button>` +
                `<button type="button" class="for-oembed__btn for-oembed__btn--handle" data-for-oembed-select title="Video auswählen" aria-label="Video auswählen">` +
                    `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12v2H2zM2 10h12v2H2z" fill="currentColor"/></svg>` +
                `</button>` +
            `</div>` +
            `<div class="for-oembed__ratio">` +
                posterImg +
                `<div class="for-oembed__play" aria-hidden="true">` +
                    `<svg viewBox="0 0 68 48" width="68" height="48" focusable="false"><path d="M66.5 7.7c-.8-2.9-3.1-5.2-6-6C55.3.2 34 .2 34 .2S12.7.2 7.5 1.7C4.6 2.5 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3.1 5.2 6 6C12.7 47.8 34 47.8 34 47.8s21.3 0 26.5-1.5c2.9-.8 5.2-3.1 6-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#212121" fill-opacity=".85"/><path d="M45 24 27 14v20z" fill="#fff"/></svg>` +
                `</div>` +
            `</div>` +
        `</figure>`
    );
}

/** Save-Format (CKE5-kompatibel). User-Klassen bleiben erhalten. */
function buildSaveHtml(canonicalUrl: string, userClasses: string[] = []): string {
    const cls = ['media', ...userClasses].filter(Boolean).join(' ');
    return `<figure class="${escapeAttr(cls)}"><oembed url="${escapeAttr(canonicalUrl)}"></oembed></figure>`;
}

function escapeAttr(v: string): string {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Wandelt <figure class="media"><oembed url="…"></oembed></figure>
 * innerhalb eines Container-Elements in Preview-Figures um.
 */
function expandOembedsInEditor(root: Element): void {
    // Figures mit Oembed-Tags finden
    const figures = Array.from(root.querySelectorAll('figure.media'));
    figures.forEach((fig) => {
        const oembed = fig.querySelector('oembed[url]') as HTMLElement | null;
        if (!oembed) return;
        const url = oembed.getAttribute('url') || '';
        const match = parseUrl(url);
        if (!match) return;
        // User-Klassen (Breite/Ausrichtung) aus Save-figure übernehmen
        const userClasses = extractUserClasses(fig);
        const placeholder = document.createElement('div');
        placeholder.innerHTML = buildPreviewHtml(match, userClasses);
        const preview = placeholder.firstElementChild;
        if (preview && fig.parentNode) {
            fig.parentNode.replaceChild(preview, fig);
        }
    });

    // Lose <oembed>-Tags ohne figure? Auch abfangen.
    const oembeds = Array.from(root.querySelectorAll('oembed[url]'));
    oembeds.forEach((oembed) => {
        if ((oembed.parentElement as HTMLElement | null)?.classList.contains('for-oembed')) return;
        const url = oembed.getAttribute('url') || '';
        const match = parseUrl(url);
        if (!match) return;
        const placeholder = document.createElement('div');
        placeholder.innerHTML = buildPreviewHtml(match);
        const preview = placeholder.firstElementChild;
        if (preview && oembed.parentNode) {
            oembed.parentNode.replaceChild(preview, oembed);
        }
    });
}

/**
 * Ersetzt im HTML-String (GetContent) alle Preview-Figures
 * wieder durch das CKE5-kompatible oembed-Format.
 */
function collapsePreviewsInHtml(html: string): string {
    if (!html || html.indexOf('for-oembed') === -1) return html;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    tmp.querySelectorAll('figure.for-oembed').forEach((fig) => {
        const url = fig.getAttribute('data-for-oembed-url') || '';
        if (!url) return;
        const userClasses = extractUserClasses(fig);
        const replacement = document.createElement('div');
        replacement.innerHTML = buildSaveHtml(url, userClasses);
        const newFig = replacement.firstElementChild;
        if (newFig && fig.parentNode) {
            fig.parentNode.replaceChild(newFig, fig);
        }
    });
    return tmp.innerHTML;
}

/** Editor-Iframe-Styles. */
const EDITOR_CSS = `
figure.for-oembed {
    position: relative;
    display: block;
    width: 100%;
    max-width: 720px;
    margin: 1em 0 2em;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 6px;
    background: #000;
    transition: border-color .15s ease;
    box-sizing: border-box;
}
figure.for-oembed:hover,
figure.for-oembed[data-mce-selected] {
    border-color: #2f80ed !important;
    outline: none !important;
}
figure.for-oembed .for-oembed__ratio {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    /* Fallback für Browser ohne aspect-ratio */
    min-height: 240px;
    overflow: hidden;
    border-radius: 4px;
    background-color: #0d0d0d;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
}
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__ratio {
    cursor: default;
}
@supports (aspect-ratio: 16 / 9) {
    figure.for-oembed .for-oembed__ratio {
        min-height: 0;
    }
}
figure.for-oembed .for-oembed__ratio iframe {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    display: block;
    z-index: 1;
}
figure.for-oembed .for-oembed__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    border: 0;
    z-index: 0;
    pointer-events: none;
    user-select: none;
}
figure.for-oembed .for-oembed__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .9;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,.5));
    transition: opacity .15s ease, transform .15s ease;
    z-index: 2;
    pointer-events: none;
}
figure.for-oembed:hover .for-oembed__play {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
}
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__play {
    display: none;
}

/* --- Toolbar-Header über dem Video (immer anklickbar, bleibt sichtbar wenn iframe aktiv) --- */
figure.for-oembed .for-oembed__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 6px;
    background: #2a2a2a;
    color: #eee;
    border-radius: 4px 4px 0 0;
    font: 11px/1.3 system-ui, -apple-system, sans-serif;
    user-select: none;
    position: relative;
    z-index: 5;
}
figure.for-oembed .for-oembed__badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #fff;
    flex: none;
}
figure.for-oembed .for-oembed__badge--youtube { background: rgba(255, 0, 0, 0.85); }
figure.for-oembed .for-oembed__badge--vimeo   { background: rgba(26, 183, 234, 0.9); }
figure.for-oembed .for-oembed__url {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ccc;
    cursor: pointer;
}
figure.for-oembed .for-oembed__url:hover {
    color: #fff;
    text-decoration: underline;
}
figure.for-oembed .for-oembed__btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 3px;
    background: rgba(255,255,255,0.12);
    color: #fff;
    cursor: pointer;
    transition: background .15s ease;
}
figure.for-oembed .for-oembed__btn:hover {
    background: rgba(255,255,255,0.25);
}
figure.for-oembed .for-oembed__btn--stop { display: none; }
figure.for-oembed[data-for-oembed-active="1"] .for-oembed__btn--stop { display: inline-flex; }

/* Radius-Anpassung, wenn Toolbar-Header da ist */
figure.for-oembed .for-oembed__toolbar + .for-oembed__ratio {
    border-radius: 0 0 4px 4px;
}

/* Alte ::before/::after Pseudos sind durch den echten Header ersetzt. */

/* --- Default-Presets (werden überschrieben, falls eigene Klassen per Profil gesetzt) --- */
figure.for-oembed.for-oembed--w-sm    { max-width: 320px; }
figure.for-oembed.for-oembed--w-md    { max-width: 480px; }
figure.for-oembed.for-oembed--w-lg    { max-width: 720px; }
figure.for-oembed.for-oembed--w-full  { max-width: 100%; }

figure.for-oembed.for-oembed--align-left {
    float: left;
    margin: 0 1.25em 1em 0;
    clear: left;
}
figure.for-oembed.for-oembed--align-right {
    float: right;
    margin: 0 0 1em 1.25em;
    clear: right;
}
figure.for-oembed.for-oembed--align-center {
    margin-left: auto;
    margin-right: auto;
    float: none;
}

/* --- Ratio-Varianten (Default = 16:9, siehe .for-oembed__ratio oben) --- */
figure.for-oembed.for-oembed--ratio-4-3    .for-oembed__ratio { aspect-ratio: 4 / 3;  min-height: 320px; }
figure.for-oembed.for-oembed--ratio-1-1    .for-oembed__ratio { aspect-ratio: 1 / 1;  min-height: 320px; }
figure.for-oembed.for-oembed--ratio-9-16   .for-oembed__ratio { aspect-ratio: 9 / 16; min-height: 480px; }
figure.for-oembed.for-oembed--ratio-21-9   .for-oembed__ratio { aspect-ratio: 21 / 9; min-height: 200px; }

/* Hochkant-Videos: engere Max-Breite, damit die Figure nicht riesig wird */
figure.for-oembed.for-oembed--ratio-9-16 {
    max-width: 360px;
}
figure.for-oembed.for-oembed--ratio-1-1 {
    max-width: 480px;
}

@supports (aspect-ratio: 1 / 1) {
    figure.for-oembed.for-oembed--ratio-4-3   .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-1-1   .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-9-16  .for-oembed__ratio,
    figure.for-oembed.for-oembed--ratio-21-9  .for-oembed__ratio {
        min-height: 0;
    }
}
`;

function openDialog(editor: any, initialUrl: string, onSubmit: (url: string) => void): void {
    editor.windowManager.open({
        title: 'Video einbetten (YouTube / Vimeo)',
        body: {
            type: 'panel',
            items: [
                {
                    type: 'input',
                    name: 'url',
                    label: 'URL',
                    placeholder: 'https://www.youtube.com/watch?v=…  oder  https://vimeo.com/…'
                },
                {
                    type: 'htmlpanel',
                    html: '<p style="color:#888;font-size:12px;margin:4px 0 0;">Unterstützt: YouTube, YouTube Shorts, youtu.be, Vimeo. Das Video wird im CKE5-kompatiblen <code>&lt;oembed&gt;</code>-Format gespeichert.</p>'
                }
            ]
        },
        initialData: { url: initialUrl },
        buttons: [
            { type: 'cancel', text: 'Abbrechen' },
            { type: 'submit', text: 'Übernehmen', primary: true }
        ],
        onSubmit: (api: any) => {
            const data = api.getData();
            const url = (data.url || '').toString().trim();
            const match = parseUrl(url);
            if (!match) {
                editor.windowManager.alert('Die URL wird nicht unterstützt. Es werden YouTube- und Vimeo-URLs erkannt.');
                return;
            }
            onSubmit(url);
            api.close();
        }
    });
}

function findOembed(editor: any, node?: Element | null): HTMLElement | null {
    const target = node || editor.selection.getNode();
    return editor.dom.getParent(target, 'figure.for-oembed') as HTMLElement | null;
}

function insertOembed(editor: any, url: string): void {
    const match = parseUrl(url);
    if (!match) return;
    // Automatische Ratio-Klasse bei Shorts & Co.
    const initialClasses: string[] = [];
    if (match.suggestedRatio && RATIO_TO_CLASS[match.suggestedRatio]) {
        initialClasses.push(RATIO_TO_CLASS[match.suggestedRatio]);
    }
    editor.undoManager.transact(() => {
        editor.insertContent(buildPreviewHtml(match, initialClasses) + '<p>&nbsp;</p>');
    });
    editor.nodeChanged();
}

function updateOembed(editor: any, figure: HTMLElement, url: string): void {
    const match = parseUrl(url);
    if (!match) return;
    const userClasses = extractUserClasses(figure);
    const placeholder = document.createElement('div');
    placeholder.innerHTML = buildPreviewHtml(match, userClasses);
    const newFig = placeholder.firstElementChild as HTMLElement | null;
    if (!newFig) return;
    editor.undoManager.transact(() => {
        figure.parentNode?.replaceChild(newFig, figure);
    });
    editor.nodeChanged();
}

/**
 * Tauscht im Editor die Poster-Box einer Figure gegen ein aktives iframe.
 * Wird nur im Editor-DOM verwendet; das Save-Format bleibt unverändert
 * (<figure><oembed/></figure>), da collapsePreviewsInHtml nur auf
 * `data-for-oembed-url` schaut.
 */
function activateIframeInFigure(editor: any, figure: HTMLElement): void {
    const url = figure.getAttribute('data-for-oembed-url') || '';
    const match = parseUrl(url);
    if (!match) return;
    const ratio = figure.querySelector('.for-oembed__ratio') as HTMLElement | null;
    if (!ratio) return;
    // Poster + Play entfernen
    ratio.removeAttribute('style');
    ratio.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = match.embedSrc + (match.embedSrc.indexOf('?') >= 0 ? '&' : '?') + 'autoplay=1';
    iframe.setAttribute('allow', match.allow);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    ratio.appendChild(iframe);
    figure.setAttribute('data-for-oembed-active', '1');
    editor.nodeChanged();
}

/** Setzt das iframe zurück auf die Poster-Ansicht (ohne Änderung am Save-Format). */
function deactivateIframeInFigure(editor: any, figure: HTMLElement): void {
    const url = figure.getAttribute('data-for-oembed-url') || '';
    const match = parseUrl(url);
    if (!match) return;
    const userClasses = extractUserClasses(figure);
    const placeholder = document.createElement('div');
    placeholder.innerHTML = buildPreviewHtml(match, userClasses);
    const freshFig = placeholder.firstElementChild as HTMLElement | null;
    if (!freshFig) return;
    figure.parentNode?.replaceChild(freshFig, figure);
    editor.nodeChanged();
}

/**
 * Setzt oder ersetzt eine Preset-Klasse (Breite oder Ausrichtung) auf einer
 * Preview-Figure. `groupValues` enthält alle möglichen Klassen der Gruppe
 * (damit vorher aktive Klassen derselben Gruppe entfernt werden können).
 */
function applyPresetClass(editor: any, figure: HTMLElement, groupValues: string[], nextValue: string): void {
    editor.undoManager.transact(() => {
        groupValues.forEach((v) => { if (v) figure.classList.remove(v); });
        if (nextValue) figure.classList.add(nextValue);
    });
    editor.nodeChanged();
}

function activePresetValue(figure: HTMLElement | null, presets: Preset[]): string {
    if (!figure) return '';
    for (const p of presets) {
        if (p.value && figure.classList.contains(p.value)) return p.value;
    }
    return '';
}

/** Prüft, ob eine String-Eingabe nur aus einer unterstützten URL besteht. */
function extractSoleUrl(text: string): string | null {
    const trimmed = (text || '').trim();
    if (!trimmed) return null;
    if (/\s/.test(trimmed) && trimmed.split(/\s+/).length > 1) return null;
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return parseUrl(trimmed) ? trimmed : null;
}

const Plugin = (): void => {
    tinymce.PluginManager.add('for_oembed', (editor: any) => {
        // --- iframe-Sanitizing deaktivieren, sonst werden YT/Vimeo-iframes geblockt ---
        try {
            editor.options.set('sandbox_iframes', false);
            editor.options.set('convert_unsafe_embeds', false);
            // XSS-Sanitizing abschalten, damit style="background-image:url(…)"
            // auf der Ratio-Box nicht entfernt wird.
            editor.options.set('xss_sanitization', false);
        } catch (_e) { /* noop */ }

        // --- Schema: figure, oembed, iframe, div[class|data-*], contenteditable ---
        editor.on('PreInit', () => {
            const schema = editor.schema;
            try {
                schema.addValidElements('figure[class|contenteditable|data-for-oembed-url|data-for-oembed-provider|data-for-oembed-id|data-for-oembed-poster|data-for-oembed-active]');
                schema.addValidElements('oembed[url]');
                schema.addValidElements('iframe[src|width|height|frameborder|allow|allowfullscreen|loading|referrerpolicy]');
                // style erlaubt für background-image auf der Ratio-Box
                schema.addValidElements('div[class|style|data-for-oembed-overlay|data-for-oembed-toolbar]');
                schema.addValidElements('span[class|title]');
                schema.addValidElements('button[type|class|title|aria-label|data-for-oembed-stop|data-for-oembed-select]');
                schema.addValidElements('img[class|src|alt|loading|referrerpolicy|draggable]');
                // SVG-Elemente fürs Play-Icon + Buttons
                schema.addValidElements('svg[viewBox|width|height|xmlns|focusable|aria-hidden]');
                schema.addValidElements('path[d|fill|fill-opacity|stroke|stroke-width]');
                schema.addValidElements('rect[x|y|width|height|rx|ry|fill|stroke|stroke-width]');
                schema.addValidChildren('+figure[oembed|div|iframe]');
                schema.addValidChildren('+div[iframe|div|svg|img|span|button]');
                schema.addValidChildren('+button[svg]');
                schema.addValidChildren('+svg[path|rect|g]');
            } catch (_e) { /* noop */ }
        });

        // --- Editor-CSS injizieren ---
        editor.on('init', () => {
            try { editor.dom.addStyle(EDITOR_CSS); } catch (_e) { /* noop */ }
            // Bereits beim initialen Content: oembeds entfalten
            try { expandOembedsInEditor(editor.getBody()); } catch (_e) { /* noop */ }
        });

        // --- Nach jedem SetContent: <oembed> in Preview entfalten ---
        editor.on('SetContent', () => {
            try { expandOembedsInEditor(editor.getBody()); } catch (_e) { /* noop */ }
        });

        // --- Beim GetContent (Speichern): Preview zurück in <oembed> ---
        editor.on('GetContent', (e: any) => {
            if (e && typeof e.content === 'string') {
                e.content = collapsePreviewsInHtml(e.content);
            }
        });

        // --- Zweite Sicherheitsebene: Serializer-PreProcess.
        //     Greift auch, wenn getContent intern über andere Pfade
        //     (Autosave, Fullscreen-Switch, Save-Plugin) aufgerufen wird.
        //     Ersetzt jede Preview-Figure im Serializer-Tree direkt durch
        //     <figure class="media"><oembed url="…"></oembed></figure>.
        editor.on('PreProcess', (e: any) => {
            const root = e && e.node;
            if (!root || typeof root.getAll !== 'function') return;
            const figures = root.getAll('figure');
            figures.forEach((fig: any) => {
                const cls = (fig.attr('class') || '') as string;
                if (cls.indexOf('for-oembed') === -1) return;
                const url = fig.attr('data-for-oembed-url') || '';
                if (!url) { fig.remove(); return; }
                // User-Klassen extrahieren (alles außer media + interne Marker)
                const userClasses = cls.split(/\s+/).filter((c: string) =>
                    c && c !== 'media' && INTERNAL_CLASSES.indexOf(c) === -1
                );
                // Node aus HTML bauen und ersetzen
                const html = buildSaveHtml(url, userClasses);
                const fragment = (tinymce.html as any).DomParser
                    ? new (tinymce.html as any).DomParser({ validate: false }).parse(html)
                    : null;
                if (fragment && fragment.firstChild) {
                    // Kinder der figure leeren
                    let child = fig.firstChild;
                    while (child) {
                        const next = child.next;
                        fig.remove(child);
                        child = next;
                    }
                    // Attribute auf die saubere Form setzen
                    const clean = fragment.firstChild;
                    // alle Attribute von fig entfernen
                    const attrs = fig.attributes ? fig.attributes.slice() : [];
                    attrs.forEach((a: any) => fig.attr(a.name, null));
                    // saubere Attribute übernehmen
                    (clean.attributes || []).forEach((a: any) => fig.attr(a.name, a.value));
                    // saubere Kinder anhängen
                    let c = clean.firstChild;
                    while (c) {
                        const next = c.next;
                        fig.append(c);
                        c = next;
                    }
                }
            });
        });

        // --- Paste-Erkennung: nur eine URL → direkt als oEmbed einfügen ---
        editor.on('PastePreProcess', (e: any) => {
            if (!e || typeof e.content !== 'string') return;
            // Plain-String? Dann testen.
            const stripped = e.content.replace(/<[^>]*>/g, '').trim();
            const url = extractSoleUrl(stripped);
            if (!url) return;
            const match = parseUrl(url);
            if (!match) return;
            e.content = buildPreviewHtml(match);
        });

        // --- Klick auf Play/Poster/Toolbar ---
        editor.on('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target || !target.closest) return;
            const figure = findOembed(editor, target);
            if (!figure) return;

            // Stop-Button: iframe zurück auf Poster
            if (target.closest('[data-for-oembed-stop]')) {
                e.preventDefault();
                e.stopPropagation();
                deactivateIframeInFigure(editor, figure);
                // figure nach Rebuild neu selektieren
                const fresh = findOembed(editor);
                if (fresh) editor.selection.select(fresh);
                return;
            }

            // Select-Handle oder URL-Text: nur Figure selektieren (damit
            // Context-Toolbar erscheint, kein iframe-Aktivierung)
            if (target.closest('[data-for-oembed-select]') || target.closest('.for-oembed__url')) {
                e.preventDefault();
                e.stopPropagation();
                editor.selection.select(figure);
                editor.nodeChanged();
                return;
            }

            // Badge oder Toolbar-Hintergrund: nur selektieren
            if (target.closest('.for-oembed__toolbar')) {
                e.preventDefault();
                e.stopPropagation();
                editor.selection.select(figure);
                editor.nodeChanged();
                return;
            }

            // Poster oder Play-Button: iframe aktivieren
            if (target.closest('.for-oembed__play') || target.closest('.for-oembed__ratio')) {
                if (figure.getAttribute('data-for-oembed-active') === '1') return;
                e.preventDefault();
                e.stopPropagation();
                activateIframeInFigure(editor, figure);
            }
        });

        // --- Doppelklick auf Figure öffnet Edit-Dialog (außer bei aktivem iframe) ---
        editor.on('dblclick', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const figure = findOembed(editor, target);
            if (!figure) return;
            if (figure.getAttribute('data-for-oembed-active') === '1') return;
            e.preventDefault();
            e.stopPropagation();
            const url = figure.getAttribute('data-for-oembed-url') || '';
            openDialog(editor, url, (newUrl) => updateOembed(editor, figure, newUrl));
        });

        // --- Commands ---
        editor.addCommand('forOembedInsert', () => {
            const existing = findOembed(editor);
            if (existing) {
                const url = existing.getAttribute('data-for-oembed-url') || '';
                openDialog(editor, url, (newUrl) => updateOembed(editor, existing, newUrl));
            } else {
                openDialog(editor, '', (url) => insertOembed(editor, url));
            }
        });

        editor.addCommand('forOembedEdit', () => {
            const existing = findOembed(editor);
            if (!existing) return;
            const url = existing.getAttribute('data-for-oembed-url') || '';
            openDialog(editor, url, (newUrl) => updateOembed(editor, existing, newUrl));
        });

        // --- Icon (Play-Button) ---
        editor.ui.registry.addIcon(
            'for-oembed',
            '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>'
        );

        // --- Toolbar + Menu ---
        editor.ui.registry.addToggleButton('for_oembed', {
            icon: 'for-oembed',
            tooltip: 'Video einbetten (YouTube / Vimeo)',
            onAction: () => editor.execCommand('forOembedInsert'),
            onSetup: (api: any) => {
                const handler = () => api.setActive(!!findOembed(editor));
                editor.on('NodeChange', handler);
                return () => editor.off('NodeChange', handler);
            }
        });

        editor.ui.registry.addMenuItem('for_oembed', {
            icon: 'for-oembed',
            text: 'Video einbetten (YouTube / Vimeo)',
            onAction: () => editor.execCommand('forOembedInsert')
        });

        // --- Context-Toolbar ---
        editor.ui.registry.addContextToolbar('for_oembed_context', {
            predicate: (node: Node) => {
                const el = node as HTMLElement;
                return !!(el && el.nodeType === 1 && el.classList && el.classList.contains('for-oembed'));
            },
            items: 'for_oembed_width for_oembed_align for_oembed_ratio | for_oembed_preview for_oembed_edit for_oembed_remove',
            position: 'node',
            scope: 'node'
        });

        // --- Breiten-Menübutton ---
        const widthPresets = getPresets(editor, 'oembedwidth_presets', DEFAULT_WIDTH_PRESETS);
        const widthValues = widthPresets.map((p) => p.value).filter(Boolean);
        editor.ui.registry.addMenuButton('for_oembed_width', {
            icon: 'resize',
            tooltip: 'Breite',
            fetch: (cb: any) => {
                const fig = findOembed(editor);
                const active = activePresetValue(fig, widthPresets);
                cb(widthPresets.map((p) => ({
                    type: 'menuitem',
                    text: p.label + (p.value === active ? '  ✓' : ''),
                    onAction: () => {
                        const f = findOembed(editor);
                        if (f) applyPresetClass(editor, f, widthValues, p.value);
                    }
                })));
            }
        });

        // --- Ausrichtungs-Menübutton (Textumlauf) ---
        const alignPresets = getPresets(editor, 'oembedalign_presets', DEFAULT_ALIGN_PRESETS);
        const alignValues = alignPresets.map((p) => p.value).filter(Boolean);
        editor.ui.registry.addMenuButton('for_oembed_align', {
            icon: 'align-left',
            tooltip: 'Ausrichtung / Textumlauf',
            fetch: (cb: any) => {
                const fig = findOembed(editor);
                const active = activePresetValue(fig, alignPresets);
                cb(alignPresets.map((p) => ({
                    type: 'menuitem',
                    text: p.label + (p.value === active ? '  ✓' : ''),
                    onAction: () => {
                        const f = findOembed(editor);
                        if (f) applyPresetClass(editor, f, alignValues, p.value);
                    }
                })));
            }
        });

        // --- Seitenverhältnis-Menübutton ---
        const ratioPresets = getPresets(editor, 'oembedratio_presets', DEFAULT_RATIO_PRESETS);
        const ratioValues = ratioPresets.map((p) => p.value).filter(Boolean);
        editor.ui.registry.addMenuButton('for_oembed_ratio', {
            icon: 'crop',
            tooltip: 'Seitenverhältnis',
            fetch: (cb: any) => {
                const fig = findOembed(editor);
                const active = activePresetValue(fig, ratioPresets);
                cb(ratioPresets.map((p) => ({
                    type: 'menuitem',
                    text: p.label + (p.value === active ? '  ✓' : ''),
                    onAction: () => {
                        const f = findOembed(editor);
                        if (f) {
                            applyPresetClass(editor, f, ratioValues, p.value);
                            // Nach Ratio-Wechsel: falls iframe aktiv, neu laden, damit
                            // YT-Player das neue Format respektiert.
                            if (f.getAttribute('data-for-oembed-active') === '1') {
                                const ratio = f.querySelector('.for-oembed__ratio iframe') as HTMLIFrameElement | null;
                                if (ratio) { ratio.src = ratio.src; }
                            }
                        }
                    }
                })));
            }
        });

        editor.ui.registry.addButton('for_oembed_edit', {
            icon: 'edit-block',
            tooltip: 'URL bearbeiten',
            onAction: () => editor.execCommand('forOembedEdit')
        });

        editor.ui.registry.addButton('for_oembed_preview', {
            icon: 'preview',
            tooltip: 'Video in neuem Tab öffnen',
            onAction: () => {
                const fig = findOembed(editor);
                const url = fig?.getAttribute('data-for-oembed-url');
                if (url) window.open(url, '_blank', 'noopener,noreferrer');
            }
        });

        editor.ui.registry.addButton('for_oembed_remove', {
            icon: 'remove',
            tooltip: 'Video entfernen',
            onAction: () => {
                const fig = findOembed(editor);
                if (!fig) return;
                editor.undoManager.transact(() => {
                    fig.parentNode?.removeChild(fig);
                });
                editor.nodeChanged();
            }
        });

        return {
            getMetadata: () => ({
                name: 'FriendsOfREDAXO oEmbed',
                url: 'https://github.com/FriendsOfREDAXO/tinymce'
            })
        };
    });
};

export default Plugin;
