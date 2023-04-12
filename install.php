<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

/** @var rex_addon $this */

$old_table_name = rex::getTable('tinymce5_profiles');
$new_table_name = rex::getTable('tinymce_profiles');

// duplicate Table from tinymce5 to 6 if available
$tiny5table = rex_sql::factory()->setQuery('SHOW TABLES LIKE "'.$old_table_name.'"' )->getRows();
$tinytable = rex_sql::factory()->setQuery('SHOW TABLES LIKE "'.$new_table_name.'"' )->getRows();
if ($tiny5table && !$tinytable) {
    rex_sql::factory()->setQuery('CREATE TABLE '. $new_table_name .' LIKE '. $old_table_name);
}


// install profiles database
rex_sql_table::get($new_table_name)
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
    $sql = rex_sql::factory();
    if (sizeof($sql->getArray("SELECT id FROM " . $new_table_name . " WHERE id=1")) <= 0) {
        rex_sql_util::importDump($this->getPath('data.sql'));
    }
    // Recreate profiles
    $addon = rex_addon::get('tinymce');
    $addon->setConfig('update_profiles', true);
} catch (rex_sql_exception $e) {
    rex_logger::logException($e);
    print rex_view::error($e->getMessage());
}
