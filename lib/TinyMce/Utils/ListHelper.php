<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_i18n;
use rex_logger;
use rex_sql;
use rex_sql_exception;
use rex_view;

use function count;

class ListHelper
{
    public static function cloneData(string $table, int $id): string
    {
        try {
            $data = rex_sql::factory()->setTable($table)->setWhere('id=:id', ['id' => $id])->select()->getArray();
            if (1 == count($data)) {
                $profile = $data[0];
                unset($profile['id']);
                $profile['name'] .= '_cloned';
                rex_sql::factory()->setTable($table)->setValues($profile)->insert();
            }
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return rex_view::error(rex_i18n::msg($table . '_clone_exception'));
        }
        return rex_view::info(rex_i18n::msg($table . '_cloned'));
    }

    public static function deleteData(string $table, int $id): string
    {
        $sql = rex_sql::factory();
        try {
            $sql->setQuery("DELETE FROM $table WHERE id=$id");
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return rex_view::error(rex_i18n::msg($table . '_delete_exception'));
        }
        return rex_view::info(rex_i18n::msg('tinymce_profile_deleted'));
    }
}
