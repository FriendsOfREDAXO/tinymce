
const tinyExternalPlugins = {};
const tinyAssetBasePath = "/assets/addons/tinymce";
const tinyPluginBasePath = "/assets/addons/tinymce/scripts/tinymce/plugins";
const tinyCleanPasteConfig = {"strip_ms_office":true,"strip_google_docs":true,"remove_styles":true,"preserve_styles":[],"remove_classes":true,"preserve_classes":[],"remove_ids":true,"remove_data_attrs":true,"max_br":2,"max_empty_paragraphs":2,"allowed_tags":[],"clean_internal_paste":false};
const tinyMediaUploadConfig = {"enabled":false,"allow_image_paste":false,"default_category":-1,"upload_url":"index.php?rex-api-call=tinymce_media_upload","categories_url":"index.php?rex-api-call=tinymce_media_categories"};
const tinyprofiles = {"full":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y for_markdown for_chars_symbols for_abbr cleanpaste mediapaste link_yform phonelink quote',
toolbar: 'for_chars_symbols for_a11y | undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image imagewidthdialog for_oembed for_video for_htmlembed table codesample accordion | for_checklist for_footnote_insert for_toc_insert for_markdown_paste | removeformat code fullscreen',
min_height: 400,
max_height: 700,
autoresize_bottom_margin: 20,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: '/',
entity_encoding: 'raw',
convert_urls: false,
object_resizing: false,
link_rel_list: [
    {title: 'Keine', value: ''},
    {title: 'Nofollow', value: 'nofollow'},
    {title: 'Sponsored', value: 'sponsored'}
],
link_target_list: [
    {title: '— Kein Ziel (gleiches Fenster)', value: ''},
    {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: false,
link_quicklink: false,
quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},"6a97ffec90c7b":"6a97ffec90c7b"},"light":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
quickbars_selection_toolbar: 'bold italic | link h2 h3 | blockquote alignleft alignright | for_a11y',
quickbars_insert_toolbar: false,
plugins: 'advlist autolink charmap cleanpaste code directionality fullscreen image link link_yform lists nonbreaking phonelink quickbars visualblocks visualchars',
external_plugins: {"cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js?v=8.9.0-1778367116","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.9.0-1778367116","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.9.0-1778367116"},
toolbar: false,
height: 300,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: false,

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
link_assume_external_targets: false,
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
},
toolbar_sticky: true,
toolbar_sticky_offset: 0,
paste_as_text: true,
link_quicklink: false,"6a97ffec90c83":"6a97ffec90c83"},"demo":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
quickbars_selection_toolbar: 'bold italic underline | forecolor | link for_abbr stylesets',
quickbars_insert_toolbar: 'quickimage quicktable',
menu: {
  insert: { title: 'Insert', items: 'image imagewidthdialog for_oembed for_video for_htmlembed | link anchor for_abbr | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | for_chars_symbols charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime' }
},
plugins: 'accordion advlist anchor autolink autoresize charmap cleanpaste code codesample directionality emoticons for_a11y for_abbr for_chars_symbols for_checklist for_footnotes for_htmlembed for_images for_markdown for_oembed for_toc for_video fullscreen help image importcss insertdatetime link link_yform lists mediapaste nonbreaking pagebreak phonelink preview quickbars quote save searchreplace snippets table visualblocks visualchars wordcount',
external_plugins: {"cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js?v=8.9.0-1778514419","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js?v=8.9.0-1778508557","for_abbr":"/assets/addons/tinymce/scripts/tinymce/plugins/for_abbr/plugin.min.js?v=8.9.0-1778508558","for_chars_symbols":"/assets/addons/tinymce/scripts/tinymce/plugins/for_chars_symbols/plugin.min.js?v=8.9.0-1778508558","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js?v=8.9.0-1778508558","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js?v=8.9.0-1778508559","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js?v=8.9.0-1778508559","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js?v=8.9.0-1778514129","for_markdown":"/assets/addons/tinymce/scripts/tinymce/plugins/for_markdown/plugin.min.js?v=8.9.0-1778508560","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js?v=8.9.0-1778508560","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js?v=8.9.0-1778508560","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js?v=8.9.0-1778508561","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.9.0-1778508561","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js?v=8.9.0-1778508561","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.9.0-1778508562","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js?v=8.9.0-1778508562","snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js?v=8.9.0-1778508562"},
toolbar: 'stylesets for_a11y for_abbr language | undo redo | blocks | bold italic underline strikethrough | subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link link_yform phonelink anchor | image imagewidthdialog for_oembed for_video for_htmlembed | quote for_checklist for_checklist_feature for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | table accordion | visualblocks visualchars | for_chars_symbols for_chars_symbols_invisibles charmap emoticons hr pagebreak | snippets | searchreplace | fullscreen preview code help',
toolbar_mode: 'sliding',
content_langs: [{"title":"Deutsch","code":"de"},{"title":"Englisch (UK)","code":"en-GB"},{"title":"Englisch (USA)","code":"en-US"},{"title":"Französisch","code":"fr"},{"title":"Italienisch","code":"it"},{"title":"Spanisch","code":"es"}],
for_chars_symbols_autoreplace: true,
for_chars_symbols_autoreplace_rules: [{"from":"(r)","to":"®"},{"from":"-->","to":"→"},{"from":"<--","to":"←"},{"re":"\\(kw(\\d{1,2})\\)","to":"KW $1"},{"from":"(tel)","to":"+49 (0) …"}],
min_height: 400,
autoresize_bottom_margin: 20,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: false,

