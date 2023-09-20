<?php

$addon = rex_addon::get('tinymce');

echo rex_view::title($addon->i18n('title'));
rex_be_controller::includeCurrentPageSubPath();
