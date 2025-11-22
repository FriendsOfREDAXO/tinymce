<?php

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Utils\ListHelper as TinyMceListHelper;

$func = rex_request::request('func', 'string');
$id = (int) rex_request::request('id', 'int');
$start = rex_request::request('start', 'int', null);
$send = rex_request::request('send', 'boolean', false);

$profileTable = rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES);
$message = '';

// Export single profile or all profiles as JSON
    if ('export' === $func && $id > 0) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, description, extra FROM ' . $profileTable . ' WHERE id = ?', [$id]);
    $row = $sql->getArray();
    if (empty($row)) {
        echo rex_view::error(rex_i18n::msg('tinymce_profile_export_error'));
        exit;
    }
    $row = $row[0];
    $payload = json_encode($row, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    rex_response::cleanOutputBuffers();
    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename="' . sprintf(rex_i18n::msg('tinymce_profile_export_filename'), $row['name']) . '"');
    echo $payload;
    exit;
}

if ('export_all' === $func) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, description, extra FROM ' . $profileTable);
    $rows = $sql->getArray();
    $payload = json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    rex_response::cleanOutputBuffers();
    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename="' . rex_i18n::msg('tinymce_profile_export_all_filename') . '"');
    echo $payload;
    exit;
}

// Return profile JSON for preview via XHR
if ('preview' === $func && $id > 0) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, description, extra FROM ' . $profileTable . ' WHERE id = ?', [$id]);
    $row = $sql->getArray();
    if (empty($row)) {
        rex_response::cleanOutputBuffers();
        rex_response::sendJson(['error' => rex_i18n::msg('tinymce_profile_export_error')], 404);
        exit;
    }
    rex_response::cleanOutputBuffers();
    // support both JSON and HTML fragment (for pjax)
    $mode = rex_request::request('mode', 'string', '');
    if ('html' === $mode) {
        rex_response::cleanOutputBuffers();
        header('Content-Type: text/html; charset=utf-8');
        $name = htmlspecialchars($row[0]['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $extra = $row[0]['extra'] ?? '';
        $body = '<h4 id="tinymcePreviewName" style="margin-top:0">' . $name . '</h4>';
        $body .= '<div id="tinymcePreviewJson" style="white-space:pre-wrap; background:#f7f7f7; padding:12px; border-radius:4px; max-height:280px; overflow:auto; font-family:monospace;">';
        // show pretty-printed JSON if parsable, fallback to raw
        try {
            $rawParsed = @json_decode($extra, true);
        } catch (\Throwable $e) {
            $rawParsed = null;
        }
        if (is_array($rawParsed)) {
            $body .= htmlspecialchars(json_encode($rawParsed, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        } else {
            $body .= htmlspecialchars($extra, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }
        $body .= '</div>';
        $body .= '<hr>'; // demo button removed - preview now opens the editor inside the modal
        echo $body;
        exit;
    }

    rex_response::sendJson($row[0]);
    exit;
}

// Import uploaded JSON file containing a single profile object or an array of profiles
if ('import' === $func && isset($_FILES['profiles_file'])) {
    // read overwrite option from POST
    $overwrite = (bool) rex_request::request('overwrite', 'int', 0);
    try {
        if ($_FILES['profiles_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('upload_error');
        }
        $content = file_get_contents($_FILES['profiles_file']['tmp_name']);
        $data = json_decode($content, true);
        if (null === $data) {
            throw new Exception('json_invalid');
        }

        $items = [];
        if (isset($data['name']) && isset($data['extra'])) {
            // single profile
            $items[] = $data;
        } elseif (is_array($data)) {
            $items = $data;
        }

        $imported = 0;
        $skipped = 0;
        $overwritten = 0;
        foreach ($items as $item) {
            if (empty($item['name']) || !isset($item['extra'])) {
                $skipped++;
                continue;
            }

            // Prevent import from forcing a specific primary key or audit fields
            if (isset($item['id'])) {
                unset($item['id']);
            }
            if (isset($item['createdate'])) {
                unset($item['createdate']);
            }
            if (isset($item['updatedate'])) {
                unset($item['updatedate']);
            }
            if (isset($item['createuser'])) {
                unset($item['createuser']);
            }
            if (isset($item['updateuser'])) {
                unset($item['updateuser']);
            }

            // check if name exists
            $check = rex_sql::factory();
            $check->setQuery('SELECT COUNT(*) AS c FROM ' . $profileTable . ' WHERE name = ?', [$item['name']]);
            if ((int) $check->getValue('c') > 0) {
                if ($overwrite) {
                    // update existing profile by name
                    $sql = rex_sql::factory();
                    $sql->setQuery('SELECT id FROM ' . $profileTable . ' WHERE name = ? LIMIT 1', [$item['name']]);
                    $row = $sql->getArray();
                    if (!empty($row) && isset($row[0]['id'])) {
                        $update = rex_sql::factory();
                        $update->setTable($profileTable);
                        $update->setWhere(['id' => $row[0]['id']]);
                        $update->setValue('description', isset($item['description']) ? $item['description'] : 'Imported');
                        $update->setValue('extra', (string) $item['extra']);
                        $update->setValue('updatedate', date('Y-m-d H:i:s'));
                        $update->setValue('updateuser', rex::getUser() ? rex::getUser()->getLogin() : 'import');
                        $update->update();
                        $overwritten++;
                        continue;
                    }
                }
                $skipped++;
                continue;
            }

            $ins = rex_sql::factory();
            $ins->setTable($profileTable);
            // don't set id — allow the DB to assign an auto-increment value
            $ins->setValue('name', (string) $item['name']);
            $ins->setValue('description', isset($item['description']) ? $item['description'] : 'Imported');
            $ins->setValue('extra', (string) $item['extra']);
            $ins->setValue('createdate', date('Y-m-d H:i:s'));
            $ins->setValue('updatedate', date('Y-m-d H:i:s'));
            $ins->setValue('createuser', rex::getUser() ? rex::getUser()->getLogin() : 'import');
            $ins->setValue('updateuser', rex::getUser() ? rex::getUser()->getLogin() : 'import');
            try {
                $ins->insert();
            } catch (rex_exception $e) {
                // log and treat as skipped — avoid crashing on duplicate PK or other DB errors
                rex_logger::logException($e);
                $skipped++;
                continue;
            }
            $imported++;
        }

        echo rex_view::success(sprintf(rex_i18n::msg('tinymce_profile_import_success'), $imported, $overwritten, $skipped));
    } catch (Exception $e) {
        $msg = $e->getMessage();
        if ('json_invalid' === $msg) {
            echo rex_view::error(rex_i18n::msg('tinymce_profile_import_invalid'));
        } else {
            echo rex_view::error(rex_i18n::msg('tinymce_profile_import_error'));
        }
    }
}

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
    // Add import / export ui above the list
    $exportAllUrl = rex_url::backendPage('tinymce/profiles', ['func' => 'export_all']);
    $importUrl = rex_url::backendPage('tinymce/profiles', ['func' => 'import']);
    $importForm = '<form action="' . $importUrl . '" method="post" enctype="multipart/form-data" style="display:inline-block;margin-right:10px;">'
        . '<label class="control-label">' . rex_i18n::msg('tinymce_profile_import') . '</label> '
        . '<input type="file" name="profiles_file" accept="application/json" style="display:inline-block;margin-left:8px;margin-right:8px;" />'
        . '<label style="margin-left:8px;margin-right:4px;display:inline-block;">' . PHP_EOL
        . '<input type="checkbox" name="overwrite" value="1" /> ' . rex_i18n::msg('tinymce_profile_import_overwrite') . '</label>'
        . '<button class="btn btn-sm btn-default" type="submit">' . rex_i18n::msg('tinymce_profile_import_button') . '</button>'
        . '</form>';

    $message .= '<p style="margin-bottom:12px;">' . $importForm . ' <a class="btn btn-sm btn-primary" href="' . $exportAllUrl . '">' . rex_i18n::msg('tinymce_profile_export_all') . '</a></p>';
    $list = rex_list::factory("SELECT id, name, description FROM $profileTable ORDER BY id");
    $list->addTableAttribute('class', 'table-striped');

        // columns: icon, name, description, actions
        $list->addTableColumnGroup([40, '*', '*', 140]);

    $list->removeColumn('id');

    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="' . rex_i18n::msg('tinymce_add_profile') . '"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon fa-cube"></i>';

    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    $list->setColumnLabel('name', rex_i18n::msg('tinymce_name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###', 'start' => $start]);

    $list->setColumnLabel('description', rex_i18n::msg('tinymce_description'));

    // preview action is in the actions dropdown (compact UI)

    // compact actions column: edit button + dropdown (export / clone / delete)
    $list->addColumn('actions', '', -1, ['', '<td>###VALUE###</td>']);
    $list->setColumnLabel('actions', rex_i18n::msg('tinymce_list_function'));
    $list->setColumnFormat('actions', 'custom', static function ($params) {
        $list = $params['list'];
        $id = $list->getValue('id');
        // use provided start parameter (passed as extra param to setColumnFormat)
        $startParam = isset($params['start']) ? $params['start'] : null;
        $editUrl = $list->getUrl(['func' => 'edit', 'id' => $id, 'start' => $startParam]);
        // btn-group: edit button + dropdown toggle
        $btnGroup = '<div class="btn-group">';
        $btnGroup .= '<a class="btn btn-xs btn-default" href="' . $editUrl . '"><i class="rex-icon fa-pencil-square-o"></i> ' . rex_i18n::msg('edit') . '</a>';
        $exportUrl = $list->getUrl(['func' => 'export', 'id' => $id]);
        $cloneUrl = $list->getUrl(['func' => 'clone', 'id' => $id]);
        $deleteUrl = $list->getUrl(['func' => 'delete', 'id' => $id]);

        $dropdown = '<button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="rex-icon fa-ellipsis-v"></i></button>'
            . '<ul class="dropdown-menu dropdown-menu-right">'
            . '<li><a href="#" class="tinymce-preview" data-url="' . $list->getUrl(['func' => 'preview', 'id' => $id]) . '">' . rex_i18n::msg('tinymce_preview') . '</a></li>'
            . '<li class="dropdown-divider"></li>'
            . '<li><a href="' . $exportUrl . '">' . rex_i18n::msg('tinymce_profile_export') . '</a></li>'
            . '<li><a href="' . $cloneUrl . '" data-confirm="' . rex_i18n::msg('tinymce_clone') . ' ?">' . rex_i18n::msg('tinymce_clone') . '</a></li>'
            . '<li><a href="' . $deleteUrl . '" data-confirm="' . rex_i18n::msg('delete') . ' ?">' . rex_i18n::msg('delete') . '</a></li>'
            . '</ul></div>';

        $btnGroup .= $dropdown . '</div>';
        return $btnGroup;
    }, ['list' => $list, 'start' => $start]);

    $content = $list->get();

    // Wrap import UI + table in fragment body so it gets panel padding and consistent look
    $body = '<div class="tinymce-profiles-wrapper">' . $message . $content . '</div>';

    // modal + preview script
    $previewBase = rex_url::backendPage('tinymce/profiles', ['func' => 'preview']);
    $modal = '<div id="tinymcePreviewModal" class="modal fade" tabindex="-1" role="dialog">'
        . '<div class="modal-dialog modal-lg" role="document">'
        . '<div class="modal-content">'
        . '<div class="modal-header"><h5 class="modal-title">' . rex_i18n::msg('tinymce_preview') . '</h5>'
        . '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
        . '<div class="modal-body">'
        . '<h4 id="tinymcePreviewName" style="margin-top:0"></h4>'
        . '<div id="tinymcePreviewJson" style="white-space:pre-wrap; background:#f7f7f7; padding:12px; border-radius:4px; max-height:280px; overflow:auto; font-family:monospace;">' . rex_i18n::msg('tinymce_loading') . '</div>'
        . '<hr>' // demo button removed - preview will initialize the editor inside this modal
        . '</div>'
        . '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">' . rex_i18n::msg('close') . '</button></div>'
        . '</div></div></div>';

    // modal HTML is inserted here. JavaScript behaviour is moved to a separate asset file (see assets/scripts/profiles-list.js)
    $body .= $modal;

    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_list_profiles'));
    $fragment->setVar('class', 'edit', false);
    $fragment->setVar('body', $body, false);
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
