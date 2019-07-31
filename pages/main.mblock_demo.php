<?php
/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

/** @var rex_addon $this */

$content = '';

if (!rex_addon::exists('mblock') or (rex_addon::exists('mblock') && !rex_addon::get('mblock')->isAvailable())) {
    $content = rex_view::error(
        '<i class="rex-icon fa-warning"></i> ' .
        str_replace('MBlock', '<a href="https://github.com/FriendsOfREDAXO/mblock">MBlock</a>', rex_i18n::msg('tinymce5_mblock_not_available'))
    );
}

if (rex_addon::exists('mblock') && rex_addon::get('mblock')->isAvailable()) {

    $table = rex::getTable(\TinyMCE5\Handler\TinyMCE5DatabaseHandler::TINY5_MBLOCK_DEMO);

    $form = mblock_rex_form::factory($table, '', 'id=1');
    $form->addParam('id', 1);
    $form->addHiddenField('name', 'demo');

    $nf = mblock_rex_form::factory($table, '', 'id=1');
    $nf->addRawField('<br>');

    $element = $nf->addTextAreaField('mblock_field][attr_type][0][text');
    $element->setAttribute('class', 'tiny5-editor');
    $element->setAttribute('data-profile', 'default');

    $form->addRawField(MBlock::show($table . '::mblock_field::attr_type', $nf->getElements()));

    $content = $form->get();

    $content .= '<div class="tinymce5-demo-info"><blockquote><p>Die Texte sind unter der Lizenz <a href="https://de.wikipedia.org/wiki/Wikipedia:Lizenzbestimmungen_Commons_Attribution-ShareAlike_3.0_Unported">„Creative Commons Attribution/Share Alike“</a> verfügbar</p></blockquote></div>';
}

$content = \TinyMCE5\Provider\TinyMCE5NavigationProvider::getSubNavigationHeader() .
           \TinyMCE5\Provider\TinyMCE5NavigationProvider::getSubNavigation() .
           $content;

$fragment = new rex_fragment();
$fragment->setVar('class', 'tinymce5-mblockdemo', false);
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
