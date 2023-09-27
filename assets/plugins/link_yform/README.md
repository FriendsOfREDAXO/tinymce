# link_yform TinyMCE Plugin

Welcome stranger! This is a repo containing the link_yform TinyMCE plugin.

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
