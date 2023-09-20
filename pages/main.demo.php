<?php

use FriendsOfRedaxo\TinyMce\Provider\TinyMceNavigationProvider;
use FriendsOfRedaxo\TinyMce\Utils\TinyMceLang;

$content = TinyMceNavigationProvider::getSubNavigationHeader().
           TinyMceNavigationProvider::getSubNavigation()
    . '
<div class="tinymce-demo">
    <div name="content" class="tiny-editor" data-profile="full" data-lang="' . TinyMceLang::getUserLang() . '">  
       <p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="/assets/addons/tinymce/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97"></p>
       <h2 style="text-align: center;">REDAXO TinyMCE-AddOn Demo</h2>
       <p style="text-align: center;">You can test all the features of this AddOn here. The inputs are not saved.</p>
       <p style="text-align: center;">TinyMCE is a rich-text editor that allows users to create formatted content within a user-friendly interface.</p>
';

$fragment = new rex_fragment();
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
