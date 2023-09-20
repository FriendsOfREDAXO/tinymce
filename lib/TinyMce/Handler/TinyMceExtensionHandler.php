<?php

namespace FriendsOfRedaxo\TinyMce\Handler;


use FriendsOfRedaxo\TinyMce\Creator\TinyMceProfilesCreator;
use rex_be_controller;
use rex_extension_point;
use rex_view;

class TinyMceExtensionHandler
{
    /**
     * @param rex_extension_point $ep
     * @return string
     * @author Joachim Doerr
     */
    public static function addIcon(rex_extension_point $ep)
    {
        if (rex_be_controller::getCurrentPagePart(1) == 'tinymce') {
            return '<i class="tinymce-icon-logo"></i> ' . $ep->getSubject();
        }
    }

    /**
     * @param rex_extension_point $ep
     * @author Joachim Doerr
     */
    public static function hiddenMain(rex_extension_point $ep)
    {
        if (rex_be_controller::getCurrentPagePart(1) == 'tinymce') {
            $subj = $ep->getSubject();
            if (array_key_exists('tinymce', $subj)) {
                /** @var \rex_be_page $page */
                $page = $subj['tinymce'];
                foreach ($page->getSubPages() as $subPage) {
                    if ($subPage->getKey() == 'main') {
                        foreach ($subPage->getSubpages() as $sPage) {
                            $sPage->setHidden(true);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param rex_extension_point $ep
     * @author Joachim Doerr
     */
    public static function removeDemoControlFields(rex_extension_point $ep)
    {
        if (rex_be_controller::getCurrentPagePart(3) == 'mblock_demo') {
            try {
                $ep->setSubject(array(
                    "save" => "",
                    "apply" => "",
                    "delete" => "",
                    "reset" => "",
                    "abort" => ""
                ));
            } catch (\rex_exception $e) {
                \rex_logger::logException($e);
            }
        }
    }

    /**
     * @param rex_extension_point $ep
     * @return void
     * @author Joachim Doerr
     */
    public static function createProfiles(rex_extension_point $ep)
    {
        if (rex_be_controller::getCurrentPagePart(2) == 'profiles' or $ep->getName() == 'TINY_PROFILE_ADD') {
            try {
                TinyMceProfilesCreator::profilesCreate();
            } catch (\rex_functional_exception $e) {
                print rex_view::error($e->getMessage());
            }
        } else if ($ep->getName() == 'TINY_PROFILE_UPDATED') {
            try {
                TinyMceProfilesCreator::profilesCreate($ep->getParams());
            } catch (\rex_functional_exception $e) {
                print rex_view::error($e->getMessage());
            }
        }
    }
}
