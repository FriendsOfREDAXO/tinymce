<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex_addon;
use rex_i18n;
use rex_logger;
use rex_sql;
use rex_sql_exception;
use rex_view;

class TinyMceListHelper
{
    static public function cloneData(string $table, int $id): string
    {
        $addon = rex_addon::get('tinymce');
        try {
            $data = rex_sql::factory()
                ->setTable($table)
                ->setWhere('id = :id',['id' => $id])
                ->select()
                ->getArray();

            if (count($data) === 1) {
                $profile = $data[0];
                unset($profile['id']);
                $profile['name'] .= '_cloned';

                rex_sql::factory()
                    ->setTable($table)
                    ->setValues($profile)
                    ->insert();
            }
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return rex_view::error($addon->i18n('profile_clone_exception'));
        }
        return rex_view::info($addon->i18n('profile_cloned'));
    }

    static public function deleteData(string $table, int $id): string
    {
        $addon = rex_addon::get('tinymce');
        try {
            $sql = rex_sql::factory();
            $sql->setQuery('DELETE FROM '.$table.' WHERE `id` = : id', ['id' => $id]);
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return rex_view::error($addon->i18n('profile_delete_exception'));
        }
        return rex_view::info($addon->i18n('profile_deleted'));
    }
}
