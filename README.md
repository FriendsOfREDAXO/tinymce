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

## Entwickler: Aufbau / Aktualisieren der Assets

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

Entfernte / nicht mehr benötigte Dateien:
- Visual Profile Builder (wurde auf Wunsch entfernt) — UI/Assets/Tests sind nicht mehr im Addon enthalten.
- Alte Tests/Prototypen für den Builder wurden gelöscht.

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
