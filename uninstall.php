<?php
$sql = rex_sql::factory();

// Delete profiles table
$sql->setQuery('DROP TABLE IF EXISTS ' . \rex::getTablePrefix() . 'tinymce_profiles');
