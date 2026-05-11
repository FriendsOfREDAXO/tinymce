<?php

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Utils\DefaultProfiles;

/**
 * Detect sync issue: returns array with 'plugins_extra', 'toolbar_extra',
 * 'plugins_col', 'toolbar_col' and 'needs_sync' (bool).
 *
 * @param array{id: mixed, name: mixed, extra: mixed, plugins: mixed, toolbar: mixed} $profile
 * @return array{plugins_extra: string, toolbar_extra: string, plugins_col: string, toolbar_col: string, needs_sync: bool}
 */
function tinymce_sync_detect(array $profile): array
{
    $extra = (string) $profile['extra'];
    $pluginsCol = (string) $profile['plugins'];
    $toolbarCol = (string) $profile['toolbar'];

    $pluginsExtra = '';
    $toolbarExtra = '';

    // Extract plugins from extra (string syntax: plugins: 'a b c')
    if (preg_match('/(?:^|[,\{\r\n])\s*plugins\s*:\s*(["\'])([^"\']*)\1/mi', $extra, $m) === 1) {
        $pluginsExtra = trim($m[2]);
    }
    // Extract plugins from extra (array syntax: plugins: ['a', 'b'])
    if ('' === $pluginsExtra && preg_match('/(?:^|[,\{\r\n])\s*plugins\s*:\s*\[([^\]]*)\]/mi', $extra, $m) === 1) {
        // Flatten array entries to space-separated string for comparison
        preg_match_all('/["\']([^"\']+)["\']/', $m[1], $items);
        $pluginsExtra = implode(' ', $items[1]);
    }

    // Extract toolbar from extra (string syntax: toolbar: 'bold italic ...')
    if (preg_match('/(?:^|[,\{\r\n])\s*toolbar\s*:\s*(["\'])([^"\']*)\1/mi', $extra, $m) === 1) {
        $toolbarExtra = trim($m[2]);
    }

    // Needs sync when extra has a value that differs from the legacy column
    $pluginsNeedsSync = '' !== $pluginsExtra && $pluginsExtra !== $pluginsCol;
    $toolbarNeedsSync = '' !== $toolbarExtra && $toolbarExtra !== $toolbarCol;

    return [
        'plugins_extra' => $pluginsExtra,
        'toolbar_extra' => $toolbarExtra,
        'plugins_col' => $pluginsCol,
        'toolbar_col' => $toolbarCol,
        'needs_sync' => $pluginsNeedsSync || $toolbarNeedsSync,
    ];
}

/**
 * Perform sync: write values from extra into legacy columns.
 *
 * @param array{id: mixed, name: mixed, extra: mixed, plugins: mixed, toolbar: mixed} $profile
 * @param array{plugins_extra: string, toolbar_extra: string, plugins_col: string, toolbar_col: string, needs_sync: bool} $detected
 */
function tinymce_sync_repair(array $profile, array $detected, string $profileTable): bool
{
    if (!$detected['needs_sync']) {
        return false;
    }

    $update = rex_sql::factory();
    $update->setTable($profileTable);
    $update->setWhere(['id' => (int) $profile['id']]);

    if ('' !== $detected['plugins_extra'] && $detected['plugins_extra'] !== $detected['plugins_col']) {
        $update->setValue('plugins', $detected['plugins_extra']);
    }
    if ('' !== $detected['toolbar_extra'] && $detected['toolbar_extra'] !== $detected['toolbar_col']) {
        $update->setValue('toolbar', $detected['toolbar_extra']);
    }

    $update->update();
    return true;
}

/**
 * Inline migration logic (avoid adding new classes required by updates/install).
 * Returns array with 'extra' => string and 'changes' => array of change descriptions.
 *
 * @return array{extra: string, changes: list<string>}
 */
