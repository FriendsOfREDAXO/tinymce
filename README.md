# tinymce5 
🐣 tinymce5 für REDAXO


![Screenshot](https://github.com/FriendsOfREDAXO/tinymce5/blob/assets/screenshot.png?raw=true)

## Anwendung: 

**Moduleingabe**

```php
 <textarea class="tiny5-editor form-control" data-profile="default" name="REX_INPUT_VALUE[1]">REX_VALUE[1]</textarea>
```

- `data-profile="default"`definiert das gewünschte Profil 
- `data-lang="de"`legt die Sprache für den Editor fest

**Modulausgabe**

```php
REX_VALUE[id=1 output=html]
```
