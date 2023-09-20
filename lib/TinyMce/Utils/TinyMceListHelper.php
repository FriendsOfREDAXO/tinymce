<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_i18n;
use rex_sql;
use rex_view;

class TinyMceListHelper
{
    /**
     * togglet bool data column
     * @param $table
     * @param $id
     * @param null $column
     * @return string
     * @author Joachim Doerr
     */
    public static function toggleBoolData($table, $id, $column = NULL)
    {
        if (!is_null($column)) {
            $sql = rex_sql::factory();
            try {
                $sql->setQuery("UPDATE $table SET $column=ABS(1-$column) WHERE id=$id");
            } catch (\rex_sql_exception $e) {
                \rex_logger::logException($e);
                return rex_view::error(rex_i18n::msg($table . '_toggle_' . $column . '_exception'));
            }
            return rex_view::info(rex_i18n::msg($table . '_toggle_' . $column . '_success'));
        } else {
            return rex_view::warning(rex_i18n::msg($table . '_toggle_' . $column . '_error'));
        }
    }

    /**
     * clone data
     * @param $table
     * @param $id
     * @return string
     * @author Joachim Doerr
     */
    static public function cloneData($table, $id)
    {
        try {
            $data = rex_sql::factory()->setTable($table)->setWhere('id=:id',['id'=>$id])->select()->getArray();
            if (count($data) == 1) {
                $profile = $data[0];
                unset($profile['id']);
                $profile['name'] .= '_cloned';
                rex_sql::factory()->setTable($table)->setValues($profile)->insert();
            }
        } catch (\rex_sql_exception $e) {
            \rex_logger::logException($e);
            return rex_view::error(rex_i18n::msg($table . '_clone_exception'));
        }
        return rex_view::info(rex_i18n::msg($table . '_cloned'));
    }

    /**
     * delete data
     * @param $table
     * @param $id
     * @return string
     * @author Joachim Doerr
     */
    static public function deleteData($table, $id)
    {
        $sql = rex_sql::factory();
        try {
            $sql->setQuery("DELETE FROM $table WHERE id=$id");
        } catch (\rex_sql_exception $e) {
            \rex_logger::logException($e);
            return rex_view::error(rex_i18n::msg($table . '_delete_exception'));
        }
        return rex_view::info(rex_i18n::msg('tinymce_profile_deleted'));
    }

}
