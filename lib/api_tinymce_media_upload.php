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

            // Root category and specific categories both require matching permission,
            // unless user has full media access.
            if ($categoryId >= 0 && !$mediaPerm->hasAll() && !$mediaPerm->hasCategoryPerm($categoryId)) {
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

        // Some clipboard sources provide mismatching filename extensions
        // (e.g. "*.jpg" while the blob is actually image/png). Normalize here
        // so mediapool validation does not reject valid image content.
        $file['name'] = self::normalizeFilenameForMime((string) $file['name'], $mimeType);

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

            // rex_url::base() returns a relative path like "../media/foo.png" when called
            // from a backend script. The browser would resolve that against the editor page
            // (e.g. an article in the frontend) and produce a wrong absolute URL. Resolve
            // the relative URL against the API request URI's directory to obtain a stable
            // root-relative URL like "/media/foo.png" (or "/<subdir>/media/foo.png").
            $url = self::makeRootRelative($url);

            rex_response::sendJson(['location' => $url]);
        } catch (rex_api_exception $e) {
            http_response_code(400);
            rex_response::sendJson(['error' => $e->getMessage()]);
        }

        exit;
    }

    private static function normalizeFilenameForMime(string $filename, string $mimeType): string
    {
        $filename = trim($filename);
        if ('' === $filename) {
            $filename = 'image';
        }

        $extByMime = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/avif' => 'avif',
            'image/svg+xml' => 'svg',
            'image/bmp' => 'bmp',
        ];

        $expectedExt = $extByMime[strtolower($mimeType)] ?? '';
        if ('' === $expectedExt) {
            return $filename;
        }

        $nameOnly = pathinfo($filename, PATHINFO_FILENAME);
        if ('' === $nameOnly) {
            $nameOnly = 'image';
        }

        $currentExt = strtolower((string) pathinfo($filename, PATHINFO_EXTENSION));
        if ($currentExt === $expectedExt) {
            return $filename;
        }

        // jpg/jpeg should be treated as equivalent extension.
        if (($currentExt === 'jpg' || $currentExt === 'jpeg') && $expectedExt === 'jpg') {
            return $filename;
        }

        return $nameOnly . '.' . $expectedExt;
    }

    /**
     * Resolves a (potentially relative) REDAXO URL against the current API request URI
     * and returns a stable root-relative URL such as "/media/foo.png" or
     * "/<subdir>/media/foo.png" for subdirectory installs.
     *
     * Accepts already absolute URLs (starting with "http(s)://", "//" or "/") unchanged.
     */
    private static function makeRootRelative(string $url): string
    {
        // Already absolute or root-relative – nothing to do.
        if (preg_match('#^([a-z][a-z0-9+.-]*:)?//#i', $url) === 1 || str_starts_with($url, '/')) {
            return $url;
        }

        $requestPath = (string) parse_url((string) rex_request::server('REQUEST_URI', 'string', '/'), PHP_URL_PATH);
        $baseDir = rtrim(str_replace('\\', '/', dirname($requestPath)), '/');

        $combined = $baseDir . '/' . $url;
        $parts = [];
        foreach (explode('/', $combined) as $segment) {
            if ('' === $segment || '.' === $segment) {
                continue;
            }
            if ('..' === $segment) {
                array_pop($parts);
                continue;
            }
            $parts[] = $segment;
        }

        return '/' . implode('/', $parts);
    }
}
