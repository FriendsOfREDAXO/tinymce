<?php

/**
 * @var rex_addon $this
 * @psalm-scope-this rex_addon
 */

// include an autoload-free snippet to ensure the required table exists
$this->includeFile(__DIR__ . '/ensure_table.php');

// profile migration / repair is intentionally not executed during update.
// Admins should run migrations via the migration page in backend.

return true;
