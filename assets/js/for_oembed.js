/* ==================================================================
 *  FriendsOfREDAXO – oEmbed Frontend-Helper
 *  -------------------------------------------------------------
 *  Wandelt <figure class="media"><oembed url="…"></oembed></figure>
 *  beim Pageload in iframes um (YouTube / Vimeo).
 *
 *  Wenn das vidstack-Addon eingebunden ist (Custom Element
 *  <media-player> verfügbar), wird stattdessen ein vidstack-Player
 *  erzeugt. Das ist aber komplett optional – ohne vidstack gibt's
 *  einen schlichten responsiven iframe-Fallback.
 *
 *  Einbindung im Template/Frontend (mit REDAXO URL-Helper):
 *    rex_view::addJsFile(rex_url::addonAssets('tinymce', 'js/for_oembed.js'));
 *
 *  Oder direkt im HTML:
 *    <script src="<?php echo rex_url::addonAssets('tinymce', 'js/for_oembed.js'); ?>" defer></script>
 *
 *  Fallback (hardcoded path, nicht subfolder-safe):
 *    <script src="/assets/addons/tinymce/js/for_oembed.js" defer></script>
 * ================================================================== */
(function () {
    'use strict';

    var VIDSTACK_TAG = 'media-player';

    function parseUrl(url) {
        url = (url || '').trim();
        if (!url) return null;

        var ytPatterns = [
            /(?:youtube\.com\/watch\?(?:[^#]*&)*v=([a-zA-Z0-9_-]{6,}))/,
            /(?:youtu\.be\/([a-zA-Z0-9_-]{6,}))/,
            /(?:youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,}))/,
            /(?:youtube\.com\/embed\/([a-zA-Z0-9_-]{6,}))/,
            /(?:youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,}))/
        ];
        for (var i = 0; i < ytPatterns.length; i++) {
            var m = url.match(ytPatterns[i]);
            if (m) {
                return {
                    provider: 'youtube',
                    id: m[1],
                    embedSrc: 'https://www.youtube.com/embed/' + m[1],
                    canonicalUrl: 'https://www.youtube.com/watch?v=' + m[1],
                    vidstackSrc: 'youtube/' + m[1],
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                };
            }
        }

        var vimeoPatterns = [
            /(?:vimeo\.com\/(?:video\/)?(\d{5,}))/,
            /(?:player\.vimeo\.com\/video\/(\d{5,}))/
        ];
        for (var j = 0; j < vimeoPatterns.length; j++) {
            var n = url.match(vimeoPatterns[j]);
            if (n) {
                return {
                    provider: 'vimeo',
                    id: n[1],
                    embedSrc: 'https://player.vimeo.com/video/' + n[1],
                    canonicalUrl: 'https://vimeo.com/' + n[1],
                    vidstackSrc: 'vimeo/' + n[1],
                    allow: 'autoplay; fullscreen; picture-in-picture; clipboard-write'
                };
            }
        }

        return null;
    }

    function hasVidstack() {
        try {
            return !!(window.customElements && window.customElements.get && window.customElements.get(VIDSTACK_TAG));
        } catch (_e) {
            return false;
        }
    }

    function buildVidstackPlayer(match) {
        // vidstack Custom-Element – sauberes Markup, übernimmt Styling selbst
        var player = document.createElement(VIDSTACK_TAG);
        player.setAttribute('src', match.vidstackSrc);
        player.setAttribute('title', match.provider + ' ' + match.id);
        player.setAttribute('aspect-ratio', '16/9');
        player.setAttribute('crossorigin', '');
        player.setAttribute('playsinline', '');

        // Fallback-HTML für User mit JS aus / während vidstack lädt
        player.innerHTML =
            '<media-provider></media-provider>' +
            '<media-video-layout></media-video-layout>';
        return player;
    }

    function buildIframeFallback(match) {
        var wrapper = document.createElement('div');
        wrapper.className = 'for-oembed for-oembed--' + match.provider;
        wrapper.style.position = 'relative';
        wrapper.style.paddingBottom = '56.25%';
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';

        var iframe = document.createElement('iframe');
        iframe.src = match.embedSrc;
        iframe.setAttribute('allow', match.allow);
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('frameborder', '0');
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        wrapper.appendChild(iframe);

        return wrapper;
    }

    function expandFigure(fig) {
        var oembed = fig.querySelector('oembed[url]');
        if (!oembed) return;
        var match = parseUrl(oembed.getAttribute('url'));
        if (!match) return;

        var node = hasVidstack() ? buildVidstackPlayer(match) : buildIframeFallback(match);
        fig.innerHTML = '';
        fig.appendChild(node);
        fig.setAttribute('data-for-oembed-resolved', match.provider);
    }

    function init() {
        var figures = document.querySelectorAll('figure.media:not([data-for-oembed-resolved])');
        for (var i = 0; i < figures.length; i++) {
            expandFigure(figures[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API: manuell erneut laufen lassen, falls neue Embeds per AJAX kommen
    window.forOembedScan = init;
})();
