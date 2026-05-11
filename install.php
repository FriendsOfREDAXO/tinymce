<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// ensure schema (include a plain PHP file — safe during install/update)
$this->includeFile(__DIR__ . '/ensure_table.php');

// =============================================================================
// Migration: imagewidth -> for_images (v8.2.0)
// Only runs if legacy columns still exist (pre-8.8.2 upgrades via reinstall).
// =============================================================================
if (\rex_sql_table::get(rex::getTable('tinymce_profiles'))->hasColumn('plugins')) {
    try {
        $migrateSql = rex_sql::factory();
        $profiles = $migrateSql->getArray('SELECT id, plugins, toolbar, extra FROM ' . rex::getTable('tinymce_profiles'));

        foreach ($profiles as $profile) {
            $needsUpdate = false;
            $plugins = (string) $profile['plugins'];
            $toolbar = (string) $profile['toolbar'];
            $extra = (string) $profile['profile'];

            if (str_contains($plugins, 'imagewidth')) {
                $plugins = str_replace('imagewidth', 'for_images', $plugins);
                $needsUpdate = true;
            }
            if (str_contains($toolbar, 'imagewidthdialog')) {
                $toolbar = str_replace('imagewidthdialog', 'for_images', $toolbar);
                $needsUpdate = true;
            }
            if (str_contains($toolbar, 'imagewidth')) {
                $toolbar = str_replace('imagewidth', 'for_images', $toolbar);
                $needsUpdate = true;
            }
            if (str_contains($extra, 'imagewidth')) {
                $extra = str_replace('imagewidth', 'for_images', $extra);
                $needsUpdate = true;
            }

            if ($needsUpdate) {
                $updateSql = rex_sql::factory();
                $updateSql->setTable(rex::getTable('tinymce_profiles'));
                $updateSql->setWhere(['id' => (int) $profile['id']]);
                $updateSql->setValue('plugins', $plugins);
                $updateSql->setValue('toolbar', $toolbar);
                $updateSql->setValue('profile', $extra);
                $updateSql->setValue('updatedate', date('Y-m-d H:i:s'));
                $updateSql->update();
            }
        }
    } catch (rex_sql_exception $e) {
        // Ignore - migration is best-effort
    }
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
		// Create three default profiles (id 1..3)
		$now = date('Y-m-d H:i:s');

		$extra1 = <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save link_yform phonelink quote snippets',
toolbar: 'blocks | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample fontsize align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime | link_yform phonelink quote snippets',
height: 400,

image_caption: true,
image_uploadtab: false,
relative_urls : false,
remove_script_host : true,
document_base_url : "/",
entity_encoding: 'raw',
convert_urls : true,

codesample_languages: [
 {text: 'HTML/XML', value: 'markup'},
 {text: 'JavaScript', value: 'javascript'},
 {text: 'CSS', value: 'css'},
 {text: 'PHP', value: 'php'},
 {text: 'Ruby', value: 'ruby'},
 {text: 'Python', value: 'python'},
 {text: 'Java', value: 'java'},
 {text: 'C', value: 'c'},
 {text: 'C#', value: 'csharp'},
 {text: 'C++', value: 'cpp'}
],
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_quicklink: false,
quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
link_attributes_postprocess: function (attrs) {
 if (!attrs || attrs.target !== '_blank') { return; }
 var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
 if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
 if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
 attrs.rel = rel.join(' ');
},

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",

toc_depth: 3,
toc_header: "div",
toc_class: "our-toc",

file_picker_callback: function (callback, value, meta) {
 rex5_picker_function(callback, value, meta);
}
EXTRA;

		$extra2 = <<<'EXTRA'
license_key: 'gpl',
relative_urls : false,
remove_script_host : true,
document_base_url : '/',
convert_urls : true,
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_quicklink: false,
quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
link_attributes_postprocess: function (attrs) {
 if (!attrs || attrs.target !== '_blank') { return; }
 var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
 if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
 if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
 attrs.rel = rel.join(' ');
},
language: 'de',
allow_script_urls: true,
branding: false,
statusbar: true,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'autolink directionality visualblocks visualchars fullscreen image link media charmap pagebreak nonbreaking code',
toolbar: 'blocks |  bold italic subscript superscript | blockquote bullist numlist | charmap nonbreaking | link unlink | image | removeformat code | undo redo | cut copy paste pastetext wordcount',
height: 400,
charmap_append: [
 [160, 'no-break space'],
 [173, 'soft hyphen']
],
paste_as_text: true,
entity_encoding: 'raw',
style_formats: [
 {title: 'Überschriften', items: [
   {title: 'Überschrift 1', format: 'h1'},
   {title: 'Überschrift 2', format: 'h2'},
   {title: 'Überschrift 3', format: 'h3'},
   {title: 'Überschrift 4', format: 'h4'},
   {title: 'Überschrift 5', format: 'h5'}
 ]}
]

EXTRA;

		$extra3 = <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample charmap nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code link_yform phonelink quote',
toolbar1: 'undo redo | cut copy paste pastetext | bold italic underline strikethrough subscript superscript removeformat | link anchor | image emoticons charmap nonbreaking | link_yform phonelink quote',
toolbar2: 'blocks | fontsize | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | code fullscreen searchreplace',
height: 400,
image_caption: true,
image_uploadtab: false,
entity_encoding: 'raw',
relative_urls : false,
remove_script_host : true,
document_base_url : "/",
convert_urls : true,
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'},
 {title: 'Sponsored', value: 'sponsored'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_quicklink: false,
quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
link_attributes_postprocess: function (attrs) {
 if (!attrs || attrs.target !== '_blank') { return; }
 var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
 if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
 if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
 attrs.rel = rel.join(' ');
},
file_picker_callback: function (callback, value, meta) {
 rex5_picker_function(callback, value, meta);
},
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
EXTRA;

		$defaults = [
			[
				'id' => 1,
				'name' => 'full',
				'description' => 'Full featured example',
				'extra' => $extra1,
			],
			[
				'id' => 2,
				'name' => 'light',
				'description' => 'Small featured example',
				'extra' => $extra2,
			],
			[
				'id' => 3,
				'name' => 'default',
				'description' => 'Standard featured example',
				'extra' => $extra3,
			],
		];

		foreach ($defaults as $p) {
			$ins = \rex_sql::factory();
			$ins->setTable(\rex::getTable('tinymce_profiles'));
			$ins->setValue('id', $p['id']);
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
		['extra' => \FriendsOfRedaxo\TinyMce\Utils\DemoProfile::getExtra()],
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
