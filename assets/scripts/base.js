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

            // Mediapool-Metadaten holen (med_alt, Title) und Alt-Text vorbefuellen.
            // Schlaegt der Request fehl, wird leer als Alt uebergeben - wie zuvor.
            $.getJSON(
                'index.php?rex-api-call=tinymce_media_meta&file=' + encodeURIComponent(filename)
            ).done(function (meta) {
                var alt = (meta && meta.alt) ? meta.alt : '';
                callback(imagePath, { alt: alt });
            }).fail(function () {
                callback(imagePath, { alt: '' });
            });
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

function getConfiguredTinyAssetPrefix() {
    let basePath = null;
    if (typeof rex !== 'undefined' && rex && typeof rex.tinyAssetBasePath === 'string') {
        basePath = rex.tinyAssetBasePath;
    } else if (typeof tinyAssetBasePath !== 'undefined' && typeof tinyAssetBasePath === 'string') {
        basePath = tinyAssetBasePath;
    }

    if (basePath === null) {
        return null;
    }

    if (basePath === '') {
        return null;
    }

    // Ignore relative values like "../assets/..." because extracting a prefix
    // from them would yield ".." and break absolute plugin URLs.
    if (basePath.charAt(0) !== '/') {
        return null;
    }

    let marker = '/assets/addons/tinymce';
    let idx = basePath.indexOf(marker);
    if (idx === -1) {
        return null;
    }

    return basePath.substring(0, idx);
}

function getConfiguredTinyPluginBase() {
    if (typeof rex !== 'undefined' && rex && typeof rex.tinyPluginBasePath === 'string' && rex.tinyPluginBasePath !== '') {
        return rex.tinyPluginBasePath;
    }

    if (typeof tinyPluginBasePath !== 'undefined' && typeof tinyPluginBasePath === 'string' && tinyPluginBasePath !== '') {
        return tinyPluginBasePath;
    }

    return null;
}

function getTinyAssetPrefix() {
    let configuredPrefix = getConfiguredTinyAssetPrefix();
    // Only short-circuit for non-empty prefixes. Empty prefix is ambiguous
    // and may come from misconfigured server base paths on subfolder installs.
    if (configuredPrefix !== null && configuredPrefix !== '') {
        return configuredPrefix;
    }

    // Derive prefix from loaded TinyMCE assets (e.g. /test_tiny/assets/...).
    let selectors = [
        'script[src*="/assets/addons/tinymce/"]',
        'link[href*="/assets/addons/tinymce/"]'
    ];

    for (let i = 0; i < selectors.length; i++) {
        let nodes = document.querySelectorAll(selectors[i]);
        for (let j = 0; j < nodes.length; j++) {
            let attrName = nodes[j].tagName.toLowerCase() === 'link' ? 'href' : 'src';
            let raw = nodes[j].getAttribute(attrName);
            if (!raw) {
                continue;
            }

            try {
                let url = new URL(raw, window.location.origin);
                let idx = url.pathname.indexOf('/assets/addons/tinymce/');
                if (idx !== -1) {
                    return url.pathname.substring(0, idx);
                }
            } catch (e) {
                // ignore malformed URLs
            }
        }
    }

    // If configured prefix was explicitly empty and we did not detect better data,
    // keep it as final fallback for root installs.
    if (configuredPrefix === '') {
        return '';
    }

    // Fallback: use first path segment from current location (common subfolder setup).
    let parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
        return '/' + parts[0];
    }

    return '';
}

