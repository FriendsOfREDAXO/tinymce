<?php

$finder = PhpCsFixer\Finder::create()
    ->files()
    ->in([
        __DIR__ . '/lib',
        __DIR__ . '/pages',
    ])
    ->name('*.php');

$config = new PhpCsFixer\Config();

return $config
    ->setRiskyAllowed(false)
    ->setUsingCache(false)
    ->setFinder($finder)
    ->setRules([
        '@PSR12' => true,
    ]);