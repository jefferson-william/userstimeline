<?php

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UserUpdatesTable extends Table
{
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

        $this->table('user_updates');
        $this->displayField('new_value');
        $this->primaryKey('id');
        $this->belongsTo('Users');
    }

    public function validationDefault(Validator $validator)
    {
        $validator
            ->requirePresence('old_value')
            ->notEmpty('old_value', 'Valor antigo não informado.')
            ->add('old_value', [
                'length' => [
                    'rule' => ['minLength', 1],
                    'message' => 'O valor antigo precisa ter no mínimo 1 caracter.'
                ], [
                    'rule' => ['maxLength', 255],
                    'message' => 'O valor antigo precisa ter no máximo 255 caracteres.'
                ]
            ])
            ->requirePresence('new_value')
            ->notEmpty('new_value', 'Novo valor não informado.')
            ->add('new_value', [
                'length' => [
                    'rule' => ['minLength', 1],
                    'message' => 'O novo valor precisa ter no mínimo 1 caracter.'
                ], [
                    'rule' => ['maxLength', 255],
                    'message' => 'O novo valor precisa ter no máximo 255 caracteres.'
                ]
            ])
            ->requirePresence('user_id')
            ->notEmpty('user_id', 'Novo valor não informado.')
            ->uuid('user_id')
            ;

        return $validator;
    }
}
