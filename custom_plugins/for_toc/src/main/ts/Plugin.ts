/* ==================================================================
 *  Table of Contents plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Eigenständige, freie Implementierung eines Inhaltsverzeichnisses.
 *  Analog zu for_footnotes: Plugin erzeugt beim Einfügen ein
 *  <nav class="for-toc">-Block und hält ihn bei Änderungen
 *  automatisch synchron mit den Überschriften im Editor-Inhalt.
 *
 *    Toolbar:       for_toc_insert, for_toc_update
 *    Menü (Insert): for_toc
 *    Commands:      forTocInsert, forTocUpdate, forTocSettings
 *
 *  HTML-Struktur (alles mit "for-" prefixed):
 *    <nav class="for-toc" data-for-toc-min="2" data-for-toc-max="4"
 *         data-for-toc-ordered="1" contenteditable="false">
 *      <p class="for-toc__title">Inhalt</p>
 *      <ol class="for-toc__list">
 *        <li class="for-toc__item for-toc__item--h2">
 *          <a href="#slug">Überschrift</a>
 *          <ol class="for-toc__list">
 *            <li class="for-toc__item for-toc__item--h3">
 *              <a href="#slug-2">Unterpunkt</a>
 *            </li>
 *          </ol>
 *        </li>
 *      </ol>
 *    </nav>
 *
 *  Heading-IDs werden stabil als "for-toc-slug-<slug>" vergeben und
 *  bleiben über Reloads erhalten (nur neue Headings bekommen IDs).
 * ================================================================== */

declare const tinymce: any;

const TOC_CLASS = 'for-toc';
const TOC_TITLE_CLASS = 'for-toc__title';
const TOC_LIST_CLASS = 'for-toc__list';
const TOC_ITEM_CLASS = 'for-toc__item';

const DATA_MIN = 'data-for-toc-min';
const DATA_MAX = 'data-for-toc-max';
const DATA_ORDERED = 'data-for-toc-ordered';
const DATA_TITLE = 'data-for-toc-title';
const HEADING_ID_PREFIX = 'for-toc-';

const DEFAULT_MIN = 2;
const DEFAULT_MAX = 4;
const DEFAULT_TITLE = 'Inhalt';
const DEFAULT_ORDERED = true;

interface TocHeading {
    level: number;
    text: string;
    id: string;
    element: HTMLElement;
}

interface TocSettings {
    min: number;
    max: number;
    title: string;
    ordered: boolean;
}

function getBody(editor: any): HTMLElement {
    return editor.getBody() as HTMLElement;
}

function getToc(editor: any): HTMLElement | null {
    return getBody(editor).querySelector('nav.' + TOC_CLASS) as HTMLElement | null;
}

function escHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    } as Record<string, string>)[c]!);
}

function slugify(raw: string): string {
    const map: Record<string, string> = {
        'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'ae', 'Ö': 'oe', 'Ü': 'ue', 'ß': 'ss',
    };
    return raw
        .toLowerCase()
        .split('')
        .map((ch) => map[ch] ?? ch)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80) || 'abschnitt';
}

function readSettings(toc: HTMLElement | null): TocSettings {
    if (!toc) {
        return { min: DEFAULT_MIN, max: DEFAULT_MAX, title: DEFAULT_TITLE, ordered: DEFAULT_ORDERED };
    }
    const min = parseInt(toc.getAttribute(DATA_MIN) ?? String(DEFAULT_MIN), 10) || DEFAULT_MIN;
    const max = parseInt(toc.getAttribute(DATA_MAX) ?? String(DEFAULT_MAX), 10) || DEFAULT_MAX;
    const title = toc.getAttribute(DATA_TITLE) ?? DEFAULT_TITLE;
    const ordered = toc.getAttribute(DATA_ORDERED) !== '0';
    return { min: Math.max(1, Math.min(6, min)), max: Math.max(1, Math.min(6, max)), title, ordered };
}

function writeSettings(toc: HTMLElement, s: TocSettings): void {
    toc.setAttribute(DATA_MIN, String(s.min));
    toc.setAttribute(DATA_MAX, String(s.max));
    toc.setAttribute(DATA_ORDERED, s.ordered ? '1' : '0');
    toc.setAttribute(DATA_TITLE, s.title);
}

