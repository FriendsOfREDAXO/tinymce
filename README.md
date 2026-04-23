# TinyMCE 8 - REDAXO-AddOn 

Stellt den TinyMCE 8 Editor im CMS REDAXO bereit. 

![Screenshot](https://github.com/FriendsOfREDAXO/tinymce/blob/assets/screenshot.png?raw=true)

## Anwendung: 

**Moduleingabe**

```php
 <textarea class="tiny-editor form-control" data-profile="full" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>
```

- `data-profile="full"`definiert das gewünschte Profil 
- `data-lang="de"`legt die Sprache für den Editor fest

> Wählt man als profil `data-profile="default"`, erhält man den Editor in der Grundkonfiguration. 

**Modulausgabe**

```php
REX_VALUE[id=1 output=html]
```

### Verwendung in YForm

- Im individuellen Attribute-Feld: ``` {"class":"tiny-editor","data-profile":"full"} ```
- Weitere Attribute kommagetrennt möglich

### Verwendung in MForm

```php
$mform = new MForm();
$mform->addTextAreaField(1, 
        array(
        'label'=>'Text',
        'class'=>'tiny-editor', 
        'data-profile'=>'full')
        );
echo $mform->show();
```

## Konfiguration

Zur Konfiguration eigener Profile bitte in das default Profil schauen und die [TinyMCE 8 Doku](https://www.tiny.cloud/docs/tinymce/latest/) beachten.

### Migration von TinyMCE 5/6 zu TinyMCE 8

Bei der Aktualisierung von älteren Versionen (tinymce4, tinymce5, tinymce6) werden bestehende Profile automatisch migriert:

- Der GPL-Lizenzschlüssel wird automatisch hinzugefügt
- Das veraltete Template-Plugin wird automatisch entfernt
- Alle anderen Einstellungen bleiben erhalten

**Wichtig für eigene/benutzerdefinierte Profile:**
- Fügen Sie `license_key: 'gpl',` am Anfang der Konfiguration hinzu
- Entfernen Sie das `template` Plugin aus der Plugin-Liste und Toolbar
- Prüfen Sie die Dark-Mode Konfiguration (siehe unten)

### TinyMCE 8 License Key

Ab TinyMCE 8 ist ein `license_key` in der Konfiguration erforderlich. Für Open-Source-Nutzung:

```javascript
license_key: 'gpl',
```

Dieser Schlüssel ist in allen Standard-Profilen bereits enthalten. Für eigene Profile muss dieser manuell hinzugefügt werden.

### Dark-Mode in die Profile übernehmen

Für Dark-Mode Unterstützung folgenden Code in den Profilen verwenden:

```javascript
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
```

### Media Manager Integration (Bild-Skalierung)

**Neu ab Version 8.0.0:** Raster-Bilder werden automatisch über den Media Manager eingebunden.

Standardmäßig werden JPG, JPEG, PNG, GIF und WebP über den Media-Manager-Type `tiny` ausgeliefert:

```
/media/tiny/dateiname.jpg
```

**Welche Dateitypen nutzen den Media Manager?**
- ✅ **Mit Media Manager:** JPG, JPEG, PNG, GIF, WebP
- ❌ **Direkter Pfad:** SVG, TIFF, BMP, Videos, Audio-Dateien

**Vorteile:**
- Automatische Skalierung und Optimierung der Bilder
- Funktioniert in Unterordner-Installationen (keine absoluten Pfade mehr)
- Admin-Kontrolle über Bildeffekte (Größe, Kompression, etc.)

**Media-Manager-Type einrichten:**

Erstelle im REDAXO-Backend unter "Media Manager" einen neuen Type mit dem Namen `tiny` und füge die gewünschten Effekte hinzu (z. B. "Resize" mit max-width: 1200px).

**Hinweis:** Existiert der Type nicht, liefert der Media Manager automatisch das Original aus (kein Fehler).

## Snippets (Textbausteine)

Das Addon enthält ein Plugin zur Verwaltung und Nutzung von Textbausteinen (Snippets).

### Verwaltung
Unter "TinyMCE" -> "Snippets" können Sie beliebige HTML-Schnipsel anlegen, bearbeiten und löschen.

### Nutzung im Editor
1. Aktivieren Sie das Plugin `snippets` in Ihrem Profil (im Standard-Profil "full" bereits enthalten).
2. Fügen Sie den Button `snippets` zur Toolbar hinzu.
3. Im Editor erscheint nun ein Dropdown-Menü, über das Sie die angelegten Snippets in den Text einfügen können.

## Style-Sets (CSS-Framework Styles)

Style-Sets ermöglichen die zentrale Verwaltung von CSS-Framework-spezifischen Styles wie UIkit 3 oder Bootstrap 5.

### Verwaltung
Unter "TinyMCE" -> "Style-Sets" können Sie:
- Eigene Style-Sets anlegen und bearbeiten
- Demo-Sets für UIkit 3 und Bootstrap 5 installieren
- Style-Sets importieren und exportieren (JSON)

### Profil-Zuordnung
Style-Sets können einzelnen Profilen zugewiesen werden:
- **Leer** = Style-Set gilt für alle Profile
- **Profilnamen** = Komma-getrennte Liste (z.B. `uikit, bootstrap-full`)

So können UIkit-Styles nur im UIkit-Profil erscheinen und Bootstrap-Styles nur im Bootstrap-Profil.

### Aufbau eines Style-Sets
- **Name**: Eindeutiger Bezeichner
- **Content CSS**: URL zum CSS-Framework (z.B. CDN-Link zu UIkit oder Bootstrap)
- **Style Formats**: JSON-Array mit TinyMCE style_formats Definitionen
- **Profile**: Optionale Zuordnung zu bestimmten Profilen

### Beispiel Style Format (JSON)
```json
[
    {
        "title": "Buttons",
        "items": [
            {"title": "Primary", "name": "uk-button-primary", "selector": "a", "classes": "uk-button uk-button-primary"},
            {"title": "Secondary", "name": "uk-button-secondary", "selector": "a", "classes": "uk-button uk-button-secondary"}
        ]
    }
]
```

**Wichtige Format-Typen:**
- `selector`: Wendet Klassen auf existierende Elemente an (z.B. `"selector": "a"` für Links)
- `block`: Erstellt ein Block-Element (z.B. `"block": "div"`)
- `inline`: Erstellt ein Inline-Element (z.B. `"inline": "span"`)
- `name`: Eindeutiger interner Name (verhindert Kollisionen)
- `wrapper`: Bei `true` wird das Element um die Auswahl gewickelt

## FOR Images Plugin (Bildformatierung)

Das `for_images` Plugin bietet umfassende Bildformatierung mit CSS-Framework-Unterstützung.

### Features
- **Preset-basierte Breiten:** Keine manuellen Pixel-Eingaben, nur vordefinierte CSS-Klassen
- **Ausrichtung:** Links, Rechts, Zentriert mit Framework-spezifischen Float-Klassen
- **Effekte:** Schatten, abgerundete Ecken, Rahmen als toggle-bare Optionen
- **Bildunterschriften:** Eigener Button zum Hinzufügen/Entfernen von Captions
- **Alt-Text:** Schnellzugriff-Button mit visuellem Status
- **Figure-Wrapping:** Automatisches Wrappen in `<figure>` für korrektes Float-Verhalten
- **Responsive:** Unterstützung für Breakpoint-Klassen (@s, @m, @l für UIkit; sm, md, lg für Bootstrap)

### Aktivierung

Im Profil `for_images` zu den Plugins hinzufügen. Der Profil-Assistent bietet eine komfortable UI mit Template-Auswahl.

### Konfiguration im Profil

```javascript
plugins: 'for_images image ...',

// Breiten-Presets
imagewidth_presets: [
    {label: 'Original', class: ''},
    {label: 'Klein', class: 'uk-width-small@m'},
    {label: 'Mittel', class: 'uk-width-medium@m'},
    {label: 'Groß', class: 'uk-width-large@m'},
    {label: '50%', class: 'uk-width-1-2@m'},
    {label: '100%', class: 'uk-width-1-1'}
],

// Ausrichtungs-Presets
imagealign_presets: [
    {label: 'Keine', class: ''},
    {label: 'Links', class: 'uk-float-left uk-margin-right uk-margin-bottom'},
    {label: 'Rechts', class: 'uk-float-right uk-margin-left uk-margin-bottom'},
    {label: 'Zentriert', class: 'uk-display-block uk-margin-auto'}
],

// Effekt-Presets (optional)
imageeffect_presets: [
    {label: 'Kein Effekt', class: ''},
    {label: 'Schatten klein', class: 'uk-box-shadow-small'},
    {label: 'Schatten mittel', class: 'uk-box-shadow-medium'},
    {label: 'Abgerundet', class: 'uk-border-rounded'},
    {label: 'Rahmen', class: 'uk-border'}
]
```

### Verfügbare Templates

Der Profil-Assistent bietet vorgefertigte Templates:

| Template | Beschreibung |
|----------|-------------|
| UIkit 3 | `uk-width-*`, `uk-float-*`, `uk-box-shadow-*` Klassen |
| Bootstrap 5 | `col-*`, `float-*`, `shadow-*` Klassen |
| Allgemein | Generische CSS-Klassen (`img-width-small`, etc.) |

### Context-Toolbar

Bei Bildauswahl erscheint eine Toolbar mit:
- **Breite:** Dropdown mit allen Breiten-Presets
- **Ausrichtung:** Toggle-Buttons (Links, Zentriert, Rechts, Keine)
- **Effekte:** Dialog zum Aktivieren/Deaktivieren von Effekten
- **Alt:** Alt-Text bearbeiten (leuchtet bei vorhandenem Alt-Text)
- **Caption:** Bildunterschrift hinzufügen/entfernen

### HTML-Ausgabe

```html
<figure class="uk-float-left uk-margin-right uk-margin-bottom uk-width-medium@m">
    <img class="uk-width-1-1" src="/media/bild.jpg" alt="Beschreibung" width="800" height="600">
    <figcaption>Optionale Bildunterschrift</figcaption>
</figure>
```

**Hinweis:** Das Bild erhält automatisch die passende 100%-Klasse (`uk-width-1-1` für UIkit, `w-100` für Bootstrap), damit es die Figure-Breite ausfüllt.

### Frontend-CSS für allgemeine Klassen

Wenn Sie **kein CSS-Framework** (UIkit, Bootstrap) verwenden und die "Allgemein"-Vorlage nutzen, benötigen Sie die mitgelieferte CSS-Datei im Frontend:

```html
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_images.css">
```

Oder via REDAXO:
```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_images.css') . '">';
```

Die CSS-Datei enthält:
- **Breiten:** `img-width-small`, `img-width-medium`, `img-width-large`, `img-width-full`, `img-width-25`...`img-width-75`
- **Ausrichtung:** `img-align-left`, `img-align-right`, `img-align-center`
- **Effekte:** `img-shadow-small/medium/large`, `img-rounded`, `img-border`
- **Responsive:** Floats werden auf mobilen Geräten automatisch aufgehoben

**Tipp:** UIkit- und Bootstrap-Nutzer benötigen diese Datei nicht, da die Framework-eigenen Klassen verwendet werden.

## Link YForm Plugin

Das `link_yform` Plugin ermöglicht es, Datensätze aus YForm-Tabellen direkt im Editor zu verlinken.

### Konfiguration im Profil

Fügen Sie `link_yform` zu den `plugins` und der `toolbar` hinzu. Definieren Sie dann die Tabellen über `link_yform_tables`:

```javascript
link_yform_tables: {
    title: 'YForm Datensätze',
    items: [
        {
            title: 'Projekt verlinken',
            table: 'rex_yf_project',
            field: 'title',
        },
        {
            title: 'Veranstaltung verlinken',
            table: 'rex_yf_event',
            field: 'name',
            url: '/event:'
        },
    ]
}
```

| Key | Typ | Beschreibung |
|---|---|---|
| title | String | Name des Dropdown-Buttons |
| items | Array | Liste der verlinkbaren Tabellen |

**Item-Konfiguration:**

| Key | Typ | Beschreibung |
|---|---|---|
| title | String | Titel im Menü (optional, sonst Tabellenname) |
| table | String | Name der YForm-Tabelle |
| field | String | Feldname, dessen Inhalt als Linktext übernommen wird |
| url | String | Optional: Schema für den internen Platzhalter-Link. Standard ist `tabellenname://`. <br>Beispiel: Ist `url` nicht gesetzt, wird `rex_yf_project://123` gespeichert. Ist `url: '/event:'` gesetzt, wird `/event:123` gespeichert. <br>Dieser Wert dient nur als interner Platzhalter und muss via Output-Filter (siehe unten) ersetzt werden. |

### URL-Ersetzung (Output Filter)

Die generierten Links (z.B. `rex_yf_project://123`) müssen im Frontend durch echte URLs ersetzt werden. Dazu dient ein Output-Filter in der `boot.php` Ihres Projekt-Addons:

```php
rex_extension::register('OUTPUT_FILTER', function(rex_extension_point $ep) {
    return preg_replace_callback(
        '@(rex_yf_project|rex_yf_event)://(\d+)@',
        function ($matches) {
            $table = $matches[1];
            $id = $matches[2];
            
            // Beispiel für URL-Generierung
            if ($table === 'rex_yf_project') {
                return rex_getUrl('', '', ['project_id' => $id]);
            }
            return '/index.php?id='.$id;
        },
        $ep->getSubject()
    );
});
```

## Clean Paste Plugin (`cleanpaste`)

Das `cleanpaste` Plugin ist ein freier Ersatz für das kostenpflichtige PowerPaste: Es bereinigt eingefügten Text automatisch von Office-/Google-Docs-Markup, unerwünschten Klassen, Styles und leeren Elementen.

### Features

- **Office-Cleanup:** Entfernt MS Word/Outlook/Google-Docs-Markup (`MsoNormal`, `docs-*`, `<o:p>`, mso-Conditionals, Smart Tags) bereits auf String-Ebene.
- **DOM-Cleanup:** Entfernt konfigurierbar `class`, `style`, `id`, `data-*` Attribute.
- **BR-Reduktion:** Reduziert aufeinanderfolgende `<br>`-Ketten.
- **Leer-Paragraphen:** Entfernt leere `<p>` nach dem Einfügen.
- **Positiv-Listen mit Regex:** Erlaubte Tags/Klassen/Styles/IDs/data-Attribute werden pro Profil definiert – alles andere wird verworfen. Regex-Patterns werden unterstützt (z. B. `^uk-.*`).

### Aktivierung

Im Profil `cleanpaste` zu den Plugins hinzufügen. Die Einstellungen werden zentral unter **TinyMCE → Paste-Einstellungen** gepflegt und in die generierte `profiles.js` eingebettet (funktioniert daher auch im Frontend).

```javascript
plugins: 'cleanpaste ...',
```

### Einstellungsseite

Unter **TinyMCE → Paste-Einstellungen** finden Sie eine GUI zur Konfiguration der Allow-Lists:

- **Erlaubte Tags**
- **Erlaubte Klassen** (unterstützt Regex)
- **Erlaubte Inline-Styles** (unterstützt Regex)
- **Erlaubte IDs** (unterstützt Regex)
- **Erlaubte data-Attribute** (unterstützt Regex)
- **Cleanup-Stufen** (BR-Reduktion, Leer-Paragraph-Entfernung, Office-Strip, DOM-Cleanup)

## Mediapaste Plugin (`mediapaste`)

Bilder, die per Drag & Drop in den Editor gezogen oder aus dem Browser (Copy Image) eingefügt werden, landen direkt im REDAXO-Medienpool. Kein manueller Upload-Umweg.

### Features

- **Drag & Drop:** Bild-Dateien werden automatisch hochgeladen. Original-Dateiname wird übernommen.
- **Copy Image aus Browser:** Binäre Bilddaten aus der Zwischenablage werden hochgeladen, externe URLs werden nicht eingefügt. Dateiname wird aus dem `<img src="…">` im Clipboard-HTML extrahiert.
- **Screenshots/Clipboard-Binaries:** Werden mit `image-<timestamp>.<ext>` benannt.
- **Kategorie-Picker:** Dialog zur Auswahl der Medienkategorie mit Berücksichtigung der REDAXO-Medienrechte (`rex_media_perm`).
- **Default-Kategorie:** Profil kann eine feste Kategorie vorgeben – dann entfällt der Dialog.
- **Formate:** Unterstützt JPG, PNG, GIF, WebP, AVIF, SVG (TinyMCE `images_file_types` wird intern entsprechend erweitert).
- **TinyMCE-interne Blob-Namen** (`mceclip*`, `blobid*`, `imagetools*`) werden erkannt und durch saubere Dateinamen ersetzt.

### Aktivierung

Im Profil `mediapaste` zu den Plugins hinzufügen. Zusätzlich muss unter **TinyMCE → Einstellungen → Bild-Upload** der Upload aktiviert werden.

```javascript
plugins: 'mediapaste ...',
```

### Einstellungen

- **Upload aktivieren:** Generell ein/aus
- **Default-Kategorie:** `-1` = Dialog anzeigen, `0` = Root, `>0` = feste Kategorie-ID
- **Media Manager Type:** Optional (z. B. `tiny`), damit die eingefügten Bilder über den Media Manager ausgeliefert werden

### Hinweis zum Medienpool

Wenn ein Dateityp (z. B. SVG) nicht hochgeladen werden kann, prüfen Sie die REDAXO-Systemeinstellung **Erlaubte Dateitypen** im Medienpool. SVG ist aus Sicherheitsgründen oft nicht standardmäßig freigegeben, da SVG-Dateien JavaScript enthalten können.

## FriendsOfREDAXO Fußnoten Plugin (`for_footnotes`)

Freie, eigenständige Fußnoten-Funktion – kein Ersatz und keine API-Kompatibilität zum kommerziellen Tiny-Premium-Plugin.

### Features

- **Toolbar-Buttons:** `for_footnote_insert`, `for_footnote_update`
- **Menü-Item:** `for_footnote` (fürs Insert-Menü)
- **Commands:** `forFootnoteInsert`, `forFootnoteUpdate`
- **Automatische Nummerierung** nach DOM-Reihenfolge
- **Bidirektionale Verlinkung** (Nummer ↔ Eintrag)
- **Automatische Sektion** `<div class="for-footnotes">` am Dokumentende
- **Enter → Soft-Break** innerhalb eines Fußnoteneintrags (keine verschachtelten/leeren `<li>`)
- **Waisen-Cleanup** über den `for_footnote_update` Button

### Aktivierung

```javascript
plugins: 'for_footnotes ...',
toolbar: 'for_footnote_insert for_footnote_update ...',
```

### HTML-Ausgabe

```html
<p>Der Text<sup class="for-footnote-ref" data-for-fn-id="abc1z" id="for-fnref-abc1z">
    <a href="#for-fn-abc1z">[1]</a>
</sup> mit Fußnote.</p>

<div class="for-footnotes">
    <hr>
    <ol>
        <li id="for-fn-abc1z" data-for-fn-id="abc1z">
            <a class="for-footnote-back" href="#for-fnref-abc1z">^</a>
            <span class="for-footnote-text">Fußnoten-Text</span>
        </li>
    </ol>
</div>
```

### Frontend-CSS

Das mitgelieferte Stylesheet ist framework-agnostisch und nutzt CSS Custom Properties:

```html
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_footnotes.css">
```

Oder via REDAXO:

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_footnotes.css') . '">';
```

### CSS-Variablen zum Anpassen

Im eigenen Theme einfach überschreiben:

```css
:root {
    --for-footnotes-margin-top: 3rem;
    --for-footnotes-font-size: 0.9em;
    --for-footnotes-hr-width: 40%;
    --for-footnotes-hr-color: #ddd;
    --for-footnote-ref-color: #e6007e;
    --for-footnote-ref-hover-color: #a3005a;
    --for-footnote-back-color: #999;
    --for-footnote-back-hover-color: #000;
}
```

Verfügbare Variablen (Auszug):

| Variable | Zweck |
|---|---|
| `--for-footnotes-margin-top` | Abstand oberhalb der Fußnoten-Sektion |
| `--for-footnotes-font-size` | Schriftgröße der gesamten Sektion |
| `--for-footnotes-line-height` | Zeilenhöhe |
| `--for-footnotes-color` | Textfarbe |
| `--for-footnotes-hr-width` | Breite des Trenners |
| `--for-footnotes-hr-color` | Farbe des Trenners |
| `--for-footnotes-list-padding-left` | Einrückung der `<ol>` |
| `--for-footnote-ref-color` | Farbe der hochgestellten Nummer |
| `--for-footnote-ref-hover-color` | Hover-Farbe der Nummer |
| `--for-footnote-ref-font-size` | Schriftgröße der Nummer |
| `--for-footnote-back-color` | Farbe des `^` Rück-Links |
| `--for-footnote-back-hover-color` | Hover-Farbe des Rück-Links |

Ein Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist bereits im Stylesheet enthalten.

## FriendsOfREDAXO Checklist Plugin (`for_checklist`)

Moderne Checkliste im Editor – ohne klassische Form-Checkbox. Das Plugin rendert die Checkbox als reines CSS-`::before`-Element und ist vollständig über CSS-Variablen anpassbar. Beim Einfügen von CKEditor-5-Inhalten werden `ul.todo-list`-Strukturen automatisch in das neue Format konvertiert.

### Features

* **Zwei Varianten – zwei Buttons:**
  * `for_checklist` – klassische **To-Do-Liste**: erledigte Einträge werden durchgestrichen und ausgegraut.
  * `for_checklist_feature` – **Feature-/Benefit-Liste**: neue Einträge sind sofort als „erfüllt" markiert, **kein** Strikethrough, grüner Check, offene Einträge mit gestricheltem Rahmen. Ideal für Feature-Übersichten, Preis-Tabellen, Benefits.
  * Klick auf den gleichen Button in einer bestehenden Liste hebt sie auf; Klick auf den anderen Button wechselt zur anderen Variante, ohne die Einträge zu verlieren.
* Command: `forChecklistToggle` (mit Parameter `'todo'` oder `'feature'`)
* Schlanke HTML-Ausgabe: `<ul class="for-checklist"><li class="for-checklist__item" data-checked="true|false">…</li></ul>`
* **Automatischer CKEditor-5-Import:** `ul.todo-list` → `ul.for-checklist`, inkl. Übernahme des Checked-Zustands aus den versteckten `<input type="checkbox">`
* Toggle per Klick auf die Checkbox-Zone (links vom Text), in einer `undoManager.transact`-Transaktion
* Schema-Anpassung: `ul[class]` und `li[class|data-checked]` werden nicht mehr vom Editor gestrippt
* Modernes Design: abgerundete Checkbox, Hover-/Checked-Zustand, SVG-Häkchen, Dark-Mode (`prefers-color-scheme`), Print-Variante

### Aktivierung im Profil

```javascript
plugins: 'for_checklist ...',
toolbar: 'for_checklist for_checklist_feature ...',
```

### Styling im Frontend

Die mitgelieferte CSS-Datei einbinden:

```html
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_checklist.css">
```

oder in REDAXO:

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_checklist.css') . '">';
```

### CSS-Variablen

| Variable | Zweck |
|---|---|
| `--for-checklist-gap` | Abstand zwischen Checkbox und Text |
| `--for-checklist-indent` | Linke Einrückung der Liste |
| `--for-checklist-item-margin` | Abstand zwischen Items |
| `--for-checkbox-size` | Kantenlänge der Checkbox |
| `--for-checkbox-radius` | Eckenradius |
| `--for-checkbox-border-width` | Rahmenbreite |
| `--for-checkbox-border-color` | Rahmen im leeren Zustand |
| `--for-checkbox-border-color-hover` | Rahmen beim Hover |
| `--for-checkbox-bg` | Hintergrund im leeren Zustand |
| `--for-checkbox-checked-bg` | Hintergrund im Checked-Zustand |
| `--for-checkbox-checked-border-color` | Rahmen im Checked-Zustand |
| `--for-checkbox-check-color` | Häkchen-Farbe (SVG wird entsprechend eingefärbt) |
| `--for-checkbox-transition` | CSS-Transition |
| `--for-checklist-text-color` | Textfarbe offene Einträge |
| `--for-checklist-checked-text-color` | Textfarbe erledigter Einträge |
| `--for-checklist-checked-decoration` | Text-Decoration (z. B. `line-through`) |
| `--for-checklist-feature-checked-bg` | Hintergrund Check (Feature-Variante, Default Grün) |
| `--for-checklist-feature-checked-border-color` | Rahmen Check (Feature-Variante) |
| `--for-checklist-feature-checked-text-color` | Textfarbe erledigter Einträge (Feature) |
| `--for-checklist-feature-checked-decoration` | Text-Decoration (Feature, Default `none`) |
| `--for-checklist-feature-unchecked-border-style` | Rahmenstil offene Einträge (Default `dashed`) |

Ein Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist im Stylesheet enthalten.

## FriendsOfREDAXO HTML-Embed Plugin (`for_htmlembed`)

Geschützte HTML-/JS-Einbettung für Widgets, Tracking-Pixel, Social-Embeds, `<iframe>`, Mini-Apps. Der Code-Block ist im Editor **nicht direkt editierbar** (`contenteditable="false"`), nur als Ganzes verschiebbar/löschbar, und wird über einen separaten Dialog bearbeitet – Redakteure können ihn damit nicht versehentlich zerschießen.

### Features

* Toolbar-Button & Menüeintrag: `for_htmlembed`
* Commands: `forHtmlEmbedInsert` (einfügen/bearbeiten), `forHtmlEmbedEdit` (nur bearbeiten)
* **Doppelklick** auf den Embed-Block öffnet den Bearbeiten-Dialog
* **Context-Toolbar** mit Edit- und Remove-Button
* HTML-Format (bleibt unverändert im Save-Output):
  ```html
  <div class="for-htmlembed" contenteditable="false">
    <!-- beliebiger HTML/JS/CSS-Code -->
  </div>
  ```
* Editor-Chrome (dashed border + Badge) nur im Editor-Iframe sichtbar, im Frontend nur ein schlichtes `<div>`
* Das Plugin setzt `xss_sanitization: false` und `allow_script_urls: true` auf den Editor, sobald es geladen ist – damit `<script>`, `<iframe>`, `<style>` & `on*`-Attribute nicht entfernt werden. **Nur aktivieren, wenn die Redakteure beliebigen Code einbetten dürfen sollen.**
* Textarea im Dialog bekommt die CSS-Klasse `rex-js-code-editor` – das [code-AddOn](https://github.com/FriendsOfRedaxo/code) hängt sich automatisch an, falls installiert, sonst Fallback auf monospace.

### Aktivierung im Profil

```javascript
plugins: 'for_htmlembed ...',
toolbar: 'for_htmlembed ...',
```

### Styling im Frontend

Der Wrapper `<div class="for-htmlembed">` bleibt im Save-Output. Standardmäßig wird er im Frontend nicht gestylt. Falls gewünscht, kann das Frontend den Block visuell hervorheben (`display: contents;` für völlig unsichtbar, oder eigenes CSS).

## FriendsOfREDAXO Markdown Plugin (`for_markdown`)

Dialog-basierter Markdown → HTML Konverter. Kein Autodetect, keine Paste-Interception – der Redakteur öffnet bewusst den Dialog, fügt Markdown ein, das Ergebnis wird als sauberes HTML an der Cursor-Position eingesetzt. Kollisionsfrei zum `markdowneditor`-AddOn: komplett eigener Namespace `for_markdown*` / `for-markdown-*`.

### Features

* Toolbar-Button & Menüeintrag: `for_markdown_paste` (Label „Markdown einfügen…")
* Command: `forMarkdownOpenDialog`
* **Engine:** [markdown-it 14](https://github.com/markdown-it/markdown-it) gebündelt im Plugin-Bundle – kein CDN, offline-fähig
* **CommonMark + GFM-Dialekte:** Tables, Autolinks (`linkify`), SmartQuotes (`typographer`), harte Zeilenumbrüche (`breaks`), fenced Code
* **Tasklist-Interop → `for_checklist`:**
  ```markdown
  - [ ] offen
  - [x] erledigt
  ```
  wird zu
  ```html
  <ul class="for-checklist for-checklist--feature">
    <li class="for-checklist__item" data-checked="false">offen</li>
    <li class="for-checklist__item" data-checked="true">erledigt</li>
  </ul>
  ```
* **Fenced Code → `codesample`-kompatibel:** ```` ```php …``` ```` wird zu `<pre class="language-php"><code>…</code></pre>` und bleibt vom Core-Plugin `codesample` weiter editierbar.

### Aktivierung im Profil

```javascript
plugins: 'for_markdown ...',
toolbar: 'for_markdown_paste ...',
menu: {
    insert: {
        title: 'Einfügen',
        items: '... for_markdown_paste ...'
    }
}
```

Der Profil-Assistent listet `for_markdown` mit FOR-Badge sowohl in der Plugin-Liste als auch in den verfügbaren Toolbar-Buttons und Custom-Menu-Items.

### Frontend-CSS

`for_markdown` erzeugt ausschließlich Markup der anderen Plugins (`for-checklist`, `language-*`) und normales semantisches HTML. Es gibt **keine eigene CSS-Datei**; lade stattdessen bei Bedarf `css/for_checklist.css` (für Checklisten) und binde ein Prism/Highlight.js-Theme für die `language-*`-Codeblöcke ein.

## FriendsOfREDAXO Inhaltsverzeichnis-Styling (`for_toc.css`)

Das `for_toc`-Plugin erzeugt ein semantisches `<nav class="for-toc">`-Markup. Das zugehörige Stylesheet `assets/css/for_toc.css` ist framework-agnostisch und steuert alles über CSS-Variablen.

**Einbinden:**

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_toc.css') . '">';
```

**Hierarchische Nummerierung** (greift automatisch, sobald die TOC als „ordered" eingefügt wurde → `<ol class="for-toc__list">`):

```
1. Hauptpunkt
   1.1 Unterpunkt
      1.1.1 Unter-Unterpunkt
```

Umgesetzt über `counter-reset` + `counters(for-toc-item, ".")` auf `li::before`. Bei `<ul>`-TOCs (unsortiert) bleibt der klassische Bullet-Look. Filler-Einträge für übersprungene Heading-Ebenen werden nicht mitgezählt.

**Editor-Parität:** Die gleichen Counter-Regeln werden bei `editor.on('init', …)` über `editor.dom.addStyle()` zusätzlich in den Editor-Iframe injiziert. Der Redakteur sieht die Nummerierung also **direkt im TinyMCE**, nicht erst im Frontend. Im Editor gelten feste Werte (kein CSS-Variablen-Override möglich), im Frontend läuft die volle Variablen-Konfiguration.

**Wichtige CSS-Variablen:**

| Variable | Zweck |
|---|---|
| `--for-toc-bg`, `--for-toc-border-color` | Hintergrund & linke Akzent-Border |
| `--for-toc-link-color` / `-hover-color` / `-active-color` | Link-Farben (inkl. `aria-current`) |
| `--for-toc-list-indent` | Einrückung der Unter-Listen |
| `--for-toc-number-separator` | Trennzeichen zwischen Ebenen (Default `.`) |
| `--for-toc-number-suffix` | Zeichen nach der Nummer (Default Leerzeichen) |
| `--for-toc-number-color`, `--for-toc-number-font-weight` | Styling der Nummern |
| `--for-toc-number-min-width`, `--for-toc-number-gap` | Einrückungs-Spalte für die Nummer |
| `--for-toc-sticky-top`, `--for-toc-sticky-max-height` | für `.for-toc--sticky` |

Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist im Stylesheet enthalten.

## FriendsOfREDAXO oEmbed Plugin (`for_oembed`)

Video-Einbettung per URL-Paste – YouTube & Vimeo werden sofort erkannt. Im Editor gibt es eine echte Live-Vorschau (iframe + Overlay, `contenteditable="false"`), gespeichert wird das **CKEditor-5-kompatible** Format:

```html
<figure class="media"><oembed url="https://www.youtube.com/watch?v=…"></oembed></figure>
```

Damit lassen sich Inhalte 1:1 zwischen REDAXO/TinyMCE und CKE5-basierten Systemen austauschen.

### Features

* **Paste-Erkennung:** Einfach eine YouTube- oder Vimeo-URL in den Editor pasten – wird automatisch in einen Video-Block umgewandelt.
* **Toolbar-Button & Menü:** `for_oembed`, plus Context-Toolbar mit Edit-/Remove-Button, plus Doppelklick zum Bearbeiten.
* **Commands:** `forOembedInsert`, `forOembedEdit`.
* **Provider:** YouTube (watch/shorts/embed/youtu.be/nocookie), Vimeo (vimeo.com, player.vimeo.com). Erweiterbar im `parseUrl`-Modul.
* **Live-Preview im Editor:** Echter iframe mit YouTube/Vimeo-Badge, Overlay fängt Klicks ab (Video spielt im Editor nicht ab, Cursor kann nicht reinrutschen).
* **Save-Format:** CKE5-kompatibles `<figure class="media"><oembed url="…"></oembed></figure>` – wird beim Speichern automatisch aus der Preview zurückgebaut (`GetContent`-Event).
* **Reverse-Import:** Vorhandene CKE5-Inhalte mit `<oembed>` werden beim Laden in die Preview entfaltet (`SetContent`-Event).

### Aktivierung im Profil

```javascript
plugins: 'for_oembed ...',
toolbar: 'for_oembed ...',
```

### Frontend-Rendering (zwei Varianten)

**Variante A: PHP-Renderer** – empfohlen, läuft serverseitig:

```php
use FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer;

echo OembedRenderer::render($article->getValue('art_text'));
```

**Variante B: JS-Helper** – wandelt die `<oembed>`-Tags im Browser um. Im Frontend-Template direkt einbinden (`rex_view::addJsFile()` ist backend-only):

```php
echo '<script src="' . rex_addon::get('tinymce')->getAssetsUrl('js/for_oembed.js') . '" defer></script>';
```

### Optionale Vidstack-Integration

Wenn das [`vidstack`-AddOn](https://github.com/FriendsOfREDAXO/vidstack) installiert und verfügbar ist, verwendet der Renderer **automatisch** einen `<media-player>`-Player (YouTube/Vimeo-Provider von vidstack). Ohne vidstack gibt es einen responsiven `<iframe>`-Fallback. Der JS-Helper erkennt das Custom-Element `<media-player>` zur Laufzeit ebenfalls und nutzt es.

Für das automatische Einbinden der vidstack-Assets im Frontend (falls vorhanden):

```php
echo OembedRenderer::registerFrontendAssets();
```

### HTML-Struktur im Editor

```html
<figure class="media for-oembed for-oembed--youtube" contenteditable="false" data-for-oembed-url="https://www.youtube.com/watch?v=…">
  <div class="for-oembed__ratio">
    <iframe src="https://www.youtube.com/embed/…" allow="…" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    <div class="for-oembed__overlay"></div>
  </div>
</figure>
```

## Entwickler

Informationen zur Erweiterung des Addons und zur Registrierung eigener Plugins finden Sie in der [Entwickler-Dokumentation](DEVS.md) oder im Backend unter dem Reiter "Entwickler".

### Aufbau / Aktualisieren der Assets

In diesem Addon befinden sich Custom‑Plugins in `custom_plugins/`.

Neu: staging‑ordner `build/` (empfohlen für CI / review) – der Workflow ist jetzt in zwei Phasen aufgeteilt:

- Staging: `build/vendor/tinymce` (TinyMCE vendor) und `build/plugins/<plugin>` (custom plugins)
- Sync: die Inhalte aus `build/` werden nach `assets/vendor/tinymce` und `assets/scripts/tinymce/plugins` kopiert (runtime)

Empfohlen: pnpm (keine Verwendung von yarn erforderlich).

Schnellstart (im Addon‑Verzeichnis):

```bash
# Installiere Abhängigkeiten (root add-on)
pnpm install

# Optional: beim initialen Setup die Workspaces (custom_plugins) mitinstallieren
pnpm -w -r install

# Staging: kopiert tinymce vendor in build/vendor und baut custom_plugins in build/plugins
pnpm run build:staging

# Sync: kopiert die staging ergebnisse in die runtime assets (assets/vendor + assets/scripts)
pnpm run build:sync

# Alles in einem (staging + sync)
pnpm run build

# Build artefakte löschen
pnpm run clean-build
```

Der `build:staging` Task (intern):
- `pnpm run vendor:build` → kopiert TinyMCE vendor nach `build/vendor/tinymce`
- `pnpm run plugins:build -- --staging` → baut/copyt custom_plugins nach `build/plugins/<plugin>` und schreibt notwendige plugin files ebenfalls nach `build/vendor/tinymce/plugins/<plugin>`

`pnpm run build:sync` kopiert die staging‑artefakte in die jeweiligen `assets/` Ordner, damit der Addon‑Runtime Pfad unverändert bleibt.

Weitere Details / zusätzliche Änderungen:

- Die Build‑Pipeline kopiert den TinyMCE Vendor in `assets/vendor/tinymce` und danach werden die custom plugin Artefakte sowohl nach `assets/scripts/tinymce/plugins/<plugin>` als auch **kopiert** in `assets/vendor/tinymce/plugins/<plugin>` damit TinyMCE die Plugins direkt über die normalen `plugins`-Pfadnamen verwenden kann (keine `external_plugins` Konfiguration nötig).
- `node_modules` ist in `.gitignore` aufgenommen (lokale Abhängigkeiten werden nicht committet).
- `yarn.lock` entfernt: Wir benutzen `pnpm` als bevorzugten Paketmanager für deterministische Workspaces; entferne aus dem Repo bitte alte `yarn.lock` Dateien falls vorhanden.


Empfohlene CI Integration:
- In CI (GitHub Actions) `pnpm install && pnpm run build` ausführen und sicherstellen, dass `assets/scripts/tinymce/plugins` und `assets/vendor/tinymce/plugins` die erwarteten Artefakte enthalten. Ein schneller Node‑Smoke‑Check kann automatisiert werden, um die wichtigsten Dateien nach dem Build zu prüfen.
- Versucht, fehlende Builds mit `esbuild` zu bündeln/minifizieren und in `assets/scripts/tinymce/plugins/<plugin>/<plugin>.min.js` zu schreiben.
- Kopiert vorhandene Sprachdateien aus `langs/` mit.

Wenn du weiterhin yarn benutzt, funktionieren die meisten plugin-Builds ebenfalls — empfohlen ist aber pnpm wegen deterministischer Workspaces und schnellem Install/CI-Verhalten.

Wichtig: Custom‑Plugin‑Artefakte werden unter `assets/scripts/tinymce/plugins/<plugin>` erstellt und zusätzlich in `assets/vendor/tinymce/plugins/<plugin>` abgelegt.
Das erlaubt, die Plugins direkt per `plugins` Konfiguration zu nutzen, ohne `external_plugins` anzugeben — weil die Build‑Pipeline die minifizierten Plugin‑Artefakte zusätzlich in `assets/vendor/tinymce/plugins/<plugin>` legt.

## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce/blob/master/LICENSE.md)
- TinyMCE: [GPL v2+ LICENSE](https://github.com/tinymce/tinymce/blob/develop/license.md) (ab Version 8.0)


## Author

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO
