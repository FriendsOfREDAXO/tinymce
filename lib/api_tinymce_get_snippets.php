<?php

class rex_api_tinymce_get_snippets extends rex_api_function
{
    protected $published = true;

    public function execute()
    {
        $snippets = rex_sql::factory()->getArray('SELECT name, content FROM ' . rex::getTable('tinymce_snippets') . ' ORDER BY name ASC');
        
        $data = [];
        foreach ($snippets as $snippet) {
            $data[] = [
                'title' => $snippet['name'],
                'content' => $snippet['content'],
            ];
        }

        rex_response::cleanOutputBuffers();
        rex_response::sendJson($data);
        exit;
    }
}
