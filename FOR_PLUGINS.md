# FriendsOfREDAXO-Plugins für TinyMCE

Dieses AddOn liefert neben den Standard-Plugins von TinyMCE eine Reihe eigener **FOR-Plugins** (`for_*`). Sie sind Open Source, speziell für REDAXO optimiert und decken Funktionen ab, für die sonst teils kommerzielle TinyMCE-Premium-Plugins oder externe Editor-Frameworks (wie CKEditor 5) nötig wären.

Im **Profil-Assistenten** erscheinen alle Plugins dieses AddOns mit einem farbigen **Badge** (orange = FOR, blau = REDAXO/Klassiker) und sind in Plugin-Liste, Toolbar-Buttons und Custom-Menu-Items optisch hervorgehoben.

> Diese Datei beschreibt die **mitgelieferten Plugins im Detail**. Für die allgemeine Bedienung (Profile, Style-Sets, Snippets, Konfiguration) siehe die [README.md](README.md). Für Entwickler-Details (Build, Extension Points, eigene Plugins registrieren) siehe [DEVS.md](DEVS.md).

## Gruppen-Übersicht

| Gruppe | Plugins |
| --- | --- |
| Medien & Einbettung | `for_images`, `for_oembed`, `for_video`, `mediapaste` |
| Struktur & Navigation | `for_toc`, `for_footnote` |
| Listen, Embeds & Content | `for_checklist`, `for_checklist_feature`, `for_htmlembed`, `for_markdown` |
| Sprache & Typografie | `for_chars_symbols`, `for_abbr`, `quote`, `phonelink` |
| Barrierefreiheit | `for_a11y` |
| Paste-Pipeline | `cleanpaste`, `mediapaste` |
| REDAXO-Integration | `snippets`, `link_yform` |

| Plugin | Zweck | Toolbar/Menü |
| --- | --- | --- |
| `for_images` | Bilder als Figure-Workflow (Mediapool-Show/Swap, Presets, Caption) – zusammen mit Core `image` | `for_images` |
| `for_oembed` | YouTube-/Vimeo-Einbettung mit Live-Preview, **CKE5-kompatibles Save-Format** `<figure class="media"><oembed>` | `for_oembed` |
| `for_video` | Lokale Videos aus dem Mediapool (HTML5 `<video>`) | `for_video` |
| `for_htmlembed` | Geschützte HTML-/JS-Einbettung (iframe, Widgets, Tracking) | `for_htmlembed` |
| `for_checklist` / `_feature` | Todo-Listen bzw. Feature-Listen, CKE5-Import (`ul.todo-list`) | `for_checklist`, `for_checklist_feature` |
| `for_footnote` | Fußnoten mit Auto-Nummerierung & bidirektionalen Links | `for_footnote_insert`, `for_footnote_update` |
| `for_toc` | Live-Inhaltsverzeichnis aus den Headings | `for_toc_insert`, `for_toc_update` |
| `for_a11y` | Accessibility-Checker on demand mit Quickfix-Buttons | `for_a11y` |
| `for_markdown` | Markdown → HTML per Dialog (markdown-it 14, GFM, Tasklisten) | `for_markdown_paste` |
| `for_chars_symbols` | Zeichen + Emoji + Typografie als Panel, optionales Autoreplace | `for_chars_symbols`, `for_chars_symbols_invisibles` |
| `for_abbr` | `<abbr>`-Auszeichnung + optionales Glossar | `for_abbr` |
| `link_yform` | YForm-Datensätze direkt verlinken | Link-Dialog-Erweiterung |
| `phonelink` | `tel:`-Links mit Normalisierung | `phonelink` |
| `quote` | Semantisches `<blockquote>` + `<footer>`/`<cite>` | `quote` |
| `cleanpaste` | Office-/Word-Cleanup, schützt FOR-Markup | – (PastePreProcess) |
| `mediapaste` | Auto-Upload eingefügter Bilder in den Mediapool | – (Paste-Handler) |
| `snippets` | HTML-Bausteine aus REDAXO-Snippet-Verwaltung | `snippets` |

---

## Medien & Einbettung

### `for_images` – Bilder im Figure-Workflow

Ergänzt das Core-Plugin `image` und übernimmt den erweiterten Figure-Workflow.

