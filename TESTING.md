Testen: tinymce AddOn — Install / Update / Migration

Kurzbeschreibung
- `install.php` und `update.php` nutzen jetzt dieselbe, autoload-freie Include-Datei `ensure_table.php` um die Tabelle `rex_tinymce_profiles` anzulegen/zu aktualisieren.
- Profile-Migration / Reparatur wird nicht mehr während `update.php` ausgeführt, sondern manuell über die Backend-Seite `tinymce -> Migration` (pages/migration.php)
- Das Kopieren von Custom-Plugins in `assets` wird nicht mehr beim Install/Update per PHP gemacht — diese Dateien müssen beim Build/Release bereits unter `assets/vendor/tinymce/plugins/` liegen.

Manuelle Tests (lokal / Docker)
1) Backend vorbereiten
   - Starte deine REDAXO-Instanz (z.B. Docker-Setup)

2) Test: fresh install
   - Installiere das AddOn neu oder lösche die DB-Tabelle `rex_tinymce_profiles` und rufe die AddOn-Installation im REDAXO Backend an.
   - Erwartet: `ensure_table.php` legt die Tabelle an und `install/profiles.sql` wird importiert.

3) Test: update
   - Aktualisiere das AddOn über die Backend-Oberfläche.
   - Erwartet: `update.php` führt `ensure_table.php` aus und beendet erfolgreich (keine automatische Migration der Profile).

4) Test: Migration/Reparatur
   - Rufe im AddOn-Menü `TinyMCE -> Migration` auf.
   - Die Seite listet alle Profile, zeigt `extra` Inhalt und bietet Buttons zum Reparieren einzelner Profile oder aller auf einmal.

Hinweis zum Build (Custom-Plugins)
- Wenn ihr Custom-Plugins habt, legt diese beim Build in `assets/vendor/tinymce/plugins/<pluginname>` ab (z.B. via npm/grunt/CI), damit der Installer/Updater nicht zur Laufzeit Dateien kopieren muss.