object_resizing: false,
extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',
imagewidth_presets: [{"label":"Original","class":""},{"label":"Klein (25 %)","class":"img-width-small"},{"label":"Mittel (50 %)","class":"img-width-medium"},{"label":"Groß (75 %)","class":"img-width-large"},{"label":"Volle Breite","class":"img-width-full"}],
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
link_assume_external_targets: false,
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
table_toolbar: 'tableprops tablecellprops tablecellvalign | tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
table_appearance_options: true,
table_advtab: true,
table_row_advtab: true,
table_cell_advtab: true,

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
setup: function (editor) {
},
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},
toolbar_sticky: true,
toolbar_sticky_offset: 0,
contextmenu: 'link table for_a11y | for_chars_symbols for_abbr',
/* Quicklink-Bubble deaktivieren: internen Picker immer über den normalen Dialog öffnen. */
link_quicklink: false,
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
],"6a97ffec90c8f":"6a97ffec90c8f"},"default":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
quickbars_selection_toolbar: 'bold italic underline | forecolor | link for_abbr stylesets',
quickbars_insert_toolbar: 'quickimage quicktable',
menu: {
  insert: { title: 'Insert', items: 'image imagewidthdialog for_oembed for_video for_htmlembed | link anchor for_abbr | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | for_chars_symbols charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime' }
},
plugins: 'accordion advlist anchor autolink autoresize charmap cleanpaste code codesample directionality emoticons for_a11y for_abbr for_chars_symbols for_checklist for_footnotes for_htmlembed for_images for_markdown for_oembed for_toc for_video fullscreen help image importcss insertdatetime link link_yform lists mediapaste nonbreaking pagebreak phonelink preview quickbars quote save searchreplace snippets table visualblocks visualchars wordcount',
external_plugins: {"cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js?v=8.9.0-1778514419","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js?v=8.9.0-1778508557","for_abbr":"/assets/addons/tinymce/scripts/tinymce/plugins/for_abbr/plugin.min.js?v=8.9.0-1778508558","for_chars_symbols":"/assets/addons/tinymce/scripts/tinymce/plugins/for_chars_symbols/plugin.min.js?v=8.9.0-1778508558","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js?v=8.9.0-1778508558","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js?v=8.9.0-1778508559","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js?v=8.9.0-1778508559","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js?v=8.9.0-1778514129","for_markdown":"/assets/addons/tinymce/scripts/tinymce/plugins/for_markdown/plugin.min.js?v=8.9.0-1778508560","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js?v=8.9.0-1778508560","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js?v=8.9.0-1778508560","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js?v=8.9.0-1778508561","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.9.0-1778508561","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js?v=8.9.0-1778508561","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.9.0-1778508562","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js?v=8.9.0-1778508562","snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js?v=8.9.0-1778508562"},
toolbar: 'stylesets for_a11y for_abbr language | undo redo | blocks | bold italic underline strikethrough | subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | link link_yform phonelink anchor | image imagewidthdialog for_oembed for_video for_htmlembed | quote for_checklist for_checklist_feature for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | table accordion | visualblocks visualchars | for_chars_symbols for_chars_symbols_invisibles charmap emoticons hr pagebreak | snippets | searchreplace | fullscreen preview code help',
toolbar_mode: 'sliding',
content_langs: [{"title":"Deutsch","code":"de"},{"title":"Englisch (UK)","code":"en-GB"},{"title":"Englisch (USA)","code":"en-US"},{"title":"Französisch","code":"fr"},{"title":"Italienisch","code":"it"},{"title":"Spanisch","code":"es"}],
for_chars_symbols_autoreplace: true,
for_chars_symbols_autoreplace_rules: [{"from":"(r)","to":"®"},{"from":"-->","to":"→"},{"from":"<--","to":"←"},{"re":"\\(kw(\\d{1,2})\\)","to":"KW $1"},{"from":"(tel)","to":"+49 (0) …"}],
min_height: 400,
autoresize_bottom_margin: 20,

image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: false,

object_resizing: false,
extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',
imagewidth_presets: [{"label":"Original","class":""},{"label":"Klein (25 %)","class":"img-width-small"},{"label":"Mittel (50 %)","class":"img-width-medium"},{"label":"Groß (75 %)","class":"img-width-large"},{"label":"Volle Breite","class":"img-width-full"}],
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
link_assume_external_targets: false,
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
},
toolbar_sticky: true,
toolbar_sticky_offset: 0,
contextmenu: 'link table for_a11y | for_chars_symbols for_abbr',
/* Quicklink-Bubble deaktivieren: internen Picker immer über den normalen Dialog öffnen. */
link_quicklink: false,
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
],"6a97ffec90c9a":"6a97ffec90c9a"}};