- **Mediapool-Aktionen am Bild:** „Im Mediapool anzeigen" und „Aus Mediapool austauschen" (über `mceImage`-Dialog, ohne Verlust bestehender Klassen)
- **Image-Width-Presets** (z. B. 25 %, 50 %, 100 %) statt Pixel-Resize
- **Ausrichtungs-Presets:** links, rechts, zentriert, keine
- **Effekt-Presets:** Schatten, Rundungen, Rahmen (togglebar)
- **Alt-Text-Workflow:** Dialog mit Statusanzeige am Toolbar-Button
- **Caption-Workflow:** `figcaption` einfügen, aktualisieren, entfernen
- **Figure-Wrapper statt Inline-Style:** Preset-Klassen sitzen auf der `figure`, sauberes Save-Format
- **Robuster Block:** Delete/Cut/Copy behandeln Bild + Caption als Einheit
- **Responsive Klassen-Strategie:** UIkit, Bootstrap oder projektindividuelle Presets

**Empfehlung:** Immer **zusammen mit dem Core-Plugin `image`** aktivieren – `image` liefert die Basis-Bildfunktionalität, `for_images` die Figure-Toolbar mit Presets/Mediapool.

**Profil-Konfiguration:**

```javascript
plugins: 'for_images image ...',
imagewidth_presets: [
    { label: 'Original', class: '' },
    { label: 'Klein',    class: 'uk-width-small@m' },
    { label: 'Mittel',   class: 'uk-width-medium@m' },
    { label: '50%',      class: 'uk-width-1-2@m' },
    { label: '100%',     class: 'uk-width-1-1' },
],
imagealign_presets: [
    { label: 'Keine',      class: '' },
    { label: 'Links',      class: 'uk-float-left uk-margin-right uk-margin-bottom' },
    { label: 'Rechts',     class: 'uk-float-right uk-margin-left uk-margin-bottom' },
    { label: 'Zentriert',  class: 'uk-display-block uk-margin-auto' },
],
imageeffect_presets: [
    { label: 'Schatten klein',  class: 'uk-box-shadow-small' },
    { label: 'Schatten mittel', class: 'uk-box-shadow-medium' },
    { label: 'Abgerundet',      class: 'uk-border-rounded' },
    { label: 'Rahmen',          class: 'uk-border' },
],
```

Templates im Profil-Assistenten: **UIkit 3**, **Bootstrap 5**, **Allgemein** (generische CSS-Klassen, siehe Frontend-CSS unten).

**HTML-Ausgabe:**

```html
<figure class="uk-float-left uk-margin-right uk-margin-bottom uk-width-medium@m">
    <img class="uk-width-1-1" src="/media/bild.jpg" alt="Beschreibung" width="800" height="600">
    <figcaption>Optionale Bildunterschrift</figcaption>
</figure>
```

**Frontend-CSS für die „Allgemein"-Vorlage** (ohne UIkit/Bootstrap):

```php
echo '<link rel="stylesheet" href="' . rex_addon::get('tinymce')->getAssetsUrl('css/for_images.css') . '">';
```

Enthält Breiten (`img-width-small/medium/large/full/25/50/75`), Ausrichtung (`img-align-*`), Effekte (`img-shadow-*`, `img-rounded`, `img-border`) und automatisches Float-Clearing auf Mobilgeräten.

---

### `for_oembed` – oEmbed-Einbettungen mit Live-Preview

Nachfolger des kommerziellen TinyMCE-Premium-Plugins `mediaembed`. Save-Format ist **CKEditor-5-kompatibel** – Inhalte lassen sich 1:1 zwischen REDAXO/TinyMCE und CKE5-basierten Systemen austauschen.

- **Paste-Erkennung:** Eine YouTube-/Vimeo-URL einfügen → wird sofort zum Embed-Block.
- **Toolbar-Button & Menü:** `for_oembed`. Doppelklick / Context-Toolbar zum Bearbeiten.
- **Provider:** YouTube (watch / shorts / embed / youtu.be / nocookie), Vimeo (vimeo.com, player.vimeo.com). Erweiterbar im `parseUrl`-Modul.
- **Live-Preview im Editor:** echter iframe + Overlay (`contenteditable="false"`) – Video spielt im Editor nicht ab, Cursor bleibt sauber.
- **Save-Format:**

  ```html
  <figure class="media">
    <oembed url="https://www.youtube.com/watch?v=…"></oembed>
  </figure>
  ```

- **Reverse-Import:** Vorhandene CKE5-Inhalte mit `<oembed>` werden beim Laden in die Preview entfaltet.

