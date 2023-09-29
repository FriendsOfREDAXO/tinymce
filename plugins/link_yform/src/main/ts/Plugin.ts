import { Editor, TinyMCE } from 'tinymce';

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
        processor: 'array',
        default: []
    });

    const yformTables = editor.options.get('link_yform_tables');
    const menuItems = [];
    for (let i = 0, len = yformTables.length; i < len; ++i) {
        const yformTable = yformTables[i];
        const warn = [];
        if (!isObject(yformTable)) {
            warn.push('Entry is not an object.');
        }

        if (isNullable(yformTable.table)) {
            warn.push('Key "table" with table name as value is missing.');
        }

        if (isNullable(yformTable.field)) {
            warn.push('Key "field" with field name as value is missing.');
        }

        if (warn.length > 0) {
            console.warn('TinyMCE Plugin link-yform reports for entry '+(i + 1)+': '+"\n- "+ warn.join("\n- "));
            continue;
        }

        const menuText = isNullable(yformTable.menu) ? yformTable.table : yformTable.menu;

        menuItems.push({
            type: 'menuitem',
            text: menuText,
            onAction: () => openDialog(yformTable)
        });
    }

    const openDialog = (yformTable) => {
        try {
            const dom = editor.dom;
            const pool = newPoolWindow('index.php?page=yform/manager/data_edit&table_name=' + yformTable.table + '&rex_yform_manager_opener[id]=1&rex_yform_manager_opener[field]=' + yformTable.field + '&rex_yform_manager_opener[multiple]=0');
            $(pool).on('rex:YForm_selectData', function (event, id, label) {
                event.preventDefault();
                pool.close();

                if (editor.selection.getContent()) {
                    label = editor.selection.getContent();
                } else {
                    label = label.replace(new RegExp("(.*?)\\s\\[.*?\\]", 'gi'), "$1");
                }

                const linkAttributes = {
                    href: ((!isNullable(yformTable.url) && isString(yformTable.url)) ? yformTable.url : yformTable.table.split('_').join('-') + '://') + id,
                    title: label
                }

                editor.insertContent(dom.createHTML('a', linkAttributes, dom.encode(label)));
            });
        } catch (error) {
            console.log(error)
        }
    }

    editor.ui.registry.addMenuButton('link_yform', {
        text: 'YForm',
        fetch: (callback) => {
            callback(menuItems);
        }
    });
};

export default (): void => {
    tinymce.PluginManager.add('link_yform', setup);
};
