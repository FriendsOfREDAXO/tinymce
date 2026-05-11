<?php

namespace FriendsOfRedaxo\TinyMce\Utils;

/**
 * Kennung des gesperrten Demo-Profils.
 *
 * Das Demo-Profil (name: "demo") wird beim Install/Update automatisch
 * angelegt bzw. überschrieben (Quelle: install/tinymce-profiles.json)
 * und darf im Backend nicht gelöscht werden (Schutz in pages/profiles.php).
 */
final class DemoProfile
{
    public const NAME = 'demo';
}
