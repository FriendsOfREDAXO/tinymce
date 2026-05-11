<?php

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Provider\Assets as TinyMceAssetsProvider;
use FriendsOfRedaxo\TinyMce\Utils\AssetUrl;

$addon = rex_addon::get('tinymce');

if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce_addon[]');

    // Register custom plugins with rex_url::addonAssets() for correct absolute paths
    $pluginBasePath = AssetUrl::getTinyPluginBaseUrl() . '/';

    // Plugin registrations: plugin name, file path, button/feature names (optional)
    $customPlugins = [
        'link_yform' => ['link_yform/plugin.min.js', ['link_yform']],
        'phonelink' => ['phonelink/plugin.min.js', ['phonelink']],
        'quote' => ['quote/plugin.min.js', ['quote']],
        'snippets' => ['snippets/plugin.min.js', ['snippets']],
        'cleanpaste' => ['cleanpaste/plugin.min.js', []],
        'mediapaste' => ['mediapaste/plugin.min.js', []],
        'for_footnotes' => ['for_footnotes/plugin.min.js', ['for_footnote_insert', 'for_footnote_update']],
        'for_checklist' => ['for_checklist/plugin.min.js', ['for_checklist', 'for_checklist_feature']],
        'for_htmlembed' => ['for_htmlembed/plugin.min.js', ['for_htmlembed']],
        'for_oembed' => ['for_oembed/plugin.min.js', ['for_oembed']],
        'for_video' => ['for_video/plugin.min.js', ['for_video']],
        'for_a11y' => ['for_a11y/plugin.min.js', ['for_a11y']],
        'for_toc' => ['for_toc/plugin.min.js', ['for_toc_insert', 'for_toc_update']],
        'for_markdown' => ['for_markdown/plugin.min.js', ['for_markdown_paste']],
        'for_chars_symbols' => ['for_chars_symbols/plugin.min.js', ['for_chars_symbols']],
        'for_abbr' => ['for_abbr/plugin.min.js', ['for_abbr']],
        'for_images' => [
            'for_images/plugin.min.js',
            ['imagewidthdialog', 'imagewidth', 'for_imagealignleft', 'for_imagealigncenter', 'for_imagealignright', 'for_imagealignnone', 'imageeffect', 'imagealt', 'imagecaption', 'imageshowpool', 'imageswappool'],
        ],
    ];

    foreach ($customPlugins as $pluginName => $config) {
        $filePath = $config[0];
        $buttons = $config[1];

        // If buttons are specified, register each button individually
        if (!empty($buttons)) {
            foreach ($buttons as $button) {
                \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin($pluginName, $pluginBasePath . $filePath, $button);
            }
        } else {
            // No buttons specified (content-processing plugins)
            \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin($pluginName, $pluginBasePath . $filePath);
        }
    }
}

if (rex::isBackend() && null !== rex::getUser()) {
    rex_extension::register('PACKAGES_INCLUDED', static function () {
        TinyMceAssetsProvider::provideBaseAssets();
        TinyMceAssetsProvider::provideDemoAssets();
        TinyMceAssetsProvider::provideProfileEditData();
    });

    if ('tinymce' === rex_be_controller::getCurrentPagePart(1)) {
        rex_extension::register(['REX_FORM_SAVED', 'REX_FORM_DELETED', 'TINY_PROFILE_CLONE', 'TINY_PROFILE_DELETE', 'TINY_PROFILE_ADD', 'TINY_PROFILE_UPDATED'], ['\FriendsOfRedaxo\TinyMce\Handler\Extension', 'createProfiles']);
    }
    if (str_starts_with(rex_request('page'), 'mediapool/') && ('tiny' === rex_request('addon', 'string', '') || 'REX_MEDIA_tinymce_filelink' === rex_request('opener_input_field', 'string', ''))) {
        rex_extension::register('OUTPUT_FILTER', static function ($ep) {
            $subject = $ep->getSubject();
            $subject = str_replace('</form>', '<input type="hidden" name="addon" value="tiny"></form>', $subject);
            $subject = str_replace('"#rex-js-page-main">', '"#rex-js-page-main">
                <ul class="nav nav-tabs tiny-nav">
                    <li><a href="/redaxo/index.php?page=insertlink&opener_input_field=&clang=1">Struktur</a></li>
                    <li class="active"><a href="#">Medienpool</a></li>
                </ul>', $subject);
            return str_replace('selectMedia', 'selectLink', $subject);
        });

        TinyMceAssetsProvider::providePopupAssets();
    }

    if (null !== $addon->getConfig('update_profiles', false)) {
        try {
            TinyMceProfilesCreator::profilesCreate();
            $addon->setConfig('update_profiles', false);
        } catch (rex_functional_exception $e) {
            // Log generation failure to identify permission/disk issues
            rex_logger::logException($e, 'tinymce_profiles_generation_failed');
        }
    }
}
