Changelog
=========

Version 8.4.0
-------------------------------

### Neues Plugin: `for_footnotes` – FriendsOfREDAXO Fußnoten

Eigenständige, freie Fußnoten-Funktion für den TinyMCE-Editor – entwickelt von FriendsOfREDAXO. **Keine Kompatibilität zu Tiny's kommerziellem Premium-Plugin** – eigener Namespace mit `for_`/`for-`-Prefix.

* **Plugin-Name:** `for_footnotes`
* **Toolbar-Buttons:** `for_footnote_insert` (Fußnote einfügen) und `for_footnote_update` (Nummerierung aktualisieren / Waisen entfernen).
* **Menüeintrag:** `for_footnote` (fürs Insert-Menü).
* **Commands:** `forFootnoteInsert` und `forFootnoteUpdate`.
* **Automatische Nummerierung:** Fußnoten werden nach DOM-Reihenfolge durchnummeriert. Einfügen zwischen bestehenden Fußnoten, Verschieben oder Löschen löst automatisch Neu-Nummerierung aus.
* **Bidirektionale Verlinkung:** Hochgestellte Nummer springt zum Eintrag, `^`-Caret am Eintrag zurück zur Nummer.
* **Sektion wird Auto-managed:** `<div class="for-footnotes">` mit `<hr>` + `<ol>` wird beim ersten Einfügen erzeugt und entfernt, wenn keine Fußnoten mehr vorhanden sind.
* **Idempotente Sync-Logik:** Existierende `<li>`-Einträge werden nicht neu erzeugt, wenn sich nichts geändert hat – so bleibt der Cursor beim Tippen erhalten.
* **Schutz vor TinyMCE-Klonen:** Beim Klick auf die hochgestellte Nummer klont TinyMCE intern kurzzeitig das `<sup>` für die Selection-Darstellung. Duplikate werden erkannt und entfernt, statt neue Fußnoten anzulegen.
* **Waisen-Cleanup:** `forFootnoteUpdate` entfernt Einträge, deren Referenz im Dokument nicht (mehr) existiert.
* **Eigene CSS-Klassen:** `for-footnotes`, `for-footnote-ref`, `for-footnote-back`, `for-footnote-text` – fürs Frontend-Styling entsprechend anpassen.

Verwendung im Profil:

```javascript
plugins: 'for_footnotes ...',
toolbar: 'for_footnote_insert for_footnote_update ...',
```

### Neues Plugin: `for_checklist` – Moderne Checkliste mit CKEditor-5-Import

Eigenständige Checklist-Implementierung mit modernem CSS-Look (keine klassische Form-Checkbox).

* **Plugin-Name:** `for_checklist`
* **Zwei Varianten – zwei Toolbar-Buttons:**
  * `for_checklist` – klassische **To-Do-Liste** (erledigte Einträge durchgestrichen/ausgegraut).
  * `for_checklist_feature` – **Feature-/Benefit-Liste**: kein Strikethrough, grüner Check, offene Einträge mit gestricheltem Rahmen, neue Einträge sind per Default direkt als „erfüllt" markiert.
  * Nahtloses Umschalten zwischen den Varianten, ohne Inhaltsverlust – Klick auf den gleichen Button löst die Liste auf.
* **Command:** `forChecklistToggle` mit Parameter `'todo'` (Default) oder `'feature'`.
* **HTML-Format:** Schlank und semantisch –
  `<ul class="for-checklist"><li class="for-checklist__item" data-checked="true|false">…</li></ul>`
