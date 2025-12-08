<?php

/**
 * Style-Sets Verwaltung für TinyMCE.
 *
 * Ermöglicht das Verwalten von CSS-Framework-spezifischen Styles
 * wie UIkit 3, Bootstrap 5 oder eigenen Definitionen.
 */

use FriendsOfRedaxo\TinyMce\StyleSets\DefaultSets;

$func = rex_request('func', 'string');
$id = rex_request('id', 'int');

// CSRF Token für Aktionen
$csrfToken = rex_csrf_token::factory('tinymce_stylesets');

// Demo-Sets installieren
if ('install_demo' === $func) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $now = date('Y-m-d H:i:s');
        $user = rex::getUser()->getLogin();
        $defaultSets = DefaultSets::getAll();
        $installed = 0;
        $skipped = 0;

        // Bestehende Namen holen
        $sql = rex_sql::factory();
        $existing = $sql->getArray('SELECT name FROM ' . rex::getTable('tinymce_stylesets'));
        $existingNames = array_column($existing, 'name');

        // Höchste Prio ermitteln
        $sqlPrio = rex_sql::factory();
        $sqlPrio->setQuery('SELECT MAX(prio) as max_prio FROM ' . rex::getTable('tinymce_stylesets'));
        $maxPrio = (int) $sqlPrio->getValue('max_prio');

        foreach ($defaultSets as $set) {
            if (in_array($set['name'], $existingNames, true)) {
                ++$skipped;
                continue;
            }

            ++$maxPrio;
            $ins = rex_sql::factory();
            $ins->setTable(rex::getTable('tinymce_stylesets'));
            $ins->setValue('name', $set['name']);
            $ins->setValue('description', $set['description']);
            $ins->setValue('content_css', $set['content_css']);
            $ins->setValue('style_formats', json_encode($set['style_formats'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            $ins->setValue('active', 0);
            $ins->setValue('prio', $maxPrio);
            $ins->setValue('createdate', $now);
            $ins->setValue('updatedate', $now);
            $ins->setValue('createuser', $user);
            $ins->setValue('updateuser', $user);
            $ins->insert();
            ++$installed;
        }

        if ($installed > 0) {
            echo rex_view::success(rex_i18n::msg('tinymce_stylesets_demo_installed', $installed));
        }
        if ($skipped > 0) {
            echo rex_view::warning(rex_i18n::msg('tinymce_stylesets_demo_skipped', $skipped));
        }
    }
    $func = '';
}

// Löschen
if ('delete' === $func && $id > 0) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $sql = rex_sql::factory();
        $sql->setTable(rex::getTable('tinymce_stylesets'));
        $sql->setWhere(['id' => $id]);
        $sql->delete();
        echo rex_view::success(rex_i18n::msg('tinymce_stylesets_deleted'));
        // Flag zum Neugenerieren der profiles.js setzen
        rex_addon::get('tinymce')->setConfig('update_profiles', true);
    }
    $func = '';
}

// Toggle Active Status
if ('toggle' === $func && $id > 0) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $sql = rex_sql::factory();
        $current = $sql->getArray('SELECT active FROM ' . rex::getTable('tinymce_stylesets') . ' WHERE id = :id', ['id' => $id]);
        if (!empty($current)) {
            $newActive = (1 === (int) $current[0]['active']) ? 0 : 1;
            $upd = rex_sql::factory();
            $upd->setTable(rex::getTable('tinymce_stylesets'));
            $upd->setWhere(['id' => $id]);
            $upd->setValue('active', $newActive);
            $upd->setValue('updatedate', date('Y-m-d H:i:s'));
            $upd->setValue('updateuser', rex::getUser()->getLogin());
            $upd->update();
            echo rex_view::success(rex_i18n::msg('tinymce_stylesets_toggled'));
            // Flag zum Neugenerieren der profiles.js setzen
            rex_addon::get('tinymce')->setConfig('update_profiles', true);
        }
    }
    $func = '';
}

