/* ==================================================================
 *  Tiny-Plugin-Stub: Fügt TinyMCE direkt beim Start einen globalen
 *  Button/MenuItem hinzu, der die Klasse "ol-hierarchical" an der
 *  äußersten <ol> der aktuellen Selektion toggelt.
 *
 *  Wird als normales JS-Asset geladen und registriert sich auf den
 *  'SetupEditor'-Hook, der für JEDEN Editor feuert – unabhängig vom
 *  Profil. So ist der Button immer verfügbar, auch in Profilen, die
 *  keine FOR-Plugins aktiv haben.
 * ================================================================== */
(function () {
    'use strict';

    if (typeof tinymce === 'undefined' || !tinymce.on) {
        // Falls dieses Script vor tinymce.min.js läuft – später nochmal versuchen.
        if (document.readyState !== 'complete') {
            window.addEventListener('load', init, { once: true });
        } else {
            window.setTimeout(init, 50);
        }
        return;
    }
    init();

    function init() {
        if (typeof tinymce === 'undefined') return;
        tinymce.on('SetupEditor', function (e) {
            var editor = e.editor;

            var CSS_RULE =
                'ol.ol-hierarchical{counter-reset:ol-hier-item;list-style:none;padding-left:1.75em;}' +
                'ol.ol-hierarchical ol{counter-reset:ol-hier-item;list-style:none;}' +
                'ol.ol-hierarchical li{position:relative;counter-increment:ol-hier-item;}' +
                'ol.ol-hierarchical li::before{content:counters(ol-hier-item,".") ". ";' +
                'position:absolute;left:-1.75em;width:1.75em;text-align:right;' +
                'padding-right:.35em;opacity:.6;font-variant-numeric:tabular-nums;}';

            editor.on('init', function () {
                try { editor.dom.addStyle(CSS_RULE); } catch (_e) { /* noop */ }
            });

            function findTopOl() {
                var node = editor.selection.getNode();
                var current = node;
                var top = null;
                while (current && current !== editor.getBody()) {
                    if (current.nodeName === 'OL') top = current;
                    current = current.parentNode;
                }
                return top;
            }

            editor.ui.registry.addIcon(
                'ol-hierarchical',
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
                '<text x="3" y="9" font-size="7" font-family="system-ui,sans-serif" fill="currentColor" stroke="none">1.</text>' +
                '<line x1="10" y1="7" x2="21" y2="7"/>' +
                '<text x="6" y="15" font-size="6" font-family="system-ui,sans-serif" fill="currentColor" stroke="none">1.1.</text>' +
                '<line x1="13" y1="13.5" x2="21" y2="13.5"/>' +
                '<text x="9" y="21" font-size="5" font-family="system-ui,sans-serif" fill="currentColor" stroke="none">1.1.1.</text>' +
                '<line x1="17" y1="19.5" x2="21" y2="19.5"/>' +
                '</svg>'
            );

            editor.addCommand('olHierarchicalToggle', function () {
                var ol = findTopOl();
                if (!ol) return;
                editor.undoManager.transact(function () {
                    ol.classList.toggle('ol-hierarchical');
                });
                editor.nodeChanged();
            });

            editor.ui.registry.addToggleButton('olHierarchical', {
                icon: 'ol-hierarchical',
                tooltip: 'Nummerierung hierarchisch (1., 1.1., 1.1.1.)',
                onAction: function () { editor.execCommand('olHierarchicalToggle'); },
                onSetup: function (api) {
                    var handler = function () {
                        var ol = findTopOl();
                        api.setEnabled(!!ol);
                        api.setActive(!!(ol && ol.classList.contains('ol-hierarchical')));
                    };
                    editor.on('NodeChange', handler);
                    handler();
                    return function () { editor.off('NodeChange', handler); };
                }
            });

            editor.ui.registry.addMenuItem('olHierarchical', {
                icon: 'ol-hierarchical',
                text: 'Nummerierung hierarchisch',
                onAction: function () { editor.execCommand('olHierarchicalToggle'); }
            });
        });
    }
})();
