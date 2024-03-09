<?php

namespace FriendsOfRedaxo\TinyMce\Handler;

use rex;
use rex_logger;
use rex_sql;
use rex_sql_exception;

class Database
{
    public const TINY_PROFILES = 'tinymce_profiles';

    public static function profileExist(?string $name = null): bool
    {
        return (null === self::loadProfile($name)) ? false : true;
    }

    public static function loadProfile(?string $name = null): ?array
    {
        try {
            $sql = rex_sql::factory();
            $sql->setTable(rex::getTable(self::TINY_PROFILES))
                ->setWhere(['name' => $name])
                ->select('*');
            return $sql->getRow();
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return null;
        }
    }

    public static function getAllProfiles(): ?array
    {
        try {
            $sql = rex_sql::factory();
            $sql->setTable(rex::getTable(self::TINY_PROFILES))
                ->select('*');
            return $sql->getArray();
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
            return null;
        }
    }
}
