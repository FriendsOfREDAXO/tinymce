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

plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y for_markdown for_chars_symbols cleanpaste mediapaste link_yform phonelink quote',

toolbar: 'styles | undo redo | bold italic underline strikethrough subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | for_images for_oembed for_video | link link_yform phonelink | quote for_htmlembed for_checklist for_checklist_feature | for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | for_a11y | table for_chars_symbols for_chars_symbols_invisibles charmap emoticons hr | snippets | fullscreen preview code help',

menu: {
    file: { title: 'Datei', items: 'preview print' },
    edit: { title: 'Bearbeiten', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
    view: { title: 'Ansicht', items: 'visualaid visualchars visualblocks | preview fullscreen' },
    insert: {
        title: 'Einfügen',
        items: 'for_images for_oembed for_video for_htmlembed | link anchor | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | for_chars_symbols charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime'
    },
    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat' },
    tools: { title: 'Werkzeuge', items: 'wordcount for_a11y | code' },
    table: { title: 'Tabelle', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
},

quickbars_selection_toolbar: 'bold italic underline | forecolor | link',
quickbars_insert_toolbar: 'for_images for_oembed for_video | for_checklist for_footnote_insert | hr',

contextmenu: 'link table for_a11y for_chars_symbols',

codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'JSON', value: 'json' },
    { text: 'Bash', value: 'bash' },
    { text: 'SQL', value: 'sql' }
],

rel_list: [
    { title: 'Keine', value: '' },
    { title: 'Nofollow', value: 'nofollow' },
    { title: 'Sponsored', value: 'sponsored' },
    { title: 'UGC', value: 'ugc' }
],

target_list: [
    { title: 'Gleiches Fenster', value: '' },
    { title: 'Neues Fenster', value: '_blank' }
],

/* FOR-Plugin-Konfigurationen */
a11y_new_window_warning: true,

for_images_presets: [
    { value: 'img-25',  text: '25 %' },
    { value: 'img-33',  text: '33 %' },
    { value: 'img-50',  text: '50 %' },
    { value: 'img-66',  text: '66 %' },
    { value: 'img-100', text: '100 %' }
],

skin: redaxo.theme.current === 'dark' ? 'oxide-dark' : 'oxide',
content_css: redaxo.theme.current === 'dark' ? 'dark' : 'default',

file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
}
EXTRA;
    }
}
