# Entwickler-Dokumentation

Diese Seite richtet sich an Entwickler, die das TinyMCE-AddOn erweitern oder andere REDAXO-AddOns daran anschließen wollen. Sie beschreibt ausschließlich den aktuellen Aufbau.

## Inhalt

1. [Architektur im Überblick](#architektur-im-überblick)
2. [Verzeichnisstruktur](#verzeichnisstruktur)
3. [Profile](#profile)
4. [`ProfileHelper`-API](#profilehelper-api)
5. [`PluginRegistry` für Dritt-AddOns](#pluginregistry-für-dritt-addons)
6. [Custom-Plugins (`custom_plugins/*`)](#custom-plugins-custom_plugins)
7. [Build- und Asset-Pipeline](#build--und-asset-pipeline)
8. [Extension Points](#extension-points)
9. [APIs, Snippets, Style-Sets](#apis-snippets-style-sets)
10. [Layout Rules](#layout-rules)
11. [Mitwirken](#mitwirken)

---

## Architektur im Überblick

Das AddOn besteht aus vier Schichten:

| Schicht | Aufgabe | Wesentliche Dateien |
| --- | --- | --- |
| **Backend (PHP)** | Profil-Verwaltung, Style-Sets, Snippets, Profile-Assistant, APIs | `pages/`, `lib/`, `boot.php` |
| **Provider-Layer** | Generiert die TinyMCE-Assets/Optionen für Frontend und Backend | `lib/TinyMce/Provider/` |
| **Frontend-JS** | `base.js` (Bootstrap), `profile_builder.js` (Assistant), Custom-Plugins | `assets/scripts/` |
| **Vendor-JS** | Upstream TinyMCE aus dem npm-Paket `tinymce` | `assets/vendor/tinymce/` |

Profile werden zentral in der Tabelle `rex_tinymce_profiles` gehalten, ausschließlich in der Spalte `profile` (YAML-ähnlicher Optionsblock). Über den `Provider`-Layer werden die Optionen samt globaler Erweiterungen (Plugins, Snippets, Style-Sets) zu TinyMCE-Initialisierungsdaten zusammengeführt und in `base.js` an `tinymce.init(...)` übergeben.

## Verzeichnisstruktur

```
tinymce/
├── assets/
│   ├── scripts/                # Eigene JS (base.js, profile_builder.js, …)
│   │   └── tinymce/plugins/    # Build-Output der Custom-Plugins
│   └── vendor/tinymce/         # NUR upstream TinyMCE (Core, Skins, Models, Core-Plugins)
├── boot.php                    # Registriert Provider, Extension Points, Plugins
├── custom_plugins/             # Quellen der mitgelieferten Plugins (for_*, cleanpaste, …)
│   └── <name>/
│       ├── package.json        # esbuild-Setup pro Plugin
│       ├── build.js
│       └── src/main/ts/        # TypeScript-Quelle
├── install/
│   └── tinymce-profiles.json   # Single Source of Truth für Standardprofile
├── lang/                       # Sprachdateien
├── lib/                        # Backend-PHP (Provider, Renderer, Utils, APIs)
├── pages/                      # Backend-Seiten (profiles, settings, stylesets, …)
├── scripts/                    # Build-Skripte (Node)
└── package.json                # pnpm-Workspace für custom_plugins/*
```

## Profile

### Datenmodell

- Tabelle: `rex_tinymce_profiles`
- Genutzte Spalten: `name`, `description`, `profile`, Standard-Metadaten
- Die Spalte `profile` enthält den vollständigen Optionsblock im `key: value`-Format (TinyMCE-Style)

### Standardprofile

`install/tinymce-profiles.json` ist die Single Source of Truth für die mitgelieferten Profile.

| Trigger | Verhalten |
| --- | --- |
| `install.php` | importiert alle Profile, **ohne** vorhandene zu überschreiben |
| `update.php` | importiert nur das Profil `demo` mit `forceUpdate = true` |
| Reset im Backend (`pages/settings.php`, `pages/profile_fixer.php`) | importiert alle Profile mit `forceUpdate = true` |

### Demo-Profil (`demo`)

Implementierung: `lib/TinyMce/Utils/DemoProfile.php`.

- Bearbeiten: erlaubt
- Duplizieren: erlaubt (empfohlener Startpunkt für eigene Profile)
- Löschen: gesperrt (UI- und API-seitig)

### Profile aus anderen AddOns einspielen

Empfohlener Weg: JSON-Export aus dem Backend in das eigene AddOn legen und im `install.php`/`update.php` importieren.

```php
if (rex_addon::get('tinymce')->isAvailable()
    && class_exists(\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::class)
) {
    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
        rex_path::addon('mein_addon', 'data/tinymce_profile.json'),
        false // forceUpdate
    );
}
```

Optional auf bestimmte Profilnamen einschränken:

```php
\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
    $jsonFile,
    true,
    ['mein_profil']
);
```

Programmatische Variante ohne JSON-Datei:

```php
\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::ensureProfile(
    'mein_addon_profil',
    'Spezialprofil für AddOn X',
    [
        'profile' => "plugins: 'autolink lists link'\ntoolbar: 'undo redo | bold italic'",
    ],
    false
);
```

## `ProfileHelper`-API

Klasse: `FriendsOfRedaxo\TinyMce\Utils\ProfileHelper`.

| Methode | Zweck |
| --- | --- |
| `importProfileFromJson(string $filePath, bool $forceUpdate = false, array $onlyNames = []): bool` | Empfohlener Einstieg. Akzeptiert Einzel- und Sammel-Exports. |
| `ensureProfile(string $name, string $description, array $data = [], bool $forceUpdate = false): bool` | Programmatisches Anlegen/Aktualisieren. |
| `normalizeImportedProfile(array $profile): ?array` | Normalisiert Import-Payloads für das interne Schema. |
| `ensureProfileFromImportedArray(array $profile, bool $forceUpdate = false): bool` | Schreibt ein normalisiertes Profil. |
| `generateEnsureProfileCode(array $profile): string` | Generiert ein PHP-Snippet für `ensureProfile()`-Aufrufe (z. B. für eigene Installer). |

Erfolgreiche Schreibvorgänge triggern intern `Profiles::profilesCreate()`, sodass Caches und abgeleitete Strukturen aktualisiert werden.

## `PluginRegistry` für Dritt-AddOns

Andere REDAXO-AddOns können eigene TinyMCE-Plugins beisteuern, ohne sie in dieses AddOn einzuchecken. Die Registrierung erfolgt in der `boot.php` des Fremd-AddOns.

```php
if (rex_addon::get('tinymce')->isAvailable()
    && class_exists(\FriendsOfRedaxo\TinyMce\PluginRegistry::class)
) {
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin(
        'mein_addon_plugin',                                                     // Pluginname (eindeutig, präfixen!)
        rex_url::addonAssets('mein_addon', 'mein_addon_plugin/plugin.min.js'),   // URL zur JS-Datei
        'mein_addon_button'                                                      // optional: Toolbar-Button
    );
}
```

Verhalten:

- `PluginRegistry` hängt automatisch einen Cache-Buster `?v=<addon-version>` an die URL.
- Der Eintrag landet als `external_plugins`-Eintrag in der TinyMCE-Init-Konfiguration.
- In `base.js` werden `external_plugins` gegen die `plugins`-Liste des aktiven Profils gefiltert — ein Plugin wird also nur initialisiert, wenn es im Profil auch tatsächlich aktiviert ist.
- Im Profil müssen Pluginname (`plugins: '… mein_addon_plugin'`) und optional Buttonname (`toolbar: '… mein_addon_button'`) ergänzt werden.

Minimal-Plugin (JS):

```javascript
tinymce.PluginManager.add('mein_addon_plugin', function (editor) {
    editor.ui.registry.addButton('mein_addon_button', {
        text: 'Mein Button',
        onAction: function () {
            editor.insertContent('<p>Hallo</p>');
        }
    });
});
```

Konventionen:

- Pluginnamen immer mit AddOn-Präfix (`mein_addon_*`), um Kollisionen mit Core- und `for_*`-Plugins zu vermeiden.
- Kein Inline-JS in PHP-Strings — Plugins liegen als eigene Dateien im Asset-Baum des AddOns.

## Custom-Plugins (`custom_plugins/*`)

Die mitgelieferten Custom-Plugins (`for_a11y`, `for_abbr`, `for_chars_symbols`, `for_checklist`, `for_footnotes`, `for_htmlembed`, `for_images`, `for_markdown`, `for_oembed`, `for_toc`, `for_video`, `cleanpaste`, `link_yform`, `mediapaste`, `phonelink`, `quote`, `snippets`) leben jeweils als eigenständige Pakete unter `custom_plugins/`.

### Aufbau eines Custom-Plugins

```
custom_plugins/<name>/
├── package.json              # Build-Konfig (esbuild)
├── build.js                  # Entry-Point-Build
├── src/main/ts/
│   ├── Main.ts               # Bindet Plugin.ts an `tinymce.PluginManager.add(...)`
│   └── Plugin.ts             # Implementierung (Setup-Funktion)
└── dist/<name>/              # Build-Output (plugin.js, plugin.min.js)
```

### Wichtig: Bundling-Konvention

`Plugin.ts` exportiert ausschließlich die TinyMCE-Setup-Funktion (`export default (): void => { … }`). **Erst `Main.ts` ruft `tinymce.PluginManager.add(...)`** auf — daher muss `build.js` jedes Plugins `Main.ts` als Entry verwenden, nicht direkt `Plugin.ts`. Wird das ignoriert, registriert sich das Plugin zur Laufzeit nicht.

### Lokale Plugin-Entwicklung

```bash
# Einzelnes Plugin bauen
cd custom_plugins/for_images
node build.js
```

Der Output liegt in `dist/<name>/`. Für den Live-Test im AddOn müssen die Dateien zusätzlich in den Asset-Baum (`assets/scripts/tinymce/plugins/<name>/`) gespiegelt werden — das erledigt regulär `pnpm run build` (siehe nächster Abschnitt).

## Build- und Asset-Pipeline

Voraussetzung: `pnpm` ist installiert. Das AddOn ist ein pnpm-Workspace mit den Custom-Plugins als Sub-Pakete.

### Skripte (`package.json`)

| Befehl | Wirkung |
| --- | --- |
| `pnpm install` | Installiert Abhängigkeiten und führt automatisch `vendor:copy` aus (`postinstall`). |
| `pnpm run vendor:copy` | Kopiert `node_modules/tinymce` → `assets/vendor/tinymce/`. |
| `pnpm run plugins:build` | Baut alle `custom_plugins/*` und legt die Ergebnisse in `assets/scripts/tinymce/plugins/<name>/` ab. |
| `pnpm run build:verify` | Prüft den Build-Zustand: Für jedes `custom_plugins/<name>` müssen `assets/scripts/tinymce/plugins/<name>/plugin.js` und `plugin.min.js` existieren; zusätzlich werden verbotene Custom-Plugin-Dubletten im Vendor-Pfad erkannt. |
| `pnpm run build` | Vollständiger Staged-Build: Vendor + Plugins werden zuerst nach `build/` gebaut, danach via `build:sync` in den Asset-Baum gespiegelt und abschließend mit `build:verify` validiert. |
| `pnpm run clean-build` | Räumt `build/` auf und entfernt versehentlich im Vendor-Baum gelandete Custom-Plugin-Ordner. |
| `pnpm run clean-plugins` | Löscht die Build-Ergebnisse der Custom-Plugins. |

### Asset-Layout (verbindlich)

| Pfad | Inhalt | Eigentümer-Skript |
| --- | --- | --- |
| `assets/vendor/tinymce/` | **Nur** upstream TinyMCE (Core, Themes, Icons, Models, Skins, Core-Plugins) | `scripts/vendor-copy.js` |
| `assets/scripts/tinymce/plugins/` | Alle Custom-Plugins dieses AddOns | `scripts/build-plugins.js` (+ `sync-build-to-assets.js`) |
| `external_plugins` (extern) | Per `PluginRegistry::addPlugin()` von Fremd-AddOns angemeldete URLs | — |

**Regel:** Niemals Custom-Plugins nach `assets/vendor/tinymce/plugins/` legen. Dieser Pfad wird bei jedem `vendor:copy` aus `node_modules` aufgefrischt — eigene Dateien dort gingen verloren bzw. blieben als veraltete Dubletten liegen.

### Skripte unter `scripts/`

- `vendor-copy.js` — kopiert `node_modules/tinymce` in den Vendor-Baum (im Staging nach `build/vendor/tinymce/`). Berührt sonst nichts.
- `build-plugins.js` — iteriert über `custom_plugins/*`, ruft pro Plugin den lokalen Build auf und schreibt das Ergebnis ausschließlich in den Custom-Plugin-Asset-Pfad. Optional `--clean`, um alte Builds zu entfernen.
- `sync-build-to-assets.js` — spiegelt `build/vendor/tinymce/` → `assets/vendor/tinymce/` und `build/plugins/` → `assets/scripts/tinymce/plugins/`. Keine Cross-Kopien.
- `clean-build.js` — entfernt `build/` und löscht in `assets/vendor/tinymce/plugins/` alle Unterordner, deren Namen einem Eintrag in `custom_plugins/` entsprechen.

### CI-Build

```bash
pnpm install
pnpm run build
```

Der Plugin-Build ist absichtlich strikt: Schlägt ein Plugin-Build fehl oder fehlen danach `plugin.js`/`plugin.min.js`, endet der Build mit Exit-Code `1`.

Sanity-Check danach:

```bash
ls assets/vendor/tinymce/plugins/   # darf KEINE Namen aus custom_plugins/ enthalten
ls assets/scripts/tinymce/plugins/  # muss alle Custom-Plugins enthalten
```

## Extension Points

### `TINYMCE_PROFILE_OPTIONS`

Erweitert die im Profil-Assistant verfügbaren Plugins, Toolbar-Buttons und externen Plugin-URLs. Wird von `PluginRegistry` selbst genutzt, kann aber auch direkt angesteuert werden.

### `TINYMCE_GLOBAL_OPTIONS`

Wird in `Provider\Assets::provideBaseAssets()` gefeuert. Geeignet für globale Optionen wie zusätzliche `content_css`, `style_formats`, `font_family_formats` etc.

### `TINY_PROFILE_CLONE`

Wird nach dem Duplizieren eines Profils im Backend gefeuert.

- Subject: neue Profil-ID (`int`)

```php
rex_extension::register('TINY_PROFILE_CLONE', static function (rex_extension_point $ep) {
    $newProfileId = (int) $ep->getSubject();
    // …
});
```

### `TINY_PROFILE_DELETE`

Wird nach dem Löschen eines Profils gefeuert.

- Subject: gelöschte Profil-ID (`int`)

## APIs, Snippets, Style-Sets

### `rex_api_function`-Klassen unter `lib/`

| API | Zweck |
| --- | --- |
| `rex_api_tinymce_get_snippets` | Liefert die im Backend gepflegten Snippets als JSON. |
| `rex_api_tinymce_media_upload` | Direkt-Upload aus dem Editor in den Medienpool. |
| `rex_api_tinymce_media_categories` | Listet Medienpool-Kategorien für Pickers. |
| `rex_api_tinymce_media_meta` | Liefert Metadaten zu einem Medienpool-Eintrag. |

### Snippets

- Datenquelle: Backend-Pflegeoberfläche
- Auslieferung: `rex_api_tinymce_get_snippets` (vom `snippets`-Plugin konsumiert)

### Style-Sets

- Datenquelle: `rex_tinymce_stylesets`
- Backend-Verwaltung: `pages/stylesets.php`
- Aktive Sets werden in `Provider\Assets::loadActiveStyleSets()` geladen und global als `style_formats`/`content_style` an TinyMCE übergeben.

## Layout Rules

Layout Rules sind ein nicht-invasives Korrektursystem im `base.js`, das beim Setzen oder Einfügen von Inhalt typische Strukturprobleme glättet. Sie werden pro Profil über Optionen aktiviert.

### Regeln

| Schlüssel | Wirkung |
| --- | --- |
| `for_layout_rules_no_images_in_headings` | Bilder (`img`/`figure`/`picture`) innerhalb `h1`–`h6` werden vor die Überschrift verschoben. |
| `for_layout_rules_collapse_empty_paragraphs` | ≥ 2 aufeinanderfolgende leere `<p>` werden zu einem `<div>` mit der konfigurierten Clear-Klasse zusammengefasst. |
| `for_layout_rules_convert_lines_to_hr` | Reihen aus Minuszeichen (`---`, `----`, …) in einem `<p>` werden zu `<hr>` mit konfigurierter Klasse. |
| (implizit) | Einzelne leere `<p>` am Anfang/Ende des Dokuments werden entfernt. |

### Konfigurations-Optionen

| Option | Standard |
| --- | --- |
| `for_layout_rules_no_images_in_headings` | `true` |
| `for_layout_rules_collapse_empty_paragraphs` | `false` |
| `for_layout_rules_convert_lines_to_hr` | `false` |
| `for_layout_rules_clear_element_class` | `uk-margin` |
| `for_layout_rules_hr_class` | `uk-divider-icon` |

### Beispielprofil

```text
plugins: 'autolink lists link'
toolbar: 'undo redo | bold italic'
for_layout_rules_no_images_in_headings: true
for_layout_rules_collapse_empty_paragraphs: true
for_layout_rules_convert_lines_to_hr: true
for_layout_rules_clear_element_class: 'uk-margin'
for_layout_rules_hr_class: 'uk-divider-icon'
```

Für nicht-UIkit-Setups einfach die beiden Klassen-Optionen auf das eigene Design-System mappen (z. B. Bootstrap: `my-spacer`/`my-divider`).

### Profile-Assistant

Der Profile-Assistant zeigt Layout Rules unter „Erweiterte Optionen → Layout-Regeln“ als Checkbox-Form mit zwei Textfeldern für die CSS-Klassen. Die mitgelieferten Presets (Simple / Standard / Full) setzen sinnvolle Default-Kombinationen.

## Mitwirken

Beiträge sind willkommen. Bitte halte dich an die folgenden Leitplanken — sie machen Reviews schnell und Releases stabil.

### Stilregeln

- Kleine, fokussierte Commits (ein Thema pro Commit).
- Standardprofile **ausschließlich** in `install/tinymce-profiles.json` pflegen, nie als PHP-String inline.
- Profil-/Import-Logik immer über `ProfileHelper` führen, nicht über direkte SQL-Manipulation.
- Demo-Schutzregeln (`demo` nicht löschbar) intakt lassen.
- Dritt-Plugins **ausschließlich** via `PluginRegistry::addPlugin()` registrieren.
- JavaScript gehört in Dateien unter `assets/scripts/` oder `custom_plugins/`, niemals als Inline-String in PHP.
- Custom-Plugins niemals nach `assets/vendor/tinymce/` legen.

### Lokale Checks vor einem PR

1. PHP-Syntax: `find redaxo/src/addons/tinymce -name "*.php" -print0 | xargs -0 -n1 php -l`
2. Statische Analyse: `php redaxo/bin/console rexstan:analyze redaxo/src/addons/tinymce/`
3. Bei JS-/Plugin-Änderungen: `pnpm run build` ausführen und prüfen, dass nur erwartete Dateien geändert wurden.
4. Im Backend smoke-testen: Profile-Liste, Preview, Import/Export, Reset, Demo-Schutz, Profile-Assistant.

### Release-relevante Dateien

- `package.yml` (Version)
- `CHANGELOG.md` (Eintrag pro Release)
- `install/tinymce-profiles.json` (bei Profil-Änderungen am `demo`-Profil)
