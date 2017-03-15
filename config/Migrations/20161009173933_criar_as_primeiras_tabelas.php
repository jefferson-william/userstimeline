<?php

use Phinx\Migration\AbstractMigration;

class CriarAsPrimeirasTabelas extends AbstractMigration
{
    public function up()
    {
        $this->table('users', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid')
            ->addColumn('name', 'string')
            ->addColumn('created', 'datetime')
            ->addColumn('modified', 'datetime')
            ->create();

        $this->table('user_updates', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid')
            ->addColumn('old_value', 'string')
            ->addColumn('new_value', 'string')
            ->addColumn('created', 'datetime')
            ->addColumn('modified', 'datetime')
            ->addColumn('user_id', 'uuid')
            ->addForeignKey('user_id', 'users', 'id')
            ->create();
    }

    public function down()
    {
        $this->table('user_updates')->dropForeignKey('user_id');

        $this->dropTable('user_updates');
        $this->dropTable('users');
    }
}