function tinymce_migrate_extra(string $extra): array
{
    $result = $extra;
    $changes = [];

    // Only add license_key if it doesn't already exist
    if ('' !== $result && strpos($result, 'license_key:') === false) {
        $result = "license_key: 'gpl',\r\n" . $result;
        $changes[] = 'Added GPL license key';
    }

    if ('' !== $result) {
        $templatePatterns = [
            '/media template codesample/' => 'media codesample',
            '/link template codesample/' => 'link codesample',
            '/codesample template fontsize/' => 'codesample fontsize',
            '/, template,/' => ', ',
            '/, template\'/' => "'",
            '/\'template, /' => "'",
            '/template\s+codesample/' => 'codesample',
            '/codesample\s+template/' => 'codesample',
        ];
        foreach ($templatePatterns as $pattern => $replacement) {
            if (preg_match($pattern, $result)) {
                $result = (string) preg_replace($pattern, $replacement, $result);
                if (!in_array('Removed template plugin', $changes, true)) {
                    $changes[] = 'Removed template plugin';
                }
            }
        }
    }

    // Fix external_plugins paths - ensure absolute paths (starting with /)
    if ('' !== $result && preg_match('/external_plugins:\s*\{/', $result)) {
        // Fix relative paths like "assets/addons/..." to "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(assets\/addons\/)/',
            '"/assets/addons/',
            $result
        );
        // Fix escaped relative paths like "..\/assets\/addons\/..." to "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(?:\.\.\\\\\/)+assets\\\\\/addons\\\\\//',
            '"/assets/addons/',
            $result
        );
        // Fix unescaped relative paths like "../assets/addons/..." to "/assets/addons/..."
        $result = (string) preg_replace(
            '/"(?:\.\.\/)+assets\/addons\//',
            '"/assets/addons/',
            $result
        );
        if ($result !== $extra) {
            $changes[] = 'Fixed external_plugins paths to absolute URLs';
        }
    }

    // Fix content_css for proper dark mode support if needed
    if ('' !== $result && preg_match('/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"[^\"]+"\s*:\s*"light"/', $result)) {
        $result = (string) preg_replace(
            '/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"([^\"]+)"\s*:\s*"light"/',
            'content_css: redaxo.theme.current === "dark" ? "$1" : "default"',
            $result
        );
        $changes[] = 'Fixed content_css for dark mode';
    }

    return ['extra' => $result, 'changes' => array_values($changes)];
}

// Simple admin page to inspect and repair old profiles.
$func = rex_request('func', 'string');
$id = (int) rex_request('id', 'int');

$csrfToken = rex_csrf_token::factory('tinymce_migration');

$profileTable = rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES);

if ('repair' === $func && $id > 0) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, extra FROM '.$profileTable.' WHERE id = ?', [$id]);
    $profile = $sql->getArray();
    if (!empty($profile)) {
        $profile = $profile[0];
        $result = tinymce_migrate_extra((string)$profile['extra']);
        if (!empty($result['changes'])) {
            $update = rex_sql::factory();
            $update->setTable($profileTable);
            $update->setWhere(['id' => $id]);
            $update->setValue('extra', $result['extra']);
            $update->update();
            // Regenerate profiles.js
            try {
                TinyMceProfilesCreator::profilesCreate();
            } catch (rex_functional_exception $e) {
                // ignore
            }
            rex_logger::factory()->log('info', 'TinyMCE: Repaired profile "'.$profile['name'].'" via migration page.');
            echo rex_view::success(rex_i18n::msg('tinymce_migration_repaired', (string) $profile['name']));
        } else {
            echo rex_view::info(rex_i18n::msg('tinymce_migration_no_changes', (string) $profile['name']));
        }
    }
}

if ('repair_all' === $func) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, extra FROM '.$profileTable);
    $profiles = $sql->getArray();
    $count = 0;
    foreach ($profiles as $profile) {
        $result = tinymce_migrate_extra((string)$profile['extra']);
        if (!empty($result['changes'])) {
            $update = rex_sql::factory();
            $update->setTable($profileTable);
            $update->setWhere(['id' => (int) $profile['id']]);
            $update->setValue('extra', $result['extra']);
            $update->update();
            $count++;
        }
    }
    // Regenerate profiles.js after all repairs
    if ($count > 0) {
        try {
            TinyMceProfilesCreator::profilesCreate();
        } catch (rex_functional_exception $e) {
            // ignore
        }
    }
    echo rex_view::success(rex_i18n::msg('tinymce_migration_repaired_count', $count));
}

if ('reset_default_profiles' === $func) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
        try {
            DefaultProfiles::resetAll();
            echo rex_view::success(rex_i18n::msg('tinymce_reset_default_profiles_success'));
        } catch (\Throwable $e) {
            rex_logger::logException($e);
            echo rex_view::error($e->getMessage());
        }
    }
}

if ('sync_repair' === $func && $id > 0) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, extra, plugins, toolbar FROM ' . $profileTable . ' WHERE id = ?', [$id]);
    /** @var array<array{id: mixed, name: mixed, extra: mixed, plugins: mixed, toolbar: mixed}> $rows */
    $rows = $sql->getArray();
    if (!empty($rows)) {
        $profile = $rows[0];
        $detected = tinymce_sync_detect($profile);
        if (tinymce_sync_repair($profile, $detected, $profileTable)) {
            try {
                TinyMceProfilesCreator::profilesCreate();
            } catch (rex_functional_exception $e) {
                // ignore
            }
            rex_logger::factory()->log('info', 'TinyMCE: Synchronised legacy columns for profile "' . (string) $profile['name'] . '" via migration page.');
            echo rex_view::success(rex_i18n::msg('tinymce_sync_repaired', (string) $profile['name']));
        } else {
            echo rex_view::info(rex_i18n::msg('tinymce_sync_no_changes', (string) $profile['name']));
        }
    }
}

