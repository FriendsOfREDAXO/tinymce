<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

$profileTable = rex::getTable('tinymce_profiles');
$isReinstall = false;

// Reinstall path: if profile table is already accessible, treat install as update.
try {
    $probeSql = rex_sql::factory();
    $probeSql->setQuery('SELECT id FROM ' . $profileTable . ' LIMIT 1');
    $isReinstall = true;
} catch (rex_sql_exception $e) {
    $isReinstall = false;
}

// ensure schema (include a plain PHP file — safe during install/update)
$this->includeFile(__DIR__ . '/ensure_table.php');

if ($isReinstall) {
    $this->includeFile(__DIR__ . '/update.php');
    return;
}

// Set flag to regenerate profiles.js on first backend request
// This ensures external plugins get correct absolute URLs (boot.php runs at runtime)
$this->setConfig('update_profiles', true);

// Only import default profiles when there are no profiles yet. The package manager
// also loads install.sql automatically, but we removed/avoid using install.sql to
// prevent accidental overwrites or SQL syntax issues during reinstall. Insert
// defaults in PHP so we can safely handle multi-line JS strings.

try {
	$sql = \rex_sql::factory();
	$count = (int) $sql->getValue('SELECT COUNT(*) FROM ' . \rex::getTable('tinymce_profiles'));

	if ($count === 0) {
		// Load default profiles from DefaultProfiles utility
		require_once __DIR__ . '/lib/TinyMce/Utils/DefaultProfiles.php';
		$defaults = \FriendsOfRedaxo\TinyMce\Utils\DefaultProfiles::getDefaults();
		$now = date('Y-m-d H:i:s');

		// Insert default profiles (id 1..3)
		foreach ($defaults as $i => $p) {
			$ins = \rex_sql::factory();
			$ins->setTable(\rex::getTable('tinymce_profiles'));
			$ins->setValue('id', $i + 1);
			$ins->setValue('name', $p['name']);
			$ins->setValue('description', $p['description']);
			$ins->setValue('profile', $p['profile']);
			$ins->setValue('createdate', $now);
			$ins->setValue('updatedate', $now);
			$ins->setValue('createuser', 'admin');
			$ins->setValue('updateuser', 'admin');
			try {
				$ins->insert();
			} catch (\Throwable $e) {
				// If another process already created the default rows (race), ignore duplicate PK
				\rex_logger::logException($e);
			}
		}
	}
} catch (\Throwable $e) {
	\rex_logger::logException($e);
	echo \rex_view::error($e->getMessage());
}

// =============================================================================
// Demo-Profil: immer (bei Install und Update) auf aktuellen Stand setzen.
// Das Profil ist im Backend gesperrt (siehe pages/profiles.php) und versorgt
// die Demo-Seite (pages/main.php) mit allen FOR-Plugins.
// =============================================================================
// Klassen manuell laden: Bei einer frischen Installation ist der Composer-
// Classmap-Cache noch nicht (neu) aufgebaut, daher greift der Autoloader für
// AddOn-Klassen hier noch nicht. Wir ziehen alle PHP-Klassendateien unter
// lib/TinyMce/ rekursiv nach.
//
// Beim Update läuft der Code im .new.tinymce-Pfad, während der Autoloader
// die gleichnamigen Klassen bereits aus dem alten tinymce-Pfad geladen hat.
// Darum vor jedem require_once prüfen, ob die Klasse / das Interface schon
// existiert – sonst gibt es „Cannot declare class … already in use“.
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
	\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::ensureProfile(
		\FriendsOfRedaxo\TinyMce\Utils\DemoProfile::NAME,
		\FriendsOfRedaxo\TinyMce\Utils\DemoProfile::DESCRIPTION,
        ['profile' => \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::getExtra()],
		true
	);
} catch (\Throwable $e) {
	\rex_logger::logException($e);
}

// Style-Sets: Table is created via ensure_table.php
// Default sets are NOT auto-installed - user can install them via "Demo-Sets installieren" button

