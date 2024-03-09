<?php

namespace FriendsOfRedaxo\TinyMce\Creator;

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use rex_addon;
use rex_addon_interface;
use rex_file;
use rex_functional_exception;
use rex_i18n;

use function count;
use function is_string;

class Profiles
{
    public const UPLOAD_URL = './index.php?tinymceupload=1';
    public const PROFILES_FILENAME = 'profiles.js';

    public const ALLOWED_FIELDS = [
        'toolbar' => ['|', 'styleselect', 'undo', 'redo', 'save', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'forecolor', 'backcolor', 'ltr', 'rtl', 'table', 'visualblocks', 'visualchars', 'link', 'image', 'media', 'codesample', 'template', 'fontselect', 'align', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'numlist', 'bullist', 'outdent', 'indent', 'removeformat', 'code', 'hr', 'print', 'preview', 'media', 'fullscreen', 'searchreplace', 'emoticons', 'visualaid', 'cut', 'copy', 'paste', 'pastetext', 'selectall', 'wordcount', 'charmap', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime'],
        'plugins' => ['autoresize', 'save', 'print', 'preview', 'searchreplace', 'autolink', 'directionality', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media', 'template', 'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'help', 'emoticons', 'paste', 'code'],
    ];

    public const DEFAULTS = [
        'toolbar' => 'heading,|',
        'plugins' => '',
    ];

    public const EDITOR_SETTINGS = [
        'cktypes' => ['fontColor'],
        'ckimgtypes' => ['rexImage', 'imageUpload'],
    ];

    /**
     * @throws rex_functional_exception
     */
    public static function profilesCreate(?array $getProfile = null): void
    {
        $profiles = TinyMceDatabaseHandler::getAllProfiles();

        $content = '';
        if (count($profiles) > 0) {
            $jsonProfiles = [];
            $extras = [];

            foreach ($profiles as $profile) {
                if (isset($getProfile['name']) && $profile['name'] == $getProfile['name']) {
                    $profile = $getProfile;
                }

                $result = self::mapProfile($profile);

                $key_defaults = uniqid();
                $key_extras = uniqid();
                $extras[$key_defaults] = $result;

                $jsonProfiles[$profile['name']][$key_defaults] = $key_defaults;
                $jsonProfiles[$profile['name']][$key_extras] = $key_extras;
            }

            $extraValues = [];
            $extraKeys = [];
            foreach ($extras as $key => $value) {
                $extraKeys[$key] = "\"$key\":\"$key\"";
                $extraValues[$key] = $value;
            }

            $profiles = json_encode($jsonProfiles);
            $profiles = is_string($profiles) ? $profiles : '';
            $profiles = str_replace(array_values($extraKeys), array_values($extraValues), $profiles);
            $profiles = str_replace(',,', ',', $profiles);

            $content =
                "
 const tinyprofiles = $profiles;
 ";
        }

        if (!rex_file::put(self::getAddon()->getAssetsPath('generated/' . self::PROFILES_FILENAME), $content)) {
            throw new rex_functional_exception(rex_i18n::msg('tinymce_profiles_creation_exception'));
        }
    }

    public static function mapProfile(array $profile): string|array
    {
        $jsonProfile = [];
        if (!empty($profile['extra'])) {
            return $profile['extra'];
        }
        return $jsonProfile;
    }

    private static function getAddon(): rex_addon|rex_addon_interface
    {
        return rex_addon::get('tinymce');
    }
}
