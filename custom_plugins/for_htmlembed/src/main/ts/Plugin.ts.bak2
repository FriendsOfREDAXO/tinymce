/* ==================================================================
 *  HTML-Embed plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Geschützte HTML-/JS-Einbettung – ideal für Widgets, Tracking-
 *  Pixel, Social-Embeds, iframes. Redakteure können den Block als
 *  Ganzes verschieben/löschen, aber nicht versehentlich im Text
 *  zerschießen.
 *
 *  Struktur im gespeicherten HTML (bleibt so im Save-Output):
 *    <div class="for-htmlembed" contenteditable="false">
 *      <!-- beliebiger HTML/JS/style-Code -->
 *    </div>
 *
 *  Im Editor:
 *    - Rahmen + Badge ("HTML/JS-Embed") rein per CSS (::before)
 *    - Dialog öffnet per Toolbar-Button, Doppelklick oder Edit-Button
 *
 *  Toolbar:  for_htmlembed
 *  Menü:     for_htmlembed (Einfügen)
 *  Commands: forHtmlEmbedInsert, forHtmlEmbedEdit
 * ================================================================== */

declare const tinymce: any;

const WRAPPER_CLASS = 'for-htmlembed';
const DIALOG_TITLE = 'HTML-/JS-Einbettung';

/**
 * Editor-Chrome (Rahmen + Badge) nur im Editor-Iframe.
 * Im Frontend hat der Wrapper keine besondere Bedeutung.
 */
const EDITOR_CSS = `
.${WRAPPER_CLASS} {
    position: relative;
    display: block;
    margin: 1em 0;
    padding: 2.2em 1em 1em 1em;
    border: 2px dashed #b5bcc7;
    border-radius: 8px;
    background: repeating-linear-gradient(
        45deg,
        rgba(47, 128, 237, 0.03),
        rgba(47, 128, 237, 0.03) 10px,
        rgba(47, 128, 237, 0.06) 10px,
        rgba(47, 128, 237, 0.06) 20px
    );
    color: #555;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.85em;
    line-height: 1.4;
    cursor: pointer;
    overflow: hidden;
    min-height: 3em;
}
.${WRAPPER_CLASS}::before {
    content: "⟨/⟩  " attr(data-for-embed-label);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.3em 0.75em;
    background: #2f80ed;
    color: #fff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    pointer-events: none;
}
.${WRAPPER_CLASS}:hover {
    border-color: #2f80ed;
}
.${WRAPPER_CLASS}.mce-content-body[data-mce-selected] {
    outline: 2px solid #2f80ed !important;
    outline-offset: 2px;
}
/* Inhalt selbst im Editor nicht interaktiv – nur als Preview */
.${WRAPPER_CLASS} * {
    pointer-events: none !important;
}
/* Script/style-Tags im Editor sichtbar machen (werden sonst unsichtbar) */
.${WRAPPER_CLASS} script,
.${WRAPPER_CLASS} style {
    display: block !important;
    white-space: pre-wrap;
    color: #666;
}
.${WRAPPER_CLASS} script::before {
    content: "<script>\\A";
    white-space: pre;
    color: #2f80ed;
}
.${WRAPPER_CLASS} style::before {
    content: "<style>\\A";
    white-space: pre;
    color: #2f80ed;
}
`;

/**
 * Erzeugt einen Preview-Text aus dem Code für das Badge-Label
 * (z. B. "script 248 Zeichen" oder "iframe" oder "HTML").
 */
function buildLabel(code: string): string {
    const trimmed = code.trim();
    if (!trimmed) return DIALOG_TITLE;
    // Erster Tag?
    const tagMatch = trimmed.match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)\b/);
    const kind = tagMatch ? tagMatch[1].toLowerCase() : 'html';
    const size = trimmed.length;
    return `${kind} · ${size} Zeichen`;
}

