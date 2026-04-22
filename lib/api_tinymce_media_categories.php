<?php

/**
 * Returns the list of media categories the current user is allowed to upload to.
 * Backend users: filtered by user's media permissions.
 * No user (frontend): returns empty list → plugin uses default_category from config.
 */
class rex_api_tinymce_media_categories extends rex_api_function
{
    /** @var bool */
    protected $published = true;

    public function execute(): rex_api_result
    {
        rex_response::cleanOutputBuffers();

        $user = rex::getUser();
        $categories = [];

        // Root category (id=0) – no folder
        // Use tinymce-addon key as fallback to avoid [translate:…] if mediapool lang is not loaded
        $rootName = rex_i18n::hasMsg('pool_kats_no_category')
            ? rex_i18n::msg('pool_kats_no_category')
            : rex_i18n::msg('tinymce_media_no_category');
        $categories[] = ['id' => 0, 'name' => $rootName];

        if ($user !== null) {
            /** @var rex_media_perm $mediaPerm */
            $mediaPerm = $user->getComplexPerm('media');

            if ($mediaPerm->hasMediaPerm()) {
                self::collectCategories(
                    rex_media_category::getRootCategories(),
                    $categories,
                    $mediaPerm,
                    0
                );
            }
        }
        // Frontend (no user): only root category is returned so the JS side
        // can fall back to the configured default_category.

        rex_response::sendJson($categories);
        exit;
    }

    /**
     * Recursively collects categories respecting media permissions.
     *
     * @param list<rex_media_category> $cats
     * @param list<array{id: int, name: string}> $result
     */
    private static function collectCategories(array $cats, array &$result, rex_media_perm $perm, int $depth): void
    {
        $prefix = str_repeat('— ', $depth);

        foreach ($cats as $cat) {
            if ($perm->hasAll() || $perm->hasCategoryPerm($cat->getId())) {
                $result[] = [
                    'id'   => $cat->getId(),
                    'name' => $prefix . $cat->getName(),
                ];
                self::collectCategories($cat->getChildren(), $result, $perm, $depth + 1);
            }
        }
    }
}
