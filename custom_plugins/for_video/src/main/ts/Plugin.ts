/* ==================================================================
 *  for_video plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Einfügen von lokalen Videos aus dem Mediapool (mp4, webm, ogg).
 *  Save-Format (HTML5):
 *
 *      <figure class="media for-video [user-classes]">
 *          <video src="/media/movie.mp4" poster="/media/poster.jpg" controls playsinline>
 *              <a href="/media/movie.mp4">movie.mp4</a>
 *          </video>
 *      </figure>
 *
 *  Im Editor Poster-Vorschau + Play-Overlay, Klick startet die echte
 *  <video>-Instanz. Gleiche Preset-Klassen-Systematik wie for_oembed:
 *      for-video--w-sm / -md / -lg / -full
 *      for-video--align-left / -center / -right
 *      for-video--ratio-4-3 / -1-1 / -9-16 / -21-9
 *
 *  Toolbar:  for_video
 *  Menü:     for_video
 *  Commands: forVideoInsert, forVideoEdit
 * ================================================================== */

declare const tinymce: any;

interface Preset { label: string; value: string; }

interface VideoData {
    src: string;
    poster: string;
    controls: boolean;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    playsinline: boolean;
}

const INTERNAL_CLASSES = ['for-video'];

const DEFAULT_RATIO_PRESETS: Preset[] = [
    { label: '16:9 (Querformat)', value: '' },
    { label: '4:3',              value: 'for-video--ratio-4-3' },
    { label: '1:1 (Quadrat)',    value: 'for-video--ratio-1-1' },
    { label: '9:16 (Hochkant)',  value: 'for-video--ratio-9-16' },
    { label: '21:9 (Cinemascope)', value: 'for-video--ratio-21-9' }
];

const DEFAULT_WIDTH_PRESETS: Preset[] = [
    { label: 'Original', value: '' },
    { label: 'Klein',    value: 'for-video--w-sm' },
    { label: 'Mittel',   value: 'for-video--w-md' },
    { label: 'Groß',     value: 'for-video--w-lg' },
    { label: 'Volle Breite', value: 'for-video--w-full' }
];

const DEFAULT_ALIGN_PRESETS: Preset[] = [
    { label: 'Keine',           value: '' },
    { label: 'Links (Umlauf)',  value: 'for-video--align-left' },
    { label: 'Zentriert',       value: 'for-video--align-center' },
    { label: 'Rechts (Umlauf)', value: 'for-video--align-right' }
];

function getPresets(editor: any, option: string, fallback: Preset[]): Preset[] {
    try {
        const raw = editor.getParam(option);
        if (Array.isArray(raw) && raw.length) {
            return raw.map((p: any) => ({
                label: String(p.label ?? p.title ?? p.value ?? p.class ?? ''),
                value: String(p.value ?? p.class ?? '').trim()
            })).filter((p: Preset) => p.label);
        }
    } catch (_e) { /* noop */ }
    return fallback;
}

/* ---------------- URL/Pfad-Helfer ---------------- */

