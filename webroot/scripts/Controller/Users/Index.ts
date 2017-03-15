/// <reference path="../../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/Users.d.ts"/>

define([
    'App',
], (app: any) => {

    class UsersIndexController implements IUsersIndexClass {
        static $inject = [];

        constructor () {}
    }

    app.controller('UsersIndexController', UsersIndexController);

    return UsersIndexController;
});