function collectHeadings(editor: any, settings: TocSettings): TocHeading[] {
    const body = getBody(editor);
    const selector = 'h1, h2, h3, h4, h5, h6';
    const all = Array.from(body.querySelectorAll(selector)) as HTMLElement[];
    const usedIds = new Set<string>();

    // Erst bestehende IDs erfassen, damit neue Slugs nicht kollidieren.
    all.forEach((h) => {
        if (h.id) usedIds.add(h.id);
    });

    const out: TocHeading[] = [];
    all.forEach((h) => {
        // Überschriften innerhalb der TOC selbst ignorieren.
        if (h.closest('nav.' + TOC_CLASS)) return;
        const level = parseInt(h.tagName.substring(1), 10);
        if (level < settings.min || level > settings.max) return;
        const text = (h.textContent ?? '').trim();
        if (text === '') return;

        let id = h.id;
        if (!id || !id.startsWith(HEADING_ID_PREFIX)) {
            const base = HEADING_ID_PREFIX + slugify(text);
            let candidate = base;
            let i = 2;
            while (usedIds.has(candidate)) {
                candidate = base + '-' + i;
                i++;
            }
            id = candidate;
            h.id = id;
        }
        usedIds.add(id);
        out.push({ level, text, id, element: h });
    });
    return out;
}

function renderTocInner(doc: Document, headings: TocHeading[], settings: TocSettings): DocumentFragment {
    const frag = doc.createDocumentFragment();

    const title = doc.createElement('p');
    title.className = TOC_TITLE_CLASS;
    title.setAttribute('contenteditable', 'false');
    title.textContent = settings.title || DEFAULT_TITLE;
    frag.appendChild(title);

    if (headings.length === 0) {
        const empty = doc.createElement('p');
        empty.className = TOC_TITLE_CLASS + '__empty';
        empty.setAttribute('contenteditable', 'false');
        empty.textContent = '— keine passenden Überschriften gefunden —';
        frag.appendChild(empty);
        return frag;
    }

    const listTag = settings.ordered ? 'ol' : 'ul';
    const rootList = doc.createElement(listTag);
    rootList.className = TOC_LIST_CLASS;

    const stack: Array<{ level: number; list: HTMLElement }> = [
        { level: settings.min - 1, list: rootList },
    ];

    headings.forEach((h) => {
        while (stack.length > 1 && stack[stack.length - 1].level >= h.level) {
            stack.pop();
        }
        let parentEntry = stack[stack.length - 1];

        // Wenn ein Level übersprungen wird, Pseudo-Nester einfügen,
        // damit das Markup valide bleibt.
        while (parentEntry.level < h.level - 1) {
            const lastItem = parentEntry.list.lastElementChild as HTMLElement | null;
            let host: HTMLElement;
            if (lastItem && lastItem.tagName === 'LI') {
                const nested = doc.createElement(listTag);
                nested.className = TOC_LIST_CLASS;
                lastItem.appendChild(nested);
                host = nested;
            } else {
                const filler = doc.createElement('li');
                filler.className = TOC_ITEM_CLASS + ' ' + TOC_ITEM_CLASS + '--filler';
                const nested = doc.createElement(listTag);
                nested.className = TOC_LIST_CLASS;
                filler.appendChild(nested);
                parentEntry.list.appendChild(filler);
                host = nested;
            }
            const nextLevel = parentEntry.level + 1;
            parentEntry = { level: nextLevel, list: host };
            stack.push(parentEntry);
        }

        const li = doc.createElement('li');
        li.className = TOC_ITEM_CLASS + ' ' + TOC_ITEM_CLASS + '--h' + h.level;

        const a = doc.createElement('a');
        a.setAttribute('href', '#' + h.id);
        a.textContent = h.text;
        li.appendChild(a);

        parentEntry.list.appendChild(li);

        if (h.level < settings.max) {
            const nested = doc.createElement(listTag);
            nested.className = TOC_LIST_CLASS;
            li.appendChild(nested);
            stack.push({ level: h.level, list: nested });
        }
    });

    // Leere verschachtelte Listen wieder entfernen, damit die Ausgabe kompakt ist.
    rootList.querySelectorAll(listTag + '.' + TOC_LIST_CLASS).forEach((lst) => {
        if (!lst.firstElementChild) lst.parentNode?.removeChild(lst);
    });

    frag.appendChild(rootList);
    return frag;
}

function renderToc(editor: any, toc: HTMLElement, settings: TocSettings): void {
    const doc = editor.getDoc() as Document;
    const headings = collectHeadings(editor, settings);
    toc.setAttribute('contenteditable', 'false');
    toc.className = TOC_CLASS;
    writeSettings(toc, settings);
    while (toc.firstChild) toc.removeChild(toc.firstChild);
    toc.appendChild(renderTocInner(doc, headings, settings));
}

