<?php

declare(strict_types=1);

/**
 * Liefert Metadaten zu einer Mediapool-Datei für TinyMCE-Plugins.
 *
 * Aufruf: ?rex-api-call=tinymce_media_meta&file=foo.jpg&clang=2
 *
 * Antwort:
 * {
 *   "file": "foo.jpg",
 *   "exists": true,
 *   "extension": "jpg",
 *   "title": "...",
 *   "alt": "...",
 *   "description": "...",
 *   "copyright": "...",
 *   "altMultilingual": false,
 *   "altLanguages": [{"clangId": 1, "label": "Deutsch", "value": "..."}]
 * }
 *
 * Wird primär vom `for_images`-Plugin und rex5_picker_function (base.js)
 * verwendet, um beim Bild-Dialog den Alt-Text aus dem Mediapool zu
 * übernehmen. Bevorzugt das MediaPlace-eigene ALT-Feld (Widget-Typ "alt",
 * `med_json_data`), sonst ein klassisches Metainfo-Feld (`med_alt` o.ä.),
 * das auch ein metainfo_lang_fields-Typ sein darf. Identische
 * Auflösungslogik wie das cke5-Addon (lib/api_cke5_media_meta.php).
 */
class rex_api_tinymce_media_meta extends rex_api_function
{
    /** @var bool */
    protected $published = true;

    private const CLASSIC_ALT_KEYS = ['med_alt', 'med_alttext', 'med_alt_text'];

    private const LANG_FIELD_TYPES = ['lang_text', 'lang_textarea', 'lang_text_all', 'lang_textarea_all'];

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
        $clang = rex_request('clang', 'int', 0);
        $data = self::buildMeta($file, $clang > 0 ? $clang : null);

        rex_response::sendJson($data);
        exit;
    }

    /**
     * @return array{file:string,exists:bool,extension:string,title:string,alt:string,description:string,copyright:string,altMultilingual:bool,altLanguages:list<array{clangId:int,label:string,value:string}>}
     */
    public static function buildMeta(string $file, ?int $clangId = null): array
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
            'altMultilingual' => false,
            'altLanguages' => [],
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

        $altByClang = self::resolveOwnFieldAlt($media);
        if (null === $altByClang) {
            $altByClang = self::resolveClassicOrLangAlt($media);
        }

        $nonEmpty = array_filter($altByClang, static fn (string $v) => '' !== $v);
        $result['altMultilingual'] = count($nonEmpty) > 1;
        foreach ($nonEmpty as $id => $value) {
            $clang = rex_clang::get($id);
            $result['altLanguages'][] = [
                'clangId' => $id,
                'label' => $clang ? $clang->getName() : (string) $id,
                'value' => $value,
            ];
        }

        $result['alt'] = self::pickValue($altByClang, $clangId);
        // Fallback: Title als Alt, wenn kein med_alt vorhanden.
        if ('' === $result['alt']) {
            $result['alt'] = $result['title'];
        }

        $result['description'] = self::mediaValue($media, 'med_description');
        $result['copyright'] = self::mediaValue($media, 'med_copyright');

        return $result;
    }

    /**
     * MediaPlace-eigenes ALT-Feld (Widget-Typ "alt", Speicherung in
     * med_json_data). Liefert null, wenn MediaPlace nicht aktiv ist oder
     * kein eigenes ALT-Feld konfiguriert wurde.
     *
     * @return array<int, string>|null clangId => Wert
     */
    private static function resolveOwnFieldAlt(rex_media $media): ?array
    {
        if (!rex_addon::get('mediaplace')->isAvailable()) {
            return null;
        }
        if (!class_exists(\FriendsOfRedaxo\Mediaplace\AltTextStatus::class)) {
            return null;
        }

        $field = \FriendsOfRedaxo\Mediaplace\AltTextStatus::resolveOwnAltField();
        if (null === $field) {
            return null;
        }

        $json = json_decode((string) $media->getValue('med_json_data'), true);
        $ownData = is_array($json) ? $json : [];
        $fieldData = $ownData[$field->getKey()] ?? null;
        if (!is_array($fieldData) || !empty($fieldData['decorative'])) {
            return [];
        }

        $byClang = [];
        foreach ((array) ($fieldData['text'] ?? []) as $clangId => $value) {
            $byClang[(int) $clangId] = trim((string) $value);
        }

        return $byClang;
    }

    /**
     * Klassisches Metainfo-Feld (med_alt/med_alttext/med_alt_text), das
     * entweder ein normaler Skalarwert oder ein metainfo_lang_fields-Typ
     * sein kann.
     *
     * @return array<int, string> clangId => Wert (clangId 0 = sprachunabhängig)
     */
    private static function resolveClassicOrLangAlt(rex_media $media): array
    {
        foreach (self::CLASSIC_ALT_KEYS as $key) {
            if (!self::metainfoFieldExists($key)) {
                continue;
            }

            if (self::isLangFieldType($key) && rex_addon::get('metainfo_lang_fields')->isAvailable()
                && class_exists(\FriendsOfRedaxo\MetaInfoLangFields\MetainfoLangHelper::class)
            ) {
                $raw = $media->getValue($key);
                $normalized = \FriendsOfRedaxo\MetaInfoLangFields\MetainfoLangHelper::normalizeLanguageData($raw);
                $byClang = [];
                foreach ($normalized as $item) {
                    $byClang[(int) $item['clang_id']] = trim((string) $item['value']);
                }
                if ([] !== $byClang) {
                    return $byClang;
                }
                continue;
            }

            $value = self::mediaValue($media, $key);
            if ('' !== $value) {
                return [0 => $value];
            }
        }

        return [];
    }

    private static function isLangFieldType(string $fieldName): bool
    {
        $sql = rex_sql::factory();
        $sql->setQuery(
            'SELECT t.label FROM ' . rex::getTable('metainfo_field') . ' f
             JOIN ' . rex::getTable('metainfo_type') . ' t ON t.id = f.type_id
             WHERE f.name = :name',
            ['name' => $fieldName],
        );
        if (1 !== $sql->getRows()) {
            return false;
        }

        return in_array((string) $sql->getValue('label'), self::LANG_FIELD_TYPES, true);
    }

    private static function metainfoFieldExists(string $name): bool
    {
        if (!rex_addon::get('metainfo')->isAvailable()) {
            return false;
        }

        $sql = rex_sql::factory();
        $exists = $sql->getArray(
            'SELECT id FROM ' . rex::getTable('metainfo_field') . ' WHERE name = :name',
            ['name' => $name],
        );

        return [] !== $exists;
    }

    /**
     * @param array<int, string> $byClang
     */
    private static function pickValue(array $byClang, ?int $clangId): string
    {
        if ([] === $byClang) {
            return '';
        }

        // Sprachunabhängiger Skalarwert (klassisches Feld ohne lang-Typ).
        if (isset($byClang[0]) && 1 === count($byClang)) {
            return $byClang[0];
        }

        $wanted = $clangId ?? rex_clang::getCurrentId();
        if (isset($byClang[$wanted]) && '' !== $byClang[$wanted]) {
            return $byClang[$wanted];
        }

        $startId = rex_clang::getStartId();
        if (isset($byClang[$startId]) && '' !== $byClang[$startId]) {
            return $byClang[$startId];
        }

        foreach ($byClang as $value) {
            if ('' !== $value) {
                return $value;
            }
        }

        return '';
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
        if (null === $value) {
            return '';
        }
        return trim((string) $value);
    }
}