if ('sync_repair_all' === $func) {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, extra, plugins, toolbar FROM ' . $profileTable);
    /** @var array<array{id: mixed, name: mixed, extra: mixed, plugins: mixed, toolbar: mixed}> $allProfiles */
    $allProfiles = $sql->getArray();
    $count = 0;
    foreach ($allProfiles as $profile) {
        $detected = tinymce_sync_detect($profile);
        if (tinymce_sync_repair($profile, $detected, $profileTable)) {
            $count++;
        }
    }
    if ($count > 0) {
        try {
            TinyMceProfilesCreator::profilesCreate();
        } catch (rex_functional_exception $e) {
            // ignore
        }
    }
    echo rex_view::success(rex_i18n::msg('tinymce_sync_repaired_count', $count));
}

$profiles = TinyMceDatabaseHandler::getAllProfiles() ?: [];

// action buttons (repair all)
$repairAllUrl = rex_url::backendPage('tinymce/migration', ['func' => 'repair_all']);
$content = '<p>' . rex_i18n::msg('tinymce_migration_description') . '</p>';
$content .= '<p><a class="btn btn-sm btn-primary" href="' . $repairAllUrl . '" data-confirm="' . rex_i18n::msg('tinymce_migration_repair_all_confirm', '') . '">' . rex_i18n::msg('tinymce_migration_repair_all') . '</a></p>';

// Accordion using bootstrap collapse to keep the page tidy and match backend UI patterns
$content .= '<div id="tinymce-migration-accordion" class="panel-group">';
foreach ($profiles as $p) {
    $panelId = 'tinymce-profile-' . $p['id'];
    $res = tinymce_migrate_extra((string)$p['extra']);
    $needs = !empty($res['changes']);

    $statusBadge = $needs ? '<span class="label label-warning">' . rex_i18n::msg('tinymce_migration_needs_fix') . '</span>' : '<span class="label label-success">' . rex_i18n::msg('tinymce_migration_ok') . '</span>';

    $repairUrl = rex_url::backendPage('tinymce/migration', ['func' => 'repair', 'id' => $p['id']]);

    $content .= '<div class="panel panel-default">';
    $content .= '<div class="panel-heading">';
    $content .= '<h4 class="panel-title">';
    $content .= '<a class="collapsed" data-toggle="collapse" href="#' . $panelId . '">';
    $content .= '<strong>' . htmlspecialchars($p['name']) . '</strong> <small class="text-muted">#' . (int)$p['id'] . '</small> ' . $statusBadge;
    $content .= '</a>';
    $content .= '</h4>';
    $content .= '</div>';

    $content .= '<div id="' . $panelId . '" class="panel-collapse collapse">';
    $content .= '<div class="panel-body">';
    $content .= '<div class="row">';
    $content .= '<div class="col-md-9"><pre style="white-space: pre-wrap;">' . htmlspecialchars((string)$p['extra']) . '</pre></div>';
    $content .= '<div class="col-md-3 text-right">';
    if ($needs) {
        $content .= '<a class="btn btn-sm btn-primary" href="' . $repairUrl . '">' . rex_i18n::msg('tinymce_migration_repair') . '</a> ';
    }
    $content .= '</div>'; // col
    $content .= '</div>'; // row
    $content .= '</div>'; // panel-body
    $content .= '</div>'; // collapse
    $content .= '</div>'; // panel
}
$content .= '</div>'; // accordion

$fragment = new rex_fragment();
$fragment->setVar('title', rex_i18n::msg('tinymce_migration_title'));
$fragment->setVar('class', 'edit', false);
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');

// =============================================================================
// Section: Plugin-/Toolbar-Spalten synchronisieren (Issue #166)
// =============================================================================
$syncRepairAllUrl = rex_url::backendPage('tinymce/migration', ['func' => 'sync_repair_all']);
$syncBody = '<p>' . rex_i18n::msg('tinymce_sync_description') . '</p>';
$syncBody .= '<p><a class="btn btn-sm btn-primary" href="' . $syncRepairAllUrl . '" data-confirm="' . rex_i18n::msg('tinymce_sync_repair_all_confirm') . '">' . rex_i18n::msg('tinymce_sync_repair_all') . '</a></p>';

