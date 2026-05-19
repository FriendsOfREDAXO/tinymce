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

- Bearbeiten des Demo-Profils ist erlaubt.
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

## Eigene Plugins erstellen und über eigenes AddOn anmelden

Der typische Integrationsweg besteht aus drei Schritten.

1. Plugin-JS im eigenen AddOn bereitstellen (z. B. unter `assets/`).
2. Plugin in der `boot.php` des eigenen AddOns über `PluginRegistry::addPlugin()` registrieren.
3. Pluginname in einem TinyMCE-Profil aktivieren (`plugins: '...'`) und optional den Button in die Toolbar aufnehmen.

### 1) Plugin-Datei erstellen (im eigenen AddOn)

Minimalbeispiel für eine Plugin-Datei:

```javascript
(function () {
    'use strict';

    tinymce.PluginManager.add('mein_addon_plugin', function (editor) {
        editor.ui.registry.addButton('mein_addon_button', {
            text: 'Mein Button',
            onAction: function () {
                editor.insertContent('<p>Hallo aus meinem Plugin</p>');
            }
        });
    });
})();
```

### 2) Registrierung in der boot.php des eigenen AddOns

```php
if (rex_addon::get('tinymce')->isAvailable() && class_exists(\FriendsOfRedaxo\TinyMce\PluginRegistry::class)) {
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin(
        'mein_addon_plugin',
        rex_url::addonAssets('mein_addon', 'mein_addon_plugin/plugin.min.js'),
        'mein_addon_button'
    );
}
```

Signatur von `addPlugin(...)`:

- `$pluginName`: interner TinyMCE-Pluginname (muss eindeutig sein)
- `$pluginUrl`: URL zur Plugin-JS-Datei
- `$toolbarButton`: optionaler Toolbar-Buttonname

### 3) Plugin im Profil aktivieren

Die Registrierung macht ein Plugin verfügbar, aktiviert es aber nicht automatisch in jedem Profil.

- Im Profil muss der Name in `plugins` enthalten sein.
- Falls gewünscht, muss der Button zusätzlich in der Toolbar vorkommen.

Beispiel im Profilblock:

```text
plugins: 'autolink link mein_addon_plugin',
toolbar: 'undo redo | bold italic | mein_addon_button'
```

Wichtige Hinweise:

- Nutze einen Präfix im Pluginnamen (z. B. `mein_addon_*`), um Kollisionen zu vermeiden.
- `PluginRegistry` hängt automatisch Cache-Busting (`?v=...`) an die Plugin-URL.
- Intern wird über den Extension Point `TINYMCE_PROFILE_OPTIONS` registriert.

## Extension Points

### TINYMCE_PROFILE_OPTIONS

Erweitert verfügbare Profil-Optionen (Plugins, Toolbar-Buttons, externe Plugin-URLs).

### TINYMCE_GLOBAL_OPTIONS

Wird in `Provider\Assets::provideBaseAssets()` gefeuert.
Geeignet für globale Optionen wie zusätzliche `content_css` oder `style_formats`.

### TINY_PROFILE_CLONE

Wird nach dem Duplizieren eines Profils in der Backend-UI gefeuert.

- Subject: neue Profil-ID (`int`)

Beispiel:

```php
rex_extension::register('TINY_PROFILE_CLONE', static function (rex_extension_point $ep) {
    $newProfileId = (int) $ep->getSubject();
    rex_logger::factory()->log('info', 'Profil geklont: ' . $newProfileId);
});
```

### TINY_PROFILE_DELETE

Wird nach dem Löschen eines Profils gefeuert.

- Subject: gelöschte Profil-ID (`int`)

Beispiel:

```php
rex_extension::register('TINY_PROFILE_DELETE', static function (rex_extension_point $ep) {
    $deletedProfileId = (int) $ep->getSubject();
    // Eigene Cleanup-Logik
});
```

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
- Belasse Demo-Schutzregeln intakt (`demo` darf nicht löschbar werden).
- Registriere neue Plugins über `PluginRegistry::addPlugin()` statt über verstreute Einzel-Implementierungen.
- Lege JavaScript in Dateien unter `assets/scripts/` oder `custom_plugins/` ab, nicht inline in PHP.
- Achte auf Rückwärtskompatibilität bei Profil-Imports (`extra`-Legacy-Feld weiterhin akzeptieren).

