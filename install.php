<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// ensure schema (include a plain PHP file — safe during install/update)
$this->includeFile(__DIR__ . '/ensure_table.php');

// =============================================================================
// Migration: imagewidth -> for_images (v8.2.0)
// =============================================================================
try {
    $migrateSql = rex_sql::factory();
    $profiles = $migrateSql->getArray('SELECT id, plugins, toolbar, extra FROM ' . rex::getTable('tinymce_profiles'));

    foreach ($profiles as $profile) {
        $needsUpdate = false;
        $plugins = (string) $profile['plugins'];
        $toolbar = (string) $profile['toolbar'];
        $extra = (string) $profile['extra'];

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
            $updateSql->setValue('extra', $extra);
            $updateSql->setValue('updatedate', date('Y-m-d H:i:s'));
            $updateSql->update();
        }
    }
} catch (rex_sql_exception $e) {
    // Ignore - table might not exist yet on fresh install
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
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],

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
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
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
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'},
 {title: 'Sponsored', value: 'sponsored'}
],
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
			$ins->setValue('extra', $p['extra']);
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
