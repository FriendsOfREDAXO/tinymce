Changelog
=========

Version 8.0.0
-------------------------------

**Major Update: TinyMCE 6.8.3 → 8.2.2**

### Neue Funktionen und Änderungen
* Update TinyMCE von 6.8.3 auf 8.2.2
* Update tinymce-i18n von 23.12.19 auf 25.11.17
* GPL-Lizenzschlüssel-Konfiguration für TinyMCE 8 Kompatibilität
* Sprachdateien-Pfad aktualisiert von langs6/ auf langs/
* Entfernung des veralteten Template-Plugins (in TinyMCE 7+ entfernt)
* REDAXO-spezifische Custom Plugins (link_yform, phonelink, quote) mit TinyMCE 8.2.2 neu kompiliert

### Migration von älteren Versionen (TinyMCE 4/5/6)
* Automatisches Hinzufügen des GPL-Lizenzschlüssels zu bestehenden Profilen
* Automatisches Entfernen des Template-Plugins aus bestehenden Profilen
* Automatische Korrektur der content_css Dark-Mode Konfiguration
* Migrations-Logging für bessere Nachvollziehbarkeit
* Alle bestehenden Profile bleiben erhalten und werden nur minimal angepasst

### Breaking Changes
* Template Plugin wurde aus TinyMCE entfernt (war bereits in v7 deprecated)
* Lizenzschlüssel `license_key: 'gpl'` ist nun erforderlich für Open-Source Nutzung
* TinyMCE Lizenz geändert von MIT auf GPL v2+ (ab Version 8.0)

### Entwickler-Hinweise
* Eigene Profile müssen manuell mit `license_key: 'gpl'` ergänzt werden
* Template Plugin muss aus eigenen Profilen entfernt werden
* Custom Plugins sind kompatibel (verwenden moderne TinyMCE 5+ APIs)

Version 6.1.1
-------------------------------

* remove TinyMCE 5 stuff from default profiles and subsitute with TinyMCE 6 buttons