* **Automatischer CKEditor-5-Import:** Beim `SetContent`, `BeforeSetContent` und `PastePostProcess` werden `ul.todo-list`-Strukturen aus CKE5 automatisch ins neue Format konvertiert. Der Checked-Zustand aus dem versteckten `<input type="checkbox">` wird übernommen, Labels und `.todo-list__label__description`-Wrapper werden entfernt.
* **Modernes Design per CSS:** Die visuelle Checkbox wird als `::before`-Pseudo-Element gerendert – abgerundetes Quadrat, Hover-Zustand, gefüllter Check-State mit SVG-Häkchen, Dark-Mode über `prefers-color-scheme`, Print-Variante. Komplett über CSS-Variablen anpassbar (`--for-checkbox-size`, `--for-checkbox-radius`, `--for-checkbox-checked-bg` u. v. m.).
* **Toggle per Klick:** Klick auf die Checkbox-Zone (links vom Text) schaltet `data-checked` um – in eine `undoManager.transact`-Transaktion gewrappt.
* **Schema-Anpassung:** `ul[class]` und `li[class|data-checked]` werden im PreInit freigeschaltet, sodass TinyMCE die Auszeichnung beim Speichern nicht strippt.

Verwendung im Profil:

```javascript
plugins: 'for_checklist ...',
toolbar: 'for_checklist for_checklist_feature ...',
```

Beispiel-Einbindung der Styles im Frontend:

```php
rex_view::addCssFile(rex_url::addonAssets('tinymce', 'css/for_checklist.css'));
```

### Neues Plugin: `cleanpaste` – Intelligentes Paste-Cleanup

Komplett neues Paste-System, das PowerPaste (kostenpflichtig) ersetzt und speziell auf typische Copy-&-Paste-Quellen im Redaktionsalltag optimiert ist.

* **Office- & Google-Docs-Bereinigung:** Entfernt automatisch MS Word/Outlook/Google-Docs-spezifische Klassen (`MsoNormal`, `docs-*`), Conditional Comments, `<o:p>`-Namespaces, Smart-Tags und inline mso-Styles bereits auf String-Ebene – bevor das HTML in den Editor kommt.
* **DOM-Level-Cleanup:** Entfernt konfigurierbar `class`, `style`, `id`, `data-*`-Attribute, leere Paragraphen und reduziert `<br>`-Ketten. Füllzeichen (`&nbsp;`, Zero-Width-Space) werden normalisiert.
* **Positiv-Listen statt Blacklists:** Erlaubte Tags, Klassen, Styles, IDs und data-Attribute werden pro Profil definiert – alles andere wird verworfen. Einträge unterstützen **Regex-Patterns** (z. B. `^uk-.*` für alle UIkit-Klassen).
* **Konfigurierbare Cleanup-Stufen:** BR-Reduktion, Leer-Paragraph-Entfernung, Office-Strip und DOM-Bereinigung lassen sich einzeln ein-/ausschalten.
* **Neue Einstellungsseite:** _AddOn → TinyMCE → Paste-Einstellungen_ mit GUI für alle Allow-Lists, ohne Profil-JS anfassen zu müssen.
* **Frontend-kompatibel:** Konfiguration wird direkt in die generierte `profiles.js` als `tinyCleanPasteConfig` eingebettet (nicht mehr via `rex_view::setJsProperty`, das nur im Backend funktioniert).

### Neues Plugin: `mediapaste` – Direkter Medienpool-Upload aus Zwischenablage & Drag-&-Drop

Bilder landen beim Einfügen direkt im REDAXO Medienpool – kein manueller Upload-Umweg mehr.

