const tiny5profiles = {
    "full": {
        language: 'de',
        branding: false,
        statusbar: true,
        menubar: true,
        plugins: 'autoresize print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help emoticons paste code save',
        toolbar: 'styleselect | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample template fontselect align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullpage fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime',
        image_caption: true,
        image_uploadtab: false,
        powerpaste_word_import: "clean",
        powerpaste_html_import: "merge",
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
        toolbar_sticky: true,
        file_picker_callback: function (callback, value, meta) {
            rex5_picker_function(callback, value, meta);
        }
    }
};
