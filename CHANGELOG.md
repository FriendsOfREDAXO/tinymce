Changelog
=========

Version 8.6.5
-------------------------------
Boddy padding korrigiert

Version 8.6.4
-------------------------------

### `for_images`: ALT-Text aus Medienpool

- Beim Auswahl eines Bildes aus dem Medienpool wird der ALT-Text ermittelt und übernommen:  med_alt (sofern vorhanden) -> fallback ist title


Version 8.6.3
-------------------------------

### `for_images`: Hinweis auf veraltetes CKE5-Bildmarkup

- Neue Plugin-Option `image_compat_warn` (default `false`).
- Wenn aktiviert, erkennt der Editor beim Laden und bei `SetContent` typisches CKEditor-5-Bildmarkup (`figure.image`, `figure.image_resized`, Klassen `image-style-…`) und zeigt einmalig eine Warnung an, die den Redakteur bittet, die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut zu formatieren.
- Es wird **nichts automatisch konvertiert** – ausschließlich Hinweis. Ziel: einheitliches, sauberes Markup nach erneutem Speichern.
- Im **Profil-Assistent** über die neue Checkbox „Auf veraltetes CKE5-Bildmarkup hinweisen“ im Bereich „Bildformatierung“ steuerbar.

Version 8.6.0
-------------------------------

### Neue Funktionen & Plugins

- **`for_chars_symbols` (Typografie & Symbole):** Komplett neues, schwebendes Panel für Sonderzeichen, Emojis und typografische Aktionen. Bietet Favoriten, Shortcuts, echtes Unicode-Handling, optionales Live-Autoreplace (z. B. `(c)` → ©) beim Tippen sowie die Option, den Emoji-Tab global über den Profil-Assistenten auszublenden.
- **`for_abbr` (Abkürzungen):** Neues Plugin zur semantischen Auszeichnung von Abkürzungen via `<abbr>` inkl. optionaler Sprach-Auszeichnung und Glossar-Vorschlägen.
- **`for_a11y` Erweiterung:** 11 neue redakteursfreundliche Accessibility-Regeln, z. B. zur Prüfung von Alt-Text-Qualität, Link-Benennungen, Überschriften-Logik und Pseudo-Listen.

### Profil-Assistent & UI

- **Verbesserter Profil-Assistent:** Neuer "Generieren & Speichern"-Button (1-Klick-Save), überarbeitete Link-Vorgaben (inkl. Defaults für HTTPS und Sichere Externe Links) sowie neue Konfigurations-Bereiche für Autoreplace und Sprach-Formatierungen (`content_langs`).
- **Profil-Optimierungen:** Das `image`-Toolbar-Element wurde im Backend durch eindeutige Einzel-Buttons ersetzt, Dummy/Paste-Plugins auf UI-Ebene versteckt.
- **Modernisierte Demo-Seite:** Die Demo-Profile und die Backend-Demoseite wurden komplett logisch neu gruppiert und um eine interaktive Feature-Helfer-Sidebar ergänzt.


Version 8.4.2
-------------------------------

### Profil-Assistent – Editor-Größe gemäß offizieller TinyMCE-Doku

