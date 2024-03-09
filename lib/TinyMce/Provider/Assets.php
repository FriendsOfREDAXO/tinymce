<?php

namespace FriendsOfRedaxo\TinyMce\Provider;

use rex_addon;
use rex_addon_interface;
use rex_be_controller;
use rex_exception;
use rex_logger;
use rex_view;

class Assets
{
    public static function provideDemoAssets(): void
    {
        if ('tinymce' == rex_be_controller::getCurrentPagePart(1)) {
            try {
                rex_view::addCssFile(self::getAddon()->getAssetsUrl('styles/demo.css'));
            } catch (rex_exception $e) {
                rex_logger::logException($e);
            }
        }
    }

    public static function provideBaseAssets(): void
    {
        try {
            rex_view::addCssFile(self::getAddon()->getAssetsUrl('styles/base.css'));

            rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/tinymce/tinymce.min.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('generated/profiles.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/base.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    public static function provideProfileEditData(): void
    {
        if ('tinymce' == rex_be_controller::getCurrentPagePart(1) && 'profiles' == rex_be_controller::getCurrentPagePart(2)) {
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profile.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/alphanum/jquery.alphanum.js'));
        }
    }

    public static function providePopupAssets(): void
    {
        try {
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/linkmap.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    private static function getAddon(): rex_addon_interface|rex_addon
    {
        return rex_addon::get('tinymce');
    }
}
