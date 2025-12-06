<?php

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;

/**
 * Inline migration logic (avoid adding new classes required by updates/install).
 * Returns array with 'extra' => string and 'changes' => array of change descriptions.
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
                $result = preg_replace($pattern, $replacement, $result);
                if (!in_array('Removed template plugin', $changes, true)) {
                    $changes[] = 'Removed template plugin';
                }
            }
        }
    }

    // Fix external_plugins paths - ensure absolute paths (starting with /)
    if ('' !== $result && preg_match('/external_plugins:\s*\{/', $result)) {
        // Fix relative paths like "assets/addons/..." to "/assets/addons/..."
        $result = preg_replace(
            '/"(assets\/addons\/)/',
            '"/assets/addons/',
            $result
        );
        // Fix escaped relative paths like "..\/assets\/addons\/..." to "/assets/addons/..."
        $result = preg_replace(
            '/"(?:\.\.\\\\\/)+assets\\\\\/addons\\\\\//',
            '"/assets/addons/',
            $result
        );
        // Fix unescaped relative paths like "../assets/addons/..." to "/assets/addons/..."
        $result = preg_replace(
            '/"(?:\.\.\/)+assets\/addons\//',
            '"/assets/addons/',
            $result
        );
        if ($result !== $extra && !in_array('Fixed external_plugins paths', $changes, true)) {
            $changes[] = 'Fixed external_plugins paths to absolute URLs';
        }
    }

    // Fix content_css for proper dark mode support if needed
    if ('' !== $result && preg_match('/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"[^\"]+"\s*:\s*"light"/', $result)) {
        $result = preg_replace(
            '/content_css:\s*redaxo\.theme\.current\s*===\s"dark"\s*\?\s*"([^\"]+)"\s*:\s*"light"/',
            'content_css: redaxo.theme.current === "dark" ? "$1" : "default"',
            $result
        );
        $changes[] = 'Fixed content_css for dark mode';
    }

    return ['extra' => $result, 'changes' => $changes];
}

// Simple admin page to inspect and repair old profiles.
$func = rex_request('func', 'string');
$id = (int) rex_request('id', 'int');

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
            echo rex_view::success(rex_i18n::msg('tinymce_migration_repaired', $profile['name']));
        } else {
            echo rex_view::info(rex_i18n::msg('tinymce_migration_no_changes', $profile['name']));
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
            $update->setWhere(['id' => $profile['id']]);
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
