<?php

namespace App\Controller;

use Cake\Core\Configure;
use Cake\Controller\Controller;
use Cake\Event\Event;
use Cake\Database\Type;

class AppController extends Controller
{
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('Paginator');
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        if (!$this->request->is('options')) {
            $this->loadComponent('BryanCrowe/ApiPagination.ApiPagination', [
                'aliases' => [
                    'pageCount' => 'page_count',
                    'page' => 'current_page',
                    'nextPage' => 'has_next_page',
                    'prevPage' => 'has_prev_page',
                    'perPage' => 'per_page',
                    'sortDefault' => 'sort_default',
                    'directionDefault' => 'direction_default',
                ]
            ]);
        }
    }

    public function beforeFilter(Event $event)
    {
        $this->ec2 = strpos(ROOT, 'var') !== false;
        $this->local = strpos(ROOT, 'wamp64') !== false;
        $this->rootStatic = $this->ec2 ? 'http://userstimeline.s3-website-sa-east-1.amazonaws.com' : '/userstimeline';
        $this->extensionStaticFiles = $this->ec2 ? '.gz' : '';

        $this->set('extensionStaticFiles', $this->extensionStaticFiles);
        $this->set('rootStatic', $this->rootStatic);
        $this->set('local', $this->local);
        $this->set('ec2', $this->ec2);
    }

    public function beforeRender(Event $event)
    {
        if (!array_key_exists('_serialize', $this->viewVars) &&
            in_array($this->response->type(), ['application/json', 'application/xml'])
        ) {
            $this->set('_serialize', true);
        }
    }
}
