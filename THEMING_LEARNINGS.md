# REDAXO Theme-System Learnings von mform & uppy

Basierend auf der Analyse von zwei gut implementierten REDAXO-Addons (mform und uppy).

---

## 1. Das Drei-Ebenen-Pattern für Theme-Awareness

REDAXO unterstützt drei Theme-Modi:

| Mode | Body-Klasse | Anwendungsfall |
|------|-------------|---|
| **Light (explizit)** | `.rex-theme-light` | Benutzer hat "Light Theme" gewählt |
| **Dark (explizit)** | `.rex-theme-dark` | Benutzer hat "Dark Theme" gewählt |
| **Auto (responsiv)** | `.rex-has-theme` (ohne -light/-dark) | Benutzer hat "Auto" gewählt → folgt `prefers-color-scheme` |

---

## 2. Korrektes CSS-Variables Pattern (mform Style)

### Schicht 1: Light Mode (Default)
```css
.mform-fb {
    --fb-bg-panel:      #f8f9fa;
    --fb-text:          #111827;
    --fb-accent:        #2563eb;
    /* ... weitere 20+ Variablen */
}
```
**Wichtig:** Diese Default-Werte sind Light-Mode! Sie gelten:
- Wenn `body` **keine** Theme-Klasse hat
- Oder wenn `body.rex-theme-light` gesetzt ist

### Schicht 2: Dark Mode (explizit)
```css
body.rex-theme-dark .mform-fb {
    --fb-bg-panel:      #1f2937;
    --fb-text:          #e5e7eb;
    --fb-accent:        #60a5fa;
    /* ... Dark-Pendants aller Variablen */
}
```
**Wann diese Styles greifen:**
- Wenn Benutzer "Dark Theme" ausdrücklich wählt
- `body.rex-theme-dark` wird gesetzt

### Schicht 3: Auto Mode (responsive)
```css
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) .mform-fb {
        --fb-bg-panel:      #1f2937;
        --fb-text:          #e5e7eb;
        --fb-accent:        #60a5fa;
        /* ... identisch mit Dark-Mode */
    }
}
```
**Wann diese Styles greifen:**
1. `prefers-color-scheme: dark` ist aktiv (System stellt Dark Mode ein)
2. UND `body.rex-has-theme` existiert (Benutzer hat Theme-System aktiviert)
3. UND `body.rex-theme-light` ist **NICHT** gesetzt (würde Light erzwingen)

---

## 3. Die Selektoren erklärt

### `body.rex-has-theme:not(.rex-theme-light)`

Dieser Selektor ist der **Schlüssel** für Auto Mode:

```
body.rex-has-theme        → "Theme-System ist aktiviert"
:not(.rex-theme-light)    → "UND Light Mode ist NICHT explizit erzwungen"
```

**Logik dahinter:**
- Wenn `.rex-theme-dark` gesetzt ist → bereits in Schicht 2 behandelt
- Wenn `.rex-theme-light` gesetzt ist → Schicht 3 greift NICHT (das ist korrekt!)
- Wenn **nichts** von beiden → Auto-Mode nutzt `prefers-color-scheme`

---

## 4. Common Mistake: Invertierte Auto-Mode Query

❌ **FALSCH** (wie es anfangs im tinymce war):
```css
@media (prefers-color-scheme: light) {
    body.rex-has-theme:not(.rex-theme-dark) { /* Light colors */ }
}
```

Probleme:
- `prefers-color-scheme: light` ist **nicht** das Gegenteil von `dark` – es ist ein spezifischer Wert
- `not(.rex-theme-dark)` passt auch auf Benutzer, die `.rex-theme-light` haben (unerwünscht)
- Logik ist verdreht: Media Query für Light mit Light-Farben ist redundant

✅ **RICHTIG** (mform Pattern):
```css
@media (prefers-color-scheme: dark) {
    body.rex-has-theme:not(.rex-theme-light) { /* Dark colors */ }
}
```

Logik:
- Media Query fragt: "Möchte das System Dark?"
- Body-Selektor fragt: "Hat Benutzer nicht explizit Light erzwungen?"
- Beide Bedingungen = Auto-Dark-Mode ist aktiv

---

## 5. Praktisches Beispiel: Three-Layer CSS-in-JS

So wird es im tinymce-Profile-Assistant gemacht (nach dem Fix):

```javascript
const style = document.createElement('style');
style.innerHTML = `
    /* ========== SCHICHT 1: Light Mode Default ========== */
    #tinymce-profile-assistant {
        --tpa-chip-bg: #f0f0f0;
        --tpa-chip-text: #1a1a1a;
        --tpa-chip-border: #d0d0d0;
    }
    
    /* ========== SCHICHT 2: Dark Mode Explicit ========== */
    body.rex-theme-dark #tinymce-profile-assistant {
        --tpa-chip-bg: #2a3744;
        --tpa-chip-text: #e8f0f7;
        --tpa-chip-border: #111820;
    }
    
    /* ========== SCHICHT 3: Auto Mode ========== */
    @media (prefers-color-scheme: dark) {
        body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant {
            --tpa-chip-bg: #2a3744;
            --tpa-chip-text: #e8f0f7;
            --tpa-chip-border: #111820;
        }
    }
