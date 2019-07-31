<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

namespace TinyMCE5\Handler;


use TinyMCE5\Creator\TinyMCE5ProfilesCreator;
use rex;
use rex_extension;
use rex_extension_point;
use rex_sql;

class TinyMCE5DatabaseHandler
{
    const TINY5_PROFILES = 'tinymce5_profiles';
    const TINY5_MBLOCK_DEMO = 'tinymce5_mblock_demo';

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
            $sql->setTable(rex::getTable(self::TINY5_PROFILES))
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
            $sql->setTable(rex::getTable(self::TINY5_PROFILES))
                ->select('*');
            return $sql->getArray();
        } catch (\rex_sql_exception $e) {
            \rex_logger::logException($e);
            return null;
        }
    }
}
