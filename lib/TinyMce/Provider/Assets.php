<?php

namespace FriendsOfRedaxo\TinyMce\Provider;

use FriendsOfRedaxo\TinyMce\PluginRegistry;
use rex_addon;
use rex_addon_interface;
use rex_be_controller;
use rex_exception;
use rex_logger;
use rex_view;

class Assets
{
    public static function provideDemoAssets(): void
    {
        if ('tinymce' === rex_be_controller::getCurrentPagePart(1)) {
            try {
                rex_view::addCssFile(self::getAddon()->getAssetsUrl('styles/demo.css'));
            } catch (rex_exception $e) {
                rex_logger::logException($e);
            }
        }
    }

    public static function provideBaseAssets(): void
    {
        try {
            rex_view::addCssFile(self::getAddon()->getAssetsUrl('styles/base.css'));

            // Provide external plugins from PluginRegistry as JS property
            // This ensures correct URLs at runtime with rex_url::base()
            $externalPlugins = PluginRegistry::getExternalPlugins();
            \rex_view::setJsProperty('tinyExternalPlugins', $externalPlugins);

            // Load active Style-Sets from database
            $styleSetsOptions = self::loadActiveStyleSets();

            // Global content_style to fix UIkit/Bootstrap focus outlines in editor
            $contentStyle = 'body { outline: none !important; box-shadow: none !important; } :focus { outline: none !important; box-shadow: none !important; }';

            // Fire extension point for addons to add profile options
            // These options will be merged into all profiles at runtime
            $globalOptions = \rex_extension::registerPoint(new \rex_extension_point('TINYMCE_GLOBAL_OPTIONS', [
                'content_css' => $styleSetsOptions['content_css'],
                'style_formats' => $styleSetsOptions['style_formats'],
                'style_formats_merge' => !empty($styleSetsOptions['style_formats']),
                'content_style' => $contentStyle,
            ]));
            \rex_view::setJsProperty('tinyGlobalOptions', $globalOptions);

            rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/tinymce/tinymce.min.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('generated/profiles.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/base.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/sticky_navbar_freeze.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    /**
     * Load active Style-Sets from database.
     * Each Style-Set includes its profile assignment for client-side filtering.
     *
     * @return array{content_css: list<array{url: string, profiles: list<string>}>, style_formats: list<array{format: array<string, mixed>, profiles: list<string>}>}
     */
    private static function loadActiveStyleSets(): array
    {
        $contentCss = [];
        $styleFormats = [];

        try {
            $sql = \rex_sql::factory();
            /** @var list<array<string, mixed>> $styleSets */
            $styleSets = $sql->getArray(
                'SELECT content_css, style_formats, profiles FROM ' . \rex::getTable('tinymce_stylesets') . ' WHERE active = 1 ORDER BY prio ASC'
            );

            foreach ($styleSets as $set) {
                // Parse profile assignment (comma-separated, empty = all profiles)
                $profiles = [];
                $profilesRaw = isset($set['profiles']) ? (string) $set['profiles'] : '';
                if ('' !== $profilesRaw) {
                    $profiles = array_values(array_filter(array_map('trim', explode(',', $profilesRaw)), static fn (string $v): bool => '' !== $v));
                }

                // Content CSS hinzufügen mit Profil-Info
                $contentCssRaw = isset($set['content_css']) ? (string) $set['content_css'] : '';
                if ('' !== $contentCssRaw) {
                    $contentCss[] = [
                        'url' => $contentCssRaw,
                        'profiles' => $profiles,
                    ];
                }

                // Style Formats dekodieren und hinzufügen mit Profil-Info
                $styleFormatsRaw = isset($set['style_formats']) ? (string) $set['style_formats'] : '';
                if ('' !== $styleFormatsRaw) {
                    $formats = json_decode($styleFormatsRaw, true);
                    if (is_array($formats)) {
                        foreach ($formats as $format) {
                            if (!is_array($format)) {
                                continue;
                            }
                            $styleFormats[] = [
                                'format' => $format,
                                'profiles' => $profiles,
                            ];
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            \rex_logger::logException($e);
        }

        return [
            'content_css' => $contentCss,
            'style_formats' => $styleFormats,
        ];
    }

    /**
     * Provides the cleanpaste plugin configuration as a JS property.
     * Only used as a backend-only fallback. The primary config is embedded in profiles.js
     * via Profiles::profilesCreate() so it also works in the frontend.
     *
     * @deprecated Use Profiles::profilesCreate() – config is now embedded in profiles.js
     */
    public static function provideCleanPasteConfig(): void
    {
        $addon = self::getAddon();

        /** @var array<string, mixed> $cfg */
        $cfg = $addon->getConfig('cleanpaste_settings', [
            'strip_ms_office'        => true,
            'strip_google_docs'      => true,
            'remove_styles'          => true,
            'preserve_styles'        => [],
            'remove_classes'         => true,
            'preserve_classes'       => [],
            'remove_ids'             => true,
            'remove_data_attrs'      => true,
            'max_br'                 => 2,
            'max_empty_paragraphs'   => 2,
            'allowed_tags'           => [],
        ]);

        \rex_view::setJsProperty('tinyCleanPasteConfig', $cfg);
    }

    public static function provideProfileEditData(): void
    {
        if ('tinymce' === rex_be_controller::getCurrentPagePart(1) && 'profiles' === rex_be_controller::getCurrentPagePart(2)) {
            $i18n = [
                'profile_assistant' => \rex_i18n::msg('tinymce_profile_assistant'),
                'presets' => \rex_i18n::msg('tinymce_presets'),
                'simple' => \rex_i18n::msg('tinymce_simple'),
                'standard' => \rex_i18n::msg('tinymce_standard'),
                'full' => \rex_i18n::msg('tinymce_full'),
                'plugins' => \rex_i18n::msg('tinymce_plugins'),
                'toolbar' => \rex_i18n::msg('tinymce_toolbar'),
                'toolbar_help' => \rex_i18n::msg('tinymce_toolbar_help'),
                'available_items' => \rex_i18n::msg('tinymce_available_items'),
                'separator' => \rex_i18n::msg('tinymce_separator'),
                'selected_toolbar' => \rex_i18n::msg('tinymce_selected_toolbar'),
                'toolbar_result' => \rex_i18n::msg('tinymce_toolbar_result'),
                'common_settings' => \rex_i18n::msg('tinymce_common_settings'),
                'height' => \rex_i18n::msg('tinymce_height'),
                'height_help' => \rex_i18n::rawMsg('tinymce_height_help'),
                'width' => \rex_i18n::msg('tinymce_width'),
                'width_help' => \rex_i18n::rawMsg('tinymce_width_help'),
                'min_height' => \rex_i18n::msg('tinymce_min_height'),
                'max_height' => \rex_i18n::msg('tinymce_max_height'),
                'resize_handle' => \rex_i18n::msg('tinymce_resize_handle'),
                'resize_vertical' => \rex_i18n::msg('tinymce_resize_vertical'),
                'resize_off' => \rex_i18n::msg('tinymce_resize_off'),
                'resize_both' => \rex_i18n::msg('tinymce_resize_both'),
                'autoresize' => \rex_i18n::msg('tinymce_autoresize'),
                'autoresize_help' => \rex_i18n::rawMsg('tinymce_autoresize_help'),
                'menubar' => \rex_i18n::msg('tinymce_menubar'),
                'language' => \rex_i18n::msg('tinymce_language'),
                'advanced_settings' => \rex_i18n::msg('tinymce_advanced_settings'),
                'context_toolbar' => \rex_i18n::msg('tinymce_context_toolbar'),
                'context_toolbar_help' => \rex_i18n::msg('tinymce_context_toolbar_help'),
                'auto_hide_toolbar' => \rex_i18n::msg('tinymce_auto_hide_toolbar'),
                'image_caption' => \rex_i18n::msg('tinymce_image_caption'),
                'image_uploadtab' => \rex_i18n::msg('tinymce_image_uploadtab'),
                'media_manager_type' => \rex_i18n::msg('tinymce_media_manager_type'),
                'relative_urls' => \rex_i18n::msg('tinymce_relative_urls'),
                'remove_script_host' => \rex_i18n::msg('tinymce_remove_script_host'),
                'convert_urls' => \rex_i18n::msg('tinymce_convert_urls'),
                'document_base_url' => \rex_i18n::msg('tinymce_document_base_url'),
                'entity_encoding' => \rex_i18n::msg('tinymce_entity_encoding'),
                'link_schema_help' => \rex_i18n::rawMsg('tinymce_link_schema_help'),
                'extras_defaults' => \rex_i18n::msg('tinymce_extras_defaults'),
                'default_codesample_languages' => \rex_i18n::msg('tinymce_default_codesample_languages'),
                'default_rellist' => \rex_i18n::msg('tinymce_default_rellist'),
                'toc_depth' => \rex_i18n::msg('tinymce_toc_depth'),
                'toc_header_tag' => \rex_i18n::msg('tinymce_toc_header_tag'),
                'toc_class' => \rex_i18n::msg('tinymce_toc_class'),
                'generate_config' => \rex_i18n::msg('tinymce_generate_config'),
                'overwrites_existing_config' => \rex_i18n::msg('tinymce_overwrites_existing_config'),
                'none' => \rex_i18n::msg('tinymce_none'),
                'imagewidth' => \rex_i18n::msg('tinymce_imagewidth'),
                'imagewidth_help' => \rex_i18n::rawMsg('tinymce_imagewidth_help'),
                'imagewidth_enable' => \rex_i18n::msg('tinymce_imagewidth_enable'),
                'imagewidth_framework' => \rex_i18n::msg('tinymce_imagewidth_framework'),
                'imagewidth_general' => \rex_i18n::msg('tinymce_imagewidth_general'),
                'imagewidth_dialog' => \rex_i18n::msg('tinymce_imagewidth_dialog'),
                'imagewidth_template' => \rex_i18n::msg('tinymce_imagewidth_template'),
                'imagewidth_breakpoint' => \rex_i18n::msg('tinymce_imagewidth_breakpoint'),
                'insert_menu' => \rex_i18n::msg('tinymce_insert_menu'),
                'insert_menu_help' => \rex_i18n::msg('tinymce_insert_menu_help'),
                'insert_menu_title' => \rex_i18n::msg('tinymce_insert_menu_title'),
                'insert_menu_result' => \rex_i18n::msg('tinymce_insert_menu_result'),
                'load_from_config' => \rex_i18n::msg('tinymce_load_from_config'),
                'load_from_config_help' => \rex_i18n::msg('tinymce_load_from_config_help'),
                'loaded_from_config' => \rex_i18n::msg('tinymce_loaded_from_config'),
                'load_failed' => \rex_i18n::msg('tinymce_load_failed'),
                'custom_menu_items' => \rex_i18n::msg('tinymce_custom_menu_items'),
                'for_plugins_hint' => \rex_i18n::msg('tinymce_for_plugins_hint'),
                'addon_plugins_hint' => \rex_i18n::msg('tinymce_addon_plugins_hint'),
            ];

            \rex_view::setJsProperty('tinymceProfileI18n', $i18n);

            $options = [
                'plugins' => [
                    'preview', 'searchreplace', 'autolink', 'directionality', 'visualblocks', 'visualchars', 'fullscreen',
                    'image', 'link', 'media', 'codesample', 'table', 'charmap', 'pagebreak', 'nonbreaking', 'anchor',
                    'insertdatetime', 'advlist', 'lists', 'wordcount', 'help', 'emoticons', 'code', 'save',
                    'accordion', 'autoresize', 'autosave', 'importcss', 'quickbars', 'snippets', 'for_images'
                ],
                'toolbar' => [
                    'styles', 'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
                    'forecolor', 'backcolor', 'removeformat', 'blocks', 'fontfamily', 'fontsize',
                    'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'outdent', 'indent', 'numlist', 'bullist',
                    'table', 'link', 'image', 'media', 'codesample', 'fullscreen', 'preview', 'code', 'help',
                    'accordion', 'restoredraft', 'snippets'
                ],
                // Default TinyMCE insert-menu items (from core plugins).
                'menu_insert_items' => [
                    'image', 'link', 'media', 'codesample', 'inserttable', 'charmap', 'emoticons',
                    'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime',
                ],
                // Custom plugin menu items (name => label). Keeps the assistant aware of
                // menu entries registered by custom_plugins via editor.ui.registry.addMenuItem().
                'custom_menu_items' => [
                    'for_oembed'           => 'oEmbed (YouTube/Vimeo)',
                    'for_video'            => 'Video (Mediapool)',
                    'for_htmlembed'        => 'HTML Embed',
                    'for_checklist'        => 'Checkliste',
                    'for_checklist_feature' => 'Checkliste – Feature',
                    'for_footnote'         => 'Fußnote',
                    'for_a11y'             => 'Barrierefreiheit prüfen…',
                    'for_toc'              => 'Inhaltsverzeichnis',
                    'for_markdown_paste'   => 'Markdown einfügen…',
                    'for_chars_symbols'    => 'Zeichen, Symbole & Emoji',
                    'for_chars_symbols_invisibles' => 'Unsichtbare Zeichen anzeigen',
                ],
                'external_plugins' => [],
                // Names of plugins registered by OTHER AddOns (not bundled with
                // the tinymce addon itself). Used by the profile assistant to
                // visually highlight them as "AddOn plugins" (green). Detection
                // happens via URL path: bundled plugins live under the tinymce
                // addon assets path, external ones don't.
                'addon_plugins' => [],
                'addon_toolbar_buttons' => [],
                // Names of plugins/buttons bundled with the tinymce addon itself
                // (FriendsOfREDAXO custom plugins). Includes legacy ones that
                // predate the `for_` naming convention (e.g. mediapaste, snippets,
                // cleanpaste, phonelink, quote, link_yform, …). Used by the
                // profile assistant to color these as FOR-plugins even if their
                // name does not start with `for_`.
                'for_plugins' => [],
                'for_toolbar_buttons' => [],
            ];

            // Split registered plugins into "bundled with tinymce addon" (FOR)
            // and "provided by other addons" (AddOn) based on the plugin URL path.
            $tinymceAssetsBase = (string) \rex_url::addonAssets('tinymce', '');
            $addonPlugins = [];
            $addonToolbarButtons = [];
            $forPlugins = [];
            $forToolbarButtons = [];
            foreach (PluginRegistry::getPlugins() as $pluginName => $pluginData) {
                $pluginUrl = (string) ($pluginData['url'] ?? '');
                if ('' === $pluginUrl) {
                    continue;
                }
                // Strip query string (cache-buster) before comparing
                $pluginUrlPath = (string) (parse_url($pluginUrl, PHP_URL_PATH) ?? $pluginUrl);
                $isBundled = '' !== $tinymceAssetsBase && str_contains($pluginUrlPath, rtrim($tinymceAssetsBase, '/'));
                $toolbarBtn = $pluginData['toolbar'] ?? null;
                if ($isBundled) {
                    $forPlugins[] = (string) $pluginName;
                    if (null !== $toolbarBtn && '' !== $toolbarBtn) {
                        $forToolbarButtons[] = (string) $toolbarBtn;
                    }
                    continue;
                }
                $addonPlugins[] = (string) $pluginName;
                if (null !== $toolbarBtn && '' !== $toolbarBtn) {
                    $addonToolbarButtons[] = (string) $toolbarBtn;
                }
            }
            $options['addon_plugins'] = array_values(array_unique($addonPlugins));
            $options['addon_toolbar_buttons'] = array_values(array_unique($addonToolbarButtons));
            $options['for_plugins'] = array_values(array_unique($forPlugins));
            $options['for_toolbar_buttons'] = array_values(array_unique($forToolbarButtons));

            $options = \rex_extension::registerPoint(new \rex_extension_point('TINYMCE_PROFILE_OPTIONS', $options));

            \rex_view::setJsProperty('tinymceProfileOptions', $options);

            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profile.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profile_builder.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profiles-list.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/alphanum/jquery.alphanum.js'));
        }
    }

    public static function providePopupAssets(): void
    {
        try {
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/linkmap.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    private static function getAddon(): rex_addon_interface|rex_addon
    {
        return rex_addon::get('tinymce');
    }
}
