<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

/** @var rex_addon $this */

$addon = rex_addon::get('tinymce');

// register permissions
if (rex::isBackend() && is_object(rex::getUser())) {
    rex_perm::register('tinymce_addon[]');
}

// add assets to backend
if (rex::isBackend() && rex::getUser()) {
    // load assets
    \TinyMCE\Provider\TinyMCEAssetsProvider::provideViewAssets();
    \TinyMCE\Provider\TinyMCEAssetsProvider::provideBaseAssets();
    \TinyMCE\Provider\TinyMCEAssetsProvider::provideProfileEditData();

    // upload image
    if (rex_request::request('tinymceupload') == 1) {
        \TinyMCE\Handler\TinyMCEUploadHandler::uploadTinyMCEImg();
    }

    // register extension point actions
    if (rex_be_controller::getCurrentPagePart(1) == 'tinymce') {
        rex_extension::register('PAGES_PREPARED', ['\TinyMCE\Handler\TinyMCEExtensionHandler', 'hiddenMain'], rex_extension::EARLY);
        rex_extension::register('REX_FORM_CONTROL_FIELDS', ['\TinyMCE\Handler\TinyMCEExtensionHandler', 'removeDemoControlFields'], rex_extension::LATE);
        rex_extension::register(['REX_FORM_SAVED', 'REX_FORM_DELETED', 'TINY_PROFILE_CLONE', 'TINY_PROFILE_DELETE', 'TINY_PROFILE_ADD', 'TINY_PROFILE_UPDATED'], ['\TinyMCE\Handler\TinyMCEExtensionHandler', 'createProfiles']);
    }
    if (str_starts_with(rex_request('page'),'mediapool/') && (rex_request('addon') == 'tiny' || rex_request('opener_input_field') == 'REX_MEDIA_tinymce_filelink')) {
        rex_extension::register('OUTPUT_FILTER',function($ep) {
            $subject = $ep->getSubject();
            $subject = str_replace('</form>','<input type="hidden" name="addon" value="tiny"></form>',$subject);
            $subject = str_replace('"#rex-js-page-main">','"#rex-js-page-main">
        <ul class="nav nav-tabs tiny-nav">
            <li><a href="/redaxo/index.php?page=insertlink&opener_input_field=&clang=1">Struktur</a></li>
    <li class="active"><a href="#">Medienpool</a></li>
        </ul>
',$subject);
            return str_replace('selectMedia','selectLink',$subject);
        });
        rex_view::addJsFile($addon->getAssetsUrl('js/rextinymce.js'));
    }

    // Recreate profiles after update
    if ($addon->getConfig('update_profiles', false) == true ) {
        try {
            \TinyMCE\Creator\TinyMCEProfilesCreator::profilesCreate();
            $addon->setConfig('update_profiles', false);
        }
        catch(\rex_functional_exception $e) {
        }
    }
}
