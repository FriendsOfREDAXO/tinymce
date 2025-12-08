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
