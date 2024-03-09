<?php

$this->includeFile(__DIR__ . '/update.php');

try {
    rex_sql_util::importDump($this->getPath('install/profiles.sql'));
} catch (rex_sql_exception $e) {
    rex_logger::logException($e);
    echo rex_view::error($e->getMessage());
}
