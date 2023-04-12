# TinyMCE - REDAXO-AddOn 

Stellt den TinyMCE im CMS REDAXO bereit. 

![Screenshot](https://github.com/FriendsOfREDAXO/tinymce5/blob/assets/screenshot6.png?raw=true)

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

Zur Konfiguration eigener Profile bitte in das default Profil schauen und die [TinyMCE Doku](https://www.tiny.cloud/docs/) beachten.


## Update von TinyMCE 5

Bei der Installation können vorhandene Profile aus TinyMCE 5 migriert werden. Folgendes Vorgehen ist hierzu notwendig.

1. *TinyMCE 5 nicht deinstallieren oder löschen!* TinyMCE5 darf nur deaktiviert werden, damit die Profile erhalten bleiben.

2. TinyMCE installieren. Hierbei werden die vorhandenen Profile aus TinyMCE 5 nach TinyMCE kopiert.

3. TinyMCE 5 deinstallieren und löschen.

Die Klasse `tiny5-editor` wird weiterhin unterstützt. Wir empfehlen aber nur noch die Klasse `tiny-editor` für die Feldidentifikation zu verwenden. Eine Textarea mit tinyMCE hat dann beispielsweise folgenden Code: `<textarea class="tiny-editor form-control" data-profile="full" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>`

### Dark-Mode in die migrierten Profile übernehmen

Folgenden Code in den Profilem ergänzen

```
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "light",
```

## ToDo:

- mblock-Kompatibilität verbessern


## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce/blob/master/LICENSE.md)
- TinyMCE [MIT LICENSE](https://github.com/tinymce/tinymce/blob/develop/LICENSE.TXT)


## Author

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO

**Credits**

[Vendor: TinyMCE](https://www.tiny.cloud)

[Development: Joachim Dörr](https://github.com/joachimdoerr)

[Development: Wolfgang Bund](https://github.com/dtpop)

[Development: Alex Wenz](https://github.com/alexwenz)

[REXFamilyWeek](https://ferien-am-tressower-see.de/rexfamilyweek-2023/)



