<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

/**
 * Liefert die Konfiguration für das gesperrte Demo-Profil.
 *
 * Das Demo-Profil (name: "demo") wird beim Install/Update automatisch
 * angelegt bzw. überschrieben und darf im Backend nicht bearbeitet
 * oder gelöscht werden (Schutz in pages/profiles.php).
 *
 * Es aktiviert bewusst ALLE FOR-Plugins und liefert eine vollständige
 * Toolbar, damit die Demo-Seite (pages/main.php) das komplette
 * Funktionsspektrum des AddOns auf einen Blick zeigt.
 */
final class DemoProfile
{
    public const NAME = 'demo';
    public const DESCRIPTION = 'Demo-Profil (gesperrt) – alle FOR-Plugins aktiv. Wird bei jedem Update überschrieben.';

    public static function getExtra(): string
    {
        return <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
height: 620,
min_height: 400,
autoresize_bottom_margin: 50,
relative_urls: false,
remove_script_host: true,
document_base_url: '/',
convert_urls: true,
entity_encoding: 'raw',

plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y for_markdown for_chars_symbols for_abbr cleanpaste mediapaste link_yform phonelink quote code',

/* Logisch gruppierte Toolbar – Barrierefreiheit zuerst, danach Verlauf,
   Stile, Textformatierung, Listen/Ausrichtung, Links, Medien & Einbettungen,
   semantische Bausteine, Tabelle, Typografie, Snippets, Ansicht. */
toolbar: 'for_a11y for_abbr language | undo redo | styles | bold italic underline strikethrough | subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link link_yform phonelink anchor | image imagewidthdialog for_oembed for_video for_htmlembed | quote for_checklist for_checklist_feature for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | table | for_chars_symbols for_chars_symbols_invisibles charmap emoticons hr pagebreak | snippets | searchreplace | fullscreen preview code help',

menu: {
    file: { title: 'Datei', items: 'preview print' },
    edit: { title: 'Bearbeiten', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
    view: { title: 'Ansicht', items: 'visualaid visualchars visualblocks | preview fullscreen' },
    insert: {
        title: 'Einfügen',
        items: 'image imagewidthdialog for_oembed for_video for_htmlembed | link anchor for_abbr | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | for_chars_symbols charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime'
    },
    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
    tools: { title: 'Werkzeuge', items: 'wordcount for_a11y | code' },
    table: { title: 'Tabelle', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
},

quickbars_selection_toolbar: 'bold italic underline | forecolor | link for_abbr',
quickbars_insert_toolbar: 'image imagewidthdialog for_oembed for_video | for_checklist for_footnote_insert | hr',

contextmenu: 'link table for_a11y | for_chars_symbols for_abbr',

codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'JSON', value: 'json' },
    { text: 'Bash', value: 'bash' },
    { text: 'SQL', value: 'sql' }
],

link_rel_list: [
    { title: 'Keine', value: '' },
    { title: 'Nofollow', value: 'nofollow' },
    { title: 'Sponsored', value: 'sponsored' },
    { title: 'UGC', value: 'ugc' }
],

link_target_list: [
    { title: '— Kein Ziel (gleiches Fenster)', value: '' },
    { title: 'Neues Fenster', value: '_blank' }
],

/* Protokoll, wenn Redakteur*innen nur "example.com" eingeben.
   Verhindert scheinbar "leere" Links und mixed-content-Warnungen. */
link_default_protocol: 'https',
/* URLs ohne Protokoll beim Einfügen automatisch mit https:// versehen. */
link_assume_external_targets: 'https',
/* Quicklink-Bubble deaktivieren: internen Picker immer über den normalen Dialog öffnen. */
link_quicklink: false,

/* Sicherheits-Hardening für Links:
   Bei target="_blank" automatisch rel="noopener noreferrer" ergänzen.
   TinyMCE-Core setzt nur `noopener` – `noreferrer` verhindert zusätzlich,
   dass der Referrer übertragen wird. Offizieller Hook laut TinyMCE-Doku.
   TinyMCE ruft den Callback mit einem einzigen Objekt (linkAttrs) auf. */
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},

/* FOR-Plugin-Konfigurationen */

/* --- for_a11y: A11y-Linter --- */
/* Warnung bei target="_blank" ohne Hinweistext (Default: true). */
a11y_new_window_warning: true,
/* Einzelne A11y-Checks lassen sich gezielt deaktivieren. */
a11y_rules: {
    'img-missing-alt':       true,
    'img-alt-in-text-link':  true,
    'img-empty-alt-nondeco': true,
    'img-alt-too-long':      true,
    'img-alt-filename':      true,
    'img-alt-redundant':     true,
    'link-generic-text':     true,
    'link-no-accname':       true,
    'link-new-window':       true,
    'link-raw-url':          true,
    'link-duplicate-text':   true,
    'link-file-no-format':   true,
    'heading-empty':         true,
    'heading-skip':          true,
    'heading-allcaps':       true,
    'text-bold-as-heading':  true,
    'list-fake':             true,
    'list-single-item':      true,
    'blank-paragraphs':      true,
    'table-no-th':           true,
    'table-no-caption':      true,
    'table-th-no-scope':     true,
    'iframe-no-title':       true
},
/* Zusätzliche nichtssagende Linktexte (werden angemeckert). */
a11y_generic_link_texts: [
    'hier', 'hier klicken', 'mehr', 'mehr erfahren', 'mehr lesen', 'weiter',
    'weiterlesen', 'mehr infos', 'link', 'diese seite', 'read more', 'click here',
    'more', 'here', 'learn more', 'details'
],

/* --- for_images: Breite / Ausrichtung / Effekte ---
   Die echten Option-Namen lauten imagewidth_presets / imagealign_presets /
   imageeffect_presets (das frühere `for_images_presets` wurde vom Plugin nie
   gelesen und hatte keinen Effekt). */
imagewidth_presets: [
    { label: 'Original',       class: '' },
    { label: 'Klein (25 %)',   class: 'img-width-small' },
    { label: 'Mittel (50 %)',  class: 'img-width-medium' },
    { label: 'Groß (75 %)',    class: 'img-width-large' },
    { label: 'Volle Breite',   class: 'img-width-full' }
],
imagealign_presets: [
    { label: 'Keine',     class: '' },
    { label: 'Links',     class: 'img-align-left' },
    { label: 'Zentriert', class: 'img-align-center' },
    { label: 'Rechts',    class: 'img-align-right' }
],
imageeffect_presets: [
    { label: 'Kein Effekt',    class: '' },
    { label: 'Runde Ecken',    class: 'img-rounded' },
    { label: 'Schatten',       class: 'img-shadow' },
    { label: 'Rahmen',         class: 'img-border' },
    { label: 'Graustufen',     class: 'img-grayscale' }
],

/* Glossar für das for_abbr-Plugin: Wenn der Anzeigetext im
   Abbr-Dialog einer dieser Terms entspricht (case-insensitive),
   werden Langform und ggf. Sprache automatisch vorgeschlagen. */
for_abbr_glossary: [
    { term: 'HTML',  title: 'Hypertext Markup Language',            lang: 'en' },
    { term: 'CSS',   title: 'Cascading Style Sheets',               lang: 'en' },
    { term: 'JS',    title: 'JavaScript',                           lang: 'en' },
    { term: 'WCAG',  title: 'Web Content Accessibility Guidelines', lang: 'en' },
    { term: 'SEO',   title: 'Search Engine Optimization',           lang: 'en' },
    { term: 'CMS',   title: 'Content-Management-System' },
    { term: 'DSGVO', title: 'Datenschutz-Grundverordnung' },
    { term: 'z. B.', title: 'zum Beispiel' },
    { term: 'd. h.', title: 'das heißt' },
    { term: 'u. a.', title: 'unter anderem' }
],

/* Sprach-Menü (Silver-Theme-Controller `language`).
   Markiert die Auswahl mit dem `lang`-Attribut – wichtig für
   Screenreader (Aussprachewechsel) und SEO. */
content_langs: [
    { title: 'Deutsch',           code: 'de' },
    { title: 'Englisch (UK)',     code: 'en-GB' },
    { title: 'Englisch (USA)',    code: 'en-US' },
    { title: 'Französisch',       code: 'fr' },
    { title: 'Italienisch',       code: 'it' },
    { title: 'Spanisch',          code: 'es' }
],

/* Autoreplace: Live-Ersetzung beim Tippen (für_chars_symbols).
   Ausgelöst durch Space, Enter und Satzzeichen. Greift nicht in
   <code>/<pre>/<kbd>/<samp>/<tt>. Alle Ersetzungen sind Undo-fähig. */
for_chars_symbols_autoreplace: true,
/* Defaults (32 Regeln) sind aktiv: (c)→©, (r)→®, (tm)→™, (p)→℗,
   ...→…, ->→→, <-→←, ==>→⇒, <=>→⇔, +/-→±, !=→≠, <=→≤, >=→≥, ~=→≈,
   1/2→½, 1/4→¼, 3/4→¾, 1/3→⅓, 2/3→⅔, Ziffer^Ziffer → Superscript … */
for_chars_symbols_autoreplace_defaults: true,
/* Eigene Beispiel-Regeln für die Demo – dürfen beliebig erweitert werden.
   Kurzform, Objektform und Regex (mit Backrefs) sind mischbar. */
for_chars_symbols_autoreplace_rules: [
    /* Kurzform: [from, to] */
    ['(r)', '®'],
    /* Objektform */
    { from: '-->', to: '→' },
    { from: '<--', to: '←' },
    /* Regex mit Backreference: (KW1) … (KW52) → „KW 1" … „KW 52" */
    { re: '\\(kw(\\d{1,2})\\)', to: 'KW $1' },
    /* Telefon-Kurzschreibweise */
    { from: '(tel)', to: '+49\u00A0(0)\u00A0…' }
],

skin: redaxo.theme.current === 'dark' ? 'oxide-dark' : 'oxide',
content_css: redaxo.theme.current === 'dark' ? 'dark' : 'default',

file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
}
EXTRA;
    }
}
