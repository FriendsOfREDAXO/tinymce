# TinyMCE 8 - REDAXO-AddOn

Stellt den TinyMCE 8 Editor im CMS REDAXO bereit.

![Screenshot](https://github.com/FriendsOfREDAXO/tinymce/blob/assets/screenshot8.png?raw=true)

## Feature-Highlights

- **for_images + image im Team:** Bilder mit dem nativen `image` Plugin einfuegen und mit `for_images` als Figure-Block weiterbearbeiten (Breiten, Ausrichtung, Effekte, Caption, Alt-Text, Mediapool-Aktionen).
- **for_oembed / for_video:** Moderne Einbettungen mit stabilen Save-Formaten und Editor-Vorschau.
- **cleanpaste / mediapaste:** Saubere Paste-Pipeline mit Schutz fuer FOR-Markup und optionalem Medienpool-Upload aus der Zwischenablage.
- **for_toc / for_footnote / for_a11y:** Inhaltsverzeichnis, Fussnoten und Accessibility-Checks direkt im Editor.

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

- Im individuellen Attribute-Feld: `{"class":"tiny-editor","data-profile":"full"}`
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

### Profil-Assistent (aktuell)

Der Profil-Assistent in der Profilverwaltung wurde erweitert und arbeitet jetzt näher an der nativen TinyMCE-Konfiguration:

* **Mehrzeilige Toolbars**: `toolbar` kann als String oder als Array von Toolbar-Zeilen gepflegt werden.
* **Toolbar-Modus**: `toolbar_mode` ist direkt im Assistenten auswählbar (`sliding`, `floating`, `wrap`, `scrolling`).
* **Toolbar deaktivieren**: Es wird korrekt `toolbar: false` erzeugt.
* **Toolbar-Picker als Popover**: Buttons werden als sortierbare Pills gepflegt (mit Core/FOR/AddOn-Badge). Der Picker öffnet sich direkt am Klickpunkt.
* **Separator (`|`)**: Bleibt im Picker immer auswählbar und ist immer am Listenanfang.
* **Zeilenaktionen**: „Löschen“ (einzelnes Element) und „Alle löschen“ (mit Bestätigung) sind im Picker verfügbar.

### Protected Extras (nicht verwaltete Optionen)

Zusätzliche Profiloptionen, die der Assistent nicht direkt über UI-Felder verwaltet, können als `protected extras` hinterlegt werden. Diese Einträge bleiben beim Generieren erhalten und werden wieder angehängt.

Beispiele:

```javascript
toolbar_sticky: true,
toolbar_sticky_offset: 0,
my_custom_option: function () { return 'kept'; }
```

Hinweis: Eingaben mit Top-Level-Kommas werden JS-sicher gesplittet. Als Fallback werden auch property-basierte „eine Zeile pro Eintrag“-Angaben unterstützt.

### Migration von TinyMCE 5/6 zu TinyMCE 8

**Updatepfad-Hinweis (ab v8.9.0):**

- Ein direktes Update auf `v8.9.0` ist nur ab TinyMCE `v8.8.1` vorgesehen.
- Bei älteren Addon-Versionen zuerst auf `v8.8.1` aktualisieren, danach auf `v8.9.0`.

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
      {
        "title": "Primary",
        "name": "uk-button-primary",
        "selector": "a",
        "classes": "uk-button uk-button-primary"
      },
      {
        "title": "Secondary",
        "name": "uk-button-secondary",
        "selector": "a",
        "classes": "uk-button uk-button-secondary"
      }
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

## FOR Images Plugin (Mediapool + Bildformatierung)

Das `for_images` Plugin erweitert die Bildbearbeitung im Editor und ist fuer die gemeinsame Nutzung mit dem nativen `image` Plugin ausgelegt.

### Features

- **Mediapool-Anbindung:** Bild im Medienpool anzeigen und bestehendes Bild direkt aus dem Medienpool austauschen.
- **Preset-basierte Breiten:** Keine manuellen Pixel-Eingaben, nur vordefinierte CSS-Klassen.
- **Ausrichtungs-Buttons:** Links, Rechts, Zentriert und Zuruecksetzen auf "keine Ausrichtung".
- **Effekt-Presets:** Schatten, abgerundete Ecken, Rahmen als schaltbare Optionen.
- **Alt-Text-Quick-Action:** Schneller Dialog mit visuellem Status am Toolbar-Button.
- **Caption-Handling:** Bildunterschrift als `figcaption` einfuegen, aktualisieren und entfernen.
- **Figure-Workflow:** Automatisches Figure-Wrapping und Figure-Normalisierung beim Einfuegen.
- **Stabiles Austauschen:** Beim Bildtausch werden alte Preset-Klassen bereinigt, damit keine Verzerrung entsteht.
- **Block-Verhalten fuer Figure:** Delete/Cut/Copy behandeln Bild + Caption als eine Einheit.
- **Responsive Framework-Support:** Presets fuer UIkit/Bootstrap und eigene Klassen moeglich.

### Aktivierung

Im Profil `for_images` **zusammen mit dem nativen `image` Plugin** zu den Plugins hinzufuegen. Der Profil-Assistent bietet eine komfortable UI mit Template-Auswahl.

**Wichtig:** Das `image` Plugin und `for_images` ergaenzen sich. Das native `image` Plugin liefert die Grundfunktionalitaet zum Einfuegen und Bearbeiten von Bilddaten, `for_images` uebernimmt den erweiterten Figure-Workflow mit Presets und Mediapool-Aktionen. Empfehlung: beide Plugins aktivieren.

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

| Template    | Beschreibung                                          |
| ----------- | ----------------------------------------------------- |
| UIkit 3     | `uk-width-*`, `uk-float-*`, `uk-box-shadow-*` Klassen |
| Bootstrap 5 | `col-*`, `float-*`, `shadow-*` Klassen                |
| Allgemein   | Generische CSS-Klassen (`img-width-small`, etc.)      |

### Context-Toolbar

Bei Bildauswahl erscheint eine Toolbar mit:

- **Breite:** Dropdown mit allen Breiten-Presets
- **Ausrichtung:** Toggle-Buttons (Links, Zentriert, Rechts, Keine)
- **Effekte:** Dialog zum Aktivieren/Deaktivieren von Effekten
- **Alt:** Alt-Text bearbeiten (leuchtet bei vorhandenem Alt-Text)
- **Caption:** Bildunterschrift hinzufügen/entfernen

### HTML-Ausgabe

```html
<figure
  class="uk-float-left uk-margin-right uk-margin-bottom uk-width-medium@m"
>
  <img
    class="uk-width-1-1"
    src="/media/bild.jpg"
    alt="Beschreibung"
    width="800"
    height="600"
  />
  <figcaption>Optionale Bildunterschrift</figcaption>
</figure>
```

**Hinweis:** Das Bild erhält automatisch die passende 100%-Klasse (`uk-width-1-1` für UIkit, `w-100` für Bootstrap), damit es die Figure-Breite ausfüllt.

### Frontend-CSS für allgemeine Klassen

Wenn Sie **kein CSS-Framework** (UIkit, Bootstrap) verwenden und die "Allgemein"-Vorlage nutzen, benötigen Sie die mitgelieferte CSS-Datei im Frontend:

```html
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_images.css" />
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

| Key   | Typ    | Beschreibung                    |
| ----- | ------ | ------------------------------- |
| title | String | Name des Dropdown-Buttons       |
| items | Array  | Liste der verlinkbaren Tabellen |

**Item-Konfiguration:**

| Key   | Typ    | Beschreibung                                                                                                                                                                                                                                                                                                                                 |
| ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title | String | Titel im Menü (optional, sonst Tabellenname)                                                                                                                                                                                                                                                                                                 |
| table | String | Name der YForm-Tabelle                                                                                                                                                                                                                                                                                                                       |
| field | String | Feldname, dessen Inhalt als Linktext übernommen wird                                                                                                                                                                                                                                                                                         |
| url   | String | Optional: Schema für den internen Platzhalter-Link. Standard ist `tabellenname://`. <br>Beispiel: Ist `url` nicht gesetzt, wird `rex_yf_project://123` gespeichert. Ist `url: '/event:'` gesetzt, wird `/event:123` gespeichert. <br>Dieser Wert dient nur als interner Platzhalter und muss via Output-Filter (siehe unten) ersetzt werden. |

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

## Phonelink Plugin (`phonelink`)

Dialog zum Einfügen einer Telefonnummer als anklickbarer `tel:`-Link. Redakteure geben Nummer, Anzeigetext und optional einen Title ein – das Plugin erzeugt daraus einen sauberen `<a href="tel:…">`-Link.

### Features

- **Toolbar-Button / Menüeintrag:** `phonelink` (eigenes SVG-Icon, in neutralem TinyMCE-Stil)
- **Dialog-Felder:** *Phone number*, *Text to display*, *Title*
- **Href-Normalisierung:** Die Telefonnummer wird für das `tel:`-Attribut auf RFC-3966-gültige Zeichen (`+`, Ziffern, `-.()`) reduziert. Leerzeichen, `/` oder Buchstaben im Nummernfeld wandern nicht in den Link.
- **Anzeigetext bleibt wie eingegeben** – Klammern, Leerzeichen, nationale Formatierung dürfen im sichtbaren Text stehen.
- **Aktuelle Auswahl** im Editor wird als initialer *Text to display* übernommen. Ist eine bestehende `tel:`-Link-Auswahl aktiv, wird die Nummer aus dem `href` rekonstruiert.
- **Ergänzt sich mit `for_chars_symbols`:** dort gibt es zusätzlich *Typografie-Aktionen* „Telefonnummer normalisieren (E.164/national)" für den reinen Text.

### Aktivierung

```javascript
plugins: 'phonelink ...',
toolbar: '... phonelink ...',
```

## Quote Plugin (`quote`)

Fügt ein semantisch sauberes Blockquote mit optionalem Autor und `<cite>`-Quellenangabe ein.

### Features

- **Toolbar-Button / Menüeintrag:** `quote`
- **Dialog-Felder:** *Quote text* (Textarea), *Quote author*, *Quote cite*
- **Saubere HTML5-Ausgabe:** `<blockquote><p>…</p><footer>Autor, <cite>Quelle</cite></footer></blockquote>`. Ist nur Autor oder nur Cite gesetzt, wird der Footer entsprechend reduziert; sind beide leer, wird gar kein Footer erzeugt.
- **Zeilenumbrüche im Zitat-Text** werden zu `<br>`.
- **HTML-Escaping** aller Eingaben – Redakteure können keine versteckten Tags in Zitat, Autor oder Cite einschleusen.
- **Aktuelle Auswahl** wird als Plain-Text in das Textarea übernommen.
- Keine Inline-Styles, keine Framework-Abhängigkeit – das Ziel-Stylesheet entscheidet über das Aussehen.

### Aktivierung

```javascript
plugins: 'quote ...',
toolbar: '... quote ...',
```

## Snippets Plugin (`snippets`)

Bindet die REDAXO-*Snippet-Verwaltung* an TinyMCE an. Redakteure können wiederverwendbare HTML-Bausteine direkt aus dem Editor auswählen und einfügen.

### Features

- **Menüeintrag:** `snippets` (Default im „Einfügen"-Menü)
- Snippets werden zentral im REDAXO-Backend gepflegt – Änderungen wirken sofort auf alle Editor-Instanzen
- Nur-Lese-Ausgabe: das Plugin selbst ändert keine Snippet-Inhalte, es fügt sie an Cursor-Position ein
- Ideal für wiederkehrende Blöcke (Call-to-Action-Boxen, Disclaimer-Texte, Info-Kästen)

### Aktivierung

```javascript
plugins: 'snippets ...',
menu: {
    insert: { title: 'Einfügen', items: '... snippets ...' }
},
```

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
<p>
  Der Text<sup
    class="for-footnote-ref"
    data-for-fn-id="abc1z"
    id="for-fnref-abc1z"
  >
    <a href="#for-fn-abc1z">[1]</a>
  </sup>
  mit Fußnote.
</p>

<div class="for-footnotes">
  <hr />
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
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_footnotes.css" />
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

| Variable                            | Zweck                                 |
| ----------------------------------- | ------------------------------------- |
| `--for-footnotes-margin-top`        | Abstand oberhalb der Fußnoten-Sektion |
| `--for-footnotes-font-size`         | Schriftgröße der gesamten Sektion     |
| `--for-footnotes-line-height`       | Zeilenhöhe                            |
| `--for-footnotes-color`             | Textfarbe                             |
| `--for-footnotes-hr-width`          | Breite des Trenners                   |
| `--for-footnotes-hr-color`          | Farbe des Trenners                    |
| `--for-footnotes-list-padding-left` | Einrückung der `<ol>`                 |
| `--for-footnote-ref-color`          | Farbe der hochgestellten Nummer       |
| `--for-footnote-ref-hover-color`    | Hover-Farbe der Nummer                |
| `--for-footnote-ref-font-size`      | Schriftgröße der Nummer               |
| `--for-footnote-back-color`         | Farbe des `^` Rück-Links              |
| `--for-footnote-back-hover-color`   | Hover-Farbe des Rück-Links            |

Ein Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist bereits im Stylesheet enthalten.

## FriendsOfREDAXO Checklist Plugin (`for_checklist`)

Moderne Checkliste im Editor – ohne klassische Form-Checkbox. Das Plugin rendert die Checkbox als reines CSS-`::before`-Element und ist vollständig über CSS-Variablen anpassbar. Beim Einfügen von CKEditor-5-Inhalten werden `ul.todo-list`-Strukturen automatisch in das neue Format konvertiert.

### Features

- **Zwei Varianten – zwei Buttons:**
  - `for_checklist` – klassische **To-Do-Liste**: erledigte Einträge werden durchgestrichen und ausgegraut.
  - `for_checklist_feature` – **Feature-/Benefit-Liste**: neue Einträge sind sofort als „erfüllt" markiert, **kein** Strikethrough, grüner Check, offene Einträge mit gestricheltem Rahmen. Ideal für Feature-Übersichten, Preis-Tabellen, Benefits.
  - Klick auf den gleichen Button in einer bestehenden Liste hebt sie auf; Klick auf den anderen Button wechselt zur anderen Variante, ohne die Einträge zu verlieren.
- Command: `forChecklistToggle` (mit Parameter `'todo'` oder `'feature'`)
- Schlanke HTML-Ausgabe: `<ul class="for-checklist"><li class="for-checklist__item" data-checked="true|false">…</li></ul>`
- **Automatischer CKEditor-5-Import:** `ul.todo-list` → `ul.for-checklist`, inkl. Übernahme des Checked-Zustands aus den versteckten `<input type="checkbox">`
- Toggle per Klick auf die Checkbox-Zone (links vom Text), in einer `undoManager.transact`-Transaktion
- Schema-Anpassung: `ul[class]` und `li[class|data-checked]` werden nicht mehr vom Editor gestrippt
- Modernes Design: abgerundete Checkbox, Hover-/Checked-Zustand, SVG-Häkchen, Dark-Mode (`prefers-color-scheme`), Print-Variante

### Aktivierung im Profil

```javascript
plugins: 'for_checklist ...',
toolbar: 'for_checklist for_checklist_feature ...',
```

### Styling im Frontend

Die mitgelieferte CSS-Datei einbinden:

```html
<link rel="stylesheet" href="/assets/addons/tinymce/css/for_checklist.css" />
```

oder in REDAXO:

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_checklist.css') . '">';
```

### CSS-Variablen

| Variable                                         | Zweck                                              |
| ------------------------------------------------ | -------------------------------------------------- |
| `--for-checklist-gap`                            | Abstand zwischen Checkbox und Text                 |
| `--for-checklist-indent`                         | Linke Einrückung der Liste                         |
| `--for-checklist-item-margin`                    | Abstand zwischen Items                             |
| `--for-checkbox-size`                            | Kantenlänge der Checkbox                           |
| `--for-checkbox-radius`                          | Eckenradius                                        |
| `--for-checkbox-border-width`                    | Rahmenbreite                                       |
| `--for-checkbox-border-color`                    | Rahmen im leeren Zustand                           |
| `--for-checkbox-border-color-hover`              | Rahmen beim Hover                                  |
| `--for-checkbox-bg`                              | Hintergrund im leeren Zustand                      |
| `--for-checkbox-checked-bg`                      | Hintergrund im Checked-Zustand                     |
| `--for-checkbox-checked-border-color`            | Rahmen im Checked-Zustand                          |
| `--for-checkbox-check-color`                     | Häkchen-Farbe (SVG wird entsprechend eingefärbt)   |
| `--for-checkbox-transition`                      | CSS-Transition                                     |
| `--for-checklist-text-color`                     | Textfarbe offene Einträge                          |
| `--for-checklist-checked-text-color`             | Textfarbe erledigter Einträge                      |
| `--for-checklist-checked-decoration`             | Text-Decoration (z. B. `line-through`)             |
| `--for-checklist-feature-checked-bg`             | Hintergrund Check (Feature-Variante, Default Grün) |
| `--for-checklist-feature-checked-border-color`   | Rahmen Check (Feature-Variante)                    |
| `--for-checklist-feature-checked-text-color`     | Textfarbe erledigter Einträge (Feature)            |
| `--for-checklist-feature-checked-decoration`     | Text-Decoration (Feature, Default `none`)          |
| `--for-checklist-feature-unchecked-border-style` | Rahmenstil offene Einträge (Default `dashed`)      |

Ein Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist im Stylesheet enthalten.

## FriendsOfREDAXO HTML-Embed Plugin (`for_htmlembed`)

Geschützte HTML-/JS-Einbettung für Widgets, Tracking-Pixel, Social-Embeds, `<iframe>`, Mini-Apps. Der Code-Block ist im Editor **nicht direkt editierbar** (`contenteditable="false"`), nur als Ganzes verschiebbar/löschbar, und wird über einen separaten Dialog bearbeitet – Redakteure können ihn damit nicht versehentlich zerschießen.

### Features

- Toolbar-Button & Menüeintrag: `for_htmlembed`
- Commands: `forHtmlEmbedInsert` (einfügen/bearbeiten), `forHtmlEmbedEdit` (nur bearbeiten)
- **Doppelklick** auf den Embed-Block öffnet den Bearbeiten-Dialog
- **Context-Toolbar** mit Edit- und Remove-Button
- HTML-Format (bleibt unverändert im Save-Output):
  ```html
  <div class="for-htmlembed" contenteditable="false">
    <!-- beliebiger HTML/JS/CSS-Code -->
  </div>
  ```
- Editor-Chrome (dashed border + Badge) nur im Editor-Iframe sichtbar, im Frontend nur ein schlichtes `<div>`
- Das Plugin setzt `xss_sanitization: false` und `allow_script_urls: true` auf den Editor, sobald es geladen ist – damit `<script>`, `<iframe>`, `<style>` & `on*`-Attribute nicht entfernt werden. **Nur aktivieren, wenn die Redakteure beliebigen Code einbetten dürfen sollen.**
- Textarea im Dialog bekommt die CSS-Klasse `rex-js-code-editor` – das [code-AddOn](https://github.com/FriendsOfRedaxo/code) hängt sich automatisch an, falls installiert, sonst Fallback auf monospace.

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

- Toolbar-Button & Menüeintrag: `for_markdown_paste` (Label „Markdown einfügen…")
- Command: `forMarkdownOpenDialog`
- **Engine:** [markdown-it 14](https://github.com/markdown-it/markdown-it) gebündelt im Plugin-Bundle – kein CDN, offline-fähig
- **CommonMark + GFM-Dialekte:** Tables, Autolinks (`linkify`), SmartQuotes (`typographer`), harte Zeilenumbrüche (`breaks`), fenced Code
- **Tasklist-Interop → `for_checklist`:**
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
- **Fenced Code → `codesample`-kompatibel:** ` ```php …``` ` wird zu `<pre class="language-php"><code>…</code></pre>` und bleibt vom Core-Plugin `codesample` weiter editierbar.

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


Entfernt den von TinyMCE intern erzwungenen Root-Wrapper (`forced_root_block`, Fallback `div`) beim Speichern bzw. Auslesen des Inhalts. Damit bleibt TinyMCE im Editor stabil, während im gespeicherten Output nur der eigentliche Inline-/Textinhalt landet.

### Features

- Kein eigener Button/Menüeintrag: reines Content-Processing-Plugin
- Nutzt automatisch `forced_root_block`; falls leer/ungültig, wird `div` verwendet
- Entfernt den Wrapper nur, wenn genau **ein** Root-Element mit reinem Inline-Inhalt vorhanden ist (inkl. Whitespace-Toleranz) – mehrere Blöcke bleiben unangetastet
- Paste-/Insert-sicher: Zwischenablage-Inhalte, programmatisches `setContent` und Auswahl-Operationen werden nicht zusätzlich umhüllt
- Verhindert doppelte Struktur-Tags, wenn das umgebende Markup bereits im Modul/Template definiert wird

### Typischer Einsatzfall


- TinyMCE-Profil sehr klein halten (z. B. nur Fett + Sonderzeichen)
- Headline-Tag (`h2`, `h3`, `h4`) und CSS-Klasse im Modul per Auswahl oder Logik bestimmen
- Nur den nackten Text/Inline-Inhalt aus TinyMCE speichern, ohne zusätzliches `<p>`/`<div>`

So kann das Modul die finale Struktur konsistent erzeugen (z. B. abhängig von der bereits vorhandenen Hauptüberschrift), ohne nachträgliches Strippen im Output-Filter.

### Beispiel (Headline-Feld im Modul)

**Eingabe in TinyMCE (intern mit Root-Wrapper):**

```html
<p>Produkt <strong>Highlights</strong> &amp; Preise</p>
```


```html
Produkt <strong>Highlights</strong> &amp; Preise
```

**Ausgabe im Modul (Tag/Klasse zentral gesteuert):**

```php
$tag = in_array($headingTag, ['h2', 'h3', 'h4'], true) ? $headingTag : 'h2';
$class = 'mod-headline mod-headline--' . $tag;
echo '<' . $tag . ' class="' . rex_escape($class) . '">' . $headlineHtml . '</' . $tag . '>';
```

Damit bleibt die redaktionelle Bearbeitung flexibel, während Struktur und Designsystem-Regeln weiterhin im Modul kontrolliert werden.

### Aktivierung im Profil

```javascript
```



## FriendsOfREDAXO Zeichen, Symbole & Emoji (`for_chars_symbols`)

Ein vereinter Picker für **Sonderzeichen, native Emojis und Typografie-Helfer** – als schwebendes, draggable Panel, das offen bleibt und mehrfaches Einfügen erlaubt.

### Features

- **Drei Tabs**: „Zeichen" (mit Favoriten + Zuletzt verwendet oben), „Emoji" (nach Kategorien), „Typografie" (Aktionen auf der Markierung).
- **Schwebendes, draggable Panel** – kein blockierendes Modal, Editor bleibt sichtbar und bedienbar.
- **Live-Suche** pro Tab (Name, Zeichen, Codepoint `U+…`).
- **Favoriten + Zuletzt verwendet** pro Browser (`localStorage`), kompakt als „angepinnte" Sektionen im ersten Tab. Zusätzlich **Aktions-Favoriten**: jede Typografie-Aktion besitzt einen Stern ☆ und erscheint als Favorit separat oben im Favoriten-Tab.
- **Echte Unicode-Zeichen** werden eingefügt (`\u00A0`, `\u00AD`, `\u202F` …) – keine HTML-Entities, nichts wird escaped.
- **Kontextmenü-Einträge** für geschützte und weiche Trenner: Rechtsklick im Editor → „Geschütztes Leerzeichen (nbsp)", „Schmales geschütztes Leerzeichen (nnbsp)", „Weiches Trennzeichen (shy)".
- **Toggle-Button** `for_chars_symbols_invisibles`: macht alle sonst unsichtbaren Steuerzeichen (nbsp, nnbsp, shy, zwsp, zwj, zwnj, lrm, rlm) im WYSIWYG mit einem dezenten Label-Marker sichtbar. Der Marker ist `data-mce-bogus="1"` – wird nie gespeichert.
- **Typografie-Aktionen** auf der Markierung: Anführungszeichen DE/DE-CH/EN/FR, Gedankenstrich-/en-dash-Normalisierung, NBSP vor Einheiten (`5 kg` → `5 kg`), Soft-Hyphen-Vorschläge, Telefonnummern normalisieren (E.164/national).
- **Shortcut**: `Strg/⌘ + Shift + I` öffnet das Panel.
- **Autoreplace (opt-in)**: Live-Ersetzungen beim Tippen – `(c)`→©, `(r)`→®, `(tm)`→™, `...`→…, `->`→→, `+/-`→±, `1/2`→½, `2^3`→2³ u. v. m. Eigene Regeln (inkl. Regex mit `$1`-Backreferences) per Profil konfigurierbar; nicht aktiv in `<code>`, `<pre>`, `<kbd>`, `<samp>`. Siehe *Optionen*.
- **Konfigurierbar per Profil-Assistent** (seit 8.5.3): Autoreplace kann im Editor-Profil ohne YAML-Handarbeit an-/ausgeschaltet werden – inklusive Pflege eigener Text- und Regex-Regeln über eine Repeater-Tabelle „Typografie-Autoreplace (for_chars_symbols)".

### Aktivierung im Profil

```javascript
plugins: 'for_chars_symbols ...',
toolbar: '... for_chars_symbols for_chars_symbols_invisibles ...',
menu: {
    insert: {
        title: 'Einfügen',
        items: '... for_chars_symbols charmap emoticons ...'
    }
},
```

Das Plugin registriert zwei Toolbar-Buttons und mehrere Menu-Items:

| Item | Typ | Zweck |
|---|---|---|
| `for_chars_symbols` | Button/MenuItem | Picker-Panel öffnen |
| `for_chars_symbols_invisibles` | Toggle-Button/MenuItem | Unsichtbare Zeichen im Editor sichtbar machen |
| `fcs_insert_nbsp`, `fcs_insert_nnbsp`, `fcs_insert_shy`, `fcs_insert_zwsp` | MenuItem | Direkt-Einfügen geschützter/weicher Trenner (ohne Dialog) |
| `fcs_insert_invisibles` | NestedMenuItem | Gruppiert alle vier Direkt-Einfüger |

### Optionen

- `for_chars_symbols_locale` (`string`): `de` (Default), `de-ch`, `en`, `fr` – steuert Anführungszeichen und Quote-Normalisierung.
- `for_chars_symbols_autoreplace` (`boolean`, Default `false`): aktiviert Live-Ersetzungen beim Tippen (getriggert durch Space/Enter/Satzzeichen). Eingebaute Regeln: `(c)`→©, `(r)`→®, `(tm)`→™, `(p)`→℗, `...`→…, `->`/`-->`→→, `<-`/`<--`→←, `==>`→⇒, `+/-`→±, `!=`→≠, `<=`→≤, `>=`→≥, `~=`→≈, `1/2`→½, `1/4`→¼, `3/4`→¾, `2^3`→2³. Greift nicht in `<code>`, `<pre>`, `<kbd>`, `<samp>`.
- `for_chars_symbols_autoreplace_defaults` (`boolean`, Default `true`): auf `false` setzen, um die eingebauten Standardregeln zu deaktivieren (nur eigene Regeln aktiv).
- `for_chars_symbols_autoreplace_rules` (`array`, Default `[]`): eigene Ersetzungsregeln. Unterstützte Formate (mischbar):
  - Array-Kurzform: `["(tel)", "+49 2843 999999"]`
  - Objekt: `{ from: "(zvk)", to: "Zahlung per Vorkasse" }`
  - Regex mit Backreferences: `{ re: "\\(kw(\\d{1,2})\\)", to: "KW $1" }`
  Custom-Regeln überschreiben Defaults bei gleichem `from`. YAML-Beispiel im `profile`-Feld des Profils:

  ```yaml
  for_chars_symbols_autoreplace: true
  for_chars_symbols_autoreplace_rules:
    - ["(tel)",  "+49 2843 999999"]
    - ["(mail)", "info@example.com"]
    - { re: "\\(kw(\\d{1,2})\\)", to: "KW $1" }
  ```

### Pflege im Profil-Assistent

Seit **8.5.3** ist Autoreplace komplett im **Profil-Assistent** konfigurierbar (Editor-Profil bearbeiten → Block *Typografie-Autoreplace (for_chars_symbols)*) – keine YAML-/JS-Handarbeit mehr nötig:

- Checkbox **Autoreplace aktivieren** → setzt `for_chars_symbols_autoreplace`.
- Checkbox **Default-Regeln nutzen** → setzt `for_chars_symbols_autoreplace_defaults` (Standard: `true`).
- Repeater-Tabelle **Eigene Regeln** mit den Spalten *Typ* (`Text` oder `Regex`), *Von* (Muster) und *Nach* (Ziel). Der Button *Beispiele einfügen* füllt `(tel)`, `-->`, `<--` sowie die Regex `\(kw(\d{1,2})\)` → `KW $1` vor.

Der Assistent serialisiert die Tabelle beim Speichern automatisch in `for_chars_symbols_autoreplace_rules` als Objekte (`{from, to}` für Text-Regeln, `{re, to}` für Regex-Regeln). Beim erneuten Öffnen eines Profils werden bestehende Regeln – auch in der Kurzform `["from","to"]` – zurück in die Tabelle geladen.

### Profil-Assistent: Mehrere Toolbars & geschützte Extras

Der Profil-Assistent unterstützt jetzt auch **mehrere Toolbar-Zeilen**. Jede Zeile im Repeater wird als eigener TinyMCE-Toolbar-String gespeichert; bei mehreren Zeilen erzeugt der Assistent automatisch `toolbar: ['…', '…']`. Über **Toolbar-Ansicht** wird zusätzlich `toolbar_mode` gepflegt (`sliding`, `floating`, `wrap`, `scrolling`).

- **Toolbar anzeigen** deaktivieren → der Assistent schreibt `toolbar: false`, sodass Profile ohne Toolbar und ohne Menüleiste möglich bleiben.
- **Geschützte Extras** werden immer **nach** den generierten Optionen angehängt. Damit lassen sich individuelle TinyMCE-Optionen wie `toolbar_sticky`, eigene Funktionen oder bewusste Overrides pflegen, ohne dass der Assistent sie beim nächsten Generieren entfernt.
- Beim Laden bestehender Profile wandern nicht vom Assistenten verwaltete Optionen automatisch in dieses Feld, damit bestehende Sonderkonfigurationen kompatibel bleiben.

### Aktions-Favoriten

Jede Typografie-Aktion (Anführungszeichen DE/EN/FR, Normalisierung, NBSP-vor-Einheiten, en-Dash-Ranges, Soft-Hyphen, Telefonnummern …) besitzt einen Stern ☆, über den sie als Favorit markiert wird. Favorisierte Aktionen erscheinen gebündelt oben im Favoriten-Tab, getrennt von den Zeichen-Favoriten, und sind pro Browser (`localStorage`) persistent.

### Command / API

```javascript
tinymce.activeEditor.execCommand('forCharsSymbolsOpen');
tinymce.activeEditor.execCommand('forCharsSymbolsToggleInvisibles');
```

## FriendsOfREDAXO Abkürzungen / Fremdwörter (`for_abbr`)

Das Plugin `for_abbr` fügt semantisches `<abbr title="…">`-Markup für Abkürzungen, Fachbegriffe und Fremdwörter ein — wichtig für Screenreader (WCAG 3.1.4) und SEO. Hovern zeigt in Browsern zusätzlich den `title`-Tooltip.

- **Dialog** mit Anzeigetext, Langform (→ `title`) und optionalem `lang`-Attribut für Fremdwörter.
- **Edit-Modus:** Cursor in/auf einem bestehenden `<abbr>` → beim Öffnen werden die Felder aus dem Element befüllt. Zusätzlicher *Entfernen*-Button unwrappt das Element.
- **Context-Toolbar** erscheint direkt am selektierten `<abbr>` für schnellen Zugriff.
- **Tastaturkürzel:** <kbd>Ctrl/Cmd + Alt + A</kbd>.
- **Optionales Glossar** über die Editor-Option `for_abbr_glossary`:

  ```yaml
  plugins: 'for_abbr ...',
  toolbar: '... for_abbr ...',
  for_abbr_glossary:
    - { term: HTML,  title: 'Hypertext Markup Language',             lang: en }
    - { term: CSS,   title: 'Cascading Style Sheets',                lang: en }
    - { term: WCAG,  title: 'Web Content Accessibility Guidelines',  lang: en }
    - { term: DSGVO, title: 'Datenschutz-Grundverordnung' }
    - { term: z. B., title: 'zum Beispiel' }
  ```

  Sobald der eingegebene Anzeigetext (case-insensitive) einer Glossar-Term entspricht, werden `title` und `lang` im Dialog automatisch vorgeschlagen.

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

| Variable                                                  | Zweck                                         |
| --------------------------------------------------------- | --------------------------------------------- |
| `--for-toc-bg`, `--for-toc-border-color`                  | Hintergrund & linke Akzent-Border             |
| `--for-toc-link-color` / `-hover-color` / `-active-color` | Link-Farben (inkl. `aria-current`)            |
| `--for-toc-list-indent`                                   | Einrückung der Unter-Listen                   |
| `--for-toc-number-separator`                              | Trennzeichen zwischen Ebenen (Default `.`)    |
| `--for-toc-number-suffix`                                 | Zeichen nach der Nummer (Default Leerzeichen) |
| `--for-toc-number-color`, `--for-toc-number-font-weight`  | Styling der Nummern                           |
| `--for-toc-number-min-width`, `--for-toc-number-gap`      | Einrückungs-Spalte für die Nummer             |
| `--for-toc-sticky-top`, `--for-toc-sticky-max-height`     | für `.for-toc--sticky`                        |

Dark-Mode-Fallback über `@media (prefers-color-scheme: dark)` ist im Stylesheet enthalten.

## FriendsOfREDAXO oEmbed Plugin (`for_oembed`)

Video-Einbettung per URL-Paste – YouTube & Vimeo werden sofort erkannt. Im Editor gibt es eine echte Live-Vorschau (iframe + Overlay, `contenteditable="false"`), gespeichert wird das **CKEditor-5-kompatible** Format:

```html
<figure class="media">
  <oembed url="https://www.youtube.com/watch?v=…"></oembed>
</figure>
```

Damit lassen sich Inhalte 1:1 zwischen REDAXO/TinyMCE und CKE5-basierten Systemen austauschen.

### Features

- **Paste-Erkennung:** Einfach eine YouTube- oder Vimeo-URL in den Editor pasten – wird automatisch in einen Video-Block umgewandelt.
- **Toolbar-Button & Menü:** `for_oembed`, plus Context-Toolbar mit Edit-/Remove-Button, plus Doppelklick zum Bearbeiten.
- **Commands:** `forOembedInsert`, `forOembedEdit`.
- **Provider:** YouTube (watch/shorts/embed/youtu.be/nocookie), Vimeo (vimeo.com, player.vimeo.com). Erweiterbar im `parseUrl`-Modul.
- **Live-Preview im Editor:** Echter iframe mit YouTube/Vimeo-Badge, Overlay fängt Klicks ab (Video spielt im Editor nicht ab, Cursor kann nicht reinrutschen).
- **Save-Format:** CKE5-kompatibles `<figure class="media"><oembed url="…"></oembed></figure>` – wird beim Speichern automatisch aus der Preview zurückgebaut (`GetContent`-Event).
- **Reverse-Import:** Vorhandene CKE5-Inhalte mit `<oembed>` werden beim Laden in die Preview entfaltet (`SetContent`-Event).

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
<figure
  class="media for-oembed for-oembed--youtube"
  contenteditable="false"
  data-for-oembed-url="https://www.youtube.com/watch?v=…"
>
  <div class="for-oembed__ratio">
    <iframe
      src="https://www.youtube.com/embed/…"
      allow="…"
      allowfullscreen
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
    <div class="for-oembed__overlay"></div>
  </div>
</figure>
```

## Troubleshooting / Häufige Probleme

### Quickbar oder andere Einstellungen werden nicht übernommen

**Symptom:** Die Quickbar (oder andere über den Profil-Assistenten konfigurierte Optionen wie `plugins`, `toolbar`) wird im Editor immer auf die TinyMCE-Standardwerte zurückgesetzt, obwohl sie im Profil gespeichert wurde.

**Ursache:** In aktuellen Versionen liegt die Profilkonfiguration ausschließlich in der Spalte `profile`. Probleme entstehen meist durch veraltete Profile/Exporte aus früheren Versionen oder gecachte `profiles.js`-Dateien.

**Lösung:**

1. AddOn mindestens auf `v8.9.0` aktualisieren (Updatepfad setzt `v8.8.1` voraus).
2. Profil speichern oder `profiles.js` neu generieren, damit die aktuelle Konfiguration geschrieben wird.
3. Bei JSON-Import alte Exporte mit `extra` sind weiterhin nutzbar; sie werden beim Import automatisch nach `profile` migriert.

---

### Profil-Änderungen werden im Editor nicht sichtbar

Nach dem Speichern eines Profils muss der Browser-Cache geleert werden (Strg+Shift+R / Cmd+Shift+R), da `profiles.js` als statische Datei ausgeliefert wird.

---

### TinyMCE zeigt eine Lizenzwarnung

Jedes Profil muss `license_key: 'gpl',` in der Konfiguration enthalten. Bei eigenen Profilen diesen Eintrag am Anfang des `profile`-Feldes ergänzen. Der **Profil-Fixer** prüft unter **„TinyMCE 8 – Profil-Migration & Kompatibilitätsprüfung"** alle Profile auf diesen und weitere Kompatibilitätsprobleme.

---

## Entwickler

Informationen zur Erweiterung des Addons, zur Registrierung eigener Plugins,
zum Build-Prozess und zu Extension Points finden Sie in der
[Entwickler-Dokumentation](DEVS.md) oder im Backend unter dem Reiter "Entwickler".

## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce/blob/master/LICENSE.md) – siehe [LICENSE.md](LICENSE.md)
- TinyMCE: [GPL v2+ LICENSE](https://github.com/tinymce/tinymce/blob/develop/license.md) (ab Version 8.0) – gebündelt unter [assets/vendor/tinymce/license.md](assets/vendor/tinymce/license.md), Drittanbieter-Hinweise unter [assets/vendor/tinymce/notices.txt](assets/vendor/tinymce/notices.txt)
- Eigene Custom-Plugins (`custom_plugins/*`): MIT (als Teil dieses AddOns)

Für kommerzielle Nutzung ohne GPL bietet Tiny kostenpflichtige Lizenzen an – siehe [tiny.cloud](https://www.tiny.cloud/). In diesem AddOn wird standardmäßig `license_key: 'gpl'` gesetzt.

## Author

**Friends Of REDAXO**

- http://www.redaxo.org
- https://github.com/FriendsOfREDAXO
