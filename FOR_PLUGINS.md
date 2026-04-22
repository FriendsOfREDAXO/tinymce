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
| `for_checklist_feature` | Feature-Listen mit Icons (Haken, Kreuze, Sterne) | `for_checklist_feature` |
| `for_footnote` | Fußnoten im Text mit automatischer Nummerierung & Rück-Verweisen | `for_footnote_insert`, `for_footnote_update` |
| `for_toc` | **Inhaltsverzeichnis** aus den Überschriften – Live-Sync beim Bearbeiten | `for_toc_insert`, `for_toc_update` |
| `for_a11y` | **Accessibility-Checker** on demand – prüft den Inhalt gegen WCAG-nahe Regeln | `for_a11y` |

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
- **Frontend-CSS** framework-agnostisch über CSS-Variablen (`--for-toc-*`) inkl. Dark-Mode und optionaler `.for-toc--sticky`-Variante für Sidebar-TOCs.
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
