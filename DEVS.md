# Entwickler-Dokumentation

Diese Dokumentation richtet sich an Entwickler, die das TinyMCE-Addon erweitern oder eigene Plugins integrieren möchten.

## Profil-Assistent: Managed Keys und Protected Extras

Der Profil-Assistent verwaltet einen festen Satz an Optionen direkt über UI-Felder ("managed keys").

* Nicht verwaltete Optionen werden beim Laden automatisch in den Bereich **Protected Extras** verschoben.
* Beim Generieren werden diese Extras wieder an die erzeugte Konfiguration angehängt.
* Dadurch bleiben projektspezifische Zusatzoptionen bei Round-Trips erhalten.

Wichtig:

* `quickbars_image_toolbar` ist absichtlich **nicht** als managed key behandelt, solange es dafür kein explizites UI-Feld gibt.
* Für Protected-Extras-Eingaben unterstützt die Normalisierung sowohl Top-Level-Komma-Splitting als auch den Fallback "eine Property pro Zeile".


## Profile für andere AddOns bereitstellen

Wenn dein AddOn maßgeschneiderte TinyMCE-Profile erfordert (z.B. für ein Textmodul mit ganz bestimmten Plugins), solltest du diese Workflow befolgen:

### 📋 Empfohlener Workflow: UI-First

1. **Profil im Backend erstellen**: Navigiere zu **TinyMCE → Editor Profile** und erstelle dein Profil visuell mit allen gewünschten Einstellungen (Plugins, Toolbar, etc.)
2. **Profile exportieren**: Nutze den **Export-Button** neben der Profilliste, um das Profil als JSON-Datei herunterzuladen
3. **Im AddOn speichern**: Kopiere die JSON-Datei in dein AddOn (z.B. in `data/tinymce_profile.json`)
4. **In `install.php` importieren**: Nutze `ProfileHelper::importProfileFromJson()` um es automatisch beim Installieren einzuspielen

### Beispiel: JSON importieren (empfohlen)

```php
if (rex_addon::get('tinymce')->isAvailable() && class_exists(\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::class)) {
    $jsonFile = rex_path::addon('mein_addon', 'data/tinymce_profile.json');
    
    // Importiert das Profil aus der exportierten JSON-Datei
    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::importProfileFromJson(
        $jsonFile,
        false // Setze auf true, wenn dein AddOn das Profil beim Update zwingend aktualisieren soll
    );
}
```

### Alternative: PHP-Code-Generator nutzen

Alternativ kannst du den **PHP-Code-Generator** im Backend verwenden (Button "PHP-Code erzeugen" neben der Profilliste):

1. Klicke auf "PHP-Code erzeugen" für dein Profil
2. Kopiere den generierten Code
3. Füge ihn direkt in deine `install.php` ein

Der generierte Code sieht etwa so aus:

```php
if (rex_addon::get('tinymce')->isAvailable() && class_exists(\FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::class)) {
    \FriendsOfRedaxo\TinyMce\Utils\ProfileHelper::ensureProfile(
        'mein_addon_profil',
        'Spezialprofil für AddOn X',
        [
            'plugins' => 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen media table wordcount',
            'toolbar' => 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            'extra' => '...',
            // optional: mediatype, mediapath, mediacategory, upload_default
        ],
        false // forceUpdate: true = always overwrite on addon update
    );
}
```

### Technischer Hintergrund: Die `extra`-Spalte

**Wichtig zu verstehen:** Bei der Laufzeit nutzt TinyMCE nur die `extra`-Spalte der Profiltabelle. Diese Spalte enthält alle TinyMCE-Konfigurationsoptionen als JSON-String.

- Die Spalten `plugins` und `toolbar` sind **Legacy**-Spalten und werden im Backend nur für die Bearbeitung/Anzeige verwendet
- Sie werden vom Frontend **nicht** ausgelesen – nur `extra` wird gelesen und an die JavaScript-Initialisierung übergeben
- Der PHP-Code-Generator gibt diese Spalten mit aus (für Vollständigkeit und UI-Kompatibilität), aber sie sind optional
- Der wichtige Teil ist die `extra`-Spalte, die bei Bedarf erweiterte YAML-Optionen enthalten kann

### Benutzte Hilfsmethoden

`ProfileHelper` stellt folgende Methoden zur Verfügung:

