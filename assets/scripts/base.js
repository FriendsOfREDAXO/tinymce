let rex5_picker_function = function (callback, value, meta) {
    if (meta.filetype === 'file') {
        // use query parameter clang
        let url = location.search,
            clang = 1, // default 1
            query_string = url.substring(url.indexOf('?') + 1).split('&');
        for (let i = 0, result = {}; i < query_string.length; i++) {
            query_string[i] = query_string[i].split('=');
            if (query_string[i][0] === 'clang') {
                clang = query_string[i][1]; // set by url
                break;
            }
        }

        let linkMap = openMyLinkMap('', '&clang=' + clang, value);

        $(linkMap).on('rex:selectLink', function (event, linkurl, linktext) {
            event.preventDefault();
            linkMap.close();

            callback(linkurl, {alt: '', text: linktext});
        });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === 'image') {
        let mediaPool = openREXMedia('tinymce_medialink', '&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg%2Cwebp');

        $(mediaPool).on('rex:selectMedia', function (event, filename) {
            event.preventDefault();
            mediaPool.close();
            
            // use media manager for raster images, direct path for SVG/TIFF/BMP
            var extension = filename.split('.').pop().toLowerCase();
            var useMediaManager = ['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(extension) !== -1;
            var imagePath = useMediaManager ? '/media/tiny/' + filename : '/media/' + filename;
            callback(imagePath, {alt: ''});
        });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
        let mediaPool = openREXMedia('tinymce_medialink', '&args[types]=mp4%2Cmpeg');

        $(mediaPool).on('rex:selectMedia', function (event, filename) {
            event.preventDefault();
            mediaPool.close();
            
            // use direct media path for video/audio files
            callback('/media/' + filename, {alt: ''});
        });
    }
};

let tinyareas = '.tiny-editor';

$(document).on('rex:ready', function (e, container) {
    if (container.find(tinyareas).length) {
        tiny_init(container);
    }
});

$(document).on('rex:change', function (e, container) {
    if (container.find(tinyareas).length) {
        tiny_restart(container);
    }
});

// Handle dynamically added content (e.g., from yform inline relations)
$(document).on('rex:ready', function (e, container) {
    if (container.find(tinyareas).length) {
        tiny_init(container);
    }
});

// Store TinyMCE content before DOM manipulation (move up/down in relations)
let tinyEditorCache = {};
let tinyRestoringContent = false;

function saveTinyEditorContent() {
    if (typeof tinymce === 'undefined' || !tinymce.editors || tinymce.editors.length === 0) {
        return;
    }
    
    // Simply save all current content to their textareas
    // This way it's preserved when DOM is reorganized
    try {
        tinymce.editors.forEach(function(editor) {
            if (editor && editor.targetElm) {
                let $textarea = $(editor.targetElm);
                let content = editor.getContent();
                $textarea.val(content);
            }
        });
    } catch (e) {
        // Silent fail - editors may be destroyed
    }
}

// Hook into yform relation move events (only, not mblock)
// This prevents conflicts with mblock which has its own event system
$(document).on('click', '[data-yform-be-relation-moveup], [data-yform-be-relation-movedown]', function(e) {
    // Skip if inside mblock - mblock has its own handlers
    if ($(this).closest('.mblock_wrapper').length > 0) {
        return;
    }
    
    // Find the container that will be moved
    let $container = $(this).closest('[data-yform-be-relation-item]');
    
    // Save content from current editors BEFORE yform reorganizes DOM
    saveTinyEditorContent();
    
    // After yform reorganizes DOM (small delay to ensure DOM is updated),
    // re-initialize TinyMCE in the affected container
    setTimeout(function() {
        if ($container.length > 0) {
            tiny_restart($container);
        }
    }, 100);
});

function tiny_init(container) {
    let profiles = [];

    container.find(tinyareas).each(function() {
        let $this = $(this);
        let e_id = $this.attr('id');

        // Skip if already initialized
        if ($this.hasClass('mce-initialized')) {
            return true;
        }

        profiles.push($this.data('profile'));

        // Remove existing TinyMCE instance if it exists
        if(tinymce.get(e_id)) {
            $this.removeClass('mce-initialized');
            tinymce.remove('#'+e_id);
        }
    });

    // Filter duplicate profiles
    profiles = profiles.filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
    });

    // If no profiles found, skip initialization
    if (profiles.length === 0) {
        return;
    }

    profiles.forEach(function(profile) {
        let options = {};
        if (profile in tinyprofiles) {
            options = tinyprofiles[profile];
        } else {
            options = {
                license_key: 'gpl',
                branding: false,
                plugins: 'autoresize'
            }
        }

        // IMPORTANT: Merge global options FIRST before any other processing
        // This ensures style_formats are available when TinyMCE registers the 'styles' button
        if (typeof rex !== 'undefined' && rex.tinyGlobalOptions) {
            let globalOpts = rex.tinyGlobalOptions;
            
            // Helper function to check if a Style-Set applies to this profile
            // Empty profiles array means it applies to ALL profiles
            function appliesToProfile(profilesList) {
                if (!profilesList || profilesList.length === 0) {
                    return true; // Empty = applies to all profiles
                }
                return profilesList.indexOf(profile) !== -1;
            }
            
            // Merge content_css (array) - filter by profile
            // New format: [{url: "...", profiles: ["uikit", "bootstrap"]}]
            // Legacy format: ["url1", "url2"]
            if (globalOpts.content_css && globalOpts.content_css.length > 0) {
                let filteredCss = [];
                globalOpts.content_css.forEach(function(item) {
                    if (typeof item === 'string') {
                        // Legacy format - always include
                        filteredCss.push(item);
                    } else if (item.url && appliesToProfile(item.profiles)) {
                        // New format with profile filter
                        filteredCss.push(item.url);
                    }
                });
                
                if (filteredCss.length > 0) {
                    if (!options.content_css) {
                        options.content_css = filteredCss;
                    } else if (typeof options.content_css === 'string') {
                        // Profile CSS at the end to override global styles
                        options.content_css = filteredCss.concat([options.content_css]);
                    } else {
                        // Profile CSS array at the end to override global styles
                        options.content_css = filteredCss.concat(options.content_css);
                    }
                }
            }
            
            // Merge content_style (string) - fixes focus outlines for UIkit/Bootstrap
            if (globalOpts.content_style) {
                if (!options.content_style) {
                    options.content_style = globalOpts.content_style;
                } else {
                    // Append global styles to existing content_style
                    options.content_style = globalOpts.content_style + ' ' + options.content_style;
                }
            }
            
            // Merge style_formats - filter by profile
            // New format: [{format: {...}, profiles: ["uikit"]}]
            // Legacy format: [{title: "...", items: [...]}]
            if (globalOpts.style_formats && globalOpts.style_formats.length > 0) {
                let filteredFormats = [];
                globalOpts.style_formats.forEach(function(item) {
                    if (item.format && appliesToProfile(item.profiles)) {
                        // New format with profile filter
                        filteredFormats.push(item.format);
                    } else if (item.title) {
                        // Legacy format (has title = is a format group) - always include
                        filteredFormats.push(item);
                    }
                });
                
                if (filteredFormats.length > 0) {
                    // Enable merging with default formats (Headings, Inline, Blocks, Align)
                    options.style_formats_merge = true;
                    
                    if (!options.style_formats) {
                        options.style_formats = [];
                    }
                    // Append filtered style formats to existing ones
                    options.style_formats = options.style_formats.concat(filteredFormats);
                    
                    // Replace 'styles' with 'stylesets' in toolbar (our custom button)
                    if (options.toolbar && typeof options.toolbar === 'string') {
                        // Replace existing 'styles' with 'stylesets'
                        options.toolbar = options.toolbar.replace(/\bstyles\b/g, 'stylesets');
                        // If neither exists, add stylesets at the beginning
                        if (options.toolbar.indexOf('stylesets') === -1) {
                            options.toolbar = 'stylesets ' + options.toolbar;
                        }
                    }
                    
                    // Add stylesets to Format menu
                    if (!options.menu) {
                        options.menu = {};
                    }
                    options.menu.format = {
                        title: 'Format',
                        items: 'bold italic underline strikethrough superscript subscript codeformat | stylesets blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat'
                    };
                    
                }
            }
        }

        // Merge external plugins from PluginRegistry into profile options
        // First try rex.tinyExternalPlugins (set via PHP at runtime), fallback to global tinyExternalPlugins from profiles.js
        let externalPluginsSource = (typeof rex !== 'undefined' && rex.tinyExternalPlugins) ? rex.tinyExternalPlugins : 
                                    (typeof tinyExternalPlugins !== 'undefined' ? tinyExternalPlugins : {});
        
        // Fix relative paths: replace ../assets/ with /assets/ for absolute paths
        for (let pluginName in externalPluginsSource) {
            if (typeof externalPluginsSource[pluginName] === 'string') {
                externalPluginsSource[pluginName] = externalPluginsSource[pluginName].replace(/^\.\.\/assets\//, '/assets/');
            }
        }
        
        if (Object.keys(externalPluginsSource).length > 0) {
            if (!options.hasOwnProperty('external_plugins')) {
                options['external_plugins'] = {};
            }
            // Merge registered external plugins (profile-specific ones take precedence)
            options['external_plugins'] = Object.assign({}, externalPluginsSource, options['external_plugins']);
        }
        
        // Also fix any relative paths in existing external_plugins from profile
        if (options['external_plugins']) {
            for (let pluginName in options['external_plugins']) {
                if (typeof options['external_plugins'][pluginName] === 'string') {
                    options['external_plugins'][pluginName] = options['external_plugins'][pluginName].replace(/^\.\.\/assets\//, '/assets/');
                }
            }
        }

        // Store the original setup function if it exists
        let originalSetup = options['setup'] || null;
        
        // Create a new setup function that handles editor events and calls the original
        options['setup'] = function(editor) {
            // Register custom Style-Sets button and menu item
            if (options.style_formats && options.style_formats.length > 0) {
                
                // Helper function to build menu items recursively
                function buildMenuItems(formats) {
                    let items = [];
                    formats.forEach(function(format) {
                        if (format.items) {
                            // It's a submenu/group
                            items.push({
                                type: 'nestedmenuitem',
                                text: format.title,
                                getSubmenuItems: function() {
                                    return buildMenuItems(format.items);
                                }
                            });
                        } else {
                            // It's a format item
                            let formatName = format.name || format.format || 'custom-' + format.title.toLowerCase().replace(/\s+/g, '-');
                            items.push({
                                type: 'togglemenuitem',
                                text: format.title,
                                onAction: function() {
                                    editor.formatter.toggle(formatName);
                                },
                                onSetup: function(api) {
                                    let callback = function() {
                                        api.setActive(editor.formatter.match(formatName));
                                    };
                                    editor.on('NodeChange', callback);
                                    return function() {
                                        editor.off('NodeChange', callback);
                                    };
                                }
                            });
                        }
                    });
                    return items;
                }
                
                // Register toolbar button 'stylesets'
                editor.ui.registry.addMenuButton('stylesets', {
                    text: 'Styles',
                    tooltip: 'Style-Sets',
                    fetch: function(callback) {
                        callback(buildMenuItems(options.style_formats));
                    }
                });
                
                // Register menu item 'stylesets' for Format menu
                editor.ui.registry.addNestedMenuItem('stylesets', {
                    text: 'Style-Sets',
                    getSubmenuItems: function() {
                        return buildMenuItems(options.style_formats);
                    }
                });
                
                // Register all formats so they work when applied
                editor.on('init', function() {
                    function registerFormats(formats) {
                        formats.forEach(function(format) {
                            if (format.items) {
                                registerFormats(format.items);
                            } else if (format.inline || format.block || format.selector) {
                                let formatName = format.name || format.format || 'custom-' + format.title.toLowerCase().replace(/\s+/g, '-');
                                editor.formatter.register(formatName, {
                                    inline: format.inline,
                                    block: format.block,
                                    selector: format.selector,
                                    classes: format.classes,
                                    styles: format.styles,
                                    attributes: format.attributes,
                                    wrapper: format.wrapper
                                });
                            }
                        });
                    }
                    registerFormats(options.style_formats);
                });
            }
            
            // Set up default change handler
            editor.on('change', function(e) {
                $(editor.targetElm).html(editor.getContent());
            });
            
            // Call original setup if it existed
            if (originalSetup && typeof originalSetup === 'function') {
                originalSetup(editor);
            }
        };

        if (!options.hasOwnProperty('selector')) {
            options['selector'] = '.tiny-editor[data-profile="' + profile + '"]:not(.mce-initialized)';
        }

        tinymce.init(options).then(function(editors) {
            for(let i in editors) {
                $(editors[i].targetElm).addClass('mce-initialized');
            }
        });
    });
}

function tiny_restart(container) {
    // Don't restart during content restoration to avoid conflicts
    if (tinyRestoringContent) {
        return;
    }
    
    // For inline relations in yform, we need to find the parent wrapper differently
    let $wrapper = container;
    
    // Try to find yform-be-relation-wrapper parent (for inline relations)
    if (container.closest('[data-yform-be-relation-form]').length) {
        $wrapper = container.closest('[data-yform-be-relation-form]');
    }
    // Try to find mblock_wrapper parent (for mblock scenarios)
    else if (container.parents('.mblock_wrapper').length) {
        $wrapper = container.parents('.mblock_wrapper');
    }
    
    // Only restart TinyMCE in the affected wrapper, not globally
    // This prevents restarting unrelated editors
    let $editorsInWrapper = $wrapper.find('.tiny-editor');
    
    // Clean up existing TinyMCE instances in this wrapper
    $editorsInWrapper.each(function() {
        let e_id = $(this).attr('id');
        if (e_id && tinymce.get(e_id)) {
            tinymce.remove('#' + e_id);
        }
        $(this).removeClass('mce-initialized');
    });
    
    // Remove TinyMCE UI elements in this wrapper
    $wrapper.find('.tox.tox-tinymce').remove();
    
    // Re-initialize TinyMCE only in this wrapper
    tiny_init($wrapper);
}

// Validate and fix TinyMCE instances that may have lost DOM references
function validateTinyEditors() {
    if (typeof tinymce === 'undefined' || !tinymce.editors || tinymce.editors.length === 0) {
        return;
    }
    
    try {
        // Check for orphaned editors (target no longer in DOM)
        tinymce.editors.forEach(function(editor) {
            if (!editor || !editor.targetElm || !document.contains(editor.targetElm)) {
                if (editor) {
                    editor.remove();
                }
            }
        });
    } catch (e) {
        // Silent fail
    }
}



function openMyLinkMap(id, param,value)
{
    if (typeof(id) == 'undefined') {
        id = '';
    }

    if (typeof(param) == 'undefined') {
        param = '';
    }

    if (typeof(value) != 'undefined' && value.indexOf('/media') > -1) {
        return newLinkMapWindow('index.php?page=mediapool/media&addon=tiny&opener_input_field=REX_MEDIA_tinymce_medialink');
    } else {
        return newLinkMapWindow('index.php?page=insertlink&opener_input_field=' + id + param);
    }
}
