<?php
if (rex_version::compare($this->getVersion(), '1.2.5', '<')) {
    // Update profiles to fix https://github.com/FriendsOfREDAXO/tinymce5/issues/40
    $result = rex_sql::factory();
    $result->setQuery('UPDATE `' . \rex::getTablePrefix() . 'tinymce5_profiles` SET `extra` = CONCAT("relative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : \'/\',\r\nconvert_urls : true,\r\n\r\nrel_list: [\r\n {title: \'Keine\', value: \'\'},\r\n {title: \'Nofollow\', value: \'nofollow\'}\r\n],\r\n", `extra`);');
}
if (rex_version::compare($this->getVersion(), '1.2.7', '<')) {
    // Update profiles to fix https://github.com/FriendsOfREDAXO/tinymce5/issues/15
    $result = rex_sql::factory();
    $result->setQuery('UPDATE `' . \rex::getTablePrefix() . 'tinymce5_profiles` SET `extra` = REPLACE(`extra`, ",\r\ninit_instance_callback: function (theEditor) {\r\n    rex5_init_callback(theEditor);\r\n},\r\nsetup: function (theEditor) {\r\n    rex5_setup_callback(theEditor);\r\n}", "");');
    // Add light profile
    $result->setQuery('SELECT * FROM `' . \rex::getTablePrefix() . 'tinymce5_profiles` WHERE `name` = "light"');
    if($result->getRows() == 0) {
        $result->setQuery('INSERT INTO `' . \rex::getTablePrefix() . 'tinymce5_profiles` (`name`, `description`, `extra`, `mediatype`, `mediapath`, `mediacategory`, `upload_default`, `createdate`, `updatedate`, `createuser`, `updateuser`) VALUES ("light", "Small featured example", "relative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : \'/\',\r\nconvert_urls : true,\r\n\r\nrel_list: [\r\n {title: \'Keine\', value: \'\'},\r\n {title: \'Nofollow\', value: \'nofollow\'}\r\n],\r\nlanguage: \'de\',\r\nallow_script_urls: true,\r\nbranding: false,\r\nstatusbar: true,\r\nmenubar: false,\r\nplugins: \'autoresize autolink directionality visualblocks visualchars fullscreen image link media charmap hr pagebreak nonbreaking paste code\',\r\ntoolbar: \'styleselect |  bold italic subscript superscript | blockquote bullist numlist | charmap nonbreaking | link unlink | image | removeformat code | undo redo | cut copy paste pastetext wordcount\',\r\ncharmap_append: [\r\n    [160, \'no-break space\'],\r\n    [173, \'soft hyphen\']\r\n],\r\npaste_as_text: true,\r\nentity_encoding: \"raw\",\r\nstyle_formats:        [\r\n    {title:        \'Überschriften\',        items:        [\r\n        {title:        \'Überschrift 1\',        format:        \'h1\'},\r\n        {title:        \'Überschrift 2\',        format:        \'h2\'},\r\n        {title:        \'Überschrift 3\',        format:        \'h3\'},\r\n        {title:        \'Überschrift 4\',        format:        \'h4\'},\r\n        {title:        \'Überschrift 5\',        format:        \'h5\'}\r\n    ]} \r\n]", NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "admin", "admin")');
    }
}
    
// Recreate profiles
$addon = rex_addon::get('tinymce5');
$addon->setConfig('update_profiles', true);
