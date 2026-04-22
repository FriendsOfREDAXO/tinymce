/* ==================================================================
 *  Footnotes plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Eigenständige, freie Implementierung – NICHT API-kompatibel mit
 *  dem kommerziellen Tiny-Premium-Plugin. Eigene Command-, Button-
 *  und CSS-Klassennamen (Prefix "for-"), damit es keine Verwechslung
 *  oder Marken-Kollision mit Tiny gibt.
 *
 *    Toolbar:       for_footnote_insert, for_footnote_update
 *    Menü (Insert): for_footnote
 *    Commands:      forFootnoteInsert, forFootnoteUpdate
 *
 *  HTML-Struktur (alles mit "for-" prefixed):
 *    <sup class="for-footnote-ref" id="for-fnref-<id>" data-for-fn-id="<id>">
 *      <a href="#for-fn-<id>">[n]</a>
 *    </sup>
 *    ...
 *    <div class="for-footnotes">
 *      <hr>
 *      <ol>
 *        <li id="for-fn-<id>" data-for-fn-id="<id>">
 *          <a class="for-footnote-back" href="#for-fnref-<id>">^</a>
 *          <span class="for-footnote-text">…</span>
 *        </li>
 *      </ol>
 *    </div>
 * ================================================================== */

declare const tinymce: any;

const SECTION_CLASS = 'for-footnotes';
const REF_CLASS = 'for-footnote-ref';
const BACK_CLASS = 'for-footnote-back';
const TEXT_CLASS = 'for-footnote-text';
const DATA_ATTR = 'data-for-fn-id';

function uid(): string {
    return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}

function getBody(editor: any): HTMLElement {
    return editor.getBody() as HTMLElement;
}

function getSection(editor: any): HTMLDivElement | null {
    return getBody(editor).querySelector('div.' + SECTION_CLASS) as HTMLDivElement | null;
}

function getOrCreateSection(editor: any): HTMLDivElement {
    let section = getSection(editor);
    if (section) return section;

    const body = getBody(editor);
    const doc = editor.getDoc() as Document;

    section = doc.createElement('div') as HTMLDivElement;
    section.className = SECTION_CLASS;

    const hr = doc.createElement('hr');
    const ol = doc.createElement('ol');
    section.appendChild(hr);
    section.appendChild(ol);

    body.appendChild(section);
    return section;
}

function getSectionList(section: HTMLDivElement): HTMLOListElement | null {
    return section.querySelector('ol');
}

function removeEmptySection(editor: any): void {
    const section = getSection(editor);
    if (!section) return;
    const ol = getSectionList(section);
    if (!ol || ol.children.length === 0) {
        section.parentNode?.removeChild(section);
    }
}

function collectRefsInOrder(editor: any): HTMLElement[] {
    const body = getBody(editor);
    const all = Array.from(
        body.querySelectorAll('sup.' + REF_CLASS + '[' + DATA_ATTR + ']')
    ) as HTMLElement[];
    return all.filter((el) => !el.closest('div.' + SECTION_CLASS));
}

