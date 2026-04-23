
const tinyExternalPlugins = {};
const tinyCleanPasteConfig = {"strip_ms_office":true,"strip_google_docs":true,"remove_styles":true,"preserve_styles":[],"remove_classes":false,"preserve_classes":[],"remove_ids":true,"remove_data_attrs":true,"max_br":2,"max_empty_paragraphs":2,"allowed_tags":[]};
const tinyMediaUploadConfig = {"enabled":false,"default_category":-1,"upload_url":"index.php?rex-api-call=tinymce_media_upload","categories_url":"index.php?rex-api-call=tinymce_media_categories"};
const tinyprofiles = {"full":{toolbar_sticky: true,
toolbar_sticky_offset: 0,
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save snippets for_images link_yform phonelink quote for_htmlembed for_oembed',
external_plugins: {"snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js","for_images":"/assets/addons/tinymce/scripts/tinymce/plugins/for_images/plugin.min.js","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js","for_htmlembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_htmlembed/plugin.min.js","for_oembed":"/assets/addons/tinymce/scripts/tinymce/plugins/for_oembed/plugin.min.js"},
toolbar: 'blocks | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample fontsize align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime | link_yform phonelink quote snippets',
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
},"69e9d9d72b540":"69e9d9d72b540"},"light":{license_key: 'gpl',
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
,"69e9d9d72b542":"69e9d9d72b542"},"default":{license_key: 'gpl',
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
content_css: redaxo.theme.current === "dark" ? "dark" : "default","69e9d9d72b544":"69e9d9d72b544"},"demo":{license_key: 'gpl',
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

plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y for_markdown cleanpaste mediapaste link_yform phonelink quote',

toolbar: 'styles | undo redo | bold italic underline strikethrough subscript superscript | forecolor backcolor removeformat | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | for_images for_oembed for_video | link link_yform phonelink | quote for_htmlembed for_checklist for_checklist_feature | for_footnote_insert for_footnote_update for_toc_insert for_toc_update | for_markdown_paste | for_a11y | table charmap emoticons hr | snippets | fullscreen preview code help',

menu: {
    file: { title: 'Datei', items: 'preview print' },
    edit: { title: 'Bearbeiten', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
    view: { title: 'Ansicht', items: 'visualaid visualchars visualblocks | preview fullscreen' },
    insert: {
        title: 'Einfügen',
        items: 'for_images for_oembed for_video for_htmlembed | link anchor | for_checklist for_checklist_feature for_footnote for_toc | for_markdown_paste | snippets | charmap emoticons codesample inserttable | hr pagebreak nonbreaking | insertdatetime'
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
},"69e9d9d72b546":"69e9d9d72b546"}};
