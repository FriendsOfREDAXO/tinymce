# TinyMCE 8 für REDAXO

Bringt den [TinyMCE 8](https://www.tiny.cloud/) als WYSIWYG-Editor in REDAXO – mit einer offen lizenzierten Plugin-Familie, die viele Funktionen abdeckt, für die sonst kommerzielle TinyMCE-Premium-Pakete oder das CKEditor-5-Ökosystem nötig wären.

![Screenshot](https://github.com/FriendsOfREDAXO/tinymce/blob/assets/screenshot8.png?raw=true)

## Worum es geht

Das AddOn ist mehr als nur ein Editor-Wrapper. Es bündelt einen Editor, eine Profil-Verwaltung mit grafischem Assistenten, einen Snippet- und Style-Set-Manager sowie eine wachsende Bibliothek eigener **FOR-Plugins** – speziell für REDAXO optimiert und für die Anforderungen moderner Content-Editoren gebaut.

**Vergleichbar mit CKEditor 5, aber MIT/GPL lizenziert:**

| Funktion (CKE5-Welt) | Im AddOn umgesetzt durch |
| --- | --- |
| Bildbearbeitung mit `<figure>`-Workflow | `for_images` (+ Core `image`) |
| oEmbed (YouTube/Vimeo, CKE5-Save-Format `<figure class="media"><oembed>`) | `for_oembed` |
| Inhaltsverzeichnis (Live-Sync) | `for_toc` |
| Fußnoten | `for_footnote` |
| Task-/Todo-Listen mit CKE5-Import | `for_checklist` |
| Accessibility-Checker (on demand) | `for_a11y` |
| Markdown-Import | `for_markdown` |
| Sonderzeichen + Emoji + Typografie | `for_chars_symbols` |
| Source / HTML-Embed | `for_htmlembed` |
| PowerPaste (Office-Cleanup) | `cleanpaste` |
| Auto-Upload eingefügter Bilder | `mediapaste` |
| Abkürzungen `<abbr>` | `for_abbr` |

Dazu kommen REDAXO-spezifische Helfer wie das Linken auf YForm-Datensätze (`link_yform`), wiederverwendbare HTML-Snippets, die Anbindung an den Medienpool und den Media Manager.

> Detailbeschreibungen aller mitgelieferten Plugins: siehe **[FOR_PLUGINS.md](FOR_PLUGINS.md)**.

## Feature-Übersicht

### Editor- und Profilverwaltung

- TinyMCE 8 (GPL) inkl. allen Core-Plugins
- Profilverwaltung mit grafischem **Profil-Assistenten** (Plugins, Toolbars, Menüs, Farben, Layout Rules)
- **Protected Extras** für nicht UI-verwaltete Optionen – bleiben beim Generieren erhalten
- Profil-Export/-Import als JSON (für Verteilung über eigene AddOns)
- Demo-Profil als Startpunkt – nicht löschbar, aber duplizierbar
- **Profil-Fixer**: prüft Profile auf Kompatibilität (License-Key, veraltete Plugins …)

### Content-Werkzeuge

- **Medien:** `for_images`, `for_oembed`, `for_video`, `mediapaste`
- **Struktur:** `for_toc`, `for_footnote`
- **Listen & Embed:** `for_checklist`, `for_htmlembed`, `for_markdown`
- **Sprache & Typografie:** `for_chars_symbols`, `for_abbr`, `quote`, `phonelink`
- **REDAXO-Integration:** `snippets`, `link_yform`
- **Paste-Pipeline:** `cleanpaste`, `mediapaste`

### Accessibility & Qualität

- `for_a11y` – Accessibility-Checker mit schwebendem, navigierbarem Befund-Panel und **Quickfix-Buttons** (Fake-Listen umwandeln, leere Absätze entfernen, generische Linktexte ersetzen, …)
- **Layout Rules** – nicht-invasive Struktur-Korrektur (Bilder aus Überschriften, mehrfach leere Absätze, Minus-Linien → `<hr>`) mit Design-System-Integration
- Bidirektionale Heading-Slugs und Live-Sync bei `for_toc`

### REDAXO-Plattform

- Mediapool-Anbindung (Picker, Upload, Show/Swap)
- **Media Manager Integration** (Bilder werden automatisch über den Type `tiny` skaliert)
- Style-Set-Verwaltung mit UIkit-/Bootstrap-Demos
- Snippet-Verwaltung über Backend-UI
- Sprachen: aktuell DE / EN (Plugin-spezifisch variierend)

## Anwendung

### In Modulen / YForm / MForm

**Moduleingabe:**

```php
<textarea class="tiny-editor form-control" data-profile="full" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>
```

**Modulausgabe:**

```php
REX_VALUE[id=1 output=html]
```

**YForm – individuelle Attribute:**

```json
{"class":"tiny-editor","data-profile":"full"}
```

**MForm:**

```php
$mform = new MForm();
$mform->addTextAreaField(1, [
    'label'        => 'Text',
    'class'        => 'tiny-editor',
    'data-profile' => 'full',
]);
echo $mform->show();
```

### Data-Attribute am Textarea

| Attribut | Zweck |
| --- | --- |
| `data-profile` | Name des Profils (z. B. `full`, `default`, `demo`) |
| `data-lang` | Editor-Sprache (z. B. `de`) |

## Konfiguration

### Profil-Assistent

Der Profil-Assistent in der Profilverwaltung deckt fast alle gebräuchlichen TinyMCE-Optionen mit UI-Eingaben ab:

| Bereich | Bedienung |
| --- | --- |
| Plugins | Picker mit Core-/FOR-/AddOn-Badges |
| Toolbar | Eine oder mehrere Zeilen, sortierbare Pills, Separator-Aware |
| Toolbar-Modus | `sliding` / `floating` / `wrap` / `scrolling` – inkl. *Toolbar deaktivieren* |
| Menü | Einfüge-Menü gruppiert pflegbar |
| Farben | Visueller Mapping-Editor (Hex + Label), `color_map_raw`, `color_cols`, `custom_colors` |
| Layout Rules | Checkboxen für die vier Regeln + zwei CSS-Klassen-Felder |
| FOR-Spezifika | z. B. Image-Width-Presets, Autoreplace-Regeln, YForm-Tabellen |
| **Protected Extras** | Beliebige TinyMCE-Optionen als Freitext – bleiben beim Generieren erhalten |

### Pflichtoption: License Key

TinyMCE 8 verlangt ab Werk einen Lizenzschlüssel. Für Open-Source-Nutzung:

```javascript
license_key: 'gpl',
```

Steht in allen Standardprofilen drin. Für eigene Profile muss der Eintrag manuell ergänzt werden.

### Dark-Mode-fähige Profile

```javascript
skin: redaxo.theme.current === 'dark' ? 'oxide-dark' : 'oxide',
content_css: redaxo.theme.current === 'dark' ? 'dark' : 'default',
```

### Media Manager Integration

Rastergrafiken werden automatisch über den Media-Manager-Type `tiny` ausgeliefert:

```
/media/tiny/dateiname.jpg
```

| Format | Verarbeitung |
| --- | --- |
| JPG, JPEG, PNG, GIF, WebP | über Media Manager (`tiny`-Type) |
| SVG, TIFF, BMP, Video, Audio | Direktpfad |

Den Type `tiny` einmal im REDAXO-Backend unter **Media Manager** mit gewünschten Effekten (z. B. Resize auf 1200 px) anlegen. Fehlt der Type, liefert REDAXO transparent das Original aus.

### Style-Sets (CSS-Framework-Styles)

Unter **TinyMCE → Style-Sets** lassen sich UIkit-/Bootstrap-Stile (und beliebige eigene) zentral pflegen. Pro Style-Set:

| Feld | Zweck |
| --- | --- |
| Name | Eindeutiger Bezeichner |
| Content CSS | URL zum Framework-CSS (oder leer) |
| Style Formats | JSON-Array mit TinyMCE-`style_formats`-Definitionen |
| Profile | Komma-Liste an Profilnamen – leer = global |

Demo-Sets für UIkit 3 und Bootstrap 5 lassen sich auf Knopfdruck installieren. JSON-Export/-Import wird unterstützt.

### Snippets

**TinyMCE → Snippets** verwaltet wiederverwendbare HTML-Bausteine. Das Plugin `snippets` macht sie im Editor (Standard im *Einfügen*-Menü) verfügbar.

### Paste-Pipeline (`cleanpaste`)

Zentrale Konfiguration unter **TinyMCE → Paste-Einstellungen**. Erlaubt:

- Tag-/Klassen-/Style-/ID-/`data-*`-Whitelists (auch Regex, z. B. `^uk-.*`)
- Cleanup-Stufen: BR-Reduktion, Leer-Paragraph-Entfernung, Office-/Word-Strip, DOM-Cleanup
- Schutz interner FOR-Markup-Konventionen (immer behalten: `for-*`-Klassen, `data-for-*`-Attribute, `media`-Klasse)

### Layout Rules (Strukturoptimierung)

Vier nicht-invasive Korrekturen, pro Profil aktivierbar:

| Option | Wirkung |
| --- | --- |
| `for_layout_rules_no_images_in_headings` | Bilder aus `h1`–`h6` davor platzieren |
| `for_layout_rules_collapse_empty_paragraphs` | ≥ 2 leere `<p>` → `<div>` mit Clear-Klasse |
| `for_layout_rules_convert_lines_to_hr` | `----` in `<p>` → `<hr>` mit Klasse |
| (implizit) | Leere `<p>` am Anfang/Ende entfernen |

Default-Klassen: `uk-margin` (Clear) und `uk-divider-icon` (HR) – pro Profil überschreibbar.

## Weiterführende Dokumentation

| Thema | Datei |
| --- | --- |
| Detail-Beschreibung aller mitgelieferten Plugins (FOR & Klassiker) | [FOR_PLUGINS.md](FOR_PLUGINS.md) |
| Entwickler-Doku: Architektur, Build, Extension Points, `PluginRegistry`, `ProfileHelper` | [DEVS.md](DEVS.md) |
| Backend-Hilfe | Reiter **„Entwickler"** in der AddOn-Verwaltung |
| TinyMCE 8 Referenz | [tiny.cloud/docs/tinymce/latest](https://www.tiny.cloud/docs/tinymce/latest/) |

## Troubleshooting (Kurz)

| Symptom | Lösung |
| --- | --- |
| Profil-Änderungen werden im Editor nicht sichtbar | Browser-Cache leeren (Strg/⌘ + Shift + R) – `profiles.js` ist statisch. |
| TinyMCE-Lizenzwarnung | `license_key: 'gpl',` ergänzen, *Profil-Fixer* im Backend ausführen. |
| Quickbar / Plugins werden auf Defaults zurückgesetzt | AddOn auf ≥ `v8.9.0` aktualisieren (Updatepfad: `v8.8.1` → `v8.9.0`), Profil neu speichern. |
| SVG-Upload (`mediapaste`) schlägt fehl | REDAXO-Mediapool: **Erlaubte Dateitypen** prüfen. SVG ist aus Sicherheitsgründen oft nicht freigegeben. |
| Bild-Skalierung greift nicht | Media-Manager-Type `tiny` im Backend anlegen. |

## Mitwirken

Issues, Pull Requests und Plugin-Ideen sind willkommen. Beim Beisteuern bitte die Hinweise in [DEVS.md](DEVS.md) beachten (Stilregeln, Build-Layout, Tests).

### PR-Kommando fuer PHP-CS-Fixer

Bei Pull Requests kann per Kommentar ein Auto-Fix gestartet werden:

```text
/fix-cs
```

Was passiert dann:

- GitHub Action fuehrt php-cs-fixer im Write-Mode auf dem PR-Branch aus.
- Falls Aenderungen entstehen, werden sie automatisch committed und auf denselben Branch gepusht.
- Anschliessend schreibt die Action einen Ergebnis-Kommentar in den PR.

Hinweise:

- Das Kommando ist auf Kommentare von `OWNER`, `MEMBER` und `COLLABORATOR` beschraenkt.
- Fork-PRs werden aus Sicherheitsgruenden nicht automatisch gepusht.

## Lizenzen

| Komponente | Lizenz |
| --- | --- |
| Dieses AddOn (Core + Custom-Plugins `custom_plugins/*`) | [MIT](LICENSE.md) |
| TinyMCE (ab v8) | [GPL v2+](assets/vendor/tinymce/license.md), Drittanbieter-Hinweise in [`notices.txt`](assets/vendor/tinymce/notices.txt) |
| markdown-it (`for_markdown`) | MIT (gebündelt) |

Für kommerzielle, nicht-GPL-kompatible Nutzung bietet Tiny eigene Lizenzen an – siehe [tiny.cloud](https://www.tiny.cloud/). Standardmäßig wird hier `license_key: 'gpl'` gesetzt.

## Credits

**Friends Of REDAXO**

- Website: <https://www.redaxo.org>
- GitHub: <https://github.com/FriendsOfREDAXO>
- AddOn-Repo: <https://github.com/FriendsOfREDAXO/tinymce>

Mit Dank an alle Beitragenden, an die Tiny-Community für TinyMCE selbst und an die zahlreichen Open-Source-Projekte, auf denen die FOR-Plugins aufbauen (u. a. [markdown-it](https://github.com/markdown-it/markdown-it)).
