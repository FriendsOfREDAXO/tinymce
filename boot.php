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
    \TinyMCE5\Provider\TinyMCE5AssetsProvider::provideViewAssets();
    \TinyMCE5\Provider\TinyMCE5AssetsProvider::provideBaseAssets();
    \TinyMCE5\Provider\TinyMCE5AssetsProvider::provideProfileEditData();

    // upload image
    if (rex_request::request('tinymce5upload') == 1) {
        \TinyMCE5\Handler\TinyMCE5UploadHandler::uploadTinyMCE5Img();
    }

    // register extension point actions
    if (rex_be_controller::getCurrentPagePart(1) == 'tinymce5') {
        rex_extension::register('PAGES_PREPARED', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'hiddenMain'], rex_extension::EARLY);
        rex_extension::register('REX_FORM_CONTROL_FIELDS', ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'removeDemoControlFields'], rex_extension::LATE);
        rex_extension::register(['REX_FORM_SAVED', 'REX_FORM_DELETED', 'TINY5_PROFILE_CLONE', 'TINY5_PROFILE_DELETE', 'TINY5_PROFILE_ADD', 'TINY5_PROFILE_UPDATED'], ['\TinyMCE5\Handler\TinyMCE5ExtensionHandler', 'createProfiles']);
    }
    if (rex_request('page') == 'mediapool/media' && rex_request('addon') == 'tiny5') {
        rex_extension::register('OUTPUT_FILTER',function($ep) {
            $subject = $ep->getSubject();
            $subject = str_replace('</form>','<input type="hidden" name="addon" value="tiny5"></form>',$subject);
            return str_replace('selectMedia','selectLink',$subject);
        });
        rex_view::addJsFile($addon->getAssetsUrl('js/rex5tinymce.js'));
    }
	
}
