<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex;
use rex_i18n;

class Lang
{
    public static function getUserLang(): string
    {
        $user = rex::getUser();
        $userLang = null !== $user ? $user->getLanguage() : '';
        $lang = '' !== $userLang ? $userLang : rex_i18n::getLocale();
        return strtolower(substr($lang, 0, 2));
    }
}
