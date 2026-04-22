/**
 * Koexistenz REDAXO-Topnav ↔ sticky TinyMCE-Toolbar.
 *
 * Das Script lädt im Backend auf Seiten mit TinyMCE-Assets. Es:
 *   - lässt REDAXO beim Runterscrollen normal die Topnav ausblenden,
 *   - verhindert aber das automatische Wiedereinblenden beim Hochscrollen,
 *   - und lässt die Topnav erst wieder zu, wenn scrollY < 50 (Seitenanfang).
 *
 * Race-condition-sicher per MutationObserver: wird die Hidden-Klasse
 * entfernt, solange wir nicht am Seitenanfang sind, setzen wir sie
 * synchron vor dem nächsten Paint wieder.
 */
(function () {
    'use strict';

    var TOP_THRESHOLD = 50;
    var HIDDEN_CLASS = 'rex-nav-top-is-hidden';
    var nav = null;
    var observer = null;
    var active = false;

    var isAtTop = function () {
        return window.scrollY < TOP_THRESHOLD;
    };

    // Aktiv nur wenn tinymce verwendet wird.
    // Wir prüfen dynamisch, damit der Zustand korrekt ist, egal ob
    // Editoren initial, verzögert oder per PJAX hinzukommen.
    var hasTinyMce = function () {
        if (typeof window.tinymce === 'undefined') {
            return false;
        }
        if (window.tinymce.editors && window.tinymce.editors.length > 0) {
            return true;
        }
        // Fallback: DOM-Selektor für TinyMCE-Instanzen
        return !!document.querySelector('.tox-tinymce, .tox-edit-area');
    };

    var enforce = function () {
        if (!active || !nav) {
            return;
        }
        if (!hasTinyMce()) {
            return;
        }
        if (isAtTop()) {
            return;
        }
        if (!nav.classList.contains(HIDDEN_CLASS)) {
            nav.classList.add(HIDDEN_CLASS);
        }
    };

    var start = function () {
        nav = document.getElementById('rex-js-nav-top');
        if (!nav) {
            // Navbar (noch) nicht da – später nochmal versuchen.
            return false;
        }
        if (active) {
            return true;
        }
        active = true;

        if (typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(function () {
                enforce();
            });
            observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
        }

        window.addEventListener('scroll', enforce, { passive: true });
        enforce();
        return true;
    };

    var boot = function () {
        if (start()) {
            return;
        }
        // Falls Navbar später kommt (PJAX etc.), beobachten.
        if (typeof MutationObserver === 'undefined') {
            return;
        }
        var bodyObserver = new MutationObserver(function () {
            if (start()) {
                bodyObserver.disconnect();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Debug-Helper: window.__tinyNavFreeze liefert aktuellen Status.
    window.__tinyNavFreeze = function () {
        return {
            active: active,
            hasNav: !!nav,
            hasTinyMce: hasTinyMce(),
            scrollY: window.scrollY,
            isAtTop: isAtTop(),
            hidden: nav ? nav.classList.contains(HIDDEN_CLASS) : null
        };
    };
})();
