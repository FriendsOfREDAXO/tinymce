<?php

namespace FriendsOfRedaxo\TinyMce\Creator;

use FriendsOfRedaxo\TinyMce\Handler\TinyMceDatabaseHandler;
use rex_file;

class TinyMceProfilesCreator
{
    const UPLOAD_URL = './index.php?tinymceupload=1';
    const PROFILES_FILENAME = 'profiles.js';

    const ALLOWED_FIELDS = [
        'toolbar' => ['|', 'styleselect', 'undo', 'redo', 'save', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'forecolor', 'backcolor', 'ltr', 'rtl', 'table', 'visualblocks', 'visualchars', 'link', 'image', 'media', 'codesample', 'template', 'fontselect', 'align', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'numlist', 'bullist', 'outdent', 'indent', 'removeformat', 'code', 'hr', 'print', 'preview', 'media', 'fullscreen', 'searchreplace', 'emoticons', 'visualaid', 'cut', 'copy', 'paste', 'pastetext', 'selectall', 'wordcount', 'charmap', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime'],
        'plugins' => ['autoresize', 'save', 'print', 'preview', 'searchreplace', 'autolink', 'directionality', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media', 'template', 'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'help', 'emoticons', 'paste', 'code'],
    ];

    const DEFAULTS = [
        'toolbar' => 'heading,|',
        'plugins' => '',
    ];

    const EDITOR_SETTINGS = [
        'cktypes' => ['fontColor'],
        'ckimgtypes' => ['rexImage', 'imageUpload']
    ];

    /**
     * @param null|array $profile
     * @throws \rex_functional_exception
     * @author Joachim Doerr
     */
    public static function profilesCreate($getProfile = null)
    {
        $profiles = TinyMceDatabaseHandler::getAllProfiles();
        $content = '';
        if (sizeof($profiles) > 0) {
            $jsonProfiles = [];
            foreach ($profiles as $profile) {
                if (isset($getProfile['name']) && $profile['name'] == $getProfile['name']) {
                    $profile = $getProfile;
                }

                $options = $profile['extra'] ?? '';
                $options = json_decode($options, true);

                if (null === $options) {
                    continue;
                }

                if (!isset($options['link_linkmap']) || (true === $options['link_linkmap'])) {
                    $options['file_picker_callback'] = '<script>function (callback, value, meta) { rex5_picker_function(callback, value, meta); }</script>';
                }
                if (isset($options['link_linkmap'])) {
                    unset($options['link_linkmap']);
                }

                $jsonProfiles[$profile['name']] = $options;
            }

            $content = 'const tinyprofiles = '.json_encode($jsonProfiles).';';
            $content = str_replace(['"<script>', '<\/script>"'], ['', ''], $content);
        }

        if (!rex_file::put(self::getAddon()->getAssetsPath('generated/'.self::PROFILES_FILENAME), $content)) {
            throw new \rex_functional_exception(\rex_i18n::msg('tinymce_profiles_creation_exception'));
        }
    }

    /**
     * @param array $profile
     * @return array
     * @author Joachim Doerr
     */
    public static function mapProfile(array $profile)
    {
        $jsonProfile = array();
        if (!empty($profile['extra'])) {
            return $profile['extra'];
        }
        return $jsonProfile;
    }

    /**
     * @return \rex_addon
     * @author Joachim Doerr
     */
    private static function getAddon()
    {
        return \rex_addon::get('tinymce');
    }

    /**
     * @param $string
     * @return array
     * @author Joachim Doerr
     */
    private static function toArray($string)
    {
        return explode(',', $string);
    }

}
