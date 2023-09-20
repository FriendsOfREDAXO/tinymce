<?php

namespace FriendsOfRedaxo\TinyMce\Handler;

use rex;
use rex_extension;
use rex_extension_point;
use rex_sql;

class TinyMceDatabaseHandler
{
    const TINY_PROFILES = 'tinymce_profiles';
    const TINY_MBLOCK_DEMO = 'tinymce_mblock_demo';

    /**
     * @param null $name
     * @return bool
     * @author Joachim Doerr
     */
    public static function profileExist($name = null)
    {
        return (self::loadProfile($name) !== false) ? true : false;
    }

    /**
     * @param null $name
     * @return array|null
     * @author Joachim Doerr
     */
    public static function loadProfile($name = null)
    {
        try {
            $sql = rex_sql::factory();
            $sql->setTable(rex::getTable(self::TINY_PROFILES))
                ->setWhere(['name' => $name])
                ->select('*');
            return $sql->getRow();
        } catch (\rex_sql_exception $e) {
            \rex_logger::logException($e);
            return null;
        }
    }

    /**
     * @return array|null
     * @author Joachim Doerr
     */
    public static function getAllProfiles()
    {
        try {
            $sql = rex_sql::factory();
            $sql->setTable(rex::getTable(self::TINY_PROFILES))
                ->select('*');
            return $sql->getArray();
        } catch (\rex_sql_exception $e) {
            \rex_logger::logException($e);
            return null;
        }
    }
}
