<?php

/**
 * Style-Sets Verwaltung für TinyMCE.
 *
 * Ermöglicht das Verwalten von CSS-Framework-spezifischen Styles
 * wie UIkit 3, Bootstrap 5 oder eigenen Definitionen.
 */

use FriendsOfRedaxo\TinyMce\StyleSets\DefaultSets;
use FriendsOfRedaxo\TinyMce\Utils\Cke5Converter;

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
        $user = rex::requireUser()->getLogin();
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
            $upd->setValue('updateuser', rex::requireUser()->getLogin());
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
        $export['style_formats'] = json_decode((string) $export['style_formats'], true);
        
        rex_response::cleanOutputBuffers();
        rex_response::sendContentType('application/json');
        rex_response::setHeader('Content-Disposition', 'attachment; filename="styleset_' . rex_string::normalize((string) $export['name']) . '.json"');
        rex_response::sendContent((string) json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
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
        $row['style_formats'] = json_decode((string) $row['style_formats'], true);
        $exports[] = $row;
    }
    
    rex_response::cleanOutputBuffers();
    rex_response::sendContentType('application/json');
    rex_response::setHeader('Content-Disposition', 'attachment; filename="tinymce_stylesets_export.json"');
    rex_response::sendContent((string) json_encode($exports, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
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
            $importData = json_decode((string) $content, true);
            
            if (null === $importData) {
                echo rex_view::error(rex_i18n::msg('tinymce_stylesets_import_invalid_json'));
            } else {
                // Prüfen ob einzelnes Set oder Array von Sets
                if (isset($importData['name'])) {
                    $importData = [$importData];
                }
                
                $now = date('Y-m-d H:i:s');
                $user = rex::requireUser()->getLogin();
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

// CKE5 Converter: Bestehende CKEditor-5-JSON (custom_styles / link_decorators / heading.options)
// in TinyMCE-style_formats umwandeln und optional direkt als neues Style-Set speichern.
if ('cke5_convert' === $func) {
    $sourceJson = rex_post('cke5_source', 'string', '');
    $saveAsSet = (bool) rex_post('cke5_save', 'int', 0);
    $newName = trim((string) rex_post('cke5_name', 'string', ''));
    $newDescription = trim((string) rex_post('cke5_description', 'string', ''));
    $newContentCss = trim((string) rex_post('cke5_content_css', 'string', ''));

    $converted = null;
    $convWarnings = [];
    $convFormatsJson = '';

    if ('' !== $sourceJson) {
        if (!$csrfToken->isValid()) {
            echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
        } else {
            // Styleset-Namen als Gruppen-Titel verwenden, damit im TinyMCE-Dropdown
            // nicht bei jedem Set 'CKE5 Migrated' erscheint.
            $groupTitle = '' !== $newName ? $newName : 'CKE5 Migrated';
            $result = Cke5Converter::convert($sourceJson, $groupTitle);
            $convWarnings = $result['warnings'];
            if ([] !== $result['formats']) {
                $convFormatsJson = (string) json_encode($result['formats'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

                if ($saveAsSet && '' !== $newName) {
                    // Prüfen, ob Name bereits existiert
                    $check = rex_sql::factory();
                    $check->setQuery('SELECT id FROM ' . rex::getTable('tinymce_stylesets') . ' WHERE name = :n LIMIT 1', ['n' => $newName]);

                    if ($check->getRows() > 0) {
                        echo rex_view::error(rex_i18n::msg('tinymce_stylesets_cke5_name_exists', $newName));
                    } else {
                        $prioSql = rex_sql::factory();
                        $prioSql->setQuery('SELECT MAX(prio) as max_prio FROM ' . rex::getTable('tinymce_stylesets'));
                        $maxPrio = (int) $prioSql->getValue('max_prio');

                        $now = date('Y-m-d H:i:s');
                        $user = rex::requireUser()->getLogin();

                        $ins = rex_sql::factory();
                        $ins->setTable(rex::getTable('tinymce_stylesets'));
                        $ins->setValue('name', $newName);
                        $ins->setValue('description', '' !== $newDescription ? $newDescription : 'Aus CKEditor 5 migriert');
                        $ins->setValue('content_css', $newContentCss);
                        $ins->setValue('style_formats', $convFormatsJson);
                        $ins->setValue('active', 0);
                        $ins->setValue('prio', $maxPrio + 1);
                        $ins->setValue('createdate', $now);
                        $ins->setValue('updatedate', $now);
                        $ins->setValue('createuser', $user);
                        $ins->setValue('updateuser', $user);
                        $ins->insert();

                        rex_addon::get('tinymce')->setConfig('update_profiles', true);
                        echo rex_view::success(rex_i18n::msg('tinymce_stylesets_cke5_saved', $newName));
                        // Zurück zur Liste
                        $func = '';
                    }
                }
            } else {
                echo rex_view::error(rex_i18n::msg('tinymce_stylesets_cke5_nothing'));
            }
        }
    }

    if ('cke5_convert' === $func) {
        $formAction = rex_url::currentBackendPage(['func' => 'cke5_convert']);

        $warnHtml = '';
        if ([] !== $convWarnings) {
            $warnHtml = '<div class="alert alert-warning"><ul style="margin:0;padding-left:18px;">';
            foreach ($convWarnings as $w) {
                $warnHtml .= '<li>' . rex_escape($w) . '</li>';
            }
            $warnHtml .= '</ul></div>';
        }

        $previewHtml = '';
        if ('' !== $convFormatsJson) {
            $previewHtml = '<label><strong>' . rex_i18n::msg('tinymce_stylesets_cke5_preview') . '</strong></label>'
                . '<textarea class="form-control rex-code" rows="12" readonly>' . rex_escape($convFormatsJson) . '</textarea>';
        }

        $body = '<form action="' . $formAction . '" method="post">'
            . $csrfToken->getHiddenField()
            . '<p>' . rex_i18n::msg('tinymce_stylesets_cke5_intro') . '</p>'
            . '<div class="form-group">'
            .   '<label for="cke5_source"><strong>' . rex_i18n::msg('tinymce_stylesets_cke5_source') . '</strong></label>'
            .   '<textarea id="cke5_source" name="cke5_source" class="form-control rex-code" rows="12" placeholder=\'[{"buttonlink": {"mode": "manual", "label": "Primary Button", "attributes": {"class": "uk-button uk-button-primary"}}}]\'>' . rex_escape($sourceJson) . '</textarea>'
            . '</div>'
            . $warnHtml
            . $previewHtml
            . '<hr>'
            . '<div class="row">'
            .   '<div class="col-md-6"><div class="form-group">'
            .     '<label for="cke5_name">' . rex_i18n::msg('tinymce_stylesets_name') . '</label>'
            .     '<input type="text" id="cke5_name" name="cke5_name" class="form-control" value="' . rex_escape($newName) . '" placeholder="z. B. UIkit Buttons (CKE5)">'
            .   '</div></div>'
            .   '<div class="col-md-6"><div class="form-group">'
            .     '<label for="cke5_description">' . rex_i18n::msg('tinymce_stylesets_description') . '</label>'
            .     '<input type="text" id="cke5_description" name="cke5_description" class="form-control" value="' . rex_escape($newDescription) . '">'
            .   '</div></div>'
            . '</div>'
            . '<div class="form-group">'
            .   '<label for="cke5_content_css">' . rex_i18n::msg('tinymce_stylesets_content_css') . '</label>'
            .   '<input type="text" id="cke5_content_css" name="cke5_content_css" class="form-control" value="' . rex_escape($newContentCss) . '" placeholder="/assets/addons/project/frontend.css">'
            .   '<p class="help-block">' . rex_i18n::rawMsg('tinymce_stylesets_content_css_notice') . '</p>'
            . '</div>'
            . '<div class="form-group">'
            .   '<button type="submit" name="cke5_save" value="0" class="btn btn-default">'
            .     '<i class="rex-icon fa-search"></i> ' . rex_i18n::msg('tinymce_stylesets_cke5_convert')
            .   '</button> '
            .   '<button type="submit" name="cke5_save" value="1" class="btn btn-save">'
            .     '<i class="rex-icon fa-save"></i> ' . rex_i18n::msg('tinymce_stylesets_cke5_save')
            .   '</button> '
            .   '<a href="' . rex_url::currentBackendPage() . '" class="btn btn-default">' . rex_i18n::msg('cancel') . '</a>'
            . '</div>'
            . '</form>';

        $fragment = new rex_fragment();
        $fragment->setVar('class', 'edit', false);
        $fragment->setVar('title', rex_i18n::msg('tinymce_stylesets_cke5_title'));
        $fragment->setVar('body', $body, false);
        echo $fragment->parse('core/page/section.php');
        return;
    }
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

    // Profile-Zuordnung: Mehrfach-Select mit allen vorhandenen Profilen.
    // Leere Auswahl = in allen Profilen aktiv. Separator bleibt Komma,
    // damit die bisherige Speicherung (comma-separated) kompatibel bleibt.
    $profileOptions = rex_sql::factory()->getArray(
        'SELECT name FROM ' . rex::getTable('tinymce_profiles') . ' ORDER BY name ASC'
    );
    $field = $form->addSelectField('profiles');
    $field->setLabel(rex_i18n::msg('tinymce_stylesets_profiles'));
    $field->setNotice(rex_i18n::msg('tinymce_stylesets_profiles_notice'));
    $field->setAttribute('class', 'form-control selectpicker');
    $field->setAttribute('multiple', 'multiple');
    $field->setAttribute('data-live-search', 'true');
    $field->setAttribute('title', rex_i18n::msg('tinymce_stylesets_profiles_all'));
    $field->setSeparator(',');
    $select = $field->getSelect();
    $select->setSize(6);
    foreach ($profileOptions as $row) {
        $profileName = (string) ($row['name'] ?? '');
        if ('' !== $profileName) {
            $select->addOption($profileName, $profileName);
        }
    }

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
    $fragment->setVar('title', ('edit' === $func) ? rex_i18n::msg('tinymce_stylesets_edit') : rex_i18n::msg('tinymce_stylesets_add'));
    $fragment->setVar('body', $content, false);
    echo $fragment->parse('core/page/section.php');
} else {
    // Liste
    $query = sprintf(
        'SELECT id, name, description, content_css, profiles, active, prio FROM %s ORDER BY prio ASC, name ASC',
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

    // Profile-Zuordnung als Badges anzeigen (leer = alle Profile).
    $list->setColumnLabel('profiles', rex_i18n::msg('tinymce_stylesets_profiles'));
    $list->setColumnFormat('profiles', 'custom', static function ($params) {
        $raw = trim((string) $params['value'], " ,|\t\n\r\0\x0B");
        if ('' === $raw) {
            return '<span class="label label-default">' . rex_escape(rex_i18n::msg('tinymce_stylesets_profiles_all')) . '</span>';
        }
        $names = array_values(array_filter(array_map('trim', preg_split('/[,|]/', $raw) ?: []), static fn (string $v): bool => '' !== $v));
        $badges = array_map(static fn (string $n): string => '<span class="label label-info" style="margin-right:3px;">' . rex_escape($n) . '</span>', $names);
        return implode('', $badges);
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

    // CKE5-Konverter Button
    $cke5Url = rex_url::currentBackendPage(['func' => 'cke5_convert']);
    $cke5Button = '<a href="' . $cke5Url . '" class="btn btn-default"><i class="rex-icon fa-magic"></i> ' . rex_i18n::msg('tinymce_stylesets_cke5_title') . '</a>';

    // Import Form (kompakt)
    $importForm = '
    <form action="' . rex_url::currentBackendPage(['func' => 'import'] + $csrfToken->getUrlParams()) . '" method="post" enctype="multipart/form-data" class="form-inline" style="display:inline-block;">
        <div class="input-group input-group-sm">
            <input type="file" name="import_file" accept=".json" class="form-control" required>
            <span class="input-group-btn">
                <button type="submit" class="btn btn-default btn-sm" title="' . rex_i18n::msg('tinymce_stylesets_import') . '"><i class="rex-icon fa-upload"></i> ' . rex_i18n::msg('tinymce_stylesets_import') . '</button>
            </span>
        </div>
    </form>';

    // Kompakte Tool-Leiste: alle Aktionen nebeneinander.
    $toolbar = '<div class="btn-toolbar" role="toolbar" style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">'
        . $demoButton
        . ' ' . $cke5Button
        . ' ' . $exportAllButton
        . ' ' . $importForm
        . '</div>';

    $actionsContent = '<p class="text-muted" style="margin:0 0 10px;">'
        . rex_i18n::msg('tinymce_stylesets_info') . ' '
        . '<strong>' . rex_i18n::msg('tinymce_stylesets_info_merge') . '</strong>'
        . '</p>'
        . $toolbar;

    $actionsFragment = new rex_fragment();
    $actionsFragment->setVar('title', rex_i18n::msg('tinymce_stylesets_actions_title'));
    $actionsFragment->setVar('body', $actionsContent, false);
    echo $actionsFragment->parse('core/page/section.php');

    // Liste ausgeben
    $content = $list->get();
    $fragment = new rex_fragment();
    $fragment->setVar('title', rex_i18n::msg('tinymce_stylesets'));
    $fragment->setVar('content', $content, false);
    echo $fragment->parse('core/page/section.php');
}
