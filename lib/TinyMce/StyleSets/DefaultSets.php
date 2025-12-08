<?php

namespace FriendsOfRedaxo\TinyMce\StyleSets;

/**
 * Default Style-Sets für TinyMCE
 * 
 * Umfangreiche Style-Definitionen für gängige CSS-Frameworks.
 * Styles werden nur über CSS-Klassen angewendet, keine inline-Styles.
 */
class DefaultSets
{
    /**
     * UIkit 3 Style-Set
     */
    public static function getUikit3(): array
    {
        return [
            'name' => 'uikit3',
            'description' => 'UIkit 3 - Vollständige Styles für Überschriften, Text, Buttons, Listen, Tabellen und mehr',
            'content_css' => 'https://cdn.jsdelivr.net/npm/uikit@3/dist/css/uikit.min.css',
            'style_formats' => [
                [
                    'title' => 'Überschriften',
                    'items' => [
                        ['title' => 'Heading Primary', 'block' => 'h1', 'classes' => 'uk-heading-primary'],
                        ['title' => 'Heading Hero', 'block' => 'h1', 'classes' => 'uk-heading-hero'],
                        ['title' => 'Heading Divider', 'block' => 'h2', 'classes' => 'uk-heading-divider'],
                        ['title' => 'Heading Bullet', 'block' => 'h3', 'classes' => 'uk-heading-bullet'],
                        ['title' => 'Heading Line', 'block' => 'h3', 'classes' => 'uk-heading-line'],
                    ],
                ],
                [
                    'title' => 'Text',
                    'items' => [
                        ['title' => 'Lead Text', 'block' => 'p', 'classes' => 'uk-text-lead'],
                        ['title' => 'Meta Text', 'block' => 'p', 'classes' => 'uk-text-meta'],
                        ['title' => 'Drop Cap', 'block' => 'p', 'classes' => 'uk-dropcap'],
                        [
                            'title' => 'Größe',
                            'items' => [
                                ['title' => 'Small', 'inline' => 'span', 'classes' => 'uk-text-small'],
                                ['title' => 'Default', 'inline' => 'span', 'classes' => 'uk-text-default'],
                                ['title' => 'Large', 'inline' => 'span', 'classes' => 'uk-text-large'],
                            ],
                        ],
                        [
                            'title' => 'Stil',
                            'items' => [
                                ['title' => 'Bold', 'inline' => 'span', 'classes' => 'uk-text-bold'],
                                ['title' => 'Italic', 'inline' => 'span', 'classes' => 'uk-text-italic'],
                                ['title' => 'Light', 'inline' => 'span', 'classes' => 'uk-text-light'],
                                ['title' => 'Normal', 'inline' => 'span', 'classes' => 'uk-text-normal'],
                                ['title' => 'Lighter', 'inline' => 'span', 'classes' => 'uk-text-lighter'],
                                ['title' => 'Bolder', 'inline' => 'span', 'classes' => 'uk-text-bolder'],
                            ],
                        ],
                        [
                            'title' => 'Transformation',
                            'items' => [
                                ['title' => 'Capitalize', 'inline' => 'span', 'classes' => 'uk-text-capitalize'],
                                ['title' => 'Uppercase', 'inline' => 'span', 'classes' => 'uk-text-uppercase'],
                                ['title' => 'Lowercase', 'inline' => 'span', 'classes' => 'uk-text-lowercase'],
                            ],
                        ],
                        [
                            'title' => 'Farbe',
                            'items' => [
                                ['title' => 'Muted', 'inline' => 'span', 'classes' => 'uk-text-muted'],
                                ['title' => 'Emphasis', 'inline' => 'span', 'classes' => 'uk-text-emphasis'],
                                ['title' => 'Primary', 'inline' => 'span', 'classes' => 'uk-text-primary'],
                                ['title' => 'Secondary', 'inline' => 'span', 'classes' => 'uk-text-secondary'],
                                ['title' => 'Success', 'inline' => 'span', 'classes' => 'uk-text-success'],
                                ['title' => 'Warning', 'inline' => 'span', 'classes' => 'uk-text-warning'],
                                ['title' => 'Danger', 'inline' => 'span', 'classes' => 'uk-text-danger'],
                            ],
                        ],
                        [
                            'title' => 'Ausrichtung',
                            'items' => [
                                ['title' => 'Left', 'block' => 'div', 'classes' => 'uk-text-left'],
                                ['title' => 'Center', 'block' => 'div', 'classes' => 'uk-text-center'],
                                ['title' => 'Right', 'block' => 'div', 'classes' => 'uk-text-right'],
                                ['title' => 'Justify', 'block' => 'div', 'classes' => 'uk-text-justify'],
                            ],
                        ],
                        [
                            'title' => 'Umbruch',
                            'items' => [
                                ['title' => 'Truncate', 'block' => 'div', 'classes' => 'uk-text-truncate'],
                                ['title' => 'Break', 'block' => 'div', 'classes' => 'uk-text-break'],
                                ['title' => 'No Wrap', 'block' => 'div', 'classes' => 'uk-text-nowrap'],
                            ],
                        ],
                    ],
                ],
                [
                    'title' => 'Buttons',
                    'items' => [
                        ['title' => 'Default', 'name' => 'uk-button-default', 'selector' => 'a', 'classes' => 'uk-button uk-button-default'],
                        ['title' => 'Primary', 'name' => 'uk-button-primary', 'selector' => 'a', 'classes' => 'uk-button uk-button-primary'],
                        ['title' => 'Secondary', 'name' => 'uk-button-secondary', 'selector' => 'a', 'classes' => 'uk-button uk-button-secondary'],
                        ['title' => 'Danger', 'name' => 'uk-button-danger', 'selector' => 'a', 'classes' => 'uk-button uk-button-danger'],
                        ['title' => 'Text', 'name' => 'uk-button-text', 'selector' => 'a', 'classes' => 'uk-button uk-button-text'],
                        ['title' => 'Link', 'name' => 'uk-button-link', 'selector' => 'a', 'classes' => 'uk-button uk-button-link'],
                        ['title' => 'Small', 'name' => 'uk-button-small', 'selector' => 'a', 'classes' => 'uk-button uk-button-small'],
                        ['title' => 'Large', 'name' => 'uk-button-large', 'selector' => 'a', 'classes' => 'uk-button uk-button-large'],
                    ],
                ],
                [
                    'title' => 'Listen',
                    'items' => [
                        ['title' => 'Disc', 'selector' => 'ul', 'classes' => 'uk-list uk-list-disc'],
                        ['title' => 'Circle', 'selector' => 'ul', 'classes' => 'uk-list uk-list-circle'],
                        ['title' => 'Square', 'selector' => 'ul', 'classes' => 'uk-list uk-list-square'],
                        ['title' => 'Decimal', 'selector' => 'ol', 'classes' => 'uk-list uk-list-decimal'],
                        ['title' => 'Divider', 'selector' => 'ul,ol', 'classes' => 'uk-list uk-list-divider'],
                        ['title' => 'Striped', 'selector' => 'ul,ol', 'classes' => 'uk-list uk-list-striped'],
                    ],
                ],
                [
                    'title' => 'Tabellen',
                    'items' => [
                        ['title' => 'Striped', 'selector' => 'table', 'classes' => 'uk-table uk-table-striped'],
                        ['title' => 'Hover', 'selector' => 'table', 'classes' => 'uk-table uk-table-hover'],
                        ['title' => 'Divider', 'selector' => 'table', 'classes' => 'uk-table uk-table-divider'],
                        ['title' => 'Small', 'selector' => 'table', 'classes' => 'uk-table uk-table-small'],
                    ],
                ],
                [
                    'title' => 'Bilder',
                    'items' => [
                        ['title' => 'Rounded', 'selector' => 'img', 'classes' => 'uk-border-rounded'],
                        ['title' => 'Circle', 'selector' => 'img', 'classes' => 'uk-border-circle'],
                        ['title' => 'Shadow Small', 'selector' => 'img', 'classes' => 'uk-box-shadow-small'],
                        ['title' => 'Shadow Medium', 'selector' => 'img', 'classes' => 'uk-box-shadow-medium'],
                        ['title' => 'Shadow Large', 'selector' => 'img', 'classes' => 'uk-box-shadow-large'],
                    ],
                ],
                [
                    'title' => 'Badges & Labels',
                    'items' => [
                        ['title' => 'Badge', 'inline' => 'span', 'classes' => 'uk-badge'],
                        ['title' => 'Label', 'inline' => 'span', 'classes' => 'uk-label'],
                        ['title' => 'Label Success', 'inline' => 'span', 'classes' => 'uk-label uk-label-success'],
                        ['title' => 'Label Warning', 'inline' => 'span', 'classes' => 'uk-label uk-label-warning'],
                        ['title' => 'Label Danger', 'inline' => 'span', 'classes' => 'uk-label uk-label-danger'],
                    ],
                ],
                [
                    'title' => 'Alerts',
                    'items' => [
                        ['title' => 'Primary', 'name' => 'uk-alert-primary', 'block' => 'div', 'classes' => 'uk-alert-primary', 'wrapper' => true],
                        ['title' => 'Success', 'name' => 'uk-alert-success', 'block' => 'div', 'classes' => 'uk-alert-success', 'wrapper' => true],
                        ['title' => 'Warning', 'name' => 'uk-alert-warning', 'block' => 'div', 'classes' => 'uk-alert-warning', 'wrapper' => true],
                        ['title' => 'Danger', 'name' => 'uk-alert-danger', 'block' => 'div', 'classes' => 'uk-alert-danger', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Cards',
                    'items' => [
                        ['title' => 'Default', 'name' => 'uk-card-default', 'block' => 'div', 'classes' => 'uk-card uk-card-default uk-card-body', 'wrapper' => true],
                        ['title' => 'Primary', 'name' => 'uk-card-primary', 'block' => 'div', 'classes' => 'uk-card uk-card-primary uk-card-body', 'wrapper' => true],
                        ['title' => 'Secondary', 'name' => 'uk-card-secondary', 'block' => 'div', 'classes' => 'uk-card uk-card-secondary uk-card-body', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Backgrounds',
                    'items' => [
                        ['title' => 'Muted', 'name' => 'uk-background-muted', 'block' => 'div', 'classes' => 'uk-background-muted uk-padding', 'wrapper' => true],
                        ['title' => 'Primary', 'name' => 'uk-background-primary', 'block' => 'div', 'classes' => 'uk-background-primary uk-light uk-padding', 'wrapper' => true],
                        ['title' => 'Secondary', 'name' => 'uk-background-secondary', 'block' => 'div', 'classes' => 'uk-background-secondary uk-light uk-padding', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Utility',
                    'items' => [
                        ['title' => 'Float Left', 'block' => 'div', 'classes' => 'uk-float-left'],
                        ['title' => 'Float Right', 'block' => 'div', 'classes' => 'uk-float-right'],
                        ['title' => 'Clearfix', 'block' => 'div', 'classes' => 'uk-clearfix'],
                        ['title' => 'Display Block', 'block' => 'div', 'classes' => 'uk-display-block'],
                        ['title' => 'Display Inline', 'inline' => 'span', 'classes' => 'uk-display-inline'],
                        ['title' => 'Display Inline-Block', 'block' => 'div', 'classes' => 'uk-display-inline-block'],
                        ['title' => 'Overflow Hidden', 'block' => 'div', 'classes' => 'uk-overflow-hidden'],
                        ['title' => 'Overflow Auto', 'block' => 'div', 'classes' => 'uk-overflow-auto'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Bootstrap 5 Style-Set
     */
    public static function getBootstrap5(): array
    {
        return [
            'name' => 'bootstrap5',
            'description' => 'Bootstrap 5 - Vollständige Styles für Text, Buttons, Alerts, Cards, Badges und mehr',
            'content_css' => 'https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css',
            'style_formats' => [
                [
                    'title' => 'Text',
                    'items' => [
                        ['title' => 'Lead', 'block' => 'p', 'classes' => 'lead'],
                        ['title' => 'Small', 'inline' => 'small', 'classes' => 'text-muted'],
                        ['title' => 'Mark', 'inline' => 'mark'],
                        [
                            'title' => 'Farbe',
                            'items' => [
                                ['title' => 'Primary', 'inline' => 'span', 'classes' => 'text-primary'],
                                ['title' => 'Secondary', 'inline' => 'span', 'classes' => 'text-secondary'],
                                ['title' => 'Success', 'inline' => 'span', 'classes' => 'text-success'],
                                ['title' => 'Warning', 'inline' => 'span', 'classes' => 'text-warning'],
                                ['title' => 'Danger', 'inline' => 'span', 'classes' => 'text-danger'],
                                ['title' => 'Info', 'inline' => 'span', 'classes' => 'text-info'],
                                ['title' => 'Muted', 'inline' => 'span', 'classes' => 'text-muted'],
                            ],
                        ],
                        [
                            'title' => 'Ausrichtung',
                            'items' => [
                                ['title' => 'Left', 'block' => 'div', 'classes' => 'text-start'],
                                ['title' => 'Center', 'block' => 'div', 'classes' => 'text-center'],
                                ['title' => 'Right', 'block' => 'div', 'classes' => 'text-end'],
                            ],
                        ],
                    ],
                ],
                [
                    'title' => 'Buttons',
                    'items' => [
                        ['title' => 'Primary', 'inline' => 'a', 'classes' => 'btn btn-primary'],
                        ['title' => 'Secondary', 'inline' => 'a', 'classes' => 'btn btn-secondary'],
                        ['title' => 'Success', 'inline' => 'a', 'classes' => 'btn btn-success'],
                        ['title' => 'Warning', 'inline' => 'a', 'classes' => 'btn btn-warning'],
                        ['title' => 'Danger', 'inline' => 'a', 'classes' => 'btn btn-danger'],
                        ['title' => 'Info', 'inline' => 'a', 'classes' => 'btn btn-info'],
                        ['title' => 'Light', 'inline' => 'a', 'classes' => 'btn btn-light'],
                        ['title' => 'Dark', 'inline' => 'a', 'classes' => 'btn btn-dark'],
                        ['title' => 'Link', 'inline' => 'a', 'classes' => 'btn btn-link'],
                        ['title' => 'Outline Primary', 'inline' => 'a', 'classes' => 'btn btn-outline-primary'],
                        ['title' => 'Outline Secondary', 'inline' => 'a', 'classes' => 'btn btn-outline-secondary'],
                    ],
                ],
                [
                    'title' => 'Tabellen',
                    'items' => [
                        ['title' => 'Table', 'selector' => 'table', 'classes' => 'table'],
                        ['title' => 'Striped', 'selector' => 'table', 'classes' => 'table table-striped'],
                        ['title' => 'Bordered', 'selector' => 'table', 'classes' => 'table table-bordered'],
                        ['title' => 'Hover', 'selector' => 'table', 'classes' => 'table table-hover'],
                        ['title' => 'Small', 'selector' => 'table', 'classes' => 'table table-sm'],
                        ['title' => 'Dark', 'selector' => 'table', 'classes' => 'table table-dark'],
                    ],
                ],
                [
                    'title' => 'Bilder',
                    'items' => [
                        ['title' => 'Rounded', 'selector' => 'img', 'classes' => 'rounded'],
                        ['title' => 'Circle', 'selector' => 'img', 'classes' => 'rounded-circle'],
                        ['title' => 'Thumbnail', 'selector' => 'img', 'classes' => 'img-thumbnail'],
                        ['title' => 'Fluid', 'selector' => 'img', 'classes' => 'img-fluid'],
                    ],
                ],
                [
                    'title' => 'Badges',
                    'items' => [
                        ['title' => 'Primary', 'inline' => 'span', 'classes' => 'badge bg-primary'],
                        ['title' => 'Secondary', 'inline' => 'span', 'classes' => 'badge bg-secondary'],
                        ['title' => 'Success', 'inline' => 'span', 'classes' => 'badge bg-success'],
                        ['title' => 'Warning', 'inline' => 'span', 'classes' => 'badge bg-warning text-dark'],
                        ['title' => 'Danger', 'inline' => 'span', 'classes' => 'badge bg-danger'],
                        ['title' => 'Info', 'inline' => 'span', 'classes' => 'badge bg-info text-dark'],
                        ['title' => 'Light', 'inline' => 'span', 'classes' => 'badge bg-light text-dark'],
                        ['title' => 'Dark', 'inline' => 'span', 'classes' => 'badge bg-dark'],
                    ],
                ],
                [
                    'title' => 'Alerts',
                    'items' => [
                        ['title' => 'Primary', 'block' => 'div', 'classes' => 'alert alert-primary', 'wrapper' => true],
                        ['title' => 'Secondary', 'block' => 'div', 'classes' => 'alert alert-secondary', 'wrapper' => true],
                        ['title' => 'Success', 'block' => 'div', 'classes' => 'alert alert-success', 'wrapper' => true],
                        ['title' => 'Warning', 'block' => 'div', 'classes' => 'alert alert-warning', 'wrapper' => true],
                        ['title' => 'Danger', 'block' => 'div', 'classes' => 'alert alert-danger', 'wrapper' => true],
                        ['title' => 'Info', 'block' => 'div', 'classes' => 'alert alert-info', 'wrapper' => true],
                        ['title' => 'Light', 'block' => 'div', 'classes' => 'alert alert-light', 'wrapper' => true],
                        ['title' => 'Dark', 'block' => 'div', 'classes' => 'alert alert-dark', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Cards',
                    'items' => [
                        ['title' => 'Card', 'block' => 'div', 'classes' => 'card card-body', 'wrapper' => true],
                        ['title' => 'Card Primary', 'block' => 'div', 'classes' => 'card card-body bg-primary text-white', 'wrapper' => true],
                        ['title' => 'Card Secondary', 'block' => 'div', 'classes' => 'card card-body bg-secondary text-white', 'wrapper' => true],
                        ['title' => 'Card Light', 'block' => 'div', 'classes' => 'card card-body bg-light', 'wrapper' => true],
                        ['title' => 'Card Dark', 'block' => 'div', 'classes' => 'card card-body bg-dark text-white', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Backgrounds',
                    'items' => [
                        ['title' => 'Primary', 'block' => 'div', 'classes' => 'bg-primary text-white p-3', 'wrapper' => true],
                        ['title' => 'Secondary', 'block' => 'div', 'classes' => 'bg-secondary text-white p-3', 'wrapper' => true],
                        ['title' => 'Success', 'block' => 'div', 'classes' => 'bg-success text-white p-3', 'wrapper' => true],
                        ['title' => 'Warning', 'block' => 'div', 'classes' => 'bg-warning p-3', 'wrapper' => true],
                        ['title' => 'Danger', 'block' => 'div', 'classes' => 'bg-danger text-white p-3', 'wrapper' => true],
                        ['title' => 'Light', 'block' => 'div', 'classes' => 'bg-light p-3', 'wrapper' => true],
                        ['title' => 'Dark', 'block' => 'div', 'classes' => 'bg-dark text-white p-3', 'wrapper' => true],
                    ],
                ],
            ],
        ];
    }

    /**
     * Alle Default-Sets
     */
    public static function getAll(): array
    {
        return [
            self::getUikit3(),
            self::getBootstrap5(),
        ];
    }
}
