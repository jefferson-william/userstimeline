/// <reference path="../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../lib/DefinitelyTyped/App.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Users.d.ts" />

define([
    'Lazyload'
], (Lazyload: ILazyload) => {
    let Route, originalPath, route;

    Route = {
        'LayoutApp': {
            url: Lazyload.rootStatic ? `${Lazyload.rootStatic}/app/` : '/app/',
            dependencies: ['LayoutController'],
            views: {
                '': {
                    templateUrl: `${Lazyload.rootStatic}/partials/Layout.html`,
                    controller: 'LayoutController',
                    controllerAs: 'Layout',
                },
                'Header@LayoutApp': {
                    templateUrl: `${Lazyload.rootStatic}/partials/Header.html`,
                    controller: 'HeaderController',
                    controllerAs: 'Header',
                },
            }
        },
        'LayoutApp.UsersIndex': {
            url: 'users',
            route: '/users',
            dependencies: ['UsersIndexController'],
            views: {
                'Body': {
                    templateUrl: `${Lazyload.rootStatic}/partials/Users/Index.html`,
                    controller: 'UsersIndexController',
                    controllerAs: 'UsersIndex',
                }
            }
        },
    };

    Route.StateIsPublic = (stateName: string): boolean => {
        for (let prop in Route) {
            if (typeof prop === 'string' && prop === stateName && Route[prop].public) {
                return true;
            }
        }

        return false;
    };

    Route.GetStateNameByRoute = (route: string): string => {
        let stateName = '';

        for (let prop in Route) {
            if (typeof prop === 'string' && typeof Route[prop] === 'object' && (Route[prop].route === route || Route[prop].url === route) && !stateName) {
                stateName = prop;

                break;
            }
        }

        return stateName;
    };

    Route.StateValidar = (state: any): boolean => {
        return typeof state == 'object' && (state.url || state.views || state.controller) ? true : false;
    };

    Route.SetarTodas = (): void => {
        let state,
            name: string;

        for (name in Route) {
            state = Route[name];

            Route.StateValidar(state) && Lazyload.$stateProvider.state(name, state);
        }
    };

    Route.InjetarDependenciasResolver = (stateSimple): void => {
        let state, resolveOld, resolveNew, resolve,
            name: string,
            ReordenarResolver: Function,
            TratarResolver: Function;

        TratarResolver = (state): any => {
            let innerState,
                nameState: string;

            if (Route.StateValidar(state)) {
                resolve = state.resolve = state.resolve || {};

                resolve.dependencies = ['$q', ($q): void => {
                    let deferred;

                    deferred = $q.defer();
                    state.dependencies = state.dependencies || [];
                    state.dependencies.unshift('angularAMD');

                    require(state.dependencies, (angularAMD): void => {
                        angularAMD.processQueue();

                        deferred.resolve();
                    });

                    return deferred.promise;
                }];
            }

            return state;
        };

        if (stateSimple) {
            TratarResolver(stateSimple);
        } else {
            for (name in Route) {
                state = Route[name];

                state = TratarResolver(state);
            }
        }
    };

    Route.InjetarDependenciasResolver();

    return Route;
});
