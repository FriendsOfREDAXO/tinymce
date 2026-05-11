# Entwickler-Dokumentation (Stand: aktueller AddOn-Code)

Diese Seite beschreibt nur den derzeitigen Ist-Stand des TinyMCE-AddOns.

## Architektur in Kurzform

- Profile liegen in der DB-Tabelle `rex_tinymce_profiles`.
- Die aktive Konfigurationsquelle ist ausschließlich die Spalte `profile`.
- Die Legacy-Felder `plugins`, `toolbar` und `extra` werden nicht mehr als eigene DB-Felder genutzt.
- Für Import-Kompatibilität akzeptiert der Import weiterhin Payloads mit `extra` und mappt intern auf `profile`.

## Standardprofile: zentrale JSON-Quelle

Die Datei `install/tinymce-profiles.json` ist die Single Source of Truth für die AddOn-Standardprofile.

Aktuelles Verhalten:

- **Install** (`install.php`): importiert alle Profile aus `install/tinymce-profiles.json` (ohne bestehende Profile zu überschreiben).
- **Update** (`update.php`): importiert nur das Profil `demo` aus `install/tinymce-profiles.json` mit `forceUpdate=true`.
- **Reset** (`pages/settings.php` und `pages/profile_fixer.php`): importiert alle Standardprofile aus `install/tinymce-profiles.json` mit `forceUpdate=true`.

Konsequenz: Standardprofile werden nicht mehr als große PHP-Strings im Code gepflegt.

## Demo-Profil

Kennung: `demo` (siehe `lib/TinyMce/Utils/DemoProfile.php`).

Backend-Verhalten in `pages/profiles.php`:

- Bearbeiten des Demo-Profils ist gesperrt.
- Löschen des Demo-Profils ist gesperrt.
- Duplizieren des Demo-Profils ist erlaubt (als Startpunkt für eigene Profile).

## Profile für andere AddOns bereitstellen

Empfohlen ist ein JSON-basierter Workflow.

1. Profil im Backend erstellen und exportieren.
2. JSON in das eigene AddOn legen.
3. Beim Install/Update mit `ProfileHelper::importProfileFromJson()` einspielen.

### Empfohlenes Beispiel (JSON-Import)

```php
if (rex_addon::get('tinymce')->isAvailable() && class_exists(\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::class)) {
    $jsonFile = rex_path::addon('mein_addon', 'data/tinymce_profile.json');

    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
        $jsonFile,
        false
    );
}
```

### Optional: nur bestimmte Profilnamen importieren

```php
\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
    $jsonFile,
    true,
    ['demo']
);
```

### Alternative: programmatisch via ensureProfile

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

## ProfileHelper API (aktuell)

`FriendsOfRedaxo\TinyMce\Utils\ProfileHelper`:

- `importProfileFromJson(string $filePath, bool $forceUpdate = false, array $onlyNames = []): bool`
  - Empfohlene Methode für JSON-Importe.
  - Unterstützt Einzelprofil oder Profil-Array.
  - Unterstützt Legacy-Feld `extra`.
- `ensureProfile(string $name, string $description, array $data = [], bool $forceUpdate = false): bool`
- `normalizeImportedProfile(array $profile): ?array`
- `ensureProfileFromImportedArray(array $profile, bool $forceUpdate = false): bool`
- `generateEnsureProfileCode(array $profile): string`

Wichtig: Erfolgreiche Writes triggern intern `Profiles::profilesCreate()`.

## Profil-Assistent und Protected Extras

Der Profil-Assistent unterstützt weiterhin den Round-Trip mit `Protected Extras`.

- Nicht direkt vom Assistenten verwaltete Optionen bleiben darüber erhalten.
- Extras werden beim Generieren wieder angehängt.

## Eigene TinyMCE-Plugins registrieren

Registrierung über `FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin()`:

```php
if (rex_addon::get('tinymce')->isAvailable()) {
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin(
        'mein_plugin_name',
        rex_url::addonAssets('mein_addon', 'plugin.min.js'),
        'mein_button_name'
    );
}
```

Signatur:

- `$pluginName`: interner Pluginname
- `$pluginUrl`: URL auf die Plugin-JS-Datei
- `$toolbarButton`: optionaler Toolbar-Button

Hinweise:

- `PluginRegistry` hängt automatisch Cache-Busting (`?v=...`) an.
- Registrierung schreibt in den Extension Point `TINYMCE_PROFILE_OPTIONS`.

## Extension Points

### TINYMCE_PROFILE_OPTIONS

Erweitert verfügbare Profil-Optionen (Plugins, Toolbar-Buttons, externe Plugin-URLs).

