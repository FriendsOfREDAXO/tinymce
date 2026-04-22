
const tinyExternalPlugins = {};
const tinyCleanPasteConfig = {"strip_ms_office":true,"strip_google_docs":true,"remove_styles":true,"preserve_styles":[],"remove_classes":true,"preserve_classes":["uk-heading-small"],"remove_ids":true,"remove_data_attrs":true,"max_br":2,"max_empty_paragraphs":2,"allowed_tags":[]};
const tinyMediaUploadConfig = {"enabled":true,"default_category":-1,"upload_url":"index.php?rex-api-call=tinymce_media_upload","categories_url":"index.php?rex-api-call=tinymce_media_categories"};
const tinyprofiles = {"full":{toolbar_sticky: true,
toolbar_sticky_offset: 0,
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
quickbars_insert_toolbar: 'quickimage quicktable',
menu: {
  insert: { title: 'Einfügen', items: 'for_oembed for_video for_htmlembed for_checklist for_checklist_feature for_footnote for_a11y' }
},
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize autosave importcss quickbars snippets for_images redaxo_snippets link_yform phonelink quote cleanpaste mediapaste for_footnotes for_checklist for_htmlembed for_oembed for_video for_a11y for_toc writeassist_translate writeassist_generate',
external_plugins: {"snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js","redaxo_snippets":"/assets/addons/snippets/js/tinymce-snippets.js","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js","cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js","for_toc":"/assets/addons/tinymce/scripts/tinymce/plugins/for_toc/plugin.min.js","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js","writeassist_generate":"/assets/addons/writeassist/js/tinymce-generate-plugin.js"},
toolbar: 'undo for_toc_update for_toc_insert redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen',
height: 400,

image_caption: true,
image_uploadtab: false,
powerpaste_word_import: "clean",
powerpaste_html_import: "merge",
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
},"69e938c8e5991":"69e938c8e5991"},"light":{toolbar_sticky: true,
toolbar_sticky_offset: 0,
license_key: 'gpl',
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
,"69e938c8e5993":"69e938c8e5993"},"default":{toolbar_sticky: true,
toolbar_sticky_offset: 0,
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
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
content_css: redaxo.theme.current === "dark" ? "dark" : "default","69e938c8e5995":"69e938c8e5995"},"test":{toolbar_sticky: true,
toolbar_sticky_offset: 0,
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
menu: {
  insert: { title: 'Einfügen', items: 'for_oembed for_video for_htmlembed for_checklist for_checklist_feature for_footnote for_a11y image media codesample inserttable pagebreak' }
},
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize autosave importcss quickbars snippets for_images redaxo_snippets link_yform phonelink quote cleanpaste mediapaste for_footnotes for_checklist for_htmlembed for_oembed for_video for_a11y writeassist_translate writeassist_generate',
external_plugins: {"snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js","redaxo_snippets":"/assets/addons/snippets/js/tinymce-snippets.js","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js","cleanpaste":"/assets/addons/tinymce/scripts/tinymce/plugins/cleanpaste/plugin.min.js","mediapaste":"/assets/addons/tinymce/scripts/tinymce/plugins/mediapaste/plugin.min.js","for_footnotes":"/assets/addons/tinymce/scripts/tinymce/plugins/for_footnotes/plugin.min.js","for_checklist":"/assets/addons/tinymce/scripts/tinymce/plugins/for_checklist/plugin.min.js","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js","for_video":"/assets/addons/tinymce/scripts/tinymce/plugins/for_video/plugin.min.js","for_a11y":"/assets/addons/tinymce/scripts/tinymce/plugins/for_a11y/plugin.min.js","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js","writeassist_generate":"/assets/addons/writeassist/js/tinymce-generate-plugin.js"},
toolbar: 'for_a11y undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen for_a11y for_video for_oembed for_htmlembed for_checklist_feature for_checklist for_footnote_update for_footnote_insert',
height: 400,

image_caption: true,
image_uploadtab: false,
powerpaste_word_import: "clean",
powerpaste_html_import: "merge",
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
},"69e938c8e5997":"69e938c8e5997"},"demo":{license_key: 'gpl',
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

plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y cleanpaste mediapaste link_yform phonelink quote',

toolbar: 'styles | undo redo | bold italic underline strikethrough subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | for_images for_oembed for_video | link link_yform phonelink | quote for_htmlembed for_checklist for_checklist_feature | for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_a11y | table charmap emoticons hr | snippets | fullscreen preview code help',

menu: {
    file: { title: 'Datei', items: 'preview print' },
    edit: { title: 'Bearbeiten', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
    view: { title: 'Ansicht', items: 'visualaid visualchars visualblocks | preview fullscreen' },
    insert: {
        title: 'Einfügen',
        items: 'for_images for_oembed for_video for_htmlembed | link anchor | for_checklist for_checklist_feature for_footnote for_toc | snippets | charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime'
    },
    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat' },
    tools: { title: 'Werkzeuge', items: 'wordcount for_a11y | code' },
    table: { title: 'Tabelle', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
},

quickbars_selection_toolbar: 'bold italic underline | forecolor | link',
quickbars_insert_toolbar: 'for_images for_oembed for_video | for_checklist for_footnote_insert | hr',
quickbars_image_toolbar: false,

contextmenu: 'link image table for_a11y',

image_caption: true,
image_advtab: true,
image_uploadtab: false,

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
},"69e938c8e5999":"69e938c8e5999"}};
