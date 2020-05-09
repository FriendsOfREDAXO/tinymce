<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

namespace TinyMCE5\Handler;


use rex;
use rex_addon;
use rex_extension;
use rex_extension_point;
use rex_response;

class TinyMCE5UploadHandler
{
    const MEDIA_TYPE_PATH = '/index.php?rex_media_type=%s&rex_media_file=';
    const MEDIA_PATH = '/media/';

    /**
     * @author Joachim Doerr
     */
    public static function uploadTinyMCE5Img()
    {
        if (!function_exists('rex_mediapool_saveMedia')) {
            if (rex_addon::exists('mediapool') && rex_addon::get('mediapool')->isAvailable()) {
                require_once rex_addon::get('tinymce5')->getPath('../mediapool/functions/function_rex_mediapool.php');
            }
        }

        if ($_FILES['file']['name'] != '' && rex_mediapool_isAllowedMediaType($_FILES['file']['name'])) {

            $mediaCategory = \rex_request::get('media_category', 'int', 0);
            $return = rex_mediapool_saveMedia($_FILES['file'], $mediaCategory, ['title'=>''], rex::getUser()->getValue('login'));

            if ($return['ok'] == 1) {
                rex_extension::registerPoint(new rex_extension_point('MEDIA_ADDED', '', $return));
            }

            // $mediaType = \rex_request::get('media_type', 'string', '');
             $mediaSrcPath = '/' . \rex_request::get('media_path', 'string', self::MEDIA_PATH) . '/';

             if (!empty($mediaType)) {
                 $mediaSrcPath = sprintf(self::MEDIA_TYPE_PATH, $mediaType);
             }

            $statusCode = 201;
            $response = [
                'fileName' => $return['filename'],
                'uploaded' => 1,
                'error' => null,
                'location' => $mediaSrcPath . $return['filename'],
            ];

        } else {

            $statusCode = 500;
            $response = [
                'fileName' => null,
                'uploaded' => [
                    'number'    => 500,
                    'message'   => 'Internal server error. The uploaded file was failed',
                ],
                'error' => null,
                'location' => null,
            ];

        }

        rex_response::cleanOutputBuffers();
        rex_response::sendContentType('application/json');
        rex_response::setHeader('status', $statusCode);
        rex_response::sendContent(json_encode($response));
        exit;

    }
}