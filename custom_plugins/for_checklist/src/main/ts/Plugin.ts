/* ==================================================================
 *  Checklist plugin for TinyMCE (FriendsOfREDAXO)
 *  -------------------------------------------------------------
 *  Freie Implementierung einer Checkliste mit modernem CSS-Look
 *  (Pseudo-Element Checkboxen, keine Form-Inputs).
 *
 *    Toolbar:       for_checklist
 *    Menü (Format): for_checklist
 *    Commands:      forChecklistToggle
 *
 *  HTML-Format (schlank, semantisch sauber):
 *    <ul class="for-checklist">
 *      <li class="for-checklist__item" data-checked="true|false">Text</li>
 *    </ul>
 *
 *  CKEditor-5-Import: Beim SetContent/Paste werden ul.todo-list
 *  automatisch in ul.for-checklist umgewandelt – inkl. Übernahme
 *  des checked-Status aus dem input[type=checkbox].
 * ================================================================== */

declare const tinymce: any;

const LIST_CLASS = 'for-checklist';
const ITEM_CLASS = 'for-checklist__item';
const DATA_ATTR = 'data-checked';

/**
 * Wandelt CKE5 todo-list-Strukturen in unser Format um.
 *  Eingabe: <ul class="todo-list"><li><label class="todo-list__label">
 *            <input type="checkbox" [checked]><span class="todo-list__label__description">…</span>
 *           </label></li></ul>
 *  Ausgabe: <ul class="for-checklist"><li class="for-checklist__item" data-checked="…">…</li></ul>
 */
function convertCke5(root: Element): void {
    const lists = root.querySelectorAll('ul.todo-list');
    lists.forEach((ul) => {
        ul.classList.remove('todo-list');
        ul.classList.add(LIST_CLASS);

        const items = ul.querySelectorAll(':scope > li');
        items.forEach((li) => {
            const label = li.querySelector(':scope > label.todo-list__label') as HTMLElement | null;
            let checked = false;
            let innerHtml = '';

            if (label) {
                const input = label.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
                checked = !!(input && (input.hasAttribute('checked') || input.checked));
                const desc = label.querySelector('.todo-list__label__description') as HTMLElement | null;
                innerHtml = desc ? desc.innerHTML : label.textContent || '';
            } else {
                // Fallback: Inhalt übernehmen, ggf. vorhandene inputs entfernen
                const clone = li.cloneNode(true) as HTMLElement;
                clone.querySelectorAll('input[type="checkbox"]').forEach((i) => i.remove());
                innerHtml = clone.innerHTML;
            }

            li.className = ITEM_CLASS;
            li.setAttribute(DATA_ATTR, checked ? 'true' : 'false');
            li.innerHTML = innerHtml;
        });
    });
}

/**
 * Wandelt aktuelle Selektion / Absatz in eine for-checklist um,
 * bzw. entfernt die Checklist-Auszeichnung wieder (Toggle).
 *
 * Varianten:
 *   - 'todo'     (Default): Erledigte Einträge werden durchgestrichen + ausgegraut.
 *   - 'feature': Erledigte Einträge bleiben farblich neutral (für Feature-/Benefit-Listen).
 *                Standardmäßig sind alle Einträge direkt als „checked" markiert.
 */
type ChecklistVariant = 'todo' | 'feature';
const VARIANT_CLASS: Record<ChecklistVariant, string> = {
    todo: '',
    feature: 'for-checklist--feature'
};

function getListVariant(ul: HTMLElement): ChecklistVariant {
    return ul.classList.contains(VARIANT_CLASS.feature) ? 'feature' : 'todo';
}

