/* ==================================================================
 *  Markdown plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Dialog-basierter Markdown → HTML Konverter. Kein Autodetect,
 *  keine Paste-Interception. Der Nutzer ruft bewusst den Dialog
 *  auf, fügt Markdown ein und das Ergebnis wird als HTML in den
 *  Editor eingesetzt.
 *
 *    Plugin-Name:   for_markdown
 *    Toolbar:       for_markdown_paste
 *    Menü (Insert): for_markdown_paste
 *
 *  Features (CommonMark + GFM-Dialekte):
 *    - Tables, Autolinks (linkify), SmartQuotes (typographer),
 *      harte Zeilenumbrüche (breaks), fenced Code
 *    - Tasklisten:   - [ ] / - [x]  →  <ul class="for-checklist
 *                     for-checklist--feature"><li class=
 *                     "for-checklist__item" data-checked="…">…</li></ul>
 *    - Code Blocks:  ```lang …```   →  <pre class="language-lang">
 *                                         <code>…</code></pre>
 *                     (TinyMCE codesample-kompatibel)
 *
 *  Namespace kollisionsfrei zum markdowneditor-AddOn:
 *  alle Klassen/IDs/Commands/Buttons leben unter
 *  for_markdown* / for-markdown-*.
 * ================================================================== */

import MarkdownIt from 'markdown-it';

declare const tinymce: any;

// --------------------------------------------------------------
//  Markdown-it Konfiguration
// --------------------------------------------------------------
function createRenderer(): MarkdownIt {
    const md: MarkdownIt = new MarkdownIt({
        html: false,
        xhtmlOut: false,
        breaks: true,
        linkify: true,
        typographer: true,
    });

    // Fenced Code → TinyMCE-codesample-kompatibles Markup
    md.renderer.rules.fence = (tokens, idx) => {
        const token = tokens[idx];
        const info = (token.info || '').trim().split(/\s+/)[0];
        const lang = info || 'markup';
        const escaped = md.utils.escapeHtml(token.content);
        return `<pre class="language-${lang}"><code>${escaped}</code></pre>\n`;
    };

    return md;
}

// --------------------------------------------------------------
//  Tasklist-Post-Processing:
//  markdown-it rendert `- [ ] foo` als `<li>[ ] foo</li>`.
//  Wir erkennen genau diese Muster am Beginn von <li>-Items in
//  einer <ul> und rewriten die Liste zu for-checklist-Markup.
// --------------------------------------------------------------
const TASK_OPEN = /^\s*\[( |x|X)\]\s?/;

function convertTasklists(root: HTMLElement): void {
    const lists = Array.from(root.querySelectorAll('ul'));
    lists.forEach((ul) => {
        const items = Array.from(ul.querySelectorAll(':scope > li'));
        if (items.length === 0) {
            return;
        }
        // Mindestens ein Item muss tasklist-Syntax zeigen,
        // sonst wird die ul unverändert gelassen.
        const taskish = items.map((li) => {
            const first = firstTextNode(li);
            if (!first) { return null; }
            const m = first.nodeValue && first.nodeValue.match(TASK_OPEN);
            return m ? { li, textNode: first, match: m } : null;
        });

        if (!taskish.some(Boolean)) {
            return;
        }

        ul.classList.add('for-checklist');
        ul.classList.add('for-checklist--feature');

        taskish.forEach((entry, idx) => {
            const li = items[idx];
            if (!entry) {
                // Nicht-Tasklist-Eintrag innerhalb einer Tasklist:
                // als "unchecked" behandeln, Marker bleibt weg.
                li.className = 'for-checklist__item';
                li.setAttribute('data-checked', 'false');
                return;
            }
            const checked = entry.match[1].toLowerCase() === 'x';
            // Marker-Text ("[ ] " / "[x] ") aus dem Textnode entfernen
            entry.textNode.nodeValue = (entry.textNode.nodeValue || '').replace(TASK_OPEN, '');
            li.className = 'for-checklist__item';
            li.setAttribute('data-checked', checked ? 'true' : 'false');
        });
    });
}

/** Liefert den ersten „echten" Textnode innerhalb eines Elements (für Tasklist-Marker). */
function firstTextNode(el: Element): Text | null {
    // Paragraph-wrapped items: markdown-it kann <li><p>…</p></li> erzeugen.
    // Wir steigen rekursiv in das erste Element ab, bis ein Text kommt.
    let current: Node | null = el.firstChild;
    while (current) {
        if (current.nodeType === Node.TEXT_NODE) {
            if ((current.nodeValue || '').trim() === '') {
                current = current.nextSibling;
                continue;
            }
            return current as Text;
        }
        if (current.nodeType === Node.ELEMENT_NODE) {
            const inner = firstTextNode(current as Element);
            if (inner) { return inner; }
        }
        current = current.nextSibling;
    }
    return null;
}

// --------------------------------------------------------------
//  Konvertierung: Markdown-String → HTML-String
// --------------------------------------------------------------
function convertMarkdown(md: MarkdownIt, source: string): string {
    const rawHtml = md.render(source || '');
    // Post-Processing über ein Offscreen-Element
    const container = document.createElement('div');
    container.innerHTML = rawHtml;
    convertTasklists(container);
    return container.innerHTML;
}

// --------------------------------------------------------------
//  Plugin-Registrierung
// --------------------------------------------------------------
export default function Plugin(): void {
    if (typeof tinymce === 'undefined' || !tinymce.PluginManager) {
        return;
    }

    tinymce.PluginManager.add('for_markdown', (editor: any) => {
        const renderer = createRenderer();

        const openDialog = (): void => {
            editor.windowManager.open({
                title: 'Markdown einfügen',
                size: 'large',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'htmlpanel',
                            html:
                                '<p style="margin:0 0 .5em 0;color:#666;font-size:12px;">' +
                                'Markdown einfügen (CommonMark + GFM). Tasklisten werden zu ' +
                                'Feature-Checklisten, fenced Code wird als Codesample eingesetzt.' +
                                '</p>',
                        },
                        {
                            type: 'textarea',
                            name: 'markdown',
                            label: 'Markdown',
                            maximized: true,
                        },
                    ],
                },
                buttons: [
                    { type: 'cancel', text: 'Abbrechen' },
                    { type: 'submit', text: 'Einfügen', primary: true },
                ],
                initialData: { markdown: '' },
                onSubmit: (api: any) => {
                    const data = api.getData();
                    const html = convertMarkdown(renderer, String(data.markdown || ''));
                    if (html) {
                        editor.insertContent(html);
                    }
                    api.close();
                },
            });
        };

        editor.ui.registry.addIcon(
            'for-markdown',
            // Monochromes Markdown-Mark (vereinfacht)
            '<svg width="24" height="24" viewBox="0 0 24 24">' +
                '<path d="M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm2 3v6h2v-3.5L9 14l2-2.5V15h2V9h-2l-2 2.5L7 9H5zm12 0v3h-2l3 3 3-3h-2V9h-2z" fill="currentColor"/>' +
                '</svg>'
        );

        editor.ui.registry.addButton('for_markdown_paste', {
            icon: 'for-markdown',
            tooltip: 'Markdown einfügen',
            onAction: openDialog,
        });

        editor.ui.registry.addMenuItem('for_markdown_paste', {
            icon: 'for-markdown',
            text: 'Markdown einfügen\u2026',
            onAction: openDialog,
        });

        editor.addCommand('forMarkdownOpenDialog', openDialog);

        return {
            getMetadata: () => ({
                name: 'for_markdown',
                url: 'https://friendsofredaxo.github.io/tinymce/',
            }),
        };
    });
}
