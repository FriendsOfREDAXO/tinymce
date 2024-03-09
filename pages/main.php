<?php

use FriendsOfRedaxo\TinyMce\Utils\Lang;

$photoBy = sprintf(rex_i18n::msg('tinymce_subnavigation_header_photo'),
    '<a href="https://unsplash.com/@leerspace?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">John Reed</a>',
    '<a href="https://unsplash.com/search/photos/stars?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>',
);

$content = '
            <header class="tinymce-header">
                <picture>
                    <img src="/assets/addons/tinymce/images/header-john-reed-qtRFE7MYnHo-unsplash.jpg">
                </picture>
                <div class="header-content">
                    <h1>' . rex_i18n::msg('tinymce_subnavigation_header_title') . '</h1>
                </div>
                <div class="photoinfo"><span>' . $photoBy . '</span></div>
            </header>
<div class="tinymce-demo">
    <div name="content" class="tiny-editor" data-profile="full" data-lang="' . Lang::getUserLang() . '">
       <p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="/assets/addons/tinymce/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97"></p>
       <h2 style="text-align: center;">REDAXO TinyMCE-AddOn Demo</h2>
       <p style="text-align: center;">You can test all the features of this AddOn here. The inputs are not saved.</p>
       <p style="text-align: center;">TinyMCE is a rich-text editor that allows users to create formatted content within a user-friendly interface.</p>
';

$fragment = new rex_fragment();
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
