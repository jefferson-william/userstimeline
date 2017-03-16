<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UsersTable extends Table
{
    public $userPrincipal = 1;

    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->addBehavior('Timestamp', [
            'events' => [
                'Model.beforeSave' => [
                    'created' => 'new',
                    'modified' => 'always',
                ],
            ]
        ]);

        $this->table('users');
        $this->displayField('name');
        $this->primaryKey('id');
        $this->hasMany('UserUpdates');
    }

    public function validationDefault(Validator $validator)
    {
        $validator
            ->requirePresence('name')
            ->notEmpty('name', 'Nome não informado.')
            ->add('name', [
                'length' => [
                    'rule' => ['minLength', 1],
                    'message' => 'O nome precisa ter no mínimo 1 caracter.'
                ], [
                    'rule' => ['maxLength', 255],
                    'message' => 'O nome precisa ter no máximo 255 caracteres.'
                ]
            ])
            ;

        return $validator;
    }
}
