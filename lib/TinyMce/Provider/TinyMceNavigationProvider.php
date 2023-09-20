<?php

namespace FriendsOfRedaxo\TinyMce\Provider;

use rex_be_controller;
use rex_be_navigation;
use rex_fragment;

class TinyMceNavigationProvider
{
    /**
     * @return null|\rex_be_page
     * @author Joachim Doerr
     */
    public static function getMainSubPage()
    {
        $page = rex_be_controller::getPageObject('tinymce');
        foreach ($page->getSubPages() as $subPage) {
            if ($subPage->getKey() == 'main') {
                return $subPage;
            }
        }
        return null;
    }

    /**
     * @return string
     * @author Joachim Doerr
     */
    public static function getSubNavigationHeader()
    {
        $photoBy = sprintf(\rex_i18n::msg('tinymce_subnavigation_header_photo'),
            '<a href="https://unsplash.com/@leerspace?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">John Reed</a>',
        '<a href="https://unsplash.com/search/photos/stars?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>'
        );

        return '
            <header class="tinymce-header">
                <picture>
                    <img src="/assets/addons/tinymce/images/header-john-reed-qtRFE7MYnHo-unsplash.jpg">
                </picture>
                <div class="header-content">
                    <h1>'.\rex_i18n::msg('tinymce_subnavigation_header_title').'</h1>
                </div>
                <div class="photoinfo"><span>'.$photoBy.'</span></div>
            </header>
        ';
    }

    /**
     * @return string
     * @author Joachim Doerr
     */
    public static function getSubNavigation()
    {
        $subpage = self::getMainSubPage();
        $subtitle = '';

        if (sizeof($subpage->getSubpages()) > 0) {
            $nav = rex_be_navigation::factory();

            foreach ($subpage->getSubpages() as $sPage) {
                $sPage->setHidden(false);
                $nav->addPage($sPage);
            }

            $blocks = $nav->getNavigation();
            $navigation = [];
            if (count($blocks) == 1) {
                $navigation = current($blocks);
                $navigation = $navigation['navigation'];
            }

            if (!empty($navigation)) {
                try {
                    $fragment = new rex_fragment();
                    $fragment->setVar('left', $navigation, false);
                    $subtitle = $fragment->parse('core/navigations/content.php');

                    $subtitle = str_replace('/mblock_demo', '/mblock_demo&id=1&func=edit&list=300200', $subtitle);

                } catch (\rex_exception $e) {
                    \rex_logger::logException($e);
                }

                $subtitle = str_replace(['nav nav-tabs', 'rex-page-nav'], ['nav nav-pills list-inline center-block text-center', 'tinymce-mainnav'], $subtitle);

            } else {
                $subtitle = '';
            }
        }

        return $subtitle;
    }
}
