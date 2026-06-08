import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const PLUGIN = 'phonelink';
const PHONE_ICON = 'phonelink-icon';
const LOCK_ATTR = 'data-phone-locked';
const PHONE_ATTR = 'data-phone-number';

type PhoneDialogData = {
    phoneNumber: string;
    phoneLabel: string;
    phoneTitle: string;
};

const translate = (editor: Editor, key: string, fallback: string): string => {
    const text = editor.translate(key);
    return text === key ? fallback : text;
};

const normalizePhoneNumber = (value: string): string =>
    value.replace(/[^\d+()\-./\s]/g, '').trim();

const extractPhoneFromHref = (href: string | null): string => {
    if (href === null || href.trim() === '') {
        return '';
    }

    return href.toLowerCase().startsWith('tel:') ? href.slice(4) : href;
};

const findPhoneLinkFromNode = (node: Node | null): HTMLAnchorElement | null => {
    if (!(node instanceof Element)) {
        return null;
    }

    const link = node.closest('a');
    return link instanceof HTMLAnchorElement ? link : null;
};

const isProtectedPhoneLink = (link: HTMLAnchorElement | null): boolean => {
    if (link === null) {
        return false;
    }

    const href = link.getAttribute('href') || '';
    return link.getAttribute(LOCK_ATTR) === '1' || href.toLowerCase().startsWith('tel:');
};

const findCurrentPhoneLink = (editor: Editor): HTMLAnchorElement | null => {
    const link = findPhoneLinkFromNode(editor.selection.getNode());
    return isProtectedPhoneLink(link) ? link : null;
};

const protectPhoneLink = (link: HTMLAnchorElement): void => {
    const currentNumber = normalizePhoneNumber(
        link.getAttribute(PHONE_ATTR) || extractPhoneFromHref(link.getAttribute('href'))
    );

    if (currentNumber === '') {
        return;
    }

    link.setAttribute(PHONE_ATTR, currentNumber);
    link.setAttribute(LOCK_ATTR, '1');
    link.setAttribute('href', 'tel:' + currentNumber);
};

const enforceProtectedPhoneLinks = (editor: Editor): void => {
    const links = editor.dom.select('a[' + LOCK_ATTR + '="1"],a[href^="tel:"],a[href^="TEL:"]');
    links.forEach((node) => {
        if (node instanceof HTMLAnchorElement) {
            protectPhoneLink(node);
        }
    });
};

const removeCurrentPhoneLink = (editor: Editor): void => {
    const existing = findCurrentPhoneLink(editor);
    if (existing === null) {
        return;
    }

    editor.undoManager.transact(() => {
        editor.dom.remove(existing, true);
    });

    editor.nodeChanged();
};

const openDialog = (editor: Editor, existing: HTMLAnchorElement | null = null): void => {
    const current = existing || findCurrentPhoneLink(editor);
    const selectedText = editor.selection.getContent({ format: 'text' }).trim();

    const initialNumber = normalizePhoneNumber(
        current ? (current.getAttribute(PHONE_ATTR) || extractPhoneFromHref(current.getAttribute('href'))) : selectedText
    );

    const initialLabel = current ? (current.textContent || '') : selectedText;
    const initialTitle = current ? (current.getAttribute('title') || '') : '';

    editor.windowManager.open<PhoneDialogData>({
        title: translate(editor, 'Phone link', 'Telefon-Link'),
        size: 'normal',
        body: {
            type: 'panel',
            items: [
                {
                    type: 'input',
                    label: translate(editor, 'Phone number', 'Telefonnummer'),
                    name: 'phoneNumber'
                },
                {
                    type: 'input',
                    label: translate(editor, 'Text to display', 'Anzeigetext'),
                    name: 'phoneLabel'
                },
                {
                    type: 'input',
                    label: translate(editor, 'Title', 'Titel'),
                    name: 'phoneTitle'
                }
            ]
        },
        buttons: [
            {
                type: 'cancel',
                name: 'cancel',
                text: translate(editor, 'Cancel', 'Abbrechen')
            },
            {
                type: 'submit',
                name: 'save',
                text: translate(editor, 'Save', 'Speichern'),
                primary: true
            }
        ],
        initialData: {
            phoneNumber: initialNumber,
            phoneLabel: initialLabel,
            phoneTitle: initialTitle
        },
        onSubmit: (api) => {
            const data = api.getData();
            const number = normalizePhoneNumber(data.phoneNumber || '');

            if (number === '') {
                editor.windowManager.alert(translate(editor, 'Phone number required', 'Telefonnummer ist erforderlich.'));
                return;
            }

            const label = (data.phoneLabel || '').trim() || number;
            const title = (data.phoneTitle || '').trim();

            editor.undoManager.transact(() => {
                if (current !== null) {
                    current.innerHTML = editor.dom.encode(label);
                    current.setAttribute(PHONE_ATTR, number);
                    current.setAttribute(LOCK_ATTR, '1');
                    current.setAttribute('href', 'tel:' + number);
                    current.setAttribute('title', title);
                    if (title === '') {
                        current.removeAttribute('title');
                    }
                    editor.selection.select(current);
                    return;
                }

                const attrs: Record<string, string> = {
                    href: 'tel:' + number,
                    [LOCK_ATTR]: '1',
                    [PHONE_ATTR]: number
                };

                if (title !== '') {
                    attrs.title = title;
                }

                editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(label)));
            });

            enforceProtectedPhoneLinks(editor);
            editor.nodeChanged();
            api.close();
        }
    });
};