Die Größen-Sektion wurde auf Basis der [TinyMCE-Doku *Editor size and resize options*](https://www.tiny.cloud/docs/tinymce/latest/editor-size-options/) komplett überarbeitet. Grund: ein bereits aktives `autoresize`-Plugin im Profil hat den neu gesetzten `height`-Wert schweigend ignoriert; außerdem sind `%`, `vh` und `auto` laut Doku für `height` gar nicht unterstützt (nur für `width`).

Neue Felder im Abschnitt „Allgemeine Einstellungen“:

* **Höhe** – Zahl (px) oder CSS-Wert mit erlaubten Einheiten `px|pt|em|rem|cm|mm|in|pc`. Ungültige Einheiten (`%`, `vh`, `auto`) werden ignoriert und fallen auf `400` zurück; der Hilfetext weist darauf hin.
* **Breite** (neu) – optional, Zahl oder CSS-Wert inkl. `%`, `em`, `vh`. Leer = volle Container-Breite.
* **Min-Höhe / Max-Höhe** (neu) – Zahlen in Pixel. Begrenzen entweder den manuellen Resize-Handle oder (bei aktivem Autoresize) das automatische Wachstum.
* **Resize-Handle** (neu) – Dropdown `vertikal` (Default) / `aus` / `beide Richtungen`. Gibt `resize`-Option in der Config aus.
* **Autoresize** (neu) – Checkbox, aktiviert das `autoresize`-Plugin und emittiert `min_height` + `autoresize_bottom_margin`. `height` wird in diesem Modus bewusst weggelassen, weil TinyMCE es sonst ignoriert.

Generator + Re-Import kennen jetzt alle fünf Optionen und halten das `autoresize`-Plugin synchron mit der Checkbox – ein bestehendes Profil mit `autoresize` im Plugin-String wird beim Laden automatisch erkannt und das Kreuz gesetzt, ein Abschalten entfernt das Plugin wieder.

### PowerPaste-Einstellungen entfernt

PowerPaste ist ein kostenpflichtiges TinyMCE-Cloud-Plugin und in diesem AddOn nicht enthalten (Paste-Handling läuft über `cleanpaste`/`smartpaste`). Die beiden Felder **PowerPaste Word Import** und **PowerPaste HTML Import** im Profil-Assistenten haben daher nichts bewirkt, außer unnötige `powerpaste_*`-Optionen in die generierte Config zu schreiben, die von der lokalen TinyMCE-Installation ohnehin ignoriert wurden.

* UI-Felder entfernt (`profile_builder.js`).
* Generator-Output produziert keine `powerpaste_*`-Zeilen mehr.
* Re-Import-Mapping entfernt.
* `install.php`: Default-Profile 1 (*full*) und 3 (*default*) enthalten die `powerpaste_*`-Zeilen nicht mehr.
* i18n-Keys `tinymce_powerpaste_word_import` / `…_html_import` sowie die Einträge in `Provider/Assets.php` entfernt.

### Link-Schema im YForm-Link-Config-Block ist jetzt erklärt

Die Spalte **Link-Schema (opt.)** in der YForm-Link-Konfiguration war in der UI bisher ohne Erklärung. Nutzer wussten nicht, wofür das Feld gedacht ist und was sie dort eintragen sollen.

* Direkt unter der Tabelle steht jetzt ein Hilfetext:
  * Platzhalter `[id]` = ID des YForm-Datensatzes
  * Platzhalter `[field]` = ausgewählter Feldwert
  * Beispiele: `index.php?article_id=5&news=[id]` oder `/produkt/[id]`
  * Leer lassen = es wird nur der reine Feldwert als Link-Text eingefügt.
* Neuer i18n-Key `tinymce_link_schema_help` (de/en).

### Profil-Assistent – Visuelle Unterscheidung nach Plugin-Herkunft

Die Plugin- und Toolbar-Listen zeigen jetzt auf einen Blick, woher ein Eintrag kommt. Das ersetzt die bisherige rein textuelle „FOR“-Kennzeichnung, die nur am `for_`-Namenspräfix hing.

* **Blau (#4b9ad9, REDAXO-Blau)** – in diesem AddOn mitgelieferte Plugins (die komplette `for_*`-Familie sowie Legacy-Plugins ohne `for_`-Präfix wie `mediapaste`, `snippets`, `cleanpaste`, `phonelink`, `quote`, `link_yform`). Die Erkennung basiert jetzt auf `PluginRegistry::getPlugins()` + URL-Abgleich gegen `rex_url::addonAssets('tinymce', '')`, nicht mehr auf dem Namen – dadurch werden auch Custom-Plugins korrekt markiert, die nicht dem `for_`-Schema folgen.
* **Grün (#5bb585)** – Plugins, die von externen REDAXO-AddOns in die Registry eingehängt werden (z. B. `writeassist`). Server-seitige Liste (`addon_plugins` / `addon_toolbar_buttons`) wird nach JS übergeben.
* Beide Farbschemata haben Varianten für Light- und Dark-Mode und wirken auf: Plugin-Reihe (Border/Background), Badge neben dem Namen, Toolbar-Button-Kachel, Hinzufügen-Button in der Verfügbar-Liste.
* Plugin- **und** Toolbar-Listen werden jetzt alphabetisch sortiert ausgeliefert, damit das Scannen bei vielen Plugins einfacher wird.

### Profil-Assistent – HTML in Hilfetexten wird korrekt gerendert

Die Hilfetexte zu Höhe, Breite, Autoresize, Link-Schema und Bildbreite enthalten `<code>`/`<br>`-Markup. Bisher wurden die Tags durch `rex_i18n::msg()` escaped und als Literal-Text ausgegeben. Betroffene Keys laufen jetzt über `rex_i18n::rawMsg()` in [lib/TinyMce/Provider/Assets.php](public/redaxo/src/addons/tinymce/lib/TinyMce/Provider/Assets.php):

* `tinymce_height_help`, `tinymce_width_help`, `tinymce_autoresize_help`, `tinymce_link_schema_help`, `tinymce_imagewidth_help`

Version 8.4.1
-------------------------------

### `for_toc` – Layout-Fix: Nummer und Text überschneiden sich bei tiefer Verschachtelung

Bei geordneten TOCs mit mehrstelligen Zählern (`1.12.5`, `2.10.3` …) reichte die feste `min-width: 2.2em` am `::before`-Pseudo nicht aus und der Text schob sich über die Nummer. Umstellung auf Flex-Layout:

* `li.for-toc__item` ist jetzt `display: flex` mit `align-items: baseline` und `gap: var(--for-toc-number-gap)`.
* Der `::before`-Counter ist ein `flex: 0 0 auto`-Item mit `white-space: nowrap`, wächst also mit längeren Zählern mit und kollidiert nie mit dem Titel-Text.
* Gilt für Frontend-CSS ([assets/css/for_toc.css](public/redaxo/src/addons/tinymce/assets/css/for_toc.css)) und das im Editor inline injizierte Parallel-Stylesheet.

### Install/Update: `Class "FriendsOfRedaxo\TinyMce\Utils\DemoProfile" not found` behoben

Bei einer frischen Installation (und in manchen Update-Szenarien) ist Composers Classmap-Cache noch nicht (neu) aufgebaut, bevor `install.php`/`update.php` läuft – der REDAXO-Autoloader findet die AddOn-Klassen dann nicht, und das Demo-Profil-Setup bricht mit `Class "FriendsOfRedaxo\TinyMce\Utils\DemoProfile" not found` ab. Weil install.php **in** der AddOn-Installation läuft, brach auch die ganze Installation ab (der temporäre Ordner `redaxo/src/addons/.new.tinymce/` wurde vom REDAXO-Installer wieder zurückgerollt).

* `install.php` und `update.php` laden jetzt alle PHP-Dateien unter `lib/TinyMce/` rekursiv via `RecursiveIteratorIterator` + `require_once` als Fallback. Funktioniert unabhängig vom Classmap-Status.
* Beim Update: Vor jedem `require_once` wird per `class_exists`/`interface_exists`/`trait_exists`/`enum_exists` geprüft, ob die Klasse bereits vom Autoloader geladen wurde (aus dem alten `tinymce/`-Pfad). Vermeidet `Cannot declare class … already in use`, weil die Update-Skripte im `.new.tinymce`-Pfad laufen.

### Cache-Busting für externe Plugin-URLs

Bisher lud TinyMCE die `plugin.min.js` der FOR-Plugins unter statischen URLs (`/assets/addons/tinymce/scripts/tinymce/plugins/<name>/plugin.min.js`) – ohne Versions-Querystring. Folge: Nach AddOn-Updates blieben alte Plugin-Dateien beliebig lange im Browser-Cache hängen, und Bugfixes wie der heutige `cleanpaste`-Schutz griffen erst nach manuellem Hard-Reload.

* `PluginRegistry::addPlugin()` hängt jetzt automatisch `?v={addon-version}` an jede Plugin-URL (sofern noch kein Querystring vorhanden). Browser lädt nach jedem AddOn-Update garantiert die neuen Plugin-Dateien.

### `cleanpaste` – FOR-Plugin-Markup geschützt (**Root-Cause für defektes `for_oembed`-Rendering**)

`cleanpaste` strippte per PastePreProcess alle `data-*`-Attribute und alle Klassen, die nicht in `preserve_classes` standen. Da `for_oembed` beim Einfügen einer YouTube/Vimeo-URL selbst im PastePreProcess die URL in seine Live-Preview-HTML (`<figure class="for-oembed …" data-for-oembed-url="…">…`) verwandelt, riss cleanpaste direkt danach alle `for-…` Klassen und `data-for-…` Attribute wieder raus – Ergebnis: rohes iframe ohne Overlay, Chrome oder Play-Button. Gleicher Konflikt potenziell auch mit `for_video`, `for_images`, `for_checklist`, `for_toc`, `for_footnotes`.

* Neue interne Schutzliste (nicht konfigurierbar, nicht überschreibbar):
    * Klassen mit Präfix `for-*` sowie `media` bleiben immer erhalten.
    * Attribute mit Präfix `data-for-*` sowie `data-mce-selected` werden nie entfernt.
* Elemente, die innerhalb eines geschützten FOR-Figures liegen (`<figure class="for-…">`, `<figure class="media">` oder `<oembed>`), werden komplett übersprungen – keine Klassen-/Style-/ID-/Data-Bereinigung, keine Tag-Whitelist-Anwendung.
* User-seitige Konfiguration (`preserve_classes`, `preserve_styles`, etc.) bleibt unverändert – die Schutzliste wirkt zusätzlich.

### Demo-Profil: Core-`image`/`media` entfernt – `for_oembed` funktioniert jetzt korrekt

Das Demo-Profil aktivierte versehentlich sowohl die Core-Plugins `image` + `media` als auch deren FOR-Nachfolger `for_images` + `for_oembed`. Das Core-`media`-Plugin hängt sich an `<figure class="media"><oembed></oembed></figure>` und ersetzt den Block während der Initialisierung durch ein eigenes Live-iframe – damit verliert `for_oembed` seine Overlay-/Chrome-/Play-Struktur und der im Screenshot sichtbare Zustand entsteht (iframe läuft roh, „YouTube"-Title klebt an der URL, Play-Button bricht).

* `image` und `media` aus der Demo-Plugins-Liste entfernt. `for_images` und `for_oembed` übernehmen die Aufgaben vollständig (siehe FOR_PLUGINS.md → Core-Plugins ersetzen).
* Verwaiste Core-`image`-/`quickbars`-Optionen (`image_caption`, `image_advtab`, `image_uploadtab`, `quickbars_image_toolbar`) aus dem Demo-Profil entfernt und `image` aus `contextmenu` gestrichen – TinyMCE 8.2+ gibt dafür sonst Konsolen-Warnings aus („… is not a registered option").
* `update.php` lief automatisch → Demo-Profil wurde überschrieben.
* Empfehlung bleibt: wer `for_images`/`for_oembed` nutzt, sollte `image` und `media` aus dem eigenen Profil entfernen.

### `for_images` – Option-Registrierung für TinyMCE 8.2+ gefixt

TinyMCE 8.2 validiert Option-Defaults jetzt strikt. Die drei `for_images`-Optionen (`imagewidth_presets`, `imagealign_presets`, `imageeffect_presets`) waren mit `processor: 'object[]', default: null` registriert – ein typischer Fall, der früher stillschweigend akzeptiert wurde, jetzt aber mit `Invalid default value passed for the "<option>" option. The value must be a object[].` in der Konsole abbricht. Folge: die Plugin-Initialisierung lief nicht sauber durch, nachfolgende Plugins (`for_oembed` Chrome/Play, Styles) wirkten "halb geladen".

* Defaults von `null` auf `[]` umgestellt (valide leere `object[]`-Arrays).
* `getConfig()` prüft jetzt zusätzlich auf leere Arrays, damit trotz legitimer `[]`-Werte die internen Fallback-Presets greifen (`defaultWidthPresets`, `defaultAlignPresets`, `defaultEffectPresets`).
* Plugin rebuilt + `assets:sync`.

### `for_checklist` – Feature-Variante: Default = gestrichelter Rahmen

Bisher griff die gestrichelte Rahmenoptik in der Feature-Liste nur bei explizit `data-checked="false"`. Bei frisch eingefügten `<li>`-Items oder Legacy-Markup ohne Attribut wurde kurzzeitig der solide Default-Rahmen gezeigt, erst beim zweiten Toggle-Klick wurde gestrichelt.

* CSS-Regel (Frontend + Editor-Inline) umgestellt auf `li.for-checklist__item:not([data-checked="true"])::before` → unchecked ist jetzt **by default** gestrichelt, unabhängig davon, ob das Attribut (noch) fehlt.
* Demo-Seite (`pages/main.php`) auf aktuelle Syntax (`data-checked="true|false"`) umgestellt – vorher veraltetes `for-checklist__item--done` Markup.

### `for_toc` – Heading-IDs bleiben erhalten (Backlinks im Editor funktionieren wieder)

Das `for_toc`-Plugin whitelistete in seinem `editor.schema.addValidElements()` nur ein minimales Set von Attributen für `<a>` (`a[href]`) und hatte `h1–h6` gar nicht erwähnt. Ergebnis: beim initialen `SetContent` (z. B. Demo-Seite im Backend) hat TinyMCE alle `id`-Attribute auf den Überschriften gestrippt – die Anker wie `#for-toc-beispiele` liefen ins Leere, Klicks im TOC taten im Editor nichts.

* Schema erweitert um `h1[id|class]` bis `h6[id|class]` sowie `a[href|id|class|name|target|rel|title]`.
* Heading-IDs werden jetzt zuverlässig durch `SetContent` und Re-Sync durchgereicht.
* Keine Migration nötig – existierende Inhalte profitieren automatisch beim nächsten Laden.

### `for_toc` – Hierarchische Nummerierung im Frontend-Stylesheet

`assets/css/for_toc.css` nummeriert **geordnete** Inhaltsverzeichnisse (`<ol class="for-toc__list">`) jetzt automatisch hierarchisch über CSS-Counters:

```
1. Hauptpunkt
   1.1 Unterpunkt
      1.1.1 Unter-Unterpunkt
```

* Umsetzung ohne JS über `counter-reset: for-toc-item` + `counters(for-toc-item, ".")` auf `li.for-toc__item::before`.
* **Editor-Parität:** Die gleichen Counter-Regeln werden zusätzlich via `editor.dom.addStyle()` beim Editor-Init im TinyMCE-Iframe angewendet. Redakteure sehen die Nummerierung **unmittelbar im Editor**, nicht erst im Frontend.
* Neue CSS-Variablen zum Anpassen: `--for-toc-number-separator`, `--for-toc-number-suffix`, `--for-toc-number-color`, `--for-toc-number-font-weight`, `--for-toc-number-min-width`, `--for-toc-number-gap`.
* `<ul>`-TOCs (unsortiert) bleiben unverändert beim klassischen Bullet-Look.
* Filler-Einträge (übersprungene Heading-Ebenen, z. B. h2 → h4) werden nicht mitgezählt (`counter-increment: none`) und erzeugen auch kein Nummern-Präfix.
* Dark-Mode-Override für `--for-toc-number-color` ergänzt.

### Neues Plugin: `for_markdown` – Markdown → HTML Konverter (Dialog)

Dialog-basierter Markdown-Import für TinyMCE. Kein Autodetect, keine Paste-Interception – der Redakteur öffnet bewusst den Dialog, fügt Markdown ein, das Ergebnis wird als sauberes HTML an der Cursor-Position eingesetzt.

* **Plugin-Name:** `for_markdown`
* **Toolbar-Button / Menüeintrag:** `for_markdown_paste` (Label „Markdown einfügen…")
* **Command:** `forMarkdownOpenDialog`
* **Kollisionsfrei** zum bestehenden `markdowneditor`-AddOn – komplett eigener Namespace `for_markdown*` / `for-markdown-*`.
* **Engine:** [markdown-it 14](https://github.com/markdown-it/markdown-it) gebundelt im Plugin-Bundle (kein CDN, offline-fähig). Features: CommonMark + GFM-Dialekte, Tables, Autolinks (`linkify: true`), SmartQuotes (`typographer: true`), harte Zeilenumbrüche (`breaks: true`), fenced Code.
* **Tasklist-Interop → `for_checklist`:** `- [ ]` und `- [x]` werden als Feature-Checkliste ausgegeben, d. h. `<ul class="for-checklist for-checklist--feature"><li class="for-checklist__item" data-checked="true|false">…</li></ul>`. Keine zusätzlichen Form-Inputs im Save-Output.
* **Fenced Code → `codesample`-kompatibel:** ```` ```php ```` erzeugt `<pre class="language-php"><code>…</code></pre>` und wird damit vom Core-Plugin `codesample` korrekt gerendert und erneut editierbar.
* **Registrierung:** `PluginRegistry::addPlugin('for_markdown', …, 'for_markdown_paste')` in `boot.php`. Menu-Item-Label zentral in `custom_menu_items` (Profil-Assistent, Einfügen-Menü-Builder).
* **Demo-Profil:** In der mitgelieferten `demo`-Konfiguration (`lib/TinyMce/Utils/DemoProfile.php`) sowohl in der Plugin-Liste, der Toolbar als auch im Einfügen-Menü aktiviert.
* **Build:** `custom_plugins/for_markdown/` – esbuild-IIFE, minified (`plugin.min.js`, ~150 KB inkl. markdown-it). `pnpm run build` kopiert automatisch nach `assets/scripts/tinymce/plugins/for_markdown/` und `assets/vendor/tinymce/plugins/for_markdown/`.

Version 8.4.0
-------------------------------

### Security: API-Endpoint `tinymce_get_snippets` gegen anonymen Zugriff geschützt

Der API-Endpoint `rex-api-call=tinymce_get_snippets` war zuvor uneingeschränkt erreichbar (`published = true`, keine Auth-Prüfung) und hat Name + HTML-Inhalt **aller** konfigurierten Snippets an beliebige Anfragende ausgeliefert. Snippets sind Redaktions-Bausteine, die Interna oder nicht-öffentliche HTML-Fragmente enthalten können.

* **Fix:** `execute()` prüft jetzt zu Beginn `rex::getUser()`; ohne Login wird mit HTTP 403 + JSON-Fehler abgebrochen.
* Die beiden anderen Endpoints bleiben unverändert:
  * `tinymce_media_upload` – bewusst auch anonym erreichbar, aber nur wenn `upload_enabled` in den Paste-Settings aktiv ist; ohne User wird zwingend die konfigurierte Default-Kategorie verwendet. Backend-User durchlaufen die volle `rex_media_perm`-Prüfung.
  * `tinymce_media_categories` – liefert ohne User nur die Root-Kategorie, also kein Informationsleck.

### Sticky Toolbar & Koexistenz mit REDAXO-Topnav

* **`toolbar_sticky: true` als neuer Default** in allen mitgelieferten Profilen (`full`, `light`, `default`, `demo`). Toolbar und Menüleiste kleben beim Scrollen im langen Editor-Content am oberen Viewport-Rand, `toolbar_sticky_offset: 0`.
* **Automatische Migration in bestehenden Profilen** (`update.php`): Profile ohne `toolbar_sticky`-Setting werden einmalig ergänzt; bereits vorhandener `toolbar_sticky_offset: 50` wird auf `0` normalisiert. Profile mit eigener Einstellung bleiben unberührt.
* **Neues JS `assets/scripts/sticky_navbar_freeze.js`** (automatisch geladen über `Provider\Assets::provideBaseAssets()`) – Workaround für die automatische Einblende-Logik der REDAXO-Topnav (`#rex-js-nav-top`, siehe `be_style/plugins/redaxo/assets/javascripts/redaxo.js`, Methode `navigationBar.update`): Beim Hochscrollen taucht der Kopf sonst während des Schreibens auf und überdeckt die sticky TinyMCE-Toolbar. Unser Script hält die Topnav versteckt, solange mindestens ein TinyMCE-Editor auf der Seite existiert und `window.scrollY >= 50`. Am Seitenanfang wird sie wieder freigegeben. Umgesetzt per `MutationObserver` auf der Klassen-Liste der Topnav + passivem Scroll-Listener (race-condition-sicher gegen schnelles Scrollen). Debug-Helper in der Browser-Konsole: `window.__tinyNavFreeze()`.

### Neues gesperrtes Demo-Profil (`demo`)

* **Dedicated profile** für die Demo-Seite (Backend → TinyMCE → Demo): aktiviert bewusst **alle FOR-Plugins**, volle Toolbar, alle Einfügen-/Format-/Werkzeuge-Menüs, Quickbars, `a11y_new_window_warning`, Bild-Presets, theme-aware Skin/Content-CSS.
* **Locked im Backend**: In der Profilliste per gelbem Lock-Badge (`<i class="fa-lock"></i>`) in der Beschreibungsspalte markiert. Edit, Clone und Delete sind für dieses Profil im UI gesperrt (`pages/profiles.php`). Ein Edit-Aufruf zeigt stattdessen einen Info-Kasten mit „Zurück zur Liste".
* **Auto-Refresh:** Die Config lebt in `lib/TinyMce/Utils/DemoProfile.php` als Single Source of Truth. `install.php` und `update.php` rufen `ProfileHelper::ensureProfile(..., forceUpdate: true)` auf – bei jedem AddOn-Update wird das Demo-Profil vollständig überschrieben.
* **Neue Lang-Keys** (de/en/sv): `tinymce_profile_demo_locked_badge`, `tinymce_profile_demo_locked`, `tinymce_profile_demo_locked_info`, `tinymce_back_to_list`.

### Profil-Assistent: Einfügen-Menü & Config-Loader

* **FOR-Plugin-Hervorhebung:** Eigene FriendsOfREDAXO-Plugins (`for_*`) bekommen im Assistenten ein farbiges **„FOR"-Badge** und werden bei Plugin-Liste, verfügbaren Toolbar-Buttons und Custom-Menu-Items optisch hervorgehoben.
* **Einfügen-Menü-Builder:** Neue Sektion im Profil-Assistenten zum Zusammenklicken der Einträge des Menüleisten-Menüs „Einfügen". Alle Custom-Plugin-Menüeinträge (`for_oembed`, `for_video`, `for_htmlembed`, `for_checklist`, `for_checklist_feature`, `for_footnote`, `for_a11y`) sind als eigene Button-Gruppe auswählbar. Drag & Drop zum Sortieren; Ergebnis wird als `menu: { insert: { title, items } }` in die Profilkonfiguration geschrieben.
* **Bestehende Konfiguration übernehmen:** Beim Öffnen eines Profils wird der Assistent automatisch mit den Werten aus der aktuell gespeicherten Konfiguration (Plugins, Toolbar, Menü, Quickbars, Image-Width-Presets, YForm-Link-Tabellen, Advanced-Settings, TOC …) befüllt. Zusätzlich steht ein „Bestehende Konfiguration übernehmen"-Button manuell zur Verfügung, falls nachträglich Änderungen ohne den Assistenten gemacht wurden.
* **Migration:** Keine DB-Änderung notwendig – die `extra`-Spalte speichert wie gehabt den rohen JS-Body. Bestehende Profile bleiben 1:1 funktionsfähig. Beim Addon-Update wird `profiles.js` automatisch neu generiert (über `update_profiles`-Flag in `update.php`).

### Neues Plugin: `for_a11y` – Accessibility-Checker (on-demand)

Prüft den aktuellen Editor-Inhalt gegen gängige Barrierefreiheits-Regeln und zeigt die Befunde in einem geführten Dialog an. Läuft ausschließlich auf Knopfdruck, verändert den Inhalt **nicht** automatisch. Inspiriert vom kommerziellen TinyMCE `a11ychecker`, aber Open Source.

* **Plugin-Name:** `for_a11y`
* **Toolbar-Button & Menüeintrag:** `for_a11y` ("Barrierefreiheit prüfen")
* **Command:** `forA11yCheck`
* **Geführter Dialog-Workflow:** Ein Befund nach dem anderen mit Severity-Badge, Titel, Regel-ID, Beschreibung und Preview des betroffenen Elements. Navigation per **◀ / ▶** durch alle Befunde.
* **Schwebendes, verschiebbares Panel (non-modal):** Der Befund-Dialog ist **kein Modal** mit Backdrop, sondern ein frei positionierbares Panel. Am Header-Balken (⠿) per Drag verschieben, um die Sicht auf das markierte Element freizugeben. Der Editor bleibt parallel voll bedienbar.
* **Pro-Befund-Aktionen:**
  * **Ignorieren** – entfernt den Befund aus der aktuellen Session (Event `A11ycheckIgnore`).
  * **Element bearbeiten** – schließt den Dialog, springt zum Element und selektiert es im Editor (z. B. um es über die normale Bild-/Link-/Tabellen-Toolbar zu reparieren).
  * **Neu prüfen** – führt ein frisches Audit aus.
* **Editor-Highlighting:** Solange der Dialog offen ist, werden alle Befund-Elemente im Editor markiert (rot = Fehler, orange = Warnung, blau-gestrichelt = Hinweis). Das aktuell ausgewählte Element pulsiert zusätzlich. Beim Schließen des Dialogs verschwinden die Marker.
* **Public API** am Plugin:
  ```javascript
  tinymce.activeEditor.plugins.for_a11y.toggleaudit();   // öffnet Dialog
  const issues = tinymce.activeEditor.plugins.for_a11y.getReport();  // nur Audit, ohne UI
  ```
* **Events:** `A11ycheckStart` (mit `total`), `A11ycheckStop`, `A11ycheckIgnore` (mit `issue`).
* **Regeln** (einzeln abschaltbar via `a11y_rules: { "regel-id": false }`):
  * `img-missing-alt` – Bild ohne alt-Attribut (Fehler; in Textlinks: Warnung, alt="" fehlt)
  * `img-alt-in-text-link` – alt-Text, obwohl das umschließende `<a>` schon sichtbaren Text hat (Warnung)
  * `img-empty-alt-nondeco` – alt="", ohne dass das Bild dekorativ (`role="presentation"`) oder in einem Textlink ist (Warnung)
  * `link-no-accname` – Link ohne erkennbaren accessible name (Fehler)
  * `link-generic-text` – „hier", „klicken", „weiterlesen", „read more", … (Warnung). Liste konfigurierbar über `a11y_generic_link_texts`
  * `link-new-window` – `target="_blank"` ohne Hinweis im Text/`aria-label`/`title` (Hinweis). Abschaltbar über `a11y_new_window_warning: false`
  * `heading-empty` – leere Überschrift (Warnung)
  * `heading-skip` – Hierarchie-Sprung (z.B. h1 → h3) (Warnung)
  * `table-no-th` – Datentabelle ohne `<th>` (Warnung)
  * `table-no-caption` – Tabelle ohne `<caption>` (Hinweis)
  * `table-th-no-scope` – Matrix-Tabelle mit Zeilen- und Spaltenköpfen, deren `<th>` kein `scope` haben (Hinweis)
  * `iframe-no-title` – `<iframe>` ohne title-Attribut (Warnung)
* **Default-Profile-Hinweis:** Wenn `for_images`, `for_oembed`, `for_video`, `for_htmlembed` genutzt werden, können die Core-Plugins `image` und `media` aus dem TinyMCE-Profil entfernt werden. Unsere Plugins liefern bessere Vorschau, konsistente Preset-Klassen und sauberere Save-Formate.

Verwendung im Profil:

```javascript
plugins: 'for_a11y ...',
toolbar: '... for_a11y',
```

### Neues Plugin: `for_toc` – Inhaltsverzeichnis (mit Live-Sync)

Generiert aus den Überschriften im Editor einen `<nav class="for-toc">`-Block mit verschachtelter Liste und springt automatisch bei jeder Änderung mit – ähnlich dem `for_footnotes`-Pattern.

* **Plugin-Name:** `for_toc`
* **Toolbar-Buttons:** `for_toc_insert`, `for_toc_update`
* **Menü-Item:** `for_toc` (fürs Insert-Menü)
* **Commands:** `forTocInsert`, `forTocUpdate`, `forTocSettings`
* **Live-Sync:** beim Tippen/Einfügen/Undo/Redo wird die TOC automatisch neu generiert. Verwaiste Einträge entfernt, neue ergänzt.
* **Stabile IDs:** Überschriften bekommen eindeutige Slug-IDs (`for-toc-<slug>`) und behalten diese beim Re-Edit.
* **Einstellungen (Dialog):** Titel, Ab-Ebene, Bis-Ebene, `<ol>` oder `<ul>` – gespeichert als `data-for-toc-*` am Block.
* **Context-Toolbar:** Aktualisieren, Einstellungen, Entfernen.
* **Intelligente Verschachtelung:** Überspringt ein Heading eine Ebene (z. B. h2 → h4), bleibt das TOC-Markup trotzdem valide (Filler-Items).
* **Frontend:** `assets/css/for_toc.css` – framework-agnostisch über CSS-Variablen (`--for-toc-*`), Dark-Mode ready, optional `.for-toc--sticky` für Sidebar-TOCs. Dazu optional `assets/js/for_toc.js` für Active-Section-Highlighting (IntersectionObserver, setzt `for-toc__link--active` + `aria-current`).

Verwendung im Profil:

```javascript
plugins: 'for_toc ...',
toolbar: 'for_toc_insert for_toc_update ...',
```

### Neues Plugin: `for_video` – Lokale Videos aus dem Mediapool

Einbettung von lokalen Videodateien (mp4, webm, ogg) aus dem REDAXO-Mediapool – mit Poster, Click-to-Play-Vorschau im Editor und den gleichen Breiten-/Ausrichtungs-/Seitenverhältnis-Presets wie `for_oembed`.

* **Plugin-Name:** `for_video`
* **Toolbar-Button / Menü / Context-Toolbar / Doppelklick** – Edit per Dialog.
* **Commands:** `forVideoInsert`, `forVideoEdit`
* **Save-Format (HTML5):**

  ```html
  <figure class="media for-video [user-klassen]">
      <video src="/media/movie.mp4" poster="/media/poster.jpg" controls playsinline preload="metadata">
          <a href="/media/movie.mp4">movie.mp4</a>
      </video>
  </figure>
  ```

* **Mediapool-Picker:** Dialog mit Feldern für Video-Datei und Poster-Bild, jeweils mit „Aus Mediapool wählen…"-Button (nutzt `openMediaPool()`).
* **Optionen im Dialog:** Controls, Autoplay (setzt automatisch `muted`), Loop, Muted, Playsinline.
* **Editor-Vorschau:** Poster-Bild + Play-Overlay + Toolbar-Header (Badge, Dateiname, Stop, Auswahl-Handle). Klick aufs Video aktiviert eine echte `<video>`-Instanz mit Controls, Stop-Button kehrt zur Vorschau zurück. `contenteditable="false"`.
* **Preset-Klassen** (analog zu `for_oembed`, mit Präfix `for-video--`):
  * Breite: `for-video--w-sm`, `-w-md`, `-w-lg`, `-w-full`
  * Ausrichtung: `for-video--align-left`, `-align-center`, `-align-right`
  * Seitenverhältnis: `for-video--ratio-4-3`, `-ratio-1-1`, `-ratio-9-16`, `-ratio-21-9` (16:9 = Default, keine Klasse)
* **Konfigurierbar per Profil-Option:** `videowidth_presets`, `videoalign_presets`, `videoratio_presets` (selbes Format wie `oembed*_presets`).
* **Frontend-CSS:** `assets/css/for_video.css` für Default-Klassen.
* **Zwei-stufiger Save-Schutz:** `GetContent`-String-Hook + `PreProcess`-DOM-Tree-Hook über `tinymce.html.DomParser` stellen sicher, dass niemals Preview-Markup (Toolbar/Buttons) in der Textarea landet.

Verwendung im Profil:

```javascript
plugins: 'for_video ...',
toolbar: 'for_video ...',
```

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

### Neues Plugin: `for_oembed` – YouTube/Vimeo-Einbettung (CKE5-kompatibel)

Video-Einbettung per URL-Paste mit Live-Preview im Editor, Save-Format voll kompatibel zu CKEditor 5.

* **Plugin-Name:** `for_oembed`
* **Toolbar-Button, Menü, Context-Toolbar, Doppelklick** – Edit per Dialog
* **Commands:** `forOembedInsert`, `forOembedEdit`
* **Save-Format (CKE5-kompatibel):** `<figure class="media"><oembed url="…"></oembed></figure>`
* **Editor-Preview:** echter iframe mit Provider-Badge (YouTube rot, Vimeo blau), Overlay fängt Klicks ab, Video spielt im Editor nicht ab, Cursor kann nicht reinrutschen. `contenteditable="false"`.
* **Paste-Erkennung:** Plain-URLs aus YouTube (watch, shorts, youtu.be, embed, nocookie) und Vimeo werden beim Paste automatisch in einen Video-Block umgewandelt.
* **Bidirektionale Konvertierung:** `SetContent` entfaltet vorhandene `<oembed>`-Tags in die Preview, `GetContent` baut sie beim Speichern wieder zusammen – so bleibt der gespeicherte Content immer im CKE5-Format.
* **PHP-Renderer** `\FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer::render($html)` wandelt die `<oembed>`-Tags im Frontend in lauffähige Player um.
* **Optionale vidstack-Integration:** Ist das [`vidstack`-AddOn](https://github.com/FriendsOfREDAXO/vidstack) installiert, nutzt der Renderer automatisch `<media-player>` von vidstack. Ohne vidstack gibt es einen responsiven `<iframe>`-Fallback. `OembedRenderer::registerFrontendAssets()` bindet die vidstack-Assets ein, falls verfügbar.
* **JS-Helper** `assets/js/for_oembed.js` für clientseitiges Auffalten (auch vidstack-aware).

Verwendung im Profil:

```javascript
plugins: 'for_oembed ...',
toolbar: 'for_oembed ...',
```

Frontend (PHP):

```php
use FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer;
echo OembedRenderer::render($article->getValue('art_text'));
```

### Neues Plugin: `for_htmlembed` – Geschützte HTML-/JS-Einbettung

Ideal für Widgets, Tracking-Pixel, Social-Embeds, `<iframe>`, Mini-Apps – Redakteure können den Block nicht versehentlich im Fließtext zerschießen.

* **Plugin-Name:** `for_htmlembed`
* **Toolbar-Button & Menü:** `for_htmlembed`
* **Commands:** `forHtmlEmbedInsert`, `forHtmlEmbedEdit`
* **HTML-Format (bleibt im Save-Output erhalten):** `<div class="for-htmlembed" contenteditable="false">…Code…</div>`
* **Bearbeitung per Dialog:** Toolbar-Button, Doppelklick oder Context-Toolbar-Edit-Button öffnen einen Dialog mit Textarea. Die Textarea bekommt die Klasse `rex-js-code-editor` und `data-mode="htmlmixed"` – das code-AddOn klinkt sich automatisch ein, Fallback ist Monospace.
* **Schutz im Editor:** `contenteditable="false"` auf dem Wrapper verhindert versehentliches Editieren, Cursor kann nicht in den Code reinrutschen. Das Plugin setzt das Attribut bei jedem `SetContent` neu, falls es verloren geht.
* **Schema-Erweiterung:** `<script>`, `<iframe>`, `<style>`, `<noscript>` werden als valide Elemente registriert, Sanitization wird deaktiviert (`xss_sanitization: false`, `allow_script_urls: true`).
* **Editor-Chrome per CSS:** gestrichelter Rahmen + blaues Badge mit Dateityp (`script · 248 Zeichen`) – **nur** im Editor-Iframe, im Frontend sichtbar als schlichtes `<div>`.
* **Context-Toolbar:** Edit- und Remove-Button erscheinen, wenn der Embed-Block angeklickt ist.

Verwendung im Profil:

```javascript
plugins: 'for_htmlembed ...',
toolbar: 'for_htmlembed ...',
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

Beispiel-Einbindung der Styles im Frontend (direkt im Template, da `rex_view::addCssFile()` nur im Backend existiert):

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_checklist.css') . '">';
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