`;
document.head.appendChild(style);
```

---

## 6. CSS-Variablen Naming Convention

Beide Addons verwenden Präfixe für ihre Variablen:

- **mform**: `--fb-*` (Form Builder)
  - `--fb-bg-panel`, `--fb-text`, `--fb-accent`
  
- **uppy**: `--uppy-*`
  - `--uppy-primary`, `--uppy-success`, `--uppy-background`

- **tinymce**: `--tpa-*` (TinyMCE Profile Assistant)
  - `--tpa-chip-bg`, `--tpa-chip-text`, `--tpa-dropzone-bg`

**Vorteil:** Namespace-Isolation, keine Konflikte mit anderen CSS-Variablen.

---

## 7. Color Palette Strategie von uppy

uppy definiert nur im Root:
```css
:root {
    --uppy-primary: #337ab7;
    --uppy-success: #5cb85c;
    --uppy-danger: #d9534f;
    --uppy-background: #fff;
    --uppy-text: #555;
}

body.rex-theme-dark {
    --uppy-primary: #4a90e2;
    --uppy-success: #6fbf73;
    --uppy-danger: #e74c3c;
    --uppy-background: #2c3136;
    --uppy-text: #f2f2f2;
}

@media (prefers-color-scheme: dark) {
    body:not(.rex-theme-light) {
        --uppy-primary: #4a90e2;
        /* ... Dark Colors */
    }
}
```

**Vorteil:** Minimale Redundanz, zentrale Verwaltung.

---

## 8. Dark Mode Color Picking Tipps

Von der mform Implementierung gelernt:

1. **Nicht einfach invertieren!**
   - Nicht: `#f5f5f5` → `#0a0a0a`
   - Sondern: `#f5f5f5` → `#1f2937` (bewusste Wahl für Lesbarkeit)

2. **Kontrast prüfen**
   - Light: `#111827` (sehr dunkel) auf `#f8f9fa` (sehr hell) = gut
   - Dark: `#e5e7eb` (hell grau) auf `#1f2937` (dunkel) = gut

3. **Accent-Farben anpassen**
   - Light: `#2563eb` (sattes Blau)
   - Dark: `#60a5fa` (helleres Blau für Sichtbarkeit)

4. **Gradients nutzen**
   - Light: `linear-gradient(135deg, #e3f0fa, #d0e8f7)` (subtil)
   - Dark: `linear-gradient(135deg, #2c5a8f, #1e4066)` (für Tiefe)

---

## 9. Testing-Strategie

Um Theme-aware CSS zu validieren:

```bash
# Light Mode testen
# → Browser DevTools: keine `.rex-theme-*` Klasse auf body

# Dark Mode testen
# → Browser DevTools: `body class="rex-theme-dark"`

# Auto Mode Light testen
# → System stellt Light ein + `body class="rex-has-theme"` (ohne -dark/-light)

# Auto Mode Dark testen
# → System stellt Dark ein + `body class="rex-has-theme"` (ohne -dark/-light)
```

---

## 10. Checkliste für Theme-aware Components

- [ ] Light-Mode Default-Variablen definiert?
- [ ] Dark-Mode Variablen mit `body.rex-theme-dark` definiert?
- [ ] Auto-Mode Query mit `@media (prefers-color-scheme: dark)` + `body.rex-has-theme:not(.rex-theme-light)`?
- [ ] Kontrast-Verhältnisse getestet (WCAG AA mindestens)?
- [ ] Gradient-Farben in Dark Mode sichtbar?
- [ ] Font-Farben ausreichend hoch kontrastiert?
- [ ] Box-Shadows in Dark Mode nicht zu dunkel?
- [ ] Borders/Separators in Dark Mode sichtbar?

---

## 11. Fazit: Warum das mform-Pattern besser ist

| Aspekt | Altes Pattern | mform Pattern |
|--------|---|---|
| **Konsistenz** | Unterschiedlich | Einheitlich |
| **Wartbarkeit** | Schwer (3 verschiedene Ansätze) | Einfach (einheitliches Muster) |
| **Browser-Support** | Media Query falsch herum | Korrekter Syntax |
| **Theme-Switching** | Teilweise buggy | Funktioniert reliabel |
| **Erweiterbarkeit** | Schwach | Einfach neue Variablen hinzufügen |

→ **Empfehlung:** Das mform-Pattern als Standard für alle REDAXO-Addons verwenden!

