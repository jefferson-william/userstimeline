# Documentação

**Pré-requisitos**

* Wampp
    * PHP >= 5.6.3
    * Apache2
    * MySQL
    * PhpMyAdmin
* Composer
* Ruby
    Gems
* Node/NPM
    * Bower
    * Gulp
* GIT

## Amazon

Este sistema está hospedado num servidor free tier da Amazon. Acesse [http://35.166.218.28/userstimeline/](http://35.166.218.28/userstimeline/).

## Inicialização

Crie um banco de dados chamado **userstimeline** no seu [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).

Verifique se seu banco foi criado com usuário **root** e sem senha. Do contrário, terá que alterar as configurações de acesso ao banco no arquivo config/app.php.

Rode os comandos para criar o projeto.

    cd c:/wamp64/www/
    git clone https://github.com/jefferson-william/userstimeline.git
    cd userstimeline
    composer install
    bower install
    npm i
    gulp