<?php

namespace FriendsOfRedaxo\TinyMce;

use rex_extension;
use rex_extension_point;

class PluginRegistry
{
    /**
     * Static storage for registered external plugins.
     * @var array<string, array{url: string, toolbar: string|null}>
     */
    private static array $plugins = [];

    /**
     * Registers a custom TinyMCE plugin from another addon.
     *
     * @param string $pluginName The internal name of the plugin (e.g. 'forcal_event')
     * @param string $pluginUrl The full URL to the plugin.js file
     * @param string|null $toolbarButton The name of the toolbar button to add (optional)
     */
    public static function addPlugin(string $pluginName, string $pluginUrl, ?string $toolbarButton = null): void
    {
        // Store plugin statically for profiles.js generation
        self::$plugins[$pluginName] = [
            'url' => $pluginUrl,
            'toolbar' => $toolbarButton,
        ];

        rex_extension::register('TINYMCE_PROFILE_OPTIONS', function (rex_extension_point $ep) use ($pluginName, $pluginUrl, $toolbarButton) {
            $options = $ep->getSubject();

            // Add plugin to the list of available plugins
            if (!in_array($pluginName, $options['plugins'])) {
                $options['plugins'][] = $pluginName;
            }

            // Add button to the list of available toolbar buttons
            if ($toolbarButton && !in_array($toolbarButton, $options['toolbar'])) {
                $options['toolbar'][] = $toolbarButton;
            }

            // Register the external plugin URL
            $options['external_plugins'][$pluginName] = $pluginUrl;

            return $options;
        });
    }

    /**
     * Returns all registered external plugins as an associative array.
     * Format: ['plugin_name' => 'plugin_url', ...]
     *
     * @return array<string, string>
     */
    public static function getExternalPlugins(): array
    {
        $externalPlugins = [];
        foreach (self::$plugins as $name => $data) {
            $externalPlugins[$name] = $data['url'];
        }
        return $externalPlugins;
    }

    /**
     * Returns all registered plugins with full data.
     *
     * @return array<string, array{url: string, toolbar: string|null}>
     */
    public static function getPlugins(): array
    {
        return self::$plugins;
    }
}
