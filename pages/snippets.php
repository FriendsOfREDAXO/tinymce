<?php

$func = rex_request('func', 'string');
$id = rex_request('id', 'int');

$csrfToken = rex_csrf_token::factory('tinymce_snippets');

if ($func == 'delete' && $id > 0) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $sql = rex_sql::factory();
        $sql->setTable(rex::getTable('tinymce_snippets'));
        $sql->setWhere(['id' => $id]);
        $sql->delete();
        echo rex_view::success(rex_i18n::msg('tinymce_snippets_deleted'));
    }
    $func = '';
}

if ('toggle' === $func && $id > 0) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $sql = rex_sql::factory();
        $current = $sql->getArray('SELECT active FROM ' . rex::getTable('tinymce_snippets') . ' WHERE id = :id', ['id' => $id]);
        if (!empty($current)) {
            $newActive = (1 === (int) $current[0]['active']) ? 0 : 1;
            $upd = rex_sql::factory();
            $upd->setTable(rex::getTable('tinymce_snippets'));
            $upd->setWhere(['id' => $id]);
            $upd->setValue('active', $newActive);
            $upd->setValue('updatedate', date('Y-m-d H:i:s'));
            $upd->setValue('updateuser', rex::requireUser()->getLogin());
            $upd->update();
            echo rex_view::success(rex_i18n::msg('tinymce_snippets_toggled'));
        }
    }
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

    $field = $form->addSelectField('active');
    $field->setLabel(rex_i18n::msg('tinymce_snippets_active'));
    $select = $field->getSelect();
    $select->addOption(rex_i18n::msg('tinymce_snippets_active_yes'), '1');
    $select->addOption(rex_i18n::msg('tinymce_snippets_active_no'), '0');

    if ($func == 'edit') {
        $form->addParam('func', 'edit');
        $form->addHiddenField('updatedate', date('Y-m-d H:i:s'));
        $form->addHiddenField('updateuser', rex::requireUser()->getLogin());
    } else {
        $form->addParam('func', 'add');
        $form->addHiddenField('createdate', date('Y-m-d H:i:s'));
        $form->addHiddenField('updatedate', date('Y-m-d H:i:s'));
        $form->addHiddenField('createuser', rex::requireUser()->getLogin());
        $form->addHiddenField('updateuser', rex::requireUser()->getLogin());
    }

    $content = $form->get();
    $fragment = new rex_fragment();
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('title', ($func == 'edit') ? rex_i18n::msg('tinymce_snippets_edit') : rex_i18n::msg('tinymce_snippets_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');

} else {
    $list = rex_list::factory(sprintf('SELECT id, name, content, active FROM %s ORDER BY name ASC', rex::getTable('tinymce_snippets')));
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

    $list->setColumnLabel('active', rex_i18n::msg('tinymce_snippets_active'));
    $list->setColumnFormat('active', 'custom', function ($params) use ($list) {
        $isActive = (1 === (int) $params['value']);
        $icon = $isActive ? 'rex-icon-check' : 'rex-icon-minus';
        $label = $isActive ? rex_i18n::msg('tinymce_snippets_active_yes') : rex_i18n::msg('tinymce_snippets_active_no');
        $toggleUrl = $list->getUrl(['func' => 'toggle', 'id' => $params['list']->getValue('id')] + rex_csrf_token::factory('tinymce_snippets')->getUrlParams());
        return '<a href="' . $toggleUrl . '" title="' . rex_i18n::msg('tinymce_snippets_toggle') . '"><i class="rex-icon ' . $icon . '"></i> ' . $label . '</a>';
    });

    $list->addColumn(rex_i18n::msg('delete'), rex_i18n::msg('delete'));
    $list->setColumnParams(rex_i18n::msg('delete'), ['func' => 'delete', 'id' => '###id###'] + rex_csrf_token::factory('tinymce_snippets')->getUrlParams());
    $list->addLinkAttribute(rex_i18n::msg('delete'), 'onclick', 'return confirm(\'' . rex_i18n::msg('delete') . ' ?\')');

    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_snippets'));
    $fragment->setVar('content', $content, false);
    echo $fragment->parse('core/page/section.php');
}

