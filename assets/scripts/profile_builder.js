
$(document).on('rex:ready', function (event, container) {
    if (container.find('.tinymce_profile_edit').length) {
        initTinyMceProfileAssistant();
    }
});

function initTinyMceProfileAssistant() {
    const i18n = rex.tinymceProfileI18n || {};
    const $textarea = $('textarea.tinymce-options');
    const $builderContainer = $('<div id="tinymce-profile-assistant" class="panel panel-info" style="display:none; margin-bottom: 20px;"></div>');
    const $builderHeader = $('<div class="panel-heading"><h3 class="panel-title"><i class="rex-icon fa-magic"></i> ' + (i18n.profile_assistant || 'Profile Assistant') + '</h3></div>');
    const $builderBody = $('<div class="panel-body"></div>');
    $builderContainer.append($builderHeader);
    $builderContainer.append($builderBody);
    
    // Toggle Button – die bestehende Konfiguration wird beim Init automatisch
    // in den Assistenten geladen (siehe loadFromConfig-Aufruf am Ende), daher
    // gibt es keinen separaten "Konfiguration übernehmen"-Button mehr.
    const $toggleBtn = $('<button type="button" class="btn btn-info" style="margin-bottom: 10px;"><i class="rex-icon fa-magic"></i> ' + (i18n.profile_assistant || 'Profile Assistant') + '</button>');
    $toggleBtn.on('click', function() {
        $builderContainer.slideToggle();
    });

    $textarea.before($toggleBtn);
    $textarea.before($builderContainer);

    // Presets
    let presetsHtml = '<legend>' + (i18n.presets || 'Presets') + '</legend><div class="btn-group btn-group-justified">';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-simple"><i class="rex-icon fa-minus"></i> ' + (i18n.simple || 'Simple') + '</button></div>';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-standard"><i class="rex-icon fa-bars"></i> ' + (i18n.standard || 'Standard') + '</button></div>';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-full"><i class="rex-icon fa-th"></i> ' + (i18n.full || 'Full') + '</button></div>';
    presetsHtml += '</div><br>';

    // Builder UI
    const options = rex.tinymceProfileOptions || {};
    // Sort plugin and toolbar lists alphabetically for easier scanning in the assistant.
    const pluginsList = (options.plugins || []).slice().sort((a, b) => String(a).localeCompare(String(b)));
    const toolbarButtons = Array.from(new Set((options.toolbar || []).concat(['stylesets']))).sort((a, b) => String(a).localeCompare(String(b)));

    // Plugins Section – FOR plugins are highlighted as FriendsOfREDAXO custom plugins.
    // Besides the `for_*` naming convention there are legacy custom plugins that predate
    // the convention (mediapaste, snippets, cleanpaste, quote, link_yform, …).
    // The server computes the full list of bundled FOR plugins in `for_plugins` /
    // `for_toolbar_buttons`. Plugins registered by OTHER AddOns (writeassist, …) are
    // highlighted separately in green.
    const addonPluginSet = new Set(options.addon_plugins || []);
    const addonToolbarSet = new Set(options.addon_toolbar_buttons || []);
    const forPluginSet = new Set(options.for_plugins || []);
    const forToolbarSet = new Set(options.for_toolbar_buttons || []);
    const isAddonPlugin = (name) => addonPluginSet.has(name);
    const isAddonToolbarBtn = (name) => addonToolbarSet.has(name);
    const isForPlugin = (name) => typeof name === 'string' && (name.indexOf('for_') === 0 || forPluginSet.has(name));
    const isForToolbarBtn = (name) => {
        if (typeof name !== 'string') {
            return false;
        }
        return name === 'stylesets' || name.indexOf('for_') === 0 || forToolbarSet.has(name);
    };
    let pluginsHtml = '<legend>' + (i18n.plugins || 'Plugins') + ' '
        + '<small class="for-plugin-legend-hint"><span class="for-plugin-badge-inline">FOR</span> ' + (i18n.for_plugins_hint || 'FriendsOfREDAXO custom plugins') + '</small> '
        + '<small class="for-plugin-legend-hint"><span class="for-plugin-badge-inline for-plugin-badge--addon">AddOn</span> ' + (i18n.addon_plugins_hint || 'Plugins aus externen AddOns') + '</small>'
        + '</legend><div class="row">';
    pluginsList.forEach(plugin => {
        let rowClass = '';
        let badge = '';
        if (isAddonPlugin(plugin)) {
            rowClass = ' builder-plugin-row--addon';
            badge = '<span class="for-plugin-badge for-plugin-badge--addon" title="Plugin aus externem AddOn">AddOn</span> ';
        } else if (isForPlugin(plugin)) {
            rowClass = ' builder-plugin-row--for';
            badge = '<span class="for-plugin-badge" title="FriendsOfREDAXO">FOR</span> ';
        }
        pluginsHtml += `<div class="col-md-3 col-sm-4${rowClass}"><div class="checkbox"><label><input type="checkbox" class="builder-plugin" value="${plugin}"> ${badge}${plugin}</label></div></div>`;
    });
    pluginsHtml += '</div><br>';

    // Toolbar Section
    const toolbarModes = [
        { value: 'sliding', label: i18n.toolbar_mode_sliding || 'Sliding (default)' },
        { value: 'floating', label: i18n.toolbar_mode_floating || 'Floating' },
        { value: 'wrap', label: i18n.toolbar_mode_wrap || 'Wrap' },
        { value: 'scrolling', label: i18n.toolbar_mode_scrolling || 'Scrolling' },
    ];
    const toolbarSuggestions = toolbarButtons.slice();
    toolbarSuggestions.push('|');

    let toolbarHtml = '<legend class="builder-subsection-title"><i class="rex-icon fa-wrench"></i> ' + (i18n.toolbar || 'Toolbar') + '</legend><p class="help-block">' + (i18n.toolbar_help || 'Manage one or more toolbars. Each row becomes one TinyMCE toolbar line.') + '</p>';
    toolbarHtml += '<div class="checkbox"><label><input type="checkbox" class="builder-toolbar-enabled" checked> <strong>' + (i18n.toolbar_enabled || 'Show toolbar') + '</strong></label><p class="help-block">' + (i18n.toolbar_enabled_help || 'Disable this to generate <code>toolbar: false</code>. This keeps profiles without a toolbar compatible with TinyMCE.') + '</p></div>';
    toolbarHtml += '<div class="builder-toolbar-settings">';
    toolbarHtml += '<div class="row"><div class="col-md-4"><div class="form-group"><label>' + (i18n.toolbar_mode || 'Toolbar view') + '</label><select class="form-control builder-toolbar-mode">';
    toolbarModes.forEach((mode) => {
        toolbarHtml += '<option value="' + mode.value + '"' + (mode.value === 'sliding' ? ' selected' : '') + '>' + mode.label + '</option>';
    });
    toolbarHtml += '</select><p class="help-block">' + (i18n.toolbar_mode_help || 'Controls how TinyMCE handles overflowing toolbar buttons.') + '</p></div></div></div>';
    toolbarHtml += '<div class="builder-toolbar-rows"></div>';
    toolbarHtml += '<button type="button" class="btn btn-default btn-xs builder-toolbar-row-add"><i class="rex-icon fa-plus"></i> ' + (i18n.toolbar_add_row || 'Add toolbar row') + '</button>';
    toolbarHtml += '<div class="form-group" style="display:none;"><label>' + (i18n.toolbar_result || 'Toolbar String (Result)') + '</label><textarea class="form-control builder-toolbar-input" rows="3" readonly></textarea></div>';
    toolbarHtml += '</div>';

    // Heading-Helper fuer die Gruppen-Ueberschriften (Schritt 1..5).
    // Visuelles Styling kommt aus css/profile_builder.css (Balken + Darkmode).
    const groupTitle = (num, icon, label) =>
        '<h3 class="builder-group-title">'
        + '<span class="builder-group-num">' + num + '</span>'
        + '<i class="rex-icon ' + icon + '"></i>'
        + '<span class="builder-group-label">' + label + '</span>'
        + '</h3>';

    // ===== GRUPPE 1: GRUNDEINSTELLUNGEN =====
    // Editor-Geometrie, UI-Verhalten, URL-/Encoding-Optionen – alles "global wirkende".
    let group1Html = groupTitle('1', 'fa-cog', i18n.group_basics || 'Grundeinstellungen');

    // 1a) Editor-Geometrie & Sprache
    group1Html += '<legend>' + (i18n.common_settings || 'Common Settings') + '</legend><div class="row">';
    group1Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.height || 'Height') + '</label><input type="text" class="form-control builder-height" value="400" placeholder="400, 400px, 20em"><p class="help-block">' + (i18n.height_help || 'Zahl = Pixel, sonst gültiger CSS-Wert (<code>px</code>, <code>pt</code>, <code>em</code>). Laut TinyMCE-Doku sind <code>%</code>, <code>vh</code> und <code>auto</code> <strong>nicht</strong> unterstützt – für variable Höhe bitte Autoresize anhaken.') + '</p></div></div>';
    group1Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.width || 'Breite') + '</label><input type="text" class="form-control builder-width" placeholder="auto, 100%, 800, 50vh"><p class="help-block">' + (i18n.width_help || 'Optional. Zahl = Pixel, sonst CSS-Wert (unterstützt <code>%</code>, <code>em</code>, <code>vh</code> …). Leer lassen = volle Container-Breite.') + '</p></div></div>';
    group1Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.language || 'Language') + '</label><input type="text" class="form-control builder-lang" value="de"></div></div>';
    group1Html += '</div>';

    // 1b) Resize & Autoresize
    group1Html += '<div class="row">';
    group1Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.resize_handle || 'Resize-Handle') + '</label><select class="form-control builder-resize"><option value="true" selected>' + (i18n.resize_vertical || 'vertikal (Standard)') + '</option><option value="false">' + (i18n.resize_off || 'aus') + '</option><option value="both">' + (i18n.resize_both || 'beide Richtungen') + '</option></select></div></div>';
    group1Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.min_height || 'Min-Höhe (px)') + '</label><input type="number" class="form-control builder-min-height" placeholder="100" min="0"></div></div>';
    group1Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.max_height || 'Max-Höhe (px)') + '</label><input type="number" class="form-control builder-max-height" placeholder="" min="0"></div></div>';
    group1Html += '<div class="col-md-3"><div class="checkbox builder-checkbox-align"><label><input type="checkbox" class="builder-autoresize"> <strong>' + (i18n.autoresize || 'Autoresize (Editor wächst mit Inhalt)') + '</strong></label><p class="help-block">' + (i18n.autoresize_help || 'Aktiviert das <code>autoresize</code>-Plugin. <code>min_height</code>/<code>max_height</code> setzen die Grenzen des automatischen Wachstums, <code>height</code> wird ignoriert.') + '</p></div></div>';
    group1Html += '</div>';

    // 1c) Editor-Chrome: Menueleiste & Auto-Hide Toolbar
    group1Html += '<div class="row">';
    group1Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-menubar" checked> ' + (i18n.menubar || 'Show Menubar') + '</label></div></div>';
    group1Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-auto-hide-toolbar"> ' + (i18n.auto_hide_toolbar || 'Auto-Hide Toolbar') + '</label><p class="help-block">' + (i18n.auto_hide_toolbar_help || 'Menue-, Werkzeug- und Statusleiste werden eingeklappt und erst beim <strong>Hovern</strong> oder wenn der Editor den <strong>Fokus</strong> bekommt eingeblendet. Spart vertikalen Platz in kompakten Formularen.') + '</p></div></div>';
    group1Html += '</div>';

    // 1d) URL- und Encoding-Optionen (frueher quer ueber "Advanced" verteilt)
    group1Html += '<br><legend class="builder-subsection-title"><i class="rex-icon fa-link"></i> ' + (i18n.url_encoding_options || 'URL & Encoding') + '</legend><div class="row">';
    group1Html += '<div class="col-md-2"><div class="checkbox"><label><input type="checkbox" class="builder-relative-urls"> ' + (i18n.relative_urls || 'Relative URLs') + '</label></div></div>';
    group1Html += '<div class="col-md-2"><div class="checkbox"><label><input type="checkbox" class="builder-remove-script-host" checked> ' + (i18n.remove_script_host || 'Remove Script Host') + '</label></div></div>';
    group1Html += '<div class="col-md-2"><div class="checkbox"><label><input type="checkbox" class="builder-convert-urls"> ' + (i18n.convert_urls || 'Convert URLs') + '</label></div></div>';
    group1Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.document_base_url || 'Document Base URL') + '</label><input type="text" class="form-control builder-base-url" value="/"></div></div>';
    group1Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.entity_encoding || 'Entity Encoding') + '</label><select class="form-control builder-entity-encoding"><option value="raw" selected>raw</option><option value="named">named</option><option value="numeric">numeric</option></select></div></div>';
    group1Html += '</div>';
    group1Html += '<div class="row"><div class="col-md-12"><p class="help-block" style="margin-top:-5px;">' + (i18n.convert_urls_help || '<strong>Empfehlung:</strong> <code>Convert URLs</code> deaktiviert lassen. Aus dem Mediapool werden URLs als <code>/media/datei.pdf</code> eingefügt – ohne Konvertierung bleiben sie genau so erhalten. Mit aktiver Konvertierung kann TinyMCE sie unerwartet zu absoluten URLs mit Protokoll und Hostname umschreiben (siehe Issue #175).') + '</p></div></div>';
    group1Html += '<div class="row"><div class="col-md-12"><p class="help-block" style="margin-top:-5px;">' + (i18n.entity_encoding_help || '<strong>Entity Encoding – Empfehlung: <code>raw</code>.</strong> Bei UTF-8 (Standard in REDAXO) bleiben Umlaute, € und Symbole als echte Zeichen erhalten. <code>named</code> wandelt sie in HTML-Entities um (<code>&amp;auml;</code>), <code>numeric</code> in numerische Codes (<code>&amp;#228;</code>) – nur nötig für Legacy-Pipelines ohne UTF-8 (z. B. ASCII-Mailversand). Details: <a href="https://www.tiny.cloud/docs/tinymce/latest/content-filtering/#entity_encoding" target="_blank" rel="noopener noreferrer">TinyMCE-Doku</a>.') + '</p></div></div>';
    group1Html += '</div>';

    // ===== GRUPPE 3: TOOLBARS & MENUES (Erweiterungen zur Haupt-Toolbar) =====
    // Haupt-Toolbar steckt bereits in toolbarHtml (oberhalb). Hier nur Context-Toolbar
    // und Insert-Menue, beide jetzt gleichrangig nebeneinander – das Insert-Menue ist
    // nicht mehr als Sub-Block der Context-Toolbar verschachtelt.
    // Untergruppe von Schritt 3 – kein eigener Schritt-Header, nur ein Sub-Legend.
    let group3ExtrasHtml = '<legend class="builder-subsection-title"><i class="rex-icon fa-th-list"></i> ' + (i18n.group_toolbar_extras || 'Context-Toolbar & Einfügen-Menü') + '</legend>';

    // Context Toolbar
    group3ExtrasHtml += '<div class="row"><div class="col-md-12">';
    group3ExtrasHtml += '<div class="checkbox"><label><input type="checkbox" class="builder-context-toolbar"> <strong>' + (i18n.context_toolbar || 'Context Toolbar (Quickbars)') + '</strong></label><p class="help-block">' + (i18n.context_toolbar_help || 'Shows tools directly at the cursor when text is selected.') + '</p></div>';
    group3ExtrasHtml += '<div class="builder-context-toolbar-options" style="display:none; padding-left: 20px; margin-bottom: 15px; border-left: 3px solid #eee;">';
    group3ExtrasHtml += '<div class="panel panel-primary"><div class="panel-heading">' + (i18n.context_items || 'Context Toolbar Items (Drag to reorder)') + '</div><div class="panel-body builder-dropzone-panel-body">';
    group3ExtrasHtml += '<div class="builder-context-toolbar-picker-label">' + (i18n.toolbar_click_to_pick || 'Ins Feld klicken, dann im Dropdown waehlen. Markierungen: Core / FOR / AddOn.') + '</div>';
    group3ExtrasHtml += '<div class="builder-toolbar-pill-dropzone">';
    group3ExtrasHtml += '<ul class="builder-toolbar-pill-list builder-context-pill-list" id="builder-context-selected-items" style="margin-bottom: 0;"></ul>';
    group3ExtrasHtml += '<div class="builder-toolbar-inline-picker builder-context-inline-picker">';
    group3ExtrasHtml += '<input type="text" class="form-control input-sm builder-toolbar-inline-picker-search builder-context-inline-picker-search" placeholder="' + escapeHtml(i18n.search || 'Suche') + '">';
    group3ExtrasHtml += '<div class="builder-toolbar-inline-picker-list builder-context-inline-picker-list"></div>';
    group3ExtrasHtml += '</div></div></div></div>';
    group3ExtrasHtml += '<div class="form-group" style="display:none;"><label>' + (i18n.context_result || 'Context Toolbar Code') + '</label><input type="text" class="form-control builder-context-toolbar-selection" value="bold italic | link h2 h3 blockquote" readonly></div>';
    group3ExtrasHtml += '</div>';
    group3ExtrasHtml += '</div></div>';

    // Insert Menue – eigenstaendig, nicht mehr in Context-Toolbar verschachtelt
    group3ExtrasHtml += '<div class="row" style="margin-top:10px;"><div class="col-md-12">';
    group3ExtrasHtml += '<div class="checkbox"><label><input type="checkbox" class="builder-context-toolbar-insert"> <strong>' + (i18n.show_insert_toolbar || 'Show Insert Toolbar') + '</strong></label></div>';
    group3ExtrasHtml += '<div class="builder-insert-toolbar-options" style="display:none; padding-left: 20px; margin-bottom: 15px; border-left: 3px solid #eee;">';
    group3ExtrasHtml += '<div class="panel panel-default"><div class="panel-heading">' + (i18n.insert_items || 'Insert Menu Items (Drag to reorder)') + '</div><div class="panel-body builder-dropzone-panel-body">';
    group3ExtrasHtml += '<div class="builder-insert-toolbar-picker-label">' + (i18n.toolbar_click_to_pick || 'Ins Feld klicken, dann im Dropdown waehlen. Markierungen: Core / FOR / AddOn.') + '</div>';
    group3ExtrasHtml += '<div class="builder-toolbar-pill-dropzone">';
    group3ExtrasHtml += '<ul class="builder-toolbar-pill-list builder-insert-pill-list" id="builder-insert-selected-items" style="margin-bottom: 0;"></ul>';
    group3ExtrasHtml += '<div class="builder-toolbar-inline-picker builder-insert-inline-picker">';
    group3ExtrasHtml += '<input type="text" class="form-control input-sm builder-toolbar-inline-picker-search builder-insert-inline-picker-search" placeholder="' + escapeHtml(i18n.search || 'Suche') + '">';
    group3ExtrasHtml += '<div class="builder-toolbar-inline-picker-list builder-insert-inline-picker-list"></div>';
    group3ExtrasHtml += '</div></div></div></div>';
    group3ExtrasHtml += '<div class="form-group" style="display:none;"><label>' + (i18n.insert_result || 'Insert Menu Code') + '</label><input type="text" class="form-control builder-insert-menu-input" value="" readonly></div>';
    group3ExtrasHtml += '</div>';
    group3ExtrasHtml += '</div></div>';

    // ===== GRUPPE 4: PRESETS & DEFAULTS =====
    // Sammelt alles, was Inhalte/Formate vor-konfiguriert (Sprachmenue, Farben,
    // Link-Defaults, Codesample/RelList, YForm-Link).
    let group4Html = groupTitle('4', 'fa-magic', i18n.group_presets || 'Presets & Defaults');

    // 4a) Content Languages
    group4Html += '<legend><i class="rex-icon fa-language"></i> ' + (i18n.content_langs || 'Sprach-Menü (content_langs)') + '</legend>';
    group4Html += '<p class="help-block">' + (i18n.content_langs_help || 'Liste der Sprachen für den <code>language</code>-Toolbar-Button bzw. das Format-Menü. Markiert Textabschnitte mit einem <code>lang</code>-Attribut (wichtig für Screenreader/SEO).') + '</p>';
    group4Html += '<div class="panel panel-default"><div class="panel-body">';
    group4Html += '<table class="table table-striped" id="builder-contentlangs-table"><thead><tr>';
    group4Html += '<th style="width:30%">' + (i18n.content_langs_title || 'Titel') + '</th>';
    group4Html += '<th style="width:20%">' + (i18n.content_langs_code || 'Code (lang)') + '</th>';
    group4Html += '<th style="width:25%">' + (i18n.content_langs_customcode || 'Custom-Code (optional)') + '</th>';
    group4Html += '<th style="width:15%">' + (i18n.content_langs_default || 'Standard') + '</th>';
    group4Html += '<th style="width:10%"></th>';
    group4Html += '</tr></thead><tbody></tbody></table>';
    group4Html += '<button type="button" class="btn btn-default btn-xs builder-contentlangs-add"><i class="rex-icon fa-plus"></i> ' + (i18n.content_langs_add || 'Sprache hinzufügen') + '</button> ';
    group4Html += '<button type="button" class="btn btn-default btn-xs builder-contentlangs-presets"><i class="rex-icon fa-magic"></i> ' + (i18n.content_langs_presets || 'Standard-Set einfügen (de/en/fr/es/it)') + '</button>';
    group4Html += '<p class="help-block" style="margin-top:8px;">' + (i18n.content_langs_hint || '<strong>Titel</strong>: Beschriftung im Menü. <strong>Code</strong>: BCP-47-Sprachcode (z. B. <code>de</code>, <code>en</code>, <code>de-CH</code>). <strong>Custom-Code</strong>: optional, wird als <code>data-mce-lang</code> gesetzt. <strong>Standard</strong>: setzt zusätzlich <code>language</code> (UI-Sprache) auf diesen Code. Leer lassen = Sprach-Menü deaktiviert.') + '</p>';
    group4Html += '</div></div>';

    // 4b) Color Mapping
    group4Html += '<br><legend><i class="rex-icon fa-eyedropper"></i> ' + (i18n.color_mapping || 'Farb-Mapping (color_map_raw)') + '</legend>';
    group4Html += '<div class="panel panel-default builder-color-section"><div class="panel-body">';
    group4Html += '<div class="row">';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-color-map-enable"> <strong>' + (i18n.color_mapping_enable || 'Eigenes Farb-Mapping aktivieren') + '</strong></label></div></div>';
    group4Html += '<div class="col-md-2"><div class="form-group"><label>' + (i18n.color_cols || 'Spalten (color_cols)') + '</label><input type="number" class="form-control builder-color-cols" min="1" max="20" value="4"></div></div>';
    group4Html += '<div class="col-md-6" style="padding-top: 25px;"><button type="button" class="btn btn-default btn-xs builder-color-map-demo"><i class="rex-icon fa-magic"></i> ' + (i18n.color_mapping_demo || 'Demo-Mapping einfügen') + '</button></div>';
    group4Html += '</div>';
    group4Html += '<div class="row" style="margin-top: 4px; margin-bottom: 6px;"><div class="col-md-12"><div class="checkbox"><label><input type="checkbox" class="builder-custom-colors"> ' + (i18n.custom_colors || 'Eigene Farbe in der Farbauswahl erlauben') + '</label></div></div></div>';
    group4Html += '<div class="row" style="margin-bottom: 8px;">';
    group4Html += '<div class="col-md-3"><input type="text" class="form-control input-sm builder-color-map-new-color" placeholder="#1d4ed8"></div>';
    group4Html += '<div class="col-md-5"><input type="text" class="form-control input-sm builder-color-map-new-label" placeholder="Blau"></div>';
    group4Html += '<div class="col-md-4"><button type="button" class="btn btn-default btn-xs builder-color-map-add"><i class="rex-icon fa-plus"></i> ' + (i18n.color_mapping_add || 'Farbe hinzufügen') + '</button></div>';
    group4Html += '</div>';
    group4Html += '<table class="table table-striped table-condensed" id="builder-color-map-table">';
    group4Html += '<thead><tr><th style="width: 30%;">' + (i18n.color_mapping_color || 'Farbe') + '</th><th style="width: 50%;">' + (i18n.color_mapping_label || 'Label') + '</th><th style="width: 20%;"></th></tr></thead><tbody></tbody></table>';
    group4Html += '<div class="form-group"><label>' + (i18n.color_map_raw_label || 'color_map_raw (JSON-Array)') + '</label><textarea class="form-control builder-color-map-raw" rows="4" placeholder="[\"#1d4ed8\", \"Blau\", \"#0f766e\", \"Türkis\"]"></textarea>';
    group4Html += '<p class="help-block">' + (i18n.color_map_raw_help || 'Gerade Anzahl an Einträgen: immer Farbe, dann Label. Beispiel: [\"#1d4ed8\",\"Blau\",\"#0f766e\",\"Türkis\"].') + '</p></div>';
    group4Html += '</div></div>';

    // 4c) Link-Defaults
    group4Html += '<br><legend><i class="rex-icon fa-link"></i> ' + (i18n.link_defaults || 'Link-Defaults') + '</legend><div class="row">';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-link-target-list" checked> ' + (i18n.link_target_list_label || 'Klare Link-Ziele (target_list, dt.)') + '</label></div></div>';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-link-noreferrer" checked> ' + (i18n.link_noreferrer_label || 'Bei target="_blank" automatisch rel="noopener noreferrer"') + '</label></div></div>';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-link-default-https" checked> ' + (i18n.link_default_https_label || 'Standard-Protokoll: https') + '</label></div></div>';
    group4Html += '</div>';

    // 4d) Extras (Codesample, RelList)
    group4Html += '<br><legend>' + (i18n.extras_defaults || 'Extras (Defaults)') + '</legend><div class="row">';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-codesample" checked> ' + (i18n.default_codesample_languages || 'Default Codesample Languages') + '</label></div></div>';
    group4Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-rellist" checked> ' + (i18n.default_rellist || 'Default Rel List') + '</label></div></div>';
    group4Html += '</div>';

    // 4e) YForm Link
    group4Html += '<br><legend><i class="rex-icon fa-database"></i> ' + (i18n.link_yform_section || 'Link YForm Configuration') + '</legend>';
    group4Html += '<div class="panel panel-default"><div class="panel-body">';
    group4Html += '<div class="form-group"><label>Dropdown Title</label><input type="text" class="form-control builder-yform-title" value="YForm Datensätze"></div>';
    group4Html += '<table class="table table-striped" id="builder-yform-table"><thead><tr><th>Title</th><th>Table</th><th>Field</th><th>Link-Schema (opt.)</th><th></th></tr></thead><tbody></tbody></table>';
    group4Html += '<p class="help-block" style="margin-top:4px;">' + (i18n.link_schema_help || '<strong>Link-Schema (optional):</strong> URL-Muster für den erzeugten Link. Platzhalter: <code>[id]</code> = ID des YForm-Datensatzes, <code>[field]</code> = gewählter Feldwert. Beispiele: <code>index.php?article_id=5&amp;news=[id]</code> oder <code>/produkt/[id]</code>. Leer lassen = es wird nur der Feldwert als Link-Text eingefügt.') + '</p>';
    group4Html += '<button type="button" class="btn btn-default btn-xs builder-yform-add"><i class="rex-icon fa-plus"></i> Add Item</button>';
    group4Html += '</div></div>';

    // ===== GRUPPE 5: ERWEITERTE OPTIONEN =====
    // Plugin-spezifische Konfiguration: Typografie-Autoreplace, FOR Images (inkl.
    // frueher verstreuten Bild-Optionen), Layout-Regeln, TOC, Protected Extras.
    let group5Html = groupTitle('5', 'fa-wrench', i18n.group_advanced || 'Erweiterte Optionen');

    // 5a) Typografie-Autoreplace (for_chars_symbols)
    group5Html += '<legend><i class="rex-icon fa-magic"></i> ' + (i18n.autoreplace || 'Typografie-Autoreplace (for_chars_symbols)') + '</legend>';
    group5Html += '<p class="help-block">' + (i18n.autoreplace_help || 'Live-Ersetzung beim Tippen. Ausgelöst durch <kbd>Leer</kbd>, <kbd>Enter</kbd> und Satzzeichen (<code>. , ; : ! ? ) ] " \' /</code>). Greift nicht in <code>&lt;code&gt;</code>, <code>&lt;pre&gt;</code>, <code>&lt;kbd&gt;</code>, <code>&lt;samp&gt;</code>, <code>&lt;tt&gt;</code>. Alle Ersetzungen sind Undo-fähig.') + '</p>';
    group5Html += '<div class="panel panel-default"><div class="panel-body">';
    group5Html += '<div class="row"><div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-autoreplace-enabled"> <strong>' + (i18n.autoreplace_enabled || 'Autoreplace aktivieren') + '</strong></label></div></div>';
    group5Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-autoreplace-defaults" checked> ' + (i18n.autoreplace_defaults || 'Default-Regeln nutzen (32 Regeln: (c)→©, (tm)→™, …→…, ->→→, +/-→±, Brüche, …)') + '</label></div></div></div>';
    group5Html += '<div class="row"><div class="col-md-12"><div class="checkbox"><label><input type="checkbox" class="builder-disable-emoticons"> ' + (i18n.disable_emoticons || 'Emoji-Tab im Picker ausblenden') + '</label></div></div></div>';
    group5Html += '<hr>';
    group5Html += '<label>' + (i18n.autoreplace_custom || 'Eigene Regeln') + '</label>';
    group5Html += '<table class="table table-striped" id="builder-autoreplace-table"><thead><tr>';
    group5Html += '<th style="width:10%">' + (i18n.autoreplace_type || 'Typ') + '</th>';
    group5Html += '<th style="width:40%">' + (i18n.autoreplace_from || 'Von (Text oder Regex)') + '</th>';
    group5Html += '<th style="width:40%">' + (i18n.autoreplace_to || 'Nach (Ziel-Zeichen)') + '</th>';
    group5Html += '<th style="width:10%"></th>';
    group5Html += '</tr></thead><tbody></tbody></table>';
    group5Html += '<button type="button" class="btn btn-default btn-xs builder-autoreplace-add"><i class="rex-icon fa-plus"></i> ' + (i18n.autoreplace_add || 'Regel hinzufügen') + '</button> ';
    group5Html += '<button type="button" class="btn btn-default btn-xs builder-autoreplace-examples"><i class="rex-icon fa-magic"></i> ' + (i18n.autoreplace_examples || 'Beispiele einfügen') + '</button>';
    group5Html += '<p class="help-block" style="margin-top:8px;">' + (i18n.autoreplace_hint || '<strong>Typ</strong>: <code>Text</code> = wörtliche Ersetzung, <code>Regex</code> = regulärer Ausdruck mit Backreferences (<code>$1</code>, <code>$2</code>). <strong>Nach</strong>: Unicode-Escapes wie <code>\\u00A0</code> (nbsp) oder <code>\\u2011</code> (geschützter Bindestrich) sind erlaubt. Beispiele: Text <code>(tel)</code> → <code>+49 …</code>; Regex <code>\\(kw(\\d{1,2})\\)</code> → <code>KW $1</code>.') + '</p>';
    group5Html += '</div></div>';

    // 5b) FOR Images – inkl. der frueher in "Advanced" verstreuten Bild-Optionen
    group5Html += '<br><legend><i class="rex-icon fa-image"></i> ' + (i18n.imagewidth || 'FOR Images') + ' <small class="text-muted" style="font-weight:normal;">(for_images)</small></legend>';
    group5Html += '<p class="help-block">' + (i18n.imagewidth_help || 'Erweiterte Bildformatierung über CSS-Klassen statt manuellem Resize: feste Breiten, Ausrichtung (links/rechts/zentriert), Effekt-Klassen (z. B. Schatten, Rahmen, Rundungen) und &lt;figure&gt;-Wrapping mit Caption. Presets für UIkit, Bootstrap und allgemeine Pixelwerte – inklusive Mediapool-Ersetzen direkt im Editor.') + '</p>';
    group5Html += '<p class="help-block small"><i class="rex-icon fa-info-circle"></i> ' + (i18n.imagewidth_plugin_hint || 'Diese Option ist an das Plugin <code>for_images</code> gekoppelt: Wird <code>for_images</code> in Schritt 2 (Plugins) deaktiviert, wird dieser Block ebenfalls automatisch deaktiviert – und umgekehrt.') + '</p>';
    // 5b.1) Allgemeine Bild-Optionen (vorher in "Advanced" versteckt)
    group5Html += '<div class="row">';
    group5Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-caption" checked> ' + (i18n.image_caption || 'Image Caption') + '</label></div></div>';
    group5Html += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-uploadtab"> ' + (i18n.image_uploadtab || 'Image Upload Tab') + '</label></div></div>';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.media_manager_type || 'Media Manager Type') + '</label><input type="text" class="form-control builder-media-type" placeholder="tiny"></div></div>';
    group5Html += '</div>';
    // 5b.2) FOR-Images Aktivierung + Template
    group5Html += '<div class="row" style="margin-top:10px;">';
    group5Html += '<div class="col-md-3"><div class="checkbox"><label><input type="checkbox" class="builder-imagewidth-enable"> ' + (i18n.imagewidth_enable || 'Aktivieren') + '</label></div></div>';
    group5Html += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.imagewidth_template || 'Vorlage laden') + '</label>';
    group5Html += '<select class="form-control builder-imagewidth-template" disabled>';
    group5Html += '<option value="">-- Auswählen --</option>';
    group5Html += '<option value="uikit">UIkit 3</option>';
    group5Html += '<option value="bootstrap">Bootstrap 5</option>';
    group5Html += '<option value="general">Allgemein (Pixel)</option>';
    group5Html += '</select></div></div>';
    group5Html += '<div class="col-md-3"><div class="form-group"><label>Breakpoint (UIkit/BS)</label>';
    group5Html += '<select class="form-control builder-imagewidth-breakpoint" disabled>';
    group5Html += '<option value="">Alle Viewports</option>';
    group5Html += '<option value="@s">UIkit @s (≥640px)</option>';
    group5Html += '<option value="@m" selected>UIkit @m (≥960px)</option>';
    group5Html += '<option value="@l">UIkit @l (≥1200px)</option>';
    group5Html += '<option value="sm">Bootstrap sm (≥576px)</option>';
    group5Html += '<option value="md">Bootstrap md (≥768px)</option>';
    group5Html += '<option value="lg">Bootstrap lg (≥992px)</option>';
    group5Html += '</select></div></div>';
    group5Html += '</div>';
    // 5b.3) Preset Textareas
    group5Html += '<div class="builder-imagewidth-presets" style="display:none; margin-top:10px;">';
    group5Html += '<div class="row">';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>Breiten-Presets (JSON)</label>';
    group5Html += '<textarea class="form-control builder-imagewidth-width-presets" rows="6" placeholder=\'[{"label":"Klein","class":"uk-width-small@m"}]\'></textarea>';
    group5Html += '<p class="help-block small">Array: [{label, class}]</p></div></div>';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>Ausrichtungs-Presets (JSON)</label>';
    group5Html += '<textarea class="form-control builder-imagewidth-align-presets" rows="6" placeholder=\'[{"label":"Links","class":"uk-float-left uk-margin-right"}]\'></textarea>';
    group5Html += '<p class="help-block small">Array: [{label, class}]</p></div></div>';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>Effekt-Presets (JSON)</label>';
    group5Html += '<textarea class="form-control builder-imagewidth-effect-presets" rows="6" placeholder=\'[{"label":"Schatten","class":"uk-box-shadow-medium"}]\'></textarea>';
    group5Html += '<p class="help-block small">Multi-Select, kombinierbar</p></div></div>';
    group5Html += '</div>';
    // 5b.4) CKE5-Legacy-Hinweis
    group5Html += '<div class="row" style="margin-top:6px;"><div class="col-md-12"><div class="checkbox"><label>';
    group5Html += '<input type="checkbox" class="builder-imagewidth-compat-warn"> ' + (i18n.imagewidth_compat_warn || 'Auf veraltetes CKE5-Bildmarkup hinweisen');
    group5Html += '</label><p class="help-block small" style="margin-left:20px;">' + (i18n.imagewidth_compat_warn_help || 'Zeigt im Editor eine Warnung, wenn der geladene Inhalt noch Bildmarkup aus dem alten CKEditor 5 enthält (z. B. <code>figure.image</code>, <code>image-style-…</code>). Der Redakteur wird gebeten, die betroffenen Bilder mit der neuen Bildformatierungs-Toolbar (Breite, Ausrichtung, Effekte) erneut zu formatieren. Es wird nichts automatisch konvertiert.') + '</p></div></div></div>';
    group5Html += '</div>';

    // 5c) Layout-Regeln
    group5Html += '<br><legend><i class="rex-icon fa-sitemap"></i> ' + (i18n.layout_rules || 'Layout-Regeln (Strukturoptimierung)') + '</legend>';
    group5Html += '<p class="help-block">' + (i18n.layout_rules_help || 'Automatische Korrektur von häufigen Content-Struktur-Problemen. Stilschweigend und nicht-invasiv.') + '</p>';
    group5Html += '<div class="row">';
    group5Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-layout-images-in-headings" checked> ' + (i18n.layout_no_images_in_headings || 'Bilder aus Überschriften verschieben') + '</label><p class="help-block small">' + (i18n.layout_no_images_in_headings_help || 'Bilder, die in h1-h6 sind, werden davor platziert.') + '</p></div></div>';
    group5Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-layout-clear-empty" checked> ' + (i18n.layout_collapse_empty || 'Mehrfache Leerzeilen zusammenfassen') + '</label><p class="help-block small">' + (i18n.layout_collapse_empty_help || 'Mehrere hintereinander folgende leere &lt;p&gt; werden durch ein Clear-Element ersetzt.') + '</p></div></div>';
    group5Html += '</div>';
    group5Html += '<div class="row">';
    group5Html += '<div class="col-md-6"><div class="checkbox"><label><input type="checkbox" class="builder-layout-delete-empty"> ' + (i18n.layout_delete_empty || 'Einzelne leere Absätze löschen') + '</label><p class="help-block small">' + (i18n.layout_delete_empty_help || 'Entfernt einzelne leere &lt;p&gt; am Anfang und Ende.') + '</p></div></div>';
    group5Html += '</div>';
    group5Html += '<div class="row" style="margin-top:10px;">';
    group5Html += '<div class="col-md-6"><div class="form-group"><label>' + (i18n.layout_clear_element || 'Clear-Element CSS-Klasse') + '</label><input type="text" class="form-control builder-layout-clear-class" value="uk-margin" placeholder="uk-margin"></div></div>';
    group5Html += '</div>';

    // 5d) TOC – jetzt mit eigenem Legend, vorher als verwaiste Row an Layout-Regeln drangehaengt
    group5Html += '<br><legend><i class="rex-icon fa-list-ol"></i> ' + (i18n.toc_settings || 'Inhaltsverzeichnis (for_toc)') + '</legend>';
    group5Html += '<div class="row">';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_depth || 'TOC Depth') + '</label><input type="number" class="form-control builder-toc-depth" value="3"></div></div>';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_header_tag || 'TOC Header Tag') + '</label><input type="text" class="form-control builder-toc-header" value="div"></div></div>';
    group5Html += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_class || 'TOC Class') + '</label><input type="text" class="form-control builder-toc-class" value="our-toc"></div></div>';
    group5Html += '</div>';

    // 5e) Protected Extras
    group5Html += '<br><legend>' + (i18n.protected_extras || 'Protected extras') + '</legend>';
    group5Html += '<p class="help-block">' + (i18n.protected_extras_help || 'Raw option lines entered here are appended after the generated options. Use this to keep custom TinyMCE settings or to intentionally override assistant-managed values.') + '</p>';
    group5Html += '<textarea class="form-control builder-protected-extras" rows="8" placeholder="' + (i18n.protected_extras_placeholder || "toolbar_sticky: true,\ntoolbar_sticky_offset: 0") + '"></textarea>';

    // Backwards-compatible alias: einige Stellen weiter unten erwarten settingsHtml.
    // Wir setzen es auf die Plugin-/Defaults-Bloecke (Group 4 + 5); die Gruppen 1 und 3
    // werden separat im finalen $builderBody.html(...) eingefuegt.
    let settingsHtml = group4Html + group5Html;

    // Apply Button(s): Generieren und Generieren+Speichern
    let actionsHtml = '<hr>'
        + '<button type="button" class="btn btn-save builder-apply"><i class="rex-icon fa-check"></i> ' + (i18n.generate_config || 'Generate Configuration') + '</button> '
        + '<button type="button" class="btn btn-save builder-apply-save"><i class="rex-icon fa-save"></i> ' + (i18n.generate_and_save || 'Generate & Save') + '</button> '
        + '<span class="text-muted">' + (i18n.overwrites_existing_config || 'Overwrites existing configuration!') + '</span>';

    // Lineare 5-Schritte-Reihenfolge:
    //   Quick-Start-Presets -> 1. Grundeinstellungen -> 2. Plugins ->
    //   3. Toolbar (Haupt) + 3b Context/Insert -> 4. Presets & Defaults ->
    //   5. Erweiterte Optionen -> Apply-Buttons
    // settingsHtml entspricht inhaltlich (group4Html + group5Html) und bleibt als
    // Backwards-compat-Alias bestehen.
    // Schritt-2-Header steht vor der Plugin-Liste (pluginsHtml beginnt mit einem
    // eigenen <legend>Plugins</legend> als Untertitel, ohne Schritt-Nummer).
    const group2HeaderHtml = groupTitle('2', 'fa-puzzle-piece', i18n.group_plugins || 'Plugins');
    // Schritt-3-Header steht vor der Haupt-Toolbar (toolbarHtml enthaelt nur das
    // eigene <legend>Toolbar</legend> als Untertitel) und gruppiert Haupt-Toolbar
    // + Context-Toolbar/Insert-Menue zu einem visuellen Block.
    const group3HeaderHtml = groupTitle('3', 'fa-th-list', i18n.group_toolbars || 'Toolbars & Menüs');
    $builderBody.html(
        presetsHtml
        + group1Html
        + group2HeaderHtml
        + pluginsHtml
        + group3HeaderHtml
        + toolbarHtml
        + group3ExtrasHtml
        + settingsHtml
        + actionsHtml,
    );

    // Context Toolbar Toggle
    $builderBody.on('change', '.builder-context-toolbar', function() {
        if ($(this).is(':checked')) {
            $builderBody.find('.builder-context-toolbar-options').slideDown();
            $builderBody.find('.builder-plugin[value="quickbars"]').prop('checked', true);
        } else {
            $builderBody.find('.builder-context-toolbar-options').slideUp();
        }
    });

    // Insert Toolbar Toggle
    $builderBody.on('change', '.builder-context-toolbar-insert', function() {
        if ($(this).is(':checked')) {
            $builderBody.find('.builder-insert-toolbar-options').slideDown();
        } else {
            $builderBody.find('.builder-insert-toolbar-options').slideUp();
        }
    });

    // Image Width Plugin Toggle
    $builderBody.on('change', '.builder-imagewidth-enable', function() {
        const enabled = $(this).is(':checked');
        $builderBody.find('.builder-imagewidth-template').prop('disabled', !enabled);
        $builderBody.find('.builder-imagewidth-breakpoint').prop('disabled', !enabled);
        if (enabled) {
            $builderBody.find('.builder-plugin[value="for_images"]').prop('checked', true);
            $builderBody.find('.builder-imagewidth-presets').slideDown();
        } else {
            $builderBody.find('.builder-plugin[value="for_images"]').prop('checked', false);
            $builderBody.find('.builder-imagewidth-presets').slideUp();
        }
    });

    // Template loader for presets
    $builderBody.on('change', '.builder-imagewidth-template', function() {
        const template = $(this).val();
        const bp = $builderBody.find('.builder-imagewidth-breakpoint').val() || '';
        loadImagewidthPresets(template, bp);
    });
    $builderBody.on('change', '.builder-imagewidth-breakpoint', function() {
        const template = $builderBody.find('.builder-imagewidth-template').val();
        const bp = $(this).val() || '';
        if (template) {
            loadImagewidthPresets(template, bp);
        }
    });

    function loadImagewidthPresets(template, bp) {
        let widthPresets = [];
        let alignPresets = [];
        let effectPresets = [];
        
        if (template === 'uikit') {
            const suffix = bp.startsWith('@') ? bp : '';
            widthPresets = [
                { label: 'Original', class: '' },
                { label: 'Klein (150px)', class: 'uk-width-small' + suffix },
                { label: 'Mittel (300px)', class: 'uk-width-medium' + suffix },
                { label: 'Groß (450px)', class: 'uk-width-large' + suffix },
                { label: 'XL (600px)', class: 'uk-width-xlarge' + suffix },
                { label: '1/2 (50%)', class: 'uk-width-1-2' + suffix },
                { label: '1/3 (33%)', class: 'uk-width-1-3' + suffix },
                { label: '1/4 (25%)', class: 'uk-width-1-4' + suffix },
                { label: '2/3 (66%)', class: 'uk-width-2-3' + suffix },
                { label: '3/4 (75%)', class: 'uk-width-3-4' + suffix },
                { label: '100%', class: 'uk-width-1-1' }
            ];
            alignPresets = [
                { label: 'Keine', class: '' },
                { label: 'Links (Text umfließt)', class: 'uk-float-left uk-margin-right uk-margin-bottom' },
                { label: 'Rechts (Text umfließt)', class: 'uk-float-right uk-margin-left uk-margin-bottom' },
                { label: 'Zentriert', class: 'uk-display-block uk-margin-auto' }
            ];
            effectPresets = [
                { label: 'Kein Effekt', class: '' },
                { label: 'Schatten klein', class: 'uk-box-shadow-small' },
                { label: 'Schatten mittel', class: 'uk-box-shadow-medium' },
                { label: 'Schatten groß', class: 'uk-box-shadow-large' },
                { label: 'Abgerundet', class: 'uk-border-rounded' },
                { label: 'Rund (Kreis)', class: 'uk-border-circle' },
                { label: 'Rahmen', class: 'uk-border' }
            ];
        } else if (template === 'bootstrap') {
            const prefix = bp && !bp.startsWith('@') ? bp + '-' : '';
            widthPresets = [
                { label: 'Original', class: '' },
                { label: '25%', class: 'col-' + prefix + '3' },
                { label: '33%', class: 'col-' + prefix + '4' },
                { label: '50%', class: 'col-' + prefix + '6' },
                { label: '66%', class: 'col-' + prefix + '8' },
                { label: '75%', class: 'col-' + prefix + '9' },
                { label: '100%', class: 'col-12' }
            ];
            alignPresets = [
                { label: 'Keine', class: '' },
                { label: 'Links (Text umfließt)', class: 'float-start me-3 mb-3' },
                { label: 'Rechts (Text umfließt)', class: 'float-end ms-3 mb-3' },
                { label: 'Zentriert', class: 'd-block mx-auto' }
            ];
            effectPresets = [
                { label: 'Kein Effekt', class: '' },
                { label: 'Schatten klein', class: 'shadow-sm' },
                { label: 'Schatten', class: 'shadow' },
                { label: 'Schatten groß', class: 'shadow-lg' },
                { label: 'Abgerundet', class: 'rounded' },
                { label: 'Rund (Kreis)', class: 'rounded-circle' },
                { label: 'Rahmen', class: 'border' }
            ];
        } else if (template === 'general') {
            widthPresets = [
                { label: 'Original', class: '' },
                { label: 'Klein (150px)', class: 'img-width-small' },
                { label: 'Mittel (300px)', class: 'img-width-medium' },
                { label: 'Groß (600px)', class: 'img-width-large' },
                { label: 'XL (900px)', class: 'img-width-xlarge' },
                { label: '25%', class: 'img-width-25' },
                { label: '33%', class: 'img-width-33' },
                { label: '50%', class: 'img-width-50' },
                { label: '66%', class: 'img-width-66' },
                { label: '75%', class: 'img-width-75' },
                { label: '100%', class: 'img-width-full' }
            ];
            alignPresets = [
                { label: 'Keine', class: '' },
                { label: 'Links (Text umfließt)', class: 'img-align-left' },
                { label: 'Rechts (Text umfließt)', class: 'img-align-right' },
                { label: 'Zentriert', class: 'img-align-center' }
            ];
            effectPresets = [
                { label: 'Kein Effekt', class: '' },
                { label: 'Schatten klein', class: 'img-shadow-small' },
                { label: 'Schatten mittel', class: 'img-shadow-medium' },
                { label: 'Schatten groß', class: 'img-shadow-large' },
                { label: 'Abgerundet', class: 'img-rounded' },
                { label: 'Stark abgerundet', class: 'img-rounded-large' },
                { label: 'Rund (Kreis)', class: 'img-circle' },
                { label: 'Rahmen', class: 'img-border' },
                { label: 'Rahmen (dunkel)', class: 'img-border-dark' }
            ];
        }

        $builderBody.find('.builder-imagewidth-width-presets').val(JSON.stringify(widthPresets, null, 2));
        $builderBody.find('.builder-imagewidth-align-presets').val(JSON.stringify(alignPresets, null, 2));
        $builderBody.find('.builder-imagewidth-effect-presets').val(JSON.stringify(effectPresets, null, 2));
    }

    // Styles for Sortable
    let style = document.getElementById('tinymce-profile-assistant-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'tinymce-profile-assistant-styles';
        document.head.appendChild(style);
    }
    style.innerHTML = `
        /* CSS-Variablen: Light-Defaults auf dem Wrapper des Profile-Assistenten */
        #tinymce-profile-assistant {
            --tpa-panel-body-bg: #f5f5f5;
            --tpa-dropzone-bg: #fff;
            --tpa-dropzone-border: #ccc;
            --tpa-chip-bg: #f0f0f0;
            --tpa-chip-border: #d0d0d0;
            --tpa-chip-hover-bg: #e0e0e0;
            --tpa-chip-hover-border: #999;
            --tpa-chip-text: #1a1a1a;
            --tpa-chip-remove: #d9534f;
            --tpa-placeholder-bg: #e8f5e9;
            --tpa-placeholder-border: #4caf50;
            --tpa-help-muted: #666;
            --tpa-context-border: #ddd;
        }
        #tinymce-profile-assistant .builder-dropzone-panel-body {
            background-color: var(--tpa-panel-body-bg);
        }
        #tinymce-profile-assistant #builder-selected-items, #tinymce-profile-assistant #builder-context-selected-items, #tinymce-profile-assistant #builder-insert-selected-items {
            min-height: 40px;
            border: 1px dashed var(--tpa-dropzone-border);
            padding: 10px;
            border-radius: 4px;
            background: var(--tpa-dropzone-bg);
        }
        #tinymce-profile-assistant #builder-selected-items li, #tinymce-profile-assistant #builder-context-selected-items li, #tinymce-profile-assistant #builder-insert-selected-items li {
            cursor: move;
            margin-bottom: 5px;
            background: var(--tpa-chip-bg);
            color: var(--tpa-chip-text);
            border: 1px solid var(--tpa-chip-border);
            padding: 5px 10px;
            border-radius: 3px;
            display: inline-block;
        }
        #tinymce-profile-assistant #builder-selected-items li:hover, #tinymce-profile-assistant #builder-context-selected-items li:hover, #tinymce-profile-assistant #builder-insert-selected-items li:hover {
            background: var(--tpa-chip-hover-bg);
            border-color: var(--tpa-chip-hover-border);
        }
        #tinymce-profile-assistant #builder-selected-items li .remove-item, #tinymce-profile-assistant #builder-context-selected-items li .remove-item, #tinymce-profile-assistant #builder-insert-selected-items li .remove-item {
            margin-left: 8px;
            color: var(--tpa-chip-remove);
            cursor: pointer;
            font-weight: bold;
        }
        #tinymce-profile-assistant #builder-selected-items li.placeholder, #tinymce-profile-assistant #builder-context-selected-items li.placeholder, #tinymce-profile-assistant #builder-insert-selected-items li.placeholder {
            background: var(--tpa-placeholder-bg);
            border: 1px dashed var(--tpa-placeholder-border);
            height: 32px;
            width: 50px;
        }

        /* FOR Plugin highlighting (FriendsOfREDAXO) - Light Mode Default */
        #tinymce-profile-assistant .for-plugin-badge, #tinymce-profile-assistant .for-plugin-badge-inline {
            display: inline-block;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            line-height: 1.3;
            border-radius: 3px;
            background: linear-gradient(135deg, #e3f0fa, #d0e8f7);
            color: #1a5a8a;
            border: 1px solid #9ecde8;
            vertical-align: middle;
            box-shadow: 0 1px 2px rgba(0,0,0,.06);
        }
        #tinymce-profile-assistant .for-plugin-badge-inline { margin-left: 6px; }
        #tinymce-profile-assistant .for-plugin-legend-hint { margin-left: 8px; color: var(--tpa-help-muted); font-weight: 400; }
        #tinymce-profile-assistant .builder-plugin-row--for label { font-weight: 600; }
        #tinymce-profile-assistant .builder-plugin-row--for label input { accent-color: #2c7cb8; }
        #tinymce-profile-assistant .builder-toolbar-btn--for {
            background: linear-gradient(135deg, #e3f0fa 0%, #d0e8f7 100%) !important;
            color: #1a5a8a !important;
            border: 1px solid #6b9fbf !important;
            font-weight: 600;
        }
        #tinymce-profile-assistant .builder-toolbar-btn--for:hover { background: #d0e8f7 !important; }
        #tinymce-profile-assistant .builder-insert-item-btn--for {
            background: linear-gradient(135deg, #e3f0fa, #d0e8f7) !important;
            border-color: #6b9fbf !important;
            color: #1a5a8a !important;
            font-weight: 600;
        }
        #tinymce-profile-assistant .builder-insert-item-btn--for:hover { background: #c7dff4 !important; }

        /* AddOn Plugin highlighting (plugins registered by OTHER addons) - Light Mode */
        #tinymce-profile-assistant .for-plugin-badge--addon {
            background: linear-gradient(135deg, #eaf7f0, #d9efe5);
            color: #2d6a45;
            border-color: #7eca9d;
        }
        #tinymce-profile-assistant .builder-plugin-row--addon label { font-weight: 600; }
        #tinymce-profile-assistant .builder-plugin-row--addon label input { accent-color: #3e8c60; }
        #tinymce-profile-assistant .builder-toolbar-btn--addon {
            background: linear-gradient(135deg, #eaf7f0 0%, #d9efe5 100%) !important;
            color: #2d6a45 !important;
            border: 1px solid #7eca9d !important;
            font-weight: 600;
        }
        #tinymce-profile-assistant .builder-toolbar-btn--addon:hover { background: #d9efe5 !important; }
        #tinymce-profile-assistant .builder-insert-item-btn--addon {
            background: linear-gradient(135deg, #eaf7f0, #d9efe5) !important;
            border-color: #7eca9d !important;
            color: #2d6a45 !important;
            font-weight: 600;
        }
        #tinymce-profile-assistant .builder-insert-item-btn--addon:hover { background: #cae5d9 !important; }

        .builder-toolbar-settings.is-disabled {
            opacity: 0.65;
            filter: grayscale(0.2);
            cursor: not-allowed;
        }
        .builder-color-section.is-disabled {
            opacity: 0.55;
            filter: grayscale(0.4);
            cursor: not-allowed;
        }
        .builder-color-section.is-disabled .panel-body {
            pointer-events: none;
        }
        .builder-toolbar-row {
            border: 1px solid var(--tpa-dropzone-border);
            border-radius: 4px;
            background: var(--tpa-dropzone-bg);
            margin-bottom: 10px;
            padding: 12px;
        }
        .builder-toolbar-row-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }
        .builder-toolbar-row-title {
            font-weight: 600;
        }
        .builder-toolbar-picker {
            margin-bottom: 8px;
        }
        .builder-toolbar-picker-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--tpa-help-muted);
            margin-bottom: 6px;
        }
        .builder-context-picker-label,
        .builder-insert-picker-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--tpa-help-muted);
            margin-bottom: 6px;
        }
        .builder-toolbar-picker-help {
            font-size: 11px;
            color: var(--tpa-help-muted);
        }
        .for-plugin-badge--core {
            background: linear-gradient(135deg, #e8e8e8, #d8d8d8);
            color: #333;
        }
        .builder-toolbar-pill-dropzone {
            position: relative;
        }
        .builder-context-pill-dropzone,
        .builder-insert-pill-dropzone {
            position: relative;
        }
        .builder-toolbar-pill-list {
            min-height: 42px;
            border: 1px dashed var(--tpa-dropzone-border);
            background: var(--tpa-dropzone-bg);
            border-radius: 4px;
            padding: 8px;
            cursor: pointer;
        }
        .builder-context-pill-list {
            min-height: 42px;
            border: 1px dashed var(--tpa-dropzone-border);
            background: var(--tpa-dropzone-bg);
            border-radius: 4px;
            padding: 8px;
            cursor: pointer;
        }
        .builder-insert-pill-list {
            min-height: 42px;
            border: 1px dashed var(--tpa-dropzone-border);
            background: var(--tpa-dropzone-bg);
            border-radius: 4px;
            padding: 8px;
            cursor: pointer;
        }
        .builder-toolbar-pill {
            cursor: move;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin: 0 6px 6px 0;
            padding: 4px 8px;
            border-radius: 4px;
            color: var(--tpa-chip-text);
            border: 1px solid var(--tpa-chip-border);
            background: var(--tpa-chip-bg);
        }
        .builder-toolbar-pill--for,
        .builder-context-pill--for,
        .builder-insert-pill--for {
            border-color: #6b9fbf;
            background: linear-gradient(135deg, #e3f0fa, #d0e8f7);
            color: #1a5a8a;
        }
        .builder-toolbar-pill--addon,
        .builder-context-pill--addon,
        .builder-insert-pill--addon {
            border-color: #7eca9d;
            background: linear-gradient(135deg, #eaf7f0, #d9efe5);
            color: #2d6a45;
        }
        .builder-toolbar-pill--core,
        .builder-context-pill--core,
        .builder-insert-pill--core {
            border-color: #999;
            background: linear-gradient(135deg, #e8e8e8, #d8d8d8);
            color: #333;
        }
        .builder-context-pill,
        .builder-insert-pill {
            cursor: move;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin: 0 6px 6px 0;
            padding: 4px 8px;
            border-radius: 4px;
            color: var(--tpa-chip-text);
            border: 1px solid var(--tpa-chip-border);
            background: var(--tpa-chip-bg);
        }
        .builder-toolbar-pill.dragging,
        .builder-context-pill.dragging,
        .builder-insert-pill.dragging {
            opacity: .25;
            box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
            cursor: grabbing;
        }
        .builder-toolbar-pill.over,
        .builder-context-pill.over,
        .builder-insert-pill.over {
            outline: 1px dashed var(--tpa-placeholder-border);
        }
        .builder-toolbar-pill.new,
        .builder-context-pill.new,
        .builder-insert-pill.new {
            animation: fadeInScale .3s ease-out forwards;
        }

        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.85);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .builder-toolbar-pill-remove,
        .remove-item {
            border: 0;
            background: transparent;
            color: var(--tpa-chip-remove);
            font-weight: 700;
            line-height: 1;
            padding: 0;
            cursor: pointer;
            margin-left: 4px;
            font-size: 18px;
        }
        #tinymce-profile-assistant .remove-item:hover {
            color: #d9534f;
        }
        .builder-toolbar-inline-picker {
            position: fixed;
            z-index: 1060;
            width: 320px;
            max-width: calc(100% - 16px);
            border: 1px solid var(--tpa-dropzone-border);
            border-radius: 6px;
            background: var(--tpa-panel-body-bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, .12);
            padding: 8px;
            display: none;
        }
        .builder-context-inline-picker,
        .builder-insert-inline-picker {
            position: fixed;
            z-index: 1060;
            width: 320px;
            max-width: calc(100% - 16px);
            border: 1px solid var(--tpa-dropzone-border);
            border-radius: 6px;
            background: var(--tpa-panel-body-bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, .12);
            padding: 8px;
            display: none;
        }
        .builder-toolbar-inline-picker-search {
            margin-bottom: 8px;
            border-color: var(--tpa-dropzone-border);
            background: var(--tpa-dropzone-bg);
            color: inherit;
        }
        .builder-context-inline-picker-search,
        .builder-insert-inline-picker-search {
            margin-bottom: 8px;
            border-color: var(--tpa-dropzone-border);
            background: var(--tpa-dropzone-bg);
            color: inherit;
        }
        .builder-toolbar-inline-picker-list {
            max-height: 220px;
            overflow: auto;
        }
        .builder-context-inline-picker-list,
        .builder-insert-inline-picker-list {
            max-height: 220px;
            overflow: auto;
        }
        .builder-toolbar-inline-picker-item {
            width: 100%;
            text-align: left;
            border: 1px solid transparent;
            background: transparent;
            color: inherit;
            border-radius: 4px;
            padding: 6px 8px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .builder-context-inline-picker-item,
        .builder-insert-inline-picker-item {
            width: 100%;
            text-align: left;
            border: 1px solid transparent;
            background: transparent;
            color: inherit;
            border-radius: 4px;
            padding: 6px 8px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .builder-toolbar-inline-picker-item:hover,
        .builder-toolbar-inline-picker-item:focus,
        .builder-context-inline-picker-item:hover,
        .builder-context-inline-picker-item:focus,
        .builder-insert-inline-picker-item:hover,
        .builder-insert-inline-picker-item:focus {
            background: var(--tpa-dropzone-bg);
            border-color: var(--tpa-dropzone-border);
            outline: 0;
        }
        .builder-toolbar-inline-picker-item--for .builder-toolbar-inline-picker-text {
            color: #2c7cb8;
            font-weight: 600;
        }
        .builder-context-inline-picker-item--for .builder-toolbar-inline-picker-text,
        .builder-insert-inline-picker-item--for .builder-toolbar-inline-picker-text {
            color: #2c7cb8;
            font-weight: 600;
        }
        .builder-toolbar-inline-picker-item--addon .builder-toolbar-inline-picker-text {
            color: #3e8c60;
            font-weight: 600;
        }
        .builder-context-inline-picker-item--addon .builder-toolbar-inline-picker-text,
        .builder-insert-inline-picker-item--addon .builder-toolbar-inline-picker-text {
            color: #3e8c60;
            font-weight: 600;
        }
        .builder-toolbar-inline-picker-divider {
            height: 1px;
            background: var(--tpa-dropzone-border);
            margin: 4px 0;
        }
        .builder-toolbar-inline-picker-delete {
            color: #d9534f;
            font-weight: 600;
        }
        .builder-toolbar-inline-picker-delete:hover {
            background: rgba(217, 83, 79, .1);
        }
        .builder-toolbar-inline-picker-clear-all {
            color: #d9534f;
            font-weight: 600;
        }
        .builder-toolbar-inline-picker-clear-all:hover {
            background: rgba(217, 83, 79, .1);
        }
        .builder-toolbar-inline-picker-empty {
            color: var(--tpa-help-muted);
            font-size: 12px;
            padding: 6px 4px;
        }
        .builder-toolbar-row-empty {
            color: var(--tpa-help-muted);
            font-size: 12px;
            margin-bottom: 8px;
        }

        /* Context-toolbar options linke Border-Markierung – Variable nutzen */
        #tinymce-profile-assistant .builder-context-toolbar-options {
            border-left-color: var(--tpa-context-border) !important;
        }

        /* ================================================================
           REDAXO Dark Mode: expliziter Dark-Mode
           ================================================================ */
        body.rex-theme-dark #tinymce-profile-assistant {
            --tpa-panel-body-bg: #1f2933;
            --tpa-dropzone-bg: #141a20;
            --tpa-dropzone-border: #3a4654;
            --tpa-chip-bg: #2a3744;
            --tpa-chip-border: #111820;
            --tpa-chip-hover-bg: #34455a;
            --tpa-chip-hover-border: #000;
            --tpa-chip-text: #e8f0f7;
            --tpa-chip-remove: #ff8080;
            --tpa-placeholder-bg: #1e3a28;
            --tpa-placeholder-border: #5a8a6a;
            --tpa-help-muted: #8a98a6;
            --tpa-context-border: #3a4654;
        }
        body.rex-theme-dark #tinymce-profile-assistant .for-plugin-badge,
        body.rex-theme-dark #tinymce-profile-assistant .for-plugin-badge-inline {
            background: linear-gradient(135deg, #2c5a8f, #1e4066);
            color: #8ec5ea;
            border-color: #2c7cb8;
            text-shadow: 0 1px 1px rgba(0,0,0,.3);
            box-shadow: 0 1px 2px rgba(0,0,0,.2);
        }
        body.rex-theme-dark #tinymce-profile-assistant .for-plugin-badge--addon {
            background: linear-gradient(135deg, #2d6a45, #1e4626);
            color: #8fd4a8;
            border-color: #3e8c60;
        }
        body.rex-theme-dark #tinymce-profile-assistant .builder-toolbar-btn--for {
            background: linear-gradient(135deg, #2c5a8f 0%, #1e4066 100%) !important;
            color: #8ec5ea !important;
            border-color: #2c7cb8 !important;
        }
        body.rex-theme-dark #tinymce-profile-assistant .builder-toolbar-btn--for:hover { background: #1e4066 !important; }
        body.rex-theme-dark #tinymce-profile-assistant .builder-toolbar-btn--addon {
            background: linear-gradient(135deg, #2d6a45 0%, #1e4626 100%) !important;
            color: #8fd4a8 !important;
            border-color: #3e8c60 !important;
        }
        body.rex-theme-dark #tinymce-profile-assistant .builder-toolbar-btn--addon:hover { background: #1e4626 !important; }
        body.rex-theme-dark #tinymce-profile-assistant .panel {
            border-color: #34475a;
            background: #1b2632;
        }
        body.rex-theme-dark #tinymce-profile-assistant .panel > .panel-heading {
            background: #243242;
            color: #d8e5f1;
            border-color: #34475a;
        }
        body.rex-theme-dark #tinymce-profile-assistant .panel.panel-info > .panel-heading {
            background: linear-gradient(180deg, #274056, #223749);
            color: #e2f1ff;
        }
        body.rex-theme-dark #tinymce-profile-assistant .panel.panel-primary > .panel-heading {
            background: linear-gradient(180deg, #2b4460, #24384f);
            color: #e6f3ff;
        }
        body.rex-theme-dark #tinymce-profile-assistant .panel > .panel-body {
            background: #1a2430;
            border-top: 1px solid #2f4254;
        }
        body.rex-theme-dark #tinymce-profile-assistant .builder-insert-item-btn.btn-default {
            background: #223142;
            color: #b8d2ea;
            border-color: #3a5269;
        }
        body.rex-theme-dark #tinymce-profile-assistant .builder-insert-item-btn.btn-default:hover,
        body.rex-theme-dark #tinymce-profile-assistant .builder-insert-item-btn.btn-default:focus {
            background: #2a3c50;
            color: #e7f4ff;
            border-color: #4e6a86;
        }
        body.rex-theme-dark .builder-toolbar-pill {
            background: #2a3744;
            color: #e8f0f7;
            border-color: #111820;
        }
        body.rex-theme-dark .builder-context-pill,
        body.rex-theme-dark .builder-insert-pill {
            background: #2a3744;
            color: #e8f0f7;
            border-color: #111820;
        }
        body.rex-theme-dark .builder-toolbar-pill--for,
        body.rex-theme-dark .builder-context-pill--for,
        body.rex-theme-dark .builder-insert-pill--for {
            border-color: #2c7cb8;
            background: #2c5a8f;
            color: #8ec5ea;
        }
        body.rex-theme-dark .builder-toolbar-pill--addon,
        body.rex-theme-dark .builder-context-pill--addon,
        body.rex-theme-dark .builder-insert-pill--addon {
            border-color: #3e8c60;
            background: #2d6a45;
            color: #8fd4a8;
        }
        body.rex-theme-dark .builder-toolbar-pill--core,
        body.rex-theme-dark .builder-context-pill--core,
        body.rex-theme-dark .builder-insert-pill--core {
            border-color: #5f6a75;
            background: #3d4650;
            color: #e8f0f7;
        }
        body.rex-theme-dark .builder-toolbar-inline-picker {
            background: #1f2933;
            border-color: #3a4654;
            box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
        }
        body.rex-theme-dark .builder-context-inline-picker,
        body.rex-theme-dark .builder-insert-inline-picker {
            background: #1f2933;
            border-color: #3a4654;
            box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
        }
        body.rex-theme-dark .builder-toolbar-inline-picker-search {
            background: #14191f;
            border-color: #3a4654;
        }
        body.rex-theme-dark .builder-context-inline-picker-search,
        body.rex-theme-dark .builder-insert-inline-picker-search {
            background: #14191f;
            border-color: #3a4654;
        }

        /* ================================================================
           REDAXO Auto Mode: prefers-color-scheme (responsive to system)
           ================================================================ */
        @media (prefers-color-scheme: dark) {
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant {
                --tpa-panel-body-bg: #1f2933;
                --tpa-dropzone-bg: #141a20;
                --tpa-dropzone-border: #3a4654;
                --tpa-chip-bg: #2a3744;
                --tpa-chip-border: #111820;
                --tpa-chip-hover-bg: #34455a;
                --tpa-chip-hover-border: #000;
                --tpa-chip-text: #e8f0f7;
                --tpa-chip-remove: #ff8080;
                --tpa-placeholder-bg: #1e3a28;
                --tpa-placeholder-border: #5a8a6a;
                --tpa-help-muted: #8a98a6;
                --tpa-context-border: #3a4654;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .for-plugin-badge,
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .for-plugin-badge-inline {
                background: linear-gradient(135deg, #2c5a8f, #1e4066);
                color: #8ec5ea;
                border-color: #2c7cb8;
                text-shadow: 0 1px 1px rgba(0,0,0,.3);
                box-shadow: 0 1px 2px rgba(0,0,0,.2);
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .for-plugin-badge--addon {
                background: linear-gradient(135deg, #2d6a45, #1e4626);
                color: #8fd4a8;
                border-color: #3e8c60;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-toolbar-btn--for {
                background: linear-gradient(135deg, #2c5a8f 0%, #1e4066 100%) !important;
                color: #8ec5ea !important;
                border-color: #2c7cb8 !important;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-toolbar-btn--for:hover { background: #1e4066 !important; }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-toolbar-btn--addon {
                background: linear-gradient(135deg, #2d6a45 0%, #1e4626 100%) !important;
                color: #8fd4a8 !important;
                border-color: #3e8c60 !important;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-toolbar-btn--addon:hover { background: #1e4626 !important; }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .panel {
                border-color: #34475a;
                background: #1b2632;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .panel > .panel-heading {
                background: #243242;
                color: #d8e5f1;
                border-color: #34475a;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .panel.panel-info > .panel-heading {
                background: linear-gradient(180deg, #274056, #223749);
                color: #e2f1ff;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .panel.panel-primary > .panel-heading {
                background: linear-gradient(180deg, #2b4460, #24384f);
                color: #e6f3ff;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .panel > .panel-body {
                background: #1a2430;
                border-top: 1px solid #2f4254;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-insert-item-btn.btn-default {
                background: #223142;
                color: #b8d2ea;
                border-color: #3a5269;
            }
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-insert-item-btn.btn-default:hover,
            body.rex-has-theme:not(.rex-theme-light) #tinymce-profile-assistant .builder-insert-item-btn.btn-default:focus {
                background: #2a3c50;
                color: #e7f4ff;
                border-color: #4e6a86;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-pill {
                background: #2a3744;
                color: #e8f0f7;
                border-color: #111820;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-pill,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-pill {
                background: #2a3744;
                color: #e8f0f7;
                border-color: #111820;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-pill--for {
                border-color: #2c7cb8;
                background: #2c5a8f;
                color: #8ec5ea;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-pill--for,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-pill--for {
                border-color: #2c7cb8;
                background: #2c5a8f;
                color: #8ec5ea;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-pill--addon {
                border-color: #3e8c60;
                background: #2d6a45;
                color: #8fd4a8;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-pill--addon,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-pill--addon {
                border-color: #3e8c60;
                background: #2d6a45;
                color: #8fd4a8;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-pill--core {
                border-color: #5f6a75;
                background: #3d4650;
                color: #e8f0f7;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-pill--core,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-pill--core {
                border-color: #5f6a75;
                background: #3d4650;
                color: #e8f0f7;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-inline-picker {
                background: #1f2933;
                border-color: #3a4654;
                box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-inline-picker,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-inline-picker {
                background: #1f2933;
                border-color: #3a4654;
                box-shadow: 0 4px 12px rgba(0, 0, 0, .3);
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-toolbar-inline-picker-search {
                background: #14191f;
                border-color: #3a4654;
            }
            body.rex-has-theme:not(.rex-theme-light) .builder-context-inline-picker-search,
            body.rex-has-theme:not(.rex-theme-light) .builder-insert-inline-picker-search {
                background: #14191f;
                border-color: #3a4654;
            }
        }
    `;
    // Logic
    const $toolbarRows = $builderBody.find('.builder-toolbar-rows');
    const $toolbarInput = $builderBody.find('.builder-toolbar-input');

    // Context Logic
    const $contextSelectedList = $('#builder-context-selected-items');
    const $contextInput = $builderBody.find('.builder-context-toolbar-selection');

    // Insert-Menu Logic
    const $insertSelectedList = $('#builder-insert-selected-items');
    const $insertInput = $builderBody.find('.builder-insert-menu-input');

    function updateToolbarRowLabels() {
        $toolbarRows.find('.builder-toolbar-row').each(function(index) {
            $(this).find('.builder-toolbar-row-title').text((i18n.toolbar_row || 'Toolbar row') + ' ' + (index + 1));
        });
    }

    function getToolbarItemOrigin(value) {
        if (isAddonToolbarBtn(value)) {
            return 'addon';
        }
        if (isForToolbarBtn(value)) {
            return 'for';
        }
        return 'core';
    }

    function getToolbarItemBadge(origin) {
        if (origin === 'addon') {
            return '<span class="for-plugin-badge for-plugin-badge--addon">AddOn</span>';
        }
        if (origin === 'for') {
            return '<span class="for-plugin-badge">FOR</span>';
        }
        return '';
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getToolbarPickerItems() {
        const seen = new Set();
        const items = [];
        toolbarSuggestions.forEach((value) => {
            const normalized = normalizeToolbarItemValue(value);
            if (!normalized || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            items.push(normalized);
        });
        return items;
    }

    function renderToolbarInlinePicker($row, query = '', selectedPillValue = null) {
        const filter = String(query || '').trim().toLowerCase();
        const separatorValue = '|';
        const allItems = getToolbarPickerItems();
        const items = allItems.filter((value) => {
            if (value === separatorValue) {
                return true;
            }
            return filter === '' || value.toLowerCase().includes(filter);
        });
        
        // Filter out items that are already in this toolbar row
        const $existingPills = $row.find('.builder-toolbar-pill');
        const usedValues = new Set();
        $existingPills.each(function() {
            usedValues.add($(this).data('value'));
        });
        
        const filteredItems = items.filter((value) => {
            if (value === separatorValue) {
                return true;
            }
            return !usedValues.has(value);
        });
        const orderedItems = [];
        if (filteredItems.includes(separatorValue)) {
            orderedItems.push(separatorValue);
        }
        filteredItems.forEach((value) => {
            if (value !== separatorValue) {
                orderedItems.push(value);
            }
        });
        
        const $list = $row.find('.builder-toolbar-inline-picker-list');
        if (orderedItems.length === 0 && !selectedPillValue) {
            $list.html('<div class="builder-toolbar-inline-picker-empty">' + escapeHtml(i18n.no_results || '') + '</div>');
            return;
        }

        let html = '';
        
        // Actions section: separator, clear all, and delete
        html += '<div class="builder-toolbar-inline-picker-divider"></div>';
        html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-clear-all" data-clear-all="true">' + escapeHtml(i18n.clear_all_toolbar || '') + '</button>';
        
        if (selectedPillValue) {
            html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-delete" data-delete="' + escapeHtml(selectedPillValue) + '">' + escapeHtml(i18n.delete_toolbar_item || '') + '</button>';
        }
        
        html += '<div class="builder-toolbar-inline-picker-divider"></div>';
        
        orderedItems.forEach((value) => {
            const origin = getToolbarItemOrigin(value);
            html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-item--' + origin + '" data-value="' + escapeHtml(value) + '">' + getToolbarItemBadge(origin) + '<span class="builder-toolbar-inline-picker-text">' + escapeHtml(value) + '</span></button>';
        });
        
        $list.html(html);
    }

    function closeAllToolbarInlinePickers() {
        $toolbarRows.find('.builder-toolbar-inline-picker').hide();
        $toolbarRows.find('.builder-toolbar-inline-picker-search').val('');
    }

    function getToolbarInsertIndexFromPoint($list, clientX) {
        const $pills = $list.children('.builder-toolbar-pill');
        for (let i = 0; i < $pills.length; i++) {
            const rect = $pills[i].getBoundingClientRect();
            if (clientX < rect.left + (rect.width / 2)) {
                return i;
            }
        }
        return $pills.length;
    }

    function openToolbarInlinePicker($row, clientX, clientY, insertIndex, selectedPillValue = null) {
        const $picker = $row.find('.builder-toolbar-inline-picker');
        const $search = $picker.find('.builder-toolbar-inline-picker-search');
        const viewportPadding = 8;
        const anchorOffset = 10;

        closeAllToolbarInlinePickers();
        renderToolbarInlinePicker($row, '', selectedPillValue);

        $picker.css({ left: '-9999px', top: '-9999px' }).show();

        const pickerWidth = Math.ceil($picker.outerWidth() || 320);
        const pickerHeight = Math.ceil($picker.outerHeight() || 240);
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        let left = clientX + anchorOffset;
        let top = clientY + anchorOffset;

        if (left + pickerWidth > viewportWidth - viewportPadding) {
            left = clientX - pickerWidth - anchorOffset;
        }
        if (left < viewportPadding) {
            left = viewportPadding;
        }

        if (top + pickerHeight > viewportHeight - viewportPadding) {
            top = clientY - pickerHeight - anchorOffset;
        }
        if (top < viewportPadding) {
            top = viewportPadding;
        }

        $picker.css({ left: left + 'px', top: top + 'px' }).show();
        $row.data('toolbarInsertIndex', Number.isInteger(insertIndex) ? insertIndex : 0);
        $row.data('selectedPillValue', selectedPillValue);
        $search.val('').trigger('focus');
    }

    function getToolbarRows() {
        const rows = [];
        $toolbarRows.find('.builder-toolbar-row').each(function() {
            const items = [];
            $(this).find('.builder-toolbar-pill').each(function() {
                const value = normalizeToolbarItemValue($(this).data('value'));
                if (value) {
                    items.push(value);
                }
            });
            if (items.length > 0) {
                rows.push(items);
            }
        });
        return rows;
    }

    function updateToolbarEmptyState($row) {
        const hasItems = $row.find('.builder-toolbar-pill').length > 0;
        $row.find('.builder-toolbar-row-empty').toggle(!hasItems);
    }

    function updateInput() {
        const serializedRows = getToolbarRows().map((row) => row.join(' '));
        $toolbarInput.val(serializedRows.join('\n'));
        updateColorSectionState();
    }

    function updateColorSectionState() {
        const flat = [].concat.apply([], getToolbarRows());
        $contextSelectedList.find('li').each(function() {
            const v = $(this).data('value');
            if (v) { flat.push(v); }
        });
        $insertSelectedList.find('li').each(function() {
            const v = $(this).data('value');
            if (v) { flat.push(v); }
        });
        const hasColor = flat.indexOf('forecolor') !== -1 || flat.indexOf('backcolor') !== -1;
        const $section = $builderBody.find('.builder-color-section');
        if ($section.length === 0) {
            return;
        }
        $section.toggleClass('is-disabled', !hasColor);
        $section.find(':input').prop('disabled', !hasColor);
    }

    function addToolbarItemRow($row, value = '', insertIndex = null) {
        const normalizedValue = normalizeToolbarItemValue(value);
        if (!normalizedValue) {
            return;
        }
        const origin = getToolbarItemOrigin(normalizedValue);
        const $pill = $('<li class="builder-toolbar-pill builder-toolbar-pill--' + origin + ' new" draggable="true"></li>');
        $pill.attr('data-value', normalizedValue);
        $pill.data('value', normalizedValue);
        $pill.append($(getToolbarItemBadge(origin)));
        $pill.append($('<span class="builder-toolbar-pill-text"></span>').text(normalizedValue));

        const $pillList = $row.find('.builder-toolbar-pill-list');
        const $existing = $pillList.children('.builder-toolbar-pill');
        if (Number.isInteger(insertIndex) && insertIndex >= 0 && insertIndex < $existing.length) {
            $existing.eq(insertIndex).before($pill);
        } else {
            $pillList.append($pill);
        }
        setupDragEvents($pill[0]);
        $pill.on('animationend', function() {
            $(this).removeClass('new');
        });
        updateToolbarEmptyState($row);
        updateInput();
    }

    function addToolbarRow(items = []) {
        const removeLabel = i18n.toolbar_remove_row || '';
        const pickerLabel = i18n.toolbar_picker || '';
        const $row = $('<div class="builder-toolbar-row">' +
            '<div class="builder-toolbar-row-header">' +
                '<span class="builder-toolbar-row-title"></span>' +
                '<div class="btn-group btn-group-xs">' +
                    '<button type="button" class="btn btn-danger builder-toolbar-row-remove"><i class="rex-icon fa-trash"></i> ' + removeLabel + '</button>' +
                '</div>' +
            '</div>' +
            '<div class="builder-toolbar-picker">' +
                '<div class="builder-toolbar-picker-label">' + pickerLabel + '</div>' +
                '<div class="builder-toolbar-picker-help">' + (i18n.toolbar_click_to_pick || 'Ins Feld klicken, dann im Dropdown waehlen. Markierungen: Core / FOR / AddOn.') + '</div>' +
            '</div>' +
            '<div class="builder-toolbar-row-empty">' + (i18n.toolbar_row_empty || '') + '</div>' +
            '<div class="builder-toolbar-pill-dropzone">' +
                '<ul class="builder-toolbar-pill-list list-inline" style="margin-bottom: 0;"></ul>' +
                '<div class="builder-toolbar-inline-picker">' +
                    '<input type="text" class="form-control input-sm builder-toolbar-inline-picker-search" placeholder="' + escapeHtml(i18n.search || 'Suche') + '">' +
                    '<div class="builder-toolbar-inline-picker-list"></div>' +
                '</div>' +
            '</div>' +
        '</div>');
        $toolbarRows.append($row);
        if (Array.isArray(items) && items.length > 0) {
            items.forEach((item) => addToolbarItemRow($row, item));
        } else {
            updateToolbarEmptyState($row);
        }
        updateToolbarRowLabels();
        updateInput();
        return $row;
    }

    function setToolbarRows(rows) {
        $toolbarRows.empty();
        if (Array.isArray(rows) && rows.length > 0) {
            rows.forEach((row) => addToolbarRow(row));
        }
        if ($toolbarRows.find('.builder-toolbar-row').length === 0) {
            addToolbarRow();
        }
        updateToolbarRowLabels();
        updateInput();
    }

    function updateToolbarSettingsState() {
        const enabled = $builderBody.find('.builder-toolbar-enabled').is(':checked');
        $builderBody.find('.builder-toolbar-settings').toggleClass('is-disabled', !enabled);
        $builderBody.find('.builder-toolbar-settings :input').prop('disabled', !enabled);
    }

    function updateContextInput() {
        const items = [];
        $contextSelectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $contextInput.val(items.join(' '));
        updateColorSectionState();
    }

    function updateInsertInput() {
        const items = [];
        $insertSelectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $insertInput.val(items.join(' '));
        updateColorSectionState();
    }

    function getContextInsertMeta($list) {
        const isContext = $list.attr('id') === 'builder-context-selected-items';
        const addClass = isContext ? 'context-item-add' : 'insert-item-add';
        const pickerSelector = isContext ? '.builder-context-inline-picker' : '.builder-insert-inline-picker';
        const searchSelector = isContext ? '.builder-context-inline-picker-search' : '.builder-insert-inline-picker-search';
        const listSelector = isContext ? '.builder-context-inline-picker-list' : '.builder-insert-inline-picker-list';
        return { isContext, addClass, pickerSelector, searchSelector, listSelector };
    }

    function refreshContextInsertState($list) {
        if ($list.attr('id') === 'builder-context-selected-items') {
            updateContextInput();
            renderContextInsertInlinePicker($list, '');
            return;
        }
        updateInsertInput();
        renderContextInsertInlinePicker($list, '');
    }

    function addContextInsertPill($list, value = '', insertIndex = null) {
        const normalizedValue = normalizeToolbarItemValue(value);
        if (!normalizedValue) {
            return;
        }
        const origin = getToolbarItemOrigin(normalizedValue);
        const $pill = $('<li class="builder-toolbar-pill builder-toolbar-pill--' + origin + ' new" draggable="true"></li>');
        $pill.attr('data-value', normalizedValue);
        $pill.data('value', normalizedValue);
        $pill.append($(getToolbarItemBadge(origin)));
        $pill.append($('<span class="builder-toolbar-pill-text"></span>').text(normalizedValue));

        const $existing = $list.children('.builder-toolbar-pill');
        if (Number.isInteger(insertIndex) && insertIndex >= 0 && insertIndex < $existing.length) {
            $existing.eq(insertIndex).before($pill);
        } else {
            $list.append($pill);
        }

        setupDragEvents($pill[0]);
        $pill.on('animationend', function() {
            $(this).removeClass('new');
        });
        refreshContextInsertState($list);
    }

    function renderContextInsertInlinePicker($list, query = '', selectedPillValue = null) {
        const filter = String(query || '').trim().toLowerCase();
        const separatorValue = '|';
        const allItems = getToolbarPickerItems();
        const meta = getContextInsertMeta($list);
        const $dropzone = $list.closest('.builder-toolbar-pill-dropzone');
        const $pickerList = $dropzone.find(meta.listSelector);

        const selected = new Set();
        $list.find('.builder-toolbar-pill').each(function() {
            selected.add($(this).data('value'));
        });

        const items = allItems.filter((value) => {
            if (value === separatorValue) {
                return true;
            }
            if (selected.has(value)) {
                return false;
            }
            return filter === '' || value.toLowerCase().includes(filter);
        });

        const orderedItems = [];
        if (items.includes(separatorValue)) {
            orderedItems.push(separatorValue);
        }
        items.forEach((value) => {
            if (value !== separatorValue) {
                orderedItems.push(value);
            }
        });

        if (orderedItems.length === 0 && !selectedPillValue) {
            $pickerList.html('<div class="builder-toolbar-inline-picker-empty">' + escapeHtml(i18n.no_results || '') + '</div>');
            return;
        }

        let html = '';
        html += '<div class="builder-toolbar-inline-picker-divider"></div>';
        html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-clear-all" data-clear-all="true">' + escapeHtml(i18n.clear_all_toolbar || '') + '</button>';
        if (selectedPillValue) {
            html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-delete" data-delete="' + escapeHtml(selectedPillValue) + '">' + escapeHtml(i18n.delete_toolbar_item || '') + '</button>';
        }
        html += '<div class="builder-toolbar-inline-picker-divider"></div>';

        orderedItems.forEach((value) => {
            const origin = getToolbarItemOrigin(value);
            html += '<button type="button" class="builder-toolbar-inline-picker-item builder-toolbar-inline-picker-item--' + origin + ' ' + meta.addClass + '" data-value="' + escapeHtml(value) + '">' + getToolbarItemBadge(origin) + '<span class="builder-toolbar-inline-picker-text">' + escapeHtml(value) + '</span></button>';
        });
        $pickerList.html(html);
    }

    function closeAllContextInsertPickers() {
        $builderBody.find('.builder-context-inline-picker, .builder-insert-inline-picker').hide();
        $builderBody.find('.builder-context-inline-picker-search, .builder-insert-inline-picker-search').val('');
    }

    function openContextInsertInlinePicker($list, clientX, clientY, insertIndex, selectedPillValue = null) {
        const meta = getContextInsertMeta($list);
        const $dropzone = $list.closest('.builder-toolbar-pill-dropzone');
        const $picker = $dropzone.find(meta.pickerSelector);
        const $search = $picker.find(meta.searchSelector);
        const viewportPadding = 8;
        const anchorOffset = 10;

        closeAllContextInsertPickers();
        renderContextInsertInlinePicker($list, '', selectedPillValue);
        $picker.css({ left: '-9999px', top: '-9999px' }).show();

        const pickerWidth = Math.ceil($picker.outerWidth() || 320);
        const pickerHeight = Math.ceil($picker.outerHeight() || 240);
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        let left = clientX + anchorOffset;
        let top = clientY + anchorOffset;
        if (left + pickerWidth > viewportWidth - viewportPadding) {
            left = clientX - pickerWidth - anchorOffset;
        }
        if (left < viewportPadding) {
            left = viewportPadding;
        }
        if (top + pickerHeight > viewportHeight - viewportPadding) {
            top = clientY - pickerHeight - anchorOffset;
        }
        if (top < viewportPadding) {
            top = viewportPadding;
        }

        $picker.css({ left: left + 'px', top: top + 'px' });
        $list.data('inlineInsertIndex', Number.isInteger(insertIndex) ? insertIndex : 0);
        $list.data('selectedPillValue', selectedPillValue);
        $search.val('').trigger('focus');
    }


    function setPlugins(plugins) {
        $builderBody.find('.builder-plugin').prop('checked', false);
        plugins.forEach(p => {
            $builderBody.find(`.builder-plugin[value="${p}"]`).prop('checked', true);
        });
    }

    // Presets Logic
    $builderBody.find('.builder-preset-simple').on('click', function() {
        setPlugins(['autolink', 'link', 'image', 'lists', 'code']);
        $builderBody.find('.builder-toolbar-enabled').prop('checked', true);
        setToolbarRows([['bold', 'italic', 'underline', '|', 'bullist', 'numlist', '|', 'link', 'image', '|', 'code']]);
        updateToolbarSettingsState();
        // Layout Rules für Simple
        $builderBody.find('.builder-layout-images-in-headings').prop('checked', true);
        $builderBody.find('.builder-layout-clear-empty').prop('checked', false);
        $builderBody.find('.builder-layout-delete-empty').prop('checked', false);
        $builderBody.find('.builder-layout-lines-to-hr').prop('checked', false);
    });

    $builderBody.find('.builder-preset-standard').on('click', function() {
        setPlugins(['autolink', 'link', 'image', 'lists', 'code', 'table', 'fullscreen', 'media']);
        $builderBody.find('.builder-toolbar-enabled').prop('checked', true);
        setToolbarRows([['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'bullist', 'numlist', '|', 'link', 'image', 'media', 'table', '|', 'code', 'fullscreen']]);
        updateToolbarSettingsState();
        // Layout Rules für Standard
        $builderBody.find('.builder-layout-images-in-headings').prop('checked', true);
        $builderBody.find('.builder-layout-clear-empty').prop('checked', true);
        $builderBody.find('.builder-layout-delete-empty').prop('checked', false);
        $builderBody.find('.builder-layout-lines-to-hr').prop('checked', true);
        $builderBody.find('.builder-layout-clear-class').val('uk-margin');
        $builderBody.find('.builder-layout-hr-class').val('uk-divider-icon');
    });

    $builderBody.find('.builder-preset-full').on('click', function() {
        setPlugins(pluginsList);
        $builderBody.find('.builder-toolbar-enabled').prop('checked', true);
        setToolbarRows([
            ['undo', 'redo', '|', 'blocks', 'fontsize', '|', 'bold', 'italic', 'underline', 'strikethrough'],
            ['forecolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', '|', 'bullist', 'numlist', 'outdent', 'indent'],
            ['link', 'link_yform', 'phonelink', 'quote', 'image', 'media', 'table', 'codesample', 'accordion', '|', 'removeformat', 'code', 'fullscreen']
        ]);
        updateToolbarSettingsState();
        // Enable for_images in Full preset
        $builderBody.find('.builder-imagewidth-enable').prop('checked', true).trigger('change');
        // Layout Rules für Full (alle aktiviert)
        $builderBody.find('.builder-layout-images-in-headings').prop('checked', true);
        $builderBody.find('.builder-layout-clear-empty').prop('checked', true);
        $builderBody.find('.builder-layout-delete-empty').prop('checked', true);
        $builderBody.find('.builder-layout-lines-to-hr').prop('checked', true);
        $builderBody.find('.builder-layout-clear-class').val('uk-margin-medium');
        $builderBody.find('.builder-layout-hr-class').val('uk-divider-icon');
    });

    // Context/Insert Inline Picker Events (toolbar-identisches Verhalten)
    $builderBody.on('input', '.builder-context-inline-picker-search, .builder-insert-inline-picker-search', function() {
        const $list = $(this).closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-pill-list');
        const selectedPillValue = $list.data('selectedPillValue');
        renderContextInsertInlinePicker($list, $(this).val(), selectedPillValue);
    });

    $builderBody.on('keydown', '.builder-context-inline-picker-search, .builder-insert-inline-picker-search', function(e) {
        const $list = $(this).closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-pill-list');
        if (e.key === 'Escape') {
            closeAllContextInsertPickers();
            e.preventDefault();
            return;
        }
        if (e.key === 'Enter') {
            const $first = $list.closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-inline-picker-item').first();
            if ($first.length > 0) {
                $first.trigger('click');
            }
            e.preventDefault();
        }
    });

    $builderBody.on('click', '.context-item-add, .insert-item-add', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $list = $(this).closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-pill-list');
        const insertIndex = $list.data('inlineInsertIndex');
        addContextInsertPill($list, $(this).data('value'), Number.isInteger(insertIndex) ? insertIndex : null);
        closeAllContextInsertPickers();
    });

    $builderBody.on('click', '#builder-context-selected-items, #builder-insert-selected-items', function(e) {
        if ($(e.target).closest('.builder-context-inline-picker, .builder-insert-inline-picker').length > 0) {
            return;
        }
        const $list = $(this);
        const $clickedPill = $(e.target).closest('.builder-toolbar-pill');

        if ($clickedPill.length > 0) {
            e.stopPropagation();
            const $existing = $list.children('.builder-toolbar-pill');
            const clickedIndex = $existing.index($clickedPill);
            const insertIndex = Number.isInteger(clickedIndex) && clickedIndex >= 0 ? clickedIndex + 1 : $existing.length;
            const pillRect = $clickedPill[0].getBoundingClientRect();
            const clientX = pillRect.right + 8;
            const clientY = pillRect.top;
            openContextInsertInlinePicker($list, clientX, clientY, insertIndex, $clickedPill.data('value'));
            return;
        }

        const insertIndex = getToolbarInsertIndexFromPoint($list, e.clientX);
        openContextInsertInlinePicker($list, e.clientX, e.clientY, insertIndex, null);
    });

    $builderBody.on('click', '.builder-context-inline-picker, .builder-insert-inline-picker', function(e) {
        e.stopPropagation();
    });

    $builderBody.on('click', '.builder-context-inline-picker .builder-toolbar-inline-picker-delete, .builder-insert-inline-picker .builder-toolbar-inline-picker-delete', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $list = $(this).closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-pill-list');
        const valueToDel = $(this).data('delete');
        let deleted = false;
        $list.find('.builder-toolbar-pill').each(function() {
            if ($(this).data('value') === valueToDel && !deleted) {
                $(this).remove();
                deleted = true;
            }
        });
        refreshContextInsertState($list);
        closeAllContextInsertPickers();
    });

    $builderBody.on('click', '.builder-context-inline-picker .builder-toolbar-inline-picker-clear-all, .builder-insert-inline-picker .builder-toolbar-inline-picker-clear-all', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $list = $(this).closest('.builder-toolbar-pill-dropzone').find('.builder-toolbar-pill-list');
        if ($list.find('.builder-toolbar-pill').length === 0) {
            closeAllContextInsertPickers();
            return;
        }
        const confirmMessage = i18n.confirm_clear_all_toolbar || '';
        if (!window.confirm(confirmMessage)) {
            return;
        }
        $list.find('.builder-toolbar-pill').remove();
        refreshContextInsertState($list);
        closeAllContextInsertPickers();
    });

    // Close pickers when clicking elsewhere
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.builder-context-inline-picker, .builder-context-inline-picker-search, .context-item-add').length &&
            !$(e.target).closest($contextSelectedList).length) {
            $builderBody.find('.builder-context-inline-picker').hide();
        }
        if (!$(e.target).closest('.builder-insert-inline-picker, .builder-insert-inline-picker-search, .insert-item-add').length &&
            !$(e.target).closest($insertSelectedList).length) {
            $builderBody.find('.builder-insert-inline-picker').hide();
        }
    });

    // Initialize
    renderContextInsertInlinePicker($contextSelectedList, '');
    renderContextInsertInlinePicker($insertSelectedList, '');

    $builderBody.on('click', '.builder-toolbar-row-add', function() {
        addToolbarRow();
    });

    $toolbarRows.on('click', '.builder-toolbar-pill-list', function(e) {
        const $clickTarget = $(e.target).closest('.builder-toolbar-pill');
        if ($clickTarget.length > 0) {
            return;
        }
        const $list = $(this);
        const $row = $list.closest('.builder-toolbar-row');
        const insertIndex = getToolbarInsertIndexFromPoint($list, e.clientX);
        openToolbarInlinePicker($row, e.clientX, e.clientY, insertIndex, null);
    });

    $toolbarRows.on('click', '.builder-toolbar-pill', function(e) {
        if ($(e.target).closest('button').length > 0) {
            return;
        }
        e.stopPropagation();
        const $pill = $(this);
        const $row = $pill.closest('.builder-toolbar-row');
        const $list = $row.find('.builder-toolbar-pill-list');
        const $existing = $list.children('.builder-toolbar-pill');
        const clickedIndex = $existing.index($pill);
        const insertIndex = Number.isInteger(clickedIndex) && clickedIndex >= 0 ? clickedIndex + 1 : $existing.length;
        const pillRect = this.getBoundingClientRect();
        const clientX = pillRect.right + 8;
        const clientY = pillRect.top;
        openToolbarInlinePicker($row, clientX, clientY, insertIndex, $pill.data('value'));
    });

    $toolbarRows.on('click', '.builder-toolbar-inline-picker', function(e) {
        e.stopPropagation();
    });

    $toolbarRows.on('input', '.builder-toolbar-inline-picker-search', function() {
        const $row = $(this).closest('.builder-toolbar-row');
        const selectedPillValue = $row.data('selectedPillValue');
        renderToolbarInlinePicker($row, $(this).val(), selectedPillValue);
    });

    $toolbarRows.on('keydown', '.builder-toolbar-inline-picker-search', function(e) {
        const $row = $(this).closest('.builder-toolbar-row');
        if (e.key === 'Escape') {
            closeAllToolbarInlinePickers();
            e.preventDefault();
            return;
        }
        if (e.key === 'Enter') {
            const $first = $row.find('.builder-toolbar-inline-picker-item').first();
            if ($first.length > 0) {
                $first.trigger('click');
            }
            e.preventDefault();
        }
    });

    $toolbarRows.on('click', '.builder-toolbar-inline-picker-item', function() {
        const $row = $(this).closest('.builder-toolbar-row');
        const insertIndex = $row.data('toolbarInsertIndex');
        addToolbarItemRow($row, $(this).data('value'), Number.isInteger(insertIndex) ? insertIndex : null);
        closeAllToolbarInlinePickers();
    });

    $toolbarRows.on('click', '.builder-toolbar-inline-picker-delete', function() {
        const $row = $(this).closest('.builder-toolbar-row');
        const valueToDel = $(this).data('delete');
        let deleted = false;
        $row.find('.builder-toolbar-pill').each(function() {
            if ($(this).data('value') === valueToDel && !deleted) {
                const $pill = $(this);
                $pill.css('animation', 'fadeInScale .2s ease-in reverse');
                setTimeout(() => {
                    $pill.remove();
                    updateToolbarEmptyState($row);
                    updateInput();
                }, 200);
                deleted = true;
            }
        });
        closeAllToolbarInlinePickers();
    });

    $toolbarRows.on('click', '.builder-toolbar-inline-picker-clear-all', function() {
        const $row = $(this).closest('.builder-toolbar-row');
        const $pills = $row.find('.builder-toolbar-pill');
        if ($pills.length === 0) {
            closeAllToolbarInlinePickers();
            return;
        }

        const confirmMessage = i18n.confirm_clear_all_toolbar || '';
        if (!window.confirm(confirmMessage)) {
            return;
        }

        let count = 0;
        $pills.each(function() {
            const $pill = $(this);
            $pill.css('animation', 'fadeInScale .2s ease-in reverse');
            setTimeout(() => {
                $pill.remove();
                if (++count === $pills.length) {
                    updateToolbarEmptyState($row);
                    updateInput();
                }
            }, 200);
        });
        closeAllToolbarInlinePickers();
    });

    $(document).off('mousedown.tinymceToolbarInlinePicker').on('mousedown.tinymceToolbarInlinePicker', function(e) {
        if ($(e.target).closest('.builder-toolbar-row').length === 0) {
            closeAllToolbarInlinePickers();
        }
    });

    $toolbarRows.on('click', '.builder-toolbar-row-remove', function() {
        $(this).closest('.builder-toolbar-row').remove();
        if ($toolbarRows.find('.builder-toolbar-row').length === 0) {
            addToolbarRow();
        }
        updateToolbarRowLabels();
        updateInput();
    });



    $builderBody.on('change', '.builder-toolbar-enabled', function() {
        updateToolbarSettingsState();
    });

    $builderBody.on('change', '.builder-plugin[value="quickbars"]', function() {
        $builderBody.find('.builder-context-toolbar').prop('checked', $(this).is(':checked')).trigger('change');
    });

    // Issue: for_images aus der Pluginliste entfernen -> auch im Assistenten-Block
    // "Bildbreiten / for_images" deaktivieren (sonst bliebe das Plugin via
    // imagewidthEnabled in der serialize-Stufe wieder in der Pluginliste).
    $builderBody.on('change', '.builder-plugin[value="for_images"]', function() {
        $builderBody.find('.builder-imagewidth-enable').prop('checked', $(this).is(':checked')).trigger('change');
    });

    // Bi-direktionale Kopplung zwischen Autoresize-Checkbox (Schritt 1) und dem
    // gleichnamigen Plugin in Schritt 2. Ohne diese Sync bliebe das Plugin in
    // der Liste sichtbar abgewaehlt, obwohl die Option aktiv ist (und umgekehrt).
    $builderBody.on('change', '.builder-autoresize', function() {
        const enabled = $(this).is(':checked');
        const $plugin = $builderBody.find('.builder-plugin[value="autoresize"]');
        if ($plugin.length && $plugin.is(':checked') !== enabled) {
            $plugin.prop('checked', enabled);
        }
    });
    $builderBody.on('change', '.builder-plugin[value="autoresize"]', function() {
        const enabled = $(this).is(':checked');
        const $cb = $builderBody.find('.builder-autoresize');
        if ($cb.length && $cb.is(':checked') !== enabled) {
            $cb.prop('checked', enabled);
        }
    });

    setToolbarRows([]);
    updateToolbarSettingsState();

    // Drag and Drop Implementation
    let dragSrcEl = null;

    function setupDragEvents(item) {
        if (item.dataset && item.dataset.dragBound === '1') {
            return;
        }
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
        if (item.dataset) {
            item.dataset.dragBound = '1';
        }
    }

    // Auto-wire drag events for <li> elements added by loadFromConfig() or any
    // other code path that inserts items without going through addContextItem()/addInsertItem().
    [$contextSelectedList[0], $insertSelectedList[0], $toolbarRows[0]].forEach(function (list) {
        if (!list) return;
        const mo = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (!node || node.nodeType !== 1) {
                        return;
                    }
                    if (node.tagName === 'LI') {
                        setupDragEvents(node);
                        return;
                    }
                    if (typeof node.querySelectorAll === 'function') {
                        node.querySelectorAll('li').forEach(function (li) {
                            setupDragEvents(li);
                        });
                    }
                });
            });
            // Keep hidden inputs and inline picker states in sync.
            if (list.id === 'builder-context-selected-items') {
                updateContextInput();
                renderContextInsertInlinePicker($contextSelectedList, '');
            } else if (list.id === 'builder-insert-selected-items') {
                updateInsertInput();
                renderContextInsertInlinePicker($insertSelectedList, '');
            } else {
                updateInput();
            }
        });
        mo.observe(list, { childList: true, subtree: true });
    });

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (dragSrcEl !== this) {
            // Check if we are dropping in the same list
            if (dragSrcEl.parentNode !== this.parentNode) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Simple swap or insert before/after logic could be complex.
            // Here we just insert the dragged element before the drop target
            // or after depending on position. For simplicity in inline-list, let's just insertBefore.
            
            // To make it more intuitive for inline items, we need to check mouse position relative to center
            const rect = this.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            
            if (relX > rect.width / 2) {
                this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                this.parentNode.insertBefore(dragSrcEl, this);
            }
            
            if (this.parentNode.id === 'builder-context-selected-items') {
                updateContextInput();
            } else if (this.parentNode.id === 'builder-insert-selected-items') {
                updateInsertInput();
            } else if ($(this.parentNode).hasClass('builder-toolbar-pill-list')) {
                updateInput();
            }
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        $contextSelectedList.find('li').removeClass('over');
        $insertSelectedList.find('li').removeClass('over');
        $toolbarRows.find('.builder-toolbar-pill').removeClass('over');
    }

    $builderBody.find('.builder-apply').on('click', function() {
        generateConfig($textarea, $builderBody);
    });

    // Generate + unmittelbar das Profil speichern (Form-Submit)
    $builderBody.find('.builder-apply-save').on('click', function() {
        generateConfig($textarea, $builderBody);
        const $form = $textarea.closest('form');
        if (!$form.length) return;
        // Submit-Button des Formulars finden – bevorzugt YForm-Submit, sonst erster submit
        const $submit = $form.find('button[type="submit"][name="btn_save"], input[type="submit"][name="btn_save"], button[type="submit"], input[type="submit"]').first();
        if ($submit.length) {
            $submit.trigger('click');
        } else {
            $form.trigger('submit');
        }
    });

    // YForm Builder Logic
    const $yformTable = $builderBody.find('#builder-yform-table tbody');
    
    function addYFormRow(title = '', table = '', field = '', url = '') {
        const row = `<tr>
            <td><input type="text" class="form-control input-sm yform-title" value="${title}" placeholder="${i18n.yform_title_placeholder || 'Projekt verlinken'}"></td>
            <td><input type="text" class="form-control input-sm yform-table" value="${table}" placeholder="${i18n.yform_table_placeholder || 'rex_yf_project'}"></td>
            <td><input type="text" class="form-control input-sm yform-field" value="${field}" placeholder="${i18n.yform_field_placeholder || 'title'}"></td>
            <td><input type="text" class="form-control input-sm yform-url" value="${url}" placeholder="${i18n.yform_url_placeholder || '/event:'}"></td>
            <td><button type="button" class="btn btn-danger btn-xs yform-remove"><i class="rex-icon fa-times"></i></button></td>
        </tr>`;
        $yformTable.append(row);
    }

    $builderBody.find('.builder-yform-add').on('click', function() {
        addYFormRow();
    });

    $yformTable.on('click', '.yform-remove', function() {
        $(this).closest('tr').remove();
    });

    // Content Languages Repeater
    const $clangsTable = $builderBody.find('#builder-contentlangs-table tbody');

    function addContentLangRow(title, code, customCode, isDefault) {
        title = title || '';
        code = code || '';
        customCode = customCode || '';
        const defChecked = isDefault ? ' checked' : '';
        const row = '<tr>' +
            '<td><input type="text" class="form-control input-sm clang-title" value="' + title.replace(/"/g, '&quot;') + '" placeholder="' + (i18n.content_langs_title_placeholder || 'Englisch') + '"></td>' +
            '<td><input type="text" class="form-control input-sm clang-code" value="' + code.replace(/"/g, '&quot;') + '" placeholder="en"></td>' +
            '<td><input type="text" class="form-control input-sm clang-customcode" value="' + customCode.replace(/"/g, '&quot;') + '" placeholder="' + (i18n.content_langs_customcode_placeholder || 'z. B. en-GB-oxford') + '"></td>' +
            '<td style="text-align:center; vertical-align:middle;"><input type="radio" name="clang-default" class="clang-default"' + defChecked + '></td>' +
            '<td><button type="button" class="btn btn-danger btn-xs clang-remove"><i class="rex-icon fa-times"></i></button></td>' +
            '</tr>';
        $clangsTable.append(row);
    }

    $builderBody.find('.builder-contentlangs-add').on('click', function () {
        addContentLangRow();
    });

    $builderBody.find('.builder-contentlangs-presets').on('click', function () {
        $clangsTable.empty();
        addContentLangRow('Deutsch', 'de', '', true);
        addContentLangRow('Englisch', 'en', '');
        addContentLangRow('Französisch', 'fr', '');
        addContentLangRow('Spanisch', 'es', '');
        addContentLangRow('Italienisch', 'it', '');
    });

    $clangsTable.on('click', '.clang-remove', function () {
        $(this).closest('tr').remove();
    });

    // Autoreplace Repeater (for_chars_symbols)
    const $arTable = $builderBody.find('#builder-autoreplace-table tbody');

    function addAutoreplaceRow(type, from, to) {
        type = type === 'regex' ? 'regex' : 'text';
        from = from || '';
        to = to || '';
        const row = '<tr>' +
            '<td><select class="form-control input-sm ar-type">' +
                '<option value="text"' + (type === 'text' ? ' selected' : '') + '>Text</option>' +
                '<option value="regex"' + (type === 'regex' ? ' selected' : '') + '>Regex</option>' +
            '</select></td>' +
            '<td><input type="text" class="form-control input-sm ar-from" value="' + String(from).replace(/"/g, '&quot;') + '" placeholder="(tel)"></td>' +
            '<td><input type="text" class="form-control input-sm ar-to" value="' + String(to).replace(/"/g, '&quot;') + '" placeholder="+49 (0) …"></td>' +
            '<td><button type="button" class="btn btn-danger btn-xs ar-remove"><i class="rex-icon fa-times"></i></button></td>' +
            '</tr>';
        $arTable.append(row);
    }

    $builderBody.find('.builder-autoreplace-add').on('click', function () {
        addAutoreplaceRow();
    });

    $builderBody.find('.builder-autoreplace-examples').on('click', function () {
        addAutoreplaceRow('text', '(tel)', '+49\\u00A0(0)\\u00A0…');
        addAutoreplaceRow('text', '-->', '→');
        addAutoreplaceRow('text', '<--', '←');
        addAutoreplaceRow('regex', '\\(kw(\\d{1,2})\\)', 'KW $1');
    });

    const $colorMapTable = $builderBody.find('#builder-color-map-table tbody');

    function normalizeColorToken(color) {
        const raw = String(color || '').trim();
        if (!raw) {
            return '';
        }
        if (/^[0-9a-fA-F]{3,8}$/.test(raw)) {
            return '#' + raw.toLowerCase();
        }
        if (/^#[0-9a-fA-F]{3,8}$/.test(raw)) {
            return raw.toLowerCase();
        }
        return raw;
    }

    function addColorMapRow(color, label) {
        const normalizedColor = normalizeColorToken(color);
        const normalizedLabel = String(label || '').trim();
        if (!normalizedColor || !normalizedLabel) {
            return;
        }
        const swatch = /^#[0-9a-fA-F]{3,8}$/.test(normalizedColor) ? normalizedColor : '#999999';
        const row = '<tr>' +
            '<td><div style="display:flex; gap:6px; align-items:center;"><span style="display:inline-block; width:16px; height:16px; border:1px solid #ccc; border-radius:2px; background:' + swatch + ';"></span><input type="text" class="form-control input-sm builder-color-map-row-color" value="' + normalizedColor.replace(/"/g, '&quot;') + '"></div></td>' +
            '<td><input type="text" class="form-control input-sm builder-color-map-row-label" value="' + normalizedLabel.replace(/"/g, '&quot;') + '"></td>' +
            '<td><button type="button" class="btn btn-danger btn-xs builder-color-map-remove"><i class="rex-icon fa-times"></i></button></td>' +
            '</tr>';
        $colorMapTable.append(row);
    }

    function readColorMapRows() {
        const result = [];
        $colorMapTable.find('tr').each(function () {
            const color = normalizeColorToken($(this).find('.builder-color-map-row-color').val());
            const label = String($(this).find('.builder-color-map-row-label').val() || '').trim();
            if (!color || !label) {
                return;
            }
            result.push(color, label);
        });
        return result;
    }

    function writeColorMapTextareaFromRows() {
        const colorMap = readColorMapRows();
        if (colorMap.length === 0) {
            $builderBody.find('.builder-color-map-raw').val('');
            return;
        }
        $builderBody.find('.builder-color-map-raw').val(JSON.stringify(colorMap, null, 2));
    }

    function writeColorMapRowsFromArray(colorMap) {
        $colorMapTable.empty();
        if (!Array.isArray(colorMap)) {
            return;
        }
        for (let i = 0; i < colorMap.length; i += 2) {
            addColorMapRow(colorMap[i], colorMap[i + 1]);
        }
    }

    function syncColorMapRowsFromTextarea() {
        const raw = String($builderBody.find('.builder-color-map-raw').val() || '').trim();
        if (!raw) {
            $colorMapTable.empty();
            return;
        }
        const parsed = parseColorMapRawInput(raw);
        if (!parsed) {
            return;
        }
        writeColorMapRowsFromArray(parsed);
    }

    $builderBody.find('.builder-color-map-add').on('click', function () {
        const color = $builderBody.find('.builder-color-map-new-color').val();
        const label = $builderBody.find('.builder-color-map-new-label').val();
        addColorMapRow(color, label);
        writeColorMapTextareaFromRows();
        $builderBody.find('.builder-color-map-enable').prop('checked', true);
        $builderBody.find('.builder-color-map-new-color').val('');
        $builderBody.find('.builder-color-map-new-label').val('');
    });

    $builderBody.on('click', '.builder-color-map-remove', function () {
        $(this).closest('tr').remove();
        writeColorMapTextareaFromRows();
    });

    $builderBody.on('input', '.builder-color-map-row-color, .builder-color-map-row-label', function () {
        const $row = $(this).closest('tr');
        const colorVal = normalizeColorToken($row.find('.builder-color-map-row-color').val());
        if (/^#[0-9a-fA-F]{3,8}$/.test(colorVal)) {
            $row.find('span').first().css('background', colorVal);
        }
        writeColorMapTextareaFromRows();
    });

    $builderBody.find('.builder-color-map-raw').on('input', function () {
        syncColorMapRowsFromTextarea();
    });

    $builderBody.find('.builder-color-map-demo').on('click', function () {
        $builderBody.find('.builder-color-map-enable').prop('checked', true);
        $builderBody.find('.builder-color-cols').val('4');
        $builderBody.find('.builder-color-map-raw').val(JSON.stringify([
            '#1d4ed8', 'Blau',
            '#0f766e', 'Türkis',
            '#16a34a', 'Grün',
            '#ca8a04', 'Gold',
            '#dc2626', 'Rot',
            '#7c3aed', 'Violett'
        ], null, 2));
        syncColorMapRowsFromTextarea();
    });

    $arTable.on('click', '.ar-remove', function () {
        $(this).closest('tr').remove();
    });

    // Auto-load existing config into the builder when in edit mode.
    // Runs after the DOM is ready; if the textarea already contains data we try
    // to hydrate the form controls so the user doesn't have to start over.
    setTimeout(function () {
        const existing = ($textarea.val() || '').trim();
        if (existing.length > 0) {
            loadFromConfig($textarea, $builderBody);
        }
        syncColorMapRowsFromTextarea();
    }, 50);
}

function escapeString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizeToolbarItemValue(value) {
    const normalized = String(value || '').trim();
    if (!normalized) {
        return '';
    }
    if (normalized === '|' || normalized.toLowerCase() === 'separator') {
        return '|';
    }
    if (normalized.toLowerCase() === 'styles') {
        return 'stylesets';
    }
    return normalized;
}

/**
 * Parst den Höhen-Input für TinyMCE-`height`.
 * TinyMCE-Doku: Number → px, String → valider CSS-Wert (px, pt, em …).
 * Ausdrücklich NICHT unterstützt: %, vh, auto.
 *
 *  leer / ungültig                → { num: 400 }
 *  reine Zahl                     → { num: 400 }
 *  Zahl + CSS-Einheit (ohne %/vh) → { css: '20em' }
 *  %/vh/auto                      → { num: 400, warn: true }  (Fallback)
 */
function parseHeightValue(raw) {
    const s = String(raw || '').trim().toLowerCase();
    if (!s) return { num: 400 };
    // Reine Zahl
    if (/^\d+(\.\d+)?$/.test(s)) {
        return { num: Math.round(parseFloat(s)) };
    }
    // Zahl + erlaubte Einheit (laut TinyMCE-Doku)
    const m = s.match(/^(\d+(?:\.\d+)?)(px|pt|em|rem|cm|mm|in|pc)$/);
    if (m) {
        if (m[2] === 'px') return { num: Math.round(parseFloat(m[1])) };
        return { css: m[1] + m[2] };
    }
    // Nicht unterstützte Einheit → Fallback
    return { num: 400, warn: true };
}

/**
 * Parst den Breiten-Input für TinyMCE-`width`.
 * TinyMCE-Doku: Number → px, String → valider CSS-Wert inkl. %, em, vh.
 *
 *  leer        → null (kein width in Config)
 *  reine Zahl  → { num: 800 }
 *  CSS-Wert    → { css: '50%' }
 */
function parseWidthValue(raw) {
    const s = String(raw || '').trim().toLowerCase();
    if (!s || s === 'auto') return null;
    if (/^\d+(\.\d+)?$/.test(s)) {
        return { num: Math.round(parseFloat(s)) };
    }
    // Akzeptiere gängige CSS-Einheiten
    if (/^\d+(?:\.\d+)?(px|pt|em|rem|%|vh|vw|cm|mm|in|pc)$/.test(s)) {
        return { css: s };
    }
    return null;
}

function parseColorMapRawInput(raw) {
    const value = String(raw || '').trim();
    if (!value) {
        return null;
    }
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return null;
        }
        const normalized = parsed.map((item) => String(item));
        if (normalized.length === 0 || normalized.length % 2 !== 0) {
            return null;
        }
        return normalized;
    } catch (e) {
        return null;
    }
}

const MANAGED_PROFILE_KEYS = new Set([
    'license_key', 'language', 'branding', 'statusbar', 'menubar', 'toolbar', 'toolbar_mode',
    'quickbars_selection_toolbar', 'quickbars_insert_toolbar',
    'tinymce_media_type', 'menu', 'plugins', 'link_yform_tables', 'external_plugins',
    'content_langs', 'for_chars_symbols_disable_emoticons', 'for_chars_symbols_autoreplace',
    'for_chars_symbols_autoreplace_defaults', 'for_chars_symbols_autoreplace_rules',
    'height', 'min_height', 'max_height', 'autoresize_bottom_margin', 'width', 'resize',
    'image_caption', 'image_uploadtab', 'relative_urls', 'remove_script_host',
    'document_base_url', 'entity_encoding', 'convert_urls', 'object_resizing',
    'custom_colors',
    'color_cols', 'color_map_raw',
    'extended_valid_elements', 'imagewidth_presets', 'imagealign_presets',
    'imageeffect_presets', 'image_compat_warn', 'codesample_languages', 'link_rel_list',
    'link_target_list', 'link_default_protocol', 'link_assume_external_targets',
    'link_attributes_postprocess', 'toc_depth', 'toc_header', 'toc_class',
    'for_layout_rules_no_images_in_headings', 'for_layout_rules_collapse_empty_paragraphs',
    'for_layout_rules_clear_empty_paragraphs', 'for_layout_rules_convert_lines_to_hr',
    'for_layout_rules_clear_element_class', 'for_layout_rules_hr_class',
    'skin', 'content_css', 'setup', 'file_picker_callback'
]);

function splitTopLevelProperties(source) {
    const entries = [];
    let current = '';
    let inString = '';
    let escape = false;
    let lineComment = false;
    let blockComment = false;
    let depthParen = 0;
    let depthBracket = 0;
    let depthBrace = 0;

    const src = String(source || '');
    for (let i = 0; i < src.length; i++) {
        const char = src[i];
        const next = src[i + 1];
        current += char;

        if (lineComment) {
            if (char === '\n') {
                lineComment = false;
            }
            continue;
        }

        if (blockComment) {
            if (char === '*' && next === '/') {
                current += next;
                i++;
                blockComment = false;
            }
            continue;
        }

        if (inString) {
            if (escape) {
                escape = false;
                continue;
            }
            if (char === '\\') {
                escape = true;
                continue;
            }
            if (char === inString) {
                inString = '';
            }
            continue;
        }

        if (char === '/' && next === '/') {
            lineComment = true;
            current += next;
            i++;
            continue;
        }

        if (char === '/' && next === '*') {
            blockComment = true;
            current += next;
            i++;
            continue;
        }

        if (char === '"' || char === '\'' || char === '`') {
            inString = char;
            continue;
        }

        if (char === '(') depthParen++;
        else if (char === ')' && depthParen > 0) depthParen--;
        else if (char === '[') depthBracket++;
        else if (char === ']' && depthBracket > 0) depthBracket--;
        else if (char === '{') depthBrace++;
        else if (char === '}' && depthBrace > 0) depthBrace--;
        else if (char === ',' && depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
            const entry = current.slice(0, -1).trim();
            if (entry) {
                entries.push(entry.replace(/,\s*$/, '').trim());
            }
            current = '';
        }
    }

    const tail = current.trim().replace(/,\s*$/, '').trim();
    if (tail) {
        entries.push(tail);
    }

    return entries;
}

function getPropertyKey(entry) {
    const source = String(entry || '');
    let index = 0;

    while (index < source.length) {
        const char = source[index];
        const next = source[index + 1];

        if (/\s/.test(char)) {
            index++;
            continue;
        }

        if (char === '/' && next === '/') {
            index += 2;
            while (index < source.length && source[index] !== '\n') {
                index++;
            }
            continue;
        }

        if (char === '/' && next === '*') {
            index += 2;
            while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
                index++;
            }
            index += 2;
            continue;
        }

        if (char === '"' || char === '\'') {
            const quote = char;
            let key = '';
            index++;
            while (index < source.length) {
                const currentChar = source[index];
                if (currentChar === '\\' && index + 1 < source.length) {
                    key += source[index + 1];
                    index += 2;
                    continue;
                }
                if (currentChar === quote) {
                    index++;
                    break;
                }
                key += currentChar;
                index++;
            }
            while (index < source.length && /\s/.test(source[index])) {
                index++;
            }
            return source[index] === ':' ? key : '';
        }

        if (!/[A-Za-z0-9_$-]/.test(char)) {
            return '';
        }

        let key = '';
        while (index < source.length && /[A-Za-z0-9_$-]/.test(source[index])) {
            key += source[index];
            index++;
        }
        while (index < source.length && /\s/.test(source[index])) {
            index++;
        }
        return source[index] === ':' ? key : '';
    }

    return '';
}

function extractProtectedExtras(extra) {
    return splitTopLevelProperties(extra)
        .filter((entry) => {
            const key = getPropertyKey(entry);
            return !key || !MANAGED_PROFILE_KEYS.has(key);
        })
        .join(',\n');
}

function normalizeProtectedExtras(extra) {
    const trimmed = String(extra || '').trim();
    if (!trimmed) {
        return [];
    }

    // Primary path: keep JS-aware top-level comma splitting.
    const entries = splitTopLevelProperties(trimmed);
    if (entries.length > 0) {
        return entries;
    }

    // Fallback for "raw lines" input without commas: one property per line.
    if (!trimmed.includes(',')) {
        const lineEntries = trimmed
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => line.replace(/[;,]\s*$/, '').trim())
            .filter(Boolean);
        const allPropertyLike = lineEntries.length > 1 && lineEntries.every((line) => {
            return /^(?:[A-Za-z_$][\w$.-]*|"[^"]+"|'[^']+')\s*:/.test(line);
        });
        if (allPropertyLike) {
            return lineEntries;
        }
    }

    return [trimmed.replace(/,\s*$/, '').trim()];
}

function generateConfig($textarea, $builderBody) {
    const i18n = rex.tinymceProfileI18n || {};
    const options = rex.tinymceProfileOptions || {};
    
    // Context Toolbar
    const contextToolbar = $builderBody.find('.builder-context-toolbar').is(':checked');
    const contextToolbarSelection = escapeString($builderBody.find('.builder-context-toolbar-selection').val());
    const contextToolbarInsert = $builderBody.find('.builder-context-toolbar-insert').is(':checked');
    const autoHideToolbar = $builderBody.find('.builder-auto-hide-toolbar').is(':checked');

    const plugins = [];
    $builderBody.find('.builder-plugin:checked').each(function() {
        plugins.push($(this).val());
    });

    if (contextToolbar && !plugins.includes('quickbars')) {
        plugins.push('quickbars');
    }
    
    // Ensure link plugin is present if link button is used in context toolbar (common case)
    if (contextToolbar && contextToolbarSelection.includes('link') && !plugins.includes('link')) {
        plugins.push('link');
    }

    const toolbarEnabled = $builderBody.find('.builder-toolbar-enabled').is(':checked');
    const toolbarMode = escapeString($builderBody.find('.builder-toolbar-mode').val() || 'sliding');
    const toolbarRows = [];
    $builderBody.find('.builder-toolbar-rows .builder-toolbar-row').each(function() {
        const items = [];
        $(this).find('.builder-toolbar-pill').each(function() {
            const value = normalizeToolbarItemValue($(this).data('value'));
            if (value) {
                items.push(value);
            }
        });
        if (items.length > 0) {
            toolbarRows.push(items);
        }
    });
    const heightRaw = String($builderBody.find('.builder-height').val() || '').trim();
    const height = parseHeightValue(heightRaw);
    const widthRaw = String($builderBody.find('.builder-width').val() || '').trim();
    const width = parseWidthValue(widthRaw);
    const minHeightRaw = parseInt($builderBody.find('.builder-min-height').val(), 10);
    const maxHeightRaw = parseInt($builderBody.find('.builder-max-height').val(), 10);
    const minHeight = Number.isFinite(minHeightRaw) && minHeightRaw > 0 ? minHeightRaw : null;
    const maxHeight = Number.isFinite(maxHeightRaw) && maxHeightRaw > 0 ? maxHeightRaw : null;
    const resizeVal = String($builderBody.find('.builder-resize').val() || 'true');
    const autoresize = $builderBody.find('.builder-autoresize').is(':checked');
    const lang = escapeString($builderBody.find('.builder-lang').val() || 'de');
    const menubar = $builderBody.find('.builder-menubar').is(':checked');

    // Autoresize-Plugin synchron mit der Checkbox.
    if (autoresize) {
        if (!plugins.includes('autoresize')) {
            plugins.push('autoresize');
        }
    } else {
        const ar = plugins.indexOf('autoresize');
        if (ar !== -1) {
            plugins.splice(ar, 1);
        }
    }

    // Advanced Values
    const imageCaption = $builderBody.find('.builder-image-caption').is(':checked');
    const imageUploadTab = $builderBody.find('.builder-image-uploadtab').is(':checked');
    const mediaType = escapeString($builderBody.find('.builder-media-type').val());
    const relativeUrls = $builderBody.find('.builder-relative-urls').is(':checked');
    const removeScriptHost = $builderBody.find('.builder-remove-script-host').is(':checked');
    const convertUrls = $builderBody.find('.builder-convert-urls').is(':checked');
    
    const baseUrl = escapeString($builderBody.find('.builder-base-url').val());
    const entityEncoding = escapeString($builderBody.find('.builder-entity-encoding').val());
    
    const tocDepth = parseInt($builderBody.find('.builder-toc-depth').val()) || 3;
    const tocHeader = escapeString($builderBody.find('.builder-toc-header').val() || 'div');
    const tocClass = escapeString($builderBody.find('.builder-toc-class').val() || 'our-toc');

    const defaultCodesample = $builderBody.find('.builder-default-codesample').is(':checked');
    const defaultRelList = $builderBody.find('.builder-default-rellist').is(':checked');
    const linkTargetList = $builderBody.find('.builder-link-target-list').is(':checked');
    const linkNoreferrer = $builderBody.find('.builder-link-noreferrer').is(':checked');
    const linkDefaultHttps = $builderBody.find('.builder-link-default-https').is(':checked');
    const customColorsEnabled = $builderBody.find('.builder-custom-colors').is(':checked');
    const colorMapEnabled = $builderBody.find('.builder-color-map-enable').is(':checked');
    const colorColsRaw = parseInt($builderBody.find('.builder-color-cols').val(), 10);
    const colorCols = Number.isFinite(colorColsRaw) && colorColsRaw > 0 ? colorColsRaw : null;
    const colorMapRaw = parseColorMapRawInput($builderBody.find('.builder-color-map-raw').val());

    // Image Width (preset-based)
    const imagewidthEnabled = $builderBody.find('.builder-imagewidth-enable').is(':checked');
    const imagewidthCompatWarn = $builderBody.find('.builder-imagewidth-compat-warn').is(':checked');
    let imagewidthWidthPresets = null;
    let imagewidthAlignPresets = null;
    let imagewidthEffectPresets = null;
    try {
        const widthJson = $builderBody.find('.builder-imagewidth-width-presets').val();
        if (widthJson && widthJson.trim()) imagewidthWidthPresets = JSON.parse(widthJson);
    } catch (e) { console.warn('Invalid width presets JSON'); }
    try {
        const alignJson = $builderBody.find('.builder-imagewidth-align-presets').val();
        if (alignJson && alignJson.trim()) imagewidthAlignPresets = JSON.parse(alignJson);
    } catch (e) { console.warn('Invalid align presets JSON'); }
    try {
        const effectJson = $builderBody.find('.builder-imagewidth-effect-presets').val();
        if (effectJson && effectJson.trim()) imagewidthEffectPresets = JSON.parse(effectJson);
    } catch (e) { console.warn('Invalid effect presets JSON'); }

    // Ensure for_images plugin is in the list
    if (imagewidthEnabled && !plugins.includes('for_images')) {
        plugins.push('for_images');
    }

    // YForm Config
    const yformTitle = escapeString($builderBody.find('.builder-yform-title').val());
    const yformItems = [];
    $builderBody.find('#builder-yform-table tbody tr').each(function() {
        const title = escapeString($(this).find('.yform-title').val());
        const table = escapeString($(this).find('.yform-table').val());
        const field = escapeString($(this).find('.yform-field').val());
        const url = escapeString($(this).find('.yform-url').val());
        
        if (table && field) {
            yformItems.push({ title, table, field, url });
        }
    });

    // Content Languages (für language-Toolbar-Button / Format-Menü > Sprache)
    const contentLangs = [];
    let contentLangsDefault = '';
    $builderBody.find('#builder-contentlangs-table tbody tr').each(function () {
        const $row = $(this);
        const title = String($row.find('.clang-title').val() || '').trim();
        const code = String($row.find('.clang-code').val() || '').trim();
        const customCode = String($row.find('.clang-customcode').val() || '').trim();
        const isDefault = $row.find('.clang-default').is(':checked');
        if (!title || !code) {
            return;
        }
        const entry = { title, code };
        if (customCode) {
            entry.customCode = customCode;
        }
        contentLangs.push(entry);
        if (isDefault && !contentLangsDefault) {
            contentLangsDefault = code;
        }
    });

    // Build the configuration string manually to match the "pro" format (raw JS object body)
    let configStr = '';
    
    configStr += "license_key: 'gpl',\n";
    configStr += `language: '${contentLangsDefault ? escapeString(contentLangsDefault) : lang}',\n`;
    configStr += "branding: false,\n";
    configStr += "statusbar: true,\n";
    configStr += `menubar: ${menubar},\n`;
    
    if (contextToolbar) {
        configStr += `quickbars_selection_toolbar: '${contextToolbarSelection}',\n`;
        if (contextToolbarInsert) {
            configStr += `quickbars_insert_toolbar: 'quickimage quicktable',\n`;
        } else {
            configStr += `quickbars_insert_toolbar: false,\n`;
        }
    }
    
    if (mediaType) {
        configStr += `tinymce_media_type: '${mediaType}',\n`;
    }

    // Insert Menu (menubar > Insert)
    const insertMenuItems = escapeString($builderBody.find('.builder-insert-menu-input').val() || '');

    // Has forecolor/backcolor anywhere? If not, disable color UI in editor entirely.
    const _flatToolbarTokens = [].concat.apply([], toolbarRows);
    const _ctxStr = contextToolbar ? String(contextToolbarSelection || '') : '';
    const _insStr = String(insertMenuItems || '');
    const hasColorAnywhere =
        _flatToolbarTokens.indexOf('forecolor') !== -1 ||
        _flatToolbarTokens.indexOf('backcolor') !== -1 ||
        /\bforecolor\b/.test(_ctxStr) || /\bbackcolor\b/.test(_ctxStr) ||
        /\bforecolor\b/.test(_insStr) || /\bbackcolor\b/.test(_insStr);

    // Build menu overrides (insert + format). TinyMCE merges per-key, others stay default.
    const _menuEntries = [];
    if (menubar && insertMenuItems) {
        _menuEntries.push(`insert: { title: 'Insert', items: '${insertMenuItems}' }`);
    }
    if (menubar && !hasColorAnywhere) {
        // Default Format menu minus forecolor/backcolor
        _menuEntries.push(`format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | language | removeformat' }`);
    }
    if (_menuEntries.length > 0) {
        configStr += `menu: {\n  ${_menuEntries.join(',\n  ')}\n},\n`;
    }

    if (plugins.length > 0) {
        configStr += `plugins: '${plugins.join(' ')}',\n`;
    }
    
    if (yformItems.length > 0) {
        configStr += `link_yform_tables: {
 title: '${yformTitle}',
 items: [\n`;
        yformItems.forEach(item => {
            configStr += `  { title: '${item.title}', table: '${item.table}', field: '${item.field}'`;
            if (item.url) {
                configStr += `, url: '${item.url}'`;
            }
            configStr += ` },\n`;
        });
        configStr += ` ]\n},\n`;
    }
    
    // External Plugins
    const externalPlugins = options.external_plugins || {};
    let activeExternalPlugins = {};
    plugins.forEach(p => {
        if (externalPlugins[p]) {
            // Ensure absolute path for TinyMCE external_plugins
            let pluginUrl = externalPlugins[p];
            // Remove all leading ../ segments from pluginUrl
            while (pluginUrl.startsWith('../')) {
                pluginUrl = pluginUrl.substring(3);
            }
            // Ensure path starts with / for absolute URL
            if (!pluginUrl.startsWith('/')) {
                pluginUrl = '/' + pluginUrl;
            }
            activeExternalPlugins[p] = pluginUrl;
        }
    });
    
    if (Object.keys(activeExternalPlugins).length > 0) {
        configStr += `external_plugins: ${JSON.stringify(activeExternalPlugins)},\n`;
    }
    
    if (toolbarEnabled) {
        if (toolbarRows.length > 1) {
            configStr += `toolbar: ${JSON.stringify(toolbarRows.map((row) => row.join(' ')))},\n`;
        } else if (toolbarRows.length === 1) {
            configStr += `toolbar: '${escapeString(toolbarRows[0].join(' '))}',\n`;
        } else {
            configStr += `toolbar: false,\n`;
        }
        configStr += `toolbar_mode: '${toolbarMode}',\n`;
    } else {
        configStr += `toolbar: false,\n`;
    }
    
    // Content Languages (Sprach-Menü)
    if (contentLangs.length > 0) {
        configStr += `content_langs: ${JSON.stringify(contentLangs)},\n`;
    }

    // Typografie-Autoreplace (for_chars_symbols)
    const disableEmoticons = $builderBody.find('.builder-disable-emoticons').is(':checked');
    if (disableEmoticons) {
        configStr += `for_chars_symbols_disable_emoticons: true,\n`;
    }

    const autoreplaceEnabled = $builderBody.find('.builder-autoreplace-enabled').is(':checked');
    const autoreplaceDefaults = $builderBody.find('.builder-autoreplace-defaults').is(':checked');
    const autoreplaceRules = [];
    $builderBody.find('#builder-autoreplace-table tbody tr').each(function () {
        const $row = $(this);
        const type = String($row.find('.ar-type').val() || 'text');
        const from = String($row.find('.ar-from').val() || '');
        const to = String($row.find('.ar-to').val() || '');
        if (!from) {
            return;
        }
        if (type === 'regex') {
            autoreplaceRules.push({ re: from, to });
        } else {
            autoreplaceRules.push({ from, to });
        }
    });
    if (autoreplaceEnabled) {
        configStr += `for_chars_symbols_autoreplace: true,\n`;
        if (!autoreplaceDefaults) {
            configStr += `for_chars_symbols_autoreplace_defaults: false,\n`;
        }
        if (autoreplaceRules.length > 0) {
            configStr += `for_chars_symbols_autoreplace_rules: ${JSON.stringify(autoreplaceRules)},\n`;
        }
    } else if (autoreplaceRules.length > 0) {
        // User hat Regeln aber Feature aus: trotzdem speichern, damit nichts verloren geht.
        configStr += `for_chars_symbols_autoreplace: false,\n`;
        configStr += `for_chars_symbols_autoreplace_rules: ${JSON.stringify(autoreplaceRules)},\n`;
    }

    // Editor-Größe (TinyMCE-Doku: `height` = Number|CSS ohne %/vh, `width` = Number|CSS inkl. %/vh)
    if (autoresize) {
        // Bei Autoresize ignoriert TinyMCE `height` → nur min/max_height setzen.
        configStr += `min_height: ${minHeight !== null ? minHeight : 200},\n`;
        if (maxHeight !== null) {
            configStr += `max_height: ${maxHeight},\n`;
        }
        configStr += `autoresize_bottom_margin: 20,\n`;
    } else if (height && height.css) {
        configStr += `height: '${height.css}',\n`;
    } else {
        configStr += `height: ${(height && height.num) || 400},\n`;
        if (minHeight !== null) configStr += `min_height: ${minHeight},\n`;
        if (maxHeight !== null) configStr += `max_height: ${maxHeight},\n`;
    }
    if (width) {
        if (width.css) {
            configStr += `width: '${width.css}',\n`;
        } else {
            configStr += `width: ${width.num},\n`;
        }
    }
    // Resize-Handle
    if (resizeVal === 'false') {
        configStr += `resize: false,\n`;
    } else if (resizeVal === 'both') {
        configStr += `resize: 'both',\n`;
    } // true ist TinyMCE-Default → nicht emittieren
    configStr += `\n`;
    
    // Advanced
    configStr += `image_caption: ${imageCaption},\n`;
    configStr += `image_uploadtab: ${imageUploadTab},\n`;
    configStr += `relative_urls: ${relativeUrls},\n`;
    configStr += `remove_script_host: ${removeScriptHost},\n`;
    configStr += `document_base_url: "${baseUrl}",\n`;
    configStr += `entity_encoding: '${entityEncoding}',\n`;
    configStr += `convert_urls: ${convertUrls},\n\n`;

    // Image Width (preset-based: width, alignment, effects on <figure>)
    if (imagewidthEnabled) {
        configStr += `object_resizing: false,\n`;
        configStr += `extended_valid_elements: 'figure[class|style|contenteditable],figcaption[contenteditable]',\n`;
        if (imagewidthWidthPresets) {
            configStr += `imagewidth_presets: ${JSON.stringify(imagewidthWidthPresets)},\n`;
        }
        if (imagewidthAlignPresets) {
            configStr += `imagealign_presets: ${JSON.stringify(imagewidthAlignPresets)},\n`;
        }
        if (imagewidthEffectPresets && imagewidthEffectPresets.length > 1) {
            configStr += `imageeffect_presets: ${JSON.stringify(imagewidthEffectPresets)},\n`;
        }
        if (imagewidthCompatWarn) {
            configStr += `image_compat_warn: true,\n`;
        }
        configStr += '\n';
    }

    // Layout Rules
    const layoutNoImages = $builderBody.find('.builder-layout-images-in-headings').is(':checked');
    const layoutCollapsEmpty = $builderBody.find('.builder-layout-clear-empty').is(':checked');
    const layoutDeleteEmpty = $builderBody.find('.builder-layout-delete-empty').is(':checked');
    const layoutLinesToHr = $builderBody.find('.builder-layout-lines-to-hr').is(':checked');
    const layoutClearClass = String($builderBody.find('.builder-layout-clear-class').val() || 'uk-margin').trim();
    const layoutHrClass = String($builderBody.find('.builder-layout-hr-class').val() || 'uk-divider-icon').trim();

    if (layoutNoImages || layoutCollapsEmpty || layoutDeleteEmpty || layoutLinesToHr) {
        if (layoutNoImages) {
            configStr += `for_layout_rules_no_images_in_headings: true,\n`;
        }
        if (layoutCollapsEmpty) {
            configStr += `for_layout_rules_collapse_empty_paragraphs: true,\n`;
            if (layoutClearClass) {
                configStr += `for_layout_rules_clear_element_class: '${escapeString(layoutClearClass)}',\n`;
            }
        }
        if (layoutDeleteEmpty) {
            configStr += `for_layout_rules_clear_empty_paragraphs: true,\n`;
        }
        if (layoutLinesToHr) {
            configStr += `for_layout_rules_convert_lines_to_hr: true,\n`;
            if (layoutHrClass) {
                configStr += `for_layout_rules_hr_class: '${escapeString(layoutHrClass)}',\n`;
            }
        }
        configStr += '\n';
    }

    if (defaultCodesample) {
        configStr += `codesample_languages: [
 {text: 'HTML/XML', value: 'markup'},
 {text: 'JavaScript', value: 'javascript'},
 {text: 'CSS', value: 'css'},
 {text: 'PHP', value: 'php'},
 {text: 'Ruby', value: 'ruby'},
 {text: 'Python', value: 'python'},
 {text: 'Java', value: 'java'},
 {text: 'C', value: 'c'},
 {text: 'C#', value: 'csharp'},
 {text: 'C++', value: 'cpp'}
],\n`;
    }

    if (defaultRelList) {
        configStr += `link_rel_list: [
 {title: '${i18n.none || 'Keine'}', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],\n`;
    }

    if (linkTargetList) {
        configStr += `link_target_list: [
 {title: '— ${i18n.link_target_none || 'Kein Ziel (gleiches Fenster)'}', value: ''},
 {title: '${i18n.link_target_blank || 'Neues Fenster'}', value: '_blank'}
],\n`;
    }

    if (linkDefaultHttps) {
        configStr += `link_default_protocol: 'https',\n`;
        // link_assume_external_targets bewusst NICHT setzen: 'https' wuerde
        // jeden URL-aehnlichen String ohne Schema (auch /media/...) mit https://
        // praefixen und so kaputte URLs wie https:///media/datei.pdf erzeugen
        // (siehe Issue #175). Wer das Verhalten wirklich braucht, setzt es
        // manuell im Profil-Extra.
    }

    if (linkNoreferrer) {
        configStr += `link_attributes_postprocess: function (attrs) {
    if (!attrs || attrs.target !== '_blank') { return; }
    var rel = (attrs.rel || '').toLowerCase().split(/\\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) { rel.push('noopener'); }
    if (rel.indexOf('noreferrer') === -1) { rel.push('noreferrer'); }
    attrs.rel = rel.join(' ');
},\n`;
    }

    if (!customColorsEnabled || !hasColorAnywhere) {
        configStr += 'custom_colors: false,\n';
    }
    if (!hasColorAnywhere) {
        // No color toolbar items -> empty palette so any leftover access (e.g. via API) has nothing to pick
        configStr += 'color_map: [],\n';
    }

    if (hasColorAnywhere && colorMapEnabled && Array.isArray(colorMapRaw) && colorMapRaw.length > 0) {
        if (colorCols !== null) {
            configStr += `color_cols: ${colorCols},\n`;
        }
        configStr += `color_map_raw: ${JSON.stringify(colorMapRaw)},\n`;
    }

    configStr += `toc_depth: ${tocDepth},\n`;
    configStr += `toc_header: "${tocHeader}",\n`;
    configStr += `toc_class: "${tocClass}",\n\n`;

    // Raw JS expressions
    configStr += 'skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\n';
    configStr += 'content_css: redaxo.theme.current === "dark" ? "dark" : "default",\n';
    
    configStr += 'setup: function (editor) {\n';
    if (autoHideToolbar) {
        configStr += `    // Auto-Hide: Menue/Toolbar/Statusleiste nur sichtbar, solange der Editor
    // den Fokus hat. Wird per CSS-Klasse + :focus-within umgesetzt – robuster
    // als display:none-Inline, weil TinyMCE die UI mehrfach neu rendert.
    editor.on('PostRender', function () {
        var container = editor.getContainer();
        if (!container) { return; }
        container.classList.add('tmce-autohide');
        if (document.getElementById('tmce-autohide-style')) { return; }
        var style = document.createElement('style');
        style.id = 'tmce-autohide-style';
        style.textContent = ''
            + '.tmce-autohide .tox-editor-header,'
            + '.tmce-autohide .tox-statusbar { '
            + 'max-height: 0; overflow: hidden; opacity: 0; '
            + 'padding-top: 0 !important; padding-bottom: 0 !important; '
            + 'border: 0 !important; '
            + 'transition: max-height .15s ease, opacity .15s ease; }'
            + '.tmce-autohide:focus-within .tox-editor-header,'
            + '.tmce-autohide:hover .tox-editor-header,'
            + '.tmce-autohide:focus-within .tox-statusbar,'
            + '.tmce-autohide:hover .tox-statusbar { '
            + 'max-height: 400px; opacity: 1; '
            + 'padding-top: revert !important; padding-bottom: revert !important; '
            + 'border: revert !important; }';
        document.head.appendChild(style);
    });\n`;
    }
    configStr += '},\n';

    // Standard REDAXO file picker callback
    configStr += 'file_picker_callback: function (callback, value, meta) {\n';
    configStr += '    rex5_picker_function(callback, value, meta);\n';
    configStr += '}';

    const protectedExtras = normalizeProtectedExtras($builderBody.find('.builder-protected-extras').val());
    if (protectedExtras.length > 0) {
        configStr += ',\n' + protectedExtras.join(',\n');
    }

    $textarea.val(configStr);
    
    // Trigger change for CodeMirror if present
    if ($textarea[0].nextElementSibling && $textarea[0].nextElementSibling.classList.contains('CodeMirror')) {
        $textarea[0].nextElementSibling.CodeMirror.setValue(configStr);
    }
}

/**
 * Best-effort parsing of the existing profile config (stored as a raw JS object
 * body) into a plain JS object. Admin-only context; the same text is injected
 * as JS into profiles.js at runtime so `new Function` does not add risk.
 *
 * @param {string} extra
 * @returns {object|null}
 */
function parseProfileExtra(extra) {
    const src = String(extra || '').trim();
    if (src === '') {
        return null;
    }
    try {
        // Wrap in parentheses so the body is parsed as an object literal.
        return new Function('"use strict"; return ({' + src + '});')();
    } catch (e) {
        console.warn('[tinymce profile assistant] cannot parse extra config:', e);
        return null;
    }
}

/**
 * Populates the builder UI from the current textarea content. Returns true
 * when parsing succeeded (regardless of which fields could be mapped).
 */
function loadFromConfig($textarea, $builderBody) {
    const source = String($textarea.val() || '');
    const cfg = parseProfileExtra($textarea.val());
    if (!cfg || typeof cfg !== 'object') {
        return false;
    }

    const tokenize = (s) => String(s || '').trim().split(/\s+/).filter(Boolean);
    const loadI18n = rex.tinymceProfileI18n || {};
    const profileOptions = (typeof rex !== 'undefined' && rex.tinymceProfileOptions) ? rex.tinymceProfileOptions : {};
    const addonToolbarSet = new Set(profileOptions.addon_toolbar_buttons || []);
    const forToolbarSet = new Set(profileOptions.for_toolbar_buttons || []);
    const originFor = (value) => {
        if (addonToolbarSet.has(value)) return 'addon';
        if (value === 'stylesets') return 'for';
        if (forToolbarSet.has(value)) return 'for';
        return 'core';
    };
    const badgeFor = (origin) => {
        if (origin === 'addon') return '<span class="for-plugin-badge for-plugin-badge--addon">AddOn</span>';
        if (origin === 'for') return '<span class="for-plugin-badge">FOR</span>';
        return '';
    };
    const $toolbarRows = $builderBody.find('.builder-toolbar-rows');
    const setToolbarRows = (rows) => {
        const removeLabel = loadI18n.toolbar_remove_row || '';
        const emptyLabel = loadI18n.toolbar_row_empty || '';
        const rowTitle = loadI18n.toolbar_row || '';
        const pickerLabel = loadI18n.toolbar_picker || '';
        const normalizedRows = Array.isArray(rows) && rows.length > 0 ? rows : [[]];
        $toolbarRows.empty();
        normalizedRows.forEach((items, index) => {
            const $row = $('<div class="builder-toolbar-row">' +
                '<div class="builder-toolbar-row-header">' +
                    '<span class="builder-toolbar-row-title">' + rowTitle + ' ' + (index + 1) + '</span>' +
                    '<div class="btn-group btn-group-xs">' +
                        '<button type="button" class="btn btn-danger builder-toolbar-row-remove"><i class="rex-icon fa-trash"></i> ' + removeLabel + '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="builder-toolbar-picker">' +
                    '<div class="builder-toolbar-picker-label">' + pickerLabel + '</div>' +
                    '<div class="builder-toolbar-picker-help">' + (loadI18n.toolbar_click_to_pick || 'Ins Feld klicken, dann im Dropdown waehlen. Markierungen: Core / FOR / AddOn.') + '</div>' +
                '</div>' +
                '<div class="builder-toolbar-row-empty"' + ((items && items.length > 0) ? ' style="display:none;"' : '') + '>' + emptyLabel + '</div>' +
                '<div class="builder-toolbar-pill-dropzone">' +
                    '<ul class="builder-toolbar-pill-list list-inline" style="margin-bottom: 0;"></ul>' +
                    '<div class="builder-toolbar-inline-picker">' +
                        '<input type="text" class="form-control input-sm builder-toolbar-inline-picker-search" placeholder="' + (loadI18n.search || 'Suche') + '">' +
                        '<div class="builder-toolbar-inline-picker-list"></div>' +
                    '</div>' +
                '</div>' +
            '</div>');
            (items || []).forEach((item) => {
                const value = normalizeToolbarItemValue(item);
                if (!value) return;
                const origin = originFor(value);
                const $pill = $('<li class="builder-toolbar-pill builder-toolbar-pill--' + origin + '" draggable="true"></li>');
                $pill.attr('data-value', value);
                $pill.data('value', value);
                $pill.append($(badgeFor(origin)));
                $pill.append($('<span class="builder-toolbar-pill-text"></span>').text(value));
                $row.find('.builder-toolbar-pill-list').append($pill);
            });
            $toolbarRows.append($row);
        });
        const toolbarLines = normalizedRows
            .map((items) => Array.isArray(items) ? items.filter(Boolean).join(' ') : '')
            .filter(Boolean);
        $builderBody.find('.builder-toolbar-input').val(toolbarLines.join('\n'));
    };

    // Plugins
    if (typeof cfg.plugins === 'string' || Array.isArray(cfg.plugins)) {
        const list = Array.isArray(cfg.plugins) ? cfg.plugins : tokenize(cfg.plugins);
        $builderBody.find('.builder-plugin').prop('checked', false);
        list.forEach((p) => {
            $builderBody.find('.builder-plugin[value="' + p + '"]').prop('checked', true);
        });
    }

    // Toolbar
    if (cfg.toolbar === false) {
        setToolbarRows([]);
        $builderBody.find('.builder-toolbar-enabled').prop('checked', false).trigger('change');
    } else if (typeof cfg.toolbar === 'string') {
        setToolbarRows([tokenize(cfg.toolbar)]);
        $builderBody.find('.builder-toolbar-enabled').prop('checked', true).trigger('change');
    } else if (Array.isArray(cfg.toolbar)) {
        setToolbarRows(cfg.toolbar.filter((row) => typeof row === 'string').map((row) => tokenize(row)));
        $builderBody.find('.builder-toolbar-enabled').prop('checked', true).trigger('change');
    }
    if (typeof cfg.toolbar_mode === 'string' && cfg.toolbar_mode) {
        $builderBody.find('.builder-toolbar-mode').val(cfg.toolbar_mode);
    }

    // Common: Höhe / Breite / Resize / Autoresize
    const pluginList = Array.isArray(cfg.plugins)
        ? cfg.plugins
        : (typeof cfg.plugins === 'string' ? cfg.plugins.split(/\s+/) : []);
    const hasAutoresize = pluginList.indexOf('autoresize') !== -1;

    if (hasAutoresize) {
        $builderBody.find('.builder-autoresize').prop('checked', true);
        // height bei autoresize ignoriert; min_height gibt die "Start"-Höhe an.
        if (typeof cfg.min_height === 'number') {
            $builderBody.find('.builder-height').val(cfg.min_height);
        }
    } else if (typeof cfg.height === 'number') {
        $builderBody.find('.builder-height').val(cfg.height);
    } else if (typeof cfg.height === 'string' && cfg.height.trim()) {
        $builderBody.find('.builder-height').val(cfg.height.trim());
    }

    if (typeof cfg.width === 'number') {
        $builderBody.find('.builder-width').val(cfg.width);
    } else if (typeof cfg.width === 'string' && cfg.width.trim()) {
        $builderBody.find('.builder-width').val(cfg.width.trim());
    }
    if (typeof cfg.min_height === 'number') {
        $builderBody.find('.builder-min-height').val(cfg.min_height);
    }
    if (typeof cfg.max_height === 'number') {
        $builderBody.find('.builder-max-height').val(cfg.max_height);
    }
    if (cfg.resize === false) {
        $builderBody.find('.builder-resize').val('false');
    } else if (cfg.resize === 'both') {
        $builderBody.find('.builder-resize').val('both');
    } else {
        $builderBody.find('.builder-resize').val('true');
    }
    if (typeof cfg.language === 'string') {
        $builderBody.find('.builder-lang').val(cfg.language);
    }
    if (typeof cfg.menubar !== 'undefined') {
        $builderBody.find('.builder-menubar').prop('checked', !!cfg.menubar);
    }

    // Auto-Hide Toolbar wird ueber einen setup()-Block serialisiert (siehe
    // generateConfig). Da das in cfg nicht als eigenes Feld landet, erkennen
    // wir den Zustand am Roh-Source des Profils anhand der CSS-Marker-Klasse
    // bzw. (Legacy) am display:none-Inline-Toggle frueherer Versionen.
    if (/tmce-autohide/.test(source) || /tox-editor-header[^]*display\s*=\s*['"]none['"]/.test(source)) {
        $builderBody.find('.builder-auto-hide-toolbar').prop('checked', true);
    }

    // Context toolbar (quickbars)
    if (pluginList.indexOf('quickbars') !== -1 || typeof cfg.quickbars_selection_toolbar === 'string' || typeof cfg.quickbars_insert_toolbar !== 'undefined') {
        $builderBody.find('.builder-context-toolbar').prop('checked', true).trigger('change');
    }
    if (typeof cfg.quickbars_selection_toolbar === 'string') {
        const $ctxList = $('#builder-context-selected-items');
        $ctxList.empty();
        tokenize(cfg.quickbars_selection_toolbar).forEach((v) => {
            const origin = originFor(v);
            const $pill = $('<li class="builder-toolbar-pill builder-toolbar-pill--' + origin + '" draggable="true"></li>');
            $pill.attr('data-value', v).data('value', v);
            $pill.append($(badgeFor(origin)));
            $pill.append($('<span class="builder-toolbar-pill-text"></span>').text(v));
            $ctxList.append($pill);
        });
        $builderBody.find('.builder-context-toolbar-selection').val(tokenize(cfg.quickbars_selection_toolbar).join(' '));
    }
    if (cfg.quickbars_insert_toolbar && cfg.quickbars_insert_toolbar !== false) {
        $builderBody.find('.builder-context-toolbar-insert').prop('checked', true).trigger('change');
    }

    // Insert menu
    if (cfg.menu && cfg.menu.insert) {
        const items = cfg.menu.insert.items || '';
        const $insertList = $('#builder-insert-selected-items');
        $insertList.empty();
        tokenize(items).forEach((v) => {
            const origin = originFor(v);
            const $pill = $('<li class="builder-toolbar-pill builder-toolbar-pill--' + origin + '" draggable="true"></li>');
            $pill.attr('data-value', v).data('value', v);
            $pill.append($(badgeFor(origin)));
            $pill.append($('<span class="builder-toolbar-pill-text"></span>').text(v));
            $insertList.append($pill);
        });
        $builderBody.find('.builder-insert-menu-input').val(tokenize(items).join(' '));
    }

    // Advanced options
    const boolMap = {
        image_caption: '.builder-image-caption',
        image_uploadtab: '.builder-image-uploadtab',
        relative_urls: '.builder-relative-urls',
        remove_script_host: '.builder-remove-script-host',
        convert_urls: '.builder-convert-urls',
    };
    Object.keys(boolMap).forEach((key) => {
        if (typeof cfg[key] !== 'undefined') {
            $builderBody.find(boolMap[key]).prop('checked', !!cfg[key]);
        }
    });

    const strMap = {
        document_base_url: '.builder-base-url',
        entity_encoding: '.builder-entity-encoding',
        tinymce_media_type: '.builder-media-type',
    };
    Object.keys(strMap).forEach((key) => {
        if (typeof cfg[key] === 'string') {
            $builderBody.find(strMap[key]).val(cfg[key]);
        }
    });

    // TOC
    if (typeof cfg.toc_depth === 'number') {
        $builderBody.find('.builder-toc-depth').val(cfg.toc_depth);
    }
    if (typeof cfg.toc_header === 'string') {
        $builderBody.find('.builder-toc-header').val(cfg.toc_header);
    }
    if (typeof cfg.toc_class === 'string') {
        $builderBody.find('.builder-toc-class').val(cfg.toc_class);
    }

    // Color mapping
    if (cfg.custom_colors === false) {
        $builderBody.find('.builder-custom-colors').prop('checked', false);
    } else {
        $builderBody.find('.builder-custom-colors').prop('checked', true);
    }

    if (Array.isArray(cfg.color_map_raw) && cfg.color_map_raw.length > 0) {
        $builderBody.find('.builder-color-map-enable').prop('checked', true);
        $builderBody.find('.builder-color-map-raw').val(JSON.stringify(cfg.color_map_raw, null, 2));
        $builderBody.find('.builder-color-map-raw').trigger('input');
        if (typeof cfg.color_cols === 'number' && Number.isFinite(cfg.color_cols) && cfg.color_cols > 0) {
            $builderBody.find('.builder-color-cols').val(cfg.color_cols);
        }
    }

    // for_images presets
    const hasImagewidth = Array.isArray(cfg.imagewidth_presets) || Array.isArray(cfg.imagealign_presets) || Array.isArray(cfg.imageeffect_presets);
    if (hasImagewidth) {
        $builderBody.find('.builder-imagewidth-enable').prop('checked', true).trigger('change');
        if (Array.isArray(cfg.imagewidth_presets)) {
            $builderBody.find('.builder-imagewidth-width-presets').val(JSON.stringify(cfg.imagewidth_presets, null, 2));
        }
        if (Array.isArray(cfg.imagealign_presets)) {
            $builderBody.find('.builder-imagewidth-align-presets').val(JSON.stringify(cfg.imagealign_presets, null, 2));
        }
        if (Array.isArray(cfg.imageeffect_presets)) {
            $builderBody.find('.builder-imagewidth-effect-presets').val(JSON.stringify(cfg.imageeffect_presets, null, 2));
        }
    }
    if (cfg.image_compat_warn === true) {
        $builderBody.find('.builder-imagewidth-compat-warn').prop('checked', true);
    }

    // Layout Rules
    if (cfg.for_layout_rules_no_images_in_headings === true) {
        $builderBody.find('.builder-layout-images-in-headings').prop('checked', true);
    }
    if (cfg.for_layout_rules_collapse_empty_paragraphs === true) {
        $builderBody.find('.builder-layout-clear-empty').prop('checked', true);
    }
    if (cfg.for_layout_rules_clear_empty_paragraphs === true) {
        $builderBody.find('.builder-layout-delete-empty').prop('checked', true);
    }
    if (cfg.for_layout_rules_convert_lines_to_hr === true) {
        $builderBody.find('.builder-layout-lines-to-hr').prop('checked', true);
    }
    if (typeof cfg.for_layout_rules_clear_element_class === 'string') {
        $builderBody.find('.builder-layout-clear-class').val(cfg.for_layout_rules_clear_element_class);
    }
    if (typeof cfg.for_layout_rules_hr_class === 'string') {
        $builderBody.find('.builder-layout-hr-class').val(cfg.for_layout_rules_hr_class);
    }

    $builderBody.find('.builder-protected-extras').val(extractProtectedExtras(source));

    // Content Languages (content_langs → Sprach-Menü)
    if (Array.isArray(cfg.content_langs)) {
        const $clangsTable = $builderBody.find('#builder-contentlangs-table tbody');
        $clangsTable.empty();
        cfg.content_langs.forEach((entry) => {
            if (!entry || typeof entry !== 'object') return;
            const title = String(entry.title || '');
            const code = String(entry.code || '');
            const customCode = String(entry.customCode || '');
            const isDefault = typeof cfg.language === 'string' && cfg.language === code;
            const defChecked = isDefault ? ' checked' : '';
            $clangsTable.append(
                '<tr>' +
                '<td><input type="text" class="form-control input-sm clang-title" value="' + title.replace(/"/g, '&quot;') + '"></td>' +
                '<td><input type="text" class="form-control input-sm clang-code" value="' + code.replace(/"/g, '&quot;') + '"></td>' +
                '<td><input type="text" class="form-control input-sm clang-customcode" value="' + customCode.replace(/"/g, '&quot;') + '"></td>' +
                '<td style="text-align:center; vertical-align:middle;"><input type="radio" name="clang-default" class="clang-default"' + defChecked + '></td>' +
                '<td><button type="button" class="btn btn-danger btn-xs clang-remove"><i class="rex-icon fa-times"></i></button></td>' +
                '</tr>'
            );
        });
    }

    // Typografie-Autoreplace & for_chars_symbols
    if (typeof cfg.for_chars_symbols_disable_emoticons === 'boolean') {
        $builderBody.find('.builder-disable-emoticons').prop('checked', !!cfg.for_chars_symbols_disable_emoticons);
    }
    
    if (typeof cfg.for_chars_symbols_autoreplace === 'boolean') {
        $builderBody.find('.builder-autoreplace-enabled').prop('checked', !!cfg.for_chars_symbols_autoreplace);
    }
    if (typeof cfg.for_chars_symbols_autoreplace_defaults === 'boolean') {
        $builderBody.find('.builder-autoreplace-defaults').prop('checked', !!cfg.for_chars_symbols_autoreplace_defaults);
    }
    if (Array.isArray(cfg.for_chars_symbols_autoreplace_rules)) {
        const $arTable = $builderBody.find('#builder-autoreplace-table tbody');
        $arTable.empty();
        cfg.for_chars_symbols_autoreplace_rules.forEach((rule) => {
            if (!rule) return;
            // Kurzform: ["from", "to"]
            if (Array.isArray(rule) && rule.length >= 2) {
                const from = String(rule[0] || '');
                const to = String(rule[1] || '');
                $arTable.append(
                    '<tr>' +
                    '<td><select class="form-control input-sm ar-type"><option value="text" selected>Text</option><option value="regex">Regex</option></select></td>' +
                    '<td><input type="text" class="form-control input-sm ar-from" value="' + from.replace(/"/g, '&quot;') + '"></td>' +
                    '<td><input type="text" class="form-control input-sm ar-to" value="' + to.replace(/"/g, '&quot;') + '"></td>' +
                    '<td><button type="button" class="btn btn-danger btn-xs ar-remove"><i class="rex-icon fa-times"></i></button></td>' +
                    '</tr>'
                );
                return;
            }
            if (typeof rule !== 'object') return;
            const isRegex = typeof rule.re === 'string';
            const type = isRegex ? 'regex' : 'text';
            const from = String(isRegex ? rule.re : (rule.from || ''));
            const to = String(rule.to || '');
            $arTable.append(
                '<tr>' +
                '<td><select class="form-control input-sm ar-type">' +
                    '<option value="text"' + (type === 'text' ? ' selected' : '') + '>Text</option>' +
                    '<option value="regex"' + (type === 'regex' ? ' selected' : '') + '>Regex</option>' +
                '</select></td>' +
                '<td><input type="text" class="form-control input-sm ar-from" value="' + from.replace(/"/g, '&quot;') + '"></td>' +
                '<td><input type="text" class="form-control input-sm ar-to" value="' + to.replace(/"/g, '&quot;') + '"></td>' +
                '<td><button type="button" class="btn btn-danger btn-xs ar-remove"><i class="rex-icon fa-times"></i></button></td>' +
                '</tr>'
            );
        });
    }

    // YForm link tables
    if (cfg.link_yform_tables && Array.isArray(cfg.link_yform_tables.items)) {
        if (typeof cfg.link_yform_tables.title === 'string') {
            $builderBody.find('.builder-yform-title').val(cfg.link_yform_tables.title);
        }
        const $yformTable = $builderBody.find('#builder-yform-table tbody');
        $yformTable.empty();
        cfg.link_yform_tables.items.forEach((item) => {
            const title = (item && item.title) || '';
            const table = (item && item.table) || '';
            const field = (item && item.field) || '';
            const url = (item && item.url) || '';
            $yformTable.append(
                '<tr>' +
                '<td><input type="text" class="form-control input-sm yform-title" value="' + title + '"></td>' +
                '<td><input type="text" class="form-control input-sm yform-table" value="' + table + '"></td>' +
                '<td><input type="text" class="form-control input-sm yform-field" value="' + field + '"></td>' +
                '<td><input type="text" class="form-control input-sm yform-url" value="' + url + '"></td>' +
                '<td><button type="button" class="btn btn-danger btn-xs yform-remove"><i class="rex-icon fa-times"></i></button></td>' +
                '</tr>'
            );
        });
    }

    return true;
}
