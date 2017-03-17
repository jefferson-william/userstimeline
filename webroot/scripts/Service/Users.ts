/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Users.d.ts" />

define([
    'App',
], (app: ng.IModule) => {

    class UsersService implements IUsersService {
        static $inject = ['$resource', 'ngLazyload'];

        constructor(private $resource: any,
        	private ngLazyload: ILazyload) {

            let actions = {
                get: <ng.resource.IActionDescriptor> {
                    method: 'GET',
                    params: { action: 'view', id: '@id' },
                },
                query: <ng.resource.IActionDescriptor> {
                    method: 'GET',
                    params: { action: 'index' },
                },
                save: <ng.resource.IActionDescriptor> {
                    method: 'POST',
                    params: { action: 'add' },
                },
                update: <ng.resource.IActionDescriptor> {
                    method: 'PUT',
                    params: { action: 'edit', id: '@id' },
                },
                delete: <ng.resource.IActionDescriptor> {
                    method: 'DELETE',
                    params: { action: 'delete', id: '@id' },
                },
            };

            return this.$resource(`${ngLazyload.url}/api/users/:action:type/:id/`, {}, actions);
        }
    }

    app.service('UsersService', UsersService);

    return UsersService;
});