Empfohlene lokale Checks vor einem PR/Commit:

1. PHP-Syntax prüfen (`php -l` auf geänderten Dateien).
2. Statische Analyse laufen lassen (`rexstan:analyze redaxo/src/addons/tinymce/`).
3. Bei JS- oder Plugin-Änderungen Build ausführen und erzeugte Assets prüfen.
4. Kurz im Backend testen: Profile-Liste, Preview, Import/Export, Reset, Demo-Schutz.

## Build-Prozess im Detail

Der Build besteht aus zwei klar getrennten Strängen: TinyMCE-Core (Vendor) und Custom-Plugins. **Die beiden Asset-Bäume dürfen sich nicht überlappen.**

### Asset-Layout (verbindlich)

| Verzeichnis | Inhalt | Quelle | Eigentümer-Skript |
| --- | --- | --- | --- |
| `assets/vendor/tinymce/` | NUR upstream TinyMCE aus dem npm-Paket `tinymce` (Core, Themes, Icons, Models, Skins, Core-Plugins) | `node_modules/tinymce` | `scripts/vendor-copy.js` |
| `assets/scripts/tinymce/plugins/` | Alle Custom-Plugins dieses AddOns (Build-Output aus `custom_plugins/*`) | `custom_plugins/<name>/` | `scripts/build-plugins.js` + per-plugin `build-copy` |
| Externe Plugins anderer AddOns | werden zur Laufzeit über `PluginRegistry::addPlugin()` als `external_plugins`-URL registriert | – | – |

**Regel:** Niemals Custom-Plugins nach `assets/vendor/tinymce/plugins/` kopieren. Dieser Pfad ist reserviert für upstream Core-Plugins. Andernfalls überschreibt das nächste `vendor:copy` Custom-Dateien, und es entstehen Dubletten mit divergierenden Cache-Bustern.

### Typische Abläufe

- Vollständiger Build: `pnpm run build` (führt intern `build:staging` und `build:sync` aus)
- Nur Custom-Plugins: `pnpm run plugins:build`
- Nur Vendor: `pnpm run vendor:copy`
- Aufräumen: `pnpm run clean-build` (löscht `build/` und räumt versehentlich im Vendor-Baum gelandete Custom-Plugin-Ordner auf)

### Was die Skripte machen

- `vendor-copy.js`: kopiert `node_modules/tinymce` nach `assets/vendor/tinymce/` (bzw. `build/vendor/tinymce/` im Staging). Fasst sonst nichts an.
- `build-plugins.js`: iteriert über `custom_plugins/*`, ruft pro Plugin `pnpm run build` auf und kopiert das Ergebnis ausschließlich nach `assets/scripts/tinymce/plugins/<name>/` (bzw. `build/plugins/<name>/`). Schreibt nie in den Vendor-Baum.
- `sync-build-to-assets.js`: spiegelt `build/vendor/tinymce/` → `assets/vendor/tinymce/` und `build/plugins/` → `assets/scripts/tinymce/plugins/`. Keine Cross-Kopien.
- `clean-build.js`: entfernt `build/` und löscht in `assets/vendor/tinymce/plugins/` alle Unterordner, deren Namen einem Eintrag in `custom_plugins/` entsprechen (Altlast-Cleanup).

### CI-Hinweis

`pnpm install && pnpm run build`. Sanity-Check danach: `assets/vendor/tinymce/plugins/` darf KEINE Namen aus `custom_plugins/` enthalten.

## Best Practices für AddOn-Integratoren

- Nutze bevorzugt JSON-Importe über `ProfileHelper::importProfileFromJson()`.
- Prüfe vor Integrationscode immer `rex_addon::get('tinymce')->isAvailable()`.
- Verwende eindeutige Pluginnamen mit Präfix, um Kollisionen zu vermeiden.
- Verlasse dich bei Standardprofilen auf `install/tinymce-profiles.json` statt auf eigene DB-Manipulationen.

