
let tiny_edit = '.tinymce_profile_edit';


$(document).on('rex:ready', function (event, container) {
    if (container.find(tiny_edit).length) {
        tinymce_init_edit($(tiny_edit));

        setTimeout(function() {
            let editor = document.querySelector('textarea.form-control.tinymce-options');
            if (editor.nextElementSibling.classList.contains('CodeMirror')) {
                cm = editor.nextElementSibling.CodeMirror;
                cm.on('change', (args) => {
                    tinymceValidateJson(editor, cm.getValue());
                });
            } else {
                editor = document.querySelector('textarea.form-control.tinymce-options');
                if (editor) {
                    editor.addEventListener('change', (event) => {
                        tinymceValidateJson(editor, event.target.value);
                    });
                }
            }
        }, 1000);
    }
});

function tinymce_init_edit(element) {

    let name = element.find('#tinymce-name-input');

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

function tinymceValidateJson(editor, json)
{
    const label = editor.closest('dl').firstElementChild;
    let validInfo = document.getElementById('tinymce-valid-info');
    if (null === validInfo) {
        validInfo = document.createElement('p');
    }
    validInfo.setAttribute('id', 'tinymce-valid-info');
    if (false === isJsonString(json)) {
        validInfo.classList.remove('text-success');
        validInfo.classList.add('text-danger');
        validInfo.textContent = 'Json is not valid';
    } else {
        validInfo.classList.remove('text-danger');
        validInfo.classList.add('text-success');
        validInfo.textContent = 'Json is valid';
    }
    label.append(validInfo);
}

function isJsonString(string) {
    try {
        const object = JSON.parse(string);
        if (object && typeof object === "object") {
            return object;
        }
    }
    catch (e) {
        console.error(e);
    }
    return false;
}
