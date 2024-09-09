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
        let media_type = '';
        let mediaPool = openREXMedia('tinymce_medialink', '&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg%2Cwebp'),
            mediaPath = '/media/'; //'/index.php?rex_media_type=' + media_type + '&rex_media_file=';

        if (typeof media_type === 'undefined') {
            if (typeof media_path === 'undefined') {
                mediaPath = '/media/';
            } else {
                mediaPath = media_path;
            }
        }

        $(mediaPool).on('rex:selectMedia', function (event, filename) {
            event.preventDefault();
            mediaPool.close();
            callback(mediaPath + filename, {alt: ''});
        });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
        // callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
        let mediaPool = openREXMedia('tinymce_medialink', '&args[types]=mp4%2Cmpeg'),
            mediaPath = '/media/';//'/index.php?rex_media_type=' + media_type + '&rex_media_file=';

        $(mediaPool).on('rex:selectMedia', function (event, filename) {
            event.preventDefault();
            mediaPool.close();
            callback(mediaPath + filename, {alt: ''});
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
                branding: false,
                plugins: 'autoresize'
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
