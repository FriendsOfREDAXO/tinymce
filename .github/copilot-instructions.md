# GitHub Copilot Instructions für TinyMCE REDAXO Addon

## Projekt-Übersicht

Dieses Addon integriert den **TinyMCE 8** WYSIWYG-Editor in das REDAXO CMS. Es bietet:
- Profil-basierte Editor-Konfigurationen
- Media Manager Integration für optimierte Bildauslieferung
- Custom TinyMCE Plugins (link_yform, phonelink, quote)
- Automatische Vendor-Updates via GitHub Actions

## Technologie-Stack

### Backend (PHP)
- **REDAXO 5.x** - CMS Framework
- **rex_sql** - Datenbankabstraktion (verwende NIEMALS rohe SQL-Queries)
- **rex_i18n** - Übersetzungssystem
- **rex_view** - UI-Komponenten

### Frontend
- **TinyMCE 8.2.2** - WYSIWYG Editor
- **jQuery** - DOM-Manipulation (Legacy, wo möglich vermeiden)
- **Vanilla JavaScript** - Für neue Features bevorzugen

### Build-System
- **pnpm 10** - Package Manager (NIEMALS yarn oder npm verwenden!)
- **esbuild** - Bundler für Custom Plugins (KEIN Webpack, Rollup oder Grunt!)
- **TypeScript 4.x** - Für Custom Plugins

## Projekt-Struktur

```
tinymce/
├── .github/
│   └── workflows/
│       └── update-tinymce-vendor.yml  # Automatische TinyMCE Updates
├── assets/
│   ├── scripts/
│   │   ├── base.js                    # TinyMCE Initialisierung
│   │   ├── linkmap.js                 # REDAXO Linkmap Integration
│   │   ├── profile.js                 # Profil-Editor
│   │   └── tinymce/plugins/           # Custom Plugins (gebaut)
│   ├── styles/
│   └── vendor/tinymce/                # TinyMCE Core (kopiert via Script)
├── custom_plugins/                     # Custom Plugin Quellen
│   ├── link_yform/
│   ├── phonelink/
│   └── quote/
├── lib/TinyMce/
│   ├── Creator/Profiles.php           # Profil-Generator
│   ├── Handler/                       # Datenbank-Handler
│   ├── Provider/Assets.php            # Asset-Provider
│   └── Utils/                         # Utilities
├── pages/                             # Backend-Seiten
├── scripts/                           # Build-Scripts (Node.js)
├── install.php                        # Installation
├── update.php                         # Updates (Transaction-basiert!)
└── boot.php                          # Addon-Initialisierung
```

## Entwicklungs-Richtlinien

### PHP Code-Standards

1. **Datenbankzugriff - KRITISCH!**
   ```php
   // ✅ RICHTIG - rex_sql verwenden
   $sql = rex_sql::factory();
   $sql->setTable(rex::getTable('tinymce_profiles'));
   $sql->setValue('name', $name);
   $sql->insert();
   
   // ❌ FALSCH - Niemals rohe SQL-Queries!
   $sql->setQuery("INSERT INTO ...");
   ```

2. **Transaktionen für Updates**
   ```php
   // update.php MUSS Transaktionen verwenden
   $sql = rex_sql::factory();
   $sql->setQuery('START TRANSACTION');
   try {
       // Update-Logik
       $sql->setQuery('COMMIT');
   } catch (Exception $e) {
       $sql->setQuery('ROLLBACK');
       throw $e;
   }
   ```

3. **SQL-Escaping**
   ```php
   // Strings mit einfachen Anführungszeichen müssen escaped werden
   $sql->setValue('config', "{'key': ''value''}")  // Doppelte Quotes!
   ```

4. **Übersetzungen**
   ```php
   // Verwende immer rex_i18n
   echo rex_i18n::msg('tinymce_profile_name');
   
   // Nicht: Direkte Strings
   ```

5. **Extension Points**
   ```php
   // Nutze REDAXOs Extension System
   rex_extension::register('PACKAGES_INCLUDED', function() {
       // Code
   });
   ```

### JavaScript/TypeScript Standards

1. **TinyMCE API**
   ```javascript
   // Verwende moderne TinyMCE 8 API
   tinymce.init({
       selector: 'textarea.tinymce',
       plugins: 'link image media',
       // ...
   });
   
   // Nicht: Veraltete TinyMCE 5/6 Syntax
   ```

