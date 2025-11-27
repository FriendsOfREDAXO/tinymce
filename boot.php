<?php

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Provider\Assets as TinyMceAssetsProvider;

$addon = rex_addon::get('tinymce');

if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce_addon[]');

    // Register custom plugins
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('link_yform', rex_url::addonAssets('tinymce', 'scripts/tinymce/plugins/link_yform/plugin.min.js'), 'link_yform');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('phonelink', rex_url::addonAssets('tinymce', 'scripts/tinymce/plugins/phonelink/plugin.min.js'), 'phonelink');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('quote', rex_url::addonAssets('tinymce', 'scripts/tinymce/plugins/quote/plugin.min.js'), 'quote');
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin('snippets', rex_url::addonAssets('tinymce', 'scripts/tinymce/plugins/snippets/plugin.min.js'), 'snippets');
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
