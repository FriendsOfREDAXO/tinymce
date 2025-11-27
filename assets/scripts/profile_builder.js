
$(document).on('rex:ready', function (event, container) {
    if (container.find('.tinymce_profile_edit').length) {
        initTinyMceProfileAssistant();
    }
});

function initTinyMceProfileAssistant() {
    const $textarea = $('textarea.tinymce-options');
    const $builderContainer = $('<div id="tinymce-profile-assistant" class="panel panel-default" style="display:none; margin-bottom: 20px;"></div>');
    const $builderBody = $('<div class="panel-body"></div>');
    $builderContainer.append($builderBody);
    
    // Toggle Button
    const $toggleBtn = $('<button type="button" class="btn btn-info" style="margin-bottom: 10px;"><i class="rex-icon fa-magic"></i> Profile Assistant</button>');
    $toggleBtn.on('click', function() {
        $builderContainer.slideToggle();
    });
    
    $textarea.before($toggleBtn);
    $textarea.before($builderContainer);

    // Presets
    let presetsHtml = '<h4>Presets</h4><div class="btn-group">';
    presetsHtml += '<button type="button" class="btn btn-default builder-preset-simple">Simple</button>';
    presetsHtml += '<button type="button" class="btn btn-default builder-preset-standard">Standard</button>';
    presetsHtml += '<button type="button" class="btn btn-default builder-preset-full">Full</button>';
    presetsHtml += '</div><hr>';

    // Builder UI
    const pluginsList = [
        'preview', 'searchreplace', 'autolink', 'directionality', 'visualblocks', 'visualchars', 'fullscreen', 
        'image', 'link', 'media', 'codesample', 'table', 'charmap', 'pagebreak', 'nonbreaking', 'anchor', 
        'insertdatetime', 'advlist', 'lists', 'wordcount', 'help', 'emoticons', 'code', 'save'
    ];

    const toolbarButtons = [
        'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 
        'forecolor', 'backcolor', 'removeformat', 'blocks', 'fontfamily', 'fontsize', 
        'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'outdent', 'indent', 'numlist', 'bullist', 
        'table', 'link', 'image', 'media', 'codesample', 'fullscreen', 'preview', 'code', 'help'
    ];

    // Plugins Section
    let pluginsHtml = '<h4>Plugins</h4><div class="row">';
    pluginsList.forEach(plugin => {
        pluginsHtml += `<div class="col-md-3"><label><input type="checkbox" class="builder-plugin" value="${plugin}"> ${plugin}</label></div>`;
    });
    pluginsHtml += '</div><hr>';

    // Toolbar Section
    let toolbarHtml = '<h4>Toolbar</h4><p class="help-block">Click to add items. Drag and drop selected items to reorder.</p>';
    
    // Available Buttons
    toolbarHtml += '<div class="panel panel-default"><div class="panel-heading">Available Items</div><div class="panel-body" id="builder-available-items">';
    toolbarButtons.forEach(btn => {
        toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="${btn}">${btn}</button> `;
    });
    // Add Separator Button
    toolbarHtml += `<button type="button" class="btn btn-default btn-xs builder-toolbar-btn" data-value="|"><strong>| (Separator)</strong></button> `;
    toolbarHtml += '</div></div>';

    // Selected Items (Sortable)
    toolbarHtml += '<div class="panel panel-default"><div class="panel-heading">Selected Toolbar (Drag to reorder)</div><div class="panel-body"><ul id="builder-selected-items" class="list-inline"></ul></div></div>';
    
    // Toolbar Input (Result)
    toolbarHtml += '<div class="form-group"><label>Toolbar String (Result)</label><input type="text" class="form-control builder-toolbar-input" readonly></div>';

    // Common Settings
    let settingsHtml = '<hr><h4>Common Settings</h4><div class="row">';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>Height</label><input type="number" class="form-control builder-height" value="400"></div></div>';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>Language</label><input type="text" class="form-control builder-lang" value="de"></div></div>';
    settingsHtml += '</div>';

    // Advanced Settings
    settingsHtml += '<hr><h4>Advanced Settings</h4><div class="row">';
    
    // Image Options
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-caption" checked> Image Caption</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-image-uploadtab"> Image Upload Tab</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>Media Manager Type</label><input type="text" class="form-control builder-media-type" placeholder="tiny"></div></div>';
    
    // URL Options
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-relative-urls"> Relative URLs</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-remove-script-host" checked> Remove Script Host</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-convert-urls" checked> Convert URLs</label></div></div>';
    
    settingsHtml += '</div><div class="row" style="margin-top:10px;">';
    
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>Document Base URL</label><input type="text" class="form-control builder-base-url" value="/"></div></div>';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>Entity Encoding</label><select class="form-control builder-entity-encoding"><option value="raw" selected>raw</option><option value="named">named</option><option value="numeric">numeric</option></select></div></div>';
    
    settingsHtml += '</div><div class="row">';
    
    // PowerPaste
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>PowerPaste Word Import</label><select class="form-control builder-pp-word"><option value="clean" selected>clean</option><option value="merge">merge</option><option value="prompt">prompt</option></select></div></div>';
    settingsHtml += '<div class="col-md-6"><div class="form-group"><label>PowerPaste HTML Import</label><select class="form-control builder-pp-html"><option value="merge" selected>merge</option><option value="clean">clean</option><option value="prompt">prompt</option></select></div></div>';

    settingsHtml += '</div>';

    // Extras (Codesample, RelList, TOC)
    settingsHtml += '<hr><h4>Extras (Defaults)</h4><div class="row">';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-codesample" checked> Default Codesample Languages</label></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="checkbox"><label><input type="checkbox" class="builder-default-rellist" checked> Default Rel List</label></div></div>';
    settingsHtml += '</div>';

    // TOC Settings
    settingsHtml += '<div class="row" style="margin-top:10px;">';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>TOC Depth</label><input type="number" class="form-control builder-toc-depth" value="3"></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>TOC Header Tag</label><input type="text" class="form-control builder-toc-header" value="div"></div></div>';
    settingsHtml += '<div class="col-md-4"><div class="form-group"><label>TOC Class</label><input type="text" class="form-control builder-toc-class" value="our-toc"></div></div>';
    settingsHtml += '</div>';

    // Apply Button
    let actionsHtml = '<hr><button type="button" class="btn btn-primary builder-apply">Generate JSON</button> <span class="text-muted">Overwrites existing JSON!</span>';

    $builderBody.html(presetsHtml + pluginsHtml + toolbarHtml + settingsHtml + actionsHtml);

    // Styles for Sortable
    const style = document.createElement('style');
    style.innerHTML = `
        #builder-selected-items { min-height: 40px; border: 1px dashed #ccc; padding: 10px; border-radius: 4px; }
        #builder-selected-items li { cursor: move; margin-bottom: 5px; background: #324050; color: #fff; border: 1px solid #202b35; padding: 5px 10px; border-radius: 3px; display: inline-block; }
        #builder-selected-items li:hover { background: #283340; border-color: #000; }
        #builder-selected-items li .remove-item { margin-left: 8px; color: #ff9999; cursor: pointer; font-weight: bold; }
        #builder-selected-items li.placeholder { background: #dff0d8; border: 1px dashed #3c763d; height: 32px; width: 50px; }
    `;
    document.head.appendChild(style);

    // Logic
    const $selectedList = $('#builder-selected-items');
    const $input = $builderBody.find('.builder-toolbar-input');

    function updateInput() {
        const items = [];
        $selectedList.find('li').each(function() {
            items.push($(this).data('value'));
        });
        $input.val(items.join(' '));
    }

    function addItem(value) {
        const $li = $(`<li draggable="true" data-value="${value}">${value} <span class="remove-item">&times;</span></li>`);
        $selectedList.append($li);
        updateInput();
        setupDragEvents($li[0]);
    }

    function clearItems() {
        $selectedList.empty();
        updateInput();
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
        ['undo', 'redo', '|', 'blocks', 'fontsize', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', '|', 'bullist', 'numlist', 'outdent', 'indent', '|', 'link', 'image', 'media', 'table', 'codesample', '|', 'removeformat', 'code', 'fullscreen'].forEach(addItem);
    });

    // Add Item Click
    $builderBody.find('.builder-toolbar-btn').on('click', function() {
        addItem($(this).data('value'));
    });

    // Remove Item Click
    $selectedList.on('click', '.remove-item', function() {
        $(this).parent().remove();
        updateInput();
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
            updateInput();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        $selectedList.find('li').removeClass('over');
    }

    $builderBody.find('.builder-apply').on('click', function() {
        generateJson($textarea, $builderBody);
    });
}

function generateJson($textarea, $builderBody) {
    const plugins = [];
    $builderBody.find('.builder-plugin:checked').each(function() {
        plugins.push($(this).val());
    });

    const toolbar = $builderBody.find('.builder-toolbar-input').val();
    const height = parseInt($builderBody.find('.builder-height').val()) || 400;
    const lang = $builderBody.find('.builder-lang').val() || 'de';

    // Advanced Values
    const imageCaption = $builderBody.find('.builder-image-caption').is(':checked');
    const imageUploadTab = $builderBody.find('.builder-image-uploadtab').is(':checked');
    const mediaType = $builderBody.find('.builder-media-type').val();
    const relativeUrls = $builderBody.find('.builder-relative-urls').is(':checked');
    const removeScriptHost = $builderBody.find('.builder-remove-script-host').is(':checked');
    const convertUrls = $builderBody.find('.builder-convert-urls').is(':checked');
    
    const baseUrl = $builderBody.find('.builder-base-url').val();
    const entityEncoding = $builderBody.find('.builder-entity-encoding').val();
    const ppWord = $builderBody.find('.builder-pp-word').val();
    const ppHtml = $builderBody.find('.builder-pp-html').val();
    
    const tocDepth = parseInt($builderBody.find('.builder-toc-depth').val()) || 3;
    const tocHeader = $builderBody.find('.builder-toc-header').val() || 'div';
    const tocClass = $builderBody.find('.builder-toc-class').val() || 'our-toc';

    const defaultCodesample = $builderBody.find('.builder-default-codesample').is(':checked');
    const defaultRelList = $builderBody.find('.builder-default-rellist').is(':checked');

    // Build the configuration string manually to match the "pro" format (raw JS object body)
    let configStr = '';
    
    configStr += "license_key: 'gpl',\n";
    configStr += `language: '${lang}',\n`;
    configStr += "branding: false,\n";
    configStr += "statusbar: true,\n";
    configStr += "menubar: true,\n";
    
    if (mediaType) {
        configStr += `tinymce_media_type: '${mediaType}',\n`;
    }

    if (plugins.length > 0) {
        configStr += `plugins: '${plugins.join(' ')}',\n`;
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
 {title: 'Keine', value: ''},
 {title: 'Nofollow', value: 'nofollow'}
],\n`;
    }

    configStr += `toc_depth: ${tocDepth},\n`;
    configStr += `toc_header: "${tocHeader}",\n`;
    configStr += `toc_class: "${tocClass}",\n\n`;

    // Raw JS expressions
    configStr += 'skin: redaxo.theme.current === "dark" ? "oxide-dark" : "oxide",\n';
    configStr += 'content_css: redaxo.theme.current === "dark" ? "dark" : "default",\n';
    
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
