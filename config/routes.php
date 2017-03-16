<?php

use Cake\Core\Plugin;
use Cake\Routing\RouteBuilder;
use Cake\Routing\Router;
use Cake\Routing\Route\DashedRoute;

Router::defaultRouteClass(DashedRoute::class);

Router::prefix('api', function ($routes) {
    $routes->extensions(['json', 'xml']);
    
    $routes->connect('/users/index', ['controller' => 'Users', 'action' => 'index', '_ext' => 'json']);
    $routes->connect('/users/add', ['controller' => 'Users', 'action' => 'add', '_ext' => 'json']);
    $routes->connect('/users/view/:id', ['controller' => 'Users', 'action' => 'view', '_ext' => 'json'], ['id' => '[a-zA-Z0-9\-]{36}', 'pass' => ['id']]);
    $routes->connect('/users/edit/:id', ['controller' => 'Users', 'action' => 'edit', '_ext' => 'json'], ['id' => '[a-zA-Z0-9\-]{36}', 'pass' => ['id']]);
    $routes->connect('/users/delete/:id', ['controller' => 'Users', 'action' => 'delete', '_ext' => 'json'], ['id' => '[a-zA-Z0-9\-]{36}', 'pass' => ['id']]);
});

Router::scope('/', function (RouteBuilder $routes) {
    $routes->extensions(['json', 'xml']);

    $routes->connect('/*', ['controller' => 'Pages', 'action' => 'display']);

    $routes->fallbacks(DashedRoute::class);
});

Plugin::routes();
