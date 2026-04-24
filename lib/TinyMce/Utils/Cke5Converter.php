<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

/**
 * Konverter für CKEditor 5 Custom Styles / Link Decorators / Heading-Options
 * in TinyMCE-kompatible `style_formats`.
 *
 * Unterstützt folgende CKE5-Strukturen:
 *   1) Array aus Objekten mit Keys → { mode, label, classes: [] }
 *      (typische "styles"-Definition von Link- und Textformaten)
 *   2) Array/Einzelobjekt mit attributes.class als String
 *      (Link-Decorator-Format)
 *   3) Object mit heading.options: [ { model, view:{name,classes,attributes.class}, title } ]
 *   4) Beliebige gemischte Strukturen – der Konverter sucht rekursiv nach Styles.
 */
final class Cke5Converter
{
    /**
     * @param string $json       Roher JSON-String aus CKE5
     * @param string $groupTitle Optionaler Gruppen-Titel (Default: 'CKE5 Migrated').
     *                           Üblicherweise wird hier der Styleset-Name übergeben,
     *                           damit das TinyMCE-Dropdown sprechende Labels bekommt.
     * @return array{formats: array<int, array<string, mixed>>, warnings: list<string>}
     */
    public static function convert(string $json, string $groupTitle = 'CKE5 Migrated'): array
    {
        $warnings = [];
        $data = json_decode($json, true);

        if (null === $data) {
            return [
                'formats' => [],
                'warnings' => ['Ungültiges JSON: ' . json_last_error_msg()],
            ];
        }

        $items = [];
        self::walk($data, $items, $warnings);

        if ([] === $items) {
            $warnings[] = 'Keine verwertbaren Styles erkannt.';
            return ['formats' => [], 'warnings' => $warnings];
        }

        $title = trim($groupTitle);
        if ('' === $title) {
            $title = 'CKE5 Migrated';
        }

        // Einzelne Gruppe erzeugen (der Nutzer kann im Editor weiter gruppieren).
        $formats = [
            [
                'title' => $title,
                'items' => $items,
            ],
        ];

        return ['formats' => $formats, 'warnings' => $warnings];
    }

    /**
     * Rekursiv durchsuchen und gefundene Style-Objekte in TinyMCE-Items übersetzen.
     *
     * @param mixed $node
     * @param list<array<string, mixed>> $items
     * @param list<string> $warnings
     */
    private static function walk($node, array &$items, array &$warnings): void
    {
        if (!is_array($node)) {
            return;
        }

        // Spezialfall: Heading-Options
        if (isset($node['heading']) && is_array($node['heading']) && isset($node['heading']['options']) && is_array($node['heading']['options'])) {
            foreach ($node['heading']['options'] as $opt) {
                $mapped = self::mapHeadingOption($opt);
                if (null !== $mapped) {
                    $items[] = $mapped;
                }
            }
            // Nicht abbrechen – andere Keys weiter durchsuchen
        }

        foreach ($node as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            // Ein klassisches CKE5 Style-Objekt erkennt man an:
            //  - vorhandenem 'label' und 'classes' ODER
            //  - 'attributes.class' (Link-Decorator)
            if (self::looksLikeStyleDefinition($value)) {
                $mapped = self::mapStyleDefinition(is_string($key) ? $key : null, $value);
                if (null !== $mapped) {
                    $items[] = $mapped;
                    continue;
                }
            }

            // Rekursiv weiter
            self::walk($value, $items, $warnings);
        }
    }

    /**
     * @param array<string, mixed> $def
     */
    private static function looksLikeStyleDefinition(array $def): bool
    {
        if (isset($def['label']) && (isset($def['classes']) || (isset($def['attributes']) && is_array($def['attributes']) && isset($def['attributes']['class'])))) {
            return true;
        }
        // Alternative: nur attributes.class ohne label (Link-Decorator)
        if (isset($def['attributes']) && is_array($def['attributes']) && isset($def['attributes']['class']) && isset($def['label'])) {
            return true;
        }
        return false;
    }

    /**
     * @param array<string, mixed> $def
     * @return array<string, mixed>|null
     */
    private static function mapStyleDefinition(?string $modelKey, array $def): ?array
    {
        $title = isset($def['label']) ? (string) $def['label'] : (string) ($modelKey ?? 'Unbenannt');

        // Klassen extrahieren
        $classes = '';
        if (isset($def['classes'])) {
            if (is_array($def['classes'])) {
                $classes = trim(implode(' ', array_map('strval', $def['classes'])));
            } elseif (is_string($def['classes'])) {
                $classes = trim($def['classes']);
            }
        } elseif (isset($def['attributes']) && is_array($def['attributes']) && isset($def['attributes']['class'])) {
            $classes = trim((string) $def['attributes']['class']);
        }

        if ('' === $classes) {
            return null;
        }

        // Heuristik: Key beginnt mit 'buttonlink' oder 'link' → selector: a
        $selector = 'a';
        if (null !== $modelKey) {
            $keyLower = strtolower($modelKey);
            if (str_starts_with($keyLower, 'button') || str_starts_with($keyLower, 'link') || str_contains($keyLower, 'modal')) {
                $selector = 'a';
            }
        }

        return [
            'title' => $title,
            'selector' => $selector,
            'classes' => $classes,
        ];
    }

    /**
     * @param mixed $opt
     * @return array<string, mixed>|null
     */
    private static function mapHeadingOption($opt): ?array
    {
        if (!is_array($opt)) {
            return null;
        }

        $title = (string) ($opt['title'] ?? $opt['model'] ?? 'Heading');

        // Blocktyp ermitteln
        $block = null;
        $inline = null;
        $classes = '';

        if (isset($opt['view'])) {
            if (is_string($opt['view'])) {
                // 'h6' direkt als Tag-Name
                $block = $opt['view'];
            } elseif (is_array($opt['view'])) {
                $name = isset($opt['view']['name']) ? (string) $opt['view']['name'] : '';
                // span = inline, alles andere = block
                if ('span' === strtolower($name)) {
                    $inline = $name;
                } elseif ('' !== $name) {
                    $block = $name;
                }

                // Klassen aus view.classes (String oder Array)
                if (isset($opt['view']['classes'])) {
                    if (is_array($opt['view']['classes'])) {
                        $classes = trim(implode(' ', array_map('strval', $opt['view']['classes'])));
                    } else {
                        $classes = trim((string) $opt['view']['classes']);
                    }
                }

                // Klassen aus view.attributes.class
                if (isset($opt['view']['attributes']) && is_array($opt['view']['attributes']) && isset($opt['view']['attributes']['class'])) {
                    $cls = trim((string) $opt['view']['attributes']['class']);
                    $classes = '' === $classes ? $cls : $classes . ' ' . $cls;
                }
            }
        }

        // Paragraph ohne View = normales <p>
        if (null === $block && null === $inline) {
            $model = strtolower((string) ($opt['model'] ?? ''));
            if ('paragraph' === $model) {
                $block = 'p';
            } else {
                return null;
            }
        }

        $result = ['title' => $title];
        if (null !== $block) {
            $result['block'] = $block;
        }
        if (null !== $inline) {
            $result['inline'] = $inline;
        }
        if ('' !== $classes) {
            $result['classes'] = $classes;
        }

        return $result;
    }
}
