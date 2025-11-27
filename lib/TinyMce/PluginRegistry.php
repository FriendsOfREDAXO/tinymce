<?php

namespace FriendsOfRedaxo\TinyMce;

use rex_extension;
use rex_extension_point;

class PluginRegistry
{
    /**
     * Registers a custom TinyMCE plugin from another addon.
     *
     * @param string $pluginName The internal name of the plugin (e.g. 'forcal_event')
     * @param string $pluginUrl The full URL to the plugin.js file
     * @param string|null $toolbarButton The name of the toolbar button to add (optional)
     */
    public static function addPlugin(string $pluginName, string $pluginUrl, ?string $toolbarButton = null): void
    {
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
}
