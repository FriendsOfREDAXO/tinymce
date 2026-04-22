<?php

use FriendsOfRedaxo\TinyMce\Utils\Lang;

$demoHtml = <<<'HTML'
<h1>FriendsOfREDAXO TinyMCE-AddOn</h1>
<p><strong>TinyMCE 8 für REDAXO 5</strong> – ein voll ausgestatteter WYSIWYG-Editor mit eigenen, Open-Source-Plugins, framework-agnostischem Frontend-Output und einem komfortablen Profil-Assistenten.</p>

<nav class="for-toc" data-for-toc-min="2" data-for-toc-max="3" data-for-toc-ordered="1" data-for-toc-title="Auf dieser Seite" contenteditable="false">
  <p class="for-toc__title" contenteditable="false">Auf dieser Seite</p>
  <ol class="for-toc__list">
    <li class="for-toc__item for-toc__item--h2"><a href="#for-toc-was-kann-das-addon">Was kann das AddOn?</a></li>
    <li class="for-toc__item for-toc__item--h2"><a href="#for-toc-die-for-plugins">Die FOR-Plugins</a></li>
    <li class="for-toc__item for-toc__item--h2"><a href="#for-toc-beispiele">Beispiele zum Ausprobieren</a></li>
    <li class="for-toc__item for-toc__item--h2"><a href="#for-toc-profil-assistent">Profil-Assistent</a></li>
  </ol>
</nav>

<h2 id="for-toc-was-kann-das-addon">Was kann das AddOn?</h2>
<p>Das AddOn liefert TinyMCE 8 lokal (ohne Cloud-Abhängigkeit), dazu eine Reihe eigener Plugins, die Funktionen abdecken, für die sonst teils kommerzielle Premium-Plugins nötig wären – <em>Inhaltsverzeichnis</em>, <em>Fußnoten</em>, <em>Accessibility-Checker</em>, <em>HTML-Embed</em>, <em>oEmbed</em>, <em>lokale Videos</em> und <em>Checklisten</em>.</p>
<ul>
  <li>Beliebig viele <strong>Profile</strong> mit unterschiedlichen Plugin-Sets, Toolbars und Menüs</li>
  <li><strong>Style-Sets</strong> für UIkit, Bootstrap oder eigenes CSS-Framework</li>
  <li><strong>Snippets</strong> – wiederverwendbare HTML-Bausteine per Klick einfügen</li>
  <li>Intelligente <strong>Paste-Bereinigung</strong> (Word, Google Docs, Mediapool-Detection)</li>
  <li><strong>Frontend-CSS</strong> pro Plugin mit CSS-Variablen und Dark-Mode</li>
</ul>

<h2 id="for-toc-die-for-plugins">Die FOR-Plugins</h2>
<p>Alle FOR-Plugins haben das Präfix <code>for_</code> und sind im Profil-Assistenten mit einem <strong>„FOR"-Badge</strong> hervorgehoben.</p>
<h3>Übersicht</h3>
<table>
  <thead>
    <tr><th scope="col">Plugin</th><th scope="col">Zweck</th></tr>
  </thead>
  <tbody>
    <tr><td><code>for_images</code></td><td>Bilder aus dem Mediapool mit Preset-Breiten statt Pixel-Werten</td></tr>
    <tr><td><code>for_oembed</code></td><td>YouTube/Vimeo etc. mit echter Vorschau im Editor</td></tr>
    <tr><td><code>for_video</code></td><td>Lokale HTML5-Videos aus dem Mediapool</td></tr>
    <tr><td><code>for_htmlembed</code></td><td>Sichere HTML-Snippets einbetten</td></tr>
    <tr><td><code>for_checklist</code> / <code>for_checklist_feature</code></td><td>Task- und Feature-Listen</td></tr>
    <tr><td><code>for_footnote</code></td><td>Fußnoten mit Live-Sync und Rück-Verweisen</td></tr>
    <tr><td><code>for_toc</code></td><td>Inhaltsverzeichnis mit Live-Sync (siehe oben ↑)</td></tr>
    <tr><td><code>for_a11y</code></td><td>Accessibility-Checker on demand (WCAG-nah)</td></tr>
  </tbody>
</table>

<h2 id="for-toc-beispiele">Beispiele zum Ausprobieren</h2>

