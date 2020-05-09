/**
 * @author mail[at]doerr-softwaredevelopment[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

let tiny_edit = '.tinymce5_profile_edit';


$(document).on('rex:ready', function (event, container) {
    if (container.find(tiny_edit).length) {
        tinymce5_init_edit($(tiny_edit));
    }
});

function tinymce5_init_edit(element) {

    let name = element.find('#tinymce5-name-input');

    if (name.length) {
        name.alphanum({
            allowSpace: false,
            allowUpper: false,
            allowOtherCharSets: false,
            maxLength: 18,
            allow: '_-',
            allowNumeric: true
        });
    }
}
