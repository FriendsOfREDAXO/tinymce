<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// include an autoload-free snippet to ensure the required table exists
$this->includeFile(__DIR__ . '/ensure_table.php');

// =============================================================================
// Migration: imagewidth -> for_images (v8.2.0)
// =============================================================================
// The imagewidth plugin was renamed to for_images. Update existing profiles.
try {
    $sql = rex_sql::factory();
    $profiles = $sql->getArray('SELECT id, plugins, toolbar, extra FROM ' . rex::getTable('tinymce_profiles'));

    foreach ($profiles as $profile) {
        $needsUpdate = false;
        $plugins = (string) $profile['plugins'];
        $toolbar = (string) $profile['toolbar'];
        $extra = (string) $profile['extra'];

        // Replace imagewidth with for_images in plugins list
        if (str_contains($plugins, 'imagewidth')) {
            $plugins = str_replace('imagewidth', 'for_images', $plugins);
            $needsUpdate = true;
        }

        // Replace imagewidthdialog button with for_images in toolbar
        if (str_contains($toolbar, 'imagewidthdialog')) {
            $toolbar = str_replace('imagewidthdialog', 'for_images', $toolbar);
            $needsUpdate = true;
        }

        // Replace in extra config as well
        if (str_contains($extra, 'imagewidth')) {
            $extra = str_replace('imagewidth', 'for_images', $extra);
            $needsUpdate = true;
        }

        if ($needsUpdate) {
            $updateSql = rex_sql::factory();
            $updateSql->setTable(rex::getTable('tinymce_profiles'));
            $updateSql->setWhere(['id' => $profile['id']]);
            $updateSql->setValue('plugins', $plugins);
            $updateSql->setValue('toolbar', $toolbar);
            $updateSql->setValue('extra', $extra);
            $updateSql->setValue('updatedate', date('Y-m-d H:i:s'));
            $updateSql->update();
        }
    }
} catch (rex_sql_exception $e) {
    // Ignore errors during migration
}

// Set flag to regenerate profiles.js on next backend request
$this->setConfig('update_profiles', true);

return true;
