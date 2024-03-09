<?php

namespace FriendsOfRedaxo\TinyMce\Handler;

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use rex_be_controller;
use rex_extension_point;
use rex_functional_exception;
use rex_view;

class Extension
{
    /** @api */
    public static function createProfiles(rex_extension_point $ep): void
    {
        if ('profiles' === rex_be_controller::getCurrentPagePart(2) || 'TINY_PROFILE_ADD' === $ep->getName()) {
            try {
                TinyMceProfilesCreator::profilesCreate();
            } catch (rex_functional_exception $e) {
                echo rex_view::error($e->getMessage());
            }
        } elseif ('TINY_PROFILE_UPDATED' === $ep->getName()) {
            try {
                TinyMceProfilesCreator::profilesCreate($ep->getParams());
            } catch (rex_functional_exception $e) {
                echo rex_view::error($e->getMessage());
            }
        }
    }
}