## Layout Rules (Strukturoptimierung)

Layout Rules sind ein **nicht-invasives Content-Korrektur-System**, das automatisch häufige HTML-Struktur-Probleme korrigiert. Sie greifen stilschweigend ein und arbeiten mit dem Design-System (z.B. UIkit) zusammen.

### Die 4 Regeln

#### 1. `no_images_in_headings` — Bilder aus Überschriften verschieben

**Was macht es:**
- Erkennt Bilder (`<img>`, `<figure>`, `<picture>`), die direkt in Überschriften (h1–h6) sind
- Bewegt die Elemente automatisch **vor** die Überschrift (nicht invasiv, nur Repositionierung)

**Beispiel (vorher):**
```html
<h2>
  <img src="image.jpg" alt="..." />
  Überschrift
</h2>
```

**Beispiel (nachher):**
```html
<img src="image.jpg" alt="..." />
<h2>Überschrift</h2>
```

**Use-Case:** Verhindert ungültige HTML-Struktur und visuelle Probleme in responsiven Designs.

#### 2. `collapse_empty_paragraphs` — Mehrfache Leerzeilen zusammenfassen

**Was macht es:**
- Erkennt 2+ hintereinander folgende leere `<p>`-Tags
- Ersetzt sie durch ein einzelnes `<div>` mit einer konfigurationsfähigen CSS-Klasse (z.B. `uk-margin`)

**Beispiel (vorher):**
```html
<p>Text</p>
<p></p>
<p></p>
<p>Mehr Text</p>
```

**Beispiel (nachher, mit `uk-margin`):**
```html
<p>Text</p>
<div class="uk-margin"></div>
<p>Mehr Text</p>
```

**Use-Case:** 
- Semantisch korrektere HTML-Struktur (keine leeren `<p>` mehr)
- Visuelle Konsistenz durch Design-System-Abstände

**Konfiguration:** über `for_layout_rules_clear_element_class` (Standard: `uk-margin`)

#### 3. `convert_lines_to_hr` — Minus-Linien in Trennlinien konvertieren

**Was macht es:**
- Erkennt Minuszeichen-Reihen (`---`, `----`, etc.) in `<p>`-Tags
- Ersetzt sie durch semantische `<hr>`-Elemente mit konfigurierter CSS-Klasse (z.B. `uk-divider-icon`)

**Beispiel (vorher):**
```html
<p>Text</p>
<p>----</p>
<p>Mehr Text</p>
```

**Beispiel (nachher, mit `uk-divider-icon`):**
```html
<p>Text</p>
<hr class="uk-divider-icon" />
<p>Mehr Text</p>
```

**Use-Case:**
- Typografische Konvention: Editor-Nutzer tippen `----` und bekommen ein semantisches HTML-Element
- Verknüpfung mit Design-System für konsistente Visualisierung

**Konfiguration:** über `for_layout_rules_hr_class` (Standard: `uk-divider-icon`)

#### 4. (Implizit) — Leere Paragraphen am Anfang/Ende entfernen

**Was macht es:**
- Räumt einzelne leere `<p>`-Tags am Anfang und Ende des Dokuments auf
- Teil der `applyLayoutRules()`-Logik, aber separat von Regel 2

**Use-Case:** Vermeidung von unnötigen Whitespace-Elementen nach Paste/Import.

### Konfiguration in TinyMCE-Profilen

Layout Rules werden über Profil-Optionen aktiviert:

```javascript
// Komplettes Beispiel
for_layout_rules_no_images_in_headings: true,
for_layout_rules_collapse_empty_paragraphs: true,
for_layout_rules_convert_lines_to_hr: true,
for_layout_rules_clear_element_class: 'uk-margin',
for_layout_rules_hr_class: 'uk-divider-icon'
```

