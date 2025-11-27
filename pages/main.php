<?php

use FriendsOfRedaxo\TinyMce\Utils\Lang;

$content = '
<div class="tinymce-demo">
    <div name="content" class="tiny-editor" data-profile="full" data-lang="' . Lang::getUserLang() . '">
       <p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="/assets/addons/tinymce/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97"></p>
       <h2 style="text-align: center;">' . rex_i18n::msg('tinymce_demo_title') . '</h2>
       <p style="text-align: center;">' . rex_i18n::msg('tinymce_demo_content') . '</p>
       <p style="text-align: center;">' . rex_i18n::msg('tinymce_demo_description') . '</p>
       <p style="text-align: center;">
            <a href="https://www.tiny.cloud/docs/tinymce/latest/" target="_blank" rel="noreferrer noopener">' . rex_i18n::msg('tinymce_links_documentation') . '</a> |
            <a href="https://github.com/FriendsOfREDAXO/tinymce" target="_blank" rel="noreferrer noopener">' . rex_i18n::msg('tinymce_links_github') . '</a>
       </p>
';

$fragment = new rex_fragment();
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