// =============================================================================
// Demo-Snippets: nur bei frischer Installation einfügen (0 Einträge in Tabelle)
// =============================================================================
try {
    $snippetSql = \rex_sql::factory();
    $snippetCount = (int) $snippetSql->getValue('SELECT COUNT(*) FROM ' . \rex::getTable('tinymce_snippets'));

    if ($snippetCount === 0) {
        $now = date('Y-m-d H:i:s');

        $demoSnippets = [
            [
                'name' => 'Kontaktinformationen',
                'content' => <<<'HTML'
<div class="contact-info">
  <h3>So erreichen Sie uns</h3>
  <address>
    <p><strong>Musterunternehmen GmbH</strong><br>
    Musterstraße 42<br>
    12345 Musterstadt</p>
    <p>📞 <a href="tel:+491234567890">+49 123 456 78-90</a><br>
    📠 +49 123 456 78-99<br>
    ✉ <a href="mailto:hallo@musterunternehmen.de">hallo@musterunternehmen.de</a></p>
    <p>🌐 <a href="https://www.musterunternehmen.de">www.musterunternehmen.de</a></p>
  </address>
</div>
HTML,
            ],
            [
                'name' => 'Öffnungszeiten',
                'content' => <<<'HTML'
<div class="opening-hours">
  <h3>Unsere Öffnungszeiten</h3>
  <table>
    <tbody>
      <tr><td><strong>Montag – Donnerstag</strong></td><td>08:00 – 17:30 Uhr</td></tr>
      <tr><td><strong>Freitag</strong></td><td>08:00 – 14:00 Uhr</td></tr>
      <tr><td><strong>Samstag</strong></td><td>09:00 – 13:00 Uhr</td></tr>
      <tr><td><strong>Sonntag &amp; Feiertage</strong></td><td>Geschlossen</td></tr>
    </tbody>
  </table>
  <p><em>Termine außerhalb der regulären Zeiten gerne nach Vereinbarung.</em></p>
</div>
HTML,
            ],
            [
                'name' => 'Stellenausschreibung (witzig)',
                'content' => <<<'HTML'
<div class="job-posting">
  <h2>Gesucht: PHP-Flüsterer (m/w/d) – auch bekannt als Softwareentwickler</h2>
  <p><strong>Vollzeit · Remote möglich · Kaffeeflat inklusive</strong></p>

  <h3>Über uns</h3>
  <p>Wir sind ein dynamisches Unternehmen, das so agil ist, dass selbst unsere Kaffeemaschine Sprints macht. Unsere Meetings dauern selten länger als ein Standup – außer dem Freitagsmeeting, das irgendwie immer beim Biergarten endet.</p>

  <h3>Ihre Aufgaben</h3>
  <ul>
    <li>Code schreiben, der so sauber ist, dass Ihre Kolleginnen und Kollegen spontan weinen (vor Freude, natürlich)</li>
    <li>Bugs debuggen, die sich seit 2019 erfolgreich verstecken</li>
    <li>Technische Schulden in produktive Features umdeuten</li>
    <li>Gelegentlich an Meetings teilnehmen und dabei so tun, als hätte man die E-Mail gelesen</li>
    <li>Die Frage „Könnte man das nicht einfach mit KI machen?" souverän beantworten</li>
  </ul>

  <h3>Das bringen Sie mit</h3>
  <ul>
    <li>Mehrjährige Erfahrung mit PHP – oder zumindest eine überzeugende Geschichte darüber</li>
    <li>Kenntnisse in REDAXO, weil Sie sonst nicht hier wären</li>
    <li>Humor, Geduld und die Fähigkeit, bei „Es war doch gestern noch alles okay!" ruhig zu bleiben</li>
    <li>Teamgeist – wir arbeiten zusammen, auch wenn Git Merge-Konflikte das nicht immer so sehen</li>
  </ul>

  <h3>Das bieten wir</h3>
  <ul>
    <li>☕ Kaffee in allen erdenklichen Formen und Temperaturen</li>
    <li>🏠 Homeoffice – Ihre Katze darf am Meeting teilnehmen</li>
    <li>🎯 Flache Hierarchien (unser CTO macht selbst noch Pull Requests)</li>
    <li>🚀 Moderne Technologien (meistens)</li>
    <li>🎉 Legendäre Weihnachtsfeier, bei der sich alle fest vornehmen, früher zu gehen</li>
  </ul>

  <p><strong>Klingt gut?</strong> Dann schicken Sie uns Ihre Bewerbung – gerne mit Lebenslauf, Arbeitsproben und dem Lieblingsfehlercode, den Sie je debuggt haben.</p>
  <p>📧 <a href="mailto:jobs@musterunternehmen.de">jobs@musterunternehmen.de</a></p>
</div>
HTML,
            ],
        ];

        foreach ($demoSnippets as $snippet) {
            $ins = \rex_sql::factory();
            $ins->setTable(\rex::getTable('tinymce_snippets'));
            $ins->setValue('name', $snippet['name']);
            $ins->setValue('content', $snippet['content']);
            $ins->setValue('active', 1);
            $ins->setValue('createdate', $now);
            $ins->setValue('updatedate', $now);
            $ins->setValue('createuser', 'admin');
            $ins->setValue('updateuser', 'admin');
            try {
                $ins->insert();
            } catch (\Throwable $e) {
                \rex_logger::logException($e);
            }
        }
    }
} catch (\Throwable $e) {
    \rex_logger::logException($e);
}