* **Drag & Drop:** Bilder per Drag-&-Drop in den Editor werden über `images_upload_handler` automatisch in den Medienpool hochgeladen. Original-Dateiname (`<File>.name`) wird übernommen.
* **Copy-Image aus Browser:** "Bild kopieren" aus beliebigen Websites funktioniert – der Binär-Anteil aus der Zwischenablage wird abgegriffen, das Einfügen der externen URL blockiert (synchrones `preventDefault` + `stopImmediatePropagation`). Der Dateiname wird aus `<img src="…">` im Clipboard-HTML extrahiert, inkl. URL-Decoding und Strip von Query-/Fragment-Teilen.
* **Kategorien-Picker:** Dialog zur Auswahl der Medienkategorie beim Upload. Respektiert die Medienkategorie-Berechtigungen des REDAXO-Users (`rex_media_perm`) – inklusive verschachtelter Darstellung mit Einrückung.
* **Default-Kategorie konfigurierbar:** Profil kann eine feste Kategorie-ID vorgeben, dann entfällt der Dialog.
* **Screenshots & Clipboard-Binaries:** Auch reine Binär-Einfügungen ohne HTML-Begleitung (Screenshots, Ausschnitte aus Bildbearbeitung) werden sauber verarbeitet und bekommen einen `image-<timestamp>.<ext>`-Namen, wenn kein Original verfügbar ist.
* **TinyMCE-interne Blob-Namen neutralisiert:** `mceclip*`, `blobid*`, `imagetools*` werden erkannt und durch saubere Dateinamen ersetzt.
* **Upload-Progress & Fehlerbehandlung:** XHR mit Progress-Callback, Abbruch-Erkennung, JSON-Fehlerrückgabe.
* **Zwei neue API-Endpunkte:**
  * `rex-api-call=tinymce_media_upload` – nimmt `file` + `category_id` entgegen, nutzt `rex_media_service::addMedia()`, gibt `{ location }` zurück.
  * `rex-api-call=tinymce_media_categories` – liefert die erlaubten Kategorien für den aktuellen User (gecached auf Client-Seite).

### Infrastruktur

* **Config-Bridge:** `TinyMce\Creator\Profiles::profilesCreate()` bettet Plugin-Konfigurationen als JS-Konstanten (`tinyCleanPasteConfig`, `tinyMediaUploadConfig`, `tinyExternalPlugins`) in `assets/generated/profiles.js` ein. Damit funktionieren alle neuen Features nahtlos im Backend **und** im Frontend.
* **Neue Sprachkeys:** `tinymce_cleanpaste_*`, `tinymce_paste_settings`, `mediapaste_*`, `tinymce_media_no_category` (de_de / en_gb).
* **Rexstan-Clean:** Alle neuen und geänderten Dateien bestehen `php redaxo/bin/console rexstan:analyze`.


Version 8.2.6
-------------------------------

### Bugfixes
* Fix: Style-Sets wurden bei mehreren Editoren mit demselben Profil auf einer Seite doppelt in das Styles-Dropdown eingebunden. Ursache war eine direkte Objektreferenz auf `tinyprofiles[profile]` statt eines Klons – Mutationen wie `style_formats.concat(...)` haben das globale Cache-Objekt verändert. Behoben durch `Object.assign({}, tinyprofiles[profile])` in `base.js`
* Fix: `registerFormats` in `base.js` übergibt ab sofort nur definierte Properties an `editor.formatter.register()`. Undefinierte Properties (z.B. `inline: undefined` bei Selector-Formaten) konnten TinyMCEs internen Format-Typ-Erkennungsmechanismus stören und dazu führen, dass Listen-, Tabellen- und Bildstile nicht griffen
* Fix: Alle Format-Items in den Default Style-Sets (UIkit3, Bootstrap5) erhalten jetzt explizite `name`-Properties. Der zuvor automatisch aus dem Titel generierte Name war bei Sonderzeichen (Umlaute) und Leerzeichen unzuverlässig und konnte Kollisionen verursachen
* Fix: UIkit3 Style-Set "Überschriften" enthielt nur UIkit-spezifische Heading-Varianten. Ergänzt um normale `h1`–`h6` ohne Klasse als erste Einträge der Gruppe


Version 8.2.3
-------------------------------

### Bugfix
* Fix: `html`-Block in `assets/styles/base.css` entfernt, der `height: auto` und `min-height: 100%` setzte und damit die REDAXO-Backend-Navigation beim Scrollen blockierte (Backend-Header wurde nicht mehr aus- und eingeblendet) – Issue #139


Version 8.2.0
-------------------------------

### Neues Plugin: FOR Images

