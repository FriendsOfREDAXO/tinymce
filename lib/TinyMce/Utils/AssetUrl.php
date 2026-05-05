<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_addon;
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

    public static function sanitizeInstallationRoot(string $value): string
    {
        $root = trim($value);
        if ('' === $root || '/' === $root) {
            return '';
        }

        // Reject protocol-relative URLs (//...) and anything containing a scheme (http://, ...)
        // to prevent generated asset URLs from pointing to an external origin.
        if (str_starts_with($root, '//') || str_contains($root, '://')) {
            return '';
        }

        if ('/' !== $root[0]) {
            $root = '/' . $root;
        }

        // Collapse multiple consecutive slashes (e.g. //foo -> /foo)
        $root = (string) preg_replace('#/{2,}#', '/', $root);

        $root = rtrim($root, '/');

        if (str_ends_with($root, '/redaxo')) {
            $root = substr($root, 0, -7);
        }

        if ('' === $root || '/' === $root) {
            return '';
        }

        return $root;
    }

    public static function getInstallationRoot(): string
    {
        /** @var string $configuredRoot */
        $configuredRoot = (string) rex_addon::get('tinymce')->getConfig('installation_root', '');
        return self::sanitizeInstallationRoot($configuredRoot);
    }

    public static function getTinyAssetBaseUrl(): string
    {
        $root = self::getInstallationRoot();
        if ('' === $root) {
            return rtrim(self::makeRootRelative(rex_url::addonAssets('tinymce', '')), '/');
        }

        return $root . '/assets/addons/tinymce';
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