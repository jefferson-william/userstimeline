<?php

namespace App\Controller;

use Cake\Event\Event;

class ErrorController extends AppController
{
    public function initialize()
    {
        $this->loadComponent('RequestHandler');
    }

    public function beforeFilter(Event $event)
    {
    }

    public function beforeRender(Event $event)
    {
        parent::beforeRender($event);

        $this->viewBuilder()->templatePath('Error');
    }

    public function afterFilter(Event $event)
    {
    }
}
