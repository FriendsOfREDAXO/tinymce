<?php
/**
 * User: joachimdoerr
 * Date: 2019-07-06
 * Time: 20:41
 */

namespace TinyMCE5\Provider;


use rex_be_controller;
use rex_exception;
use rex_logger;
use rex_view;

class TinyMCE5AssetsProvider
{
    /**
     * @author Joachim Doerr
     */
    public static function provideViewAssets()
    {
        if (rex_be_controller::getCurrentPagePart(1) == 'tinymce5') {
            try {
                rex_view::addCssFile(self::getAddon()->getAssetsUrl('css/tinymce5.css'));
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
            rex_view::addCssFile(self::getAddon()->getAssetsUrl('css/tinymce5_rex_skin.css'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/tinymce/tinymce.min.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('tinymce5_profiles.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('js/tinymce5_rex.js'));
        } catch (rex_exception $e) {
            rex_logger::logException($e);
        }
    }

    /**
     * @author Joachim Doerr
     */
    public static function provideProfileEditData()
    {
        if (rex_be_controller::getCurrentPagePart(2) == 'profiles' && rex_be_controller::getCurrentPagePart(1) == 'tinymce5') {
            // add js vendors
            self::addJS([
                'jquery.alphanum' => 'vendor/alphanum/jquery.alphanum.js',
                'tinymce5profile_edit' => 'js/tinymce5_profile_edit.js',
            ]);
            // add css vendors
            //self::addCss([
            //]);
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
        return \rex_addon::get('tinymce5');
    }
}