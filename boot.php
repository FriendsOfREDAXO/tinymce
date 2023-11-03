<?php

use FriendsOfRedaxo\TinyMce\Creator\TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Handler\TinyMceUploadHandler;
use FriendsOfRedaxo\TinyMce\Provider\TinyMceAssetsProvider;

$addon = rex_addon::get('tinymce');

// register permissions
if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce_addon[]');
}

// add assets to backend
if (rex::isBackend() && rex::getUser()) {

    // Load assets
    TinyMceAssetsProvider::provideBaseAssets();
    TinyMceAssetsProvider::provideDemoAssets();
    TinyMceAssetsProvider::provideProfileEditData();

    // upload image
    if (1 == rex_request::request('tinymceupload')) {
        TinyMceUploadHandler::uploadTinyMceImg();
    }

    // register extension point actions
    if ('tinymce' == rex_be_controller::getCurrentPagePart(1)) {
        rex_extension::register('PAGES_PREPARED', ['\FriendsOfRedaxo\TinyMce\Handler\TinyMceExtensionHandler', 'hiddenMain'], rex_extension::EARLY);
        rex_extension::register('REX_FORM_CONTROL_FIELDS', ['\FriendsOfRedaxo\TinyMce\Handler\TinyMceExtensionHandler', 'removeDemoControlFields'], rex_extension::LATE);
        rex_extension::register(['REX_FORM_SAVED', 'REX_FORM_DELETED', 'TINY_PROFILE_CLONE', 'TINY_PROFILE_DELETE', 'TINY_PROFILE_ADD', 'TINY_PROFILE_UPDATED'], ['\FriendsOfRedaxo\TinyMce\Handler\TinyMceExtensionHandler', 'createProfiles']);
    }
    if (str_starts_with(rex_request('page'), 'mediapool/') && ('tiny' == rex_request('addon') || 'REX_MEDIA_tinymce_filelink' == rex_request('opener_input_field'))) {
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

    // Recreate profiles after update
    if ($addon->getConfig('update_profiles', false)) {
        try {
            TinyMceProfilesCreator::profilesCreate();
            $addon->setConfig('update_profiles', false);
        } catch (\rex_functional_exception $e) {
        }
    }
}
