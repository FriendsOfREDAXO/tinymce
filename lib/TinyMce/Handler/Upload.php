<?php

namespace FriendsOfRedaxo\TinyMce\Handler;

use rex_addon;
use rex_exception;
use rex_media_service;
use rex_mediapool;
use rex_request;
use rex_response;

use function function_exists;

class Upload
{
    public const MEDIA_TYPE_PATH = '/index.php?rex_media_type=%s&rex_media_file=';
    public const MEDIA_PATH = '/media/';

    public static function uploadTinyMceImg(): void
    {
        if (!function_exists('rex_mediapool_saveMedia')) {
            if (rex_addon::exists('mediapool') && rex_addon::get('mediapool')->isAvailable()) {
                require_once rex_addon::get('tinymce')->getPath('../mediapool/functions/function_rex_mediapool.php');
            }
        }

        try {
            if ('' != $_FILES['file']['name']) {
                throw new rex_exception('The uploaded file was failed');
            }

            if (rex_mediapool::isAllowedExtension($_FILES['file']['name'])) {
                throw new rex_exception('The uploaded file was failed');
            }

            $mediaCategory = rex_request::get('media_category', 'int', 0);

            $data = [];
            $data['file'] = $_FILES['file'];
            $data['category_id'] = $mediaCategory;
            $data['title'] = '';

            $return = rex_media_service::addMedia($data);

            $mediaSrcPath = '/' . rex_request::get('media_path', 'string', self::MEDIA_PATH) . '/';

            // if (!empty($mediaType)) {
            //     $mediaSrcPath = sprintf(self::MEDIA_TYPE_PATH, $mediaType);
            // }

            $statusCode = rex_response::HTTP_OK;
            $response = [
                'fileName' => $return['filename'],
                'uploaded' => 1,
                'error' => null,
                'location' => $return['filename'],
            ];
        } catch (rex_exception $e) {
            $statusCode = rex_response::HTTP_BAD_REQUEST;
            $response = [
                'fileName' => null,
                'uploaded' => [
                    'number' => $statusCode,
                    'message' => 'Bad Request. ' . $e->getMessage(),
                ],
                'error' => null,
                'location' => null,
            ];
        }

        rex_response::cleanOutputBuffers();
        rex_response::sendContentType('application/json');
        rex_response::setHeader('status', $statusCode);
        rex_response::sendContent((string) json_encode($response));
        exit;
    }
}