function openDialog(editor: any, existingCode: string, onSubmit: (code: string) => void): void {
    const dialogApi = editor.windowManager.open({
        title: DIALOG_TITLE,
        size: 'large',
        body: {
            type: 'panel',
            items: [
                {
                    type: 'textarea',
                    name: 'code',
                    label: 'HTML, JavaScript oder CSS',
                    maximized: true
                }
            ]
        },
        initialData: { code: existingCode },
        buttons: [
            { type: 'cancel', text: 'Abbrechen' },
            { type: 'submit', text: 'Übernehmen', primary: true }
        ],
        onSubmit: (api: any) => {
            const data = api.getData();
            onSubmit((data.code || '').toString());
            api.close();
        }
    });

    // Nach Dialog-Render: Klasse für Code-AddOn-Editor + monospace setzen.
    // Das REDAXO code-AddOn injiziert seinen Editor an Textareas mit der
    // Klasse "rex-js-code-editor". Wir setzen zusätzlich monospace als Fallback.
    setTimeout(() => {
        try {
            const dlgRoot = typeof dialogApi.getEl === 'function' ? dialogApi.getEl() as HTMLElement | null : null;
            const textarea = dlgRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
            if (textarea) {
                textarea.classList.add('rex-js-code-editor');
                textarea.setAttribute('data-mode', 'htmlmixed');
                textarea.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
                textarea.style.fontSize = '13px';
                textarea.style.lineHeight = '1.5';
                textarea.spellcheck = false;
            }
        } catch (_e) { /* noop */ }
    }, 30);
}

/**
 * Findet das umschließende for-htmlembed-Element zum aktuellen Cursor/Klick.
 */
function findEmbed(editor: any, node?: Element | null): HTMLElement | null {
    const target = node || editor.selection.getNode();
    return editor.dom.getParent(target, `div.${WRAPPER_CLASS}`) as HTMLElement | null;
}

function insertEmbed(editor: any, code: string): void {
    const trimmed = code.trim();
    if (!trimmed) return;

    const label = buildLabel(trimmed);
    const wrapperHtml =
        `<div class="${WRAPPER_CLASS}" contenteditable="false" data-for-embed-label="${editor.dom.encode(label)}">` +
        trimmed +
        '</div><p>&nbsp;</p>';

    editor.undoManager.transact(() => {
        editor.insertContent(wrapperHtml);
    });
    editor.nodeChanged();
}

function updateEmbed(editor: any, wrapper: HTMLElement, code: string): void {
    const trimmed = code.trim();
    if (!trimmed) {
        // Leerer Inhalt → Embed entfernen
        editor.undoManager.transact(() => {
            wrapper.parentNode?.removeChild(wrapper);
        });
        editor.nodeChanged();
        return;
    }

    editor.undoManager.transact(() => {
        wrapper.innerHTML = trimmed;
        wrapper.setAttribute('data-for-embed-label', buildLabel(trimmed));
        // Sicherheitsnetz: contenteditable-Schutz wieder herstellen
        wrapper.setAttribute('contenteditable', 'false');
    });
    editor.nodeChanged();
}

/**
 * Holt den aktuellen Code aus einem Embed-Wrapper.
 */
function readEmbedCode(wrapper: HTMLElement): string {
    return wrapper.innerHTML.trim();
}

