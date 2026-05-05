<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_url;

class AssetUrl
{
    private static function makeRootRelative(string $url): string
    {
        if ($url === '') {
            return '';
        }

        if (preg_match('#^([a-z][a-z0-9+.-]*:)?//#i', $url) === 1 || str_starts_with($url, '/')) {
            return $url;
        }

        $requestUri = rex_server('REQUEST_URI', 'string', '/');
        $requestPath = parse_url($requestUri, PHP_URL_PATH);
        if (!is_string($requestPath) || $requestPath === '') {
            $requestPath = '/';
        }

        $baseDir = str_replace('\\', '/', dirname($requestPath));
        if ($baseDir === '.' || $baseDir === '\\') {
            $baseDir = '/';
        }

        $combinedPath = ($baseDir === '/' ? '' : rtrim($baseDir, '/')) . '/' . ltrim($url, '/');
        $segments = explode('/', $combinedPath);
        $normalizedSegments = [];

        foreach ($segments as $segment) {
            if ($segment === '' || $segment === '.') {
                continue;
            }

            if ($segment === '..') {
                array_pop($normalizedSegments);
                continue;
            }

            $normalizedSegments[] = $segment;
        }

        return '/' . implode('/', $normalizedSegments);
    }

    public static function getTinyAssetBaseUrl(): string
    {
        return rtrim(self::makeRootRelative(rex_url::addonAssets('tinymce', '')), '/');
    }

    public static function getTinyPluginBaseUrl(): string
    {
        return self::getTinyAssetBaseUrl() . '/scripts/tinymce/plugins';
    }

    public static function getTinyAssetUrl(string $path): string
    {
        $assetPath = ltrim($path, '/');

        if ('' === $assetPath) {
            return self::getTinyAssetBaseUrl();
        }

        return self::getTinyAssetBaseUrl() . '/' . $assetPath;
    }
}