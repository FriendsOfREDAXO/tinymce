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
        if ('tinymce' === rex_be_controller::getCurrentPagePart(1)) {
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
        if ('tinymce' === rex_be_controller::getCurrentPagePart(1) && 'profiles' === rex_be_controller::getCurrentPagePart(2)) {
            $i18n = [
                'profile_assistant' => \rex_i18n::msg('tinymce_profile_assistant'),
                'presets' => \rex_i18n::msg('tinymce_presets'),
                'simple' => \rex_i18n::msg('tinymce_simple'),
                'standard' => \rex_i18n::msg('tinymce_standard'),
                'full' => \rex_i18n::msg('tinymce_full'),
                'plugins' => \rex_i18n::msg('tinymce_plugins'),
                'toolbar' => \rex_i18n::msg('tinymce_toolbar'),
                'toolbar_help' => \rex_i18n::msg('tinymce_toolbar_help'),
                'available_items' => \rex_i18n::msg('tinymce_available_items'),
                'separator' => \rex_i18n::msg('tinymce_separator'),
                'selected_toolbar' => \rex_i18n::msg('tinymce_selected_toolbar'),
                'toolbar_result' => \rex_i18n::msg('tinymce_toolbar_result'),
                'common_settings' => \rex_i18n::msg('tinymce_common_settings'),
                'height' => \rex_i18n::msg('tinymce_height'),
                'language' => \rex_i18n::msg('tinymce_language'),
                'advanced_settings' => \rex_i18n::msg('tinymce_advanced_settings'),
                'image_caption' => \rex_i18n::msg('tinymce_image_caption'),
                'image_uploadtab' => \rex_i18n::msg('tinymce_image_uploadtab'),
                'media_manager_type' => \rex_i18n::msg('tinymce_media_manager_type'),
                'relative_urls' => \rex_i18n::msg('tinymce_relative_urls'),
                'remove_script_host' => \rex_i18n::msg('tinymce_remove_script_host'),
                'convert_urls' => \rex_i18n::msg('tinymce_convert_urls'),
                'document_base_url' => \rex_i18n::msg('tinymce_document_base_url'),
                'entity_encoding' => \rex_i18n::msg('tinymce_entity_encoding'),
                'powerpaste_word_import' => \rex_i18n::msg('tinymce_powerpaste_word_import'),
                'powerpaste_html_import' => \rex_i18n::msg('tinymce_powerpaste_html_import'),
                'extras_defaults' => \rex_i18n::msg('tinymce_extras_defaults'),
                'default_codesample_languages' => \rex_i18n::msg('tinymce_default_codesample_languages'),
                'default_rellist' => \rex_i18n::msg('tinymce_default_rellist'),
                'toc_depth' => \rex_i18n::msg('tinymce_toc_depth'),
                'toc_header_tag' => \rex_i18n::msg('tinymce_toc_header_tag'),
                'toc_class' => \rex_i18n::msg('tinymce_toc_class'),
                'generate_config' => \rex_i18n::msg('tinymce_generate_config'),
                'overwrites_existing_config' => \rex_i18n::msg('tinymce_overwrites_existing_config'),
                'none' => \rex_i18n::msg('tinymce_none'),
            ];
            
            \rex_view::setJsProperty('tinymceProfileI18n', $i18n);

            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profile.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profile_builder.js'));
            rex_view::addJsFile(self::getAddon()->getAssetsUrl('scripts/profiles-list.js'));
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