### TINYMCE_GLOBAL_OPTIONS

Wird in `Provider\Assets::provideBaseAssets()` gefeuert.
Geeignet für globale Optionen wie zusätzliche `content_css` oder `style_formats`.

## APIs im AddOn

Vorhandene API-Klassen unter `lib/`:

- `rex_api_tinymce_get_snippets`
- `rex_api_tinymce_media_upload`
- `rex_api_tinymce_media_categories`
- `rex_api_tinymce_media_meta`

## Style-Sets

- Datenquelle: `rex_tinymce_stylesets`
- Backend-Verwaltung: `pages/stylesets.php`
- Aktive Sets werden in `Provider\Assets::loadActiveStyleSets()` geladen und als globale TinyMCE-Optionen bereitgestellt.

## Build und Assets

Node-Skripte in `package.json`:

- `pnpm run vendor:copy`
- `pnpm run plugins:build`
- `pnpm run build` (staging build + sync)
- `pnpm run clean-build`

Relevante Skripte liegen unter `scripts/`:

- `build-plugins.js`
- `vendor-copy.js`
- `sync-build-to-assets.js`
- `clean-build.js`

## Bei der Weiterentwicklung helfen

Beiträge sind willkommen. Damit Änderungen gut reviewbar und stabil bleiben, halte dich an diese Leitplanken:

- Arbeite mit kleinen, fokussierten Commits (ein Thema pro Commit).
- Bevorzuge Anpassungen in `install/tinymce-profiles.json` statt harter Profil-Strings in PHP.
- Nutze für neue Profil- oder Import-Logik immer `ProfileHelper`, nicht direkte DB-Spezialwege.
- Belasse Demo-Schutzregeln intakt (`demo` darf nicht editierbar/löschbar werden).
- Registriere neue Plugins über `PluginRegistry::addPlugin()` statt über verstreute Einzel-Implementierungen.
- Lege JavaScript in Dateien unter `assets/scripts/` oder `custom_plugins/` ab, nicht inline in PHP.
- Achte auf Rückwärtskompatibilität bei Profil-Imports (`extra`-Legacy-Feld weiterhin akzeptieren).

Empfohlene lokale Checks vor einem PR/Commit:

1. PHP-Syntax prüfen (`php -l` auf geänderten Dateien).
2. Statische Analyse laufen lassen (`rexstan:analyze redaxo/src/addons/tinymce/`).
3. Bei JS- oder Plugin-Änderungen Build ausführen und erzeugte Assets prüfen.
4. Kurz im Backend testen: Profile-Liste, Preview, Import/Export, Reset, Demo-Schutz.

## Build-Prozess im Detail

Der Build besteht aus zwei Schritten: Vendor-Dateien bereitstellen und Custom-Plugins bauen/synchronisieren.

### Typische Abläufe

- Vollständiger Build:
    - `pnpm run build`
    - Führt intern `build:staging` und danach `build:sync` aus.
- Nur Plugins neu bauen:
    - `pnpm run plugins:build`
- Nur Vendor-Dateien aktualisieren:
    - `pnpm run vendor:copy`
- Aufräumen:
    - `pnpm run clean-build`

### Was die Skripte machen

- `vendor-copy.js`
    - kopiert TinyMCE-Vendor-Dateien in das AddOn-Asset-Ziel.
- `build-plugins.js`
    - baut Plugins aus `custom_plugins/*` (minifiziert/bündelt).
- `sync-build-to-assets.js`
    - synchronisiert Build-Ergebnisse in die endgültigen `assets/`-Ziele.
- `clean-build.js`
    - entfernt Build-Artefakte für einen sauberen Neuaufbau.

### Wann welcher Build nötig ist

- Änderung in `custom_plugins/*`:
    - mindestens `pnpm run plugins:build`, empfohlen `pnpm run build`.
- Änderung an Vendor-Versionen oder Vendor-Dateien:
    - `pnpm run vendor:copy`, danach empfohlen `pnpm run build`.
- Nur PHP-Logik (ohne JS/Assets):
    - kein vollständiger Node-Build zwingend, aber rexstan + kurzer Backend-Test.

## Best Practices für AddOn-Integratoren

- Nutze bevorzugt JSON-Importe über `ProfileHelper::importProfileFromJson()`.
- Prüfe vor Integrationscode immer `rex_addon::get('tinymce')->isAvailable()`.
- Verwende eindeutige Pluginnamen mit Präfix, um Kollisionen zu vermeiden.
- Verlasse dich bei Standardprofilen auf `install/tinymce-profiles.json` statt auf eigene DB-Manipulationen.
