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

            let linkMap = openLinkMap('', '&clang=' + clang);

            $(linkMap).on('rex:selectLink', function (event, linkurl, linktext) {
                event.preventDefault();
                linkMap.close();

                callback(linkurl, {alt: '', text: linktext});
            });
        }

        /* Provide image and alt text for the image dialog */
        if (meta.filetype === 'image') {
            let media_type = '';
            let mediaPool = openREXMedia('tinymce5_medialink', '&args[types]=jpg%2Cjpeg%2Cpng%2Cgif%2Cbmp%2Ctiff%2Csvg'),
                mediaPath = '/media/'; //'/index.php?rex_media_type=' + media_type + '&rex_media_file=';

            if (typeof media_type === 'undefined') {
                if (typeof media_path === 'undefined') {
                    mediaPath = '/media/';
                } else {
                    mediaPath = media_path;
                }
            }

            const mediaSrcPath = (!typeof media_type === 'undefined') ? mediaManagerPath : mediaPath;

            $(mediaPool).on('rex:selectMedia', function (event, filename) {
                event.preventDefault();
                mediaPool.close();
                callback(mediaSrcPath + filename, {alt: ''});
            });
        }
        /* Provide alternative source and posted for the media dialog */
        // if (meta.filetype === 'media') {
        //     callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
        // }
    };

let tiny5areas = '.tiny5-editor';

$(document).on('rex:ready', function (e, container) {
    container.find(tiny5areas).each(function () {
        tiny5_init($(this));
    });
});

function tiny5_init(element) {
    let options = {},
        profile = element.data('profile');

    if (typeof profile === 'undefined' || !profile) {

    } else {
        if (profile in tiny5profiles) {
            options = tiny5profiles[profile];
        }
        let unique = 'tiny5' + Math.floor(Math.random() * 26) + Date.now();
        element.attr('id', unique);
        options['selector'] = '#' + unique;
    }

    tinymce.init(options);
}