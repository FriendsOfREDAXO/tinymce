
const tinyExternalPlugins = {};
const tinyprofiles = {"full":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize autosave importcss quickbars snippets link_yform phonelink quote writeassist_translate',
external_plugins: {"snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js"},
toolbar: 'writeassist_translate undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen',
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
 {title: 'None', value: ''},
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
},"6934bb49e9cfe":"6934bb49e9cfe"},"light":{license_key: 'gpl',
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
,"6934bb49e9d01":"6934bb49e9d01"},"default":{license_key: 'gpl',
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
content_css: redaxo.theme.current === "dark" ? "dark" : "default","6934bb49e9d03":"6934bb49e9d03"},"uikit2":{license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize autosave importcss quickbars snippets link_yform phonelink quote writeassist_translate',
external_plugins: {"snippets":"/assets/addons/tinymce/scripts/tinymce/plugins/snippets/plugin.min.js","link_yform":"/assets/addons/tinymce/scripts/tinymce/plugins/link_yform/plugin.min.js","phonelink":"/assets/addons/tinymce/scripts/tinymce/plugins/phonelink/plugin.min.js","quote":"/assets/addons/tinymce/scripts/tinymce/plugins/quote/plugin.min.js","writeassist_translate":"/assets/addons/writeassist/js/tinymce-deepl-plugin.js"},
toolbar: 'undo redo | writeassist_translate blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen snippets',
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
 {title: 'None', value: ''},
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
},
content_css: ["https:\/\/cdn.jsdelivr.net\/npm\/uikit@3.17.11\/dist\/css\/uikit.min.css", redaxo.theme.current === "dark" ? "dark" : "default"],
content_style: "body { outline: none !important; box-shadow: none !important; } :focus { outline: none !important; box-shadow: none !important; }",
style_formats: [{"title":"\u00dcberschriften","items":[{"title":"Heading Primary","block":"h1","classes":"uk-heading-primary"},{"title":"Heading Hero","block":"h1","classes":"uk-heading-hero"},{"title":"Heading Divider","block":"h2","classes":"uk-heading-divider"},{"title":"Heading Bullet","block":"h3","classes":"uk-heading-bullet"},{"title":"Heading Line","block":"h3","classes":"uk-heading-line"}]},{"title":"Text","items":[{"title":"Lead Text","block":"p","classes":"uk-text-lead"},{"title":"Meta Text","block":"p","classes":"uk-text-meta"},{"title":"Drop Cap","block":"p","classes":"uk-dropcap"},{"title":"Gr\u00f6\u00dfe","items":[{"title":"Small","inline":"span","classes":"uk-text-small"},{"title":"Default","inline":"span","classes":"uk-text-default"},{"title":"Large","inline":"span","classes":"uk-text-large"}]},{"title":"Stil","items":[{"title":"Bold","inline":"span","classes":"uk-text-bold"},{"title":"Italic","inline":"span","classes":"uk-text-italic"},{"title":"Light","inline":"span","classes":"uk-text-light"},{"title":"Normal","inline":"span","classes":"uk-text-normal"},{"title":"Lighter","inline":"span","classes":"uk-text-lighter"},{"title":"Bolder","inline":"span","classes":"uk-text-bolder"}]},{"title":"Transformation","items":[{"title":"Capitalize","inline":"span","classes":"uk-text-capitalize"},{"title":"Uppercase","inline":"span","classes":"uk-text-uppercase"},{"title":"Lowercase","inline":"span","classes":"uk-text-lowercase"}]},{"title":"Farbe","items":[{"title":"Muted","inline":"span","classes":"uk-text-muted"},{"title":"Emphasis","inline":"span","classes":"uk-text-emphasis"},{"title":"Primary","inline":"span","classes":"uk-text-primary"},{"title":"Secondary","inline":"span","classes":"uk-text-secondary"},{"title":"Success","inline":"span","classes":"uk-text-success"},{"title":"Warning","inline":"span","classes":"uk-text-warning"},{"title":"Danger","inline":"span","classes":"uk-text-danger"},{"title":"Background","inline":"span","classes":"uk-text-background"}]},{"title":"Ausrichtung","items":[{"title":"Left","block":"div","classes":"uk-text-left"},{"title":"Center","block":"div","classes":"uk-text-center"},{"title":"Right","block":"div","classes":"uk-text-right"},{"title":"Justify","block":"div","classes":"uk-text-justify"}]},{"title":"Umbruch","items":[{"title":"Truncate","block":"div","classes":"uk-text-truncate"},{"title":"Break","block":"div","classes":"uk-text-break"},{"title":"No Wrap","block":"div","classes":"uk-text-nowrap"}]}]},{"title":"Utility","items":[{"title":"Float Left","block":"div","classes":"uk-float-left"},{"title":"Float Right","block":"div","classes":"uk-float-right"},{"title":"Clearfix","block":"div","classes":"uk-clearfix"},{"title":"Display Block","block":"div","classes":"uk-display-block"},{"title":"Display Inline","inline":"span","classes":"uk-display-inline"},{"title":"Display Inline-Block","block":"div","classes":"uk-display-inline-block"},{"title":"Overflow Hidden","block":"div","classes":"uk-overflow-hidden"},{"title":"Overflow Auto","block":"div","classes":"uk-overflow-auto"}]},{"title":"Listen","items":[{"title":"Liste (Disc)","selector":"ul","classes":"uk-list uk-list-disc"},{"title":"Liste (Circle)","selector":"ul","classes":"uk-list uk-list-circle"},{"title":"Liste (Square)","selector":"ul","classes":"uk-list uk-list-square"},{"title":"Liste (Decimal)","selector":"ol","classes":"uk-list uk-list-decimal"},{"title":"Liste (Divider)","selector":"ul,ol","classes":"uk-list uk-list-divider"},{"title":"Liste (Striped)","selector":"ul,ol","classes":"uk-list uk-list-striped"}]},{"title":"Buttons","items":[{"title":"Button Default","inline":"a","classes":"uk-button uk-button-default"},{"title":"Button Primary","inline":"a","classes":"uk-button uk-button-primary"},{"title":"Button Secondary","inline":"a","classes":"uk-button uk-button-secondary"},{"title":"Button Danger","inline":"a","classes":"uk-button uk-button-danger"},{"title":"Button Text","inline":"a","classes":"uk-button uk-button-text"},{"title":"Button Link","inline":"a","classes":"uk-button uk-button-link"},{"title":"Button Small","inline":"a","classes":"uk-button uk-button-small"},{"title":"Button Large","inline":"a","classes":"uk-button uk-button-large"}]},{"title":"Badges & Labels","items":[{"title":"Badge","inline":"span","classes":"uk-badge"},{"title":"Label","inline":"span","classes":"uk-label"},{"title":"Label Success","inline":"span","classes":"uk-label uk-label-success"},{"title":"Label Warning","inline":"span","classes":"uk-label uk-label-warning"},{"title":"Label Danger","inline":"span","classes":"uk-label uk-label-danger"}]},{"title":"Images","items":[{"title":"Rounded","selector":"img","classes":"uk-border-rounded"},{"title":"Circle","selector":"img","classes":"uk-border-circle"},{"title":"Shadow Small","selector":"img","classes":"uk-box-shadow-small"},{"title":"Shadow Medium","selector":"img","classes":"uk-box-shadow-medium"},{"title":"Shadow Large","selector":"img","classes":"uk-box-shadow-large"},{"title":"Shadow Hover","selector":"img","classes":"uk-box-shadow-hover-medium"}]},{"title":"Backgrounds","items":[{"title":"Muted","block":"div","classes":"uk-background-muted uk-padding"},{"title":"Primary","block":"div","classes":"uk-background-primary uk-light uk-padding"},{"title":"Secondary","block":"div","classes":"uk-background-secondary uk-light uk-padding"}]},{"title":"Tables","items":[{"title":"Striped","selector":"table","classes":"uk-table uk-table-striped"},{"title":"Hover","selector":"table","classes":"uk-table uk-table-hover"},{"title":"Divider","selector":"table","classes":"uk-table uk-table-divider"},{"title":"Small","selector":"table","classes":"uk-table uk-table-small"}]},{"title":"Bl\u00f6cke","items":[{"title":"Alert (Primary)","block":"div","classes":"uk-alert-primary","attributes":{"uk-alert":""}},{"title":"Alert (Success)","block":"div","classes":"uk-alert-success","attributes":{"uk-alert":""}},{"title":"Alert (Warning)","block":"div","classes":"uk-alert-warning","attributes":{"uk-alert":""}},{"title":"Alert (Danger)","block":"div","classes":"uk-alert-danger","attributes":{"uk-alert":""}},{"title":"Card (Default)","block":"div","classes":"uk-card uk-card-default uk-card-body"},{"title":"Card (Primary)","block":"div","classes":"uk-card uk-card-primary uk-card-body"},{"title":"Card (Secondary)","block":"div","classes":"uk-card uk-card-secondary uk-card-body"}]}],
toolbar: "styles undo redo | writeassist_translate blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image media table codesample accordion | removeformat code fullscreen snippets",
plugins: "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize autosave importcss quickbars snippets link_yform phonelink quote writeassist_translate",
external_plugins: {"snippets":"/assets/addons/tinymce\/scripts\/tinymce\/plugins\/snippets\/plugin.min.js","link_yform":"/assets/addons/tinymce\/scripts\/tinymce\/plugins\/link_yform\/plugin.min.js","phonelink":"/assets/addons/tinymce\/scripts\/tinymce\/plugins\/phonelink\/plugin.min.js","quote":"/assets/addons/tinymce\/scripts\/tinymce\/plugins\/quote\/plugin.min.js","writeassist_translate":"/assets/addons/writeassist\/js\/tinymce-deepl-plugin.js"},"6934bb49e9d05":"6934bb49e9d05"}};
