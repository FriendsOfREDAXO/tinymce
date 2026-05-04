
const tinyExternalPlugins = {};
const tinyCleanPasteConfig = {"strip_ms_office":true,"strip_google_docs":true,"remove_styles":false,"preserve_styles":[],"remove_classes":true,"preserve_classes":[],"remove_ids":true,"remove_data_attrs":true,"max_br":2,"max_empty_paragraphs":2,"allowed_tags":[]};
const tinyMediaUploadConfig = {"enabled":true,"default_category":-1,"upload_url":"index.php?rex-api-call=tinymce_media_upload","categories_url":"index.php?rex-api-call=tinymce_media_categories"};
const tinyprofiles = {"full":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
plugins: 'advlist anchor autolink charmap code codesample directionality emoticons fullscreen help image insertdatetime link link_yform lists media nonbreaking pagebreak phonelink preview quote save searchreplace snippets table visualblocks visualchars wordcount',
external_plugins: {"link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.6.2","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.6.2","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js?v=8.6.2","snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js?v=8.6.2"},
toolbar: 'blocks | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample fontsize align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime | link_yform phonelink quote snippets',
for_chars_symbols_disable_emoticons: true,
height: 400,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: true,

codesample_languages: [
 {text: 'HTML/XML', value: 'markup'},
 {text: 'JavaScript', value: 'javascript'},
 {text: 'CSS', value: 'css'},
 {text: 'PHP', value: 'php'},
 {text: 'Ruby', value: 'ruby'},
 {text: 'Python', value: 'python'},
 {text: 'Java', value: 'java'},
 {text: 'C', value: 'c'},
 {text: 'C#', value: 'csharp'},
 {text: 'C++', value: 'cpp'}
],
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
toc_depth: 3,
toc_header: "div",
toc_class: "our-toc",

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
setup: function (editor) {
},
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},"69f7868a607ea":"69f7868a607ea"},"light":{license_key: 'gpl',
relative_urls : false,
remove_script_host : true,
document_base_url : '/',
convert_urls : true,
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
 if (!attrs || attrs.target !== '_blank') { return; }
 var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
 if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
 if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
 attrs.rel = rel.join(' ');
},
language: 'de',
allow_script_urls: true,
branding: false,
statusbar: true,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'autolink directionality visualblocks visualchars fullscreen image link media charmap pagebreak nonbreaking code',
toolbar: 'blocks |  bold italic subscript superscript | blockquote bullist numlist | charmap nonbreaking | link unlink | image | removeformat code | undo redo | cut copy paste pastetext wordcount',
height: 400,
charmap_append: [
 [160, 'no-break space'],
 [173, 'soft hyphen']
],
paste_as_text: true,
entity_encoding: 'raw',
style_formats: [
 {title: 'Überschriften', items: [
   {title: 'Überschrift 1', format: 'h1'},
   {title: 'Überschrift 2', format: 'h2'},
   {title: 'Überschrift 3', format: 'h3'},
   {title: 'Überschrift 4', format: 'h4'},
   {title: 'Überschrift 5', format: 'h5'}
 ]}
]
,"69f7868a607ec":"69f7868a607ec"},"default":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
plugins: 'accordion advlist anchor autolink autosave charmap cleanpaste code codesample directionality emoticons for_a11y for_abbr for_chars_symbols for_checklist for_footnotes for_htmlembed for_images for_markdown for_oembed for_toc for_video fullscreen help image importcss insertdatetime link link_yform lists media mediapaste nonbreaking pagebreak phonelink preview quickbars quote redaxo_snippets save searchreplace snippets table tinymce_uikit_extras visualblocks visualchars wordcount writeassist_generate writeassist_translate',
external_plugins: {"cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js?v=8.6.3","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js?v=8.6.3","for_abbr":"/assets/addons/tinymce/scripts/tinymce/plugins/for_abbr/plugin.min.js?v=8.6.3","for_chars_symbols":"/assets/addons/tinymce/scripts/tinymce/plugins/for_chars_symbols/plugin.min.js?v=8.6.3","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js?v=8.6.3","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js?v=8.6.3","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js?v=8.6.3","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js?v=8.6.3","for_markdown":"/assets/addons/tinymce/scripts/tinymce/plugins/for_markdown/plugin.min.js?v=8.6.3","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js?v=8.6.3","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js?v=8.6.3","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js?v=8.6.3","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.6.3","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js?v=8.6.3","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.6.3","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js?v=8.6.3","redaxo_snippets":"/assets/addons/snippets/js/tinymce-snippets.js?v=8.6.3","snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js?v=8.6.3","tinymce_uikit_extras":"/assets/addons/tinymce_uikit_extras/js/tinymce-uikit-extras-plugin.js?v=8.6.3","writeassist_generate":"/assets/addons/writeassist/js/tinymce-generate-plugin.js?v=8.6.3","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js?v=8.6.3"},
toolbar: 'tinymce_uikit_extras undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen',
height: 400,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: true,

