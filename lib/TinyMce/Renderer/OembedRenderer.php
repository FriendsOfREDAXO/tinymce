<?php

namespace FriendsOfRedaxo\TinyMce\Renderer;

use rex_addon;
use rex_url;

/**
 * Wandelt CKE5-kompatibles oEmbed-Markup in das finale Frontend-HTML um.
 *
 *   <figure class="media"><oembed url="https://www.youtube.com/watch?v=…"></oembed></figure>
 *
 * wird – abhängig von verfügbaren AddOns – zu:
 *   - vidstack-Player (wenn das vidstack-AddOn installiert und verfügbar ist)
 *   - responsives <iframe> (Fallback)
 *
 * Anwendung im Template / Modul-Ausgabe:
 *
 *   $html = \FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer::render($article->getValue('art_text'));
 *
 * Oder per Extension-Point OUTPUT_FILTER, wenn das für das Projekt passt.
 */
final class OembedRenderer
{
    /**
     * Parst den HTML-String und ersetzt alle oEmbed-Blöcke.
     */
    public static function render(string $html): string
    {
        if ('' === $html || false === stripos($html, '<oembed')) {
            return $html;
        }

        return (string) preg_replace_callback(
            '~<figure\b[^>]*class="[^"]*\bmedia\b[^"]*"[^>]*>\s*<oembed\b[^>]*url="([^"]+)"[^>]*>\s*</oembed>\s*</figure>~is',
            static function (array $m): string {
                $url = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $match = self::parseUrl($url);
                if (null === $match) {
                    // Unbekannt → Original beibehalten, damit nichts verloren geht
                    return $m[0];
                }

                return self::buildPlayer($match);
            },
            $html
        );
    }

    /**
     * Prüft, ob das vidstack-Addon verfügbar ist.
     */
    public static function hasVidstack(): bool
    {
        return rex_addon::get('vidstack')->isAvailable();
    }

    /**
     * Sorgt dafür, dass die vidstack-Assets im Frontend eingebunden werden,
     * falls das Addon verfügbar ist. Optional aus dem Template aufrufen.
     */
    public static function registerFrontendAssets(): string
    {
        if (!self::hasVidstack()) {
            return '';
        }

        $assets = [
            'vidstack.css' => 'css',
            'vidstack_helper.css' => 'css',
            'vidstack.js' => 'js',
            'vidstack_helper.js' => 'js',
        ];
        $out = '';
        foreach ($assets as $file => $type) {
            $url = rex_url::addonAssets('vidstack', $file);
            if ('css' === $type) {
                $out .= '<link rel="stylesheet" href="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '">' . "\n";
            } else {
                $out .= '<script src="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '" defer></script>' . "\n";
            }
        }

        return $out;
    }

    /**
     * @return array{provider: string, id: string, embedSrc: string, canonicalUrl: string, vidstackSrc: string, allow: string}|null
     */
    private static function parseUrl(string $url): ?array
    {
        $url = trim($url);
        if ('' === $url) {
            return null;
        }

        $ytPatterns = [
            '~(?:youtube\.com/watch\?(?:[^#]*&)*v=([a-zA-Z0-9_-]{6,}))~',
            '~(?:youtu\.be/([a-zA-Z0-9_-]{6,}))~',
            '~(?:youtube\.com/shorts/([a-zA-Z0-9_-]{6,}))~',
            '~(?:youtube\.com/embed/([a-zA-Z0-9_-]{6,}))~',
            '~(?:youtube-nocookie\.com/embed/([a-zA-Z0-9_-]{6,}))~',
        ];
        foreach ($ytPatterns as $pattern) {
            if (preg_match($pattern, $url, $m)) {
                return [
                    'provider' => 'youtube',
                    'id' => $m[1],
                    'embedSrc' => 'https://www.youtube.com/embed/' . $m[1],
                    'canonicalUrl' => 'https://www.youtube.com/watch?v=' . $m[1],
                    'vidstackSrc' => 'youtube/' . $m[1],
                    'allow' => 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                ];
            }
        }

        $vimeoPatterns = [
            '~(?:vimeo\.com/(?:video/)?(\d{5,}))~',
            '~(?:player\.vimeo\.com/video/(\d{5,}))~',
        ];
        foreach ($vimeoPatterns as $pattern) {
            if (preg_match($pattern, $url, $m)) {
                return [
                    'provider' => 'vimeo',
                    'id' => $m[1],
                    'embedSrc' => 'https://player.vimeo.com/video/' . $m[1],
                    'canonicalUrl' => 'https://vimeo.com/' . $m[1],
                    'vidstackSrc' => 'vimeo/' . $m[1],
                    'allow' => 'autoplay; fullscreen; picture-in-picture; clipboard-write',
                ];
            }
        }

        return null;
    }

    /**
     * @param array{provider: string, id: string, embedSrc: string, canonicalUrl: string, vidstackSrc: string, allow: string} $match
     */
    private static function buildPlayer(array $match): string
    {
        if (self::hasVidstack()) {
            return self::buildVidstack($match);
        }

        return self::buildIframe($match);
    }

    /**
     * @param array{provider: string, id: string, embedSrc: string, canonicalUrl: string, vidstackSrc: string, allow: string} $match
     */
    private static function buildVidstack(array $match): string
    {
        $src = htmlspecialchars($match['vidstackSrc'], ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($match['provider'] . ' ' . $match['id'], ENT_QUOTES, 'UTF-8');

        return '<media-player src="' . $src . '" title="' . $title . '" aspect-ratio="16/9" crossorigin playsinline>'
            . '<media-provider></media-provider>'
            . '<media-video-layout></media-video-layout>'
            . '</media-player>';
    }

    /**
     * @param array{provider: string, id: string, embedSrc: string, canonicalUrl: string, vidstackSrc: string, allow: string} $match
     */
    private static function buildIframe(array $match): string
    {
        $src = htmlspecialchars($match['embedSrc'], ENT_QUOTES, 'UTF-8');
        $allow = htmlspecialchars($match['allow'], ENT_QUOTES, 'UTF-8');
        $providerClass = 'for-oembed--' . $match['provider'];

        return '<div class="for-oembed ' . $providerClass . '" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">'
            . '<iframe src="' . $src . '" allow="' . $allow . '" allowfullscreen loading="lazy"'
            . ' referrerpolicy="strict-origin-when-cross-origin" frameborder="0"'
            . ' style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>'
            . '</div>';
    }
}