function syncFootnotes(editor: any): void {
    const refs = collectRefsInOrder(editor);

    if (refs.length === 0) {
        removeEmptySection(editor);
        return;
    }

    const section = getOrCreateSection(editor);
    const ol = getSectionList(section);
    if (!ol) return;

    // Remove any stray <li> without our data-attr (e.g. an empty one created by Enter)
    Array.from(ol.children).forEach((child) => {
        if (child.tagName === 'LI' && !(child as HTMLElement).hasAttribute(DATA_ATTR)) {
            child.parentNode?.removeChild(child);
        }
    });

    const doc = editor.getDoc() as Document;

    // Ensure every ref has a stable id; remove *duplicate* refs that TinyMCE
    // may clone for selection/fake-caret purposes when the sup is clicked.
    const refIds: string[] = [];
    const seen = new Set<string>();
    refs.forEach((ref) => {
        let id = ref.getAttribute(DATA_ATTR) ?? '';
        if (id !== '' && seen.has(id)) {
            // duplicate clone -> remove it, don't create a new entry
            ref.parentNode?.removeChild(ref);
            return;
        }
        if (id === '') {
            id = uid();
            ref.setAttribute(DATA_ATTR, id);
        }
        seen.add(id);
        refIds.push(id);
    });

    // Index existing <li> entries by their fn id
    const existingEntries = new Map<string, HTMLLIElement>();
    Array.from(ol.querySelectorAll('li[' + DATA_ATTR + ']')).forEach((li) => {
        const id = (li as HTMLElement).getAttribute(DATA_ATTR);
        if (id !== null) existingEntries.set(id, li as HTMLLIElement);
    });

    // Create any missing entries (do NOT touch existing ones – that would lose the caret)
    refIds.forEach((id) => {
        if (existingEntries.has(id)) return;
        const li = doc.createElement('li');
        li.setAttribute(DATA_ATTR, id);
        li.id = 'for-fn-' + id;
        const back = doc.createElement('a');
        back.className = BACK_CLASS;
        back.setAttribute('href', '#for-fnref-' + id);
        back.setAttribute('contenteditable', 'false');
        back.textContent = '^';
        li.appendChild(back);
        li.appendChild(doc.createTextNode(' '));
        const span = doc.createElement('span');
        span.className = TEXT_CLASS;
        span.appendChild(doc.createElement('br'));
        li.appendChild(span);
        existingEntries.set(id, li);
        ol.appendChild(li);
    });

    // Remove orphan entries whose ref no longer exists
    const liveIdSet = new Set(refIds);
    existingEntries.forEach((li, id) => {
        if (!liveIdSet.has(id)) {
            li.parentNode?.removeChild(li);
            existingEntries.delete(id);
        }
    });

    // Reorder only when the current order does NOT already match refIds
    const currentOrder = Array.from(ol.querySelectorAll('li[' + DATA_ATTR + ']')).map(
        (li) => (li as HTMLElement).getAttribute(DATA_ATTR) ?? ''
    );
    const sameOrder =
        currentOrder.length === refIds.length &&
        currentOrder.every((id, i) => id === refIds[i]);

    if (!sameOrder) {
        refIds.forEach((id) => {
            const li = existingEntries.get(id);
            if (li) ol.appendChild(li); // appendChild moves existing node to end
        });
    }

    // Update refs (numbering, href, anchor text) – this is safe, refs are contenteditable=false
    refs.forEach((ref, index) => {
        const n = index + 1;
        const id = refIds[index];
        ref.id = 'for-fnref-' + id;
        ref.setAttribute('contenteditable', 'false');
        let a = ref.querySelector('a');
        if (!a) {
            a = doc.createElement('a');
            ref.innerHTML = '';
            ref.appendChild(a);
        }
        const newHref = '#for-fn-' + id;
        if (a.getAttribute('href') !== newHref) a.setAttribute('href', newHref);
        const newLabel = '[' + n + ']';
        if (a.textContent !== newLabel) a.textContent = newLabel;
    });

    // Update backlink href on existing entries (href points to the ref id)
    refIds.forEach((id) => {
        const li = existingEntries.get(id);
        if (!li) return;
        if (li.id !== 'for-fn-' + id) li.id = 'for-fn-' + id;
        const back = li.querySelector('a.' + BACK_CLASS) as HTMLAnchorElement | null;
        if (back) {
            const href = '#for-fnref-' + id;
            if (back.getAttribute('href') !== href) back.setAttribute('href', href);
        }
    });
}

function insertFootnote(editor: any): void {
    const doc = editor.getDoc() as Document;
    const id = uid();

    const sup = doc.createElement('sup');
    sup.className = REF_CLASS;
    sup.setAttribute(DATA_ATTR, id);
    sup.setAttribute('contenteditable', 'false');
    sup.id = 'for-fnref-' + id;

    const a = doc.createElement('a');
    a.setAttribute('href', '#for-fn-' + id);
    a.textContent = '[?]';
    sup.appendChild(a);

    editor.selection.collapse(false);
    editor.selection.setNode(sup);

    const parent = sup.parentNode;
    if (parent) {
        const space = doc.createTextNode('\u00A0');
        parent.insertBefore(space, sup.nextSibling);
        const rng = doc.createRange();
        rng.setStartAfter(space);
        rng.collapse(true);
        editor.selection.setRng(rng);
    }

    syncFootnotes(editor);

    const entry = getBody(editor).querySelector(
        'li[' + DATA_ATTR + '="' + id + '"] .' + TEXT_CLASS
    ) as HTMLElement | null;
    if (entry) {
        const rng = doc.createRange();
        rng.selectNodeContents(entry);
        rng.collapse(true);
        editor.selection.setRng(rng);
        editor.focus();
    }

    editor.undoManager.add();
    editor.nodeChanged();
}

