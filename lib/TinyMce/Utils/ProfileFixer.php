<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

/**
 * Utility for fixing and repairing TinyMCE-8 profile configurations.
 *
 * Handles common issues with profile strings:
 * - Missing GPL license key
 * - Template plugin cleanup
 * - External plugins path normalization
 * - Content CSS dark mode fallback fixes
 */
final class ProfileFixer
{
    /**
     * Regex patterns for removing template plugin from profile strings.
     *
     * @var array<string, string>
     */
    private const TEMPLATE_PATTERNS = [
        '/media template codesample/' => 'media codesample',
        '/link template codesample/' => 'link codesample',
        '/codesample template fontsize/' => 'codesample fontsize',
        '/, template,/' => ', ',
        '/, template\'/' => "'",
        '/\'template, /' => "'",
        '/template\s+codesample/' => 'codesample',
        '/codesample\s+template/' => 'codesample',
    ];

    /**
     * Fixes common TinyMCE-8 profile configuration issues.
     *
     * @param string $profile The profile configuration string
     *
     * @return array{profile: string, changes: list<string>} Fixed profile and list of applied changes
     */
    public static function fixProfile(string $profile): array
    {
        $result = $profile;
        $changes = [];

        // Add GPL license key if missing
        if ('' !== $result && strpos($result, 'license_key:') === false) {
            $result = "license_key: 'gpl',\r\n" . $result;
            $changes[] = 'Added GPL license key';
        }

        // Remove template plugin references
        $result = self::removeTemplatePlugin($result, $changes);

        // Fix external_plugins paths
        $result = self::fixExternalPluginsPaths($result, $changes);

        // Fix content_css dark mode fallback
        $result = self::fixContentCssFallback($result, $changes);

        return ['profile' => $result, 'changes' => $changes];
    }

    /**
     * Removes all template plugin references from profile string.
     *
     * @param string $profile The profile configuration
     * @param list<string> &$changes Changes log (passed by reference)
     *
     * @return string Profile with template plugin removed
     */
    private static function removeTemplatePlugin(string $profile, array &$changes): string
    {
        if ('' === $profile) {
            return $profile;
        }

        $result = $profile;
        foreach (self::TEMPLATE_PATTERNS as $pattern => $replacement) {
            if (preg_match($pattern, $result)) {
                $result = (string) preg_replace($pattern, $replacement, $result);
                if (!in_array('Removed template plugin', $changes, true)) {
                    $changes[] = 'Removed template plugin';
                }
            }
        }

        return $result;
    }

    /**
     * Fixes external_plugins paths to use absolute URLs.
     *
     * @param string $profile The profile configuration
     * @param list<string> &$changes Changes log (passed by reference)
     *
     * @return string Profile with fixed paths
     */
    private static function fixExternalPluginsPaths(string $profile, array &$changes): string
    {
        if ('' === $profile || !preg_match('/external_plugins:\s*\{/', $profile)) {
            return $profile;
        }

        $result = $profile;

        // Fix relative paths: "assets/addons/..." → "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(assets\/addons\/)/',
            '"/assets/addons/',
            $result
        );

        // Fix escaped relative paths: "..\/assets\/addons\/..." → "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(?:\.\.\\\\\/)+assets\\\\\/addons\\\\\//',
            '"/assets/addons/',
            $result
        );

        // Fix unescaped relative paths: "../assets/addons/..." → "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(?:\.\.\/)+assets\/addons\//',
            '"/assets/addons/',
            $result
        );

        if ($result !== $profile) {
            $changes[] = 'Fixed external_plugins paths to absolute URLs';
        }

        return $result;
    }

    /**
     * Fixes content_css dark mode fallback from "light" to "default".
     *
     * @param string $profile The profile configuration
     * @param list<string> &$changes Changes log (passed by reference)
     *
     * @return string Profile with fixed content_css
     */
    private static function fixContentCssFallback(string $profile, array &$changes): string
    {
        if ('' === $profile || !preg_match('/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"[^\"]+"\s*:\s*"light"/', $profile)) {
            return $profile;
        }

        $result = (string) preg_replace(
            '/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"([^\"]+)"\s*:\s*"light"/',
            'content_css: redaxo.theme.current === "dark" ? "$1" : "default"',
            $profile
        );

        if ($result !== $profile) {
            $changes[] = 'Fixed content_css for dark mode';
        }

        return $result;
    }
}
