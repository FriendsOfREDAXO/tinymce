<?php

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;

$addon = rex_addon::get('tinymce');

$send = rex_request::request('send', 'boolean', false);
$message = '';

if ($send) {
    $settings = [
        'strip_ms_office'        => (bool) rex_request::request('strip_ms_office', 'boolean', false),
        'strip_google_docs'      => (bool) rex_request::request('strip_google_docs', 'boolean', false),
        'remove_styles'          => (bool) rex_request::request('remove_styles', 'boolean', false),
        'preserve_styles'        => array_values(array_filter(
            array_map('trim', explode("\n", rex_request::request('preserve_styles', 'string', '')))
        )),
        'remove_classes'         => (bool) rex_request::request('remove_classes', 'boolean', false),
        'preserve_classes'       => array_values(array_filter(
            array_map('trim', explode("\n", rex_request::request('preserve_classes', 'string', '')))
        )),
        'remove_ids'             => (bool) rex_request::request('remove_ids', 'boolean', false),
        'remove_data_attrs'      => (bool) rex_request::request('remove_data_attrs', 'boolean', false),
        'max_br'                 => max(0, (int) rex_request::request('max_br', 'int', 2)),
        'max_empty_paragraphs'   => max(0, (int) rex_request::request('max_empty_paragraphs', 'int', 2)),
        'allowed_tags'           => array_values(array_filter(
            array_map('trim', explode("\n", rex_request::request('allowed_tags', 'string', '')))
        )),
    ];

    $addon->setConfig('cleanpaste_settings', $settings);

    // Rebuild profiles.js so the new cleanpaste config is embedded (works frontend + backend)
    try {
        TinyMceProfilesCreator::profilesCreate();
    } catch (rex_functional_exception $e) {
        rex_logger::logException($e);
    }

    $message = rex_view::success($addon->i18n('cleanpaste_saved'));
}

/** @var array{
 *   strip_ms_office: bool,
 *   strip_google_docs: bool,
 *   remove_styles: bool,
 *   preserve_styles: list<string>,
 *   remove_classes: bool,
 *   preserve_classes: list<string>,
 *   remove_ids: bool,
 *   remove_data_attrs: bool,
 *   max_br: int,
 *   max_empty_paragraphs: int,
 *   allowed_tags: list<string>
 * } $cfg */
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

echo $message;

$formUrl = rex_url::currentBackendPage([], false);

?>
<div class="rex-form">
    <form action="<?= rex_escape($formUrl) ?>" method="post">
        <input type="hidden" name="send" value="1">

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('cleanpaste_section_source') ?></div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="strip_ms_office" value="1"
                                        <?= $cfg['strip_ms_office'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_strip_ms_office') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_strip_ms_office_help') ?></p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="strip_google_docs" value="1"
                                        <?= $cfg['strip_google_docs'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_strip_google_docs') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_strip_google_docs_help') ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('cleanpaste_section_styles') ?></div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remove_styles" value="1"
                                        <?= $cfg['remove_styles'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_remove_styles') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_remove_styles_help') ?></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('cleanpaste_preserve_styles') ?></label>
                            <textarea class="form-control" name="preserve_styles" rows="5"
                                placeholder="color&#10;font-weight&#10;regex:^border-"><?= rex_escape(implode("\n", $cfg['preserve_styles'])) ?></textarea>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_preserve_styles_help') ?></p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remove_classes" value="1"
                                        <?= $cfg['remove_classes'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_remove_classes') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_remove_classes_help') ?></p>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('cleanpaste_preserve_classes') ?></label>
                            <textarea class="form-control" name="preserve_classes" rows="5"
                                placeholder="uk-card&#10;uk-text-lead&#10;regex:^uk-&#10;preserve_class:uikit-card"><?= rex_escape(implode("\n", $cfg['preserve_classes'])) ?></textarea>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_preserve_classes_help') ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('cleanpaste_section_attributes') ?></div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remove_ids" value="1"
                                        <?= $cfg['remove_ids'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_remove_ids') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_remove_ids_help') ?></p>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="form-group">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remove_data_attrs" value="1"
                                        <?= $cfg['remove_data_attrs'] ? 'checked' : '' ?>>
                                    <?= $addon->i18n('cleanpaste_remove_data_attrs') ?>
                                </label>
                            </div>
                            <p class="help-block"><?= $addon->i18n('cleanpaste_remove_data_attrs_help') ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('cleanpaste_section_whitespace') ?></div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('cleanpaste_max_br') ?></label>
                            <input type="number" class="form-control" name="max_br" min="0" max="10"
                                value="<?= (int) $cfg['max_br'] ?>">
                            <p class="help-block"><?= $addon->i18n('cleanpaste_max_br_help') ?></p>
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label class="control-label"><?= $addon->i18n('cleanpaste_max_empty_paragraphs') ?></label>
                            <input type="number" class="form-control" name="max_empty_paragraphs" min="0" max="10"
                                value="<?= (int) $cfg['max_empty_paragraphs'] ?>">
                            <p class="help-block"><?= $addon->i18n('cleanpaste_max_empty_paragraphs_help') ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="panel-title"><?= $addon->i18n('cleanpaste_section_tags') ?></div>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="control-label"><?= $addon->i18n('cleanpaste_allowed_tags') ?></label>
                    <textarea class="form-control" name="allowed_tags" rows="4"
                        placeholder="p&#10;br&#10;strong&#10;em&#10;a&#10;ul&#10;ol&#10;li&#10;h1&#10;h2&#10;h3"><?= rex_escape(implode("\n", $cfg['allowed_tags'])) ?></textarea>
                    <p class="help-block"><?= $addon->i18n('cleanpaste_allowed_tags_help') ?></p>
                </div>
            </div>
        </div>

        <div class="rex-form-panel-footer">
            <div class="btn-toolbar">
                <button type="submit" class="btn btn-save rex-form-aligned"><?= rex_i18n::msg('form_save') ?></button>
            </div>
        </div>

    </form>
</div>
