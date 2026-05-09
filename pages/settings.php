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
        $uploadSettings = [
            'upload_enabled'            => (bool) rex_request::request('upload_enabled', 'boolean', false),
            'upload_default_category'   => (int) rex_request::request('upload_default_category', 'int', -1),
            'upload_media_manager_type' => trim(rex_request::request('upload_media_manager_type', 'string', '')),
        ];
        $addon->setConfig('media_upload_settings', $uploadSettings);

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

/** @var array{upload_enabled: bool, upload_default_category: int, upload_media_manager_type: string} $uploadCfg */
$uploadCfg = $addon->getConfig('media_upload_settings', [
    'upload_enabled'            => false,
    'upload_default_category'   => -1,
    'upload_media_manager_type' => '',
]);

// Helper: render media category <option> elements recursively
$renderCategoryOptions = static function (array $cats, int $selected, int $depth = 0) use (&$renderCategoryOptions): string {
    $html = '';
    foreach ($cats as $cat) {
        $prefix = str_repeat('&nbsp;&nbsp;', $depth);
        $sel    = ($cat->getId() === $selected) ? ' selected' : '';
        $html  .= '<option value="' . $cat->getId() . '"' . $sel . '>' . $prefix . rex_escape($cat->getName()) . '</option>';
        /** @var list<rex_media_category> $children */
        $children = $cat->getChildren();
        $html    .= $renderCategoryOptions($children, $selected, $depth + 1);
    }
    return $html;
};

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
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('mediapaste_section_title') ?></div>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" name="upload_enabled" value="1"
                                <?= !empty($uploadCfg['upload_enabled']) ? 'checked' : '' ?>>
                            <?= $addon->i18n('mediapaste_upload_enabled') ?>
                        </label>
                    </div>
                    <p class="help-block"><?= $addon->i18n('mediapaste_upload_enabled_help') ?></p>
                </div>

                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('mediapaste_default_category') ?></label>
                            <select class="form-control" name="upload_default_category">
                                <option value="-1"<?= ((int) $uploadCfg['upload_default_category']) === -1 ? ' selected' : '' ?>>
                                    <?= $addon->i18n('mediapaste_category_ask') ?>
                                </option>
                                <option value="0"<?= ((int) $uploadCfg['upload_default_category']) === 0 ? ' selected' : '' ?>>
                                    <?= rex_escape(rex_i18n::hasMsg('pool_kats_no_category') ? rex_i18n::msg('pool_kats_no_category') : rex_i18n::msg('tinymce_media_no_category')) ?>
                                </option>
                                <?= $renderCategoryOptions(rex_media_category::getRootCategories(), (int) $uploadCfg['upload_default_category']) ?>
                            </select>
                            <p class="help-block"><?= $addon->i18n('mediapaste_default_category_help') ?></p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('mediapaste_media_manager_type') ?></label>
                            <input type="text" class="form-control" name="upload_media_manager_type"
                                value="<?= rex_escape($uploadCfg['upload_media_manager_type']) ?>"
                                placeholder="tiny">
                            <p class="help-block"><?= $addon->i18n('mediapaste_media_manager_type_help') ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="rex-form-panel-footer">
            <div class="btn-toolbar">
                <button class="btn btn-save" type="submit"><?= $addon->i18n('settings_regenerate') ?></button>
            </div>
        </div>
    </form>
</div>