<h3>Fußnoten</h3>
<p>Dieser Satz hat eine Fußnote<sup class="for-footnote-ref" id="for-fnref-demo1" data-for-fn-id="demo1" contenteditable="false"><a href="#for-fn-demo1">[1]</a></sup> – klick ins Fußnoten-Feld unten, um sie zu bearbeiten. Ein weiterer Beleg<sup class="for-footnote-ref" id="for-fnref-demo2" data-for-fn-id="demo2" contenteditable="false"><a href="#for-fn-demo2">[2]</a></sup> folgt.</p>

<h3>Checkliste</h3>
<ul class="for-checklist">
  <li class="for-checklist__item for-checklist__item--done">Profil anlegen</li>
  <li class="for-checklist__item for-checklist__item--done">Plugins aktivieren</li>
  <li class="for-checklist__item">Toolbar anpassen</li>
  <li class="for-checklist__item">Snippets hinzufügen</li>
</ul>

<h3>Feature-Liste</h3>
<ul class="for-checklist for-checklist--feature">
  <li class="for-checklist__item for-checklist__item--done">Open Source (MIT)</li>
  <li class="for-checklist__item for-checklist__item--done">Keine Cloud-Abhängigkeit</li>
  <li class="for-checklist__item for-checklist__item--done">Mediapool-Integration</li>
  <li class="for-checklist__item for-checklist__item--done">Dark-Mode Backend</li>
</ul>

<h3>Tabelle</h3>
<table>
  <caption>Empfohlene Profile</caption>
  <thead>
    <tr><th scope="col">Profil</th><th scope="col">Einsatz</th><th scope="col">Kern-Plugins</th></tr>
  </thead>
  <tbody>
    <tr><td>minimal</td><td>Meta-Felder, Teaser</td><td>lists link</td></tr>
    <tr><td>standard</td><td>Textartikel, Blog</td><td>lists link for_images for_toc for_footnotes for_a11y</td></tr>
    <tr><td>full</td><td>Landingpages</td><td>alle FOR-Plugins + Style-Sets</td></tr>
  </tbody>
</table>

<h2 id="for-toc-profil-assistent">Profil-Assistent</h2>
<p>Der <strong>Profil-Assistent</strong> unter <em>TinyMCE → Editor Profile → bearbeiten</em> erlaubt das Zusammenklicken von Plugins, Toolbar-Buttons, Menüs, Quickbars und Image-Width-Presets – ohne JavaScript-Konfiguration von Hand. Eigene FOR-Plugins werden mit „FOR"-Badge markiert, damit auf einen Blick sichtbar ist, was von hier kommt.</p>
<blockquote>
  <p><strong>Tipp:</strong> Probier den <code>for_a11y</code>-Button in der Toolbar – er öffnet ein schwebendes, verschiebbares Panel und zeigt Accessibility-Befunde direkt im Editor (z. B. den leeren Link hier im Demo-Text).</p>
</blockquote>
<p>Links:
  <a href="#">leerer Anker ohne Ziel</a> ·
  <a href="https://github.com/FriendsOfREDAXO/tinymce" target="_blank" rel="noopener">GitHub-Repository</a> ·
  <a href="https://www.tiny.cloud/docs/tinymce/latest/" target="_blank" rel="noreferrer noopener">TinyMCE-Dokumentation</a>
</p>

<div class="for-footnotes" contenteditable="true">
  <hr>
  <ol>
    <li id="for-fn-demo1" data-for-fn-id="demo1"><a class="for-footnote-back" href="#for-fnref-demo1" contenteditable="false">^</a> <span class="for-footnote-text">Diese Fußnote wurde per <code>for_footnote</code>-Plugin erzeugt und wird beim Speichern automatisch nummeriert.</span></li>
    <li id="for-fn-demo2" data-for-fn-id="demo2"><a class="for-footnote-back" href="#for-fnref-demo2" contenteditable="false">^</a> <span class="for-footnote-text">Noch ein Beispiel – entferne die Hochzahl im Text und beobachte, wie der Eintrag beim Re-Sync verschwindet.</span></li>
  </ol>
</div>
HTML;

$content = '
<div class="tinymce-demo">
    <div name="content" class="tiny-editor" data-profile="demo" data-lang="' . Lang::getUserLang() . '">'
    . $demoHtml .
    '</div>
</div>
';


$fragment = new rex_fragment();
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
