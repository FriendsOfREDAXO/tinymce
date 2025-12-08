<?php

$sql = rex_sql::factory();

$sql->setQuery('DROP TABLE IF EXISTS ' . rex::getTablePrefix() . 'tinymce_profiles');
$sql->setQuery('DROP TABLE IF EXISTS ' . rex::getTablePrefix() . 'tinymce_snippets');
