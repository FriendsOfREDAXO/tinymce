import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
    console.log(url);
    editor.ui.registry.addButton('link-yform', {
        text: 'YForm',

        onAction: () => {
            const pool = newPoolWindow('index.php?page=yform/manager/data_edit&table_name=rex_yf_movie&rex_yform_manager_opener[id]=1&rex_yform_manager_opener[field]=title&rex_yform_manager_opener[multiple]=0');
            $(pool).on('rex:YForm_selectData', function (event, id, label) {
                event.preventDefault();
                pool.close();
                console.log(event, id);

                editor.setContent('<p><a href="#">' + label + ' (' + id + ')</a></p>');
            });

        }
    });
};

export default (): void => {
    tinymce.PluginManager.add('link-yform', setup);
};
