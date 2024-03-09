<?php

$addon = rex_addon::get('tinymce');

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

// install default demo profile and mblock demo data
try {
    rex_sql_util::importDump($addon->getPath('data.sql'));
} catch (rex_sql_exception $e) {
    rex_logger::logException($e);
    echo rex_view::error($e->getMessage());
}

// Eigene PlugIns TinyMCE zur Verfügung stellen
rex_dir::copy($addon->getPath('assets/scripts/tinymce/plugins/link_yform'), $addon->getAssetsPath('vendor/tinymce/plugins/link_yform'));
rex_dir::copy($addon->getPath('assets/scripts/tinymce/plugins/phonelink'), $addon->getAssetsPath('vendor/tinymce/plugins/phonelink'));
rex_dir::copy($addon->getPath('assets/scripts/tinymce/plugins/quote'), $addon->getAssetsPath('vendor/tinymce/plugins/quote'));
