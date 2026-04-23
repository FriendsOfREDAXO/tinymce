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
                ['title' => 'Standardabsatz', 'format' => 'p'],
                [
                    'title' => 'Überschriften',
                    'items' => [
                        ['title' => 'Überschrift 1', 'name' => 'uikit-h1', 'block' => 'h1'],
                        ['title' => 'Überschrift 2', 'name' => 'uikit-h2', 'block' => 'h2'],
                        ['title' => 'Überschrift 3', 'name' => 'uikit-h3', 'block' => 'h3'],
                        ['title' => 'Überschrift 4', 'name' => 'uikit-h4', 'block' => 'h4'],
                        ['title' => 'Überschrift 5', 'name' => 'uikit-h5', 'block' => 'h5'],
                        ['title' => 'Überschrift 6', 'name' => 'uikit-h6', 'block' => 'h6'],
                        ['title' => 'Heading Primary', 'name' => 'uk-heading-primary', 'block' => 'h1', 'classes' => 'uk-heading-primary'],
                        ['title' => 'Heading Hero', 'name' => 'uk-heading-hero', 'block' => 'h1', 'classes' => 'uk-heading-hero'],
                        ['title' => 'Heading Divider', 'name' => 'uk-heading-divider', 'block' => 'h2', 'classes' => 'uk-heading-divider'],
                        ['title' => 'Heading Bullet', 'name' => 'uk-heading-bullet', 'block' => 'h3', 'classes' => 'uk-heading-bullet'],
                        ['title' => 'Heading Line', 'name' => 'uk-heading-line', 'block' => 'h3', 'classes' => 'uk-heading-line'],
                    ],
                ],
                [
                    'title' => 'Text',
                    'items' => [
                        ['title' => 'Lead Text', 'name' => 'uk-text-lead', 'block' => 'p', 'classes' => 'uk-text-lead'],
                        ['title' => 'Meta Text', 'name' => 'uk-text-meta', 'block' => 'p', 'classes' => 'uk-text-meta'],
                        ['title' => 'Drop Cap', 'name' => 'uk-dropcap', 'block' => 'p', 'classes' => 'uk-dropcap'],
                        [
                            'title' => 'Größe',
                            'items' => [
                                ['title' => 'Small', 'name' => 'uk-text-small', 'inline' => 'span', 'classes' => 'uk-text-small'],
                                ['title' => 'Default', 'name' => 'uk-text-default', 'inline' => 'span', 'classes' => 'uk-text-default'],
                                ['title' => 'Large', 'name' => 'uk-text-large', 'inline' => 'span', 'classes' => 'uk-text-large'],
                            ],
                        ],
                        [
                            'title' => 'Stil',
                            'items' => [
                                ['title' => 'Bold', 'name' => 'uk-text-bold', 'inline' => 'span', 'classes' => 'uk-text-bold'],
                                ['title' => 'Italic', 'name' => 'uk-text-italic', 'inline' => 'span', 'classes' => 'uk-text-italic'],
                                ['title' => 'Light', 'name' => 'uk-text-light', 'inline' => 'span', 'classes' => 'uk-text-light'],
                                ['title' => 'Normal', 'name' => 'uk-text-normal', 'inline' => 'span', 'classes' => 'uk-text-normal'],
                                ['title' => 'Lighter', 'name' => 'uk-text-lighter', 'inline' => 'span', 'classes' => 'uk-text-lighter'],
                                ['title' => 'Bolder', 'name' => 'uk-text-bolder', 'inline' => 'span', 'classes' => 'uk-text-bolder'],
                            ],
                        ],
                        [
                            'title' => 'Transformation',
                            'items' => [
                                ['title' => 'Capitalize', 'name' => 'uk-text-capitalize', 'inline' => 'span', 'classes' => 'uk-text-capitalize'],
                                ['title' => 'Uppercase', 'name' => 'uk-text-uppercase', 'inline' => 'span', 'classes' => 'uk-text-uppercase'],
                                ['title' => 'Lowercase', 'name' => 'uk-text-lowercase', 'inline' => 'span', 'classes' => 'uk-text-lowercase'],
                            ],
                        ],
                        [
                            'title' => 'Farbe',
                            'items' => [
                                ['title' => 'Muted', 'name' => 'uk-text-muted', 'inline' => 'span', 'classes' => 'uk-text-muted'],
                                ['title' => 'Emphasis', 'name' => 'uk-text-emphasis', 'inline' => 'span', 'classes' => 'uk-text-emphasis'],
                                ['title' => 'Primary', 'name' => 'uk-text-primary', 'inline' => 'span', 'classes' => 'uk-text-primary'],
                                ['title' => 'Secondary', 'name' => 'uk-text-secondary', 'inline' => 'span', 'classes' => 'uk-text-secondary'],
                                ['title' => 'Success', 'name' => 'uk-text-success', 'inline' => 'span', 'classes' => 'uk-text-success'],
                                ['title' => 'Warning', 'name' => 'uk-text-warning', 'inline' => 'span', 'classes' => 'uk-text-warning'],
                                ['title' => 'Danger', 'name' => 'uk-text-danger', 'inline' => 'span', 'classes' => 'uk-text-danger'],
                            ],
                        ],
                        [
                            'title' => 'Ausrichtung',
                            'items' => [
                                ['title' => 'Left', 'name' => 'uk-text-left', 'block' => 'div', 'classes' => 'uk-text-left'],
                                ['title' => 'Center', 'name' => 'uk-text-center', 'block' => 'div', 'classes' => 'uk-text-center'],
                                ['title' => 'Right', 'name' => 'uk-text-right', 'block' => 'div', 'classes' => 'uk-text-right'],
                                ['title' => 'Justify', 'name' => 'uk-text-justify', 'block' => 'div', 'classes' => 'uk-text-justify'],
                            ],
                        ],
                        [
                            'title' => 'Umbruch',
                            'items' => [
                                ['title' => 'Truncate', 'name' => 'uk-text-truncate', 'block' => 'div', 'classes' => 'uk-text-truncate'],
                                ['title' => 'Break', 'name' => 'uk-text-break', 'block' => 'div', 'classes' => 'uk-text-break'],
                                ['title' => 'No Wrap', 'name' => 'uk-text-nowrap', 'block' => 'div', 'classes' => 'uk-text-nowrap'],
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
                        ['title' => 'Disc', 'name' => 'uk-list-disc', 'selector' => 'ul', 'classes' => 'uk-list uk-list-disc'],
                        ['title' => 'Circle', 'name' => 'uk-list-circle', 'selector' => 'ul', 'classes' => 'uk-list uk-list-circle'],
                        ['title' => 'Square', 'name' => 'uk-list-square', 'selector' => 'ul', 'classes' => 'uk-list uk-list-square'],
                        ['title' => 'Decimal', 'name' => 'uk-list-decimal', 'selector' => 'ol', 'classes' => 'uk-list uk-list-decimal'],
                        ['title' => 'Divider', 'name' => 'uk-list-divider', 'selector' => 'ul', 'classes' => 'uk-list uk-list-divider'],
                        ['title' => 'Striped', 'name' => 'uk-list-striped', 'selector' => 'ul', 'classes' => 'uk-list uk-list-striped'],
                    ],
                ],
                [
                    'title' => 'Tabellen',
                    'items' => [
                        ['title' => 'Striped', 'name' => 'uk-table-striped', 'selector' => 'table', 'classes' => 'uk-table uk-table-striped'],
                        ['title' => 'Hover', 'name' => 'uk-table-hover', 'selector' => 'table', 'classes' => 'uk-table uk-table-hover'],
                        ['title' => 'Divider', 'name' => 'uk-table-divider', 'selector' => 'table', 'classes' => 'uk-table uk-table-divider'],
                        ['title' => 'Small', 'name' => 'uk-table-small', 'selector' => 'table', 'classes' => 'uk-table uk-table-small'],
                    ],
                ],
                [
                    'title' => 'Bilder',
                    'items' => [
                        ['title' => 'Rounded', 'name' => 'uk-border-rounded', 'selector' => 'img', 'classes' => 'uk-border-rounded'],
                        ['title' => 'Circle', 'name' => 'uk-border-circle', 'selector' => 'img', 'classes' => 'uk-border-circle'],
                        ['title' => 'Shadow Small', 'name' => 'uk-box-shadow-small', 'selector' => 'img', 'classes' => 'uk-box-shadow-small'],
                        ['title' => 'Shadow Medium', 'name' => 'uk-box-shadow-medium', 'selector' => 'img', 'classes' => 'uk-box-shadow-medium'],
                        ['title' => 'Shadow Large', 'name' => 'uk-box-shadow-large', 'selector' => 'img', 'classes' => 'uk-box-shadow-large'],
                    ],
                ],
                [
                    'title' => 'Badges & Labels',
                    'items' => [
                        ['title' => 'Badge', 'name' => 'uk-badge', 'inline' => 'span', 'classes' => 'uk-badge'],
                        ['title' => 'Label', 'name' => 'uk-label', 'inline' => 'span', 'classes' => 'uk-label'],
                        ['title' => 'Label Success', 'name' => 'uk-label-success', 'inline' => 'span', 'classes' => 'uk-label uk-label-success'],
                        ['title' => 'Label Warning', 'name' => 'uk-label-warning', 'inline' => 'span', 'classes' => 'uk-label uk-label-warning'],
                        ['title' => 'Label Danger', 'name' => 'uk-label-danger', 'inline' => 'span', 'classes' => 'uk-label uk-label-danger'],
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
                        ['title' => 'Float Left', 'name' => 'uk-float-left', 'block' => 'div', 'classes' => 'uk-float-left'],
                        ['title' => 'Float Right', 'name' => 'uk-float-right', 'block' => 'div', 'classes' => 'uk-float-right'],
                        ['title' => 'Clearfix', 'name' => 'uk-clearfix', 'block' => 'div', 'classes' => 'uk-clearfix'],
                        ['title' => 'Display Block', 'name' => 'uk-display-block', 'block' => 'div', 'classes' => 'uk-display-block'],
                        ['title' => 'Display Inline', 'name' => 'uk-display-inline', 'inline' => 'span', 'classes' => 'uk-display-inline'],
                        ['title' => 'Display Inline-Block', 'name' => 'uk-display-inline-block', 'block' => 'div', 'classes' => 'uk-display-inline-block'],
                        ['title' => 'Overflow Hidden', 'name' => 'uk-overflow-hidden', 'block' => 'div', 'classes' => 'uk-overflow-hidden'],
                        ['title' => 'Overflow Auto', 'name' => 'uk-overflow-auto', 'block' => 'div', 'classes' => 'uk-overflow-auto'],
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
                ['title' => 'Standardabsatz', 'format' => 'p'],
                [
                    'title' => 'Text',
                    'items' => [
                        ['title' => 'Lead', 'name' => 'bs5-lead', 'block' => 'p', 'classes' => 'lead'],
                        ['title' => 'Small', 'name' => 'bs5-small', 'inline' => 'small', 'classes' => 'text-muted'],
                        ['title' => 'Mark', 'name' => 'bs5-mark', 'inline' => 'mark'],
                        [
                            'title' => 'Farbe',
                            'items' => [
                                ['title' => 'Primary', 'name' => 'bs5-text-primary', 'inline' => 'span', 'classes' => 'text-primary'],
                                ['title' => 'Secondary', 'name' => 'bs5-text-secondary', 'inline' => 'span', 'classes' => 'text-secondary'],
                                ['title' => 'Success', 'name' => 'bs5-text-success', 'inline' => 'span', 'classes' => 'text-success'],
                                ['title' => 'Warning', 'name' => 'bs5-text-warning', 'inline' => 'span', 'classes' => 'text-warning'],
                                ['title' => 'Danger', 'name' => 'bs5-text-danger', 'inline' => 'span', 'classes' => 'text-danger'],
                                ['title' => 'Info', 'name' => 'bs5-text-info', 'inline' => 'span', 'classes' => 'text-info'],
                                ['title' => 'Muted', 'name' => 'bs5-text-muted', 'inline' => 'span', 'classes' => 'text-muted'],
                            ],
                        ],
                        [
                            'title' => 'Ausrichtung',
                            'items' => [
                                ['title' => 'Left', 'name' => 'bs5-text-start', 'block' => 'div', 'classes' => 'text-start'],
                                ['title' => 'Center', 'name' => 'bs5-text-center', 'block' => 'div', 'classes' => 'text-center'],
                                ['title' => 'Right', 'name' => 'bs5-text-end', 'block' => 'div', 'classes' => 'text-end'],
                            ],
                        ],
                    ],
                ],
                [
                    'title' => 'Buttons',
                    'items' => [
                        ['title' => 'Primary', 'name' => 'bs5-btn-primary', 'inline' => 'a', 'classes' => 'btn btn-primary'],
                        ['title' => 'Secondary', 'name' => 'bs5-btn-secondary', 'inline' => 'a', 'classes' => 'btn btn-secondary'],
                        ['title' => 'Success', 'name' => 'bs5-btn-success', 'inline' => 'a', 'classes' => 'btn btn-success'],
                        ['title' => 'Warning', 'name' => 'bs5-btn-warning', 'inline' => 'a', 'classes' => 'btn btn-warning'],
                        ['title' => 'Danger', 'name' => 'bs5-btn-danger', 'inline' => 'a', 'classes' => 'btn btn-danger'],
                        ['title' => 'Info', 'name' => 'bs5-btn-info', 'inline' => 'a', 'classes' => 'btn btn-info'],
                        ['title' => 'Light', 'name' => 'bs5-btn-light', 'inline' => 'a', 'classes' => 'btn btn-light'],
                        ['title' => 'Dark', 'name' => 'bs5-btn-dark', 'inline' => 'a', 'classes' => 'btn btn-dark'],
                        ['title' => 'Link', 'name' => 'bs5-btn-link', 'inline' => 'a', 'classes' => 'btn btn-link'],
                        ['title' => 'Outline Primary', 'name' => 'bs5-btn-outline-primary', 'inline' => 'a', 'classes' => 'btn btn-outline-primary'],
                        ['title' => 'Outline Secondary', 'name' => 'bs5-btn-outline-secondary', 'inline' => 'a', 'classes' => 'btn btn-outline-secondary'],
                    ],
                ],
                [
                    'title' => 'Tabellen',
                    'items' => [
                        ['title' => 'Table', 'name' => 'bs5-table', 'selector' => 'table', 'classes' => 'table'],
                        ['title' => 'Striped', 'name' => 'bs5-table-striped', 'selector' => 'table', 'classes' => 'table table-striped'],
                        ['title' => 'Bordered', 'name' => 'bs5-table-bordered', 'selector' => 'table', 'classes' => 'table table-bordered'],
                        ['title' => 'Hover', 'name' => 'bs5-table-hover', 'selector' => 'table', 'classes' => 'table table-hover'],
                        ['title' => 'Small', 'name' => 'bs5-table-sm', 'selector' => 'table', 'classes' => 'table table-sm'],
                        ['title' => 'Dark', 'name' => 'bs5-table-dark', 'selector' => 'table', 'classes' => 'table table-dark'],
                    ],
                ],
                [
                    'title' => 'Bilder',
                    'items' => [
                        ['title' => 'Rounded', 'name' => 'bs5-img-rounded', 'selector' => 'img', 'classes' => 'rounded'],
                        ['title' => 'Circle', 'name' => 'bs5-img-circle', 'selector' => 'img', 'classes' => 'rounded-circle'],
                        ['title' => 'Thumbnail', 'name' => 'bs5-img-thumbnail', 'selector' => 'img', 'classes' => 'img-thumbnail'],
                        ['title' => 'Fluid', 'name' => 'bs5-img-fluid', 'selector' => 'img', 'classes' => 'img-fluid'],
                    ],
                ],
                [
                    'title' => 'Badges',
                    'items' => [
                        ['title' => 'Primary', 'name' => 'bs5-badge-primary', 'inline' => 'span', 'classes' => 'badge bg-primary'],
                        ['title' => 'Secondary', 'name' => 'bs5-badge-secondary', 'inline' => 'span', 'classes' => 'badge bg-secondary'],
                        ['title' => 'Success', 'name' => 'bs5-badge-success', 'inline' => 'span', 'classes' => 'badge bg-success'],
                        ['title' => 'Warning', 'name' => 'bs5-badge-warning', 'inline' => 'span', 'classes' => 'badge bg-warning text-dark'],
                        ['title' => 'Danger', 'name' => 'bs5-badge-danger', 'inline' => 'span', 'classes' => 'badge bg-danger'],
                        ['title' => 'Info', 'name' => 'bs5-badge-info', 'inline' => 'span', 'classes' => 'badge bg-info text-dark'],
                        ['title' => 'Light', 'name' => 'bs5-badge-light', 'inline' => 'span', 'classes' => 'badge bg-light text-dark'],
                        ['title' => 'Dark', 'name' => 'bs5-badge-dark', 'inline' => 'span', 'classes' => 'badge bg-dark'],
                    ],
                ],
                [
                    'title' => 'Alerts',
                    'items' => [
                        ['title' => 'Primary', 'name' => 'bs5-alert-primary', 'block' => 'div', 'classes' => 'alert alert-primary', 'wrapper' => true],
                        ['title' => 'Secondary', 'name' => 'bs5-alert-secondary', 'block' => 'div', 'classes' => 'alert alert-secondary', 'wrapper' => true],
                        ['title' => 'Success', 'name' => 'bs5-alert-success', 'block' => 'div', 'classes' => 'alert alert-success', 'wrapper' => true],
                        ['title' => 'Warning', 'name' => 'bs5-alert-warning', 'block' => 'div', 'classes' => 'alert alert-warning', 'wrapper' => true],
                        ['title' => 'Danger', 'name' => 'bs5-alert-danger', 'block' => 'div', 'classes' => 'alert alert-danger', 'wrapper' => true],
                        ['title' => 'Info', 'name' => 'bs5-alert-info', 'block' => 'div', 'classes' => 'alert alert-info', 'wrapper' => true],
                        ['title' => 'Light', 'name' => 'bs5-alert-light', 'block' => 'div', 'classes' => 'alert alert-light', 'wrapper' => true],
                        ['title' => 'Dark', 'name' => 'bs5-alert-dark', 'block' => 'div', 'classes' => 'alert alert-dark', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Cards',
                    'items' => [
                        ['title' => 'Card', 'name' => 'bs5-card', 'block' => 'div', 'classes' => 'card card-body', 'wrapper' => true],
                        ['title' => 'Card Primary', 'name' => 'bs5-card-primary', 'block' => 'div', 'classes' => 'card card-body bg-primary text-white', 'wrapper' => true],
                        ['title' => 'Card Secondary', 'name' => 'bs5-card-secondary', 'block' => 'div', 'classes' => 'card card-body bg-secondary text-white', 'wrapper' => true],
                        ['title' => 'Card Light', 'name' => 'bs5-card-light', 'block' => 'div', 'classes' => 'card card-body bg-light', 'wrapper' => true],
                        ['title' => 'Card Dark', 'name' => 'bs5-card-dark', 'block' => 'div', 'classes' => 'card card-body bg-dark text-white', 'wrapper' => true],
                    ],
                ],
                [
                    'title' => 'Backgrounds',
                    'items' => [
                        ['title' => 'Primary', 'name' => 'bs5-bg-primary', 'block' => 'div', 'classes' => 'bg-primary text-white p-3', 'wrapper' => true],
                        ['title' => 'Secondary', 'name' => 'bs5-bg-secondary', 'block' => 'div', 'classes' => 'bg-secondary text-white p-3', 'wrapper' => true],
                        ['title' => 'Success', 'name' => 'bs5-bg-success', 'block' => 'div', 'classes' => 'bg-success text-white p-3', 'wrapper' => true],
                        ['title' => 'Warning', 'name' => 'bs5-bg-warning', 'block' => 'div', 'classes' => 'bg-warning p-3', 'wrapper' => true],
                        ['title' => 'Danger', 'name' => 'bs5-bg-danger', 'block' => 'div', 'classes' => 'bg-danger text-white p-3', 'wrapper' => true],
                        ['title' => 'Light', 'name' => 'bs5-bg-light', 'block' => 'div', 'classes' => 'bg-light p-3', 'wrapper' => true],
                        ['title' => 'Dark', 'name' => 'bs5-bg-dark', 'block' => 'div', 'classes' => 'bg-dark text-white p-3', 'wrapper' => true],
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
