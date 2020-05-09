<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

use TinyMCE5\Creator\TinyMCE5ProfilesCreator;

/** @var rex_addon $this */

$func = rex_request::request('func', 'string');
$id = rex_request::request('id', 'int');
$start = rex_request::request('start', 'int', NULL);
$send = rex_request::request('send', 'boolean', false);

$profileTable = rex::getTable(\TinyMCE5\Handler\TinyMCE5DatabaseHandler::TINY5_PROFILES);
$message = '';

if ($func == 'clone') {
    $message = \TinyMCE5\Utils\TinyMCE5ListHelper::cloneData($profileTable, $id);
    rex_extension::registerPoint(new rex_extension_point('TINY5_PROFILE_CLONE', $id));
    $func = '';
}

if ($func == 'delete') {
    $message = \TinyMCE5\Utils\TinyMCE5ListHelper::deleteData($profileTable, $id);
    rex_extension::registerPoint(new rex_extension_point('TINY5_PROFILE_DELETE', $id));
    $func = '';
}

if ($func == '') {
    // instance list
    $list = rex_list::factory("SELECT id, name, description FROM $profileTable ORDER BY id");
    $list->addTableAttribute('class', 'table-striped');

    // column with
    $list->addTableColumnGroup(array(40, '*', '*', 100, 90, 120));

    // hide column
    $list->removeColumn('id');

    // action add/edit
    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="' . rex_i18n::msg('tinymce5_add_profile') . '"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon fa-cube"></i>';

    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    // name
    $list->setColumnLabel('name', rex_i18n::msg('tinymce5_name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###', 'start' => $start]);

    // description
    $list->setColumnLabel('description', rex_i18n::msg('tinymce5_description'));

    // edit
    $list->addColumn('edit', '<i class="rex-icon fa-pencil-square-o"></i> ' . rex_i18n::msg('edit'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnLabel('edit', rex_i18n::msg('tinymce5_list_function'));
    $list->setColumnLayout('edit', array('<th colspan="3">###VALUE###</th>', '<td>###VALUE###</td>'));
    $list->setColumnParams('edit', ['func' => 'edit', 'id' => '###id###', 'start' => $start]);

    // delete
    $list->addColumn('delete', '');
    $list->setColumnLayout('delete', array('', '<td>###VALUE###</td>'));
    $list->setColumnParams('delete', ['func' => 'delete', 'id' => '###id###', 'start' => $start]);
    $list->setColumnFormat('delete', 'custom', function ($params) {
        $list = $params['list'];
        return $list->getColumnLink($params['params']['name'], "<span class=\"{$params['params']['icon_type']}\"><i class=\"rex-icon {$params['params']['icon']}\"></i> {$params['params']['msg']}</span>");

    }, array('list' => $list, 'name' => 'delete', 'icon' => 'rex-icon-delete', 'icon_type' => 'rex-offline', 'msg' => rex_i18n::msg('delete')));
    $list->addLinkAttribute('delete', 'data-confirm', rex_i18n::msg('delete') . ' ?');

    // clone
    $list->addColumn('clone', '<i class="rex-icon fa-clone"></i> ' . rex_i18n::msg('tinymce5_clone'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnParams('clone', ['func' => 'clone', 'id' => '###id###', 'start' => $start]);
    $list->addLinkAttribute('clone', 'data-confirm', rex_i18n::msg('tinymce5_clone') . ' ?');

    // show
    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce5_list_profiles'));
    $fragment->setVar('content', $message . $content, false);
    echo $fragment->parse('core/page/section.php');

} elseif ($func == 'edit' || $func == 'add') {

    $id = rex_request('id', 'int');
    $form = rex_form::factory($profileTable, '', 'id=' . $id, 'post', false);
    $form->addParam('start', $start);
    $form->addParam('send', true);

    $default_value = ($func == 'add' && $send == false) ? true : false;
    $mediapath = str_replace(['../', '/'], '', rex_url::media());

    if ($func == 'edit') {
        $form->addParam('id', $id);
    }

    // name
    $field = $form->addTextField('name');
    $field->setLabel(rex_i18n::msg('tinymce5_name'));
    $field->setAttribute('id', 'tinymce5-name-input');
    $field->setAttribute('placeholder', rex_i18n::msg('tinymce5_name_placeholder'));

    // description
    $field = $form->addTextField('description');
    $field->setLabel(rex_i18n::msg('tinymce5_description'));
    $field->setAttribute('placeholder', rex_i18n::msg('tinymce5_description_placeholder'));

    /*
    // plugins
    $af = \TinyMCE5\Creator\TinyMCE5ProfilesCreator::ALLOWED_FIELDS;

    $field = $form->addTextField('plugins');
    $field->setAttribute('id', 'tinymce5plugins-input');
    $field->setAttribute('data-tag-init', 1);
    $field->setAttribute('data-defaults', TinyMCE5ProfilesCreator::DEFAULTS['plugins']);
    $field->setAttribute('data-intersect-tags', '["' . implode('","', array_intersect($af['plugins'], $af['toolbar'])) . '"]');
    $field->setAttribute('data-tags', '["' . implode('","', $af['plugins']) . '"]');
    $field->setLabel(rex_i18n::msg('tinymce5_plugins'));
    if ($default_value) $field->setAttribute('data-default-tags', 1);

    // toolbar
    $field = $form->addTextField('toolbar');
    $field->setAttribute('id', 'tinymce5toolbar-input');
    $field->setAttribute('data-tag-init', 1);
    $field->setAttribute('data-defaults', TinyMCE5ProfilesCreator::DEFAULTS['toolbar']);
    $field->setAttribute('data-diff-tags', '["' . implode('","', array_diff($af['toolbar'], $af['plugins'])) . '"]');
    // $field->setAttribute('data-tags', '["' . implode('","', array_diff($af['toolbar'], $af['plugins'])) . '"]');
    $field->setAttribute('data-tags', '["' . implode('","', $af['toolbar']) . '"]');
    $field->setLabel(rex_i18n::msg('tinymce5_toolbar'));
    if ($default_value) $field->setAttribute('data-default-tags', 1);
    */

    $field = $form->addTextAreaField('extra');
    $field->setAttribute('style','height: 550px');
    $field->setLabel(rex_i18n::msg('tinymce5_extra_definition'));

    $content = '<div class="tinymce5_profile_edit">' . $form->get() . '</div>';

    $fragment = new rex_fragment();
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('title', ($func == 'edit') ? rex_i18n::msg('tinymce5_profile_edit') : rex_i18n::msg('tinymce5_profile_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');
}
