<?php

$func = rex_request('func', 'string');
$id = rex_request('id', 'int');

if ($func == 'delete' && $id > 0) {
    $sql = rex_sql::factory();
    $sql->setTable(rex::getTable('tinymce_snippets'));
    $sql->setWhere(['id' => $id]);
    $sql->delete();
    echo rex_view::success(rex_i18n::msg('tinymce_snippets_deleted'));
    $func = '';
}

if ($func == 'add' || $func == 'edit') {
    $form = rex_form::factory(rex::getTable('tinymce_snippets'), '', 'id=' . $id);
    $form->addParam('id', $id);

    $field = $form->addTextField('name');
    $field->setLabel(rex_i18n::msg('tinymce_snippets_name'));
    $field->getValidator()->add('notEmpty', rex_i18n::msg('tinymce_snippets_name_empty'));

    $field = $form->addTextAreaField('content');
    $field->setLabel(rex_i18n::msg('tinymce_snippets_content'));
    $field->setAttribute('class', 'form-control tiny-editor');
    $field->setAttribute('data-profile', 'full');

    if ($func == 'edit') {
        $form->addParam('func', 'edit');
        $form->addHiddenField('updatedate', date('Y-m-d H:i:s'));
        $form->addHiddenField('updateuser', rex::getUser()->getLogin());
    } else {
        $form->addParam('func', 'add');
        $form->addHiddenField('createdate', date('Y-m-d H:i:s'));
        $form->addHiddenField('updatedate', date('Y-m-d H:i:s'));
        $form->addHiddenField('createuser', rex::getUser()->getLogin());
        $form->addHiddenField('updateuser', rex::getUser()->getLogin());
    }

    $content = $form->get();
    $fragment = new rex_fragment();
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('title', ($func == 'edit') ? rex_i18n::msg('tinymce_snippets_edit') : rex_i18n::msg('tinymce_snippets_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');

} else {
    $list = rex_list::factory('SELECT id, name, content FROM ' . rex::getTable('tinymce_snippets') . ' ORDER BY name ASC');
    $list->addTableAttribute('class', 'table-striped');

    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="' . rex_i18n::msg('tinymce_snippets_add') . '"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon rex-icon-edit"></i>';
    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    $list->setColumnLabel('name', rex_i18n::msg('tinymce_snippets_name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###']);

    $list->setColumnLabel('content', rex_i18n::msg('tinymce_snippets_content'));
    $list->setColumnFormat('content', 'custom', function ($params) {
        $content = strip_tags($params['value']);
        if (strlen($content) > 100) {
            $content = substr($content, 0, 100) . '...';
        }
        return $content;
    });

    $list->addColumn(rex_i18n::msg('delete'), rex_i18n::msg('delete'));
    $list->setColumnParams(rex_i18n::msg('delete'), ['func' => 'delete', 'id' => '###id###']);
    $list->addLinkAttribute(rex_i18n::msg('delete'), 'onclick', 'return confirm(\'' . rex_i18n::msg('delete') . ' ?\')');

    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_snippets'));
    $fragment->setVar('content', $content, false);
    echo $fragment->parse('core/page/section.php');
}
