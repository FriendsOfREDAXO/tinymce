<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use rex;
use rex_sql;
use rex_sql_exception;
use FriendsOfRedaxo\TinyMce\Creator\Profiles;

class ProfileHelper
{
    /**
     * Ensures that a TinyMCE profile exists.
     *
     * @param string $name The unique name of the profile
     * @param string $description A description for the profile
        * @param array<string, mixed> $data Configuration data (profile, optional media settings)
     * @param bool $forceUpdate If true, overwrites existing profile data
     * @return bool True if created or updated, false if it already existed and forceUpdate was false
     * @throws rex_sql_exception
     */
    public static function ensureProfile(string $name, string $description, array $data = [], bool $forceUpdate = false): bool
    {
        $sql = rex_sql::factory();
        $sql->setTable(rex::getTable('tinymce_profiles'));
        $sql->setWhere(['name' => $name]);
        $sql->select();

        $exists = $sql->getRows() > 0;

        if ($exists && !$forceUpdate) {
            return false;
        }

        $sql->setTable(rex::getTable('tinymce_profiles'));
        $sql->setValue('name', $name);
        $sql->setValue('description', $description);

        // Backward compatibility for older integration code using 'extra'.
        if (!isset($data['profile']) && array_key_exists('extra', $data)) {
            $data['profile'] = $data['extra'];
        }

        // Default values (profile is the single source of truth for profile config)
        $defaults = [
            'profile' => '',
        ];

        $data = array_merge($defaults, $data);

        foreach ($defaults as $key => $value) {
            if (isset($data[$key])) {
                $sql->setValue($key, $data[$key]);
            }
        }

        if ($exists) {
            $sql->setWhere(['name' => $name]);
            $sql->addGlobalUpdateFields();
            $sql->update();
        } else {
            $sql->addGlobalCreateFields();
            $sql->insert();
        }

        // Trigger profile recreation
        Profiles::profilesCreate();

        return true;
    }

    /**
     * Imports one or more TinyMCE profiles from a JSON file.
     *
    * @param string $filePath Absolute path to the JSON file
    * @param bool $forceUpdate If true, overwrites existing profile data
    * @param list<string> $onlyNames Optional list of profile names to import. If empty, all profiles are imported.
    * @return bool True if at least one profile was successfully created or updated
    * @throws rex_sql_exception
    */
    public static function importProfileFromJson(string $filePath, bool $forceUpdate = false, array $onlyNames = []): bool
    {
        $content = \rex_file::get($filePath);
        if ($content === null) {
            return false;
        }

        $data = json_decode($content, true);
        if (!is_array($data)) {
            return false;
        }

        $items = isset($data['name']) ? [$data] : $data;
        $success = false;

        foreach ($items as $item) {
            // Guard against malformed JSON where an item is not an array (e.g. a scalar in a mixed JSON array).
            if (!is_array($item)) {
                continue;
            }
            // Filter by name if a whitelist was given.
            if ([] !== $onlyNames && !in_array($item['name'] ?? '', $onlyNames, true)) {
                continue;
            }
            // Name/description validation and field filtering happen in normalizeImportedProfile().
            if (self::ensureProfileFromImportedArray($item, $forceUpdate)) {
                $success = true;
            }
        }

        return $success;
    }

    /**
     * Converts an exported/imported profile array into ensureProfile arguments.
     *
     * @param array<string, mixed> $profile
     * @return array{name: string, description: string, data: array<string, mixed>}|null
     */
    public static function normalizeImportedProfile(array $profile): ?array
    {
        $name = trim((string) ($profile['name'] ?? ''));
        if ('' === $name) {
            return null;
        }

        $description = trim((string) ($profile['description'] ?? ''));
        if ('' === $description) {
            $description = 'Imported Profile';
        }

        // Backward compatibility for legacy exported JSON payloads using 'extra'.
        if (!array_key_exists('profile', $profile) && array_key_exists('extra', $profile)) {
            $profile['profile'] = $profile['extra'];
        }

        // Backward compatibility for legacy per-profile media settings fields.
        // Map them into the profile config body so import/export remains JSON-first.
        $profile['profile'] = self::mergeLegacyMediaFieldsIntoProfile($profile, (string) ($profile['profile'] ?? ''));

        $data = [
            'profile' => (string) $profile['profile'],
        ];

        return [
            'name' => $name,
            'description' => $description,
            'data' => $data,
        ];
    }

