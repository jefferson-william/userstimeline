<?php
$baseDir = dirname(dirname(__FILE__));
return [
    'plugins' => [
        'Bake' => $baseDir . '/vendor/cakephp/bake/',
        'BryanCrowe/ApiPagination' => $baseDir . '/vendor/bcrowe/cakephp-api-pagination/',
        'Cors' => $baseDir . '/vendor/ozee31/cakephp-cors/',
        'Crud' => $baseDir . '/vendor/friendsofcake/crud/',
        'DebugKit' => $baseDir . '/vendor/cakephp/debug_kit/',
        'Migrations' => $baseDir . '/vendor/cakephp/migrations/'
    ]
];