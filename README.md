# tinymce5 

tinymce5 für REDAXO

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

## ToDo:

- mblock-Kompatibilität verbessern
- Medienauswahl ermöglichen


## Licenses

- AddOn: [MIT LICENSE](https://github.com/FriendsOfREDAXO/tinymce5/blob/master/LICENSE.md)
- TinyMCE 5 [GPL LICENSE](https://github.com/tinymce/tinymce/blob/develop/LICENSE.TXT)


## Author

**Friends Of REDAXO**

* http://www.redaxo.org
* https://github.com/FriendsOfREDAXO

**Projekt-Lead**

[Joachim Dörr](https://github.com/joachimdoerr)


