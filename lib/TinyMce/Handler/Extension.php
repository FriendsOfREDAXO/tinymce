<?php

namespace FriendsOfRedaxo\TinyMce\Handler;

use FriendsOfRedaxo\TinyMce\Creator\Profiles as TinyMceProfilesCreator;
use rex;
use rex_be_controller;
use rex_extension_point;
use rex_form;
use rex_functional_exception;
use rex_logger;
use rex_request;
use rex_sql;
use rex_sql_exception;
use rex_view;

class Extension
{
    /**
     * @api
     * @param rex_extension_point<mixed> $ep
     */
    public static function createProfiles(rex_extension_point $ep): void
    {
        if ('profiles' === rex_be_controller::getCurrentPagePart(2) || 'TINY_PROFILE_ADD' === $ep->getName()) {
            // On form save: persist the pre-save extra value as profile_backup
            if ('REX_FORM_SAVED' === $ep->getName()) {
                self::saveProfileBackup($ep);
            }

            try {
                TinyMceProfilesCreator::profilesCreate();
            } catch (rex_functional_exception $e) {
                echo rex_view::error($e->getMessage());
            }
        } elseif ('TINY_PROFILE_UPDATED' === $ep->getName()) {
            try {
                TinyMceProfilesCreator::profilesCreate($ep->getParams());
            } catch (rex_functional_exception $e) {
                echo rex_view::error($e->getMessage());
            }
        }
    }

    /**
     * Reads the hidden `tinymce_profile_backup_value` POST field (injected into the
     * form by pages/profiles.php before rendering) and writes it to `profile_backup`
     * so the user can restore the previous version of a profile.
     *
     * @param rex_extension_point<mixed> $ep
     */
    private static function saveProfileBackup(rex_extension_point $ep): void
    {
        $form = $ep->getParam('form');
        if (!($form instanceof rex_form)) {
            return;
        }

        if ($form->getTableName() !== rex::getTable(Database::TINY_PROFILES)) {
            return;
        }

        $backupValue = rex_request('tinymce_profile_backup_value', 'string', null);
        if (null === $backupValue) {
            return;
        }

        /** @var rex_sql $saveSql */
        $saveSql = $ep->getParam('sql');

        // INSERT → getLastId(); UPDATE → extract from WHERE condition (id=N)
        $savedId = (int) $saveSql->getLastId();
        if ($savedId <= 0) {
            $where = $form->getWhereCondition();
            if (preg_match('/\bid\s*=\s*(\d+)/i', $where, $m) === 1) {
                $savedId = (int) $m[1];
            }
        }

        if ($savedId <= 0) {
            return;
        }

        try {
            rex_sql::factory()
                ->setTable(rex::getTable(Database::TINY_PROFILES))
                ->setWhere(['id' => $savedId])
                ->setValue('profile_backup', $backupValue)
                ->update();
        } catch (rex_sql_exception $e) {
            rex_logger::logException($e);
        }
    }
}