function escapeAttr(v: string): string {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Aus einem Mediapool-Dateinamen oder -Pfad den Basisnamen (für <a>-Fallback) ziehen. */
function basename(p: string): string {
    const clean = (p || '').split(/[?#]/)[0];
    const parts = clean.split('/');
    return parts[parts.length - 1] || clean;
}

/** Baut den Media-URL aus einem Mediapool-Dateinamen. Akzeptiert auch vollständige URLs/Pfade. */
function resolveMediaUrl(filename: string): string {
    if (!filename) return '';
    if (/^(https?:)?\/\//i.test(filename)) return filename;
    if (filename.startsWith('/')) return filename;
    // Plain filename → REDAXO-Mediapool-Pfad
    return '/media/' + filename.replace(/^media\//, '');
}

/** Liefert die vom User gesetzten (nicht-internen) Klassen einer Figure. */
function extractUserClasses(el: Element | null): string[] {
    if (!el) return [];
    const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
    return cls.filter((c) => c !== 'media' && !INTERNAL_CLASSES.includes(c));
}

/* ---------------- Mediapool-Picker ---------------- */

/**
 * Öffnet das REDAXO-Mediapool-Popup und ruft den Callback mit dem gewählten
 * Dateinamen auf. Arbeitet über ein verstecktes Input-Feld im Parent-Dokument,
 * weil die Mediapool-Auswahl per `document.getElementById(id).value = …` schreibt.
 */
function pickMediapoolFile(onSelect: (filename: string) => void): void {
    const id = 'for_video_picker_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const input = document.createElement('input');
    input.type = 'hidden';
    input.id = id;
    document.body.appendChild(input);

    const w: any = window;
    const opener = typeof w.openMediaPool === 'function' ? w.openMediaPool : null;
    if (!opener) {
        input.remove();
        w.alert('Mediapool-Funktion nicht verfügbar (openMediaPool).');
        return;
    }
    let popup: any = null;
    try {
        popup = opener(id);
    } catch (_e) { /* noop */ }

    const finish = () => {
        const val = input.value;
        input.remove();
        if (val) onSelect(val);
    };

    if (popup && typeof popup.closed !== 'undefined') {
        const poll = setInterval(() => {
            if (popup.closed) {
                clearInterval(poll);
                finish();
            }
        }, 300);
    } else {
        // Fallback: einmal nach Fokus-Rückkehr prüfen.
        const onFocus = () => {
            window.removeEventListener('focus', onFocus);
            setTimeout(finish, 50);
        };
        window.addEventListener('focus', onFocus);
    }
}

/* ---------------- Preview + Save HTML ---------------- */

/** Preview-Figure fürs Editor-DOM (Poster als img, contenteditable=false). */
function buildPreviewHtml(data: VideoData, userClasses: string[] = []): string {
    const allClasses = ['media', 'for-video', ...userClasses].filter(Boolean).join(' ');
    const posterUrl = resolveMediaUrl(data.poster);
    const posterImg = posterUrl
        ? `<img class="for-video__poster" src="${escapeAttr(posterUrl)}" alt="" loading="lazy" draggable="false">`
        : '';

    const dataAttrs = [
        `data-for-video-src="${escapeAttr(data.src)}"`,
        `data-for-video-poster="${escapeAttr(data.poster)}"`,
        `data-for-video-controls="${data.controls ? '1' : '0'}"`,
        `data-for-video-autoplay="${data.autoplay ? '1' : '0'}"`,
        `data-for-video-loop="${data.loop ? '1' : '0'}"`,
        `data-for-video-muted="${data.muted ? '1' : '0'}"`,
        `data-for-video-playsinline="${data.playsinline ? '1' : '0'}"`
    ].join(' ');

    const fileLabel = basename(data.src) || 'Video';

    return (
        `<figure class="${escapeAttr(allClasses)}" contenteditable="false" ${dataAttrs}>` +
            `<div class="for-video__toolbar" data-for-video-toolbar>` +
                `<span class="for-video__badge">Video</span>` +
                `<span class="for-video__url" title="${escapeAttr(data.src)}">${escapeAttr(fileLabel)}</span>` +
                `<button type="button" class="for-video__btn for-video__btn--stop" data-for-video-stop title="Stoppen" aria-label="Stoppen">` +
                    `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="1.5" ry="1.5" fill="currentColor"/></svg>` +
                `</button>` +
                `<button type="button" class="for-video__btn for-video__btn--handle" data-for-video-select title="Video auswählen" aria-label="Video auswählen">` +
                    `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12v2H2zM2 10h12v2H2z" fill="currentColor"/></svg>` +
                `</button>` +
            `</div>` +
            `<div class="for-video__ratio">` +
                posterImg +
                `<div class="for-video__play" aria-hidden="true">` +
                    `<svg viewBox="0 0 68 48" width="68" height="48" focusable="false"><path d="M66.5 7.7c-.8-2.9-3.1-5.2-6-6C55.3.2 34 .2 34 .2S12.7.2 7.5 1.7C4.6 2.5 2.3 4.8 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3.1 5.2 6 6C12.7 47.8 34 47.8 34 47.8s21.3 0 26.5-1.5c2.9-.8 5.2-3.1 6-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#212121" fill-opacity=".85"/><path d="M45 24 27 14v20z" fill="#fff"/></svg>` +
                `</div>` +
            `</div>` +
        `</figure>`
    );
}

/** Save-Format: echtes HTML5-<video>. User-Klassen bleiben erhalten. */
function buildSaveHtml(data: VideoData, userClasses: string[] = []): string {
    const cls = ['media', 'for-video', ...userClasses].filter(Boolean).join(' ');
    const src = resolveMediaUrl(data.src);
    const poster = data.poster ? resolveMediaUrl(data.poster) : '';

    const attrs: string[] = [];
    attrs.push(`src="${escapeAttr(src)}"`);
    if (poster) attrs.push(`poster="${escapeAttr(poster)}"`);
    if (data.controls) attrs.push('controls');
    if (data.autoplay) attrs.push('autoplay');
    if (data.loop) attrs.push('loop');
    if (data.muted || data.autoplay) attrs.push('muted'); // Autoplay braucht muted
    if (data.playsinline) attrs.push('playsinline');
    attrs.push('preload="metadata"');

    const fileLabel = basename(data.src) || 'Video';
    return (
        `<figure class="${escapeAttr(cls)}">` +
            `<video ${attrs.join(' ')}>` +
                `<a href="${escapeAttr(src)}">${escapeAttr(fileLabel)}</a>` +
            `</video>` +
        `</figure>`
    );
}

/* ---------------- DOM-Parsing gespeicherter Daten ---------------- */

function readVideoDataFromFigure(fig: Element): VideoData | null {
    const vid = fig.querySelector('video') as HTMLVideoElement | null;
    if (vid) {
        return {
            src: vid.getAttribute('src') || '',
            poster: vid.getAttribute('poster') || '',
            controls: vid.hasAttribute('controls'),
            autoplay: vid.hasAttribute('autoplay'),
            loop: vid.hasAttribute('loop'),
            muted: vid.hasAttribute('muted'),
            playsinline: vid.hasAttribute('playsinline')
        };
    }
    // Figure ist schon Preview (hat data-Attribute)
    if (fig.hasAttribute('data-for-video-src')) {
        return {
            src: fig.getAttribute('data-for-video-src') || '',
            poster: fig.getAttribute('data-for-video-poster') || '',
            controls: fig.getAttribute('data-for-video-controls') === '1',
            autoplay: fig.getAttribute('data-for-video-autoplay') === '1',
            loop: fig.getAttribute('data-for-video-loop') === '1',
            muted: fig.getAttribute('data-for-video-muted') === '1',
            playsinline: fig.getAttribute('data-for-video-playsinline') === '1'
        };
    }
    return null;
}

/* ---------------- Expand / Collapse (Editor ↔ Save) ---------------- */

/**
 * Wandelt <figure class="media for-video"><video …></video></figure>
 * im Editor-DOM in Preview-Figures um.
 */
function expandVideosInEditor(root: Element): void {
    const figures = Array.from(root.querySelectorAll('figure.for-video, figure.media'));
    figures.forEach((fig) => {
        const vid = fig.querySelector('video');
        if (!vid) return;
        // Schon expandiert?
        if (fig.hasAttribute('data-for-video-src') && fig.querySelector('.for-video__ratio')) return;

        const data = readVideoDataFromFigure(fig);
        if (!data || !data.src) return;
        const userClasses = extractUserClasses(fig);
        const placeholder = document.createElement('div');
        placeholder.innerHTML = buildPreviewHtml(data, userClasses);
        const newFig = placeholder.firstElementChild as HTMLElement | null;
        if (!newFig) return;
        fig.parentNode?.replaceChild(newFig, fig);
    });
}

/**
 * Wandelt die Preview-Figures im HTML-String in das Save-Format zurück.
 * Wird in GetContent verwendet.
 */
function collapsePreviewsInHtml(html: string): string {
    if (!html) return html;
    const box = document.createElement('div');
    box.innerHTML = html;
    const figures = Array.from(box.querySelectorAll('figure.for-video, figure[data-for-video-src]'));
    figures.forEach((fig) => {
        const data = readVideoDataFromFigure(fig);
        if (!data || !data.src) return;
        const userClasses = extractUserClasses(fig);
        const placeholder = document.createElement('div');
        placeholder.innerHTML = buildSaveHtml(data, userClasses);
        const saved = placeholder.firstElementChild;
        if (!saved) return;
        fig.parentNode?.replaceChild(saved, fig);
    });
    return box.innerHTML;
}

/* ---------------- Click-to-Play ---------------- */

function activateVideoInFigure(editor: any, figure: HTMLElement): void {
    const data = readVideoDataFromFigure(figure);
    if (!data || !data.src) return;
    const ratio = figure.querySelector('.for-video__ratio') as HTMLElement | null;
    if (!ratio) return;

    ratio.innerHTML = '';
    const vid = document.createElement('video');
    vid.src = resolveMediaUrl(data.src);
    if (data.poster) vid.poster = resolveMediaUrl(data.poster);
    vid.controls = data.controls || true; // im Editor immer Controls anzeigen
    if (data.loop) vid.loop = true;
    if (data.muted) vid.muted = true;
    if (data.playsinline) vid.setAttribute('playsinline', '');
    vid.setAttribute('preload', 'metadata');
    vid.style.width = '100%';
    vid.style.height = '100%';
    vid.style.position = 'absolute';
    vid.style.top = '0';
    vid.style.left = '0';
    vid.style.display = 'block';
    ratio.appendChild(vid);
    try { vid.play(); } catch (_e) { /* noop */ }
    figure.setAttribute('data-for-video-active', '1');
    editor.nodeChanged();
}

function deactivateVideoInFigure(editor: any, figure: HTMLElement): void {
    const data = readVideoDataFromFigure(figure);
    if (!data) return;
    const userClasses = extractUserClasses(figure);
    const placeholder = document.createElement('div');
    placeholder.innerHTML = buildPreviewHtml(data, userClasses);
    const fresh = placeholder.firstElementChild as HTMLElement | null;
    if (!fresh) return;
    figure.parentNode?.replaceChild(fresh, figure);
    editor.nodeChanged();
}

/* ---------------- Preset-Helfer ---------------- */

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

/* ---------------- Dialog ---------------- */

function openDialog(editor: any, initial: VideoData | null, onSubmit: (data: VideoData) => void): void {
    const data: VideoData = initial ? { ...initial } : {
        src: '', poster: '',
        controls: true, autoplay: false, loop: false, muted: false, playsinline: true
    };

    const body = {
        type: 'panel',
        items: [
            { type: 'input',   name: 'src',     label: 'Video-Datei (Mediapool)', placeholder: 'z.B. movie.mp4' },
            { type: 'button',  name: 'pickSrc', text: 'Aus Mediapool wählen…', icon: 'browse' },
            { type: 'input',   name: 'poster',  label: 'Poster-Bild (optional)', placeholder: 'z.B. poster.jpg' },
            { type: 'button',  name: 'pickPoster', text: 'Poster aus Mediapool wählen…', icon: 'browse' },
            { type: 'checkbox', name: 'controls', label: 'Controls anzeigen' },
            { type: 'checkbox', name: 'autoplay', label: 'Autoplay (setzt muted)' },
            { type: 'checkbox', name: 'loop',     label: 'Loop (Endlosschleife)' },
            { type: 'checkbox', name: 'muted',    label: 'Stumm (muted)' },
            { type: 'checkbox', name: 'playsinline', label: 'Inline abspielen (iOS, playsinline)' }
        ]
    };

    const dlg = editor.windowManager.open({
        title: initial ? 'Video bearbeiten' : 'Video einfügen',
        size: 'normal',
        body,
        buttons: [
            { type: 'cancel', text: 'Abbrechen' },
            { type: 'submit', text: initial ? 'Übernehmen' : 'Einfügen', primary: true }
        ],
        initialData: data,
        onAction: (api: any, details: any) => {
            if (details.name === 'pickSrc') {
                pickMediapoolFile((filename) => {
                    api.setData({ src: filename });
                });
            } else if (details.name === 'pickPoster') {
                pickMediapoolFile((filename) => {
                    api.setData({ poster: filename });
                });
            }
        },
        onSubmit: (api: any) => {
            const formData = api.getData() as VideoData;
            if (!formData.src) {
                editor.windowManager.alert('Bitte eine Video-Datei auswählen.');
                return;
            }
            api.close();
            onSubmit(formData);
        }
    });
}

function insertVideo(editor: any, data: VideoData): void {
    editor.undoManager.transact(() => {
        editor.insertContent(buildPreviewHtml(data));
    });
    editor.nodeChanged();
}

function editVideo(editor: any, figure: HTMLElement, data: VideoData): void {
    const userClasses = extractUserClasses(figure);
    const placeholder = document.createElement('div');
    placeholder.innerHTML = buildPreviewHtml(data, userClasses);
    const fresh = placeholder.firstElementChild as HTMLElement | null;
    if (!fresh) return;
    editor.undoManager.transact(() => {
        figure.parentNode?.replaceChild(fresh, figure);
    });
    editor.nodeChanged();
}

/* ---------------- Editor-CSS ---------------- */

const EDITOR_CSS = `
figure.for-video {
    position: relative;
    display: block;
    margin: 1em 0;
    max-width: 100%;
    padding: 0;
    background: #0d0d0d;
    border-radius: 4px;
    overflow: hidden;
    line-height: 0;
    color: #fff;
}
figure.for-video.mce-object-selected {
    box-shadow: 0 0 0 2px #2f80ed;
    outline: none !important;
}
figure.for-video .for-video__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    background: #2a2a2a;
    font: 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #eee;
    user-select: none;
    cursor: pointer;
}
figure.for-video .for-video__badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    background: #2f80ed;
    color: #fff;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: .5px;
    text-transform: uppercase;
}
figure.for-video .for-video__url {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: .8;
    cursor: pointer;
}
figure.for-video .for-video__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: #eee;
    cursor: pointer;
    transition: background-color .15s ease;
}
figure.for-video .for-video__btn:hover { background: rgba(255,255,255,.15); }
figure.for-video[data-for-video-active="1"] .for-video__btn--stop { color: #ff6b6b; }
figure.for-video:not([data-for-video-active="1"]) .for-video__btn--stop { display: none; }
figure.for-video .for-video__ratio {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    min-height: 240px;
    overflow: hidden;
    background: #0d0d0d;
    cursor: pointer;
}
@supports (aspect-ratio: 16 / 9) {
    figure.for-video .for-video__ratio { min-height: 0; }
}
figure.for-video[data-for-video-active="1"] .for-video__ratio { cursor: default; }
figure.for-video .for-video__poster {
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
figure.for-video .for-video__ratio video {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    display: block;
    z-index: 1;
}
figure.for-video .for-video__play {
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
figure.for-video:hover .for-video__play {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
}
figure.for-video[data-for-video-active="1"] .for-video__play { display: none; }

/* Ratio presets */
figure.for-video.for-video--ratio-4-3    .for-video__ratio { aspect-ratio: 4 / 3;  min-height: 320px; }
figure.for-video.for-video--ratio-1-1    .for-video__ratio { aspect-ratio: 1 / 1;  min-height: 320px; }
figure.for-video.for-video--ratio-9-16   .for-video__ratio { aspect-ratio: 9 / 16; min-height: 480px; }
figure.for-video.for-video--ratio-21-9   .for-video__ratio { aspect-ratio: 21 / 9; min-height: 200px; }
@supports (aspect-ratio: 1 / 1) {
    figure.for-video.for-video--ratio-4-3   .for-video__ratio,
    figure.for-video.for-video--ratio-1-1   .for-video__ratio,
    figure.for-video.for-video--ratio-9-16  .for-video__ratio,
    figure.for-video.for-video--ratio-21-9  .for-video__ratio { min-height: 0; }
}

/* Width presets (editor) */
figure.for-video.for-video--w-sm   { max-width: 240px; }
figure.for-video.for-video--w-md   { max-width: 480px; }
figure.for-video.for-video--w-lg   { max-width: 720px; }
figure.for-video.for-video--w-full { max-width: 100%; }

/* Align presets (editor) */
figure.for-video.for-video--align-left   { float: left;  margin-right: 1em; }
figure.for-video.for-video--align-right  { float: right; margin-left: 1em; }
figure.for-video.for-video--align-center { margin-left: auto; margin-right: auto; float: none; }
`;

/* ==================================================================
 *  Plugin
 * ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('for_video', (editor: any) => {
        try {
            editor.options.set('xss_sanitization', false);
        } catch (_e) { /* noop */ }

        // --- Schema: figure, video, source, img, div, button, svg/path/rect, span ---
        editor.on('PreInit', () => {
            const schema = editor.schema;
            schema.addValidElements('figure[class|contenteditable|data-for-video-src|data-for-video-poster|data-for-video-controls|data-for-video-autoplay|data-for-video-loop|data-for-video-muted|data-for-video-playsinline|data-for-video-active]');
            schema.addValidElements('video[src|poster|controls|autoplay|loop|muted|playsinline|preload|width|height|crossorigin]');
            schema.addValidElements('source[src|type]');
            schema.addValidElements('div[class|style|data-for-video-toolbar]');
            schema.addValidElements('span[class|title]');
            schema.addValidElements('button[type|class|title|aria-label|data-for-video-stop|data-for-video-select]');
            schema.addValidElements('img[class|src|alt|loading|referrerpolicy|draggable]');
            schema.addValidElements('svg[viewBox|width|height|xmlns|focusable|aria-hidden]');
            schema.addValidElements('path[d|fill|fill-opacity|stroke|stroke-width]');
            schema.addValidElements('rect[x|y|width|height|rx|ry|fill|stroke|stroke-width]');
            schema.addValidChildren('+figure[video|div|a]');
            schema.addValidChildren('+video[source|a|track]');
            schema.addValidChildren('+div[video|div|svg|img|span|button]');
            schema.addValidChildren('+button[svg]');
            schema.addValidChildren('+svg[path|rect|g]');
        });

        // CSS + initiale Expansion
        editor.on('init', () => {
            editor.dom.addStyle(EDITOR_CSS);
            const body = editor.getBody();
            if (body) expandVideosInEditor(body);
        });

        // Wenn Content nachträglich gesetzt wird: expandieren
        editor.on('SetContent', () => {
            const body = editor.getBody();
            if (body) expandVideosInEditor(body);
        });

        // Beim Speichern: Preview → Save-Format
        editor.on('GetContent', (e: any) => {
            e.content = collapsePreviewsInHtml(e.content);
        });

        // Zweite Sicherung: DOM-Tree-Hook vor Serialisierung
        editor.on('PreProcess', (e: any) => {
            const root = e && e.node;
            if (!root || typeof root.getAll !== 'function') return;
            const figures = root.getAll('figure');
            figures.forEach((fig: any) => {
                const cls = (fig.attr('class') || '') as string;
                const hasData = !!fig.attr('data-for-video-src');
                if (cls.indexOf('for-video') === -1 && !hasData) return;

                const data: VideoData = {
                    src: fig.attr('data-for-video-src') || '',
                    poster: fig.attr('data-for-video-poster') || '',
                    controls: fig.attr('data-for-video-controls') === '1',
                    autoplay: fig.attr('data-for-video-autoplay') === '1',
                    loop: fig.attr('data-for-video-loop') === '1',
                    muted: fig.attr('data-for-video-muted') === '1',
                    playsinline: fig.attr('data-for-video-playsinline') === '1'
                };
                if (!data.src) { fig.remove(); return; }

                const userClasses = cls.split(/\s+/).filter((c: string) =>
                    c && c !== 'media' && INTERNAL_CLASSES.indexOf(c) === -1
                );

                const html = buildSaveHtml(data, userClasses);
                const fragment = (tinymce.html as any).DomParser
                    ? new (tinymce.html as any).DomParser({ validate: false }).parse(html)
                    : null;
                if (!fragment || !fragment.firstChild) return;

                // Kinder von fig leeren
                let child = fig.firstChild;
                while (child) {
                    const next = child.next;
                    fig.remove(child);
                    child = next;
                }
                // Attribute entfernen
                const attrs = fig.attributes ? fig.attributes.slice() : [];
                attrs.forEach((a: any) => fig.attr(a.name, null));
                // Saubere Attribute übernehmen
                const clean = fragment.firstChild;
                (clean.attributes || []).forEach((a: any) => fig.attr(a.name, a.value));
                // Saubere Kinder anhängen
                let c = clean.firstChild;
                while (c) {
                    const next = c.next;
                    fig.append(c);
                    c = next;
                }
            });
        });

        // --- Klick-Handler im Editor ---
        editor.on('click', (e: any) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const stop = target.closest('[data-for-video-stop]') as HTMLElement | null;
            if (stop) {
                const fig = stop.closest('figure.for-video') as HTMLElement | null;
                if (fig) {
                    e.preventDefault();
                    deactivateVideoInFigure(editor, fig);
                }
                return;
            }

            const select = target.closest('[data-for-video-select]') as HTMLElement | null;
            if (select) {
                const fig = select.closest('figure.for-video') as HTMLElement | null;
                if (fig) {
                    e.preventDefault();
                    editor.selection.select(fig);
                    editor.nodeChanged();
                }
                return;
            }

            const url = target.closest('.for-video__url') as HTMLElement | null;
            if (url) {
                const fig = url.closest('figure.for-video') as HTMLElement | null;
                if (fig) {
                    editor.selection.select(fig);
                    editor.nodeChanged();
                }
                return;
            }

            const toolbar = target.closest('.for-video__toolbar') as HTMLElement | null;
            if (toolbar) {
                const fig = toolbar.closest('figure.for-video') as HTMLElement | null;
                if (fig) {
                    editor.selection.select(fig);
                    editor.nodeChanged();
                }
                return;
            }

            const playArea = target.closest('.for-video__ratio, .for-video__play') as HTMLElement | null;
            if (playArea) {
                const fig = playArea.closest('figure.for-video') as HTMLElement | null;
                if (fig && fig.getAttribute('data-for-video-active') !== '1') {
                    e.preventDefault();
                    activateVideoInFigure(editor, fig);
                }
            }
        });

        // Doppelklick öffnet Dialog (wenn Video nicht aktiv)
        editor.on('dblclick', (e: any) => {
            const fig = (e.target as HTMLElement).closest('figure.for-video') as HTMLElement | null;
            if (!fig) return;
            if (fig.getAttribute('data-for-video-active') === '1') return;
            const data = readVideoDataFromFigure(fig);
            if (!data) return;
            e.preventDefault();
            openDialog(editor, data, (newData) => editVideo(editor, fig, newData));
        });

        // --- Commands ---
        editor.addCommand('forVideoInsert', () => {
            openDialog(editor, null, (data) => insertVideo(editor, data));
        });
        editor.addCommand('forVideoEdit', () => {
            const node = editor.selection.getNode();
            const fig = (node as HTMLElement).closest('figure.for-video') as HTMLElement | null;
            if (!fig) return;
            const data = readVideoDataFromFigure(fig);
            if (!data) return;
            openDialog(editor, data, (newData) => editVideo(editor, fig, newData));
        });

        // --- Toolbar & Menü ---
        editor.ui.registry.addIcon('for-video-icon',
            '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>'
        );

        editor.ui.registry.addButton('for_video', {
            icon: 'for-video-icon',
            tooltip: 'Lokales Video einfügen',
            onAction: () => editor.execCommand('forVideoInsert')
        });

        editor.ui.registry.addMenuItem('for_video', {
            icon: 'for-video-icon',
            text: 'Lokales Video…',
            onAction: () => editor.execCommand('forVideoInsert')
        });

        // --- Context-Toolbar (Preset-Menüs + Edit / Remove) ---
        const widthPresets  = getPresets(editor, 'videowidth_presets', DEFAULT_WIDTH_PRESETS);
        const alignPresets  = getPresets(editor, 'videoalign_presets', DEFAULT_ALIGN_PRESETS);
        const ratioPresets  = getPresets(editor, 'videoratio_presets', DEFAULT_RATIO_PRESETS);
        const widthValues = widthPresets.map((p) => p.value).filter(Boolean);
        const alignValues = alignPresets.map((p) => p.value).filter(Boolean);
        const ratioValues = ratioPresets.map((p) => p.value).filter(Boolean);

        const currentFigure = (): HTMLElement | null => {
            const node = editor.selection.getNode();
            return (node as HTMLElement)?.closest('figure.for-video') as HTMLElement | null;
        };

        editor.ui.registry.addMenuButton('for_video_width', {
            icon: 'resize',
            tooltip: 'Breite',
            fetch: (cb: any) => {
                const fig = currentFigure();
                const active = activePresetValue(fig, widthPresets);
                cb(widthPresets.map((p) => ({
                    type: 'menuitem',
                    text: (p.value === active ? '✓ ' : '   ') + p.label,
                    onAction: () => {
                        const f = currentFigure();
                        if (f) applyPresetClass(editor, f, widthValues, p.value);
                    }
                })));
            }
        });

        editor.ui.registry.addMenuButton('for_video_align', {
            icon: 'align-left',
            tooltip: 'Ausrichtung',
            fetch: (cb: any) => {
                const fig = currentFigure();
                const active = activePresetValue(fig, alignPresets);
                cb(alignPresets.map((p) => ({
                    type: 'menuitem',
                    text: (p.value === active ? '✓ ' : '   ') + p.label,
                    onAction: () => {
                        const f = currentFigure();
                        if (f) applyPresetClass(editor, f, alignValues, p.value);
                    }
                })));
            }
        });

        editor.ui.registry.addMenuButton('for_video_ratio', {
            icon: 'crop',
            tooltip: 'Seitenverhältnis',
            fetch: (cb: any) => {
                const fig = currentFigure();
                const active = activePresetValue(fig, ratioPresets);
                cb(ratioPresets.map((p) => ({
                    type: 'menuitem',
                    text: (p.value === active ? '✓ ' : '   ') + p.label,
                    onAction: () => {
                        const f = currentFigure();
                        if (f) applyPresetClass(editor, f, ratioValues, p.value);
                    }
                })));
            }
        });

        editor.ui.registry.addButton('for_video_edit', {
            icon: 'edit-block',
            tooltip: 'Video bearbeiten',
            onAction: () => editor.execCommand('forVideoEdit')
        });

        editor.ui.registry.addButton('for_video_remove', {
            icon: 'remove',
            tooltip: 'Video entfernen',
            onAction: () => {
                const fig = currentFigure();
                if (!fig) return;
                editor.undoManager.transact(() => fig.parentNode?.removeChild(fig));
                editor.nodeChanged();
            }
        });

        editor.ui.registry.addContextToolbar('for_video', {
            predicate: (node: Node) => {
                const el = node as HTMLElement;
                return !!(el && el.closest && el.closest('figure.for-video'));
            },
            items: 'for_video_width for_video_align for_video_ratio | for_video_edit for_video_remove',
            position: 'node'
        });
    });
};

export default Plugin;
