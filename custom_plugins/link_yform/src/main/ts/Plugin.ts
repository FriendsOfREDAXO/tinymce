import { Type } from '@ephox/katamari';
import {DOMUtils, Editor, TinyMCE} from 'tinymce';

declare const tinymce: TinyMCE;
declare function newPoolWindow(link: string): Window;

const hasProto = (v, constructor, predicate) => {
    let _a;
    if (predicate(v, constructor.prototype)) {
        return true;
    } else {
        return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
    }
};

const typeOf = x => {
    const t = typeof x;
    if (x === null) {
        return 'null';
    } else if (t === 'object' && Array.isArray(x)) {
        return 'array';
    } else if (t === 'object' && hasProto(x, String, (o, proto) => Object.prototype.isPrototypeOf.call(proto,o))) {
        return 'string';
    } else {
        return t;
    }
};

const isType = type => value => typeOf(value) === type;
const isNullable = a => a === null || a === undefined;
const isObject = isType('object');
const isString = isType('string');

const setup = (editor: Editor): void => {
    editor.options.register('link_yform_tables', {
        processor: 'object',
        default: {
            title: 'YForm',
            items: [],
        }
    });

    const config = editor.options.get('link_yform_tables');
    const title = config.title;
    const items = config.items;

    const menuItems = [];
    for (let i = 0, len = items.length; i < len; ++i) {
        const item = items[i];
        const warn = [];
        if (!isObject(item)) {
            warn.push('Entry is not an object.');
        }

        if (isNullable(item.table)) {
            warn.push('Key "table" with table name as value is missing.');
        }

        if (isNullable(item.field)) {
            warn.push('Key "field" with field name as value is missing.');
        }

        if (warn.length > 0) {
            console.warn('TinyMCE Plugin link-yform reports for entry '+(i + 1)+': '+"\n- "+ warn.join("\n- "));
            continue;
        }

        const menuTitle = isNullable(item.title) ? item.table : item.title;

        menuItems.push({
            type: 'menuitem',
            text: menuTitle,
            onAction: () => openDialog(item)
        });
    }

    const isImageFigure = (elm: Element | null): elm is HTMLElement =>
        Type.isNonNullable(elm) && elm.nodeName === 'FIGURE' && /\bimage\b/i.test(elm.className);

    const linkImageFigure = (dom: DOMUtils, fig: Element, attrs: Record<string, string | null>) => {
        const img = dom.select('img', fig)[0];
        if (img) {
            const a = dom.create('a', attrs);
            img.parentNode?.insertBefore(a, img);
            a.appendChild(img);
        }
    };

    const openDialog = (item) => {
        try {
            const dom = editor.dom;
            const pool = newPoolWindow('index.php?page=yform/manager/data_edit&table_name=' + item.table + '&rex_yform_manager_opener[id]=1&rex_yform_manager_opener[field]=' + item.field + '&rex_yform_manager_opener[multiple]=0');
            $(pool).on('rex:YForm_selectData', function (event, id, label) {
                event.preventDefault();
                pool.close();

                const linkAttributes = {
                    href: ((!isNullable(item.url) && isString(item.url)) ? item.url : item.table.split('_').join('-') + '://') + id,
                    title: label
                }

                const selectedElement = editor.selection.getNode();

                if (isImageFigure(selectedElement)) {
                    linkImageFigure(dom, selectedElement, linkAttributes);
                } else {
                    if (editor.selection.getContent()) {
                        label = editor.selection.getContent();
                    } else {
                        label = label.replace(new RegExp("(.*?)\\s\\[.*?\\]", 'gi'), "$1");
                    }
                    editor.insertContent(dom.createHTML('a', linkAttributes, dom.encode(label)));
                }

            });
        } catch (error) {
            console.log(error)
        }
    }

    editor.ui.registry.addMenuButton('link_yform', {
        text: title,
        fetch: (callback) => {
            callback(menuItems);
        }
    });
};

export default (): void => {
    tinymce.PluginManager.add('link_yform', setup);
};