// Export eines Style-Sets als JSON
if ('export' === $func && $id > 0) {
    $sql = rex_sql::factory();
    $data = $sql->getArray('SELECT name, description, content_css, style_formats FROM ' . rex::getTable('tinymce_stylesets') . ' WHERE id = :id', ['id' => $id]);
    if (!empty($data)) {
        $export = $data[0];
        // style_formats ist bereits JSON-String, decodieren für sauberen Export
        $export['style_formats'] = json_decode($export['style_formats'], true);
        
        rex_response::cleanOutputBuffers();
        rex_response::sendContentType('application/json');
        rex_response::setHeader('Content-Disposition', 'attachment; filename="styleset_' . rex_string::normalize($export['name']) . '.json"');
        rex_response::sendContent(json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        exit;
    }
    $func = '';
}

// Export aller Style-Sets
if ('export_all' === $func) {
    $sql = rex_sql::factory();
    $data = $sql->getArray('SELECT name, description, content_css, style_formats FROM ' . rex::getTable('tinymce_stylesets') . ' ORDER BY prio ASC');
    $exports = [];
    foreach ($data as $row) {
        $row['style_formats'] = json_decode($row['style_formats'], true);
        $exports[] = $row;
    }
    
    rex_response::cleanOutputBuffers();
    rex_response::sendContentType('application/json');
    rex_response::setHeader('Content-Disposition', 'attachment; filename="tinymce_stylesets_export.json"');
    rex_response::sendContent(json_encode($exports, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    exit;
}

// Import von Style-Sets
if ('import' === $func && 'POST' === rex_request::server('REQUEST_METHOD', 'string')) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        $file = rex_files('import_file', 'array');
        if (!empty($file['tmp_name']) && is_uploaded_file($file['tmp_name'])) {
            $content = rex_file::get($file['tmp_name']);
            $importData = json_decode($content, true);
            
            if (null === $importData) {
                echo rex_view::error(rex_i18n::msg('tinymce_stylesets_import_invalid_json'));
            } else {
                // Prüfen ob einzelnes Set oder Array von Sets
                if (isset($importData['name'])) {
                    $importData = [$importData];
                }
                
                $now = date('Y-m-d H:i:s');
                $user = rex::getUser()->getLogin();
                $imported = 0;
                $skipped = 0;
                
                // Bestehende Namen holen
                $sql = rex_sql::factory();
                $existing = $sql->getArray('SELECT name FROM ' . rex::getTable('tinymce_stylesets'));
                $existingNames = array_column($existing, 'name');
                $sqlPrio = rex_sql::factory();
                $sqlPrio->setQuery('SELECT MAX(prio) as max_prio FROM ' . rex::getTable('tinymce_stylesets'));
                $maxPrio = (int) $sqlPrio->getValue('max_prio');
                
                foreach ($importData as $set) {
                    if (!isset($set['name']) || !isset($set['style_formats'])) {
                        continue;
                    }
                    
                    if (in_array($set['name'], $existingNames, true)) {
                        ++$skipped;
                        continue;
                    }
                    
                    ++$maxPrio;
                    $ins = rex_sql::factory();
                    $ins->setTable(rex::getTable('tinymce_stylesets'));
                    $ins->setValue('name', $set['name']);
                    $ins->setValue('description', $set['description'] ?? '');
                    $ins->setValue('content_css', $set['content_css'] ?? '');
                    $ins->setValue('style_formats', is_array($set['style_formats']) ? json_encode($set['style_formats'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : $set['style_formats']);
                    $ins->setValue('active', 0);
                    $ins->setValue('prio', $maxPrio);
                    $ins->setValue('createdate', $now);
                    $ins->setValue('updatedate', $now);
                    $ins->setValue('createuser', $user);
                    $ins->setValue('updateuser', $user);
                    $ins->insert();
                    ++$imported;
                }
                
                if ($imported > 0) {
                    echo rex_view::success(rex_i18n::msg('tinymce_stylesets_imported', $imported));
                    rex_addon::get('tinymce')->setConfig('update_profiles', true);
                }
                if ($skipped > 0) {
                    echo rex_view::warning(rex_i18n::msg('tinymce_stylesets_import_skipped', $skipped));
                }
                if (0 === $imported && 0 === $skipped) {
                    echo rex_view::error(rex_i18n::msg('tinymce_stylesets_import_empty'));
                }
            }
        } else {
            echo rex_view::error(rex_i18n::msg('tinymce_stylesets_import_no_file'));
        }
    }
    $func = '';
}

// Formular (Add/Edit)
if ('add' === $func || 'edit' === $func) {
    $form = rex_form::factory(rex::getTable('tinymce_stylesets'), '', 'id=' . $id);
    $form->addParam('id', $id);

    // Name
    $field = $form->addTextField('name');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_name'));
    $field->getValidator()->add('notEmpty', rex_i18n::msg('tinymce_stylesets_name_empty'));
    $field->setAttribute('class', 'form-control');

    // Beschreibung
    $field = $form->addTextField('description');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_description'));
    $field->setAttribute('class', 'form-control');

    // Content CSS
    $field = $form->addTextField('content_css');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_content_css'));
    $field->setNotice(rex_i18n::msg('tinymce_stylesets_content_css_notice'));
    $field->setAttribute('class', 'form-control');

    // Style Formats (JSON)
    $field = $form->addTextAreaField('style_formats');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_style_formats'));
    $field->setNotice(rex_i18n::msg('tinymce_stylesets_style_formats_notice'));
    $field->setAttribute('class', 'form-control rex-code');
    $field->setAttribute('rows', 20);

    // Profile-Zuordnung
    $field = $form->addTextField('profiles');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_profiles'));
    $field->setNotice(rex_i18n::msg('tinymce_stylesets_profiles_notice'));
    $field->setAttribute('class', 'form-control');
    $field->setAttribute('placeholder', 'z.B. uikit, bootstrap (leer = alle Profile)');

    // Aktiv
    $field = $form->addCheckboxField('active');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_active'));
    $field->addOption(rex_i18n::msg('tinymce_stylesets_active_label'), 1);

    // Priorität
    $field = $form->addTextField('prio');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_prio'));
    $field->setAttribute('type', 'number');
    $field->setAttribute('class', 'form-control');

    if ('edit' === $func) {
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
    $fragment->setVar('title', ('edit' === $func) ? rex_i18n::msg('tinymce_stylesets_edit') : rex_i18n::msg('tinymce_stylesets_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');
} else {
    // Liste
    $query = sprintf(
        'SELECT id, name, description, content_css, active, prio FROM %s ORDER BY prio ASC, name ASC',
        rex::getTable('tinymce_stylesets')
    );
    $list = rex_list::factory($query);
    $list->addTableAttribute('class', 'table-striped');

    // Add Icon
    $thIcon = '<a href="' . $list->getUrl(['func' => 'add']) . '" title="' . rex_i18n::msg('tinymce_stylesets_add') . '"><i class="rex-icon rex-icon-add-action"></i></a>';
    $tdIcon = '<i class="rex-icon rex-icon-edit"></i>';
    $list->addColumn($thIcon, $tdIcon, 0, ['<th class="rex-table-icon">###VALUE###</th>', '<td class="rex-table-icon">###VALUE###</td>']);
    $list->setColumnParams($thIcon, ['func' => 'edit', 'id' => '###id###']);

    // Name
    $list->setColumnLabel('name', rex_i18n::msg('tinymce_stylesets_name'));
    $list->setColumnParams('name', ['func' => 'edit', 'id' => '###id###']);

    // Beschreibung
    $list->setColumnLabel('description', rex_i18n::msg('tinymce_stylesets_description'));
    $list->setColumnFormat('description', 'custom', static function ($params) {
        $desc = $params['value'];
        if (strlen($desc) > 60) {
            $desc = substr($desc, 0, 60) . '...';
        }
        return rex_escape($desc);
    });

    // Content CSS (gekürzt anzeigen)
    $list->setColumnLabel('content_css', rex_i18n::msg('tinymce_stylesets_content_css'));
    $list->setColumnFormat('content_css', 'custom', static function ($params) {
        $css = $params['value'];
        if (strlen($css) > 40) {
            $css = '...' . substr($css, -37);
        }
        return rex_escape($css);
    });

    // Prio
    $list->setColumnLabel('prio', rex_i18n::msg('tinymce_stylesets_prio'));

    // Aktiv (Toggle)
    $list->setColumnLabel('active', rex_i18n::msg('tinymce_stylesets_active'));
    $list->setColumnFormat('active', 'custom', static function ($params) use ($csrfToken) {
        $id = $params['list']->getValue('id');
        $active = (int) $params['value'];
        $icon = $active ? 'rex-icon-active-true' : 'rex-icon-active-false';
        $title = $active ? rex_i18n::msg('tinymce_stylesets_deactivate') : rex_i18n::msg('tinymce_stylesets_activate');
        $url = $params['list']->getUrl(['func' => 'toggle', 'id' => $id] + $csrfToken->getUrlParams());
        return '<a href="' . $url . '" title="' . rex_escape($title) . '"><i class="rex-icon ' . $icon . '"></i></a>';
    });

    // Löschen
    $list->addColumn(rex_i18n::msg('delete'), '<i class="rex-icon rex-icon-delete"></i>');
    $list->setColumnParams(rex_i18n::msg('delete'), ['func' => 'delete', 'id' => '###id###'] + $csrfToken->getUrlParams());
    $list->addLinkAttribute(rex_i18n::msg('delete'), 'data-confirm', rex_i18n::msg('delete') . ' ?');
    $list->addLinkAttribute(rex_i18n::msg('delete'), 'onclick', 'return confirm(this.dataset.confirm)');

    // Export einzelnes Set
    $list->addColumn(rex_i18n::msg('tinymce_stylesets_export'), '<i class="rex-icon fa-download"></i>');
    $list->setColumnParams(rex_i18n::msg('tinymce_stylesets_export'), ['func' => 'export', 'id' => '###id###']);

    // Demo-Sets Button
    $demoUrl = rex_url::currentBackendPage(['func' => 'install_demo'] + $csrfToken->getUrlParams());
    $demoButton = '<a href="' . $demoUrl . '" class="btn btn-primary" onclick="return confirm(\'' . rex_i18n::msg('tinymce_stylesets_demo_confirm') . '\')"><i class="rex-icon fa-download"></i> ' . rex_i18n::msg('tinymce_stylesets_demo_install') . '</a>';

    // Export All Button
    $exportAllUrl = rex_url::currentBackendPage(['func' => 'export_all']);
    $exportAllButton = '<a href="' . $exportAllUrl . '" class="btn btn-default"><i class="rex-icon fa-download"></i> ' . rex_i18n::msg('tinymce_stylesets_export_all') . '</a>';

    // Import Form
    $importForm = '
    <form action="' . rex_url::currentBackendPage(['func' => 'import'] + $csrfToken->getUrlParams()) . '" method="post" enctype="multipart/form-data" class="form-inline">
        <div class="input-group">
            <input type="file" name="import_file" accept=".json" class="form-control" required>
            <span class="input-group-btn">
                <button type="submit" class="btn btn-default"><i class="rex-icon fa-upload"></i> ' . rex_i18n::msg('tinymce_stylesets_import') . '</button>
            </span>
        </div>
    </form>';

    // Info-Box
    $infoContent = '
    <p>' . rex_i18n::msg('tinymce_stylesets_info') . '</p>
    <p><strong>' . rex_i18n::msg('tinymce_stylesets_info_merge') . '</strong></p>
    <hr>
    <p>' . rex_i18n::msg('tinymce_stylesets_demo_info') . '</p>
    <p>' . $demoButton . '</p>
    <hr>
    <h4>' . rex_i18n::msg('tinymce_stylesets_import_export') . '</h4>
    <p>' . rex_i18n::msg('tinymce_stylesets_import_export_info') . '</p>
    <div class="row">
        <div class="col-md-6">
            <h5>' . rex_i18n::msg('tinymce_stylesets_export') . '</h5>
            <p>' . $exportAllButton . '</p>
        </div>
        <div class="col-md-6">
            <h5>' . rex_i18n::msg('tinymce_stylesets_import') . '</h5>
            ' . $importForm . '
        </div>
    </div>
    ';
    $infoFragment = new rex_fragment();
    $infoFragment->setVar('class', 'info', false);
    $infoFragment->setVar('title', rex_i18n::msg('tinymce_stylesets_info_title'));
    $infoFragment->setVar('body', $infoContent, false);
    $infoFragment->setVar('collapse', true);
    echo $infoFragment->parse('core/page/section.php');

    // Liste ausgeben
    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_stylesets'));
    $fragment->setVar('content', $content, false);
    echo $fragment->parse('core/page/section.php');
}
