<?php
if (rex_version::compare($this->getVersion(), '1.2.5', '<')) {
    // Update profiles to fix https://github.com/FriendsOfREDAXO/tinymce5/issues/40
    $result = rex_sql::factory();
    $result->setQuery('UPDATE `' . \rex::getTablePrefix() . 'tinymce5_profiles` SET `extra` = CONCAT("relative_urls : false,\r\nremove_script_host : true,\r\ndocument_base_url : \'/\',\r\nconvert_urls : true,\r\n\r\nrel_list: [\r\n {title: \'Keine\', value: \'\'},\r\n {title: \'Nofollow\', value: \'nofollow\'}\r\n],\r\n", `extra`);');
}

// Recreate profiles
try {
    TinyMCE5ProfilesCreator::profilesCreate();
}
catch(\rex_functional_exception $e) {
}
