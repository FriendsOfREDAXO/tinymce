<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

namespace TinyMCE5\Creator;


use TinyMCE5\Handler\TinyMCE5DatabaseHandler;
use rex_file;

class TinyMCE5ProfilesCreator
{
    const UPLOAD_URL = './index.php?tinymce5upload=1';
    const PROFILES_FILENAME = 'tinymce5_profiles.js';

    /**
     * @param null|array $profile
     * @throws \rex_functional_exception
     * @author Joachim Doerr
     */
    public static function profilesCreate($getProfile = null)
    {
        $profiles = TinyMCE5DatabaseHandler::getAllProfiles();
        $content = '';
        if (sizeof($profiles) > 0) {
            $jsonProfiles = [];
            $extras = [];

            foreach ($profiles as $profile) {

                if (isset($getProfile['name']) && $profile['name'] == $getProfile['name']) {
                    $profile = $getProfile;
                }

                $result = self::mapProfile($profile);

                $picker_callback = 'rex5_picker_function(callback, value, meta);';
                $instance_callback = 'rex5_init_callback(theEditor);';
                $setup = 'rex5_setup_callback(theEditor);';

                $extras[uniqid()] = $result;
                $extras[uniqid()] = "
                    file_picker_callback: function (callback, value, meta) {
                        $picker_callback
                    },
                    init_instance_callback: function (theEditor) {
                        $instance_callback
                    },
                    setup: function (theEditor) {
                        $setup
                    }
                ";

                foreach ($extras as $key => $extra) {
                    $jsonProfiles[$profile['name']][$key] = $key;
                }
            }

            $extraValues = array();
            $extraKeys = array();
            foreach ($extras as $key => $value) {
                $extraKeys[$key] = "\"$key\":\"$key\"";
                $extraValues[$key] = $value;
            }

            $profiles = json_encode($jsonProfiles);
            $profiles = str_replace(array_values($extraKeys), array_values($extraValues), $profiles);

            $content =
                "
const tiny5profiles = $profiles;
";
        }

        if (!rex_file::put(self::getAddon()->getAssetsPath(self::PROFILES_FILENAME), $content)) {
            throw new \rex_functional_exception(\rex_i18n::msg('tinymce5_profiles_creation_exception'));
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
        return \rex_addon::get('tinymce5');
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