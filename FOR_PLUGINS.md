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
| `for_rootstrip` | Entfernt beim Speichern/Auslesen den TinyMCE-Root-Wrapper (`forced_root_block`, Fallback `div`). Für Felder gedacht, in denen das äußere Tag vom Modul vorgegeben wird. **Opt-in:** muss explizit in der Profil-`plugins`-Liste stehen. | — |
| `for_chars_symbols` | **Zeichen, Symbole & Emoji** – Picker mit Kategorien, Suche, Live-Typografie-Helfer (DE-/CH-/EN-/FR-Quotes, en-/em-dash, nbsp vor Einheiten, shy-Trennvorschlag), Favoriten + Zuletzt verwendet pro Browser | `for_chars_symbols` |

Zusätzlich enthält das AddOn diese Kern-Helfer (ohne `for_`-Präfix, da älter):

- `link_yform` – Verlinken von YForm-Datensätzen direkt aus dem Editor
- `phonelink` – Telefonnummern als `tel:`-Links einfügen
- `quote` – Formatierte Zitate einfügen
- `cleanpaste` / `mediapaste` – intelligente Paste-Bereinigung und Medien-Erkennung
- `snippets` – Wiederverwendbare HTML-Bausteine aus der Snippet-Verwaltung einfügen

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

### `for_rootstrip` – Root-Wrapper beim Speichern entfernen

Ersatz für `forced_root_block: false` unter TinyMCE 6/7/8 – dort ist diese Option entfernt worden. Das Plugin lässt den `forced_root_block` (Default `div`) im Editor aktiv (damit Edits stabil bleiben) und entfernt den Wrapper erst beim Auslesen/Speichern.

- Reines Content-Processing-Plugin – kein Button, kein Menüeintrag, keine Toolbar-Einträge
- Ideal für Felder, in denen TinyMCE nur den **Inhalt** liefern soll und das äußere Tag (`h2`, `h3`, `span`, …) vom Modul vorgegeben wird
- Entfernt den Wrapper nur, wenn genau **ein** Root-Element mit reinem Inline-Inhalt vorhanden ist – bei mehreren Blöcken bleibt der Content unangetastet
- Paste-/Insert-sicher: programmatisches `setContent`, Zwischenablage-Inhalte und Auswahl-Operationen werden nicht zusätzlich umhüllt
- **Aktivierung ausschließlich über die Profil-`plugins`-Liste.** Ohne Eintrag registriert das Plugin keinerlei Handler. Es gibt keine zusätzliche `for_rootstrip: true/false`-Option, die global etwas einschaltet – das Listen-Mitglied ist die einzige Wahrheitsquelle. Die mitgelieferten Demo-Profile nehmen das Plugin bewusst **nicht** auf, da es das Save-Verhalten verändert.

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
- **Shortcut:** `Strg/⌘ + Shift + I` öffnet den Picker.
- **Locale:** `for_chars_symbols_locale` – `de` (Default), `de-ch`, `en`, `fr`.
- **Commands:** `forCharsSymbolsOpen`, `forCharsSymbolsToggleInvisibles`.

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
