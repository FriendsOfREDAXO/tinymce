<?php

namespace FriendsOfRedaxo\TinyMce\Provider;

use rex_be_controller;
use rex_exception;
use rex_logger;
use rex_view;

class TinyMceAssetsProvider
{
    /**
     * @author Joachim Doerr
     */
    public static function provideDemoAssets()
    {
        if (rex_be_controller::getCurrentPagePart(1) == 'tinymce') {
            try {
                rex_view::addCssFile(self::getAddon()->getAssetsUrl('styles/demo.css'));
            } catch (rex_exception $e) {
                rex_logger::logException($e);
            }
        }
    }

    /**
     * @author Joachim Doerr
     */
    public static function provideBaseAssets()
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

    /**
     * @author Joachim Doerr
     */
    public static function provideProfileEditData()
    {
        if (rex_be_controller::getCurrentPagePart(2) == 'profiles' && rex_be_controller::getCurrentPagePart(1) == 'tinymce') {
            // add js vendors
            self::addJS([
                'jquery.alphanum' => 'vendor/alphanum/jquery.alphanum.js',
                'profile' => 'scripts/profile.js',
            ]);
            // add css vendors
            //self::addCss([
            //]);
        }
    }

    public static function providePopupAssets()
    {
        try {
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/linkmap.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    /**
     * @param array $js
     * @author Joachim Doerr
     */
    private static function addJS(array $js)
    {
        foreach ($js as $name => $fullPathFile) {
            $add = true;
            foreach (rex_view::getJsFiles() as $jsFile) {
                if (strpos($jsFile, $name) !== false) {
                    $add = false;
                }
            }
            if ($add) {
                try {
                    rex_view::addJsFile(self::getAddon()->getAssetsUrl($fullPathFile));
                } catch (rex_exception $e) {
                    rex_logger::logException($e);
                }
            }
        }
    }

    /**
     * @param array $css
     * @author Joachim Doerr
     */
    private static function addCss(array $css)
    {
        foreach ($css as $name => $fullPathFile) {
            $add = true;
            if (isset(rex_view::getCssFiles()['all'])) {
                foreach (rex_view::getCssFiles()['all'] as $cssFile) {
                    if (strpos($cssFile, $name) !== false) {
                        $add = false;
                    }
                }
            }
            if ($add) {
                try {
                    rex_view::addCssFile(self::getAddon()->getAssetsUrl($fullPathFile));
                } catch (rex_exception $e) {
                    rex_logger::logException($e);
                }
            }
        }
    }

    /**
     * @return \rex_addon_interface
     * @author Joachim Doerr
     */
    private static function getAddon()
    {
        return \rex_addon::get('tinymce');
    }
}