**Frontend-Rendering – PHP-Renderer (empfohlen):**

```php
use FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer;

echo OembedRenderer::render($article->getValue('art_text'));
```

**Frontend-Rendering – JS-Helper:**

```php
echo '<script src="' . rex_addon::get('tinymce')->getAssetsUrl('js/for_oembed.js') . '" defer></script>';
```

**Optionale Vidstack-Integration:** Ist das [`vidstack`-AddOn](https://github.com/FriendsOfREDAXO/vidstack) installiert, nutzt der Renderer automatisch `<media-player>`-Komponenten statt iframe.

```php
echo OembedRenderer::registerFrontendAssets();
```

---

### `for_video` – Lokale Videos aus dem Mediapool

Für MP4/WebM-Dateien aus dem REDAXO-Mediapool.

- HTML5-`<video controls>`
- Optional: Poster-Bild, `muted`, `autoplay`, `loop`, `playsinline`
- Saubere `<source>`-Listen für mehrere Formate
- Mediapool-Picker zur Dateiauswahl

---

### `mediapaste` – Bilder beim Paste automatisch hochladen

Bilder per Drag & Drop, Copy-Image im Browser oder Screenshot-Clipboard landen direkt im REDAXO-Medienpool. Kein manueller Upload-Umweg.

- **Drag & Drop:** Bilddateien werden automatisch hochgeladen, der Original-Dateiname bleibt erhalten.
- **Copy Image aus Browser:** binäre Bilddaten aus der Zwischenablage werden hochgeladen, externe URLs werden nicht eingefügt. Dateiname aus dem `<img src="…">` im Clipboard-HTML extrahiert.
- **Screenshots/Clipboard-Binaries:** werden mit `image-<timestamp>.<ext>` benannt.
- **Kategorie-Picker:** Dialog zur Auswahl der Medienkategorie unter Berücksichtigung der REDAXO-Rechte (`rex_media_perm`).
- **Default-Kategorie:** Profil kann eine feste Kategorie vorgeben – dann entfällt der Dialog.
- **Formate:** JPG, PNG, GIF, WebP, AVIF, SVG (`images_file_types` wird intern entsprechend erweitert).
- **TinyMCE-interne Blob-Namen** (`mceclip*`, `blobid*`, `imagetools*`) werden durch saubere Dateinamen ersetzt.

**Einstellungen** unter **TinyMCE → Einstellungen → Bild-Upload**:

- Upload generell ein/aus
- Default-Kategorie: `-1` = Dialog, `0` = Root, `>0` = feste ID
- Optionaler Media-Manager-Type (z. B. `tiny`)

> Hinweis SVG: Wenn ein Dateityp nicht hochgeladen werden kann, **Erlaubte Dateitypen** in der REDAXO-Systemeinstellung prüfen.

---

## Struktur & Navigation

### `for_toc` – Inhaltsverzeichnis mit Live-Sync

- Button **Inhaltsverzeichnis einfügen** scannt alle Überschriften (h1–h6) und erzeugt einen `<nav class="for-toc">`-Block.
- **Stabile Slug-IDs** auf den Überschriften (`for-toc-<slug>`, kollisionsfrei). Bestehende IDs bleiben beim Re-Edit erhalten.
- **Live-Sync** wie bei `for_footnote`: beim Tippen / Einfügen / Undo wird die TOC synchron gehalten.
- **Einstellungen pro TOC** (Dialog): Titel, Ab-/Bis-Ebene, nummeriert (`<ol>`) vs. unsortiert (`<ul>`). Gespeichert als `data-for-toc-*`.
- **Context-Toolbar** am aktiven TOC-Block: Aktualisieren, Einstellungen, Entfernen.
- **Hierarchische Nummerierung** bei `<ol>` über CSS-Counters (`1`, `1.1`, `1.1.1` …). Filler-Einträge zählen nicht mit.
- **Editor-Parität:** Counter-Regeln werden zusätzlich über `editor.dom.addStyle()` in den Editor-Iframe injiziert.
- **Frontend-CSS** unter `assets/css/for_toc.css`, framework-agnostisch über CSS-Variablen (`--for-toc-*`) inkl. Dark-Mode und optionaler `.for-toc--sticky`-Variante.
- **Optionales Frontend-JS** `for_toc.js` für Active-Section-Highlighting via IntersectionObserver.

**Wichtige CSS-Variablen:**

| Variable | Zweck |
| --- | --- |
| `--for-toc-bg`, `--for-toc-border-color` | Hintergrund & Akzent-Border |
| `--for-toc-link-color` / `-hover-color` / `-active-color` | Link-Farben inkl. `aria-current` |
| `--for-toc-list-indent` | Einrückung der Unter-Listen |
| `--for-toc-number-separator` | Trennzeichen zwischen Ebenen (Default `.`) |
| `--for-toc-number-suffix` | Zeichen nach der Nummer |
| `--for-toc-number-color`, `--for-toc-number-font-weight` | Styling der Nummern |
| `--for-toc-sticky-top`, `--for-toc-sticky-max-height` | für `.for-toc--sticky` |

---

### `for_footnote` – Fußnoten

Freie, eigenständige Implementierung – kein Ersatz und keine API-Kompatibilität zum kommerziellen TinyMCE-Premium-Plugin.

- **Toolbar:** `for_footnote_insert`, `for_footnote_update`
- **Menü:** `for_footnote` (für das Insert-Menü)
- **Commands:** `forFootnoteInsert`, `forFootnoteUpdate`
- **Automatische Nummerierung** nach DOM-Reihenfolge
- **Bidirektionale Verlinkung** (Nummer ↔ Eintrag)
- Automatische Sektion `<div class="for-footnotes">` am Dokumentende
- **Enter → Soft-Break** innerhalb eines Fußnoteneintrags (keine verschachtelten `<li>`)
- **Waisen-Cleanup** über den Update-Button

**HTML-Ausgabe:**

```html
<p>
  Text<sup class="for-footnote-ref" data-for-fn-id="abc1z" id="for-fnref-abc1z">
    <a href="#for-fn-abc1z">[1]</a>
  </sup>
  mit Fußnote.
</p>

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

**Frontend-CSS:** `assets/css/for_footnotes.css` – framework-agnostisch über CSS-Variablen (`--for-footnotes-*`, `--for-footnote-ref-*`, `--for-footnote-back-*`) inkl. Dark-Mode-Fallback.

---

## Listen, Embeds & Content

### `for_checklist` / `for_checklist_feature` – Moderne Checklisten

Moderne Checkliste im Editor – ohne klassische Form-Checkbox. Die Checkbox wird als reines CSS-`::before`-Element gerendert und ist vollständig über CSS-Variablen anpassbar. **Beim Einfügen von CKEditor-5-Inhalten** werden `ul.todo-list`-Strukturen automatisch in das neue Format konvertiert.

- **Zwei Varianten – zwei Buttons:**
  - `for_checklist` – **To-Do-Liste**: erledigte Einträge durchgestrichen und ausgegraut.
  - `for_checklist_feature` – **Feature-/Benefit-Liste**: neue Einträge sofort als „erfüllt" markiert, kein Strikethrough, grüner Check, offene Einträge mit gestricheltem Rahmen.
- Klick auf den gleichen Button in einer bestehenden Liste hebt sie auf; Klick auf den anderen Button wechselt die Variante ohne Datenverlust.
- **Command:** `forChecklistToggle` (Parameter `'todo'` oder `'feature'`).
- **HTML-Ausgabe:** `<ul class="for-checklist"><li class="for-checklist__item" data-checked="true|false">…</li></ul>`.
- **CKE5-Import:** `ul.todo-list` → `ul.for-checklist`, inkl. Übernahme des Checked-Zustands.
- Toggle per Klick auf die Checkbox-Zone in einer `undoManager.transact`-Transaktion.
- Modernes Design: abgerundete Checkbox, Hover-/Checked-Zustand, SVG-Häkchen, Dark-Mode (`prefers-color-scheme`), Print-Variante.

**Frontend-CSS:** `assets/css/for_checklist.css` mit umfangreichen Variablen (`--for-checkbox-*`, `--for-checklist-*`, `--for-checklist-feature-*`).

---

### `for_htmlembed` – Geschützte HTML-Einbettung

Geschützte HTML-/JS-Einbettung für Widgets, Tracking-Pixel, Social-Embeds, `<iframe>`, Mini-Apps. Der Code-Block ist im Editor **nicht direkt editierbar** (`contenteditable="false"`), nur als Ganzes verschiebbar/löschbar, und wird über einen separaten Dialog bearbeitet.

- Toolbar-Button & Menüeintrag `for_htmlembed`
- Commands: `forHtmlEmbedInsert`, `forHtmlEmbedEdit`
- **Doppelklick** öffnet den Bearbeiten-Dialog
- **Context-Toolbar** mit Edit- und Remove-Button
- Save-Format unverändert:

  ```html
  <div class="for-htmlembed" contenteditable="false">
    <!-- beliebiger HTML/JS/CSS-Code -->
  </div>
  ```

- Editor-Chrome (dashed border + Badge) nur im Editor-Iframe sichtbar; im Frontend bleibt nur ein schlichtes `<div>`.
- Setzt `xss_sanitization: false` und `allow_script_urls: true` auf den Editor, sobald geladen – damit `<script>`, `<iframe>`, `<style>` und `on*`-Attribute nicht entfernt werden. **Nur aktivieren, wenn Redakteure beliebigen Code einbetten dürfen sollen.**
- Die Textarea im Dialog erhält die Klasse `rex-js-code-editor` – das [code-AddOn](https://github.com/FriendsOfRedaxo/code) klinkt sich automatisch ein, sonst Monospace-Fallback.

---

### `for_markdown` – Markdown-Import per Dialog

Dialog-basierter Markdown → HTML Konverter. Kein Autodetect, keine Paste-Interception – der Redakteur öffnet den Dialog, fügt Markdown ein, das Ergebnis wird an der Cursor-Position eingesetzt. Kollisionsfrei zum `markdowneditor`-AddOn (eigener Namespace `for_markdown*` / `for-markdown-*`).

- **Engine:** [markdown-it 14](https://github.com/markdown-it/markdown-it) gebündelt im Plugin-Bundle – kein CDN, offline-fähig.
- **CommonMark + GFM:** Tables, Autolinks (`linkify`), SmartQuotes (`typographer`), harte Zeilenumbrüche (`breaks`), fenced Code.
- **Tasklisten → `for_checklist`:** `- [ ]` / `- [x]` → `<ul class="for-checklist for-checklist--feature">…</ul>`.
- **Fenced Code → `codesample`-kompatibel:** ` ```php …``` ` → `<pre class="language-php"><code>…</code></pre>` (weiter editierbar per Core-`codesample`).
- **Toolbar/Menü:** `for_markdown_paste` (Label „Markdown einfügen…").
- **Command:** `forMarkdownOpenDialog` – aus eigenen Buttons / Shortcuts auslösbar.

`for_markdown` erzeugt ausschließlich Markup der anderen Plugins (`for-checklist`, `language-*`) und normales semantisches HTML – keine eigene CSS-Datei nötig.

---

## Sprache & Typografie

### `for_chars_symbols` – Zeichen, Symbole & Emoji

Unified Picker für Sonderzeichen, native Emojis und Typografie. Als **schwebendes, draggable Panel** – kein blockierendes Modal, bleibt offen, damit mehrere Zeichen/Emojis in Folge eingefügt werden können.

- **Tabs:** „★ Favoriten / ⏱ Zuletzt verwendet", „Zeichen", „Emoji" (nach Kategorien), „Typografie" (Aktionen auf der Markierung).
- **Live-Suche** pro Tab – Name, Zeichen oder Codepoint (`U+…`).
- **Favoriten + Zuletzt verwendet** persistent im Browser (`localStorage`), max. 24 Einträge.
- **Echte Unicode-Zeichen** statt HTML-Entities (`\u00A0`, `\u00AD`, `\u202F` …) – nichts wird escaped.
- **Direkt-Einfüge-Menu-Items:** `fcs_insert_nbsp`, `fcs_insert_nnbsp`, `fcs_insert_shy`, `fcs_insert_zwsp` oder gesammelt via `fcs_insert_invisibles`.
- **Kontextmenü-Einträge** für geschützte/weiche Trenner.
- **Invisibles-Toggle** `for_chars_symbols_invisibles`: macht nbsp, nnbsp, shy, zwsp, zwj, zwnj, lrm, rlm im WYSIWYG mit Label-Marker sichtbar. Marker sind `data-mce-bogus="1"` – werden niemals gespeichert.
- **Typografie-Aktionen:** Anführungszeichen DE / DE-CH / EN / FR, en-/em-dash-Normalisierung, NBSP vor Einheiten (`5 kg` → `5 kg`), Soft-Hyphen-Vorschläge, Telefonnummern normalisieren (E.164/national).
- **Aktions-Favoriten:** jede Typografie-Aktion lässt sich über den Stern ☆ als Favorit markieren und erscheint separat oben im Favoriten-Tab.
- **Shortcut:** `Strg/⌘ + Shift + I` öffnet den Picker.

**Optionen:**

| Option | Default | Zweck |
| --- | --- | --- |
| `for_chars_symbols_locale` | `de` | `de`, `de-ch`, `en`, `fr` – Anführungszeichen & Quote-Normalisierung |
| `for_chars_symbols_autoreplace` | `false` | Live-Ersetzungen beim Tippen aktivieren |
| `for_chars_symbols_autoreplace_defaults` | `true` | Eingebaute Standardregeln nutzen |
| `for_chars_symbols_autoreplace_rules` | `[]` | Eigene Regeln (Array/Objekt/Regex) |

**Autoreplace-Standardregeln** (Auszug): `(c)`→©, `(r)`→®, `(tm)`→™, `(p)`→℗, `...`→…, `->`/`-->`→→, `<-`/`<--`→←, `==>`→⇒, `+/-`→±, `!=`→≠, `<=`→≤, `>=`→≥, `~=`→≈, `1/2`→½, `1/4`→¼, `3/4`→¾, `2^3`→2³. Nicht aktiv in `<code>`, `<pre>`, `<kbd>`, `<samp>`.

**Eigene Regeln (YAML im Profil):**

```yaml
for_chars_symbols_autoreplace: true
for_chars_symbols_autoreplace_rules:
    - ["(tel)",  "+49 2843 999999"]
    - ["(mail)", "info@example.com"]
    - { from: "(zvk)", to: "Zahlung per Vorkasse" }
    - { re: "\\(kw(\\d{1,2})\\)", to: "KW $1" }
```

Pflege im Profil-Assistenten ab v8.5.3 ohne YAML-Handarbeit – Repeater-Tabelle „Typografie-Autoreplace".

**Commands:** `forCharsSymbolsOpen`, `forCharsSymbolsToggleInvisibles`.

---

### `for_abbr` – Abkürzungen & Fremdwörter

Semantisches `<abbr title="…">`-Markup für Abkürzungen, Fachbegriffe und Fremdwörter — wichtig für Screenreader (WCAG 3.1.4 *Abkürzungen*) und SEO.

- **Toolbar-Button / Menüeintrag / Context-Toolbar:** `for_abbr` (Toggle-Button mit Active-State auf bestehenden `<abbr>`).
- **Dialog:** Anzeigetext + Langform (→ `title`) + optionales `lang` (z. B. `en` für englische Fremdwörter – Screenreader wechselt dann die Aussprache).
- **Edit-Modus:** Cursor in/auf `<abbr>` → Felder aus dem Element. Zusätzlicher *Entfernen*-Button unwrappt.
- **Shortcut:** <kbd>Ctrl/Cmd + Alt + A</kbd>.
- **Optionales Glossar** via `for_abbr_glossary`: bekannte Abkürzungen werden im Dialog automatisch vorgeschlagen.

```yaml
for_abbr_glossary:
    - { term: HTML,  title: 'Hypertext Markup Language',            lang: en }
    - { term: CSS,   title: 'Cascading Style Sheets',               lang: en }
    - { term: WCAG,  title: 'Web Content Accessibility Guidelines', lang: en }
    - { term: DSGVO, title: 'Datenschutz-Grundverordnung' }
    - { term: z. B., title: 'zum Beispiel' }
```

---

### `quote` – Formatierte Zitate

Fügt ein semantisch sauberes `<blockquote>` mit optionalem Autor und `<cite>` ein.

- **Toolbar-Button / Menüeintrag:** `quote`
- **Dialog-Felder:** Quote-Text (Textarea), Autor, Cite-Quelle
- **Saubere HTML5-Ausgabe:** `<blockquote><p>…</p><footer>Autor, <cite>Quelle</cite></footer></blockquote>`; ist nur Autor oder nur Cite gesetzt, wird der Footer reduziert; sind beide leer, kein Footer.
- Zeilenumbrüche im Zitat-Text werden zu `<br>`.
- HTML-Escaping aller Eingaben – Redakteure können keine versteckten Tags einschleusen.
- Keine Inline-Styles, keine Framework-Abhängigkeit – das Ziel-Stylesheet entscheidet über das Aussehen.

---

### `phonelink` – `tel:`-Links mit Normalisierung

Dialog zum Einfügen einer Telefonnummer als anklickbarer `tel:`-Link.

- **Toolbar-Button / Menüeintrag:** `phonelink` (eigenes SVG-Icon)
- **Dialog-Felder:** *Phone number*, *Text to display*, *Title*
- **Href-Normalisierung:** Die Nummer wird im `href` auf RFC-3966-gültige Zeichen reduziert (`+`, Ziffern, `-.()`). Leerzeichen, `/` oder Buchstaben wandern nicht in den Link.
- **Anzeigetext bleibt** wie eingegeben (Klammern, Leerzeichen, nationale Formatierung erlaubt).
- **Aktuelle Auswahl** wird als initialer *Text to display* übernommen. Bei aktivem `tel:`-Link-Selektor wird die Nummer aus dem `href` rekonstruiert.
- Ergänzt sich mit der *Typografie-Aktion* „Telefonnummer normalisieren" in `for_chars_symbols`.

---

## Barrierefreiheit

### `for_a11y` – Accessibility-Checker mit Quickfix-Panel

Open-Source-Alternative zu TinyMCE Premium `a11ychecker`.

- Läuft **nur auf Knopfdruck**, ändert den Inhalt nicht automatisch.
- Schwebendes, **verschiebbares Befund-Panel** (kein Modal, kein Backdrop) – Editor bleibt sichtbar und bedienbar.
- Geführter Workflow: ein Befund nach dem anderen, Navigation per **◀ / ▶**.
- Pro Befund: **Ignorieren** / **Element bearbeiten** / **Neu prüfen**.
- **Quickfix-Buttons:** Für viele Befunde (Fake-Listen, leere Absätze, generische Linktexte, fette Pseudo-Überschriften, zu viele Leerzeichen, Alt-Text fehlt) gibt es einen Auto-Fix bzw. einen passenden Editor-Dialog.
- **Modularer Aufbau:** Jeder Befundtyp kann einen eigenen Quickfix-Handler registrieren. Eigene Autofix-Strategien lassen sich einfach ergänzen.
- Marker im Editor: rot = Fehler, orange = Warnung, blau-gestrichelt = Hinweis.
- **Regeln** (einzeln abschaltbar via `a11y_rules`): u. a. fehlendes `alt`, generische Link-Texte, leere/übersprungene Überschriften, Tabellen ohne `<th>`/`<caption>`, `<iframe>` ohne `title`, `target="_blank"` ohne Hinweis.

**Public API:**

```javascript
tinymce.activeEditor.plugins.for_a11y.toggleaudit();
const issues = tinymce.activeEditor.plugins.for_a11y.getReport();
```

**Events:** `A11ycheckStart`, `A11ycheckStop`, `A11ycheckIgnore`.

> Aktuell nur deutsche Texte – Mehrsprachigkeit folgt.

---

## Paste-Pipeline

### `cleanpaste` – Office-/Word-Cleanup (PowerPaste-Ersatz)

Freier Ersatz für das kostenpflichtige PowerPaste. Bereinigt eingefügten Text automatisch von Office-/Google-Docs-Markup, unerwünschten Klassen, Styles und leeren Elementen.

- **Office-Cleanup:** Entfernt MS Word / Outlook / Google-Docs-Markup (`MsoNormal`, `docs-*`, `<o:p>`, mso-Conditionals, Smart Tags) bereits auf String-Ebene.
- **DOM-Cleanup:** Entfernt konfigurierbar `class`, `style`, `id`, `data-*`-Attribute.
- **BR-Reduktion** und **Leer-Paragraphen-Entfernung**.
- **Positiv-Listen mit Regex** pro Profil – alles andere wird verworfen (z. B. `^uk-.*` für UIkit-Klassen).
- **Schutz-Liste (nicht überschreibbar)** für `for_*`-Plugin-Markup: Klassen mit Präfix `for-*` sowie `media` bleiben immer erhalten, Attribute mit Präfix `data-for-*` sowie `data-mce-selected` werden nie entfernt. Verhindert Kollisionen mit `for_oembed`, `for_video`, `for_images`, `for_checklist`, `for_toc`, `for_footnote`.
- Greift in `PastePreProcess` – kein sichtbarer Button.

**Konfiguration** unter **TinyMCE → Paste-Einstellungen** (zentral, in `profiles.js` eingebettet – funktioniert auch im Frontend):

- Erlaubte Tags / Klassen / Inline-Styles / IDs / `data-*`-Attribute (jeweils Regex-fähig)
- Cleanup-Stufen: BR-Reduktion, Leer-Paragraph-Entfernung, Office-Strip, DOM-Cleanup

---

### `mediapaste`

Siehe [Medien & Einbettung](#mediapaste--bilder-beim-paste-automatisch-hochladen).

---

## REDAXO-Integration

### `link_yform` – YForm-Datensätze verlinken

Erweitert den Link-Dialog um eine Auswahl über YForm-Tabellen.

- Auswahl von **Tabelle + Datensatz + Feld** direkt im Link-Dialog
- **Konfigurierbares Link-Schema** pro Tabelle mit Platzhaltern – Default ist der interne Marker `tabellenname://id`, der dann im `OUTPUT_FILTER` durch echte URLs ersetzt wird.
- Konfiguration im Profil-Assistenten (Abschnitt *YForm Link-Konfiguration*) oder direkt im Profil:

```javascript
link_yform_tables: {
    title: 'YForm Datensätze',
    items: [
        { title: 'Projekt verlinken',       table: 'rex_yf_project', field: 'title' },
        { title: 'Veranstaltung verlinken', table: 'rex_yf_event',   field: 'name', url: '/event:' },
    ]
}
```

| Key | Typ | Beschreibung |
| --- | --- | --- |
| `title` | String | Titel im Menü (optional) |
| `table` | String | YForm-Tabelle |
| `field` | String | Feldname für den Linktext |
| `url` | String | Optional: Schema für den internen Platzhalter-Link. Standard `tabellenname://`. |

**URL-Ersetzung im Frontend** – Beispiel `boot.php`:

```php
rex_extension::register('OUTPUT_FILTER', function (rex_extension_point $ep) {
    return preg_replace_callback(
        '@(rex_yf_project|rex_yf_event)://(\d+)@',
        function (array $matches): string {
            [$_, $table, $id] = $matches;
            return $table === 'rex_yf_project'
                ? rex_getUrl('', '', ['project_id' => $id])
                : '/index.php?id=' . $id;
        },
        $ep->getSubject(),
    );
});
```

Voraussetzung: YForm-AddOn installiert und aktiv.

---

### `snippets` – HTML-Bausteine aus der Snippet-Verwaltung

Bindet die REDAXO-Snippet-Verwaltung an TinyMCE an. Redakteure können wiederverwendbare HTML-Bausteine direkt aus dem Editor auswählen und einfügen.

- **Menüeintrag:** `snippets` (Standard im *Einfügen*-Menü)
- Snippets werden zentral im Backend gepflegt – Änderungen wirken sofort auf alle Editor-Instanzen.
- Nur-Lese-Ausgabe: das Plugin selbst ändert keine Snippet-Inhalte, es fügt sie an Cursor-Position ein.
- Ideal für wiederkehrende Blöcke (Call-to-Action-Boxen, Disclaimer-Texte, Info-Kästen).

```javascript
plugins: 'snippets ...',
menu: {
    insert: { title: 'Einfügen', items: '... snippets ...' }
},
```

---

## Verwendung im Profil

Alle Plugins werden im Profil wie normale TinyMCE-Plugins aktiviert:

```javascript
plugins: 'lists link image for_images for_oembed for_video for_footnote for_a11y for_toc cleanpaste',
toolbar: 'bold italic | for_images for_oembed for_video | for_footnote for_a11y for_toc',
menu: {
    insert: {
        title: 'Einfügen',
        items: 'for_images for_oembed for_video for_htmlembed | for_checklist for_footnote for_toc_insert | charmap hr'
    }
}
```

**Core-Plugins sinnvoll kombinieren:**

| Core | Empfohlene Ergänzung |
| --- | --- |
| `image` | + `for_images` (beide aktivieren) |
| `media` | → `for_oembed` + `for_video` |
| `paste` | + `cleanpaste` + `mediapaste` |
| `charmap` / `emoticons` | → `for_chars_symbols` (ersetzt beide) |
| `markdowneditor` (AddOn, Editor-Toggle) | + `for_markdown` (Dialog-Import) |

Der **Profil-Assistent** übernimmt das per Klick: Plugins hinzufügen, Toolbar und Einfügen-Menü per Drag & Drop sortieren.

---

Entwickler-Themen wie Quellpfade, Build-Pipeline, Sync-Layout und Extension Points sind in [DEVS.md](DEVS.md) dokumentiert.