function syncToc(editor: any): void {
    const toc = getToc(editor);
    if (!toc) return;
    const settings = readSettings(toc);
    renderToc(editor, toc, settings);
}

function insertToc(editor: any, settings: TocSettings): void {
    const doc = editor.getDoc() as Document;
    let toc = getToc(editor);
    if (!toc) {
        toc = doc.createElement('nav');
        toc.className = TOC_CLASS;
        editor.selection.setNode(toc);
        // setNode ersetzt die Selection – wir holen das Element neu aus dem Body,
        // falls TinyMCE es geklont hat.
        toc = getToc(editor) ?? toc;
    }
    renderToc(editor, toc, settings);
    editor.undoManager.add();
    editor.nodeChanged();
}

function openSettingsDialog(editor: any): void {
    const toc = getToc(editor);
    const current = readSettings(toc);
    editor.windowManager.open({
        title: 'Inhaltsverzeichnis',
        size: 'normal',
        body: {
            type: 'panel',
            items: [
                { type: 'input', name: 'title', label: 'Titel' },
                {
                    type: 'selectbox',
                    name: 'min',
                    label: 'Ab Ebene',
                    items: [
                        { value: '1', text: 'h1' },
                        { value: '2', text: 'h2' },
                        { value: '3', text: 'h3' },
                        { value: '4', text: 'h4' },
                        { value: '5', text: 'h5' },
                        { value: '6', text: 'h6' },
                    ],
                },
                {
                    type: 'selectbox',
                    name: 'max',
                    label: 'Bis Ebene',
                    items: [
                        { value: '1', text: 'h1' },
                        { value: '2', text: 'h2' },
                        { value: '3', text: 'h3' },
                        { value: '4', text: 'h4' },
                        { value: '5', text: 'h5' },
                        { value: '6', text: 'h6' },
                    ],
                },
                {
                    type: 'selectbox',
                    name: 'ordered',
                    label: 'Listentyp',
                    items: [
                        { value: '1', text: 'Nummeriert (ol)' },
                        { value: '0', text: 'Unsortiert (ul)' },
                    ],
                },
            ],
        },
        buttons: [
            { type: 'cancel', text: 'Abbrechen' },
            { type: 'submit', text: toc ? 'Aktualisieren' : 'Einfügen', primary: true },
        ],
        initialData: {
            title: current.title,
            min: String(current.min),
            max: String(current.max),
            ordered: current.ordered ? '1' : '0',
        },
        onSubmit: (api: any) => {
            const data = api.getData();
            const s: TocSettings = {
                title: (data.title || DEFAULT_TITLE).toString(),
                min: parseInt(data.min, 10) || DEFAULT_MIN,
                max: parseInt(data.max, 10) || DEFAULT_MAX,
                ordered: data.ordered === '1',
            };
            if (s.max < s.min) {
                const tmp = s.max; s.max = s.min; s.min = tmp;
            }
            insertToc(editor, s);
            api.close();
        },
    });
}

/* ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('for_toc', (editor: any): void => {
        editor.addCommand('forTocInsert', () => {
            const existing = getToc(editor);
            if (existing) {
                syncToc(editor);
                editor.undoManager.add();
                return;
            }
            openSettingsDialog(editor);
        });
        editor.addCommand('forTocUpdate', () => {
            syncToc(editor);
            editor.undoManager.add();
        });
        editor.addCommand('forTocSettings', () => openSettingsDialog(editor));

        editor.ui.registry.addIcon(
            'for-toc',
            '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="5" width="3" height="2" rx="0.5"/><rect x="8" y="5" width="13" height="2" rx="0.5"/><rect x="3" y="11" width="3" height="2" rx="0.5"/><rect x="8" y="11" width="10" height="2" rx="0.5"/><rect x="3" y="17" width="3" height="2" rx="0.5"/><rect x="8" y="17" width="8" height="2" rx="0.5"/></svg>'
        );

        editor.ui.registry.addButton('for_toc_insert', {
            icon: 'for-toc',
            tooltip: 'Inhaltsverzeichnis einfügen',
            onAction: () => editor.execCommand('forTocInsert'),
        });

        editor.ui.registry.addButton('for_toc_update', {
            icon: 'reload',
            tooltip: 'Inhaltsverzeichnis aktualisieren',
            onAction: () => editor.execCommand('forTocUpdate'),
        });

        editor.ui.registry.addMenuItem('for_toc', {
            icon: 'for-toc',
            text: 'Inhaltsverzeichnis',
            onAction: () => editor.execCommand('forTocInsert'),
        });

        editor.ui.registry.addContextToolbar('for_toc_context', {
            predicate: (node: HTMLElement) =>
                !!(node && node.closest && node.closest('nav.' + TOC_CLASS)),
            items: 'for_toc_update for_toc_settings for_toc_remove',
            position: 'node',
            scope: 'node',
        });

        editor.ui.registry.addButton('for_toc_settings', {
            icon: 'settings',
            tooltip: 'TOC-Einstellungen',
            onAction: () => editor.execCommand('forTocSettings'),
        });

        editor.ui.registry.addButton('for_toc_remove', {
            icon: 'remove',
            tooltip: 'TOC entfernen',
            onAction: () => {
                const toc = getToc(editor);
                if (!toc) return;
                toc.parentNode?.removeChild(toc);
                editor.undoManager.add();
                editor.nodeChanged();
            },
        });

        let syncScheduled = false;
        const scheduleSync = (): void => {
            if (!getToc(editor)) return;
            if (syncScheduled) return;
            syncScheduled = true;
            setTimeout(() => {
                syncScheduled = false;
                syncToc(editor);
            }, 200);
        };

        editor.on('KeyUp Undo Redo SetContent', scheduleSync);

        editor.on('PreInit', () => {
            // id + class auf Headings sicherstellen, damit TOC-Anker (#for-toc-…)
            // nach dem initialen SetContent erhalten bleiben. Ohne das würde
            // TinyMCE id="…" auf h1-h6 strippen und die Backlinks aus dem TOC
            // würden ins Leere laufen.
            editor.schema.addValidElements(
                'nav[class|' + DATA_MIN + '|' + DATA_MAX + '|' + DATA_ORDERED + '|' + DATA_TITLE + '|contenteditable],' +
                'p[class|contenteditable],' +
                'ol[class],' +
                'ul[class],' +
                'li[class],' +
                'a[href|id|class|name|target|rel|title],' +
                'h1[id|class],' +
                'h2[id|class],' +
                'h3[id|class],' +
                'h4[id|class],' +
                'h5[id|class],' +
                'h6[id|class]'
            );
        });

        editor.on('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const link = target.closest('nav.' + TOC_CLASS + ' a[href^="#"]') as HTMLAnchorElement | null;
            if (!link) return;
            e.preventDefault();
            const href = link.getAttribute('href') ?? '';
            if (!href.startsWith('#')) return;
            const el = getBody(editor).querySelector(href);
            if (el) (el as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
        });

        editor.on('init', () => {
            const css = `
nav.for-toc { margin: 1.5em 0; padding: 0.75em 1em; border-left: 3px solid #c5c5c5; background: rgba(0,0,0,0.03); border-radius: 2px; }
nav.for-toc .for-toc__title { font-weight: 700; margin: 0 0 0.5em 0; }
nav.for-toc .for-toc__title__empty { color: #888; font-style: italic; margin: 0.25em 0 0 0; }
nav.for-toc ol.for-toc__list, nav.for-toc ul.for-toc__list { margin: 0 0 0 1.25em; padding: 0; }
nav.for-toc li.for-toc__item { margin: 0.1em 0; }
nav.for-toc li.for-toc__item--filler { list-style: none; }
nav.for-toc a { text-decoration: none; }
nav.for-toc a:hover { text-decoration: underline; }
/* Hierarchische Nummerierung (geordnete TOC, 1 / 1.1 / 1.1.1 …) */
nav.for-toc ol.for-toc__list { counter-reset: for-toc-item; list-style: none; padding-left: 0; margin-left: 1.25em; }
nav.for-toc ol.for-toc__list > li.for-toc__item { counter-increment: for-toc-item; display: flex; align-items: baseline; gap: 0.4em; }
nav.for-toc ol.for-toc__list > li.for-toc__item::before { content: counters(for-toc-item, ".") " "; flex: 0 0 auto; min-width: 2.2em; font-weight: 600; font-variant-numeric: tabular-nums; color: #333; white-space: nowrap; }
nav.for-toc ol.for-toc__list > li.for-toc__item--filler { counter-increment: none; display: list-item; }
nav.for-toc ol.for-toc__list > li.for-toc__item--filler::before { content: none; }
`;
            editor.dom.addStyle(css);
        });
    });
};

export default Plugin;
