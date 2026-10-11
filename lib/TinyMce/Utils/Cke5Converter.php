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
 *   4) Liste aus Style-Definitionen des REDAXO-cke5-AddOns (Style-Gruppen, Spalte
 *      `json_config`, bzw. `style.definitions`): [ { name, element, classes: [] } ]
 *      – das Element bestimmt das TinyMCE-Format (selector/inline, siehe mapElement()).
 *   5) Beliebige gemischte Strukturen – der Konverter sucht rekursiv nach Styles.
 */
final class Cke5Converter
{
    /**
     * Elemente, deren Style per `selector` auf ein bestehendes Element gesetzt wird
     * (CKE5-Style-Plugin: Style ist nur verfügbar, wenn das Element markiert ist).
     */
    private const SELECTOR_ELEMENTS = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'blockquote', 'pre', 'address',
        'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'caption',
        'figure', 'figcaption', 'img', 'a', 'section', 'article', 'aside', 'hr',
    ];

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
            //  - 'attributes.class' (Link-Decorator) ODER
            //  - 'name', 'element' und 'classes' (Style-Definition / cke5-AddOn)
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
        // CKE5-Style-Definition (style.definitions bzw. cke5-AddOn json_config):
        // { name, element, classes } – 'element' ist Pflicht, damit z. B.
        // heading.options[].view ({ name: 'h2', classes }) nicht doppelt erkannt wird.
        if (isset($def['name'], $def['element'], $def['classes']) && is_string($def['element'])) {
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
        if (isset($def['label'])) {
            $title = (string) $def['label'];
        } elseif (isset($def['name']) && is_string($def['name'])) {
            $title = $def['name'];
        } else {
            $title = (string) ($modelKey ?? 'Unbenannt');
        }

        // Klassen extrahieren
        $classes = '';
        if (isset($def['classes'])) {
            if (is_array($def['classes'])) {
                $classes = trim(implode(' ', array_map('strval', $def['classes'])));
            } elseif (is_string($def['classes'])) {
                // cke5-AddOn speichert Einzel-Styles kommagetrennt ("a,b")
                $classes = trim(implode(' ', preg_split('/[\s,]+/', $def['classes'], -1, PREG_SPLIT_NO_EMPTY) ?: []));
            }
        } elseif (isset($def['attributes']) && is_array($def['attributes']) && isset($def['attributes']['class'])) {
            $classes = trim((string) $def['attributes']['class']);
        }

        if ('' === $classes) {
            return null;
        }

        // Mit 'element' (CKE5-Style-Definition): Format passend zum Element
        if (isset($def['element']) && is_string($def['element']) && '' !== trim($def['element'])) {
            return ['title' => $title] + self::mapElement($def['element']) + ['classes' => $classes];
        }

        // Ohne Element (Link-Decorator / Custom-Styles der Link-Toolbar) → selector: a
        return [
            'title' => $title,
            'selector' => 'a',
            'classes' => $classes,
        ];
    }

    /**
     * CKE5-Element → TinyMCE-Formatschlüssel.
     *
     * - Block-, Listen-, Tabellen- und Medien-Elemente sowie `a` → `selector`
     *   (Klasse wird auf das markierte, vorhandene Element gesetzt – wie im CKE5-Style-Plugin)
     * - übrige Inline-Elemente (`span`, `strong`, `mark`, `code` …) → `inline`
     *   (Markierung wird mit dem Element umschlossen)
     *
     * @return array{selector: string}|array{inline: string}
     */
    private static function mapElement(string $element): array
    {
        $element = strtolower(trim($element));
        if (!preg_match('/^[a-z][a-z0-9-]*$/', $element)) {
            return ['selector' => 'a'];
        }
        if (in_array($element, self::SELECTOR_ELEMENTS, true)) {
            return ['selector' => $element];
        }
        return ['inline' => $element];
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