$syncBody .= '<div id="tinymce-sync-accordion" class="panel-group">';
foreach ($profiles as $sp) {
    /** @var array{id: mixed, name: mixed, extra: mixed, plugins: mixed, toolbar: mixed} $sp */
    $syncDetected = tinymce_sync_detect($sp);
    $syncPanelId = 'tinymce-sync-profile-' . (int) $sp['id'];
    $syncNeedsFix = $syncDetected['needs_sync'];

    $syncBadge = $syncNeedsFix
        ? '<span class="label label-warning">' . rex_i18n::msg('tinymce_sync_needs_fix') . '</span>'
        : '<span class="label label-success">' . rex_i18n::msg('tinymce_sync_ok') . '</span>';

    $syncRepairUrl = rex_url::backendPage('tinymce/migration', ['func' => 'sync_repair', 'id' => (int) $sp['id']]);

    $syncBody .= '<div class="panel panel-default">';
    $syncBody .= '<div class="panel-heading"><h4 class="panel-title">';
    $syncBody .= '<a class="collapsed" data-toggle="collapse" href="#' . $syncPanelId . '">';
    $syncBody .= '<strong>' . rex_escape((string) $sp['name']) . '</strong> <small class="text-muted">#' . (int) $sp['id'] . '</small> ' . $syncBadge;
    $syncBody .= '</a></h4></div>';

    $syncBody .= '<div id="' . $syncPanelId . '" class="panel-collapse collapse">';
    $syncBody .= '<div class="panel-body">';

    if ($syncNeedsFix) {
        $syncBody .= '<table class="table table-condensed" style="font-family:monospace">';
        $syncBody .= '<thead><tr><th></th><th>extra</th><th>DB-Spalte</th></tr></thead><tbody>';

        $pluginsMatch = $syncDetected['plugins_extra'] === $syncDetected['plugins_col'];
        $toolbarMatch = $syncDetected['toolbar_extra'] === $syncDetected['toolbar_col'];

        $syncBody .= '<tr class="' . ($pluginsMatch ? '' : 'warning') . '">';
        $syncBody .= '<th>plugins</th>';
        $syncBody .= '<td>' . rex_escape($syncDetected['plugins_extra']) . '</td>';
        $syncBody .= '<td>' . rex_escape($syncDetected['plugins_col']) . '</td>';
        $syncBody .= '</tr>';

        $syncBody .= '<tr class="' . ($toolbarMatch ? '' : 'warning') . '">';
        $syncBody .= '<th>toolbar</th>';
        $syncBody .= '<td>' . rex_escape($syncDetected['toolbar_extra']) . '</td>';
        $syncBody .= '<td>' . rex_escape($syncDetected['toolbar_col']) . '</td>';
        $syncBody .= '</tr>';

        $syncBody .= '</tbody></table>';
        $syncBody .= '<a class="btn btn-sm btn-primary" href="' . $syncRepairUrl . '">' . rex_i18n::msg('tinymce_sync_repair') . '</a>';
    } else {
        $syncBody .= '<p class="text-muted">' . rex_i18n::msg('tinymce_sync_ok') . '</p>';
    }

    $syncBody .= '</div></div></div>'; // panel-body, collapse, panel
}
$syncBody .= '</div>'; // accordion

$syncFragment = new rex_fragment();
$syncFragment->setVar('title', rex_i18n::msg('tinymce_sync_title'));
$syncFragment->setVar('class', 'edit', false);
$syncFragment->setVar('body', $syncBody, false);
echo $syncFragment->parse('core/page/section.php');

// =============================================================================
// Section: Standardprofile zurücksetzen
// =============================================================================
$resetBody = '<p>' . rex_i18n::msg('tinymce_reset_default_profiles_description') . '</p>';
$resetBody .= '<ul>';
foreach (DefaultProfiles::NAMES as $pName) {
    $resetBody .= '<li><code>' . rex_escape($pName) . '</code></li>';
}
$resetBody .= '<li><code>' . rex_escape(\FriendsOfRedaxo\TinyMce\Utils\DemoProfile::NAME) . '</code> <span class="text-muted">(' . rex_i18n::msg('tinymce_profile_demo_locked_badge') . ')</span></li>';
$resetBody .= '</ul>';
$resetBody .= '<form action="' . rex_url::currentBackendPage() . '" method="post">';
$resetBody .= $csrfToken->getHiddenField();
$resetBody .= '<input type="hidden" name="func" value="reset_default_profiles">';
$resetBody .= '<button class="btn btn-danger" type="submit" data-confirm="' . rex_i18n::msg('tinymce_reset_default_profiles_confirm') . '">';
$resetBody .= rex_i18n::msg('tinymce_reset_default_profiles_button');
$resetBody .= '</button>';
$resetBody .= '</form>';

$resetFragment = new rex_fragment();
$resetFragment->setVar('title', rex_i18n::msg('tinymce_reset_default_profiles_title'));
$resetFragment->setVar('class', 'edit', false);
$resetFragment->setVar('body', $resetBody, false);
echo $resetFragment->parse('core/page/section.php');
