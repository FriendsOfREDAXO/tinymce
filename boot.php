<?php

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Provider\Assets as TinyMceAssetsProvider;
use FriendsOfRedaxo\TinyMce\Utils\AssetUrl;

$addon = rex_addon::get('tinymce');

if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce_addon[]');

    // Register custom plugins with rex_url::addonAssets() for correct absolute paths
    $pluginBasePath = AssetUrl::getTinyPluginBaseUrl() . '/';
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('link_yform', $pluginBasePath . 'link_yform/plugin.min.js', 'link_yform');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('phonelink', $pluginBasePath . 'phonelink/plugin.min.js', 'phonelink');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('quote', $pluginBasePath . 'quote/plugin.min.js', 'quote');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('snippets', $pluginBasePath . 'snippets/plugin.min.js', 'snippets');
    // for_images registriert KEINEN Button unter dem Plugin-Namen, sondern
    // mehrere spezifische Buttons (imagewidth, imagewidthdialog, imagealt,
    // imagecaption, imagealignleft/center/right/none, imageeffect) und eine
    // Context-Toolbar. Jeder Button wird hier einzeln registriert, damit er
    // im Profil-Assistenten ausgewählt werden kann.
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagewidthdialog');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagewidth');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagealignleft');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagealigncenter');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagealignright');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagealignnone');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imageeffect');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagealt');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_images', $pluginBasePath . 'for_images/plugin.min.js', 'imagecaption');
    // cleanpaste + mediapaste sind reine Content-Processing-Plugins
    // (PastePreProcess-Handler) und registrieren KEINEN Toolbar-Button.
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('cleanpaste', $pluginBasePath . 'cleanpaste/plugin.min.js');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('mediapaste', $pluginBasePath . 'mediapaste/plugin.min.js');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_footnotes', $pluginBasePath . 'for_footnotes/plugin.min.js', 'for_footnote_insert');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_footnotes', $pluginBasePath . 'for_footnotes/plugin.min.js', 'for_footnote_update');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_checklist', $pluginBasePath . 'for_checklist/plugin.min.js', 'for_checklist');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_checklist', $pluginBasePath . 'for_checklist/plugin.min.js', 'for_checklist_feature');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_htmlembed', $pluginBasePath . 'for_htmlembed/plugin.min.js', 'for_htmlembed');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_oembed', $pluginBasePath . 'for_oembed/plugin.min.js', 'for_oembed');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_video', $pluginBasePath . 'for_video/plugin.min.js', 'for_video');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_a11y', $pluginBasePath . 'for_a11y/plugin.min.js', 'for_a11y');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_toc', $pluginBasePath . 'for_toc/plugin.min.js', 'for_toc_insert');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_toc', $pluginBasePath . 'for_toc/plugin.min.js', 'for_toc_update');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_markdown', $pluginBasePath . 'for_markdown/plugin.min.js', 'for_markdown_paste');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_chars_symbols', $pluginBasePath . 'for_chars_symbols/plugin.min.js', 'for_chars_symbols');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('for_abbr', $pluginBasePath . 'for_abbr/plugin.min.js', 'for_abbr');
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
        }
    }
}
