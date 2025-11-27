<?php

class rex_api_tinymce_get_snippets extends rex_api_function
{
    protected $published = true;

    public function execute()
    {
        $sql = rex_sql::factory();
        $sql->setTable(rex::getTable('tinymce_snippets'));
        $sql->select('name, content');
        $snippets = $sql->getArray();
        
        // Sort by name ASC
        usort($snippets, function($a, $b) {
            return strcasecmp($a['name'], $b['name']);
        });
        
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
