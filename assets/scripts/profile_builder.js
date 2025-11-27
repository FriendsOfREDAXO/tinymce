
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
    const pluginsList = options.plugins || [];
    const toolbarButtons = options.toolbar || [];

    // Plugins Section
    let pluginsHtml = '<legend>' + (i18n.plugins || 'Plugins') + '</legend><div class="row">';
    pluginsList.forEach(plugin => {
        pluginsHtml += `<div class="col-md-3 col-sm-4"><div class="checkbox"><label><input type="checkbox" class="builder-plugin" value="${plugin}"> ${plugin}</label></div></div>`;
    });
    pluginsHtml += '</div><br>';

    // Toolbar Section
    let toolbarHtml = '<legend>' + (i18n.toolbar || 'Toolbar') + '</legend><p class="help-block">' + (i18n.toolbar_help || 'Click to add items. Drag and drop selected items to reorder.') + '</p>';
    
    // Available Buttons
    toolbarHtml += '<div class="panel panel-default"><div class="panel-heading">' + (i18n.available_items || 'Available Items') + '</div><div class="panel-body" id="builder-available-items">';
    toolbarButtons.forEach(btn => {
        toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="${btn}" style="margin-bottom: 4px;">${btn}</button> `;
    });
    // Add Separator Button
    toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="|" style="margin-bottom: 4px;"><strong>| (${i18n.separator || 'Separator'})</strong></button> `;
    toolbarHtml += '</div></div>';

    // Selected Items (Sortable)
    toolbarHtml += '<div class="panel panel-primary"><div class="panel-heading">' + (i18n.selected_toolbar || 'Selected Toolbar (Drag to reorder)') + '</div><div class="panel-body" style="background-color: #f5f5f5;"><ul id="builder-selected-items" class="list-inline" style="margin-bottom: 0;"></ul></div></div>';
    
    // Toolbar Input (Result)
    toolbarHtml += '<div class="form-group"><label>' + (i18n.toolbar_result || 'Toolbar String (Result)') + '</label><input type="text" class="form-control builder-toolbar-input" readonly></div>';

    // Common Settings
    let settingsHtml = '<br><legend>' + (i18n.common_settings || 'Common Settings') + '</legend><div class="row">';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>' + (i18n.height || 'Height') + '</label><input type="number" class="form-control builder-height" value="400"></div></div>';
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
    
    settingsHtml += '</div><div class="row">';
    
    // PowerPaste
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>' + (i18n.powerpaste_word_import || 'PowerPaste Word Import') + '</label><select class="form-control builder-pp-word"><option value="clean" selected>clean</option><option value="merge">merge</option><option value="prompt">prompt</option></select></div></div>';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>' + (i18n.powerpaste_html_import || 'PowerPaste HTML Import') + '</label><select class="form-control builder-pp-html"><option value="merge" selected>merge</option><option value="clean">clean</option><option value="prompt">prompt</option></select></div></div>';

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
    settingsHtml += '<button type="button" class="btn btn-default btn-xs builder-yform-add"><i class="rex-icon fa-plus"></i> Add Item</button>';
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

    // Styles for Sortable
    const style = document.createElement('style');
    style.innerHTML = `
        #builder-selected-items, #builder-context-selected-items { min-height: 40px; border: 1px dashed #ccc; padding: 10px; border-radius: 4px; background: #fff; }
        #builder-selected-items li, #builder-context-selected-items li { cursor: move; margin-bottom: 5px; background: #324050; color: #fff; border: 1px solid #202b35; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        #builder-selected-items li:hover, #builder-context-selected-items li:hover { background: #283340; border-color: #000; }
        #builder-selected-items li .remove-item, #builder-context-selected-items li .remove-item { margin-left: 8px; color: #ff9999; cursor: pointer; font-weight: bold; }
        #builder-selected-items li.placeholder, #builder-context-selected-items li.placeholder { background: #dff0d8; border: 1px dashed #3c763d; height: 32px; width: 50px; }
    `;
    document.head.appendChild(style);

    // Logic
    const $selectedList = $('#builder-selected-items');
    const $input = $builderBody.find('.builder-toolbar-input');

    // Context Logic
    const $contextSelectedList = $('#builder-context-selected-items');
    const $contextInput = $builderBody.find('.builder-context-toolbar-selection');

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

    function clearItems() {
        $selectedList.empty();
        updateInput();
    }

    function clearContextItems() {
        $contextSelectedList.empty();
        updateContextInput();
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
    });

    // Add Item Click
    $builderBody.find('.builder-toolbar-btn').on('click', function() {
        addItem($(this).data('value'));
    });

    $builderBody.find('.builder-context-toolbar-btn').on('click', function() {
        addContextItem($(this).data('value'));
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

    // Drag and Drop Implementation
    let dragSrcEl = null;

    function setupDragEvents(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

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
            }
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        $selectedList.find('li').removeClass('over');
        $contextSelectedList.find('li').removeClass('over');
    }

    $builderBody.find('.builder-apply').on('click', function() {
        generateConfig($textarea, $builderBody);
    });

    // YForm Builder Logic
    const $yformTable = $builderBody.find('#builder-yform-table tbody');
    
    function addYFormRow(title = '', table = '', field = '', url = '') {
        const row = `<tr>
            <td><input type="text" class="form-control input-sm yform-title" value="${title}" placeholder="Projekt verlinken"></td>
            <td><input type="text" class="form-control input-sm yform-table" value="${table}" placeholder="rex_yf_project"></td>
            <td><input type="text" class="form-control input-sm yform-field" value="${field}" placeholder="title"></td>
            <td><input type="text" class="form-control input-sm yform-url" value="${url}" placeholder="/event:"></td>
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
}

function escapeString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
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
    const height = parseInt($builderBody.find('.builder-height').val()) || 400;
    const lang = escapeString($builderBody.find('.builder-lang').val() || 'de');
    const menubar = $builderBody.find('.builder-menubar').is(':checked');

    // Advanced Values
    const imageCaption = $builderBody.find('.builder-image-caption').is(':checked');
    const imageUploadTab = $builderBody.find('.builder-image-uploadtab').is(':checked');
    const mediaType = escapeString($builderBody.find('.builder-media-type').val());
    const relativeUrls = $builderBody.find('.builder-relative-urls').is(':checked');
    const removeScriptHost = $builderBody.find('.builder-remove-script-host').is(':checked');
    const convertUrls = $builderBody.find('.builder-convert-urls').is(':checked');
    
    const baseUrl = escapeString($builderBody.find('.builder-base-url').val());
    const entityEncoding = escapeString($builderBody.find('.builder-entity-encoding').val());
    const ppWord = escapeString($builderBody.find('.builder-pp-word').val());
    const ppHtml = escapeString($builderBody.find('.builder-pp-html').val());
    
    const tocDepth = parseInt($builderBody.find('.builder-toc-depth').val()) || 3;
    const tocHeader = escapeString($builderBody.find('.builder-toc-header').val() || 'div');
    const tocClass = escapeString($builderBody.find('.builder-toc-class').val() || 'our-toc');

    const defaultCodesample = $builderBody.find('.builder-default-codesample').is(':checked');
    const defaultRelList = $builderBody.find('.builder-default-rellist').is(':checked');

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
            // Fix for relative paths starting with ..
            let pluginUrl = externalPlugins[p];
            if (pluginUrl.startsWith('..')) {
                pluginUrl = pluginUrl.replace(/^\.\./, '');
            }
            activeExternalPlugins[p] = pluginUrl;
        }
    });
    
    if (Object.keys(activeExternalPlugins).length > 0) {
        configStr += `external_plugins: ${JSON.stringify(activeExternalPlugins)},\n`;
    }
    
    if (toolbar) {
        configStr += `toolbar: '${toolbar}',\n`;
    }
    
    configStr += `height: ${height},\n\n`;
    
    // Advanced
    configStr += `image_caption: ${imageCaption},\n`;
    configStr += `image_uploadtab: ${imageUploadTab},\n`;
    configStr += `powerpaste_word_import: "${ppWord}",\n`;
    configStr += `powerpaste_html_import: "${ppHtml}",\n`;
    configStr += `relative_urls: ${relativeUrls},\n`;
    configStr += `remove_script_host: ${removeScriptHost},\n`;
    configStr += `document_base_url: "${baseUrl}",\n`;
    configStr += `entity_encoding: '${entityEncoding}',\n`;
    configStr += `convert_urls: ${convertUrls},\n\n`;

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
