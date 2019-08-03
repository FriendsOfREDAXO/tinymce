<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

/** @var rex_addon $this */

// register permissions
if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce5_addon[]');
}

// add assets to backend
if (rex::isBackend() && rex::getUser()) {
    // load assets
    \TinyMCE5\Provider\TinyMCE5AssetsProvider::provideBaseAssets();

    // upload image
    if (rex_request::request('tinymce5upload') == 1) {
        \TinyMCE5\Handler\TinyMCE5UploadHandler::uploadTinyMCE5Img();
    }

    // register extension point actions
    if (rex_be_controller::getCurrentPagePart(1) == 'tinymce5') {
        rex_extension::register('PAGES_PREPARED', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'hiddenMain'], rex_extension::EARLY);
//        rex_extension::register('PAGE_TITLE', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'addIcon'], rex_extension::EARLY);
//        rex_extension::register('PAGES_PREPARED', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'hiddenMain'], rex_extension::EARLY);
        rex_extension::register('REX_FORM_CONTROL_FIELDS', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'removeDemoControlFields'], rex_extension::LATE);
        rex_extension::register(['REX_FORM_SAVED', 'REX_FORM_DELETED', 'TINY5_PROFILE_CLONE', 'TINY5_PROFILE_DELETE', 'TINY5_PROFILE_ADD', 'TINY5_PROFILE_UPDATED'], ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'createProfiles']);
    }
}
