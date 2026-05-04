<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_addon;
use rex_url;

class AssetUrl
{
    public static function sanitizeInstallationRoot(string $value): string
    {
        $root = trim($value);
        if ('' === $root || '/' === $root) {
            return '';
        }

        if ('/' !== $root[0]) {
            $root = '/' . $root;
        }

        $root = rtrim($root, '/');

        if (str_ends_with($root, '/redaxo')) {
            $root = substr($root, 0, -7);
        }

        if (false === $root || '' === $root || '/' === $root) {
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
            return rtrim(rex_url::addonAssets('tinymce', ''), '/');
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