<?php

namespace App\Model\Entity;

use Cake\ORM\Entity;

class UserUpdate extends Entity
{
    protected $_accessible = [
        '*' => true,
    ];

    protected $_hidden = [];
}