Komplett neues Bildformatierungs-Plugin mit umfangreichen Features:

* **Preset-basierte Konfiguration:** Breiten, Ausrichtung und Effekte werden über JSON-Arrays im Profil definiert
* **CSS-Framework Support:** Vordefinierte Templates für UIkit 3, Bootstrap 5 und allgemeine CSS-Klassen
* **Responsive Breakpoints:** Automatische Generierung von responsive Klassen (@s, @m, @l für UIkit; sm, md, lg für Bootstrap)
* **Figure-Wrapping:** Bilder werden automatisch in `<figure>` gewrappt für korrektes Float-Verhalten
* **Bildunterschriften:** Eigener Caption-Button zum Hinzufügen/Entfernen von `<figcaption>`
* **Alt-Text Button:** Schnelles Bearbeiten des Alt-Textes mit visuellem Status (aktiv = Alt-Text vorhanden)
* **Effekte:** Schatten, abgerundete Ecken, Rahmen als toggle-bare Klassen
* **Kein manuelles Resize:** Resize-Handles werden deaktiviert, Größen nur über Presets
* **Aspect Ratio erhalten:** width/height Attribute bleiben für Browser-Ratio-Berechnung erhalten

### Konfiguration im Profil

```javascript
plugins: 'for_images ...',
imagewidth_presets: [
    {label: 'Original', class: ''},
    {label: 'Klein', class: 'uk-width-small@m'},
    {label: '50%', class: 'uk-width-1-2@m'}
],
imagealign_presets: [
    {label: 'Links', class: 'uk-float-left uk-margin-right uk-margin-bottom'},
    {label: 'Rechts', class: 'uk-float-right uk-margin-left uk-margin-bottom'}
],
imageeffect_presets: [
    {label: 'Schatten', class: 'uk-box-shadow-medium'},
    {label: 'Abgerundet', class: 'uk-border-rounded'}
]
```

### Profil-Assistent

* Neue UI-Sektion "Bildformatierung" im Profil-Builder
* Template-Auswahl (UIkit 3, Bootstrap 5, Allgemein)
* Breakpoint-Selektor für responsive Klassen
* JSON-Textareas für individuelle Anpassungen

### Bugfixes & Verbesserungen
* Fix: Inline-Styles auf Bildern werden entfernt, nur CSS-Klassen verwendet
* Fix: Content-Styles für Editor-Preview aller Framework-Klassen


Version 8.1.1
-------------------------------
Vendor-Update TinyMCE: ^8.2.2 → 8.3.1


Version 8.1.0
-------------------------------

### Neue Features
* **Style-Sets:** Neue zentrale Verwaltung von CSS-Framework-spezifischen Styles.
    * UIkit 3, Bootstrap 5 und eigene Style-Definitionen.
    * Profil-Zuordnung: Style-Sets können einzelnen Profilen zugewiesen werden.
    * Import/Export von Style-Sets als JSON.
    * Demo-Sets für UIkit 3 und Bootstrap 5 vorinstallierbar.
* **Verbesserter Styles-Button:** Eigener "stylesets" Button mit vollständiger Unterstützung für verschachtelte Menüs.
* **Format-Menü Integration:** Style-Sets sind auch über das Format-Menü erreichbar.

### Bugfixes
* Fix: Button-Styles verwenden nun korrekt `selector` statt `inline` für `<a>`-Elemente.
* Fix: Eindeutige Format-Namen verhindern Kollisionen zwischen Buttons, Backgrounds, Cards etc.
* Fix: CSS-Ladereihenfolge korrigiert (Profil-CSS überschreibt globale Styles).

### Verbesserungen
* Style-Sets werden über die Datenbank verwaltet (`rex_tinymce_stylesets`).
* Extension Point `TINYMCE_GLOBAL_OPTIONS` für globale TinyMCE-Optionen.
* Bessere Debug-Ausgaben in der Browser-Konsole.

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