const Plugin = (): void => {
    tinymce.PluginManager.add('for_htmlembed', (editor: any) => {
        // --- Safety off für script/iframe/style innerhalb unseres Wrappers ---
        // TinyMCE v8 sanitisiert standardmäßig <script>/on*-Attribute. Da dieses
        // Plugin explizit für eingebetteten Code existiert, deaktivieren wir die
        // XSS-Sanitization editorweit. Wer das nicht möchte, bindet das Plugin
        // einfach nicht ein.
        try {
            editor.options.set('xss_sanitization', false);
            editor.options.set('allow_script_urls', true);
        } catch (_e) { /* noop – ältere API */ }

        // --- Schema: div mit contenteditable + script/iframe/style erlauben ---
        editor.on('PreInit', () => {
            const schema = editor.schema;

            // div-Attribute class + contenteditable + data-for-embed-label freigeben
            const divRule = schema.getElementRule('div');
            if (divRule) {
                divRule.attributes.class = {};
                divRule.attributes.contenteditable = {};
                divRule.attributes['data-for-embed-label'] = {};
                divRule.attributesOrder = divRule.attributesOrder || [];
                ['class', 'contenteditable', 'data-for-embed-label'].forEach((a) => {
                    if (divRule.attributesOrder.indexOf(a) === -1) {
                        divRule.attributesOrder.push(a);
                    }
                });
            }

            // script, iframe, style, noscript als valide Elemente registrieren
            try {
                schema.addValidElements('script[type|src|async|defer|*]');
                schema.addValidElements('iframe[src|width|height|frameborder|allow|allowfullscreen|sandbox|loading|referrerpolicy|*]');
                schema.addValidElements('style[type|media]');
                schema.addValidElements('noscript');
                // Diese Elemente als Kinder von div erlauben
                schema.addValidChildren('+div[script|iframe|style|noscript]');
            } catch (_e) { /* noop */ }
        });

        // --- Editor-Styles injizieren ---
        editor.on('init', () => {
            try { editor.dom.addStyle(EDITOR_CSS); } catch (_e) { /* noop */ }
        });

        // --- Schutz beim SetContent: sicherstellen, dass contenteditable=false gesetzt bleibt ---
        editor.on('SetContent', () => {
            const body = editor.getBody() as HTMLElement;
            body.querySelectorAll(`div.${WRAPPER_CLASS}`).forEach((el) => {
                if (el.getAttribute('contenteditable') !== 'false') {
                    el.setAttribute('contenteditable', 'false');
                }
                if (!el.hasAttribute('data-for-embed-label')) {
                    el.setAttribute('data-for-embed-label', buildLabel(el.innerHTML));
                }
            });
        });

        // --- Doppelklick öffnet Edit-Dialog ---
        editor.on('dblclick', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const wrapper = findEmbed(editor, target);
            if (!wrapper) return;
            e.preventDefault();
            e.stopPropagation();
            openDialog(editor, readEmbedCode(wrapper), (code) => updateEmbed(editor, wrapper, code));
        });

        // --- Commands ---
        editor.addCommand('forHtmlEmbedInsert', () => {
            const existing = findEmbed(editor);
            if (existing) {
                openDialog(editor, readEmbedCode(existing), (code) => updateEmbed(editor, existing, code));
            } else {
                openDialog(editor, '', (code) => insertEmbed(editor, code));
            }
        });

        editor.addCommand('forHtmlEmbedEdit', () => {
            const existing = findEmbed(editor);
            if (!existing) return;
            openDialog(editor, readEmbedCode(existing), (code) => updateEmbed(editor, existing, code));
        });

        // --- Icon ---
        editor.ui.registry.addIcon(
            'for-htmlembed',
            '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.5 10l-2.5 2 2.5 2M14.5 10l2.5 2-2.5 2M13 9l-2 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        );

        // --- Toolbar-Button ---
        editor.ui.registry.addToggleButton('for_htmlembed', {
            icon: 'for-htmlembed',
            tooltip: 'HTML-/JS-Einbettung',
            onAction: () => editor.execCommand('forHtmlEmbedInsert'),
            onSetup: (api: any) => {
                const handler = () => api.setActive(!!findEmbed(editor));
                editor.on('NodeChange', handler);
                return () => editor.off('NodeChange', handler);
            }
        });

        // --- Menu-Eintrag ---
        editor.ui.registry.addMenuItem('for_htmlembed', {
            icon: 'for-htmlembed',
            text: 'HTML-/JS-Einbettung einfügen',
            onAction: () => editor.execCommand('forHtmlEmbedInsert')
        });

        // --- Kontextmenü auf dem Embed: Bearbeiten / Entfernen ---
        editor.ui.registry.addContextToolbar('for_htmlembed_context', {
            predicate: (node: Node) => {
                const el = node as HTMLElement;
                return !!(el && el.nodeType === 1 && el.classList && el.classList.contains(WRAPPER_CLASS));
            },
            items: 'for_htmlembed_edit for_htmlembed_remove',
            position: 'node',
            scope: 'node'
        });

        editor.ui.registry.addButton('for_htmlembed_edit', {
            icon: 'edit-block',
            tooltip: 'Code bearbeiten',
            onAction: () => editor.execCommand('forHtmlEmbedEdit')
        });

        editor.ui.registry.addButton('for_htmlembed_remove', {
            icon: 'remove',
            tooltip: 'Einbettung entfernen',
            onAction: () => {
                const wrapper = findEmbed(editor);
                if (!wrapper) return;
                editor.undoManager.transact(() => {
                    wrapper.parentNode?.removeChild(wrapper);
                });
                editor.nodeChanged();
            }
        });

        return {
            getMetadata: () => ({
                name: 'FriendsOfREDAXO HTML Embed',
                url: 'https://github.com/FriendsOfREDAXO/tinymce'
            })
        };
    });
};

export default Plugin;
