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

// =============================================================================
// Migration (v8.4.0): toolbar_sticky als Default in allen bestehenden Profilen
// ergänzen, sofern noch nicht vorhanden. Das Demo-Profil wird unten separat
// komplett überschrieben und braucht hier keine Sonderbehandlung.
// =============================================================================
try {
    $stickySql = rex_sql::factory();
    $stickyProfiles = $stickySql->getArray(
        'SELECT id, name, extra FROM ' . rex::getTable('tinymce_profiles')
    );

    foreach ($stickyProfiles as $profile) {
        if ($profile['name'] === \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::NAME) {
            continue;
        }

        $extra = (string) $profile['extra'];
        if (str_contains($extra, 'toolbar_sticky')) {
            // Zwischenstand-Migration: alten Offset 50 auf 0 normalisieren,
            // damit die Toolbar bündig am Viewport-Rand klebt.
            $normalized = preg_replace('/toolbar_sticky_offset\s*:\s*50\b/', 'toolbar_sticky_offset: 0', $extra);
            if (null !== $normalized && $normalized !== $extra) {
                $upd = rex_sql::factory();
                $upd->setTable(rex::getTable('tinymce_profiles'));
                $upd->setWhere(['id' => $profile['id']]);
                $upd->setValue('extra', $normalized);
                $upd->setValue('updatedate', date('Y-m-d H:i:s'));
                $upd->update();
            }
            continue;
        }

        $injection = "toolbar_sticky: true,\ntoolbar_sticky_offset: 0,\n";
        $newExtra = '' === trim($extra) ? $injection : $injection . $extra;

        $upd = rex_sql::factory();
        $upd->setTable(rex::getTable('tinymce_profiles'));
        $upd->setWhere(['id' => $profile['id']]);
        $upd->setValue('extra', $newExtra);
        $upd->setValue('updatedate', date('Y-m-d H:i:s'));
        $upd->update();
    }
} catch (rex_sql_exception $e) {
    // Migration ist best-effort – Fehler nicht weiterreichen
    rex_logger::logException($e);
}

// =============================================================================
// Demo-Profil bei jedem Update auf aktuellen Stand bringen (ggf. neu anlegen).
// Das Profil ist im Backend gesperrt (siehe pages/profiles.php).
// =============================================================================
try {
    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::ensureProfile(
        \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::NAME,
        \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::DESCRIPTION,
        ['extra' => \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::getExtra()],
        true
    );
} catch (\Throwable $e) {
    \rex_logger::logException($e);
}

return true;
