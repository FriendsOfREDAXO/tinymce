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

## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce/blob/master/LICENSE.md)
- TinyMCE: [GPL v2+ LICENSE](https://github.com/tinymce/tinymce/blob/develop/license.md) (ab Version 8.0)


## Author

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO
