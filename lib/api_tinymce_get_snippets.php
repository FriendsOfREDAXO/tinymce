<?php

class rex_api_tinymce_get_snippets extends rex_api_function
{
    protected $published = true;

    public function execute()
    {
        // Snippets sind Redaktions-Bausteine und dürfen nur an eingeloggte
        // Backend-User ausgeliefert werden (sie können Interna oder nicht
        // öffentliche HTML-Fragmente enthalten).
        if (null === rex::getUser()) {
            rex_response::cleanOutputBuffers();
            rex_response::setStatus(rex_response::HTTP_FORBIDDEN);
            rex_response::sendJson(['error' => 'Authentication required']);
            exit;
        }

        $sql = rex_sql::factory();
        $sql->setTable(rex::getTable('tinymce_snippets'));
        $sql->select('name, content');
        $snippets = $sql->getArray();
        
        // Sort by name ASC
        usort($snippets, static function ($a, $b) {
            return strcasecmp((string) $a['name'], (string) $b['name']);
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