    /**
     * Imports one exported profile array.
     *
     * @param array<string, mixed> $profile
     * @param bool $forceUpdate If true, overwrites existing profile data
     * @return bool True if created or updated
     * @throws rex_sql_exception
     */
    public static function ensureProfileFromImportedArray(array $profile, bool $forceUpdate = false): bool
    {
        $normalized = self::normalizeImportedProfile($profile);
        if (null === $normalized) {
            return false;
        }

        return self::ensureProfile(
            $normalized['name'],
            $normalized['description'],
            $normalized['data'],
            $forceUpdate
        );
    }

    /**
     * Generates a ready-to-paste PHP code snippet for the given profile.
     * The snippet calls ensureProfile() and can be placed in any addon's install.php.
     *
     * @param array<string, mixed> $profile DB row or exported array (id/timestamps are ignored)
     * @return string Valid PHP code snippet
     */
    public static function generateEnsureProfileCode(array $profile): string
    {
        $normalized = self::normalizeImportedProfile($profile);
        if (null === $normalized) {
            return '';
        }

        $name = $normalized['name'];
        $description = $normalized['description'];
        $data = $normalized['data'];

        $i1 = '    ';
        $i2 = '        ';
        $i3 = '            ';

        $lines = [];
        $lines[] = "if (rex_addon::get('tinymce')->isAvailable() && class_exists(\\FriendsOfRedaxo\\TinyMce\\Utils\\ProfileHelper::class)) {";
        $lines[] = $i1 . "\\FriendsOfRedaxo\\TinyMce\\Utils\\ProfileHelper::ensureProfile(";
        $lines[] = $i2 . self::phpExportString($name) . ',';
        $lines[] = $i2 . self::phpExportString($description) . ',';
        $lines[] = $i2 . '[';

        $profileValue = (string) ($data['profile'] ?? '');
        if ('' !== trim($profileValue)) {
            $lines[] = $i3 . "'profile' => " . self::phpExportString($profileValue) . ',';
        }

        $lines[] = $i2 . '],';
        $lines[] = $i2 . 'false // forceUpdate: true = always overwrite on addon update';
        $lines[] = $i1 . ');';
        $lines[] = '}';

        return implode("\n", $lines);
    }

    /**
     * Injects legacy media-related fields into the profile body if missing.
     * This keeps old JSON payloads importable while converging on profile-only config.
     *
     * @param array<string, mixed> $profile
     */
    private static function mergeLegacyMediaFieldsIntoProfile(array $profile, string $profileBody): string
    {
        $lines = [];

        $mediaType = trim((string) ($profile['mediatype'] ?? ''));
        if ('' !== $mediaType && 1 !== preg_match('/(?:^|[,\{\r\n])\s*tinymce_media_type\s*:/', $profileBody)) {
            $escapedType = str_replace("'", "\\'", $mediaType);
            $lines[] = "tinymce_media_type: '{$escapedType}',";
        }

        $mediaCategory = (int) ($profile['mediacategory'] ?? 0);
        if ($mediaCategory > 0 && 1 !== preg_match('/(?:^|[,\{\r\n])\s*mediapaste_default_category\s*:/', $profileBody)) {
            $lines[] = 'mediapaste_default_category: ' . $mediaCategory . ',';
        }

        $uploadDefaultRaw = trim((string) ($profile['upload_default'] ?? ''));
        if ('' !== $uploadDefaultRaw && 1 !== preg_match('/(?:^|[,\{\r\n])\s*mediapaste_allow_image_paste\s*:/', $profileBody)) {
            $normalized = strtolower($uploadDefaultRaw);
            if ('1' === $normalized || 'true' === $normalized) {
                $lines[] = 'mediapaste_allow_image_paste: true,';
            } elseif ('0' === $normalized || 'false' === $normalized) {
                $lines[] = 'mediapaste_allow_image_paste: false,';
            }
        }

        if ([] === $lines) {
            return $profileBody;
        }

        return implode("\n", $lines) . "\n" . ltrim($profileBody);
    }

    /**
     * Exports a PHP string value for use in generated PHP code.
     * Uses single-quoted strings for simple values and double-quoted strings
     * with escape sequences for values containing newlines, special characters, or single quotes.
     */
    private static function phpExportString(string $value): string
    {
        // Normalize CRLF to LF
        $value = str_replace("\r\n", "\n", $value);

        // Single-quoted string is sufficient when no special characters are present
        if (!str_contains($value, "\n") && !str_contains($value, "\t") && !str_contains($value, '\\') && !str_contains($value, "'")) {
            return "'" . $value . "'";
        }

        // Double-quoted string with explicit escape sequences for multiline values
        $escaped = str_replace(
            ['\\', '"', '$', "\n", "\r", "\t"],
            ['\\\\', '\\"', '\\$', '\\n', '\\r', '\\t'],
            $value
        );
        return '"' . $escaped . '"';
    }
}
