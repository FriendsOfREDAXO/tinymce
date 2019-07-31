<?php
/**
 * User: joachimdoerr
 * Date: 2019-07-06
 * Time: 20:41
 */

namespace TinyMCE5\Provider;


use rex_exception;
use rex_logger;
use rex_view;

class TinyMCE5AssetsProvider
{
    public static function provideBaseAssets()
    {
        rex_view::addCssFile(self::getAddon()->getAssetsUrl('tinymce5.css'));
        rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/tinymce/tinymce.min.js'));
        rex_view::addJsFile(self::getAddon()->getAssetsUrl('vendor/fixer/jquery.fixer.js'));
        rex_view::addJsFile(self::getAddon()->getAssetsUrl('tinymce5_profiles.js'));
        rex_view::addJsFile(self::getAddon()->getAssetsUrl('tinymce5.js'));
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
     * @return \rex_addon
     * @author Joachim Doerr
     */
    private static function getAddon()
    {
        return \rex_addon::get('tinymce5');
    }
}