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
    console.log('change');
    if (container.find(tinyareas).length) {
        tiny_restart(container);
    }
});

function tiny_init(container) {
    let profiles = [];

    container.find(tinyareas).each(function() {
        let $this = $(this);
        let e_id = $this.attr('id');

        profiles.push($this.data('profile'));

        if(tinymce.get(e_id)) {
            $this.removeClass('mce-initialized');
            tinymce.remove('#'+e_id);
        }
    });

    profiles = profiles.filter(function(item, i, ar) {
        return ar.indexOf(item) === i;
    });

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

        if (!options.hasOwnProperty('setup')) {
            options['setup'] = function(editor) {
                editor.on('change', function(e) {
                    $(editor.targetElm).html(editor.getContent());
                })
            };
        }

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
    container.parents('.mblock_wrapper').find('.mce-initialized').removeClass('mce-initialized').show();
    container.parents('.mblock_wrapper').find('.tox.tox-tinymce').remove();
    tiny_init(container.parents('.mblock_wrapper'));
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
