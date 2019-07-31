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

            foreach ($profiles as $profile) {

                if (isset($getProfile['name']) && $profile['name'] == $getProfile['name']) {
                    $profile = $getProfile;
                }

                $result = self::mapProfile($profile);
                $jsonProfiles[$profile['name']] = $result['profile'];

            }

            $profiles = json_encode($jsonProfiles);

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
        dump($profile);die;

        $toolbar = self::toArray($profile['toolbar']);
        $jsonProfile = ['toolbar' => $toolbar];

        if (!empty($profile['image_toolbar'])) {
            $imageKeys = self::toArray($profile['image_toolbar']);
            $jsonProfile['image'] = ['toolbar' => self::getImageToolbar($imageKeys), 'styles' => self::getImageStyles($imageKeys)];
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