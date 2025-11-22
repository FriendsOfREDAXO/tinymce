# Custom TinyMCE Plugins

Dieses Verzeichnis enthält benutzerdefinierte TinyMCE-Plugins für das REDAXO TinyMCE-Addon.

## Verfügbare Plugins

### link_yform
Ermöglicht das Verlinken von YForm-Datensätzen direkt aus dem Editor.

### phonelink
Fügt die Möglichkeit hinzu, Telefonnummern als anklickbare Links (`tel:`) einzufügen.

### quote
Ermöglicht das Einfügen von formatierten Zitaten.

## Entwicklung

### Build-System

Die Plugins verwenden **esbuild** für einen schnellen und modernen Build-Prozess.

```bash
# Einzelnes Plugin bauen
cd custom_plugins/link_yform
pnpm run build

# Alle Plugins bauen (vom Root)
pnpm run plugins:build

# Kompletter Build (Vendor + Plugins)
pnpm run build
```

### Projekt-Struktur

```
custom_plugins/
├── plugin_name/
│   ├── src/
│   │   └── main/ts/
│   │       └── Plugin.ts       # Haupt-Einstiegspunkt
│   ├── langs/                  # Übersetzungen (optional)
│   ├── dist/                   # Build-Output (generiert)
│   ├── build.js                # Build-Script
│   ├── package.json
│   └── tsconfig.json
```

### Neues Plugin erstellen

1. Kopiere ein existierendes Plugin-Verzeichnis als Vorlage
2. Passe `package.json` an (Name, Description)
3. Passe `build.js` an (pluginName Variable)
4. Implementiere dein Plugin in `src/main/ts/Plugin.ts`
5. Baue das Plugin: `pnpm run build`

### Build-Script

Jedes Plugin hat ein eigenes `build.js` Script mit folgenden Features:

- **esbuild** für schnelles Bundling
- **TypeScript** Support
- **Minifizierung** (plugin.js und plugin.min.js)
- **Lizenz-Header** (optional, falls `src/text/license-header.js` existiert)
- **Version-File** (automatisch generiert)
- **External Dependencies** (tinymce, @ephox/* werden nicht gebundelt)

### Dependencies

Die Plugins teilen sich Dependencies über pnpm Workspaces:

```json
{
  "workspaces": [
    "custom_plugins/*"
  ]
}
```

**Haupt-Dependencies:**
- `esbuild` - Build-Tool
- `typescript` - TypeScript Compiler
- `eslint` - Code-Linting
- `tinymce` - TinyMCE Core (für Typen)

**Alte Dependencies (entfernt):**
- ~~grunt~~ - Durch esbuild ersetzt
- ~~webpack~~ - Nicht mehr benötigt
- ~~rollup~~ - Durch esbuild ersetzt

## Build-Output

Nach dem Build werden die Plugins automatisch kopiert nach:

1. `assets/scripts/tinymce/plugins/` - Für direktes Laden
2. `assets/vendor/tinymce/plugins/` - Für TinyMCE Plugin-Pfad

## Automatische Integration

Das Build-System (`scripts/build-plugins.js`) erkennt automatisch alle Plugins im `custom_plugins/` Verzeichnis und:

1. Führt `pnpm run build` aus (falls package.json vorhanden)
2. Kopiert die Build-Artefakte
3. Aktualisiert die Assets

## Testen

```bash
# Linting
pnpm run lint

# Build testen
pnpm run build

# Plugin im REDAXO testen
# 1. pnpm run build ausführen
# 2. REDAXO-Instanz im Browser öffnen
# 3. Plugin im TinyMCE-Profil aktivieren
```

## Hinweise

- Plugins verwenden **IIFE** Format (Immediately Invoked Function Expression)
- **TinyMCE** und **@ephox/\*** Pakete werden als external markiert
- Build-Zeit ist deutlich schneller als mit Grunt (< 1 Sekunde pro Plugin)
- Keine komplexen Webpack/Grunt Konfigurationen mehr nötig
