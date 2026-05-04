<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

use FriendsOfRedaxo\TinyMce\Creator\Profiles;
use rex;
use rex_sql;
use rex_sql_exception;

/**
 * Provides the factory-default TinyMCE profiles shipped with the AddOn.
 *
 * These are the same profiles created on a fresh install (count=0 branch in
 * install.php). The `resetAll()` method force-replaces all three standard
 * profiles plus the demo profile with up-to-date defaults.
 */
final class DefaultProfiles
{
    public const NAMES = ['full', 'light', 'default'];

    /**
     * Returns an array of default profile definitions.
     * Each entry has: name, description, extra.
     *
     * @return list<array{name: string, description: string, extra: string}>
     */
    public static function getDefaults(): array
    {
        $extra_full = <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: true,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code save accordion autoresize importcss quickbars snippets for_images for_oembed for_video for_htmlembed for_checklist for_footnotes for_toc for_a11y for_markdown for_chars_symbols for_abbr cleanpaste mediapaste link_yform phonelink quote',
toolbar: 'for_chars_symbols for_a11y | undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link link_yform phonelink quote image imagewidthdialog for_oembed for_video for_htmlembed table codesample accordion | for_checklist for_footnote_insert for_toc_insert for_markdown_paste | removeformat code fullscreen',
min_height: 400,
max_height: 700,
autoresize_bottom_margin: 20,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
image_caption: true,
image_uploadtab: false,
relative_urls: false,
remove_script_host: true,
document_base_url: '/',
entity_encoding: 'raw',
convert_urls: true,
object_resizing: false,
quickbars_image_toolbar: false,
link_rel_list: [
    {title: 'Keine', value: ''},
    {title: 'Nofollow', value: 'nofollow'},
    {title: 'Sponsored', value: 'sponsored'}
],
link_target_list: [
    {title: '— Kein Ziel (gleiches Fenster)', value: ''},
    {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
}
EXTRA;

        $extra_light = <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: false,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'autolink directionality visualblocks visualchars fullscreen image link charmap nonbreaking code lists advlist cleanpaste link_yform phonelink',
toolbar: 'blocks | bold italic underline strikethrough | bullist numlist | link link_yform phonelink | image | charmap nonbreaking | removeformat code | undo redo',
height: 300,
relative_urls: false,
remove_script_host: true,
document_base_url: '/',
entity_encoding: 'raw',
convert_urls: true,
paste_as_text: true,
link_rel_list: [
    {title: 'Keine', value: ''},
    {title: 'Nofollow', value: 'nofollow'}
],
link_target_list: [
    {title: '— Kein Ziel (gleiches Fenster)', value: ''},
    {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
}
EXTRA;

        $extra_default = <<<'EXTRA'
license_key: 'gpl',
language: 'de',
branding: false,
statusbar: true,
menubar: false,
toolbar_sticky: true,
toolbar_sticky_offset: 0,
plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link codesample charmap nonbreaking anchor insertdatetime advlist lists wordcount help emoticons code for_images link_yform phonelink quote cleanpaste',
toolbar1: 'undo redo | cut copy paste pastetext | bold italic underline strikethrough subscript superscript removeformat | link anchor | image imagewidthdialog emoticons charmap nonbreaking | link_yform phonelink quote',
toolbar2: 'blocks | fontsize | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | code fullscreen searchreplace',
height: 400,
image_caption: true,
image_uploadtab: false,
entity_encoding: 'raw',
relative_urls: false,
remove_script_host: true,
document_base_url: '/',
convert_urls: true,
link_rel_list: [
    {title: 'Keine', value: ''},
    {title: 'Nofollow', value: 'nofollow'},
    {title: 'Sponsored', value: 'sponsored'}
],
link_target_list: [
    {title: '— Kein Ziel (gleiches Fenster)', value: ''},
    {title: 'Neues Fenster', value: '_blank'}
],
link_default_protocol: 'https',
link_assume_external_targets: 'https',
link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},
skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",
content_css: redaxo.theme.current === "dark" ? "dark" : "default",
file_picker_callback: function (callback, value, meta) {
    rex5_picker_function(callback, value, meta);
}
EXTRA;

        return [
            [
                'name' => 'full',
                'description' => 'Full featured – alle FOR-Plugins aktiv',
                'extra' => $extra_full,
            ],
            [
                'name' => 'light',
                'description' => 'Light – minimaler Editor für kurze Texte',
                'extra' => $extra_light,
            ],
            [
                'name' => 'default',
                'description' => 'Standard – zwei Toolbars, gängige Plugins',
                'extra' => $extra_default,
            ],
        ];
    }

    /**
     * Resets all standard profiles (full, light, default) plus the demo profile
     * to the current AddOn defaults. Existing profiles with the same name are
     * overwritten; if no profile with that name exists it is created fresh.
     *
     * Also triggers profiles.js regeneration.
     *
     * @throws rex_sql_exception
     */
    public static function resetAll(): void
    {
        $now = date('Y-m-d H:i:s');
        $user = rex::getUser()?->getLogin() ?? 'system';

        foreach (self::getDefaults() as $p) {
            $sql = rex_sql::factory();
            $sql->setTable(rex::getTable('tinymce_profiles'));
            $sql->setWhere(['name' => $p['name']]);
            $sql->select();

            if ($sql->getRows() > 0) {
                $upd = rex_sql::factory();
                $upd->setTable(rex::getTable('tinymce_profiles'));
                $upd->setWhere(['name' => $p['name']]);
                $upd->setValue('description', $p['description']);
                $upd->setValue('extra', $p['extra']);
                $upd->setValue('updatedate', $now);
                $upd->setValue('updateuser', $user);
                $upd->update();
            } else {
                $ins = rex_sql::factory();
                $ins->setTable(rex::getTable('tinymce_profiles'));
                $ins->setValue('name', $p['name']);
                $ins->setValue('description', $p['description']);
                $ins->setValue('extra', $p['extra']);
                $ins->setValue('createdate', $now);
                $ins->setValue('updatedate', $now);
                $ins->setValue('createuser', $user);
                $ins->setValue('updateuser', $user);
                $ins->insert();
            }
        }

        // Reset demo profile via the dedicated helper
        ProfileHelper::ensureProfile(
            DemoProfile::NAME,
            DemoProfile::DESCRIPTION,
            ['extra' => DemoProfile::getExtra()],
            true
        );

        // Regenerate profiles.js
        Profiles::profilesCreate();
    }
}
