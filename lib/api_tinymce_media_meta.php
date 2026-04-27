<?php

declare(strict_types=1);

/**
 * Liefert Metadaten zu einer Mediapool-Datei für TinyMCE-Plugins.
 *
 * Aufruf: ?rex-api-call=tinymce_media_meta&file=foo.jpg
 *
 * Antwort:
 * {
 *   "file": "foo.jpg",
 *   "exists": true,
 *   "extension": "jpg",
 *   "title": "...",
 *   "alt": "...",
 *   "description": "...",
 *   "copyright": "..."
 * }
 *
 * Wird primär vom `for_images`-Plugin verwendet, um beim Bild-Dialog
 * den Alt-Text aus dem Mediapool (Feld `med_alt`, sofern vorhanden) zu
 * übernehmen, wenn das Alt-Feld noch leer ist.
 */
class rex_api_tinymce_media_meta extends rex_api_function
{
    /** @var bool */
    protected $published = true;

    public function execute()
    {
        rex_response::cleanOutputBuffers();

        // Nur eingeloggte Backend-User dürfen Mediapool-Metadaten lesen.
        if (null === rex::getUser()) {
            rex_response::setStatus(rex_response::HTTP_FORBIDDEN);
            rex_response::sendJson(['error' => 'Authentication required']);
            exit;
        }

        $file = (string) rex_request('file', 'string', '');
        $data = self::buildMeta($file);

        rex_response::sendJson($data);
        exit;
    }

    /**
     * @return array{file:string,exists:bool,extension:string,title:string,alt:string,description:string,copyright:string}
     */
    public static function buildMeta(string $file): array
    {
        $file = basename($file);
        $result = [
            'file' => $file,
            'exists' => false,
            'extension' => strtolower((string) pathinfo($file, PATHINFO_EXTENSION)),
            'title' => '',
            'alt' => '',
            'description' => '',
            'copyright' => '',
        ];

        if ('' === $file) {
            return $result;
        }

        $media = rex_media::get($file);
        if (null === $media) {
            return $result;
        }

        $result['exists'] = true;
        $result['title'] = (string) ($media->getTitle() ?: pathinfo($file, PATHINFO_FILENAME));

        // Custom Mediapool-Felder (metainfo-Addon). Reihenfolge: bevorzugt
        // `med_alt`, sonst gängige Alternativen.
        foreach (['med_alt', 'med_alttext', 'med_alt_text'] as $key) {
            $val = self::mediaValue($media, $key);
            if ('' !== $val) {
                $result['alt'] = $val;
                break;
            }
        }
        // Fallback: Title als Alt, wenn kein med_alt vorhanden.
        if ('' === $result['alt']) {
            $result['alt'] = $result['title'];
        }

        $result['description'] = self::mediaValue($media, 'med_description');
        $result['copyright'] = self::mediaValue($media, 'med_copyright');

        return $result;
    }

    /**
     * Liest ein Custom-Feld vom rex_media-Objekt aus, ohne Notice wenn
     * das Feld nicht existiert.
     */
    private static function mediaValue(rex_media $media, string $key): string
    {
        try {
            $value = $media->getValue($key);
        } catch (rex_exception $e) {
            return '';
        }
        if (null === $value || false === $value) {
            return '';
        }
        return trim((string) $value);
    }
}