2. **Media Manager Integration**
   ```javascript
   // Prüfe Dateitypen vor Media Manager Nutzung
   const useMediaManager = ['jpg', 'jpeg', 'png', 'gif', 'webp']
       .indexOf(extension.toLowerCase()) !== -1;
   ```

3. **Custom Plugins**
   ```typescript
   // Plugins MÜSSEN als IIFE gebaut werden
   // build.js verwendet esbuild mit format: 'iife'
   
   // External dependencies markieren
   external: ['tinymce', '@ephox/*']
   ```

### Build-System

1. **pnpm verwenden**
   ```bash
   # ✅ Richtig
   pnpm install
   pnpm run build
   
   # ❌ Falsch
   npm install  # NIEMALS!
   yarn install # NIEMALS!
   ```

2. **Build-Befehle**
   ```bash
   pnpm run build              # Kompletter Build
   pnpm run plugins:build      # Nur Custom Plugins
   pnpm run vendor:copy        # Nur Vendor-Dateien
   ```

3. **Custom Plugin bauen**
   ```bash
   cd custom_plugins/plugin_name
   pnpm run build
   ```

4. **NIEMALS committen**
   - `node_modules/`
   - `dist/` (in custom_plugins)
   - `build/` (temporär)
   - `pnpm-lock.yaml` (nur im Root committen)

## Testing-Richtlinien

### Was MUSS getestet werden (vor PR/Release)

#### 1. Installation & Update
```bash
# Frische Installation testen
- REDAXO Instanz ohne TinyMCE Addon
- Addon installieren
- Prüfen: Alle Profile angelegt?
- Prüfen: Tabellen erstellt?

# Update testen  
- Alte Version installiert lassen
- Neue Version updaten
- Prüfen: Migrations-Seite erscheint?
- Prüfen: Update ohne Fehler?
```

#### 2. Profile
- [ ] Neues Profil erstellen
- [ ] Profil bearbeiten (Name, Beschreibung, Config)
- [ ] Profil duplizieren
- [ ] Profil exportieren (YAML Download)
- [ ] Profil importieren (mit/ohne Überschreiben)
- [ ] Profil-Preview funktioniert
- [ ] Profil löschen

#### 3. TinyMCE Editor
- [ ] Editor lädt in REDAXO Backend (Artikel bearbeiten)
- [ ] Toolbar-Buttons funktionieren
- [ ] Bild einfügen via Media Manager
- [ ] Link einfügen via Linkmap
- [ ] Formatierungen (Bold, Italic, Listen, etc.)
- [ ] Source-Code Ansicht
- [ ] Speichern & Anzeigen im Frontend

#### 4. Media Manager Integration
```javascript
// Testen mit verschiedenen Dateitypen
- JPG/PNG/GIF/WebP → /media/tiny/ (Media Manager)
- SVG/TIFF/BMP → /media/ (Direkt)
- Video/Audio → /media/ (Direkt)
```

#### 5. Custom Plugins
- [ ] link_yform: YForm-Datensatz verlinken
- [ ] phonelink: Telefonnummer einfügen
- [ ] quote: Zitat einfügen
- [ ] Plugins erscheinen in Toolbar
- [ ] Plugins funktional

#### 6. Build-System
```bash
# Build testen
pnpm install
pnpm run build

# Prüfen
- Keine Fehler?
- assets/vendor/tinymce/ gefüllt?
- assets/scripts/tinymce/plugins/ gefüllt?
- Custom Plugins gebaut?
```

#### 7. GitHub Action (optional)
- [ ] Manuell triggern: Actions → Update TinyMCE Vendor
- [ ] Prüfen: Erkennt neue Version?
- [ ] Prüfen: PR wird erstellt?
- [ ] PR-Body korrekt formatiert?

### Was User testen sollen (Beta/Release)

**Essentiell:**
1. Installation auf frischer REDAXO-Instanz
2. Update von alter Version
3. Editor in Artikel verwenden (alle Grundfunktionen)
4. Bilder einfügen (Media Manager)
5. Links einfügen (Linkmap)

**Optional:**
6. Custom Plugins nutzen (falls verwendet)
7. Profil-Import/Export
8. Verschiedene Browser (Chrome, Firefox, Safari)
9. Mobile Ansicht (Tablet/Smartphone)

