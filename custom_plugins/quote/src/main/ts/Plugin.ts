import {Editor, TinyMCE} from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
    editor.ui.registry.addButton('quote', {
        icon: 'quote',
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
            title: 'Quote',
            size: 'normal',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'textarea',
                        label: 'Quote text',
                        name: 'quoteText'
                    },
                    {
                        type: 'input',
                        label: 'Quote author',
                        name: 'quoteAuthor'
                    },
                    {
                        type: 'input',
                        label: 'Quote cite',
                        name: 'quoteCite'
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
                quoteText: editor.selection.getContent(),
                quoteAuthor: '',
                quoteCite: '',
            },
            onSubmit: api => {
                const data = api.getData();
                // check the data
                if (data.quoteText.trim() === '') {
                    return;
                }

                let cite = '';
                if (data.quoteCite.trim() !== '') {
                     cite = '<cite>'+data.quoteCite+'</cite>';
                }

                let author = '';
                if (data.quoteAuthor.trim() !== '') {
                    author = data.quoteAuthor;
                    if (cite !== '') {
                        author += ', '+cite;
                        cite = '';
                    }
                    author = '<footer>'+author+'</footer>';
                }

                setContent(editor, '<blockquote><div>'+data.quoteText+'</div>'+author+cite+'</blockquote>');
                api.close();
            }
        });
    };
};

export default (): void => {
    tinymce.PluginManager.add('quote', setup);
    tinymce.PluginManager.requireLangPack('quote', 'de');
};
