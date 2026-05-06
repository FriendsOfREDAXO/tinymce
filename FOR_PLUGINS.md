# FriendsOfREDAXO-Plugins für TinyMCE

Dieses AddOn liefert neben den Standard-Plugins von TinyMCE eine Reihe eigener **FOR-Plugins** (`for_*`). Sie sind open-source, speziell für REDAXO optimiert und decken Funktionen ab, für die sonst teils kommerzielle TinyMCE-Premium-Plugins nötig wären.

Im **Profil-Assistenten** erscheinen alle FOR-Plugins mit einem farbigen **„FOR"-Badge** und sind bei Plugin-Liste, Toolbar-Buttons und Custom-Menu-Items optisch hervorgehoben.

> **Diese Seite ist die Kurzvorstellung.** Detaillierte Konfiguration, Frontend-CSS-Einbindung, CSS-Variablen und Profil-Beispiele stehen in der [Hilfe-Seite (README)](#).

---

## Übersicht

| Plugin | Zweck | Toolbar-Button / Menü-Eintrag |
|---|---|---|
| `for_images` | Bilder aus dem REDAXO-Mediapool, feste Breiten-Presets, saubere Save-Formate | `for_images` |
| `for_oembed` | oEmbed-Einbettungen (YouTube, Vimeo, …) mit Vorschau | `for_oembed` |
| `for_video` | Lokale Videos aus dem Mediapool einbinden (HTML5 `<video>`) | `for_video` |
| `for_htmlembed` | HTML-Snippets sicher einbetten (iframe-ähnliches Pattern, ohne Inline-Script-Risiken) | `for_htmlembed` |
| `for_checklist` | Aufzählungen mit Checkboxen (Task-Listen) | `for_checklist` |
| `for_checklist_feature` | Feature-Listen mit Checkboxen | `for_checklist_feature` |
| `for_footnote` | Fußnoten im Text mit automatischer Nummerierung & Rück-Verweisen | `for_footnote_insert`, `for_footnote_update` |
| `for_toc` | **Inhaltsverzeichnis** aus den Überschriften – Live-Sync beim Bearbeiten | `for_toc_insert`, `for_toc_update` |
| `for_a11y` | **Accessibility-Checker** on demand – prüft den Inhalt gegen WCAG-nahe Regeln | `for_a11y` |
| `for_markdown` | **Markdown-Import** per Dialog – CommonMark + GFM, Tasklisten werden zu Feature-Listen, fenced Code zu Codesample | `for_markdown_paste` |
| `for_chars_symbols` | **Zeichen, Symbole & Emoji** – Picker mit Kategorien, Suche, Live-Typografie-Helfer (DE-/CH-/EN-/FR-Quotes, en-/em-dash, nbsp vor Einheiten, shy-Trennvorschlag), **Aktions-Favoriten** pro Typografie-Aktion, Zeichen- und Aktions-Favoriten + Zuletzt verwendet pro Browser, optionales **Autoreplace** beim Tippen (`(c)`→©, `->`→→, `1/2`→½, eigene Regeln inkl. Regex) | `for_chars_symbols` |
| `for_abbr` | **Abkürzungen & Fremdwörter** als `<abbr title="…">` auszeichnen – wichtig für Screenreader und SEO. Dialog mit Anzeigetext, Langform und optionalem `lang`-Attribut. Erkennt bestehende `<abbr>` für Edit/Remove. Optionales **Glossar** via `for_abbr_glossary` schlägt passende Langform automatisch vor. Context-Toolbar + Shortcut <kbd>Ctrl/Cmd + Alt + A</kbd> | `for_abbr` |
| `link_yform` | Verlinkt YForm-Datensätze direkt aus dem Editor – Tabellen-/Feldauswahl und konfigurierbares Link-Schema im Profil-Assistenten | Erweiterung des Link-Dialogs |
| `phonelink` | Fügt Telefonnummern als `tel:`-Links ein (inkl. Normalisierung auf RFC-3966-gültige Zeichen) | `phonelink` |
| `quote` | Formatierte Zitate (`<blockquote>`) mit optionalem Autor/`<cite>` einfügen | `quote` |
| `cleanpaste` | Paste-Bereinigung: entfernt Word-/Office-Rauschen, normalisiert Klassen und Attribute, schützt das Markup der `for_*`-Plugins (Klassen `for-*`/`media`, Attribute `data-for-*`) | kein Button – greift in `PastePreProcess` |
| `mediapaste` | Erkennt beim Einfügen eingebettete Bilder aus der Zwischenablage und lädt sie in den Mediapool hoch | Auto-Upload beim Paste |
| `snippets` | Fügt wiederverwendbare HTML-Bausteine aus der REDAXO-Snippet-Verwaltung ein | `snippets` (Menü-Eintrag) |

Die Plugins ohne `for_`-Präfix (`link_yform`, `phonelink`, `quote`, `cleanpaste`, `mediapaste`, `snippets`) sind Bestandteil dieses AddOns und werden dem gleichen Pflege-Standard wie die `for_*`-Plugins unterzogen. Ihre Namen bleiben aus Gründen der Rückwärtskompatibilität mit bestehenden Profilen erhalten; im Profil-Assistenten erscheinen sie identisch (gleiches blaues „REDAXO"-Badge) wie die `for_*`-Familie.

---

## Die FOR-Plugins im Detail

### `for_images` – Bilder aus dem Mediapool

Ersetzt das Core-Plugin `image` und bietet:

- **Mediapool-Dialog** mit Vorschau
- **Image-Width-Presets** aus der Profilkonfiguration (z. B. 25 %, 50 %, 100 %) statt manuellem Pixel-Resize
- Preset-Klassen als `class="img-25"` o. ä. – keine Inline-Styles
- `alt`-Attribut-Verwaltung inkl. dekorativer Markierung (`role="presentation"` + leeres `alt`)
- Automatisches Setzen von `loading="lazy"` und `width`/`height` für CLS-freundliche Ausgabe

> **Tipp:** Wenn `for_images` im Profil aktiv ist, kann das Core-Plugin `image` aus `plugins` entfernt werden.

### `for_oembed` – oEmbed-Einbettungen

Nachfolger des kommerziellen TinyMCE-Premium-Plugins.

- Unterstützt YouTube, Vimeo und weitere oEmbed-Provider
- Zeigt eine **echte Vorschau im Editor** statt nur Platzhalter
- Speichert ein semantisches Wrapper-Markup, sodass Frontend-Lazy-Loading / Cookie-Consent-Wrapper leicht anzubringen ist
- Alternativer Ersatz für das Core-Plugin `media`

### `for_video` – Lokale Videos

Für MP4/WebM-Dateien aus dem Mediapool.

- HTML5-`<video>`-Tag mit `controls`
- Optional Poster-Bild, `muted`, `autoplay`, `loop`, `playsinline`
- Saubere `<source>`-Listen für mehrere Formate

### `for_htmlembed` – Sichere HTML-Einbettungen

Für Custom-Snippets, Drittanbieter-Widgets, iframes.

- Einbetten im Editor als **ruhige Vorschau-Box** (kein Skript-Ausführen beim Editieren)
- Kein `tiny_mce_wiris`/Script-Tag-Chaos in der Quelle
- Guten Schutz gegen Broken-HTML beim Re-Edit

### `for_checklist` & `for_checklist_feature`

- `for_checklist` – interaktive Task-Listen (Checkbox-Listen)
- `for_checklist_feature` – statische Feature-Listen mit Icon-Varianten (`check`, `cross`, `star`, konfigurierbar)

Beide produzieren semantisch sauberes, Frontend-CSS-freies Markup.

### `for_footnote` – Fußnoten

- Fußnote per Dialog hinzufügen, automatische Nummerierung `[1]`, `[2]`, …
- Referenzen im Text und Fußnoten-Block am Ende werden beim Save synchronisiert
- Klick auf eine Fußnote im Text springt im Frontend zum Eintrag, Rück-Link zurück

### `for_toc` – Inhaltsverzeichnis

- Button **Inhaltsverzeichnis einfügen** scannt alle Überschriften (h1–h6) im Editor und erzeugt einen `<nav class="for-toc">`-Block mit verschachtelter Liste.
- **Stabile Slug-IDs** auf den Überschriften (`for-toc-<slug>`, kollisionsfrei). Bestehende IDs bleiben beim Re-Edit erhalten.
- **Live-Sync** wie `for_footnote`: beim Tippen/Einfügen/Undo wird die TOC automatisch aktualisiert – neue/umbenannte/gelöschte Überschriften werden synchron gehalten.
- **Einstellungen pro TOC** (Dialog): Titel, Ab-/Bis-Ebene (h1–h6), nummeriert (`<ol>`) vs. unsortiert (`<ul>`). Werte werden als `data-for-toc-*` am Block gespeichert.
- **Context-Toolbar** bei aktivem TOC-Block: Aktualisieren, Einstellungen, Entfernen.
- Klick auf einen TOC-Link im Editor scrollt zum Ziel-Heading.
- **Hierarchische Nummerierung** bei geordneten TOCs (`<ol>`) über CSS-Counters – Ausgabe `1` / `1.1` / `1.1.1` …, Filler-Einträge für übersprungene Heading-Ebenen zählen nicht mit. **Editor-Parität:** Die gleichen Counter-Regeln werden über `editor.dom.addStyle` direkt im Editor-Iframe angewendet, der Redakteur sieht also dasselbe Bild wie im Frontend.
- **Frontend-CSS** framework-agnostisch über CSS-Variablen (`--for-toc-*`) inkl. Dark-Mode und optionaler `.for-toc--sticky`-Variante für Sidebar-TOCs. Nummerierung lässt sich pro Projekt anpassen (`--for-toc-number-separator`, `--for-toc-number-suffix`, `--for-toc-number-color`, `--for-toc-number-font-weight`, `--for-toc-number-min-width`, `--for-toc-number-gap`).
- Optionales Frontend-JS `for_toc.js` für Active-Section-Highlighting via IntersectionObserver (setzt `for-toc__link--active` und `aria-current="true"`).

### `for_a11y` – Accessibility-Checker (on-demand)

Open-Source-Alternative zu TinyMCE Premium `a11ychecker`.

- Läuft **nur auf Knopfdruck**, ändert den Inhalt nicht automatisch
- Schwebendes, **verschiebbares Befund-Panel** (kein Modal, kein Backdrop) – Editor bleibt sichtbar und voll bedienbar
- Geführter Workflow: ein Befund nach dem anderen, Navigation per **◀ / ▶**
- Pro Befund: **Ignorieren** / **Element bearbeiten** (springt und selektiert im Editor) / **Neu prüfen**
- Marker im Editor: rot = Fehler, orange = Warnung, blau-gestrichelt = Hinweis
- Public API:
  ```javascript
  tinymce.activeEditor.plugins.for_a11y.toggleaudit();
  const issues = tinymce.activeEditor.plugins.for_a11y.getReport();
  ```
- Events: `A11ycheckStart`, `A11ycheckStop`, `A11ycheckIgnore`
- Regeln (einzeln abschaltbar via `a11y_rules`): u. a. fehlendes `alt`, generische Link-Texte, leere/übersprungene Überschriften, Tabellen ohne `<th>`/`<caption>`, `<iframe>` ohne `title`, `target="_blank"` ohne Hinweis

---

### `for_markdown` – Markdown-Import per Dialog

Dialog-basierter Markdown → HTML Konverter. Redakteure öffnen bewusst den Dialog, fügen Markdown ein, das Ergebnis wird als sauberes HTML an der Cursor-Position eingesetzt. Kein Autodetect, keine Paste-Interception, keine Kollision mit dem `markdowneditor`-AddOn.

- **Engine:** [markdown-it 14](https://github.com/markdown-it/markdown-it) gebündelt – kein CDN, offline-fähig
- **CommonMark + GFM:** Tables, Autolinks (`linkify`), SmartQuotes (`typographer`), harte Zeilenumbrüche (`breaks`), fenced Code
- **Tasklisten → `for_checklist`:** `- [ ]` / `- [x]` → `<ul class="for-checklist for-checklist--feature"><li class="for-checklist__item" data-checked="…">…</li></ul>`
- **Fenced Code → `codesample`:** ```` ```php …``` ```` → `<pre class="language-php"><code>…</code></pre>` (weiter editierbar per Core-`codesample`-Plugin)
- **Toolbar/Menü:** `for_markdown_paste` – Label „Markdown einfügen…"
- **Command:** `forMarkdownOpenDialog` – aus eigenen Buttons / Shortcuts auslösbar
- **Namespace:** komplett `for_markdown*` / `for-markdown-*`

---


Ersatz für `forced_root_block: false` unter TinyMCE 6/7/8 – dort ist diese Option entfernt worden. Das Plugin lässt den `forced_root_block` (Default `div`) im Editor aktiv (damit Edits stabil bleiben) und entfernt den Wrapper erst beim Auslesen/Speichern.

- Reines Content-Processing-Plugin – kein Button, kein Menüeintrag, keine Toolbar-Einträge
- Ideal für Felder, in denen TinyMCE nur den **Inhalt** liefern soll und das äußere Tag (`h2`, `h3`, `span`, …) vom Modul vorgegeben wird
- Entfernt den Wrapper nur, wenn genau **ein** Root-Element mit reinem Inline-Inhalt vorhanden ist – bei mehreren Blöcken bleibt der Content unangetastet
- Paste-/Insert-sicher: programmatisches `setContent`, Zwischenablage-Inhalte und Auswahl-Operationen werden nicht zusätzlich umhüllt

---

### `for_chars_symbols` – Zeichen, Symbole & Emoji

Unified Picker für Sonderzeichen, native Emojis und Typografie. Als **schwebendes, draggable Panel** – kein blockierendes Modal, bleibt offen, damit mehrere Zeichen/Emojis in Folge eingefügt werden können.

- **Vier Tabs:** „★ Favoriten / ⏱ Zuletzt verwendet" (erster Tab), „Zeichen", „Emoji" (kuratiert, nach Kategorien), „Typografie" (Aktionen auf der Markierung).
- **Live-Suche** pro Tab – Name, Zeichen oder Codepoint (`U+…`).
- **Favoriten + Zuletzt verwendet** persistent im Browser (`localStorage`), max. 24 Einträge.
- **Echte Unicode-Zeichen** statt HTML-Entities (`\u00A0`, `\u00AD`, `\u202F` …) – nichts wird escaped.
- **Direkt-Einfüge-Menu-Items** für Einfügen-Menüs: `fcs_insert_nbsp`, `fcs_insert_nnbsp`, `fcs_insert_shy`, `fcs_insert_zwsp` oder gesammelt via `fcs_insert_invisibles`.
- **Invisibles-Toggle** `for_chars_symbols_invisibles`: macht alle sonst unsichtbaren Zeichen (nbsp, nnbsp, shy, zwsp, zwj, zwnj, lrm, rlm) im WYSIWYG mit einem dezenten Label-Marker (`[nbsp]`, `[shy]`, …) sichtbar. Die Marker sind `data-mce-bogus="1"` – werden niemals gespeichert.
- **Typografie-Aktionen** auf der Markierung: Anführungszeichen DE/DE-CH/EN/FR, en-/em-dash-Normalisierung, NBSP vor Einheiten (`5 kg` → `5 kg`), Soft-Hyphen-Vorschläge, Telefonnummern normalisieren (E.164/national).
- **Aktions-Favoriten:** jede Typografie-Aktion lässt sich über den Stern ☆ als Favorit markieren. Favoriten erscheinen gebündelt oben im Favoriten-Tab (separat von den Zeichen-Favoriten) und sind pro Browser persistent.
- **Autoreplace (optional):** `for_chars_symbols_autoreplace: true` aktiviert Live-Ersetzungen beim Tippen, getriggert durch Space/Enter/Satzzeichen. Eingebaute Regeln: `(c)`→©, `(r)`→®, `(tm)`→™, `(p)`→℗, `...`→…, `->`/`-->`→→, `<-`/`<--`→←, `==>`→⇒, `+/-`→±, `!=`→≠, `<=`→≤, `>=`→≥, `~=`→≈, `1/2`→½, `1/4`→¼, `3/4`→¾, `2^3`→2³ (Ziffer + `^` + 0-9 → Superscript). Eigene Regeln per `for_chars_symbols_autoreplace_rules` (siehe unten). Nicht aktiv in `<code>`, `<pre>`, `<kbd>`, `<samp>`.
- **Shortcut:** `Strg/⌘ + Shift + I` öffnet den Picker.
- **Locale:** `for_chars_symbols_locale` – `de` (Default), `de-ch`, `en`, `fr`.
- **Autoreplace-Konfiguration (im Profilassistent, `extra`-YAML):**

  ```yaml
  for_chars_symbols_autoreplace: true
  for_chars_symbols_autoreplace_defaults: true  # optional, Default: true
  for_chars_symbols_autoreplace_rules:
    # einfache Ersetzung (Array-Kurzform)
    - ["(tel)",  "+49 2843 999999"]
    - ["(mail)", "info@example.com"]
    # Objekt-Form
    - { from: "(zvk)", to: "Zahlung per Vorkasse" }
    # Regex mit Backreference ($1..$9):
    - { re: "\\(kw(\\d{1,2})\\)", to: "KW $1" }
  ```

  `for_chars_symbols_autoreplace_defaults: false` deaktiviert die eingebauten Standardregeln (nur eigene Regeln aktiv). Custom-Regeln überschreiben Defaults bei identischem `from`.
- **Commands:** `forCharsSymbolsOpen`, `forCharsSymbolsToggleInvisibles`.

---

### `for_abbr` – Abkürzungen & Fremdwörter (abbr-Element)

Semantisches `<abbr title="…">`-Markup für Abkürzungen, Fachbegriffe und Fremdwörter. Screenreader können die Langform vorlesen, Browser zeigen sie beim Hovern als Tooltip — wichtig für Barrierefreiheit (WCAG 3.1.4 *Abkürzungen*) und SEO.

- **Toolbar-Button / Menüeintrag / Context-Toolbar:** `for_abbr` (Toggle-Button mit Active-State auf bestehenden `<abbr>`).
- **Dialog:** Anzeigetext + Langform (→ `title`) + optionales `lang`-Attribut (z. B. `en` für englische Fremdwörter — Screenreader wechselt dann die Aussprache).
- **Edit-Modus:** Cursor in/auf einem `<abbr>` → beim Öffnen werden die Felder aus dem Element befüllt. Zusätzlicher *Entfernen*-Button unwrappt das Element und behält den Textinhalt.
- **Optionales Glossar** via Editor-Option `for_abbr_glossary` – eine Liste bekannter Abkürzungen. Sobald der Anzeigetext im Dialog einer Glossar-Term entspricht (case-insensitive), werden `title` und optional `lang` automatisch vorbefüllt:

  ```yaml
  for_abbr_glossary:
    - { term: HTML,  title: 'Hypertext Markup Language',    lang: en }
    - { term: CSS,   title: 'Cascading Style Sheets',       lang: en }
    - { term: WCAG,  title: 'Web Content Accessibility Guidelines', lang: en }
    - { term: DSGVO, title: 'Datenschutz-Grundverordnung' }
    - { term: z. B., title: 'zum Beispiel' }
  ```

- **Shortcut:** <kbd>Ctrl/Cmd + Alt + A</kbd>.

---

## Plugins ohne `for_`-Präfix

Diese Plugins sind fester Bestandteil des AddOns, wurden aber vor Einführung des `for_*`-Namespaces entwickelt. Sie behalten ihre ursprünglichen Namen, damit bestehende Profile nicht umgeschrieben werden müssen – funktional und in der Pflege sind sie den `for_*`-Plugins gleichgestellt.

### `link_yform` – YForm-Datensätze verlinken

Erweitert den Link-Dialog um eine Auswahl über YForm-Tabellen.

- Auswahl von **Tabelle + Datensatz + Feld** direkt im Link-Dialog
- Optionales **Link-Schema** pro Tabelle (z. B. `index.php?article_id=5&news=[id]` oder `/produkt/[id]`) mit Platzhaltern `[id]` (Datensatz-ID) und `[field]` (Feldwert). Leer = es wird nur der reine Feldwert als Link-Text eingefügt.
- Konfiguration der verfügbaren Tabellen/Felder/Schemata im Profil-Assistenten (Abschnitt *YForm Link-Konfiguration*)
- Voraussetzung: YForm-AddOn installiert und aktiv

### `phonelink` – Telefonnummern als `tel:`-Links

Dialog zum Einfügen einer Telefonnummer als anklickbarer `tel:`-Link.

- **Toolbar-Button / Menüeintrag:** `phonelink`
- Normalisiert die Nummer auf RFC-3966-gültige Zeichen (`+`, Ziffern, `-.()`)
- Anzeigetext bleibt wie vom Redakteur eingegeben
- Ergänzt sich mit der *Typografie-Aktion* „Telefonnummer normalisieren" in `for_chars_symbols` (E.164/national als Text-Transform)

### `quote` – Formatierte Zitate

Fügt einen `<blockquote>`-Block mit optionalem `<footer>`/`<cite>` ein.

- **Toolbar-Button / Menüeintrag:** `quote`
- Dialog-Felder für Zitat-Text, Autor und Quelle
- Sauberes, semantisches HTML5-Markup – keine Inline-Styles, keine Framework-Abhängigkeit

### `cleanpaste` – Paste-Bereinigung

Hook in den `PastePreProcess`-Handler. Entfernt Word-/Office-Rauschen und normalisiert Klassen/Attribute beim Einfügen.

- Kein sichtbarer Button – wirkt automatisch, sobald das Plugin im Profil aktiv ist
- **Konfigurierbare Whitelist** `paste_preserve_classes` für projekteigene Klassen-Präfixe
- **Interne Schutzliste** (nicht überschreibbar) für `for_*`-Plugin-Markup: Klassen mit Präfix `for-*` sowie `media` bleiben immer erhalten, Attribute mit Präfix `data-for-*` sowie `data-mce-selected` werden nie entfernt – verhindert Kollisionen mit `for_oembed`, `for_video`, `for_images`, `for_checklist`, `for_toc` und `for_footnotes`
- **Textausrichtung immer erhalten**: `text-align` und `direction` werden nie entfernt, auch wenn `remove_styles: true` konfiguriert ist – TinyMCE speichert Textausrichtung als Inline-Style, ein Entfernen würde linksbündig, zentriert, rechtsbündig und Blocksatz wirkungslos machen
- Ersetzt bei den meisten Anwendungen das kommerzielle `powerpaste`

### `mediapaste` – Medien beim Paste automatisch hochladen

Erkennt beim Einfügen eingebettete Bilder (z. B. aus der Zwischenablage, Word, Mails) und lädt sie in den REDAXO-Mediapool.

- Greift in `paste_data_images` / `images_upload_handler`
- Kategorie-Auswahl (Mediapool-Kategorie) über den Profil-Assistenten oder per Option `category_id`
- Fortschritts-/Fehler-Anzeige als TinyMCE-Alertbanner
- Unterstützte Formate orientieren sich an `images_file_types` (Default: `jpg,jpeg,png,gif,webp,svg,avif`)

### `snippets` – Snippet-Verwaltung im Editor

Bindet die REDAXO-*Snippet-Verwaltung* an TinyMCE an. Redakteure können wiederverwendbare HTML-Bausteine direkt aus dem Editor auswählen und einfügen.

- **Menüeintrag:** `snippets` (Default im „Einfügen"-Menü)
- Snippets werden zentral im Backend gepflegt – Änderungen wirken auf alle Editor-Instanzen
- Nur-Lese-Ausgabe: das Plugin selbst ändert keine Snippet-Inhalte, es fügt sie ein

---

## Verwendung im Profil

Alle FOR-Plugins werden im Profil wie normale TinyMCE-Plugins aktiviert:

```javascript
plugins: 'lists link for_images for_oembed for_video for_footnote for_a11y',
toolbar: 'bold italic | for_images for_oembed for_video | for_footnote for_a11y',
menu: {
    insert: {
        title: 'Einfügen',
        items: 'for_images for_oembed for_video for_htmlembed | for_checklist for_footnote | charmap hr'
    }
}
```

| `markdowneditor` (als Toggle im Editor) | `for_markdown` (Dialog-Import) |
Der **Profil-Assistent** übernimmt das für dich: Plugins per Klick hinzufügen, Toolbar und Einfügen-Menü per Drag & Drop sortieren.

Für **Frontend-CSS-Einbindung** (`for_images.css`, `for_footnotes.css`, `for_checklist.css`) und die zugehörigen **CSS-Variablen** siehe die Hilfe-Seite (README).

---

## Empfehlung: Core-Plugins ersetzen

Wenn du die FOR-Varianten nutzt, kannst du folgende Core-Plugins aus dem Profil **entfernen** (bessere Vorschau, konsistente Klassen, saubereres Save-Format):

| Core | Ersatz durch |
|---|---|
| `image` | `for_images` |
| `media` | `for_oembed` + `for_video` |

---

## Quellen & Entwicklung

Die Plugin-Quelldateien liegen unter `custom_plugins/<plugin>/src/main/ts/Plugin.ts`. Build pro Plugin:

```bash
cd custom_plugins/for_a11y
pnpm build
```

Alle Plugins zusammen:

```bash
pnpm run plugins:build
```

Die Plugin-Bundles werden automatisch nach `assets/scripts/tinymce/plugins/` und `assets/vendor/tinymce/plugins/` kopiert.
