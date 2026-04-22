# TinyMCE 8.4 – Ein Mega-Update

## Barrierefreiheit, Medien und Content wie noch nie

Eines der größten Releases, die das REDAXO-TinyMCE-AddOn je gesehen hat: **neue FOR-Plugins** erledigen Aufgaben, für die man sonst eine teure TinyMCE-Premium-Lizenz bräuchte — plus Sticky-Toolbar, neuer Profil-Assistent und ein gesperrtes Demo-Profil.

**Kurz: Wer im REDAXO-Editor schreibt, wird dieses Update lieben.**

---

## Das Wichtigste auf einen Blick

- `for_a11y` – Accessibility-Checker direkt im Editor
- `for_toc` – Inhaltsverzeichnis mit Live-Sync
- `for_footnotes` – echte Fußnoten mit Rück-Verweisen
- `for_video` – lokale HTML5-Videos aus dem Mediapool
- `for_oembed` – YouTube/Vimeo per URL-Paste, CKE5-kompatibel
- `for_htmlembed` – sichere HTML/JS-Snippets
- `for_checklist` – moderne Checklisten, importiert CKE5-ToDo-Listen
- `cleanpaste` – sauber einfügen aus Word, Outlook, Google Docs
- `mediapaste` – Drag & Drop landet direkt im Medienpool
- **Sticky Toolbar** – Menü- und Werkzeugleiste kleben beim Scrollen oben
- **Gesperrtes Demo-Profil** – Showroom zum Ausprobieren, update-fest
- **Profil-Assistent 2.0** – zusammenklicken statt JSON tippen

---

## Endlich kann man in einem REDAXO-Editor…

### …Barrierefreiheit auf Knopfdruck prüfen

**`for_a11y`** ist ein kompletter Accessibility-Checker — inspiriert vom kommerziellen TinyMCE-`a11ychecker`, aber Open Source. Ein Klick, und du wirst durch alle Probleme geführt: Bilder ohne `alt`, „hier klicken"-Links, Überschriften-Sprünge, Tabellen ohne `<th>`, `target="_blank"` ohne Hinweis, Iframes ohne `title` … Der Dialog ist **nicht modal** — du verschiebst ihn per Drag, springst direkt zum Element und schreibst parallel weiter. Farbige Marker im Editor, Regeln einzeln abschaltbar.

### …ein echtes Inhaltsverzeichnis einfügen

**`for_toc`** baut aus deinen Überschriften ein verschachteltes `<nav>`-TOC mit stabilen Slug-IDs. **Live**: neue Überschrift → neuer Eintrag. Undo/Redo inklusive. Frontend-CSS dabei, Dark-Mode-ready, optional sticky für Sidebar-Layouts.

### …richtige Fußnoten setzen

**`for_footnotes`** liefert das, was Wikipedia macht: hochgestellte Nummern, nummerierte Sektion am Ende, bidirektionale Links. Mittendrin einschieben? Automatische Neu-Nummerierung. Eigener Namespace, keine Abhängigkeit zum Tiny-Premium-Plugin.

### …YouTube-URLs einfach einfügen

**`for_oembed`** macht Embed-Code-Gefummel überflüssig. URL in den Editor → Live-Vorschau mit Provider-Badge. Gespeichert wird **CKE5-kompatibel** als `<oembed>`. Frontend-Rendering über den `OembedRenderer` — mit optionaler [`vidstack`](https://github.com/FriendsOfREDAXO/vidstack)-Integration oder responsivem `<iframe>`-Fallback.

### …lokale Videos aus dem Mediapool einbauen

**`for_video`** ist `for_oembed`s kleiner Bruder für MP4/WebM/OGG. Direkt aus dem Mediapool, mit Poster-Bild, Click-to-Play-Vorschau und den gleichen Presets wie `for_images`. Controls, Autoplay, Loop — alles per Dialog.

### …sichere HTML/JS-Snippets einbetten

**`for_htmlembed`** rettet Social-Embeds, Tracking-Pixel und Iframes. Der Code liegt in einem `contenteditable="false"`-Container — unkaputtbar. Bearbeiten per Doppelklick mit Syntax-Highlighting (wenn das `code`-AddOn da ist).

### …Checklisten erstellen

**`for_checklist`** liefert zwei Varianten: klassische **To-Do-Liste** (Haken = durchgestrichen) und **Feature-Liste** (grüner Check, offene Einträge gestrichelt). Pures CSS, Dark-Mode, alles über CSS-Variablen anpassbar. **Bonus:** CKEditor-5-Checklisten werden beim Paste automatisch konvertiert.

### …endlich sauber aus Word einfügen

**`cleanpaste`** ersetzt das kostenpflichtige **PowerPaste**. Word-, Outlook-, Google-Docs-Müll (Conditional Comments, `<o:p>`, mso-Styles) fliegt raus, **bevor** es in den Editor kommt. Erlaubte Tags/Klassen als Positiv-Liste mit Regex-Support — plus GUI-Einstellungsseite statt JSON-Gefummel.

### …Bilder per Drag & Drop in den Medienpool schieben

**`mediapaste`** zieht Bilder direkt in den REDAXO-Medienpool. Screenshots? Rein. „Bild kopieren" aus fremden Websites? Wird gegrabbt statt extern verlinkt. Kategorien-Picker respektiert `rex_media_perm`.

---

## Und was ist noch neu?

### Sticky Toolbar

`toolbar_sticky: true` ist jetzt Default in allen mitgelieferten Profilen — Toolbar klebt beim Scrollen oben. Bestehende Profile werden per Migration automatisch nachgezogen. Bonus: Ein kleines JS verhindert, dass die REDAXO-Topnav beim Hochscrollen reinploppt und die Editor-Toolbar überdeckt. Erst am Seitenanfang ist sie wieder da.

### Gesperrtes Demo-Profil

Ein neues Profil `demo` mit allen FOR-Plugins aktiv — unser Showroom. Im Backend **gesperrt**: kein Edit, kein Clone, kein Delete. Bei jedem AddOn-Update automatisch auf aktuellem Stand.

### Profil-Assistent 2.0

**Bau dein Profil wie du's magst. Entweder langweilig per Code-Eingabe oder … klick dir doch was zusammen. :-)** FOR-Badges markieren alle FriendsOfREDAXO-Plugins, ein neuer Einfügen-Menü-Builder baut das „Einfügen"-Menü per Drag & Drop, und bestehende Profile werden beim Öffnen automatisch in den Assistenten übernommen — kein Verlust mehr beim Wechsel zwischen JSON und GUI.

---

## Für Entwickler:innen

- FOR-Plugins haben eigenen `for_`/`for-`-Namespace, keine Kollision mit Tiny-Premium.
- Frontend-Rendering via `FriendsOfRedaxo\TinyMce\Renderer\OembedRenderer`.
- Plugin-Configs landen in `assets/generated/profiles.js` (Backend **und** Frontend).
- Neue API-Endpoints: `tinymce_media_upload`, `tinymce_media_categories`.
- Alles rexstan-clean.

---

## Update-Hinweis

Einfach AddOn updaten — `update.php` erledigt Migrationen, Demo-Profil, Sticky-Default und `profiles.js`-Regenerierung automatisch. Deine Profile bleiben 1:1 funktionsfähig. Alle neuen FOR-Plugins sind optional.

---

**Viel Spaß mit TinyMCE 8.4!** Feedback & Issues: [github.com/FriendsOfREDAXO/tinymce](https://github.com/FriendsOfREDAXO/tinymce).