function toggleChecklist(editor: any, variant: ChecklistVariant = 'todo'): void {
    const dom = editor.dom;
    const selection = editor.selection;
    const node = selection.getNode() as HTMLElement;

    // Bereits in einer Checklist? → entweder Variante umschalten oder in Absätze zurück
    const existingItem = dom.getParent(node, `li.${ITEM_CLASS}`) as HTMLLIElement | null;
    if (existingItem) {
        const list = existingItem.parentElement as HTMLUListElement | null;
        if (list && list.classList.contains(LIST_CLASS)) {
            const currentVariant = getListVariant(list);
            if (currentVariant === variant) {
                // Gleicher Button → komplett auflösen
                const doc = editor.getDoc() as Document;
                const frag = doc.createDocumentFragment();
                Array.from(list.children).forEach((li) => {
                    const p = doc.createElement('p');
                    p.innerHTML = (li as HTMLElement).innerHTML;
                    frag.appendChild(p);
                });
                list.parentNode?.replaceChild(frag, list);
            } else {
                // Andere Variante → nur Modifier-Klasse umsetzen
                list.classList.remove(VARIANT_CLASS.feature);
                if (VARIANT_CLASS[variant]) {
                    list.classList.add(VARIANT_CLASS[variant]);
                }
            }
            editor.nodeChanged();
            return;
        }
    }

    // Ansonsten: Ausgewählte Blöcke sammeln und in Checklist umwandeln
    const blocks: HTMLElement[] = selection.getSelectedBlocks();
    if (!blocks || blocks.length === 0) return;

    const doc = editor.getDoc() as Document;
    const ul = doc.createElement('ul');
    ul.className = LIST_CLASS + (VARIANT_CLASS[variant] ? ' ' + VARIANT_CLASS[variant] : '');

    // Feature-Liste: Einträge standardmäßig als "erfüllt" markieren (= grüner Check).
    const defaultChecked = variant === 'feature' ? 'true' : 'false';

    blocks.forEach((block) => {
        const li = doc.createElement('li');
        li.className = ITEM_CLASS;
        li.setAttribute(DATA_ATTR, defaultChecked);
        li.innerHTML = block.innerHTML || '&nbsp;';
        ul.appendChild(li);
    });

    const first = blocks[0];
    first.parentNode?.insertBefore(ul, first);
    blocks.forEach((b) => b.parentNode?.removeChild(b));

    editor.selection.select(ul.firstElementChild as Element, true);
    editor.selection.collapse(false);
    editor.nodeChanged();
}

/**
 * Prüft, ob ein Klick in der „Checkbox-Zone" (vor dem Text) liegt.
 * Die visuelle Checkbox wird per ::before gerendert – wir erkennen
 * Klicks links vom Textinhalt am horizontalen Offset.
 */
function isCheckboxClick(li: HTMLLIElement, clientX: number): boolean {
    const rect = li.getBoundingClientRect();
    const style = li.ownerDocument?.defaultView?.getComputedStyle(li);
    const paddingLeft = style ? parseFloat(style.paddingLeft) || 0 : 0;
    // Klick innerhalb der linken Padding-Zone (dort lebt ::before)
    return clientX - rect.left <= paddingLeft + 4;
}

/**
 * Inline-Styles für den Editor-Iframe. Das Frontend-CSS (assets/css/for_checklist.css)
 * greift dort nicht automatisch – deshalb injizieren wir die Kernregeln direkt.
 * Alle Werte per CSS-Variable überschreibbar; Defaults matchen das Frontend-CSS.
 */
const EDITOR_CSS = `
ul.for-checklist {
    list-style: none;
    padding-left: 1.75em;
    margin: 0.5em 0;
}
ul.for-checklist li.for-checklist__item {
    position: relative;
    margin: 0.25em 0;
    padding-left: calc(1.15em + 0.35em);
    color: inherit;
}
ul.for-checklist li.for-checklist__item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.15em;
    width: 1.15em;
    height: 1.15em;
    box-sizing: border-box;
    border: 1.5px solid #b5bcc7;
    border-radius: 6px;
    background-color: transparent;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 72% 72%;
    transition: background-color .15s ease, border-color .15s ease;
    cursor: pointer;
}
ul.for-checklist li.for-checklist__item:hover::before {
    border-color: #7a8595;
}
ul.for-checklist li.for-checklist__item[data-checked="true"]::before {
    background-color: #2f80ed;
    border-color: #2f80ed;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3.5 8.5l3 3 6-6.5'/></svg>");
}
ul.for-checklist li.for-checklist__item[data-checked="true"] {
    color: #8a8f99;
    text-decoration: line-through;
}
/* Feature-Liste: keine Durchstreichung, volle Farbe, grüner Check */
ul.for-checklist.for-checklist--feature li.for-checklist__item[data-checked="true"] {
    color: inherit;
    text-decoration: none;
}
ul.for-checklist.for-checklist--feature li.for-checklist__item[data-checked="true"]::before {
    background-color: #22c55e;
    border-color: #22c55e;
}
ul.for-checklist.for-checklist--feature li.for-checklist__item[data-checked="false"]::before {
    border-style: dashed;
}
`;

