# TinyMCE Image Width Plugin

Feste Bildbreiten für TinyMCE – kein manuelles Skalieren, sondern CSS-Klassen.

## Features

- **UIkit 3**: `uk-width-*` Klassen mit Breakpoints (`@s`, `@m`, `@l`, `@xl`)
- **Bootstrap**: `col-*` Klassen (1–12 Spalten) mit Breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`)
- **General**: Feste Pixel-Breiten (150px, 300px, 600px, 100%)
- **Originalgröße**: Alle Klassen entfernen
- **Kein Resize**: Manuelles Ziehen der Bildränder ist deaktiviert

## Einrichtung

### In TinyMCE Profil-Konfiguration

Plugin aktivieren:

```
plugins: 'imagewidth ...'
```

Toolbar-Button hinzufügen:

```
toolbar: '... imagewidthdialog ...'
```

### Framework wählen

In den TinyMCE `init`-Optionen:

```js
// UIkit 3 (Standard für REDAXO-Projekte mit UIkit)
imagewidth_framework: 'uikit'

// Bootstrap
imagewidth_framework: 'bootstrap'

// General (Pixel-basiert, Framework-unabhängig)
imagewidth_framework: 'general'
```

## Verwendung

### Kontextmenü (empfohlen)
1. Bild im Editor anklicken
2. In der erscheinenden Kontextleiste auf das Resize-Icon klicken
3. Gewünschte Breite aus dem Dropdown wählen

### Dialog
1. Bild im Editor auswählen
2. In der Toolbar auf „Bildbreite auswählen" klicken
3. Im Dialog die Breite wählen und bestätigen

## CSS für General-Modus

Wenn `imagewidth_framework: 'general'` verwendet wird, folgende CSS-Klassen im Frontend definieren:

```css
.img-width-small  { width: 150px; height: auto; }
.img-width-medium { width: 300px; height: auto; }
.img-width-large  { width: 600px; height: auto; }
.img-width-full   { width: 100%;  height: auto; }
```

## UIkit 3 Beispiele

| Klasse | Wirkung |
|--------|---------|
| `uk-width-1-2` | 50 % Breite |
| `uk-width-1-3@m` | 33 % ab Medium (≥ 960px) |
| `uk-width-1-4@l` | 25 % ab Large (≥ 1200px) |
| `uk-width-small` | 150px Fixbreite |

## Bootstrap Beispiele

| Klasse | Wirkung |
|--------|---------|
| `col-6` | 50 % (6/12 Spalten) |
| `col-md-4` | 33 % ab Medium (≥ 768px) |
| `col-lg-3` | 25 % ab Large (≥ 992px) |

## Build

```bash
cd custom_plugins/imagewidth
pnpm install
pnpm run build
```
