<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// ensure schema (include a plain PHP file — safe during install/update)
$this->includeFile(__DIR__ . '/ensure_table.php');

// Guard: this update path requires at least v8.8.1 as source version.
if (rex_string::versionCompare($this->getVersion(), '8.8.1', '<')) {
    echo rex_view::error(
        'Dieses Update erfordert mindestens TinyMCE v8.8.1 als Ausgangsversion. '
        . 'Bitte zuerst auf v8.8.1 aktualisieren.'
    );

    return false;
}

// =============================================================================
// Migration (v8.9.0): Rename `extra` column → `profile`
// =============================================================================
// As of v8.9.0, the configuration column is called `profile` instead of
// `extra`. This is more intuitive and aligns with the UI terminology.
// Old profiles with the legacy `extra` column are migrated automatically.
if (rex_string::versionCompare($this->getVersion(), '8.9.0', '<')) {
    try {
        $profileTable = rex::getTable('tinymce_profiles');
        $tableObj = rex_sql_table::get($profileTable);

        // Only run if legacy `extra` column still exists
        if ($tableObj->hasColumn('extra')) {
            // Migrate data: copy extra → profile
            $migrateSql = rex_sql::factory();
            $migrateSql->setQuery('UPDATE ' . $profileTable . ' SET profile = extra WHERE profile IS NULL OR profile = ""');

            // Drop the legacy column
            $dropSql = rex_sql::factory();
            $dropSql->setQuery('ALTER TABLE ' . $profileTable . ' DROP COLUMN extra');
        }
    } catch (rex_sql_exception $e) {
        rex_logger::logException($e);
    }
}

// Set flag to regenerate profiles.js on next backend request
$this->setConfig('update_profiles', true);

// =============================================================================
// Demo-Profil bei jedem Update auf aktuellen Stand (aus JSON) setzen.
// Standard-Profile (full, light, default) werden NICHT überschrieben –
// Redakteure können diese anpassen und behalten ihre Änderungen.
//
// Klassen manuell laden: Update läuft im .new.*-Pfad, Autoloader zeigt noch
// auf den alten Addon-Pfad.
// =============================================================================
$__tinymceClassIter = new \RecursiveIteratorIterator(
    new \RecursiveDirectoryIterator(__DIR__ . '/lib/TinyMce', \FilesystemIterator::SKIP_DOTS)
);
foreach ($__tinymceClassIter as $__tinymceClassFile) {
    if (!$__tinymceClassFile->isFile() || !str_ends_with($__tinymceClassFile->getFilename(), '.php')) {
        continue;
    }
    $__tinymceClassSource = (string) file_get_contents($__tinymceClassFile->getPathname());
    if (preg_match('/namespace\s+([^;\s]+)\s*;/', $__tinymceClassSource, $__ns)
        && preg_match('/\b(?:class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/', $__tinymceClassSource, $__cls)
    ) {
        $__fqn = $__ns[1] . '\\' . $__cls[1];
        if (class_exists($__fqn, false) || interface_exists($__fqn, false) || trait_exists($__fqn, false) || (function_exists('enum_exists') && enum_exists($__fqn, false))) {
            continue;
        }
    }
    require_once $__tinymceClassFile->getPathname();
}
unset($__tinymceClassIter, $__tinymceClassFile, $__tinymceClassSource, $__ns, $__cls, $__fqn);

try {
    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
        __DIR__ . '/install/tinymce-profiles.json',
        true,
        ['demo']
    );
} catch (\Throwable $e) {
    \rex_logger::logException($e);
}

// Log update completion
rex_logger::factory()->log('info', 'TinyMCE addon updated to v' . $this->getVersion());

// Display success message
echo rex_view::success(
    'TinyMCE erfolgreich auf <strong>v' . $this->getVersion() . '</strong> aktualisiert.'
);

return true;
