(function () {
    'use strict';

    var setup = function (editor) {
        editor.options.register('link_yform_tables', {
            processor: 'object',
            default: {
                title: 'YForm',
                items: []
            }
        });

        var config = editor.options.get('link_yform_tables');
        var title = config.title;
        var items = config.items;
        var menuItems = [];

        var hasProto = function(v, constructor, predicate) {
            var _a;
            if (predicate(v, constructor.prototype)) {
                return true;
            } else {
                return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
            }
        };

        var typeOf = function(x) {
            var t = typeof x;
            if (x === null) {
                return 'null';
            } else if (t === 'object' && Array.isArray(x)) {
                return 'array';
            } else if (t === 'object' && hasProto(x, String, function(o, proto) { return Object.prototype.isPrototypeOf.call(proto,o); })) {
                return 'string';
            } else {
                return t;
            }
        };

        var isType = function(type) { return function(value) { return typeOf(value) === type; }; };
        var isNullable = function(a) { return a === null || a === undefined; };
        var isObject = isType('object');
        var isString = isType('string');

        for (var i = 0, len = items.length; i < len; ++i) {
            var item = items[i];
            var warn = [];
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
                console.warn('TinyMCE Plugin link-yform reports for entry ' + (i + 1) + ': \n- ' + warn.join('\n- '));
                continue;
            }
            
            (function(item) {
                var menuTitle = isNullable(item.title) ? item.table : item.title;
                menuItems.push({
                    type: 'menuitem',
                    text: menuTitle,
                    onAction: function() { openDialog(item); }
                });
            })(item);
        }

        var isImageFigure = function(elm) {
            return elm !== null && elm !== undefined && elm.nodeName === 'FIGURE' && /\bimage\b/i.test(elm.className);
        };

        var linkImageFigure = function(dom, fig, attrs) {
            var img = dom.select('img', fig)[0];
            if (img) {
                var a = dom.create('a', attrs);
                var parent = img.parentNode;
                if (parent) {
                    parent.insertBefore(a, img);
                    a.appendChild(img);
                }
            }
        };

        var openDialog = function(item) {
            try {
                var dom = editor.dom;
                var pool = newPoolWindow('index.php?page=yform/manager/data_edit&table_name=' + item.table + '&rex_yform_manager_opener[id]=1&rex_yform_manager_opener[field]=' + item.field + '&rex_yform_manager_opener[multiple]=0');
                $(pool).on('rex:YForm_selectData', function (event, id, label) {
                    event.preventDefault();
                    pool.close();
                    
                    label = label.replace(new RegExp("(.*?)\\s\\[.*?\\]", 'gi'), "$1");
                    
                    var linkAttributes = {
                        href: ((!isNullable(item.url) && isString(item.url)) ? item.url : item.table.split('_').join('-') + '://') + id,
                        title: label
                    };
                    
                    var selectedElement = editor.selection.getNode();
                    if (isImageFigure(selectedElement)) {
                        linkImageFigure(dom, selectedElement, linkAttributes);
                    } else {
                        var text = dom.encode(label);
                        if (editor.selection.getContent()) {
                            text = editor.selection.getContent();
                        }
                        editor.insertContent(dom.createHTML('a', linkAttributes, text));
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        editor.ui.registry.addMenuButton('link_yform', {
            text: title,
            fetch: function(callback) {
                callback(menuItems);
            }
        });
    };

    tinymce.PluginManager.add('link_yform', setup);
})();
