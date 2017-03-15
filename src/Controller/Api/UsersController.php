<?php

namespace App\Controller;

use App\Controller\AppController;

class UsersController extends AppController
{
    public $paginate = [
        'contain' => [],
        'order' => [
            'Users.created' => 'desc',
        ]
    ];

    public function initialize()
    {
        parent::initialize();
    }

    public function index()
    {
        $data = $this->paginate();

        $this->set(compact('data'));
        $this->set('_serialize', ['data']);
    }

    public function view($id = null)
    {
        $data = $this->Users->get($id);

        $this->set('data', $data);
        $this->set('_serialize', ['data']);
    }

    public function add()
    {
        $data = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $this->Users->patchEntity($data, $this->request->data);
            if ($errors = $data->errors()) {
                $this->set(compact('errors'));
                $this->set('_serialize', ['errors']);
                return;
            }
            if (!$this->Users->save($data)) {
                $errors = ['Houve um erro ao salvar.'];
                $this->set(compact('errors'));
                $this->set('_serialize', ['errors']);
                return;
            }
        }
        $this->set(compact('data'));
        $this->set('_serialize', ['data']);
    }

    public function edit($id = null)
    {
        $data = $this->Users->get($id);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $this->Users->patchEntity($data, $this->request->data);
            if ($errors = $data->errors()) {
                $this->set(compact('errors'));
                $this->set('_serialize', ['errors']);
                return;
            }
            unset($data->created);
            unset($data->modified);
            if (!$this->Users->save($data)) {
                $errors = ['Houve um erro ao salvar.'];
                $this->set(compact('errors'));
                $this->set('_serialize', ['errors']);
                return;
            }
        }
        $this->set(compact('data'));
        $this->set('_serialize', ['data']);
    }

    public function delete($id = null)
    {
        if ($this->request->is('options')) return;
        $this->request->allowMethod(['post', 'delete', 'options']);
        if (!$id) {
            $errors = ['Informe o identificador.'];
            $this->set(compact('errors'));
            $this->set('_serialize', ['errors']);
            return;
        }
        $data = $this->Users->get($id);
        if (!$this->Users->delete($data)) {
            $errors = ['Houve um erro ao excluir.'];
            $this->set(compact('errors'));
            $this->set('_serialize', ['errors']);
            return;
        }
    }
}