| Methode | Zweck |
|---------|-------|
| `importProfileFromJson($filePath, $forceUpdate)` | **Empfohlen**: JSON-Datei importieren (eine oder mehrere Profile) |
| `ensureProfile($name, $description, $data, $forceUpdate)` | Profil direkt programmatisch erstellen (mit PHP-Array) |
| `normalizeImportedProfile($profile)` | Validiert und normalisiert ein importiertes Profil-Array |
| `ensureProfileFromImportedArray($profile, $forceUpdate)` | Importiert ein Profil-Array (wird von `importProfileFromJson()` verwendet) |
| `generateEnsureProfileCode($profile)` | Generiert PHP-Code für ein Profil (wird im Backend verwendet) |

Alle Methoden triggern am Ende automatisch `Profiles::profilesCreate()`, sodass das neu eingespeiste Profil sofort im Frontend und Backend zur Verfügung steht.

## Eigene Plugins registrieren

Das TinyMCE-Addon bietet eine einfache Möglichkeit, benutzerdefinierte Plugins aus anderen Addons zu registrieren. Dies geschieht über die Klasse `\FriendsOfRedaxo\TinyMce\PluginRegistry`.

### Verwendung

Um ein Plugin zu registrieren, rufen Sie die Methode `addPlugin` in der `boot.php` Ihres Addons auf.

```php
if (rex_addon::get('tinymce')->isAvailable()) {
    \FriendsOfRedaxo\TinyMce\PluginRegistry::addPlugin(
        'mein_plugin_name',                                       // Eindeutige ID des Plugins
        rex_url::addonAssets('mein_addon', 'mein_plugin.js'),     // URL zur JS-Datei des Plugins
        'mein_button_name'                                        // Optional: Name des Buttons für die Toolbar
    );
}
```

### Parameter

*   **`$pluginName`** (string): Der interne Name des Plugins. Dieser muss eindeutig sein und wird verwendet, um das Plugin in der TinyMCE-Konfiguration zu aktivieren (`plugins: '...'`).
*   **`$pluginUrl`** (string): Die vollständige URL zur JavaScript-Datei des Plugins. Diese Datei sollte ein gültiges TinyMCE-Plugin enthalten (siehe unten).
*   **`$toolbarButton`** (string|null): Optional. Wenn das Plugin einen Button bereitstellt, der in der Toolbar erscheinen soll, geben Sie hier den Namen des Buttons an. Dieser wird dann automatisch zur Liste der verfügbaren Toolbar-Buttons im Profil-Editor hinzugefügt.

### Beispiel: Plugin-Datei (`plugin.js`)

Ein TinyMCE-Plugin sollte als *Self-Executing Anonymous Function* (IIFE) aufgebaut sein und sich über `tinymce.PluginManager.add` registrieren.

```javascript
(function () {
    'use strict';

    tinymce.PluginManager.add('mein_plugin_name', function (editor, url) {
        // Button registrieren
        editor.ui.registry.addButton('mein_button_name', {
            text: 'Mein Button',
            onAction: function () {
                editor.insertContent('Hallo Welt!');
            }
        });

        // Menü-Eintrag registrieren (optional)
        editor.ui.registry.addMenuItem('mein_menu_item', {
            text: 'Mein Menü-Eintrag',
            onAction: function () {
                editor.insertContent('Hallo vom Menü!');
            }
        });
    });
})();
```

## Technische Hintergründe

### Extension Point `TINYMCE_PROFILE_OPTIONS`

Die `PluginRegistry`-Klasse nutzt intern den Extension Point `TINYMCE_PROFILE_OPTIONS`. Dieser EP wird aufgerufen, bevor der Profil-Editor im Backend gerendert wird.

Wenn Sie komplexere Anpassungen vornehmen müssen, können Sie diesen EP auch direkt nutzen:

```php
rex_extension::register('TINYMCE_PROFILE_OPTIONS', function (rex_extension_point $ep) {
    $options = $ep->getSubject();
    
    // Beispiel: Ein Plugin manuell hinzufügen
    $options['plugins'][] = 'mein_plugin';
    $options['external_plugins']['mein_plugin'] = 'https://example.com/plugin.js';
    
    return $options;
});
```

### Build-Prozess für Core-Plugins

Die im Addon enthaltenen Plugins (`link_yform`, `phonelink`, `quote`, `snippets`) werden über einen Node.js-Build-Prozess erstellt. Dieser sorgt dafür, dass die Plugins:

1.  Minifiziert werden.
2.  In den Ordner `assets/scripts/tinymce/plugins/` kopiert werden.
3.  Zusätzlich in den Ordner `assets/vendor/tinymce/plugins/` kopiert werden (für Kompatibilität).

Wenn Sie am Core des Addons arbeiten, nutzen Sie `pnpm build`, um die Plugins neu zu erstellen.

### Snippets API

Das Snippets-Plugin lädt seine Daten dynamisch über eine REDAXO-API-Funktion.

*   **API-Klasse:** `rex_api_tinymce_get_snippets` (in `lib/api_tinymce_get_snippets.php`)
*   **Aufruf:** `index.php?rex-api-call=tinymce_get_snippets`
*   **Rückgabe:** JSON-Array mit Objekten `{title: "Name", content: "HTML-Inhalt"}`

### Style-Sets System

Style-Sets werden in der Datenbank-Tabelle `rex_tinymce_stylesets` gespeichert und über `TINYMCE_GLOBAL_OPTIONS` an alle Profile weitergegeben.

#### Extension Point `TINYMCE_GLOBAL_OPTIONS`

Dieser EP wird beim Laden der Backend-Assets aufgerufen und ermöglicht das Hinzufügen globaler TinyMCE-Optionen:

```php
rex_extension::register('TINYMCE_GLOBAL_OPTIONS', function (rex_extension_point $ep) {
    $options = $ep->getSubject();
    
    // Beispiel: Zusätzliches CSS hinzufügen
    $options['content_css'][] = ['url' => '/my/custom.css', 'profiles' => ['my_profile']];
    
    // Beispiel: Zusätzliche Style-Formats
    $options['style_formats'][] = [
        'format' => ['title' => 'Mein Stil', 'inline' => 'span', 'classes' => 'my-class'],
        'profiles' => ['my_profile']  // Leer = alle Profile
    ];
    
    return $options;
});
```

#### Profil-Filterung

Style-Sets können auf bestimmte Profile beschränkt werden:

*   **Leeres `profiles`-Array:** Style-Set gilt für alle Profile
*   **Gefülltes `profiles`-Array:** Style-Set gilt nur für die angegebenen Profile

Die Filterung erfolgt client-seitig in `base.js` beim Initialisieren des Editors.

#### Eigene Style-Sets programmatisch anlegen

```php
$sql = rex_sql::factory();
$sql->setTable(rex::getTable('tinymce_stylesets'));
$sql->setValue('name', 'mein_styleset');
$sql->setValue('description', 'Meine Custom Styles');
$sql->setValue('content_css', '/assets/css/my-framework.css');
$sql->setValue('style_formats', json_encode([
    [
        'title' => 'Meine Styles',
        'items' => [
            ['title' => 'Highlight', 'name' => 'my-highlight', 'inline' => 'span', 'classes' => 'highlight']
        ]
    ]
]));
$sql->setValue('profiles', 'profil1, profil2');  // Leer = alle
$sql->setValue('active', 1);
$sql->setValue('prio', 10);
$sql->insert();
```

### Link YForm Plugin Internals

Das `link_yform` Plugin speichert Links zu YForm-Datensätzen als interne Platzhalter.

*   **Standard-Format:** `tabellenname://id` (z.B. `rex_yf_project://1`)
*   **Custom-Format:** Wenn im Profil der Parameter `url` gesetzt ist (z.B. `/event:`), wird dieser als Präfix verwendet (z.B. `/event:1`).

**Wichtig:** Diese Links sind **keine** gültigen URLs für das Frontend. Sie müssen zwingend über einen `OUTPUT_FILTER` Extension Point in echte URLs umgewandelt werden (siehe README.md für Code-Beispiel).

## Best Practices

1.  **Namensräume:** Verwenden Sie für Ihre Plugin-Namen einen Präfix (z.B. `addonname_pluginname`), um Konflikte mit anderen Plugins zu vermeiden.
2.  **Assets:** Legen Sie Ihre Plugin-Dateien im `assets`-Ordner Ihres Addons ab und nutzen Sie `rex_url::addonAssets()`, um die URL zu generieren.
3.  **Abhängigkeiten:** Prüfen Sie mit `rex_addon::get('tinymce')->isAvailable()`, ob das TinyMCE-Addon installiert und aktiviert ist, bevor Sie Code ausführen, der darauf zugreift.
4.  **Profile für andere AddOns:** Verwenden Sie `ProfileHelper::importProfileFromJson()` oder den PHP-Code-Generator statt direkter Datenbankoperationen (siehe oben).
