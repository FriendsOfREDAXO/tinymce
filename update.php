<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// ensure schema (include a plain PHP file — safe during install/update)
$this->includeFile(__DIR__ . '/ensure_table.php');

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

// Log update completion
rex_logger::factory()->log('info', 'TinyMCE addon updated to v' . $this->getVersion());

// Display success message
echo rex_view::success(
    'TinyMCE erfolgreich auf <strong>v' . $this->getVersion() . '</strong> aktualisiert. '
    . 'Spalte <code>extra</code> → <code>profile</code> migriert. '
    . '<br><small>Legacy-Profile werden beim Import automatisch migriert.</small>'
);

return true;
