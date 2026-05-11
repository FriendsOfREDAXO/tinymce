<?php

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use FriendsOfRedaxo\TinyMce\Utils\DefaultProfiles;

/**
 * TinyMCE-8 profile fixer logic for common manual/profile-string mistakes.
 *
 * @return array{profile: string, changes: list<string>}
 */
function tinymce_fix_profile_for_v8(string $profile): array
{
    $result = $profile;
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
        if ($result !== $profile) {
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

    return ['profile' => $result, 'changes' => array_values($changes)];
}

// Simple admin page to inspect and repair TinyMCE-8 profile definitions.
$func = rex_request('func', 'string');
$id = (int) rex_request('id', 'int');

$csrfToken = rex_csrf_token::factory('tinymce_migration');
$requestMethod = strtoupper((string) rex_request::server('REQUEST_METHOD', 'string', 'GET'));

$profileTable = rex::getTable(TinyMceDatabaseHandler::TINY_PROFILES);

// State-changing actions are only allowed via POST.
if (in_array($func, ['repair', 'repair_all', 'reset_default_profiles'], true) && 'POST' !== $requestMethod) {
    echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    $func = '';
}

if ('repair' === $func && $id > 0) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, profile FROM '.$profileTable.' WHERE id = ?', [$id]);
    $profile = $sql->getArray();
    if (!empty($profile)) {
        $profile = $profile[0];
        $result = tinymce_fix_profile_for_v8((string)$profile['profile']);
        if (!empty($result['changes'])) {
            $update = rex_sql::factory();
            $update->setTable($profileTable);
            $update->setWhere(['id' => $id]);
            $update->setValue('profile', $result['profile']);
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
}

if ('repair_all' === $func) {
    if (!$csrfToken->isValid()) {
        echo rex_view::error(rex_i18n::msg('csrf_token_invalid'));
    } else {
    $sql = rex_sql::factory();
    $sql->setQuery('SELECT id, name, profile FROM '.$profileTable);
    $profiles = $sql->getArray();
    $count = 0;
    foreach ($profiles as $p) {
        $res = tinymce_fix_profile_for_v8((string)$p['profile']);
        if (!empty($res['changes'])) {
            $update = rex_sql::factory();
            $update->setTable($profileTable);
            $update->setWhere(['id' => (int) $p['id']]);
            $update->setValue('profile', $res['profile']);
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

$profiles = TinyMceDatabaseHandler::getAllProfiles() ?: [];

// action buttons (repair all)
$content = '<p>' . rex_i18n::msg('tinymce_migration_description') . '</p>';
$content .= '<ul>';
$content .= '<li>license_key wird ergänzt, falls er fehlt</li>';
$content .= '<li>veraltete template-Plugin-Einträge werden entfernt</li>';
$content .= '<li>relative external_plugins-Pfade werden auf absolute /assets-Pfade normalisiert</li>';
$content .= '<li>content_css-Fallback "light" wird auf "default" korrigiert</li>';
$content .= '</ul>';
$content .= '<form action="' . rex_url::currentBackendPage() . '" method="post" style="margin-bottom:10px">';
$content .= $csrfToken->getHiddenField();
$content .= '<input type="hidden" name="func" value="repair_all">';
$content .= '<button class="btn btn-sm btn-primary" type="submit" data-confirm="' . rex_i18n::msg('tinymce_migration_repair_all_confirm', '') . '">' . rex_i18n::msg('tinymce_migration_repair_all') . '</button>';
$content .= '</form>';

// Accordion using bootstrap collapse to keep the page tidy and match backend UI patterns
$content .= '<div id="tinymce-migration-accordion" class="panel-group">';
foreach ($profiles as $p) {
    $panelId = 'tinymce-profile-' . $p['id'];
    $res = tinymce_fix_profile_for_v8((string)$p['profile']);
    $needs = !empty($res['changes']);

    $statusBadge = $needs ? '<span class="label label-warning">' . rex_i18n::msg('tinymce_migration_needs_fix') . '</span>' : '<span class="label label-success">' . rex_i18n::msg('tinymce_migration_ok') . '</span>';

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
    $content .= '<div class="col-md-9"><pre style="white-space: pre-wrap;">' . htmlspecialchars((string)$p['profile']) . '</pre></div>';
    $content .= '<div class="col-md-3 text-right">';
    if ($needs) {
        $content .= '<form action="' . rex_url::currentBackendPage() . '" method="post" style="display:inline-block">';
        $content .= $csrfToken->getHiddenField();
        $content .= '<input type="hidden" name="func" value="repair">';
        $content .= '<input type="hidden" name="id" value="' . (int) $p['id'] . '">';
        $content .= '<button class="btn btn-sm btn-primary" type="submit">' . rex_i18n::msg('tinymce_migration_repair') . '</button>';
        $content .= '</form>';
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