**Hinweis:** Alle Layout Rules sind **optional**. Wenn nicht angegeben, gelten Defaults:
- `no_images_in_headings`: immer aktiv (Basis-Struktur-Validität)
- `collapse_empty_paragraphs`: false (nur in Standard/Full Presets aktiv)
- `convert_lines_to_hr`: false (optional, muss explizit aktiviert werden)
- `clear_element_class`: `'uk-margin'` (Standard UIkit-Klasse)
- `hr_class`: `'uk-divider-icon'` (Standard UIkit-Klasse)

### Profile Assistant Integration

Der Profile Assistant bietet eine **benutzerfreundliche Checkbox-Form** für Layout Rules:

1. **Reiter "Erweiterte Optionen"** → Abschnitt "Layout-Regeln"
2. Vier Checkboxen für Regel-Aktivierung
3. Zwei Textfelder für CSS-Klassen

#### Intelligente Presets

Die Presets stellen sinnvolle Defaults ein:

| Preset | `no_images` | `collapse_empty` | `convert_lines` | Clear-Klasse | HR-Klasse |
|--------|-----------|-----------------|-----------------|-------------|-----------|
| **Simple** | ✓ | – | – | `uk-margin` | `uk-divider-icon` |
| **Standard** | ✓ | ✓ | ✓ | `uk-margin` | `uk-divider-icon` |
| **Full** | ✓ | ✓ | ✓ | `uk-margin-medium` | `uk-divider-icon` |

- **Simple:** Nur Basis-Struktur-Sicherheit (Bilder aus Headings)
- **Standard:** Ausbalanciert für typische Content-Anforderungen
- **Full:** Maximale Korrektur, größere vertikale Abstände via `uk-margin-medium`

### Implementierungsdetails

#### Location: `assets/scripts/base.js`

```javascript
// ~Zeile 841-930

// Layout Rules Konfiguration
var layoutRules = {
  no_images_in_headings: options.for_layout_rules_no_images_in_headings ?? true,
  collapse_empty_paragraphs: options.for_layout_rules_collapse_empty_paragraphs ?? false,
  clear_element_class: options.for_layout_rules_clear_element_class ?? 'uk-margin',
  convert_lines_to_hr: options.for_layout_rules_convert_lines_to_hr ?? false,
  hr_class: options.for_layout_rules_hr_class ?? 'uk-divider-icon'
};

// Hauptfunktion: applyLayoutRules(html)
// - Nutzt DOMParser für robuste DOM-Manipulation
// - Regel 1: Bilder vor h1–h6 verschieben
// - Regel 2: Mehrfache leere <p> → Clear-Div
// - Regel 3: Minus-Reihen → <hr>
// - Regel 4: Leere <p> am Anfang/Ende entfernen
```

**Event-Handler:**
```javascript
editor.on('SetContent BeforeSetContent', function(e) {
  var modified = applyLayoutRules(e.content);
  if (modified) {
    e.content = modified;
  }
});
```

Regeln gelten beim:
- **Laden** von Inhalt (SetContent, BeforeSetContent)
- **Einfügen** von Content (Paste)
- **Speichern** (transparent für Frontend)

#### Profile Assistant Integration

Location: `redaxo/src/addons/tinymce/assets/scripts/profile_builder.js`

- **UI-Form:** Checkboxen und Textfelder nach Image-Width-Legende (~Zeile 249–263)
- **generateConfig():** Schreibt Layout-Rule-Optionen in Textarea (~Zeile 2730–2754)
- **loadFromConfig():** Parst Layout-Rule-Optionen aus Konfig (~Zeile 3125–3145)
- **MANAGED_PROFILE_KEYS:** Registriert 6 neue Keys für Tracking

#### Sprachstrings

