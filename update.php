<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

rex_sql_table::get(rex::getTable('tinymce_profiles'))
    ->ensurePrimaryIdColumn()
    ->ensureColumn(new rex_sql_column('name', 'varchar(40)', true))
    ->ensureColumn(new rex_sql_column('description', 'varchar(255)', true))
    ->ensureColumn(new rex_sql_column('plugins', 'text', true))
    ->ensureColumn(new rex_sql_column('toolbar', 'text', true))
    ->ensureColumn(new rex_sql_column('extra', 'longtext', true))
    ->ensureColumn(new rex_sql_column('mediatype', 'varchar(255)', true))
    ->ensureColumn(new rex_sql_column('mediapath', 'varchar(255)', true))
    ->ensureColumn(new rex_sql_column('mediacategory', 'int(4)', true))
    ->ensureColumn(new rex_sql_column('upload_default', 'varchar(255)', true))
    ->ensureColumn(new rex_sql_column('createdate', 'datetime', true))
    ->ensureColumn(new rex_sql_column('updatedate', 'datetime', true))
    ->ensureColumn(new rex_sql_column('createuser', 'varchar(255)', true))
    ->ensureColumn(new rex_sql_column('updateuser', 'varchar(255)', true))
    ->ensureIndex(new rex_sql_index('name', ['name'], rex_sql_index::UNIQUE))
    ->ensure();

// copy all custom plugins to assets folder
$plugins_source = __DIR__ . DIRECTORY_SEPARATOR .'assets'. DIRECTORY_SEPARATOR . 'scripts'. DIRECTORY_SEPARATOR . 'tinymce'. DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR;
$folders = glob($plugins_source .'*', GLOB_ONLYDIR);
foreach ($folders as $folder) {
    $plugins_target = $this->getAssetsPath('vendor' . DIRECTORY_SEPARATOR . 'tinymce' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR . basename($folder));
    rex_dir::copy($folder, $plugins_target);
}
