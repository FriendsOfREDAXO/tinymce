<?php

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Utils\AssetUrl;

$addon = rex_addon::get('tinymce');
$message = '';

$send = rex_request::request('send', 'boolean', false);
$csrfToken = rex_csrf_token::factory('tinymce_settings');

if ($send) {
    if (!$csrfToken->isValid()) {
        $message = rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        try {
            TinyMceProfilesCreator::profilesCreate();
        } catch (rex_functional_exception $e) {
            rex_logger::logException($e);
            $message = rex_view::error($addon->i18n('settings_saved_profiles_failed'));
        }

        if ('' === $message) {
            $message = rex_view::success($addon->i18n('settings_saved'));
        }
    }
}

$resolvedAssetBase = AssetUrl::getTinyAssetBaseUrl();
$resolvedPluginBase = AssetUrl::getTinyPluginBaseUrl();

$formUrl = rex_url::currentBackendPage([], false);

echo $message;

?>
<div class="rex-form">
    <form action="<?= rex_escape($formUrl) ?>" method="post">
        <?= $csrfToken->getHiddenField() ?>
        <input type="hidden" name="send" value="1">

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('settings_title') ?></div>
            </div>
            <div class="panel-body">
                <div class="alert alert-info" role="status">
                    <p><strong><?= $addon->i18n('settings_resolved_asset_base') ?>:</strong> <code><?= rex_escape($resolvedAssetBase) ?></code></p>
                    <p><strong><?= $addon->i18n('settings_resolved_plugin_base') ?>:</strong> <code><?= rex_escape($resolvedPluginBase) ?></code></p>
                </div>

                <p class="help-block"><?= $addon->i18n('settings_reload_hint') ?></p>
            </div>
            <div class="panel-footer">
                <button class="btn btn-save" type="submit"><?= $addon->i18n('settings_regenerate') ?></button>
            </div>
        </div>
    </form>
</div>
