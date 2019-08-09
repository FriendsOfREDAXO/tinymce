const tiny5profiles = {
    'default':
        {
language: 'de',
branding: false,
statusbar: true,
menubar: true,
plugins: 'autoresize print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help emoticons paste code ' +
    'save' +
    '',
toolbar: 'styleselect | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample template fontselect align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullpage fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime',

image_caption: true,
image_uploadtab: false,
// paste_as_text: true,
powerpaste_word_import: "clean",
powerpaste_html_import: "merge",
paste_data_images: true,
images_upload_url: './index.php?tinymce5upload=1',
images_upload_base_path: '/media',
images_reuse_filename: true,

// height: 700,

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

toc_depth: 3,
toc_header: "div", // case doesn't matter
toc_class: "our-toc",

// autoresize_bottom_margin: 5,
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
},
init_instance_callback: function (theEditor) {
    rex5_init_callback(theEditor);
},
setup: function (theEditor) {
    rex5_setup_callback(theEditor);
}
        }
};
