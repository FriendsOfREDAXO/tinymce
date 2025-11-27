Changelog
=========

Version 8.0.0
-------------------------------

### Neue Features
* **Snippets (Textbausteine):** Neues Plugin zur Verwaltung und Nutzung von HTML-Snippets.
    * Eigene Backend-Seite zur Verwaltung der Snippets.
    * Dynamisches Nachladen der Snippets im Editor via API (`rex_api_tinymce_get_snippets`).
    * Integration in den Profil-Assistenten.
* **Link YForm Plugin:**
    * Konfigurations-Assistent im Profil-Builder hinzugefügt.
    * Dokumentation für Output-Filter und Konfiguration erweitert.
* **Entwickler-Tools:**
    * Neue `PluginRegistry` Klasse zur einfachen Registrierung externer Plugins.
    * Eigener "Entwickler"-Reiter im Backend mit Dokumentation.
    * `DEVS.md` hinzugefügt.

### TinyMCE 8.2.2 Update
* Upgrade auf TinyMCE 8.2.2
* TinyMCE i18n auf 25.11.17 aktualisiert
* Automatische GitHub Action für wöchentliche Vendor-Updates

### Build-System Modernisierung
* **Grunt komplett eliminiert** - Ersetzt durch esbuild
* **309 npm-Pakete weniger** - Alte Build-Tools entfernt (Grunt, Webpack, Rollup)
* **pnpm statt yarn** - Modernes Package-Management mit Workspaces
* Neue einfache build.js Scripts für custom_plugins
* Deutlich schnellere Build-Zeiten (< 1 Sekunde pro Plugin)
* Fix: Plugins werden nun korrekt sowohl nach `assets/scripts` als auch `assets/vendor` kopiert, um "Dynamic require" Fehler zu vermeiden.

### Media Manager Integration
* Automatische Media Manager Integration für Bildtypen (JPG, PNG, GIF, WebP)
* Intelligente Dateitypprüfung für selektive Nutzung
* SVG, TIFF, BMP, Video und Audio nutzen direkten /media/ Pfad
* Konfigurierbar über TinyMCE Profile (tinymce_media_type)

### Installation & Updates
* Separierte Install/Update-Logik mit manueller Migrations-Seite
* Transaction-basierte Datenbankupdates
* SQL-Escaping in profiles.sql korrigiert
* Neue ensure_table.php für strukturierte Migrations

### Profil-Management
* Import/Export von Profilen mit Überschreiben-Option
* Profile-Preview direkt in der Übersicht
* Verbesserte UI und Fehlervermeidungen
* Profile-JavaScript wird dynamisch generiert
* Profil "full" ist nun vor versehentlichem Löschen geschützt.

### Custom Plugins
* link_yform, phonelink, quote auf esbuild migriert
* Lizenz-Header optional
* @ephox/* und tinymce als external markiert
* README für Entwickler hinzugefügt

### CI/CD
* Automatische TinyMCE Vendor Updates via GitHub Action
* Wöchentliche Checks (Montag 2:00 UTC)
* Automatische PR-Erstellung bei neuen Versionen
* Dependabot entfernt (Updates selbst verwaltet)

### Bugfixes
* jQuery.alphanum auf Upstream aktualisiert
* Runtime-Copying vermieden
* Diverse Warnungen behoben
* TinyMCE 5 Reste aus Standard-Profilen entfernt

Version 8.0.0-beta1
-------------------------------

* Major migration to TinyMCE 8 and rework of installation/update flow
* Separate install / update logic — profile migrations are now manual via the admin migration page
* New build-time asset pipeline using pnpm + esbuild; TinyMCE vendor files are copied into the addon
* Custom plugins are built and copied into assets/scripts/tinymce/plugins and into vendor plugins so they work out-of-the-box
* Added import/export of profiles (with overwrite) and a preview action on the profiles list
* UI & bug fixes: avoid runtime copying, fix warnings, updated jquery.alphanum to upstream

Version 6.1.1
-------------------------------

* remove TinyMCE 5 stuff from default profiles and subsitute with TinyMCE 6 buttons
