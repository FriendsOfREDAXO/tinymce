<?php

use FriendsOfRedaxo\TinyMce\Handler\TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Utils\TinyMceListHelper;

$addon = rex_addon::get('tinymce');

$func = rex_request::request('func', 'string');
$id = rex_request::request('id', 'int');

$message = '';

if ('clone' === $func) {
    if (!rex_csrf_token::factory('tinymce_clone')->isValid()) {
        $message = rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $message = TinyMceListHelper::cloneData(rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES), $id);
        rex_extension::registerPoint(new rex_extension_point('TINY_PROFILE_CLONE', $id));
    }
    $func = '';
}

if ('delete' === $func) {
    if (!rex_csrf_token::factory('tinymce_delete')->isValid()) {
        $message = rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $message = TinyMceListHelper::deleteData(rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES), $id);
        rex_extension::registerPoint(new rex_extension_point('TINY_PROFILE_DELETE', $id));
    }
    $func = '';
}

if ('' === $func) {
    // instance list
    $list = rex_list::factory('SELECT `id`, `name`, `description` FROM '.rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES).' ORDER BY `id`');
    $list->addTableAttribute('class', 'table-striped');
    $list->addTableColumnGroup([40, '*', '*', 100, 90, 120]);
    $list->setNoRowsMessage($addon->i18n('profiles_no_results'));

    // hide column
    $list->removeColumn('id');

    // action add/edit
    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="'.rex_escape($addon->i18n('profile_add')).'"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon fa-cube"></i>';

    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    // name
    $list->setColumnLabel('name', $addon->i18n('name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###']);

    // description
    $list->setColumnLabel('description', $addon->i18n('description'));

    // edit
    $list->addColumn('edit', '<i class="rex-icon fa-pencil-square-o"></i> ' . rex_i18n::msg('edit'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnLabel('edit', $addon->i18n('list_function'));
    $list->setColumnLayout('edit', ['<th colspan="3">###VALUE###</th>', '<td>###VALUE###</td>']);
    $list->setColumnParams('edit', ['func' => 'edit', 'id' => '###id###']);

    // delete
    $list->addColumn('delete', '');
    $list->setColumnLayout('delete', ['', '<td>###VALUE###</td>']);
    $list->setColumnParams('delete', ['func' => 'delete', 'id' => '###id###'] + rex_csrf_token::factory('tinymce_delete')->getUrlParams());
    $list->setColumnFormat('delete', 'custom', static function ($params) {
        $list = $params['list'];
        return $list->getColumnLink('delete', '<span class="rex-offline"><i class="rex-icon rex-icon-delete"></i> '.rex_i18n::msg('delete').'</span>');

    });
    $list->addLinkAttribute('delete', 'data-confirm', rex_i18n::msg('delete') . ' ?');

    // clone
    $list->addColumn('clone', '<i class="rex-icon fa-clone"></i> ' . $addon->i18n('clone'), -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnParams('delete', ['func' => 'clone', 'id' => '###id###'] + rex_csrf_token::factory('tinymce_clone')->getUrlParams());
    $list->addLinkAttribute('clone', 'data-confirm', $addon->i18n('clone') . ' ?');

    // show
    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', $addon->i18n('list_profiles'));
    $fragment->setVar('content', $message . $content, false);
    echo $fragment->parse('core/page/section.php');

} elseif ('edit' === $func || 'add' === $func) {
    $id = rex_request('id', 'int');
    $form = rex_form::factory(rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES), '', 'id='.$id);

    if ('edit' === $func) {
        $form->addParam('id', $id);
    }

    // name
    $field = $form->addTextField('name');
    $field->setLabel($addon->i18n('name'));
    $field->setAttribute('id', 'tinymce-name-input');
    $field->setAttribute('placeholder', $addon->i18n('name_placeholder'));

    // description
    $field = $form->addTextField('description');
    $field->setLabel($addon->i18n('description'));
    $field->setAttribute('placeholder', $addon->i18n('description_placeholder'));

    $field = $form->addTextAreaField('extra');
    $field->setAttribute('style', 'height: 550px');
    $field->setLabel($addon->i18n('extra_definition'));

    $fragment = new rex_fragment();
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('title', ('edit' === $func) ? $addon->i18n('profile_edit') : $addon->i18n('profile_add'));
    $fragment->setVar('body', $form->get(), false);
    echo $fragment->parse('core/page/section.php');
}