const Plugin = (): void => {
    tinymce.PluginManager.add('for_checklist', (editor: any) => {
        // --- Editor-Iframe Styles injizieren ---
        editor.on('init', () => {
            try {
                editor.dom.addStyle(EDITOR_CSS);
            } catch (_e) { /* noop */ }
        });

        // --- Schema: Klassen + data-checked erlauben ---
        editor.on('PreInit', () => {
            const schema = editor.schema;
            const ulRule = schema.getElementRule('ul');
            if (ulRule) {
                ulRule.attributes.class = {};
                ulRule.attributesOrder = ulRule.attributesOrder || [];
                if (ulRule.attributesOrder.indexOf('class') === -1) {
                    ulRule.attributesOrder.push('class');
                }
            }
            const liRule = schema.getElementRule('li');
            if (liRule) {
                liRule.attributes.class = {};
                liRule.attributes[DATA_ATTR] = {};
                liRule.attributesOrder = liRule.attributesOrder || [];
                ['class', DATA_ATTR].forEach((a) => {
                    if (liRule.attributesOrder.indexOf(a) === -1) {
                        liRule.attributesOrder.push(a);
                    }
                });
            }
        });

        // --- CKE5-Import bei SetContent und Paste ---
        editor.on('SetContent', () => {
            try {
                convertCke5(editor.getBody());
            } catch (_e) { /* noop */ }
        });

        editor.on('PastePostProcess', (e: any) => {
            if (e && e.node) {
                try { convertCke5(e.node); } catch (_err) { /* noop */ }
            }
        });

        editor.on('BeforeSetContent', (e: any) => {
            if (e && typeof e.content === 'string' && e.content.indexOf('todo-list') !== -1) {
                // leichte HTML-Vor-Konvertierung, damit der TinyMCE-Parser saubere Attribute sieht
                e.content = e.content.replace(/class="todo-list"/g, `class="${LIST_CLASS}"`);
            }
        });

        // --- Klick-Handler: Toggle der Checkbox ---
        editor.on('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const li = target.closest(`li.${ITEM_CLASS}`) as HTMLLIElement | null;
            if (!li) return;
            if (!isCheckboxClick(li, e.clientX)) return;

            e.preventDefault();
            e.stopPropagation();

            const current = li.getAttribute(DATA_ATTR) === 'true';
            editor.undoManager.transact(() => {
                li.setAttribute(DATA_ATTR, current ? 'false' : 'true');
            });
            editor.nodeChanged();
        });

        // --- Command ---
        // --- Command(s) ---
        editor.addCommand('forChecklistToggle', (_ui: any, value?: any) => {
            const variant: ChecklistVariant = value === 'feature' ? 'feature' : 'todo';
            toggleChecklist(editor, variant);
        });

        // --- Icons (modern: abgerundete Checkbox + Häkchen) ---
        editor.ui.registry.addIcon(
            'for-checklist',
            '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        );
        editor.ui.registry.addIcon(
            'for-checklist-feature',
            '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.3l2.7 2.7L16.2 9.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        );

        // Helper: Active-State abhängig von Variante
        const activeForVariant = (variant: ChecklistVariant) => () => {
            const n = editor.selection.getNode();
            const ul = editor.dom.getParent(n, `ul.${LIST_CLASS}`) as HTMLElement | null;
            return !!ul && getListVariant(ul) === variant;
        };

        // --- Button + Menu: Todo-Checkliste ---
        editor.ui.registry.addToggleButton('for_checklist', {
            icon: 'for-checklist',
            tooltip: 'Checkliste (To-Do)',
            onAction: () => editor.execCommand('forChecklistToggle', false, 'todo'),
            onSetup: (api: any) => {
                const check = activeForVariant('todo');
                const handler = () => api.setActive(check());
                editor.on('NodeChange', handler);
                return () => editor.off('NodeChange', handler);
            }
        });

        editor.ui.registry.addMenuItem('for_checklist', {
            icon: 'for-checklist',
            text: 'Checkliste (To-Do)',
            onAction: () => editor.execCommand('forChecklistToggle', false, 'todo')
        });

        // --- Button + Menu: Feature-Liste (kein Strikethrough) ---
        editor.ui.registry.addToggleButton('for_checklist_feature', {
            icon: 'for-checklist-feature',
            tooltip: 'Feature-Liste',
            onAction: () => editor.execCommand('forChecklistToggle', false, 'feature'),
            onSetup: (api: any) => {
                const check = activeForVariant('feature');
                const handler = () => api.setActive(check());
                editor.on('NodeChange', handler);
                return () => editor.off('NodeChange', handler);
            }
        });

        editor.ui.registry.addMenuItem('for_checklist_feature', {
            icon: 'for-checklist-feature',
            text: 'Feature-Liste',
            onAction: () => editor.execCommand('forChecklistToggle', false, 'feature')
        });

        return {
            getMetadata: () => ({
                name: 'FriendsOfREDAXO Checklist',
                url: 'https://github.com/FriendsOfREDAXO/tinymce'
            })
        };
    });
};

export default Plugin;
