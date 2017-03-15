<?php

namespace App\Controller\Api;

use Cake\Controller\Controller;

class ApiController extends Controller
{
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('RequestHandler');
    }
}
