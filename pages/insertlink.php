        <ul class="nav nav-tabs tiny-nav">
            <li class="active"><a href="#"><?= rex_escape(rex_i18n::msg('tinymce_tab_structure')) ?></a></li>
            <li><a href="index.php?page=mediapool/media&addon=tiny&opener_input_field=REX_MEDIA_tinymce_filelink"><?= rex_escape(rex_i18n::msg('tinymce_tab_mediapool')) ?></a></li>
        </ul>
<?php
require_once rex_path::addon('structure', 'pages/linkmap.php');
            ?>
