<?php
// ensure_table.php
// A minimal, autoload-free snippet that can be included from install.php and update.php
// to ensure the required tinymce_profiles table exists.

/** @noinspection PhpUndefinedClassInspection */
\rex_sql_table::get(\rex::getTable('tinymce_profiles'))
    ->ensurePrimaryIdColumn()
    ->ensureColumn(new \rex_sql_column('name', 'varchar(40)', true))
    ->ensureColumn(new \rex_sql_column('description', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('plugins', 'text', true))
    ->ensureColumn(new \rex_sql_column('toolbar', 'text', true))
    ->ensureColumn(new \rex_sql_column('extra', 'longtext', true))
    ->ensureColumn(new \rex_sql_column('mediatype', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('mediapath', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('mediacategory', 'int(4)', true))
    ->ensureColumn(new \rex_sql_column('upload_default', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('createdate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('updatedate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('createuser', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('updateuser', 'varchar(255)', true))
    ->ensureIndex(new \rex_sql_index('name', ['name'], \rex_sql_index::UNIQUE))
    ->ensure();

\rex_sql_table::get(\rex::getTable('tinymce_snippets'))
    ->ensurePrimaryIdColumn()
    ->ensureColumn(new \rex_sql_column('name', 'varchar(255)', false))
    ->ensureColumn(new \rex_sql_column('content', 'longtext', false))
    ->ensureColumn(new \rex_sql_column('createdate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('updatedate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('createuser', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('updateuser', 'varchar(255)', true))
    ->ensure();

// Style-Sets table for reusable style_formats collections
\rex_sql_table::get(\rex::getTable('tinymce_stylesets'))
    ->ensurePrimaryIdColumn()
    ->ensureColumn(new \rex_sql_column('name', 'varchar(100)', false))
    ->ensureColumn(new \rex_sql_column('description', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('content_css', 'text', true))
    ->ensureColumn(new \rex_sql_column('style_formats', 'longtext', true))
    ->ensureColumn(new \rex_sql_column('profiles', 'text', true)) // Comma-separated profile names, empty = all profiles
    ->ensureColumn(new \rex_sql_column('active', 'tinyint(1)', true, '1'))
    ->ensureColumn(new \rex_sql_column('prio', 'int(11)', true, '0'))
    ->ensureColumn(new \rex_sql_column('createdate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('updatedate', 'datetime', true))
    ->ensureColumn(new \rex_sql_column('createuser', 'varchar(255)', true))
    ->ensureColumn(new \rex_sql_column('updateuser', 'varchar(255)', true))
    ->ensureIndex(new \rex_sql_index('name', ['name'], \rex_sql_index::UNIQUE))
    ->ensure();