function normalizeTinyAssetUrl(url, prefix) {
    if (typeof url !== 'string' || url === '') {
        return url;
    }

    if (/^data:/.test(url)) {
        return url;
    }

    // For same-origin absolute URLs, normalize by pathname and keep query/hash.
    if (/^(?:https?:)?\/\//.test(url)) {
        try {
            let abs = new URL(url, window.location.origin);
            if (abs.origin === window.location.origin) {
                if (abs.pathname.indexOf('/assets/') === 0 && prefix !== '') {
                    abs.pathname = prefix + abs.pathname;
                }
                return abs.pathname + abs.search + abs.hash;
            }
        } catch (e) {
            return url;
        }

        // Keep external absolute URLs untouched.
        return url;
    }

    // Normalize known asset variants to /assets/... first.
    let normalized = url
        .replace(/^\.\.\/assets\//, '/assets/')
        .replace(/^assets\//, '/assets/');

    // For subfolder installations, rewrite /assets/... to /subfolder/assets/...
    if (normalized.indexOf('/assets/') === 0 && prefix !== '') {
        return prefix + normalized;
    }

    return normalized;
}

function forceCanonicalTinyPluginUrls(externalPlugins, prefix) {
    if (!externalPlugins || typeof externalPlugins !== 'object') {
        return externalPlugins;
    }

    let configuredPluginBase = getConfiguredTinyPluginBase();
    if (configuredPluginBase && prefix !== '' && configuredPluginBase.indexOf('/assets/') === 0) {
        configuredPluginBase = prefix + configuredPluginBase;
    }

    let canonicalBase = configuredPluginBase ? (configuredPluginBase.replace(/\/+$/, '') + '/') : ((prefix ? prefix : '') + '/assets/addons/tinymce/scripts/tinymce/plugins/');
    let rewritten = {};

    for (let pluginName in externalPlugins) {
        if (!Object.prototype.hasOwnProperty.call(externalPlugins, pluginName)) {
            continue;
        }

        let rawUrl = externalPlugins[pluginName];
        if (typeof rawUrl !== 'string' || rawUrl === '') {
            rewritten[pluginName] = rawUrl;
            continue;
        }

        let normalized = normalizeTinyAssetUrl(rawUrl, prefix);
        let isTinyAddonPluginUrl = normalized.indexOf('/assets/addons/tinymce/') !== -1 || normalized.indexOf('/tinymce/plugins/') !== -1;

        if (!isTinyAddonPluginUrl) {
            rewritten[pluginName] = normalized;
            continue;
        }

        let query = '';
        let hash = '';
        try {
            let parsed = new URL(normalized, window.location.origin);
            query = parsed.search;
            hash = parsed.hash;
        } catch (e) {
            let queryPos = normalized.indexOf('?');
            let hashPos = normalized.indexOf('#');
            if (queryPos !== -1) {
                query = hashPos !== -1 ? normalized.substring(queryPos, hashPos) : normalized.substring(queryPos);
            }
            if (hashPos !== -1) {
                hash = normalized.substring(hashPos);
            }
        }

        rewritten[pluginName] = canonicalBase + pluginName + '/plugin.min.js' + query + hash;
    }

    return rewritten;
}

function releaseTinyDialogScrollLock() {
    document.documentElement.classList.remove('tox-dialog__disable-scroll');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-y');

    document.body.classList.remove('tox-dialog__disable-scroll');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-y');
}

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
let tinyEditorSequence = 0;

function ensureTinyEditorId($elm) {
    let editorId = $elm.attr('id');
    if (editorId) {
        return editorId;
    }

    do {
        tinyEditorSequence += 1;
        editorId = 'tiny-editor-' + tinyEditorSequence;
    } while (document.getElementById(editorId));

    $elm.attr('id', editorId);

    return editorId;
}

function saveTinyEditorContent() {
    if (typeof tinymce === 'undefined' || !tinymce.editors || tinymce.editors.length === 0) {
        return;
    }
    
    // Simply save all current content to their textareas or divs
    // This way it's preserved when DOM is reorganized
    try {
        tinymce.editors.forEach(function(editor) {
            if (editor && editor.targetElm) {
                let $elm = $(editor.targetElm);
                let content = editor.getContent();
                
                // ============================================
                // FIX: Universelle LÃ¶sung fÃ¼r textarea UND div
                // ============================================
                if ($elm.is('textarea')) {
                    $elm.val(content);
                } else {
                    $elm.html(content);
                }
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
    let profiles = {};

    container.find(tinyareas).each(function() {
        let $this = $(this);
        let e_id = ensureTinyEditorId($this);

        // Skip if already initialized
        if ($this.hasClass('mce-initialized')) {
            return true;
        }

        let profileName = $this.data('profile');
        if (!profiles[profileName]) {
            profiles[profileName] = [];
        }
        profiles[profileName].push(e_id);

        // ============================================
        // FIX: Content VOR Init bereinigen
        // Entferne Ã¤uÃŸere <p>-Tags und leere <p> am Anfang/Ende
        // ============================================
        let currentContent = '';
        if ($this.is('textarea')) {
            currentContent = $this.val();
        } else {
            currentContent = $this.html();
        }
        
        // Trimme Whitespace am Anfang und Ende
        currentContent = currentContent.trim();
        
        // Entferne mehrere aufeinanderfolgende leere <p>-Tags am Anfang
        currentContent = currentContent.replace(/^(<p[^>]*>\s*<\/p>)+/i, '');
        
        // Entferne mehrere aufeinanderfolgende leere <p>-Tags am Ende
        currentContent = currentContent.replace(/(<p[^>]*>\s*<\/p>)+$/i, '');
        
        // Entferne NUR die Ã¤uÃŸersten <p>-Tags wenn der ganze Content darin ist
        // Pattern: ^<p...>content</p>$ aber NICHT wenn mehrere <p> mit Content existieren
        let pTagMatch = currentContent.match(/^<p[^>]*>(.*)<\/p>$/is);
        
        if (pTagMatch) {
            // Es ist ein einzelner <p>-Tag um alles
            let innerContent = pTagMatch[1];
            
            // PrÃ¼fe, ob der innere Content nicht mit <p> beginnt/endet
            // Wenn nicht, dann waren die Ã¤uÃŸeren Tags redundant
            if (!innerContent.match(/^<p/i) && !innerContent.match(/<\/p>$/i)) {
                // Nicht mehrstÃ¶ckig - entferne die Ã¤uÃŸeren Tags
                currentContent = innerContent;
            }
        }
        
        // ============================================
        // FIX: Speichere zurÃ¼ck - universell fÃ¼r textarea und div
        // ============================================
        if ($this.is('textarea')) {
            $this.val(currentContent);
        } else {
            $this.html(currentContent);
        }

        // Remove existing TinyMCE instance if it exists
        if(tinymce.get(e_id)) {
            $this.removeClass('mce-initialized');
            tinymce.remove('#'+e_id);
        }
    });

    // If no profiles found, skip initialization
    if (Object.keys(profiles).length === 0) {
        return;
    }

    Object.keys(profiles).forEach(function(profile) {
        let editorIds = profiles[profile];

        let options = {};
        if (profile in tinyprofiles) {
            // Shallow copy to avoid mutating the shared tinyprofiles cache.
            // Without this, repeated calls (e.g., multiple editors with the same
            // profile) would accumulate style_formats on the global object, causing
            // duplicated entries in the Styles dropdown.
            options = Object.assign({}, tinyprofiles[profile]);
        } else {
            options = {
                license_key: 'gpl',
                branding: false,
                plugins: 'autoresize'
            }
        }

        if (!options.hasOwnProperty('convert_newlines_to_brs')) {
            options.convert_newlines_to_brs = false;
        }
        if (!options.hasOwnProperty('remove_trailing_brs')) {
            options.remove_trailing_brs = true;
        }

        // Use the full link dialog (with REDAXO internal picker) instead of
        // TinyMCE's quicklink bubble unless a profile explicitly opts in.
        if (!options.hasOwnProperty('link_quicklink')) {
            options.link_quicklink = false;
        }

        // TinyMCE's default quickbars selection toolbar uses "quicklink".
        // Replace it with "link" so selecting text opens the full dialog.
        if (!options.hasOwnProperty('quickbars_selection_toolbar')) {
            options.quickbars_selection_toolbar = 'bold italic | link h2 h3 blockquote';
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
        
        let tinyAssetPrefix = getTinyAssetPrefix();
        let normalizedExternalPluginsSource = {};
        for (let pluginName in externalPluginsSource) {
            if (Object.prototype.hasOwnProperty.call(externalPluginsSource, pluginName)) {
                normalizedExternalPluginsSource[pluginName] = normalizeTinyAssetUrl(
                    externalPluginsSource[pluginName],
                    tinyAssetPrefix
                );
            }
        }
        
        if (Object.keys(normalizedExternalPluginsSource).length > 0) {
            if (!options.hasOwnProperty('external_plugins')) {
                options['external_plugins'] = {};
            }
            // Merge registered external plugins (profile-specific ones take precedence)
            options['external_plugins'] = Object.assign({}, normalizedExternalPluginsSource, options['external_plugins']);
        }

        // Also normalize any path variants in profile-defined external plugins.
        if (options['external_plugins']) {
            for (let pluginName in options['external_plugins']) {
                if (typeof options['external_plugins'][pluginName] === 'string') {
                    options['external_plugins'][pluginName] = normalizeTinyAssetUrl(
                        options['external_plugins'][pluginName],
                        tinyAssetPrefix
                    );
                }
            }

            // Final safety-net: enforce canonical TinyMCE addon plugin paths.
            options['external_plugins'] = forceCanonicalTinyPluginUrls(options['external_plugins'], tinyAssetPrefix);
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
                
                // Register all formats so they work when applied.
                // Only include defined properties in the spec â€“ passing undefined values
                // can confuse TinyMCE's internal format detection logic.
                editor.on('init', function() {
                    function registerFormats(formats) {
                        formats.forEach(function(format) {
                            if (format.items) {
                                registerFormats(format.items);
                            } else if (format.inline || format.block || format.selector) {
                                let formatName = format.name || format.format || 'custom-' + format.title.toLowerCase().replace(/\s+/g, '-');
                                let spec = {};
                                ['inline', 'block', 'selector', 'classes', 'styles', 'attributes', 'wrapper', 'exact', 'collapse', 'split', 'deep', 'expand', 'remove', 'mixed'].forEach(function(key) {
                                    if (format[key] !== undefined && format[key] !== null) {
                                        spec[key] = format[key];
                                    }
                                });
                                editor.formatter.register(formatName, spec);
                            }
                        });
                    }
                    registerFormats(options.style_formats);
                });
            }
            
            // ============================================
            // FIX: Set up correct change handler
            // Universelle LÃ¶sung fÃ¼r TEXTAREA und DIV
            // ============================================
            editor.on('change', function(e) {
                let $elm = $(editor.targetElm);
                let content = editor.getContent();
                
                // Speichere den Content im richtigen Format
                if ($elm.is('textarea')) {
                    // FÃ¼r textarea: .val() verwenden
                    $elm.val(content);
                } else {
                    // FÃ¼r div/contenteditable: .html() verwenden
                    $elm.html(content);
                }
            });

            // Fix: TinyMCE setzt beim Oeffnen von Dialogen Scroll-Locks auf html/body.
            // Wenn diese haengen bleiben, wirkt es so, als ob der Editor verschwindet
            // und die Seite nicht mehr scrollt.
            editor.on('OpenWindow', function() {
                window.setTimeout(function() {
                    let hasVisibleDialog = !!document.querySelector('.tox-dialog-wrap, .tox-dialog, .tox-tinymce-aux .tox-dialog');
                    if (!hasVisibleDialog) {
                        releaseTinyDialogScrollLock();
                    }
                }, 0);
            });

            editor.on('CloseWindow', function() {
                releaseTinyDialogScrollLock();
            });
            // Filter padding nodes (leere <p>-Tags) beim Speichern und für den Quelltext-Dialog.
            // TinyMCE fügt intern leere <p> an den Rändern für den Cursor ein.
            editor.on('GetContent', function (e) {
                // Betrifft standard html format, source_view (code plugin) etc.
                // Ersetzt <p></p>, <p>&nbsp;</p>, <p><br></p> und Whitespace.
                e.content = e.content.replace(/^(\s*<p[^>]*>\s*(?:&nbsp;|\u00a0|<br\/?>)?\s*<\/p>\s*)+/gi, '');
                e.content = e.content.replace(/(\s*<p[^>]*>\s*(?:&nbsp;|\u00a0|<br\/?>)?\s*<\/p>\s*)+$/gi, '');
            });            
            // Call original setup if it existed
            if (originalSetup && typeof originalSetup === 'function') {
                originalSetup(editor);
            }
        };

        if (!options.hasOwnProperty('selector')) {
            options['selector'] = editorIds.map(function(editorId) {
                return '#' + editorId;
            }).join(', ');
        }

        tinymce.init(options).then(function(editors) {
            for(let i in editors) {
                $(editors[i].targetElm).addClass('mce-initialized');
            }
        });
    });
}

function tiny_restart(container) {
    // Speichere Content vor dem Restart
    saveTinyEditorContent();
    
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



function openMyLinkMap(id, param, value)
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