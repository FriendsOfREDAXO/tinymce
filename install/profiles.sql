REPLACE INTO `rex_tinymce_profiles` (`id`, `name`, `description`, `extra`, `createdate`, `updatedate`, `createuser`, `updateuser`) VALUES (1, 'full', 'Full featured example', 'language: \'de\',\r\nbranding: false,\r\nstatusbar: true,\r\nmenubar: true,\r\nplugins: \'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code \' +\r\n    \'save\' +\r\n    \'\',\r\ntoolbar: \'styleselect | undo redo save | bold italic underline strikethrough subscript superscript forecolor backcolor | ltr rtl | table visualblocks visualchars | link image media | codesample template fontselect align alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code | hr print preview media fullscreen | searchreplace | emoticons visualaid cut copy paste pastetext selectall wordcount charmap pagebreak nonbreaking anchor toc insertdatetime\',\r\nheight: 400,\r\n\r\nimage_caption: true,\r\nimage_uploadtab: false,\r\n// paste_as_text: true,\r\npowerpaste_word_import: "clean",\r\npowerpaste_html_import: "merge",\r\nrelative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : "/",\r\nentity_encoding: \'raw\',\r\nconvert_urls : true,\r\n\r\n// height: 700,\r\n\r\ncodesample_languages: [\r\n    {text: \'HTML/XML\', value: \'markup\'},\r\n    {text: \'JavaScript\', value: \'javascript\'},\r\n    {text: \'CSS\', value: \'css\'},\r\n    {text: \'PHP\', value: \'php\'},\r\n    {text: \'Ruby\', value: \'ruby\'},\r\n    {text: \'Python\', value: \'python\'},\r\n    {text: \'Java\', value: \'java\'},\r\n    {text: \'C\', value: \'c\'},\r\n    {text: \'C#\', value: \'csharp\'},\r\n    {text: \'C++\', value: \'cpp\'}\r\n],\r\nrel_list: [\r\n   {title: \'Keine\', value: \'\'},\r\n   {title: \'Nofollow\', value: \'nofollow\'}\r\n],\r\n\r\nskin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\r\ncontent_css: redaxo.theme.current === "dark" ? "default" : "light",\r\n\r\ntoc_depth: 3,\r\ntoc_header: "div", // case doesn\'t matter\r\ntoc_class: "our-toc",\r\n\r\n\r\n// autoresize_bottom_margin: 5,\r\nfile_picker_callback: function (callback, value, meta) {\r\n    rex5_picker_function(callback, value, meta);\r\n}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', 'admin');
REPLACE INTO `rex_tinymce_profiles` (`id`, `name`, `description`, `extra`, `createdate`, `updatedate`, `createuser`, `updateuser`) VALUES (2, 'light', 'Small featured example', 'relative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : \'/\',\r\nconvert_urls : true,\r\n\r\nrel_list: [\r\n {title: \'Keine\', value: \'\'},\r\n {title: \'Nofollow\', value: \'nofollow\'}\r\n],\r\nlanguage: \'de\',\r\nallow_script_urls: true,\r\nbranding: false,\r\nstatusbar: true,\r\nmenubar: false,\r\nplugins: \'autolink directionality visualblocks visualchars fullscreen image link media charmap pagebreak nonbreaking code\',\r\ntoolbar: \'styleselect |  bold italic subscript superscript | blockquote bullist numlist | charmap nonbreaking | link unlink | image | removeformat code | undo redo | cut copy paste pastetext wordcount\',\r\nheight: 400,\r\ncharmap_append: [\r\n    [160, \'no-break space\'],\r\n    [173, \'soft hyphen\']\r\n],\r\npaste_as_text: true,\r\nentity_encoding: \'raw\',\r\nstyle_formats:        [\r\n    {title:        \'Überschriften\',        items:        [\r\n        {title:        \'Überschrift 1\',        format:        \'h1\'},\r\n        {title:        \'Überschrift 2\',        format:        \'h2\'},\r\n        {title:        \'Überschrift 3\',        format:        \'h3\'},\r\n        {title:        \'Überschrift 4\',        format:        \'h4\'},\r\n        {title:        \'Überschrift 5\',        format:        \'h5\'}\r\n    ]} \r\n],\r\n\r\nskin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\r\ncontent_css: redaxo.theme.current === "dark" ? "dark" : "default",', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', 'admin');
REPLACE INTO `rex_tinymce_profiles` (`id`, `name`, `description`, `extra`, `createdate`, `updatedate`, `createuser`, `updateuser`) VALUES (3, 'default', 'Standard featured example', 'language: \'de\',\r\nbranding: false,\r\nstatusbar: true,\r\nmenubar: false,\r\nplugins: \'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template codesample charmap nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code\',\r\ntoolbar1: \'undo redo | cut copy paste pastetext | bold italic underline strikethrough subscript superscript removeformat | link anchor | image emoticons charmap nonbreaking\',\r\ntoolbar2: \'styleselect | fontselect | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | code fullscreen searchreplace\',\r\nheight: 400,\r\n\r\nimage_caption: true,\r\nimage_uploadtab: false,\r\npowerpaste_word_import: "clean",\r\npowerpaste_html_import: "merge",\r\nentity_encoding: \'raw\',\r\nrelative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : "/",\r\nconvert_urls : true,\r\n\r\nrel_list: [\r\n   {title: \'Keine\', value: \'\'},\r\n   {title: \'Nofollow\', value: \'nofollow\'},\r\n   {title: \'Sponsored\', value: \'sponsored\'}\r\n],\r\n\r\nfile_picker_callback: function (callback, value, meta) {\r\n    rex5_picker_function(callback, value, meta);\r\n},\r\nsetup: function (theEditor) {\r\n    rex5_setup_callback(theEditor);\r\n},\r\n\r\nskin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\r\ncontent_css: redaxo.theme.current === "dark" ? "dark" : "default",', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', 'admin');
