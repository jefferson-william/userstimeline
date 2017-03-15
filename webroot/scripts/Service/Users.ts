/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Users.d.ts" />

define([
    'App',
], (app: ng.IModule) => {

    class UsersService implements IUsersService {
    }

    app.service('UsersService', UsersService);

    return UsersService;
});