### Manuelle Test-Checkliste

```markdown
## Pre-Release Testing

- [ ] PHP 7.4, 8.0, 8.1, 8.2 kompatibel?
- [ ] REDAXO 5.13+ kompatibel?
- [ ] Keine PHP-Warnungen/Notices?
- [ ] Keine JavaScript-Fehler in Console?
- [ ] Deutsche & Englische Übersetzungen vollständig?
- [ ] CHANGELOG.md aktualisiert?
- [ ] package.yml Version erhöht?
- [ ] Migrations funktionieren?
```

## Beachtungs-Punkte

### KRITISCH - Datenbank

1. **SQL-Injection Prevention**
   - NIEMALS User-Input direkt in Queries
   - IMMER rex_sql setValue() verwenden
   - Bei Bedarf: prepared Statements

2. **Transaktionen**
   - Alle update.php Änderungen MÜSSEN in Transaktionen
   - Bei Fehler: ROLLBACK
   - Erfolg: COMMIT

3. **Escaping**
   - Einfache Quotes in SQL-Strings verdoppeln: `''`
   - YAML-Config: Besondere Vorsicht bei Quotes

### WICHTIG - Performance

1. **Asset Loading**
   - TinyMCE nur laden wenn benötigt
   - Lazy Loading wo möglich
   - Keine unnötigen Plugins

2. **Media Manager**
   - Nur für Bildtypen verwenden
   - Direkte URLs für Videos/SVG

3. **Build Size**
   - Custom Plugins minifiziert
   - Externe Dependencies nicht bündeln

### WICHTIG - Sicherheit

1. **XSS Prevention**
   - HTML-Output escapen: `rex_escape()`
   - TinyMCE sanitized Output

2. **CSRF Protection**
   - rex_csrf_token verwenden
   - POST-Requests validieren

3. **File Uploads**
   - Media Manager nutzen
   - Keine direkten File-Uploads im Editor

## Automatisierung

### GitHub Actions

**Update TinyMCE Vendor** (`.github/workflows/update-tinymce-vendor.yml`)
- Läuft: Jeden Montag 2:00 UTC
- Prüft: npm Registry für neue tinymce Version
- Erstellt: PR mit Update und CHANGELOG
- Manual Trigger: Über Actions Tab möglich

**Keine Dependabot**
- Dependabot ist deaktiviert
- Updates werden über eigene Action verwaltet
- Reason: TinyMCE & i18n brauchen Build-Prozess

## Entwicklungs-Workflow

### Neues Feature
```bash
1. Branch erstellen: feature/name
2. Code schreiben (Standards beachten!)
3. Tests durchführen (siehe oben)
4. Build testen: pnpm run build
5. Commit mit aussagekräftiger Message
6. PR erstellen mit Beschreibung
7. Tests dokumentieren im PR
```

### Bug Fix
```bash
1. Branch: bugfix/issue-number
2. Bug reproduzieren
3. Fix implementieren
4. Regression Tests
5. PR mit "Fixes #123"
```

### Release
```bash
1. Version in package.yml erhöhen
2. CHANGELOG.md aktualisieren
3. Tag erstellen: v8.0.0
4. Release Notes schreiben
5. Alle Tests durchführen!
```

## Häufige Fehler vermeiden

❌ **yarn/npm statt pnpm verwenden**
❌ **Grunt/Webpack/Rollup erwähnen** (sind entfernt!)
❌ **Rohe SQL-Queries schreiben**
❌ **Transaktionen in update.php vergessen**
❌ **Single-Quotes in SQL nicht escapen**
❌ **node_modules/ committen**
❌ **TinyMCE 5/6 API verwenden** (ist Version 8!)
❌ **Media Manager für alle Dateitypen nutzen**

## Hilfreiche Links

- [TinyMCE 8 Docs](https://www.tiny.cloud/docs/tinymce/latest/)
- [REDAXO Docs](https://redaxo.org/doku/master)
- [pnpm Docs](https://pnpm.io/)
- [esbuild Docs](https://esbuild.github.io/)

## Bei Fragen

- Issue auf GitHub öffnen
- REDAXO Slack (#addons Channel)
- Beschreibung: Exakte Fehlermeldung + PHP Version + REDAXO Version
