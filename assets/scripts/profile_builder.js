
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
    
    // Toggle Button
    const $toggleBtn = $('<button type="button" class="btn btn-info" style="margin-bottom: 10px;"><i class="rex-icon fa-magic"></i> ' + (i18n.profile_assistant || 'Profile Assistant') + '</button>');
    $toggleBtn.on('click', function() {
        $builderContainer.slideToggle();
    });

    // Load-from-config Button (populates the builder with the current textarea config)
    const $loadBtn = $('<button type="button" class="btn btn-default" style="margin-bottom: 10px; margin-left: 6px;" title="' + (i18n.load_from_config_help || '') + '"><i class="rex-icon fa-upload"></i> ' + (i18n.load_from_config || 'Load from current config') + '</button>');
    $loadBtn.on('click', function() {
        const loaded = loadFromConfig($textarea, $builderBody);
        if (loaded) {
            if (!$builderContainer.is(':visible')) {
                $builderContainer.slideDown();
            }
            alert(i18n.loaded_from_config || 'Configuration loaded into the assistant.');
        } else {
            alert(i18n.load_failed || 'Could not parse configuration.');
        }
    });

    $textarea.before($toggleBtn);
    $textarea.before($loadBtn);
    $textarea.before($builderContainer);

    // Presets
    let presetsHtml = '<legend>' + (i18n.presets || 'Presets') + '</legend><div class="btn-group btn-group-justified">';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-simple"><i class="rex-icon fa-minus"></i> ' + (i18n.simple || 'Simple') + '</button></div>';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-standard"><i class="rex-icon fa-bars"></i> ' + (i18n.standard || 'Standard') + '</button></div>';
    presetsHtml += '<div class="btn-group"><button type="button" class="btn btn-default builder-preset-full"><i class="rex-icon fa-th"></i> ' + (i18n.full || 'Full') + '</button></div>';
    presetsHtml += '</div><br>';

    // Builder UI
    const options = rex.tinymceProfileOptions || {};
    const pluginsList = options.plugins || [];
    const toolbarButtons = options.toolbar || [];

    // Plugins Section – FOR plugins (for_*) are highlighted as "premium" custom plugins
    const isForPlugin = (name) => typeof name === 'string' && name.indexOf('for_') === 0;
    let pluginsHtml = '<legend>' + (i18n.plugins || 'Plugins') + ' <small class="for-plugin-legend-hint"><span class="for-plugin-badge-inline">FOR</span> ' + (i18n.for_plugins_hint || 'FriendsOfREDAXO custom plugins') + '</small></legend><div class="row">';
    pluginsList.forEach(plugin => {
        const forClass = isForPlugin(plugin) ? ' builder-plugin-row--for' : '';
        const badge = isForPlugin(plugin) ? '<span class="for-plugin-badge" title="FriendsOfREDAXO">FOR</span> ' : '';
        pluginsHtml += `<div class="col-md-3 col-sm-4${forClass}"><div class="checkbox"><label><input type="checkbox" class="builder-plugin" value="${plugin}"> ${badge}${plugin}</label></div></div>`;
    });
    pluginsHtml += '</div><br>';

    // Toolbar Section
    let toolbarHtml = '<legend>' + (i18n.toolbar || 'Toolbar') + '</legend><p class="help-block">' + (i18n.toolbar_help || 'Click to add items. Drag and drop selected items to reorder.') + '</p>';
    
    // Available Buttons – FOR-* buttons highlighted
    toolbarHtml += '<div class="panel panel-default"><div class="panel-heading">' + (i18n.available_items || 'Available Items') + '</div><div class="panel-body" id="builder-available-items">';
    toolbarButtons.forEach(btn => {
        if (isForPlugin(btn)) {
            toolbarHtml += `<button type="button" class="btn btn-xs builder-toolbar-btn builder-toolbar-btn--for" data-value="${btn}" style="margin-bottom: 4px;" title="FriendsOfREDAXO"><span class="for-plugin-badge">FOR</span> ${btn}</button> `;
        } else {
            toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="${btn}" style="margin-bottom: 4px;">${btn}</button> `;
        }
    });
    // Add Separator Button
    toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="|" style="margin-bottom: 4px;"><strong>| (${i18n.separator || 'Separator'})</strong></button> `;
    toolbarHtml += '</div></div>';

    // Selected Items (Sortable)
    toolbarHtml += '<div class="panel panel-primary"><div class="panel-heading">' + (i18n.selected_toolbar || 'Selected Toolbar (Drag to reorder)') + '</div><div class="panel-body" style="background-color: #f5f5f5;"><ul id="builder-selected-items" class="list-inline" style="margin-bottom: 0;"></ul></div></div>';
    
    // Toolbar Input (Result)
    toolbarHtml += '<div class="form-group"><label>' + (i18n.toolbar_result || 'Toolbar String (Result)') + '</label><input type="text" class="form-control builder-toolbar-input" readonly></div>';

    // Insert Menu Section
    const defaultInsertItems = options.menu_insert_items || [];
    const customMenuItems = options.custom_menu_items || {};
    let insertMenuHtml = '<legend>' + (i18n.insert_menu || 'Insert Menu') + '</legend>';
    insertMenuHtml += '<p class="help-block">' + (i18n.insert_menu_help || 'Configure which items appear in the menubar "Insert" menu.') + '</p>';
    insertMenuHtml += '<div class="row"><div class="col-md-6"><div class="form-group"><label>' + (i18n.insert_menu_title || 'Menu title') + '</label><input type="text" class="form-control builder-insert-menu-title" value="Einfügen"></div></div></div>';
    insertMenuHtml += '<div class="panel panel-default"><div class="panel-heading">' + (i18n.available_items || 'Available Items') + '</div><div class="panel-body" id="builder-insert-available-items">';
    defaultInsertItems.forEach(function (btn) {
        insertMenuHtml += '<button type="button" class="btn btn-default btn-xs builder-insert-item-btn" data-value="' + btn + '" style="margin-bottom: 4px;">' + btn + '</button> ';
    });
    insertMenuHtml += '<button type="button" class="btn btn-default btn-xs builder-insert-item-btn" data-value="|" style="margin-bottom: 4px;"><strong>| (' + (i18n.separator || 'Separator') + ')</strong></button> ';
    insertMenuHtml += '</div></div>';
    insertMenuHtml += '<div class=\"panel panel-info\"><div class=\"panel-heading\"><span class=\"for-plugin-badge\">FOR</span> ' + (i18n.custom_menu_items || 'Custom plugin items') + '</div><div class=\"panel-body\" id=\"builder-insert-custom-items\">';
    Object.keys(customMenuItems).forEach(function (key) {
        insertMenuHtml += '<button type=\"button\" class=\"btn btn-info btn-xs builder-insert-item-btn builder-insert-item-btn--for\" data-value=\"' + key + '\" title=\"' + customMenuItems[key] + '\" style=\"margin-bottom: 4px;\"><span class=\"for-plugin-badge\">FOR</span> ' + key + '</button> ';
    });
    insertMenuHtml += '</div></div>';
    insertMenuHtml += '<div class="panel panel-primary"><div class="panel-heading">' + (i18n.selected_toolbar || 'Selected (Drag to reorder)') + '</div><div class="panel-body" style="background-color: #f5f5f5;"><ul id="builder-insert-selected-items" class="list-inline" style="margin-bottom: 0;"></ul></div></div>';
    insertMenuHtml += '<div class="form-group"><label>' + (i18n.insert_menu_result || 'Insert menu items (result)') + '</label><input type="text" class="form-control builder-insert-menu-input" readonly></div>';
    toolbarHtml += insertMenuHtml;

    // Common Settings
    let settingsHtml = '<br><legend>' + (i18n.common_settings || 'Common Settings') + '</legend><div class="row">';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.height || 'Height') + '</label><input type="text" class="form-control builder-height" value="400" placeholder="400, 400px, 50vh, 80%, auto"><p class="help-block" style="margin-top:4px;">' + (i18n.height_help || 'Zahl (px), oder CSS-Einheit (px, vh, vw, %, em, rem). <code>auto</code> bzw. <code>wachsend</code> = Editor wächst mit dem Inhalt (aktiviert das autoresize-Plugin).') + '</p></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.language || 'Language') + '</label><input type="text" class="form-control builder-lang" value="de"></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox" style="margin-top: 25px;"><label><input type="checkbox" class="builder-menubar" checked> ' + (i18n.menubar || 'Show Menubar') + '</label></div></div>';
    settingsHtml += '</div>';

    // Advanced Settings
    settingsHtml += '<br><legend>' + (i18n.advanced_settings || 'Advanced Settings') + '</legend><div class="row">';
    
    // Context Toolbar
    settingsHtml += '<div class="col-md-12"><div class="checkbox"><label><input type="checkbox" class="builder-context-toolbar"> <strong>' + (i18n.context_toolbar || 'Context Toolbar (Quickbars)') + '</strong></label><p class="help-block">' + (i18n.context_toolbar_help || 'Shows tools directly at the cursor when text is selected.') + '</p></div></div>';
    settingsHtml += '<div class="col-md-12 builder-context-toolbar-options" style="display:none; padding-left: 20px; margin-bottom: 15px; border-left: 3px solid #eee;">';
    
    // Context Toolbar Builder
    settingsHtml += '<div class="panel panel-default"><div class="panel-heading">' + (i18n.available_items || 'Available Items') + '</div><div class="panel-body" id="builder-context-available-items">';
    toolbarButtons.forEach(btn => {
        settingsHtml += `<button type="button" class="btn btn-default btn-xs builder-context-toolbar-btn" data-value="${btn}" style="margin-bottom: 4px;">${btn}</button> `;
    });
    settingsHtml += `<button type="button" class="btn btn-default btn-xs builder-context-toolbar-btn" data-value="|" style="margin-bottom: 4px;"><strong>| (${i18n.separator || 'Separator'})</strong></button> `;
    settingsHtml += '</div></div>';

    settingsHtml += '<div class="panel panel-primary"><div class="panel-heading">' + (i18n.selected_toolbar || 'Selected Toolbar (Drag to reorder)') + '</div><div class="panel-body" style="background-color: #f5f5f5;"><ul id="builder-context-selected-items" class="list-inline" style="margin-bottom: 0;"></ul></div></div>';
    
    settingsHtml += '<div class="form-group"><label>Selection Toolbar Result</label><input type="text" class="form-control builder-context-toolbar-selection" value="bold italic | link h2 h3 blockquote" readonly></div>';
    
    settingsHtml += '<div class="checkbox"><label><input type="checkbox" class="builder-context-toolbar-insert"> Show Insert Toolbar (quickimage quicktable)</label></div>';
    settingsHtml += '</div>';

    // Auto Hide Toolbar
    settingsHtml += '<div class="col-md-12"><div class="checkbox"><label><input type="checkbox" class="builder-auto-hide-toolbar"> ' + (i18n.auto_hide_toolbar || 'Auto-Hide Toolbar') + '</label></div></div>';

    // Image Options
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-caption" checked> ' + (i18n.image_caption || 'Image Caption') + '</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-uploadtab"> ' + (i18n.image_uploadtab || 'Image Upload Tab') + '</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.media_manager_type || 'Media Manager Type') + '</label><input type="text" class="form-control builder-media-type" placeholder="tiny"></div></div>';
    
    // URL Options
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-relative-urls"> ' + (i18n.relative_urls || 'Relative URLs') + '</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-remove-script-host" checked> ' + (i18n.remove_script_host || 'Remove Script Host') + '</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-convert-urls" checked> ' + (i18n.convert_urls || 'Convert URLs') + '</label></div></div>';
    
    settingsHtml += '</div><div class="row" style="margin-top:10px;">';
    
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>' + (i18n.document_base_url || 'Document Base URL') + '</label><input type="text" class="form-control builder-base-url" value="/"></div></div>';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>' + (i18n.entity_encoding || 'Entity Encoding') + '</label><select class="form-control builder-entity-encoding"><option value="raw" selected>raw</option><option value="named">named</option><option value="numeric">numeric</option></select></div></div>';
    
    settingsHtml += '</div>';

    // Extras (Codesample, RelList, TOC)
    settingsHtml += '<br><legend>' + (i18n.extras_defaults || 'Extras (Defaults)') + '</legend><div class="row">';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-codesample" checked> ' + (i18n.default_codesample_languages || 'Default Codesample Languages') + '</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-rellist" checked> ' + (i18n.default_rellist || 'Default Rel List') + '</label></div></div>';
    settingsHtml += '</div>';

    // YForm Link Configuration
    settingsHtml += '<br><legend>Link YForm Configuration</legend>';
    settingsHtml += '<div class="panel panel-default"><div class="panel-body">';
    settingsHtml += '<div class="form-group"><label>Dropdown Title</label><input type="text" class="form-control builder-yform-title" value="YForm Datensätze"></div>';
    settingsHtml += '<table class="table table-striped" id="builder-yform-table"><thead><tr><th>Title</th><th>Table</th><th>Field</th><th>Link-Schema (opt.)</th><th></th></tr></thead><tbody></tbody></table>';
    settingsHtml += '<p class="help-block" style="margin-top:4px;">' + (i18n.link_schema_help || '<strong>Link-Schema (optional):</strong> URL-Muster für den erzeugten Link. Platzhalter: <code>[id]</code> = ID des YForm-Datensatzes, <code>[field]</code> = gewählter Feldwert. Beispiele: <code>index.php?article_id=5&amp;news=[id]</code> oder <code>/produkt/[id]</code>. Leer lassen = es wird nur der Feldwert als Link-Text eingefügt.') + '</p>';
    settingsHtml += '<button type="button" class="btn btn-default btn-xs builder-yform-add"><i class="rex-icon fa-plus"></i> Add Item</button>';
    settingsHtml += '</div></div>';

    // Image Width Plugin (Preset-based)
    settingsHtml += '<br><legend><i class="rex-icon fa-image"></i> ' + (i18n.imagewidth || 'Bildformatierung') + '</legend>';
    settingsHtml += '<p class="help-block">' + (i18n.imagewidth_help || 'Bilder werden in &lt;figure&gt; gewrappt. Breite, Ausrichtung und Effekte als CSS-Klassen.') + '</p>';
    settingsHtml += '<div class="row">';
    settingsHtml += '<div class="col-md-3"><div class="checkbox"><label><input type="checkbox" class="builder-imagewidth-enable"> ' + (i18n.imagewidth_enable || 'Aktivieren') + '</label></div></div>';
    settingsHtml += '<div class="col-md-3"><div class="form-group"><label>' + (i18n.imagewidth_template || 'Vorlage laden') + '</label>';
    settingsHtml += '<select class="form-control builder-imagewidth-template" disabled>';
    settingsHtml += '<option value="">-- Auswählen --</option>';
    settingsHtml += '<option value="uikit">UIkit 3</option>';
    settingsHtml += '<option value="bootstrap">Bootstrap 5</option>';
    settingsHtml += '<option value="general">Allgemein (Pixel)</option>';
    settingsHtml += '</select></div></div>';
    settingsHtml += '<div class="col-md-3"><div class="form-group"><label>Breakpoint (UIkit/BS)</label>';
    settingsHtml += '<select class="form-control builder-imagewidth-breakpoint" disabled>';
    settingsHtml += '<option value="">Alle Viewports</option>';
    settingsHtml += '<option value="@s">UIkit @s (≥640px)</option>';
    settingsHtml += '<option value="@m" selected>UIkit @m (≥960px)</option>';
    settingsHtml += '<option value="@l">UIkit @l (≥1200px)</option>';
    settingsHtml += '<option value="sm">Bootstrap sm (≥576px)</option>';
    settingsHtml += '<option value="md">Bootstrap md (≥768px)</option>';
    settingsHtml += '<option value="lg">Bootstrap lg (≥992px)</option>';
    settingsHtml += '</select></div></div>';
    settingsHtml += '</div>';
    // Preset Textareas
    settingsHtml += '<div class="builder-imagewidth-presets" style="display:none; margin-top:10px;">';
    settingsHtml += '<div class="row">';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>Breiten-Presets (JSON)</label>';
    settingsHtml += '<textarea class="form-control builder-imagewidth-width-presets" rows="6" placeholder=\'[{"label":"Klein","class":"uk-width-small@m"}]\'></textarea>';
    settingsHtml += '<p class="help-block small">Array: [{label, class}]</p></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>Ausrichtungs-Presets (JSON)</label>';
    settingsHtml += '<textarea class="form-control builder-imagewidth-align-presets" rows="6" placeholder=\'[{"label":"Links","class":"uk-float-left uk-margin-right"}]\'></textarea>';
    settingsHtml += '<p class="help-block small">Array: [{label, class}]</p></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>Effekt-Presets (JSON)</label>';
    settingsHtml += '<textarea class="form-control builder-imagewidth-effect-presets" rows="6" placeholder=\'[{"label":"Schatten","class":"uk-box-shadow-medium"}]\'></textarea>';
    settingsHtml += '<p class="help-block small">Multi-Select, kombinierbar</p></div></div>';
    settingsHtml += '</div></div>';

    // TOC Settings
    settingsHtml += '<div class="row" style="margin-top:10px;">';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_depth || 'TOC Depth') + '</label><input type="number" class="form-control builder-toc-depth" value="3"></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_header_tag || 'TOC Header Tag') + '</label><input type="text" class="form-control builder-toc-header" value="div"></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.toc_class || 'TOC Class') + '</label><input type="text" class="form-control builder-toc-class" value="our-toc"></div></div>';
    settingsHtml += '</div>';

    // Apply Button
    let actionsHtml = '<hr><button type="button" class="btn btn-save builder-apply"><i class="rex-icon fa-check"></i> ' + (i18n.generate_config || 'Generate Configuration') + '</button> <span class="text-muted">' + (i18n.overwrites_existing_config || 'Overwrites existing configuration!') + '</span>';

    $builderBody.html(presetsHtml + pluginsHtml + toolbarHtml + settingsHtml + actionsHtml);

    // Context Toolbar Toggle
    $builderBody.on('change', '.builder-context-toolbar', function() {
        if ($(this).is(':checked')) {
            $builderBody.find('.builder-context-toolbar-options').slideDown();
            $builderBody.find('.builder-plugin[value="quickbars"]').prop('checked', true);
        } else {
            $builderBody.find('.builder-context-toolbar-options').slideUp();
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
    const style = document.createElement('style');
    style.innerHTML = `
        #builder-selected-items, #builder-context-selected-items, #builder-insert-selected-items { min-height: 40px; border: 1px dashed #ccc; padding: 10px; border-radius: 4px; background: #fff; }
        #builder-selected-items li, #builder-context-selected-items li, #builder-insert-selected-items li { cursor: move; margin-bottom: 5px; background: #324050; color: #fff; border: 1px solid #202b35; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        #builder-selected-items li:hover, #builder-context-selected-items li:hover, #builder-insert-selected-items li:hover { background: #283340; border-color: #000; }
        #builder-selected-items li .remove-item, #builder-context-selected-items li .remove-item, #builder-insert-selected-items li .remove-item { margin-left: 8px; color: #ff9999; cursor: pointer; font-weight: bold; }
        #builder-selected-items li.placeholder, #builder-context-selected-items li.placeholder, #builder-insert-selected-items li.placeholder { background: #dff0d8; border: 1px dashed #3c763d; height: 32px; width: 50px; }

        /* FOR Plugin highlighting (FriendsOfREDAXO) */
        .for-plugin-badge, .for-plugin-badge-inline {
            display: inline-block;
            padding: 1px 5px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.5px;
            line-height: 1.3;
            border-radius: 3px;
            background: linear-gradient(135deg, #e91e63, #9c27b0);
            color: #fff;
            vertical-align: middle;
            text-shadow: 0 1px 1px rgba(0,0,0,.15);
            box-shadow: 0 1px 2px rgba(0,0,0,.1);
        }
        .for-plugin-badge-inline { margin-left: 6px; }
        .for-plugin-legend-hint { margin-left: 8px; color: #999; font-weight: 400; }
        .builder-plugin-row--for label { font-weight: 600; }
        .builder-plugin-row--for label input { accent-color: #e91e63; }
        .builder-toolbar-btn--for {
            background: linear-gradient(135deg, #fff 0%, #fff 50%, #fce4ec 100%) !important;
            color: #880e4f !important;
            border: 1px solid #e91e63 !important;
            font-weight: 600;
        }
        .builder-toolbar-btn--for:hover { background: #fce4ec !important; }
        .builder-insert-item-btn--for {
            background: linear-gradient(135deg, #e91e63, #9c27b0) !important;
            border-color: transparent !important;
            color: #fff !important;
            font-weight: 600;
        }
        .builder-insert-item-btn--for:hover { filter: brightness(1.1); }
        body.rex-theme-dark .builder-toolbar-btn--for {
            background: linear-gradient(135deg, #2a2a2a 0%, #3a2030 100%) !important;
            color: #f48fb1 !important;
            border-color: #c2185b !important;
        }
        body.rex-theme-dark .builder-toolbar-btn--for:hover { background: #3a2030 !important; }
    `;
    document.head.appendChild(style);

    // Logic
    const $selectedList = $('#builder-selected-items');
    const $input = $builderBody.find('.builder-toolbar-input');

    // Context Logic
    const $contextSelectedList = $('#builder-context-selected-items');
    const $contextInput = $builderBody.find('.builder-context-toolbar-selection');

    // Insert-Menu Logic
    const $insertSelectedList = $('#builder-insert-selected-items');
    const $insertInput = $builderBody.find('.builder-insert-menu-input');

    function updateInput() {
        const items = [];
        $selectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $input.val(items.join(' '));
    }

    function updateContextInput() {
        const items = [];
        $contextSelectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $contextInput.val(items.join(' '));
    }

    function updateInsertInput() {
        const items = [];
        $insertSelectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $insertInput.val(items.join(' '));
    }

    function addItem(value) {
        const $li = $(`<li draggable="true" data-value="${value}">${value} <span class="remove-item">&times;</span></li>`);
        $selectedList.append($li);
        updateInput();
        setupDragEvents($li[0]);
    }

    function addContextItem(value) {
        const $li = $(`<li draggable="true" data-value="${value}">${value} <span class="remove-item">&times;</span></li>`);
        $contextSelectedList.append($li);
        updateContextInput();
        setupDragEvents($li[0]);
    }

    function addInsertItem(value) {
        const $li = $(`<li draggable="true" data-value="${value}">${value} <span class="remove-item">&times;</span></li>`);
        $insertSelectedList.append($li);
        updateInsertInput();
        setupDragEvents($li[0]);
    }

    function clearInsertItems() {
        $insertSelectedList.empty();
        updateInsertInput();
    }

    function clearItems() {
        $selectedList.empty();
        updateInput();
    }

    // Initialize Context Items from default value
    const defaultContextItems = $contextInput.val().split(' ');
    defaultContextItems.forEach(addContextItem);

    function setPlugins(plugins) {
        $builderBody.find('.builder-plugin').prop('checked', false);
        plugins.forEach(p => {
            $builderBody.find(`.builder-plugin[value="${p}"]`).prop('checked', true);
        });
    }

    // Presets Logic
    $builderBody.find('.builder-preset-simple').on('click', function() {
        setPlugins(['autolink', 'link', 'image', 'lists', 'code']);
        clearItems();
        ['bold', 'italic', 'underline', '|', 'bullist', 'numlist', '|', 'link', 'image', '|', 'code'].forEach(addItem);
    });

    $builderBody.find('.builder-preset-standard').on('click', function() {
        setPlugins(['autolink', 'link', 'image', 'lists', 'code', 'table', 'fullscreen', 'media']);
        clearItems();
        ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'bullist', 'numlist', '|', 'link', 'image', 'media', 'table', '|', 'code', 'fullscreen'].forEach(addItem);
    });

    $builderBody.find('.builder-preset-full').on('click', function() {
        setPlugins(pluginsList);
        clearItems();
        ['undo', 'redo', '|', 'blocks', 'fontsize', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', '|', 'bullist', 'numlist', 'outdent', 'indent', '|', 'link', 'link_yform', 'phonelink', 'quote', 'image', 'media', 'table', 'codesample', 'accordion', '|', 'removeformat', 'code', 'fullscreen'].forEach(addItem);
        // Enable for_images in Full preset
        $builderBody.find('.builder-imagewidth-enable').prop('checked', true).trigger('change');
    });

    // Add Item Click
    $builderBody.find('.builder-toolbar-btn').on('click', function() {
        addItem($(this).data('value'));
    });

    $builderBody.find('.builder-context-toolbar-btn').on('click', function() {
        addContextItem($(this).data('value'));
    });

    $builderBody.find('.builder-insert-item-btn').on('click', function() {
        addInsertItem($(this).data('value'));
    });

    // Remove Item Click
    $selectedList.on('click', '.remove-item', function() {
        $(this).parent().remove();
        updateInput();
    });

    $contextSelectedList.on('click', '.remove-item', function() {
        $(this).parent().remove();
        updateContextInput();
    });

    $insertSelectedList.on('click', '.remove-item', function() {
        $(this).parent().remove();
        updateInsertInput();
    });

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
    // other code path that inserts items without going through addItem().
    [$selectedList[0], $contextSelectedList[0], $insertSelectedList[0]].forEach(function (list) {
        if (!list) return;
        const mo = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node && node.nodeType === 1 && node.tagName === 'LI') {
                        setupDragEvents(node);
                    }
                });
            });
            // Keep hidden inputs in sync with whatever content is currently in the list.
            if (list.id === 'builder-selected-items') updateInput();
            else if (list.id === 'builder-context-selected-items') updateContextInput();
            else if (list.id === 'builder-insert-selected-items') updateInsertInput();
        });
        mo.observe(list, { childList: true });
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
            
            if (this.parentNode.id === 'builder-selected-items') {
                updateInput();
            } else if (this.parentNode.id === 'builder-context-selected-items') {
                updateContextInput();
            } else if (this.parentNode.id === 'builder-insert-selected-items') {
                updateInsertInput();
            }
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        $selectedList.find('li').removeClass('over');
        $contextSelectedList.find('li').removeClass('over');
        $insertSelectedList.find('li').removeClass('over');
    }

    $builderBody.find('.builder-apply').on('click', function() {
        generateConfig($textarea, $builderBody);
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

    // Auto-load existing config into the builder when in edit mode.
    // Runs after the DOM is ready; if the textarea already contains data we try
    // to hydrate the form controls so the user doesn't have to start over.
    setTimeout(function () {
        const existing = ($textarea.val() || '').trim();
        if (existing.length > 0) {
            loadFromConfig($textarea, $builderBody);
        }
    }, 50);
}

function escapeString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Parst den Höhen-Input aus dem Profil-Assistenten.
 *  - leer / ungültig  → { num: 400 }
 *  - reine Zahl       → { num: 400 }
 *  - Zahl + Einheit   → { css: "50vh" }      (px, vh, vw, %, em, rem)
 *  - "auto"/"wachsend"→ { autoresize: true, min: 200 }
 */
function parseHeightValue(raw) {
    const s = String(raw || '').trim().toLowerCase();
    if (!s) return { num: 400 };
    if (s === 'auto' || s === 'wachsend' || s === 'grow' || s === 'autoresize') {
        return { autoresize: true, min: 200 };
    }
    const m = s.match(/^(\d+(?:\.\d+)?)(px|vh|vw|%|em|rem)?$/);
    if (!m) return { num: 400 };
    const n = parseFloat(m[1]);
    if (!m[2] || m[2] === 'px') {
        return { num: Math.round(n) };
    }
    return { css: m[1] + m[2] };
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

    const toolbar = escapeString($builderBody.find('.builder-toolbar-input').val());
    const heightRaw = String($builderBody.find('.builder-height').val() || '').trim();
    const height = parseHeightValue(heightRaw);
    const lang = escapeString($builderBody.find('.builder-lang').val() || 'de');
    const menubar = $builderBody.find('.builder-menubar').is(':checked');

    // Autoresize: Editor wächst mit Inhalt
    if (height && height.autoresize && !plugins.includes('autoresize')) {
        plugins.push('autoresize');
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

    // Image Width (preset-based)
    const imagewidthEnabled = $builderBody.find('.builder-imagewidth-enable').is(':checked');
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

    // Build the configuration string manually to match the "pro" format (raw JS object body)
    let configStr = '';
    
    configStr += "license_key: 'gpl',\n";
    configStr += `language: '${lang}',\n`;
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

    // Insert Menu (menubar > Einfügen)
    const insertMenuItems = escapeString($builderBody.find('.builder-insert-menu-input').val() || '');
    const insertMenuTitle = escapeString($builderBody.find('.builder-insert-menu-title').val() || 'Einfügen');
    if (menubar && insertMenuItems) {
        configStr += `menu: {\n  insert: { title: '${insertMenuTitle}', items: '${insertMenuItems}' }\n},\n`;
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
    
    if (toolbar) {
        let finalToolbar = toolbar;
        configStr += `toolbar: '${finalToolbar}',\n`;
    }
    
    // Height: number | 'px|vh|vw|%|em|rem' | autoresize (min_height)
    if (height && height.autoresize) {
        configStr += `min_height: ${height.min},\n`;
        configStr += `autoresize_bottom_margin: 20,\n\n`;
    } else if (height && height.css) {
        configStr += `height: '${height.css}',\n\n`;
    } else {
        configStr += `height: ${(height && height.num) || 400},\n\n`;
    }
    
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
        configStr += `quickbars_image_toolbar: false,\n`;
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
        configStr += `rel_list: [
 {title: '${i18n.none || 'Keine'}', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],\n`;
    }

    configStr += `toc_depth: ${tocDepth},\n`;
    configStr += `toc_header: "${tocHeader}",\n`;
    configStr += `toc_class: "${tocClass}",\n\n`;

    // Raw JS expressions
    configStr += 'skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\n';
    configStr += 'content_css: redaxo.theme.current === "dark" ? "dark" : "default",\n';
    
    configStr += 'setup: function (editor) {\n';
    if (autoHideToolbar) {
        configStr += `    editor.on('init', function() {
        var container = editor.getContainer();
        var header = container.querySelector('.tox-editor-header');
        var statusbar = container.querySelector('.tox-statusbar');
        
        if (header) header.style.display = 'none';
        if (statusbar) statusbar.style.display = 'none';
        
        var show = function() {
            if (header) header.style.display = '';
            if (statusbar) statusbar.style.display = '';
        };
        
        var hide = function() {
            if (header) header.style.display = 'none';
            if (statusbar) statusbar.style.display = 'none';
        };
        
        editor.on('focus', show);
        container.addEventListener('focusin', show);
        
        var hideTimeout;
        var scheduleHide = function() {
            hideTimeout = setTimeout(function() {
                if (!container.contains(document.activeElement) && !editor.hasFocus()) {
                    hide();
                }
            }, 100);
        };
        
        editor.on('blur', scheduleHide);
        container.addEventListener('focusout', scheduleHide);
    });\n`;
    }
    configStr += '},\n';

    // Standard REDAXO file picker callback
    configStr += 'file_picker_callback: function (callback, value, meta) {\n';
    configStr += '    rex5_picker_function(callback, value, meta);\n';
    configStr += '}';

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
    const cfg = parseProfileExtra($textarea.val());
    if (!cfg || typeof cfg !== 'object') {
        return false;
    }

    const tokenize = (s) => String(s || '').trim().split(/\s+/).filter(Boolean);

    // Plugins
    if (typeof cfg.plugins === 'string' || Array.isArray(cfg.plugins)) {
        const list = Array.isArray(cfg.plugins) ? cfg.plugins : tokenize(cfg.plugins);
        $builderBody.find('.builder-plugin').prop('checked', false);
        list.forEach((p) => {
            $builderBody.find('.builder-plugin[value="' + p + '"]').prop('checked', true);
        });
    }

    // Toolbar
    if (typeof cfg.toolbar === 'string') {
        const $selectedList = $('#builder-selected-items');
        $selectedList.empty();
        tokenize(cfg.toolbar).forEach((v) => {
            $selectedList.append('<li draggable="true" data-value="' + v + '">' + v + ' <span class="remove-item">&times;</span></li>');
        });
        $builderBody.find('.builder-toolbar-input').val(tokenize(cfg.toolbar).join(' '));
    }

    // Common
    if (typeof cfg.height === 'number') {
        $builderBody.find('.builder-height').val(cfg.height);
    } else if (typeof cfg.height === 'string' && cfg.height.trim()) {
        $builderBody.find('.builder-height').val(cfg.height.trim());
    } else {
        const pluginList = Array.isArray(cfg.plugins)
            ? cfg.plugins
            : (typeof cfg.plugins === 'string' ? cfg.plugins.split(/\s+/) : []);
        if (typeof cfg.min_height === 'number' && pluginList.indexOf('autoresize') !== -1) {
            $builderBody.find('.builder-height').val('auto');
        }
    }
    if (typeof cfg.language === 'string') {
        $builderBody.find('.builder-lang').val(cfg.language);
    }
    if (typeof cfg.menubar !== 'undefined') {
        $builderBody.find('.builder-menubar').prop('checked', !!cfg.menubar);
    }

    // Context toolbar (quickbars)
    if (typeof cfg.quickbars_selection_toolbar === 'string') {
        $builderBody.find('.builder-context-toolbar').prop('checked', true).trigger('change');
        const $ctxList = $('#builder-context-selected-items');
        $ctxList.empty();
        tokenize(cfg.quickbars_selection_toolbar).forEach((v) => {
            $ctxList.append('<li draggable="true" data-value="' + v + '">' + v + ' <span class="remove-item">&times;</span></li>');
        });
        $builderBody.find('.builder-context-toolbar-selection').val(tokenize(cfg.quickbars_selection_toolbar).join(' '));
    }
    if (cfg.quickbars_insert_toolbar && cfg.quickbars_insert_toolbar !== false) {
        $builderBody.find('.builder-context-toolbar-insert').prop('checked', true);
    }

    // Insert menu
    if (cfg.menu && cfg.menu.insert) {
        const title = cfg.menu.insert.title || 'Einfügen';
        const items = cfg.menu.insert.items || '';
        $builderBody.find('.builder-insert-menu-title').val(title);
        const $insertList = $('#builder-insert-selected-items');
        $insertList.empty();
        tokenize(items).forEach((v) => {
            $insertList.append('<li draggable="true" data-value="' + v + '">' + v + ' <span class="remove-item">&times;</span></li>');
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
