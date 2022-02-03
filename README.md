# TinyMCE5 - REDAXO-AddOn 

Stellt den TinyMCE im CMS REDAXO bereit. 

![Screenshot](https://github.com/FriendsOfREDAXO/tinymce5/blob/assets/screenshot.png?raw=true)

## Anwendung: 

**Moduleingabe**

```php
 <textarea class="tiny5-editor form-control" data-profile="full" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>
```

- `data-profile="full"`definiert das gewünschte Profil 
- `data-lang="de"`legt die Sprache für den Editor fest

> Wählt man als profil `data-profile="default"`, erhält man den Editor in der Grundkonfiguration. 

**Modulausgabe**

```php
REX_VALUE[id=1 output=html]
```

### Verwendung in YForm

- Im individuellen Attribute-Feld: ``` {"class":"tiny5-editor","data-profile":"full"} ```
- Weitere Attribute kommagetrennt möglich

### Verwendung in MForm

```php
$mform = new MForm();
$mform->addTextAreaField(1, 
        array(
        'label'=>'Text',
        'class'=>'tiny5-editor', 
        'data-profile'=>'full')
        );
echo $mform->show();
```

## Konfiguration

Zur Konfiguration eigener Profile bitte in das default Profil schauen und die [TinyMCE 5 Doku](https://www.tiny.cloud/docs/) beachten. 

## Demo

![Demo](https://github.com/FriendsOfREDAXO/tinymce5/blob/assets/tinymce-demo-gif.gif?raw=true)

## ToDo:

- mblock-Kompatibilität verbessern


## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce5/blob/master/LICENSE.md)
- TinyMCE 5 [GPL LICENSE](https://github.com/tinymce/tinymce/blob/develop/LICENSE.TXT)


## Author

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO

**Credits**

[Vendor: TinyMCE](https://www.tiny.cloud)

[Development: Joachim Dörr](https://github.com/joachimdoerr)

[Development: Wolfgang Bund](https://github.com/dtpop)

[Development: Alex Wenz](https://github.com/alexwenz)



