# link_yform TinyMCE Plugin

Mit diesem Plugin ist es möglich, Datensätze aus YForm-Tabellen zu verlinken.
Das `href` beinhaltet dabei eine fiktive URL die via `OUTPUT_FILTER` noch ersetzt werden muss (siehe weiter unten). Ähnlich dem bekannten `redaxo://1`.

## TinyMCE Profil

Im TinyMCE Profil muss bei `plugins` das Plugin `link_yform` aktiviert werden.

Beispiel
```js
plugins: 'link_yform preview code ...'
```

Über die Option `link_yform_tables` werden die YForm-Tabellen notiert, die eine Verlinkung anbieten sollen.

Beispiel
```js
link_yform_tables: [
    {
        "table": "rex_yf_project",
        "field": "title",
        "menu": "Projekt verlinken"
    },
    {
        "table": "rex_yf_event",
        "field": "name",
    },
]
```

| Key   | Erklärung                                                             |
|-------|-----------------------------------------------------------------------|
| table | Name der YForm-Tabelle                                                |
| field | Name des Feldes, welches als Text für den Link übernommen werden soll |
| menu  | Optionaler Text für das Menü. Ansonsten erscheint der Tabelllenname   |




## Fiktive URLs ersetzen

Um die fiktiven generierten Urls wie `rex-yf-project://1` zu ersetzen, muss folgendes Skript in die `boot.php` des `project` AddOns.
Dazu müsste der Code für die Urls angepasst werden.

```php
\rex_extension::register('OUTPUT_FILTER', function(\rex_extension_point $ep) {
    return preg_replace_callback(
        '@(rex-yf-(project|event))://(\d+)(?:-(\d+))?/?@i',
        function ($matches) {
            $table = $matches[1]
            $id = $matches[3]
            $url = '';
            switch ($table) {
                case 'rex-yf-project':
                    // Beispiel, falls die Urls via Url-AddOn generiert werden
                    $object = Project::get($id);
                    if ($object) {
                        $url = $object->getUrl();

                        // die getUrl Methode könnte in dre Klasse so aussehen
                        // public function getUrl()
                        // {
                        //     return rex_getUrl('', '', ['project-id' => $this->id]);
                        // }
                    }
                    break;
                case 'rex-yf-event':
                    // ein anderes Beispiel
                    $url = '/index.php?event='.$id;
                    break;
            }
            return $url;
        },
        $ep->getSubject()
    );
}, rex_extension::NORMAL);
```