const registerUi = (editor: Editor): void => {
    editor.addCommand('mcePhoneLink', () => openDialog(editor));
    editor.addCommand('mcePhoneLinkRemove', () => removeCurrentPhoneLink(editor));

    editor.ui.registry.addIcon(PHONE_ICON, '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.37 2.32.59 3.57.59.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.22 2.45.59 3.57.11.35.02.75-.25 1.02l-2.22 2.2z"/></svg>');

    editor.ui.registry.addButton(PLUGIN, {
        icon: PHONE_ICON,
        tooltip: translate(editor, 'Phone link', 'Telefon-Link'),
        onAction: () => editor.execCommand('mcePhoneLink')
    });

    editor.ui.registry.addMenuItem(PLUGIN, {
        icon: PHONE_ICON,
        text: translate(editor, 'Phone link', 'Telefon-Link'),
        onAction: () => editor.execCommand('mcePhoneLink')
    });

    editor.ui.registry.addMenuItem('phonelink_remove', {
        icon: 'unlink',
        text: translate(editor, 'Remove phone link', 'Telefon-Link entfernen'),
        onAction: () => editor.execCommand('mcePhoneLinkRemove')
    });

    editor.ui.registry.addContextToolbar('phonelink_context', {
        predicate: (node) => isProtectedPhoneLink(findPhoneLinkFromNode(node)),
        items: 'phonelink phonelink_remove',
        position: 'node',
        scope: 'node'
    });

    editor.ui.registry.addContextMenu('phonelink', {
        update: (node) => isProtectedPhoneLink(findPhoneLinkFromNode(node))
            ? ['phonelink', 'phonelink_remove']
            : []
    });
};

const setup = (editor: Editor): void => {
    editor.on('PreInit', () => {
        editor.schema.addValidElements('a[href|title|target|rel|class|contenteditable|data-mce-href|' + LOCK_ATTR + '|' + PHONE_ATTR + ']');
    });

    editor.on('BeforeExecCommand', (event) => {
        if (event.command !== 'mceLink') {
            return;
        }

        const link = findCurrentPhoneLink(editor);
        if (link === null) {
            return;
        }

        event.preventDefault();
        openDialog(editor, link);
    });

    editor.on('click', (event) => {
        const link = findPhoneLinkFromNode(event.target as Node | null);
        if (!isProtectedPhoneLink(link)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        editor.selection.select(link);
        openDialog(editor, link);
    });

    editor.on('SetContent BeforeGetContent Undo Redo', () => {
        enforceProtectedPhoneLinks(editor);
    });

    registerUi(editor);
};

export default (): void => {
    tinymce.PluginManager.add(PLUGIN, setup);
    tinymce.PluginManager.requireLangPack(PLUGIN, 'de');
};
