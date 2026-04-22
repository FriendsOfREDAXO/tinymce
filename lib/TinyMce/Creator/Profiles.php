<?php

namespace FriendsOfRedaxo\TinyMce\Creator;

use FriendsOfRedaxo\TinyMce\Handler\Database as TinyMceDatabaseHandler;
use FriendsOfRedaxo\TinyMce\PluginRegistry;
use rex_addon;
use rex_addon_interface;
use rex_file;
use rex_functional_exception;
use rex_i18n;
use rex_url;

use function count;
use function is_string;

class Profiles
{
    /** @api */
    public const PROFILES_FILENAME = 'profiles.js';

    /** @api */
    public const ALLOWED_FIELDS = [
        'toolbar' => ['|', 'styleselect', 'undo', 'redo', 'save', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'forecolor', 'backcolor', 'ltr', 'rtl', 'table', 'visualblocks', 'visualchars', 'link', 'image', 'media', 'codesample', 'fontselect', 'align', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'numlist', 'bullist', 'outdent', 'indent', 'removeformat', 'code', 'hr', 'print', 'preview', 'media', 'fullscreen', 'searchreplace', 'emoticons', 'visualaid', 'cut', 'copy', 'paste', 'pastetext', 'selectall', 'wordcount', 'charmap', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime'],
        'plugins' => ['autoresize', 'save', 'print', 'preview', 'searchreplace', 'autolink', 'directionality', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media', 'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc', 'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'help', 'emoticons', 'paste', 'code'],
    ];

    /**
     * @param array<string, mixed>|null $getProfile
     * @throws rex_functional_exception
     */
    public static function profilesCreate(?array $getProfile = null): void
    {
        $profiles = TinyMceDatabaseHandler::getAllProfiles();

        $content = '';
        if (null !== $profiles && [] !== $profiles) {
            $jsonProfiles = [];
            $extras = [];

            foreach ($profiles as $profile) {
                if (isset($getProfile['name']) && $profile['name'] === $getProfile['name']) {
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
            $profiles = is_string($profiles) ? $profiles : '{}';
            /** @var array<string> $extraKeysValues */
            $extraKeysValues = array_values($extraKeys);
            /** @var array<string> $extraValuesValues */
            $extraValuesValues = array_values($extraValues);
            $profiles = str_replace($extraKeysValues, $extraValuesValues, $profiles);
            $profiles = str_replace(',,', ',', $profiles);

            // External plugins are provided at runtime via rex_view::setJsProperty() in Assets::provideBaseAssets()
            // This ensures correct absolute URLs. The empty object here serves only as a fallback.
            // See base.js: rex.tinyExternalPlugins (runtime) takes precedence over tinyExternalPlugins (static).
            $externalPluginsJs = '{}';

            // CleanPaste config – embedded here so it works in frontend too (rex_view::setJsProperty is backend-only)
            $cleanPasteCfg = self::getAddon()->getConfig('cleanpaste_settings', [
                'strip_ms_office'        => true,
                'strip_google_docs'      => true,
                'remove_styles'          => true,
                'preserve_styles'        => [],
                'remove_classes'         => true,
                'preserve_classes'       => [],
                'remove_ids'             => true,
                'remove_data_attrs'      => true,
                'max_br'                 => 2,
                'max_empty_paragraphs'   => 2,
                'allowed_tags'           => [],
            ]);
            $cleanPasteConfigJs = json_encode($cleanPasteCfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            // MediaUpload config – embedded here so it works in frontend too
            /** @var array{upload_enabled?: bool, upload_default_category?: int, upload_media_manager_type?: string} $mediaUploadSettings */
            $mediaUploadSettings = self::getAddon()->getConfig('media_upload_settings', []);
            $mediaUploadCfg = [
                'enabled'          => (bool) ($mediaUploadSettings['upload_enabled'] ?? false),
                'default_category' => (int) ($mediaUploadSettings['upload_default_category'] ?? -1),
                'upload_url'       => rex_url::backendController(['rex-api-call' => 'tinymce_media_upload'], false),
                'categories_url'   => rex_url::backendController(['rex-api-call' => 'tinymce_media_categories'], false),
            ];
            $mediaUploadConfigJs = json_encode($mediaUploadCfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            $content =
                "
const tinyExternalPlugins = $externalPluginsJs;
const tinyCleanPasteConfig = $cleanPasteConfigJs;
const tinyMediaUploadConfig = $mediaUploadConfigJs;
const tinyprofiles = $profiles;
";
        }

        if (!rex_file::put(self::getAddon()->getAssetsPath('generated/' . self::PROFILES_FILENAME), $content)) {
            throw new rex_functional_exception(rex_i18n::msg('tinymce_profiles_creation_exception'));
        }
    }

    /**
     * @param array<string, mixed> $profile
     * @return string|array<mixed>
     */
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
