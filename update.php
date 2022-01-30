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
}
REPLACE(dimensionen," ", "")
// Recreate profiles
$addon = rex_addon::get('tinymce5');
$addon->setConfig('update_profiles', true);
