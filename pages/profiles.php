<?php

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Utils\ListHelper as TinyMceListHelper;

$func = rex_request::request('func', 'string');
$id = (int) rex_request::request('id', 'int');
$start = rex_request::request('start', 'int', null);
$send = rex_request::request('send', 'boolean', false);

$profileTable = rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES);
$message = '';

if ('clone' === $func) {
    $message = TinyMceListHelper::cloneData($profileTable, $id);
    rex_extension::registerPoint(new rex_extension_point('TINY_PROFILE_CLONE', $id));
    $func = '';
}

if ('delete' === $func) {
    $message = TinyMceListHelper::deleteData($profileTable, $id);
    rex_extension::registerPoint(new rex_extension_point('TINY_PROFILE_DELETE', $id));
    $func = '';
}

if ('' === $func) {
    $list = rex_list::factory("SELECT id, name, description FROM $profileTable ORDER BY id");
    $list->addTableAttribute('class', 'table-striped');

    $list->addTableColumnGroup([40, '*', '*', 100, 90, 120]);

    $list->removeColumn('id');

    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="' . rex_i18n::msg('tinymce_add_profile') . '"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon fa-cube"></i>';

    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    $list->setColumnLabel('name', rex_i18n::msg('tinymce_name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###', 'start' => $start]);

    $list->setColumnLabel('description', rex_i18n::msg('tinymce_description'));

    $list->addColumn('edit', '<i class="rex-icon fa-pencil-square-o"></i> ' . rex_i18n::msg('edit'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnLabel('edit', rex_i18n::msg('tinymce_list_function'));
    $list->setColumnLayout('edit', ['<th colspan="3">###VALUE###</th>', '<td>###VALUE###</td>']);
    $list->setColumnParams('edit', ['func' => 'edit', 'id' => '###id###', 'start' => $start]);

    $list->addColumn('delete', '');
    $list->setColumnLayout('delete', ['', '<td>###VALUE###</td>']);
    $list->setColumnParams('delete', ['func' => 'delete', 'id' => '###id###', 'start' => $start]);
    $list->setColumnFormat('delete', 'custom', static function ($params) {
        $list = $params['list'];
        return $list->getColumnLink($params['params']['name'], "<span class=\"{$params['params']['icon_type']}\"><i class=\"rex-icon {$params['params']['icon']}\"></i> {$params['params']['msg']}</span>");
    }, ['list' => $list, 'name' => 'delete', 'icon' => 'rex-icon-delete', 'icon_type' => 'rex-offline', 'msg' => rex_i18n::msg('delete')]);
    $list->addLinkAttribute('delete', 'data-confirm', rex_i18n::msg('delete') . ' ?');

    $list->addColumn('clone', '<i class="rex-icon fa-clone"></i> ' . rex_i18n::msg('tinymce_clone'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnParams('clone', ['func' => 'clone', 'id' => '###id###', 'start' => $start]);
    $list->addLinkAttribute('clone', 'data-confirm', rex_i18n::msg('tinymce_clone') . ' ?');

    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_list_profiles'));
    $fragment->setVar('content', $message . $content, false);
    echo $fragment->parse('core/page/section.php');
} elseif ('edit' === $func || 'add' === $func) {
    $id = rex_request('id', 'int');
    $form = rex_form::factory($profileTable, '', 'id=' . $id, 'post', false);
    $form->addParam('start', $start);
    $form->addParam('send', true);

    $default_value = ('add' === $func && false === $send) ? true : false;
    $mediapath = str_replace(['../', '/'], '', rex_url::media());

    if ('edit' === $func) {
        $form->addParam('id', $id);
    }

    $field = $form->addTextField('name');
    $field->setLabel(rex_i18n::msg('tinymce_name'));
    $field->setAttribute('id', 'tinymce-name-input');
    $field->setAttribute('placeholder', rex_i18n::msg('tinymce_name_placeholder'));

    $field = $form->addTextField('description');
    $field->setLabel(rex_i18n::msg('tinymce_description'));
    $field->setAttribute('placeholder', rex_i18n::msg('tinymce_description_placeholder'));

    $field = $form->addTextAreaField('extra');
    $field->setAttribute('style', 'height: 550px');
    $field->setAttribute('class', 'form-control tinymce-options');
    $field->setLabel(rex_i18n::msg('tinymce_extra_definition'));

    $content = '<div class="tinymce_profile_edit">' . $form->get() . '</div>';

    $fragment = new rex_fragment();
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('title', ('edit' === $func) ? rex_i18n::msg('tinymce_profile_edit') : rex_i18n::msg('tinymce_profile_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');
}
