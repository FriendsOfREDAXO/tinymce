# GitHub Copilot Instructions für TinyMCE REDAXO Addon

## Projekt-Übersicht

Dieses Addon integriert den **TinyMCE 8** WYSIWYG-Editor in das REDAXO CMS. Aktuelle Version: **8.5.0** (noch nicht released, `package.yml`).

Features:
- Profil-basierte Editor-Konfigurationen (CRUD, Import/Export, Duplizieren, Preview)
- Media Manager Integration für optimierte Bildauslieferung
- Snippets- und Styleset-Verwaltung mit eigenen Backend-Seiten
- Paste-Settings (Clean Paste / Mediapaste) mit zentraler Konfiguration
- 17+ eigene TinyMCE-Plugins (`for_*` plus Legacy-Plugins ohne Präfix)
- Automatische Vendor-Updates via GitHub Action (Dependabot bewusst deaktiviert)

## Technologie-Stack

### Backend (PHP)
- **REDAXO 5.x** (`rex_sql`, `rex_sql_table`, `rex_i18n`, `rex_view`, `rex_addon`, `rex_fragment`)
- **PSR-12** Coding-Style, eigener Namespace `FriendsOfREDAXO\TinyMce\`
- Klassen liegen in `lib/` und werden vom REDAXO-Autoloader erfasst

### Frontend
- **TinyMCE 8.4+** (neuere Versionen werden via Action eingespielt)
- Vanilla JavaScript für neue Features (jQuery nur wo historisch nötig)
- CSS mit Light/Dark-Mode-Unterstützung (`body.rex-theme-dark`, `prefers-color-scheme`)

### Build-System
- **pnpm 10** als Package Manager – **kein npm / yarn**
- **esbuild ≥ 0.25** (Security-Bump, `^0.18.0` nicht mehr verwenden)
- **TypeScript 4.x** für Custom Plugins, IIFE-Output, `tinymce` als einzige `external`
- Root ist ein pnpm-Workspace (`pnpm-workspace.yaml`, `custom_plugins/*`)

## Projekt-Struktur

```
tinymce/
├── .github/
│   ├── copilot-instructions.md
│   ├── dependabot.yml              # bewusst leer (updates: [])
│   └── workflows/
│       ├── publish-to-redaxo.yml
│       └── update-tinymce-vendor.yml
├── assets/
│   ├── generated/                  # automatisch erzeugte Profile/Assets
│   ├── scripts/                    # Backend-JS (base.js, profile_builder.js, linkmap.js …)
│   ├── styles/
│   ├── vendor/tinymce/             # TinyMCE Core (via scripts/vendor-copy.js)
│   └── scripts/tinymce/plugins/    # gebaute Custom Plugins (Mirror)
├── custom_plugins/                 # Quellen der Plugins (pnpm-Workspace)
│   ├── for_a11y/                   # Accessibility-Check (Flaggschiff-Plugin)
│   ├── for_chars_symbols/          # Zeichen-/Symbol-/Emoji-Picker + Invisibles
│   ├── for_checklist/
│   ├── for_footnotes/
│   ├── for_htmlembed/
│   ├── for_images/                 # Media Manager Bilder
│   ├── for_markdown/
│   ├── for_oembed/                 # YouTube/Vimeo/… Embeds
│   ├── for_rootstrip/              # Opt-in: strippt Root-Tags beim Paste
│   ├── for_toc/
│   ├── for_video/                  # Mediapool-Video
│   ├── cleanpaste/                 # Legacy-Name (Word/Office-Clean)
│   ├── link_yform/                 # YForm-Datensätze verlinken
│   ├── mediapaste/                 # Upload per Paste in Mediapool
│   ├── phonelink/                  # tel:-Links inkl. RFC-3966-Filter
│   ├── quote/                      # semantisches <blockquote>
│   └── snippets/                   # Snippet-Insert-Menü
├── lib/TinyMce/                    # Namespace FriendsOfREDAXO\TinyMce
│   ├── Creator/Profiles.php
│   ├── Handler/                    # DB-Handler (Profiles, Snippets, Stylesets …)
│   ├── Provider/Assets.php
│   └── Utils/                      # inkl. DemoProfile.php (Demo-Toolbar)
├── pages/                          # Backend-Seiten (profiles, snippets, stylesets, paste_settings, migration …)
├── scripts/                        # Node-Build-Skripte (vendor-copy, build-plugins, sync-build-to-assets, clean-*)
├── CHANGELOG.md                    # Finalform, keine Dev-Zwischenschritte
├── FOR_PLUGINS.md                  # interner Plugin-Katalog
├── README.md                       # öffentliche Doku
├── install.php / update.php        # Transaktionen Pflicht in update.php
├── uninstall.php
└── boot.php
```

## Entwicklungs-Richtlinien

### PHP

1. **Datenbank ausschließlich über `rex_sql` / `rex_sql_table`**
   ```php
   $sql = rex_sql::factory();
   $sql->setTable(rex::getTable('tinymce_profiles'));
   $sql->setValue('name', $name);
   $sql->insert();
   ```
   Keine rohen `setQuery()`-Aufrufe mit User-Input.

2. **Transaktionen in `update.php`**
   ```php
   $sql = rex_sql::factory();
   $sql->setQuery('START TRANSACTION');
   try {
       // Migrationen
       $sql->setQuery('COMMIT');
   } catch (Exception $e) {
       $sql->setQuery('ROLLBACK');
       throw $e;
   }
   ```

3. **i18n via `rex_i18n::msg()`**, keine fest verdrahteten Strings.

4. **Backend-Seiten**: Titel nur einmal in der Einstiegsseite setzen, Subpages rendern den Titel kontextuell selbst. `rex_be_controller::includeCurrentPageSubPath()` verwenden.

5. **REDAXO Core zuerst**: `rex_file`, `rex_path`, `rex_response`, `rex_escape`, `rex_view`. Eigene Lösungen nur wenn Core nichts bietet.

6. **Eigener Namespace**: `FriendsOfREDAXO\TinyMce\…`, via `use`-Statements. Klassen in `lib/` ohne Composer-Autoload nötig.

### JavaScript / TypeScript

1. **TinyMCE 8 API**, keine Reste aus TinyMCE 5/6.
2. **Kein Inline-JS in PHP** (`rex_view::addJsCode` / Echo). JS gehört in Dateien unter `assets/scripts/` und wird via `rex_view::addJsFile()` eingebunden. Für Mini-Snippets Nonce verwenden.
3. **Custom Plugins**
   - Build via **esbuild**, `format: 'iife'`, `external: ['tinymce']`.
   - `@ephox/*` **muss gebundelt** werden.
   - Entry-Point ist `src/Main.ts` (ruft `Plugin()` auf). `Plugin.ts` exportiert nur die Factory – **nicht** als Entry verwenden.
4. **Media Manager Integration** nur für Bildtypen (`jpg/jpeg/png/gif/webp`); SVG, TIFF, BMP, Video, Audio über direkte `/media/`-URLs.
5. **Theme-Awareness**: CSS-Variablen, `body.rex-theme-dark` und `@media (prefers-color-scheme: dark) { body.rex-has-theme:not(.rex-theme-light) { … } }`.

### Build-System

```bash
# Root
pnpm install
pnpm run build            # vendor:build + plugins:build + build:sync
pnpm run plugins:build    # nur Custom Plugins
pnpm run vendor:copy      # TinyMCE-Vendor aktualisieren
pnpm run clean-plugins    # dist/ aufräumen

# Einzelnes Plugin
cd custom_plugins/<name>
pnpm run build            # schreibt dist/ und spiegelt nach assets/scripts/ + assets/vendor/
```

**Immer spiegeln:** Custom Plugins liegen nach dem Build unter
- `assets/scripts/tinymce/plugins/<name>/{plugin.js,plugin.min.js}`
- `assets/vendor/tinymce/plugins/<name>/{plugin.js,plugin.min.js}`

Generierte Profile landen in `assets/generated/profiles.js` und werden zusätzlich nach `public/assets/addons/tinymce/generated/profiles.js` synchronisiert.

### Nicht committen
- `node_modules/`, `custom_plugins/*/node_modules/`, `custom_plugins/*/dist/`, `build/` (temporär)
- `pnpm-lock.yaml` **wird im Root** committet

## Bundled Plugins – wichtige Besonderheiten

- **for_a11y** ist das Flaggschiff-Feature. In `lib/TinyMce/Utils/DemoProfile.php` steht `for_a11y` deshalb als erster Toolbar-Button.
- **for_rootstrip** ist **Opt-in**: Muss explizit in der Profil-`plugins`-Liste stehen, greift also nur wenn aktiviert.
- **for_chars_symbols** ersetzt den alten typo-finder; inkl. Invisibles-Toggle und Locale-abhängiger Zeichen-Gruppen.
- Legacy-Plugins ohne `for_`-Präfix (`cleanpaste`, `mediapaste`, `link_yform`, `phonelink`, `quote`, `snippets`) bleiben aus Kompatibilitätsgründen so benannt.
- Quote/Phonelink/link_yform erzeugen ihren Output HTML-escaped; `phonelink` filtert die `href` auf RFC-3966-Zeichen.
- `profile_builder.js` darf `quickbars_image_toolbar: false` **nur** ausgeben, wenn `plugins` tatsächlich `quickbars` enthält – sonst TinyMCE-Warnings.

## Testing-Richtlinien

### Pflicht vor PR/Release

1. **Installation & Update**
   - Frische REDAXO-Instanz: Install, Profile vorhanden, Tabellen erstellt
   - Update aus älterer Version: Migrations-Seite, Transaktion ohne Fehler

2. **Profile**
   - Anlegen, Bearbeiten, Duplizieren, Import/Export (YAML), Preview, Löschen

3. **Editor im Backend**
   - Lädt in Artikelbearbeitung, Toolbar vollständig, Speichern & Frontend-Anzeige
   - Bild via Media Manager, Link via Linkmap, Source-Code-Ansicht

4. **Media Manager Weichen**
   - Bildtypen → `/media/tiny/`, andere Typen → `/media/`

5. **Custom Plugins** – mindestens je einmal pro Plugin bedienen, keine JS-Konsolenfehler.

6. **Build**
   ```bash
   pnpm install && pnpm run build
   ```
   - `assets/vendor/tinymce/` gefüllt
   - `assets/scripts/tinymce/plugins/` komplett
   - Keine esbuild-Warnings

7. **Static Analysis (im Docker `coreweb`)**
   ```bash
   docker exec -it coreweb bash -c "cd /var/www/html/public && php redaxo/bin/console rexstan:analyze redaxo/src/addons/tinymce/lib"
   ```

### Pre-Release-Checkliste

- [ ] PHP 8.1+ kompatibel
- [ ] REDAXO 5.18+ kompatibel
- [ ] Keine PHP-Warnings/Notices
- [ ] Keine JS-Fehler in der Konsole
- [ ] DE/EN Übersetzungen vollständig
- [ ] CHANGELOG.md aktualisiert (Finalform, keine Dev-Schritte)
- [ ] Version in `package.yml` erhöht
- [ ] `pnpm run build` läuft sauber durch

## Sicherheit

- SQL-Injection: nur `rex_sql`-Setter
- XSS: `rex_escape()` bzw. expliziter Escape in Custom Plugins vor DOM-Insertion
- CSRF: `rex_csrf_token`/`rex_request` in allen POST-Routen
- Keine direkten File-Uploads im Editor – Mediapool/Media Manager nutzen
- API-Endpoints via `rex_api_function`, `rex_response::cleanOutputBuffers()` am Anfang, `rex_response::sendJson()` am Ende

## Automatisierung

**Update TinyMCE Vendor** (`.github/workflows/update-tinymce-vendor.yml`)
- Läuft montags 02:00 UTC
- Prüft npm Registry auf neue `tinymce` / `tinymce-i18n` Versionen
- Öffnet PR inkl. Changelog-Hinweis
- Manual Trigger über den Actions-Tab möglich

**Kein Dependabot** (`.github/dependabot.yml` ist mit `updates: []` leer). Security-Bumps (z. B. esbuild ≥ 0.25) werden manuell nachgezogen.

## Häufige Fehler vermeiden

- npm/yarn statt pnpm
- Grunt/Webpack/Rollup (alle entfernt)
- Rohe SQL-Queries
- `update.php` ohne Transaktion
- Inline-JS per `rex_view::addJsCode()`
- `Plugin.ts` als esbuild-Entry (Entry ist `Main.ts`)
- `for_a11y` nicht als erster Demo-Toolbar-Button
- `quickbars_image_toolbar` ohne aktives quickbars-Plugin setzen
- `node_modules/` / `dist/` committen
- Veraltete esbuild-Version `^0.18.0` in neuen `package.json`

## Links

- [TinyMCE 8 Docs](https://www.tiny.cloud/docs/tinymce/latest/)
- [REDAXO Docs](https://redaxo.org/doku/master)
- [pnpm Docs](https://pnpm.io/)
- [esbuild Docs](https://esbuild.github.io/)
