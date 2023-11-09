import {Editor, TinyMCE} from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
    editor.ui.registry.addIcon('phonelink', '<svg width="24" height="24"><path d="m0,0h24v24H0V0Z" fill="none" stroke-width="0"/><path d="m5,4h4l2,5-2.5,1.5c1.071,2.1715,2.8285,3.929,5,5l1.5-2.5,5,2v4c0,1.1046-.8954,2-2,2-8.0724-.4906-14.5094-6.9276-15-15,0-1.1046.8954-2,2-2" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="m11.5-.7296h13.3295v13.3295h-13.3295V-.7296Z" fill="none" stroke-width="0"/><path d="m16.4986,7.6014l3.3324-3.3324" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1108"/><path d="m17.6094,2.6028l.2571-.2977c1.0846-1.0845,2.843-1.0843,3.9275.0003s1.0843,2.843-.0003,3.9275l-.2966.2577" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1108"/><path d="m18.7202,9.2676l-.2205.2966c-1.0966,1.0844-2.8617,1.0844-3.9583,0-1.0845-1.0723-1.0943-2.8207-.022-3.9052.0073-.0074.0146-.0147.022-.022l.291-.2571" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1108"/></svg>');
    editor.ui.registry.addButton('phonelink', {
        text: '',
        icon: 'phonelink',
        onAction: () => openDialog()
    });

    const setContent = (editor, html) => {
        editor.focus();
        editor.undoManager.transact(() => {
            editor.insertContent(html);
        });
        editor.selection.setCursorLocation();
        editor.nodeChanged();
    };

    const openDialog = () => {
        editor.windowManager.open({
            title: 'Phone link',
            size: 'normal',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'input',
                        label: 'Phone number',
                        name: 'phoneNumber'
                    },
                    {
                        type: 'input',
                        label: 'Text to display',
                        name: 'phoneLabel'
                    },
                    {
                        type: 'input',
                        label: 'Title',
                        name: 'phoneTitle'
                    }
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    name: 'cancel',
                    text: 'Cancel'
                },
                {
                    type: 'submit',
                    name: 'save',
                    text: 'Save',
                    primary: true
                }
            ],
            initialData: {
                phoneNumber: (editor.selection.getNode() && editor.selection.getNode().getAttribute('href') ? editor.selection.getNode().getAttribute('href').replace('tel:', '') : editor.selection.getContent()),
                phoneLabel: editor.selection.getContent(),
                phoneTitle: '',
            },
            onSubmit: api => {
                const data = api.getData();

                const hrefLink = '<a title="' + data.phoneTitle + '" href="tel:' + data.phoneNumber + '">' + data.phoneLabel + '</a>';

                setContent(editor, hrefLink);
                api.close();
            }
        });
    };
};

export default (): void => {
    tinymce.PluginManager.add('phonelink', setup);
    tinymce.PluginManager.requireLangPack('phonelink', 'de');
};