/* ================================================================== */

const Plugin = (): void => {
    tinymce.PluginManager.add('for_footnotes', (editor: any): void => {
        editor.addCommand('forFootnoteInsert', () => insertFootnote(editor));
        editor.addCommand('forFootnoteUpdate', () => {
            syncFootnotes(editor);
            editor.undoManager.add();
        });

        editor.ui.registry.addIcon(
            'for-footnote',
            '<svg width="24" height="24" viewBox="0 0 24 24"><text x="4" y="15" font-family="sans-serif" font-size="10" font-weight="700">fn</text><text x="15" y="10" font-family="sans-serif" font-size="7" font-weight="700">1</text></svg>'
        );

        editor.ui.registry.addButton('for_footnote_insert', {
            icon: 'for-footnote',
            tooltip: 'Fußnote einfügen',
            onAction: () => editor.execCommand('forFootnoteInsert'),
        });

        editor.ui.registry.addButton('for_footnote_update', {
            icon: 'reload',
            tooltip: 'Fußnoten aktualisieren',
            onAction: () => editor.execCommand('forFootnoteUpdate'),
        });

        editor.ui.registry.addMenuItem('for_footnote', {
            icon: 'for-footnote',
            text: 'Fußnote',
            onAction: () => editor.execCommand('forFootnoteInsert'),
        });

        let syncScheduled = false;
        const scheduleSync = (): void => {
            if (syncScheduled) return;
            syncScheduled = true;
            setTimeout(() => {
                syncScheduled = false;
                syncFootnotes(editor);
            }, 80);
        };

        editor.on('KeyUp Undo Redo SetContent', scheduleSync);

        // Convert Enter inside a footnote <li> into a soft-break <br> so the user
        // doesn't accidentally create a new empty (un-linked) list item.
        editor.on('keydown', (e: KeyboardEvent) => {
            if (e.key !== 'Enter' || e.shiftKey) return;
            const node = editor.selection.getNode() as HTMLElement | null;
            if (!node) return;
            const li = node.closest('li[' + DATA_ATTR + ']');
            if (!li) return;
            if (!li.closest('div.' + SECTION_CLASS)) return;
            e.preventDefault();
            editor.execCommand('InsertLineBreak');
        });

        editor.on('PreInit', () => {
            editor.schema.addValidElements(
                'sup[class|id|' + DATA_ATTR + '|contenteditable],' +
                'div[class],' +
                'a[class|href|contenteditable],' +
                'li[id|' + DATA_ATTR + '],' +
                'span[class]'
            );
        });

        editor.on('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const ref = target.closest('sup.' + REF_CLASS) as HTMLElement | null;
            if (ref) {
                e.preventDefault();
                const id = ref.getAttribute(DATA_ATTR);
                if (id === null) return;
                const entry = getBody(editor).querySelector('#for-fn-' + CSS.escape(id));
                if (entry) (entry as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
                return;
            }

            const back = target.closest('a.' + BACK_CLASS) as HTMLElement | null;
            if (back) {
                e.preventDefault();
                const href = back.getAttribute('href') ?? '';
                if (href.startsWith('#')) {
                    const el = getBody(editor).querySelector(href);
                    if (el) (el as HTMLElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }
        });

        editor.on('init', () => {
            const css = `
div.for-footnotes { margin-top: 2em; font-size: 0.9em; }
div.for-footnotes hr { margin-inline-end: auto; margin-inline-start: 0; width: 25%; border: 0; border-top: 1px solid #ccc; }
div.for-footnotes li > a.for-footnote-back { text-decoration: none; margin-right: 0.35em; color: #888; }
div.for-footnotes li > a.for-footnote-back:hover { color: #000; }
sup.for-footnote-ref a { text-decoration: none; }
sup.for-footnote-ref { cursor: pointer; }
`;
            editor.dom.addStyle(css);
        });
    });
};

export default Plugin;
