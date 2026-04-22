<?php

/**
 * Handles image uploads from TinyMCE drag & drop / paste.
 * Validates permissions and uses rex_media_service to add the file to the mediapool.
 * Returns JSON: {"location": "URL"} on success, {"error": "message"} on failure.
 */
class rex_api_tinymce_media_upload extends rex_api_function
{
    /** @var bool */
    protected $published = true;

    /** @var bool – CSRF not applicable for XHR file uploads (same-origin, session protected) */
    protected $csrfProtection = false;

    public function execute(): rex_api_result
    {
        rex_response::cleanOutputBuffers();

        $addon = rex_addon::get('tinymce');

        /** @var array{upload_enabled?: bool, upload_default_category?: int, upload_media_manager_type?: string} $settings */
        $settings = $addon->getConfig('media_upload_settings', []);
        $uploadEnabled = (bool) ($settings['upload_enabled'] ?? false);

        if (!$uploadEnabled) {
            http_response_code(403);
            rex_response::sendJson(['error' => 'Upload disabled in TinyMCE settings']);
            exit;
        }

        $user     = rex::getUser();
        $categoryId = rex_request('category_id', 'int', -1);

        if ($user !== null) {
            // ---- Backend user: validate media permissions ----
            /** @var rex_media_perm $mediaPerm */
            $mediaPerm = $user->getComplexPerm('media');

            if (!$mediaPerm->hasMediaPerm()) {
                http_response_code(403);
                rex_response::sendJson(['error' => 'No media permission']);
                exit;
            }

            // Category 0 = root is always allowed for users with any media perm.
            // For specific categories, check explicit permission.
            if ($categoryId > 0 && !$mediaPerm->hasAll() && !$mediaPerm->hasCategoryPerm($categoryId)) {
                http_response_code(403);
                rex_response::sendJson(['error' => 'No permission for this media category']);
                exit;
            }

            if ($categoryId < 0) {
                $categoryId = 0;
            }
        } else {
            // ---- No user (frontend context): use configured default category ----
            $defaultCategory = (int) ($settings['upload_default_category'] ?? -1);
            if ($defaultCategory < 0) {
                http_response_code(403);
                rex_response::sendJson(['error' => 'Unauthorized: no default upload category configured']);
                exit;
            }
            $categoryId = $defaultCategory;
        }

        // ---- Validate uploaded file ----
        /** @var array{name?: string, tmp_name?: string, error?: int, size?: int, type?: string}|null $file */
        $file = $_FILES['file'] ?? null;

        if ($file === null || empty($file['name']) || empty($file['tmp_name'])) {
            http_response_code(400);
            rex_response::sendJson(['error' => 'No file provided']);
            exit;
        }

        // Only images are accepted (mime type check on the actual file content)
        $mimeType = (string) rex_file::mimeType($file['tmp_name']);
        if (!str_starts_with($mimeType, 'image/')) {
            http_response_code(400);
            rex_response::sendJson(['error' => 'Only image files are allowed']);
            exit;
        }

        // ---- Upload to mediapool ----
        try {
            $result = rex_media_service::addMedia([
                'category_id' => $categoryId,
                'title'       => pathinfo($file['name'], PATHINFO_FILENAME),
                'file'        => $file,
            ]);

            $filename = $result['filename'];

            // Build the URL for TinyMCE to use as img src
            $mediaManagerType = trim((string) ($settings['upload_media_manager_type'] ?? ''));
            if ($mediaManagerType !== '' && rex_addon::get('media_manager')->isAvailable()) {
                $url = rex_url::base('media/' . $mediaManagerType . '/' . rawurlencode($filename));
            } else {
                $url = rex_url::base('media/' . rawurlencode($filename));
            }

            rex_response::sendJson(['location' => $url]);
        } catch (rex_api_exception $e) {
            http_response_code(400);
            rex_response::sendJson(['error' => $e->getMessage()]);
        }

        exit;
    }
}
