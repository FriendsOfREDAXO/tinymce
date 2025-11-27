declare const tinymce: any;
declare const window: any;

interface Snippet {
  title: string;
  content: string;
}

const setup = (editor: any, url: string): void => {
  editor.ui.registry.addMenuButton('snippets', {
    text: 'Snippets',
    fetch: (callback: (items: any[]) => void) => {
      fetch('index.php?rex-api-call=tinymce_get_snippets')
        .then(response => response.json())
        .then((snippets: Snippet[]) => {
          if (snippets.length === 0) {
            callback([{
              type: 'menuitem',
              text: 'Keine Snippets vorhanden',
              enabled: false,
              onAction: () => {}
            }]);
            return;
          }
          
          const items = snippets.map((snippet) => ({
            type: 'menuitem',
            text: snippet.title,
            onAction: () => {
              editor.insertContent(snippet.content);
            }
          }));
          callback(items);
        })
        .catch(error => {
          console.error('Error fetching snippets:', error);
          callback([{
            type: 'menuitem',
            text: 'Fehler beim Laden',
            enabled: false,
            onAction: () => {}
          }]);
        });
    }
  });
};

tinymce.PluginManager.add('snippets', setup);

export default () => {};
