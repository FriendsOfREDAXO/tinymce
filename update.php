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

// Update existing profiles to add GPL license key for TinyMCE 8
// and remove deprecated template plugin (migration from TinyMCE 5/6 to 8)
$sql = rex_sql::factory();
$sql->setQuery('SELECT id, name, extra FROM ' . rex::getTable('tinymce_profiles'));
$profiles = $sql->getArray();

$migrationLog = [];

foreach ($profiles as $profile) {
    $extra = $profile['extra'];
    $modified = false;
    $changes = [];
    
    // Only add license_key if it doesn't already exist
    if (!empty($extra) && strpos($extra, 'license_key:') === false) {
        $extra = "license_key: 'gpl',\r\n" . $extra;
        $modified = true;
        $changes[] = 'Added GPL license key';
    }
    
    // Remove deprecated template plugin (removed in TinyMCE 7+)
    if (!empty($extra)) {
        $templatePatterns = [
            '/media template codesample/' => 'media codesample',
            '/link template codesample/' => 'link codesample',
            '/codesample template fontsize/' => 'codesample fontsize',
            '/, template,/' => ', ',
            '/, template\'/' => '\'',
            '/\'template, /' => '\'',
            '/template\s+codesample/' => 'codesample',
            '/codesample\s+template/' => 'codesample',
        ];
        foreach ($templatePatterns as $pattern => $replacement) {
            if (preg_match($pattern, $extra)) {
                $extra = preg_replace($pattern, $replacement, $extra);
                $modified = true;
                if (!in_array('Removed template plugin', $changes)) {
                    $changes[] = 'Removed template plugin';
                }
            }
        }
    }
    
    // Fix content_css for proper dark mode support if needed
    // Change "light" to "default" for light mode
    if (!empty($extra) && preg_match('/content_css:\s*redaxo\.theme\.current\s*===\s*"dark"\s*\?\s*"[^"]+"\s*:\s*"light"/', $extra)) {
        $extra = preg_replace(
            '/content_css:\s*redaxo\.theme\.current\s*===\s*"dark"\s*\?\s*"([^"]+)"\s*:\s*"light"/',
            'content_css: redaxo.theme.current === "dark" ? "$1" : "default"',
            $extra
        );
        $modified = true;
        $changes[] = 'Fixed content_css for dark mode';
    }
    
    if ($modified) {
        $update = rex_sql::factory();
        $update->setTable(rex::getTable('tinymce_profiles'));
        $update->setWhere(['id' => $profile['id']]);
        $update->setValue('extra', $extra);
        $update->update();
        
        $migrationLog[] = 'Profile "' . $profile['name'] . '": ' . implode(', ', $changes);
    }
}

// Log migration results if any profiles were updated
if (!empty($migrationLog)) {
    rex_logger::factory()->log('info', 'TinyMCE 8 Migration: Updated ' . count($migrationLog) . ' profile(s): ' . implode('; ', $migrationLog));
}
