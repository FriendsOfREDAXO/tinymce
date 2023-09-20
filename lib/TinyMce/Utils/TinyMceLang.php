<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex;
use rex_i18n;

class TinyMceLang
{
    public static function getUserLang()
    {
        if (!empty(rex::getUser()->getLanguage())) {
            $lang = rex::getUser()->getLanguage();
        } else {
            $lang = rex_i18n::getLocale();
        }
        return strtolower(substr($lang, 0, 2));
    }
}