**Deutsch (`lang/de_de.lang`):**
```
tinymce_layout_rules = Layout-Regeln (Strukturoptimierung)
tinymce_layout_rules_help = Automatische Korrektur von häufigen Content-Struktur-Problemen.
tinymce_layout_no_images_in_headings = Bilder aus Überschriften verschieben
tinymce_layout_no_images_in_headings_help = Bilder in h1-h6 werden davor platziert.
tinymce_layout_collapse_empty = Mehrfache Leerzeilen zusammenfassen
tinymce_layout_collapse_empty_help = Mehrere hintereinander folgende leere <p> werden durch ein Clear-Element ersetzt.
tinymce_layout_delete_empty = Einzelne leere Absätze löschen
tinymce_layout_delete_empty_help = Entfernt einzelne leere <p> am Anfang und Ende.
tinymce_layout_lines_to_hr = Minus-Linien → Trennlinie (----)
tinymce_layout_lines_to_hr_help = Mehrere Minuszeichen werden zu <hr> umgewandelt.
tinymce_layout_clear_element = Clear-Element CSS-Klasse
tinymce_layout_hr_class = Trennlinien CSS-Klasse
```

**Englisch (`lang/en_gb.lang`):**
```
tinymce_layout_rules = Layout rules (structure optimization)
tinymce_layout_rules_help = Automatic correction of common content structure issues.
tinymce_layout_no_images_in_headings = Move images out of headings
tinymce_layout_no_images_in_headings_help = Images inside h1-h6 are moved before the heading.
tinymce_layout_collapse_empty = Collapse multiple empty lines
tinymce_layout_collapse_empty_help = Multiple consecutive empty <p> tags are replaced with a clear element.
tinymce_layout_delete_empty = Delete single empty paragraphs
tinymce_layout_delete_empty_help = Removes single empty <p> tags at the beginning and end.
tinymce_layout_lines_to_hr = Convert minus lines to horizontal rule (----)
tinymce_layout_lines_to_hr_help = Multiple minus signs are converted to <hr> tags.
tinymce_layout_clear_element = Clear element CSS class
tinymce_layout_hr_class = Horizontal rule CSS class
```

### Verwendungsbeispiele für AddOn-Entwickler

#### Minimales Profil mit Layout Rules

```json
{
  "name": "mein_addon_minimal",
  "description": "Minimalprofil mit Struktur-Sicherheit",
  "profile": "plugins: 'autolink lists link'\ntoolbar: 'undo redo | bold italic'\nfor_layout_rules_no_images_in_headings: true"
}
```

#### Standard-Profil mit allen Rules

```json
{
  "name": "mein_addon_standard",
  "description": "Vollständiges Profil mit Layout-Korrektur",
  "profile": "plugins: 'autolink lists link'\ntoolbar: 'undo redo | bold italic'\nfor_layout_rules_no_images_in_headings: true\nfor_layout_rules_collapse_empty_paragraphs: true\nfor_layout_rules_convert_lines_to_hr: true\nfor_layout_rules_clear_element_class: 'uk-margin'\nfor_layout_rules_hr_class: 'uk-divider-icon'"
}
```

#### Custom Design-System Integration

Falls dein AddOn ein anderes Design-System nutzt (z.B. Bootstrap):

```json
{
  "profile": "...\nfor_layout_rules_clear_element_class: 'my-spacer'\nfor_layout_rules_hr_class: 'my-divider'"
}
```

### FAQ

**F: Werden Layout Rules automatisch für alle Profile aktiviert?**
A: Nein. Nur `no_images_in_headings` ist Basis-Default. Andere Rules müssen explizit aktiviert werden. Presets stellen sinnvolle Defaults bereit.

**F: Kann ich die Standard-CSS-Klassen überschreiben?**
A: Ja, über `for_layout_rules_clear_element_class` und `for_layout_rules_hr_class`.

**F: Was passiert mit Protected Extras?**
A: Layout Rules beeinflussen die Protected Extras nicht. Sie werden nach Regelanwendung wieder angehängt.

**F: Wie teste ich Layout Rules lokal?**
A: Profil mit Rules aktivieren → Backend öffnen → Content mit "problematischen" Strukturen (Bilder in Headings, mehrfache `<p></p>`, Minus-Reihen) einfügen → Ausgabe prüfen.

**F: Können Layout Rules beschädigt werden?**
A: Nein. Sie arbeiten rein strukturell (Bewegung, Ersetzung) und ändern Textinhalte nicht.
