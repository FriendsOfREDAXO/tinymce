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
     * @param array<string, mixed> $data Configuration data (plugins, toolbar, extra, etc.)
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
        
        // Default values
        $defaults = [
            'plugins' => 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen media table wordcount',
            'toolbar' => 'undo redo | blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            'extra' => '',
            'mediatype' => '',
            'mediapath' => '',
            'mediacategory' => 0,
            'upload_default' => '',
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
}
