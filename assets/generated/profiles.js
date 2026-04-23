
const tinyExternalPlugins = {};
const tinyCleanPasteConfig = {"strip_ms_office":true,"strip_google_docs":true,"remove_styles":true,"preserve_styles":[],"remove_classes":true,"preserve_classes":[],"remove_ids":true,"remove_data_attrs":true,"max_br":2,"max_empty_paragraphs":2,"allowed_tags":[]};
const tinyMediaUploadConfig = {"enabled":false,"default_category":-1,"upload_url":"index.php?rex-api-call=tinymce_media_upload","categories_url":"index.php?rex-api-call=tinymce_media_categories"};
const tinyprofiles = {"full":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
plugins: 'accordion advlist anchor autolink autoresize autosave charmap cleanpaste code codesample directionality emoticons for_a11y for_a11y_image_maps for_checklist for_footnotes for_htmlembed for_images for_markdown for_oembed for_toc for_video fullscreen help image importcss insertdatetime link link_yform lists media mediapaste nonbreaking pagebreak phonelink preview quickbars quote redaxo_snippets save searchreplace snippets table visualblocks visualchars wordcount writeassist_generate writeassist_translate',
external_plugins: {"cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js?v=8.4.2","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js?v=8.4.2","for_a11y_image_maps":"/assets/addons/for_a11y_image_maps/js/tinymce-a11y-image-maps-plugin.js?v=8.4.2","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js?v=8.4.2","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js?v=8.4.2","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js?v=8.4.2","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js?v=8.4.2","for_markdown":"/assets/addons/tinymce/scripts/tinymce/plugins/for_markdown/plugin.min.js?v=8.4.2","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js?v=8.4.2","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js?v=8.4.2","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js?v=8.4.2","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js?v=8.4.2","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js?v=8.4.2","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js?v=8.4.2","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js?v=8.4.2","redaxo_snippets":"/assets/addons/snippets/js/tinymce-snippets.js?v=8.4.2","snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js?v=8.4.2","writeassist_generate":"/assets/addons/writeassist/js/tinymce-generate-plugin.js?v=8.4.2","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js?v=8.4.2"},
toolbar: 'for_a11y_image_maps mediapaste undo for_toc_insert redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen',
min_height: 400,
max_height: 600,
autoresize_bottom_margin: 20,

image_caption: true,
image_uploadtab: true,
relative_urls: false,
remove_script_host: true,
document_base_url: "/",
entity_encoding: 'raw',
convert_urls: true,

object_resizing: false,
quickbars_image_toolbar: false,
extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',
imagealign_presets: [{"label":"Keine","class":""},{"label":"Links (Text umfließt)","class":"uk-float-left uk-margin-right uk-margin-bottom"},{"label":"Rechts (Text umfließt)","class":"uk-float-right uk-margin-left uk-margin-bottom"},{"label":"Zentriert","class":"uk-display-block uk-margin-auto"}],
imageeffect_presets: [{"label":"Kein Effekt","class":""},{"label":"Schatten klein","class":"uk-box-shadow-small"},{"label":"Schatten mittel","class":"uk-box-shadow-medium"},{"label":"Schatten groß","class":"uk-box-shadow-large"},{"label":"Abgerundet","class":"uk-border-rounded"},{"label":"Rund (Kreis)","class":"uk-border-circle"},{"label":"Rahmen","class":"uk-border"}],

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
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
toc_depth: 3,
toc_header: "div",
toc_class: "our-toc",

skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
setup: function (editor) {
},
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},"69ea646c43ca5":"69ea646c43ca5"},"light":{license_key: 'gpl',
relative_urls : false,
remove_script_host : true,
document_base_url : '/',
convert_urls : true,
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],
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
,"69ea646c43ca7":"69ea646c43ca7"},"default":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample charmap nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code link_yform phonelink quote',
toolbar1: 'undo redo | cut copy paste pastetext | bold italic underline strikethrough subscript superscript removeformat | link anchor | image emoticons charmap nonbreaking | link_yform phonelink quote',
toolbar2: 'blocks | fontsize | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | code fullscreen searchreplace',
height: 400,
image_caption: true,
image_uploadtab: false,
powerpaste_word_import: "clean",
powerpaste_html_import: "merge",
entity_encoding: 'raw',
relative_urls : false,
remove_script_host : true,
document_base_url : "/",
convert_urls : true,
rel_list: [
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'},
 {title: 'Sponsored', value: 'sponsored'}
],
file_picker_callback: function (callback, value, meta) {
 rex5_picker_function(callback, value, meta);
},
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default","69ea646c43ca9":"69ea646c43ca9"},"demo":{license_key: 'gpl',
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

toolbar: 'styles | undo redo | bold italic underline strikethrough subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | for_images for_oembed for_video | link link_yform phonelink | quote for_htmlembed for_checklist for_checklist_feature | for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | for_a11y | table for_chars_symbols charmap emoticons hr | snippets | fullscreen preview code help',

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

contextmenu: 'link table for_a11y',

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
},"69ea646c43cab":"69ea646c43cab"}};