object_resizing: false,
extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',
imagealign_presets: [{"label":"Keine","class":""},{"label":"Links (Text umfließt)","class":"uk-float-left uk-margin-right uk-margin-bottom"},{"label":"Rechts (Text umfließt)","class":"uk-float-right uk-margin-left uk-margin-bottom"},{"label":"Zentriert","class":"uk-display-block uk-margin-auto"}],
imageeffect_presets: [{"label":"Kein Effekt","class":""},{"label":"Schatten klein","class":"uk-box-shadow-small"},{"label":"Schatten mittel","class":"uk-box-shadow-medium"},{"label":"Schatten groß","class":"uk-box-shadow-large"},{"label":"Abgerundet","class":"uk-border-rounded"},{"label":"Rund (Kreis)","class":"uk-border-circle"},{"label":"Rahmen","class":"uk-border"}],
image_compat_warn: true,

codesample_languages: [
 {text: 'HTML/XML', value: 'markup'},
 {text: 'JavaScript', value: 'javascript'},
 {text: 'CSS', value: 'css'},
 {text: 'PHP', value: 'php'},
 {text: 'Ruby', value: 'ruby'},
 {text: 'Python', value: 'python'},
 {text: 'Java', value: 'java'},
 {text: 'C', value: 'c'},
 {text: 'C#', value: 'csharp'},
 {text: 'C++', value: 'cpp'}
],
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
toc_depth: 3,
toc_header: "div",
toc_class: "our-toc",

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
setup: function (editor) {
},
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},"69f7868a607ee":"69f7868a607ee"},"demo":{license_key: 'gpl',
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
},"69f7868a607f0":"69f7868a607f0"},"demo_cloned":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
quickbars_selection_toolbar: 'bold italic underline | forecolor | link for_abbr',
quickbars_insert_toolbar: 'quickimage quicktable',
menu: {
  insert: { title: 'Einfügen', items: 'image for_imagesdialog for_oembed for_video for_htmlembed | link anchor for_abbr | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | for_chars_symbols charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime' }
},
plugins: 'accordion advlist anchor autolink autoresize charmap code codesample emoticons for_a11y for_abbr for_checklist for_footnotes for_htmlembed for_images for_markdown for_oembed for_toc for_video fullscreen image importcss insertdatetime link link_yform lists mediapaste pagebreak phonelink preview quickbars save searchreplace table visualchars wordcount',
external_plugins: {"for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js?v=8.6.2","for_abbr":"/assets/addons/tinymce/scripts/tinymce/plugins/for_abbr/plugin.min.js?v=8.6.2","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js?v=8.6.2","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js?v=8.6.2","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js?v=8.6.2","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js?v=8.6.2","for_markdown":"/assets/addons/tinymce/scripts/tinymce/plugins/for_markdown/plugin.min.js?v=8.6.2","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js?v=8.6.2","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js?v=8.6.2","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js?v=8.6.2","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.6.2","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js?v=8.6.2","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.6.2"},
toolbar: 'for_a11y for_abbr language | undo redo | styles | bold italic underline strikethrough | subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link link_yform phonelink anchor | image for_imagesdialog for_oembed for_video for_htmlembed | quote for_checklist for_checklist_feature for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | table | for_chars_symbols for_chars_symbols_invisibles charmap emoticons hr pagebreak | snippets | searchreplace | fullscreen preview code help',
content_langs: [{"title":"Deutsch","code":"de"},{"title":"Englisch (UK)","code":"en-GB"},{"title":"Englisch (USA)","code":"en-US"},{"title":"Französisch","code":"fr"},{"title":"Italienisch","code":"it"},{"title":"Spanisch","code":"es"}],
for_chars_symbols_disable_emoticons: true,
for_chars_symbols_autoreplace: true,
for_chars_symbols_autoreplace_rules: [{"from":"(r)","to":"®"},{"from":"-->","to":"→"},{"from":"<--","to":"←"},{"re":"\\(kw(\\d{1,2})\\)","to":"KW $1"},{"from":"(tel)","to":"+49 (0) …"}],
min_height: 400,
max_height: 800,
autoresize_bottom_margin: 20,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: true,

object_resizing: false,
extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',
imagealign_presets: [{"label":"Keine","class":""},{"label":"Links","class":"img-align-left"},{"label":"Zentriert","class":"img-align-center"},{"label":"Rechts","class":"img-align-right"}],
imageeffect_presets: [{"label":"Kein Effekt","class":""},{"label":"Runde Ecken","class":"img-rounded"},{"label":"Schatten","class":"img-shadow"},{"label":"Rahmen","class":"img-border"},{"label":"Graustufen","class":"img-grayscale"}],

codesample_languages: [
 {text: 'HTML/XML', value: 'markup'},
 {text: 'JavaScript', value: 'javascript'},
 {text: 'CSS', value: 'css'},
 {text: 'PHP', value: 'php'},
 {text: 'Ruby', value: 'ruby'},
 {text: 'Python', value: 'python'},
 {text: 'Java', value: 'java'},
 {text: 'C', value: 'c'},
 {text: 'C#', value: 'csharp'},
 {text: 'C++', value: 'cpp'}
],
link_rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
 {title: '— Kein Ziel (gleiches Fenster)', value: ''},
 {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
toc_depth: 3,
toc_header: "div",
toc_class: "our-toc",

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
setup: function (editor) {
},
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},"69f7868a607f2":"69f7868a607f2"}};
