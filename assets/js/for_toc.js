/* ==========================================================================
 * for_toc – Frontend Active-Section-Highlighting (opt-in)
 * --------------------------------------------------------------------------
 * Markiert den aktuell sichtbaren Abschnitt im Inhaltsverzeichnis mit der
 * Klasse `for-toc__link--active` (bzw. `aria-current="true"`).
 *
 * Einbinden im Template:
 *   <script src="<?php echo rex_url::addonAssets('tinymce', 'js/for_toc.js'); ?>" defer></script>
 *
 * Oder als Fallback (hardcoded):
 *   <script src="/assets/addons/tinymce/js/for_toc.js" defer></script>
 *
 * Ohne dieses Script funktionieren TOC-Links ganz normal – das
 * Highlighting ist rein optional.
 * ========================================================================== */

(function () {
    'use strict';

    function init() {
        var tocs = document.querySelectorAll('nav.for-toc');
        if (!tocs.length) return;
        if (!('IntersectionObserver' in window)) return;

        tocs.forEach(function (toc) {
            var links = toc.querySelectorAll('a[href^="#"]');
            if (!links.length) return;

            var linkMap = new Map();
            var targets = [];
            links.forEach(function (link) {
                var id = decodeURIComponent(link.getAttribute('href').substring(1));
                if (!id) return;
                var target = document.getElementById(id);
                if (!target) return;
                linkMap.set(target, link);
                targets.push(target);
            });
            if (!targets.length) return;

            var current = null;
            var setActive = function (link) {
                if (current === link) return;
                if (current) {
                    current.classList.remove('for-toc__link--active');
                    current.removeAttribute('aria-current');
                }
                current = link;
                if (current) {
                    current.classList.add('for-toc__link--active');
                    current.setAttribute('aria-current', 'true');
                }
            };

            var visible = new Set();
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        visible.add(entry.target);
                    } else {
                        visible.delete(entry.target);
                    }
                });
                // Erste sichtbare Überschrift in Dokument-Reihenfolge gewinnt.
                for (var i = 0; i < targets.length; i++) {
                    if (visible.has(targets[i])) {
                        setActive(linkMap.get(targets[i]));
                        return;
                    }
                }
                setActive(null);
            }, {
                rootMargin: '-10% 0px -70% 0px',
                threshold: 0
            });

            targets.forEach(function (t) { observer.observe(t); });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
