/// <reference path="../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />
/// <reference path="../Lib/DefinitelyTyped/Util.d.ts" />
/// <reference path="../Lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../Lib/DefinitelyTyped/App.d.ts" />

define([
    'Lazyload',
    'Route',
], (
    Lazyload: ILazyload,
    Route: any) => {

    var Util = <IUtil>{};

    Util.AcessandoPaginaComGulp = (): boolean => (location.href.search(/(localhost:)/) > -1 ? true : false);

    Util.RetornarUrlBase = (): string => !Util.AcessandoPaginaComGulp() ? '/leblot/' : '/#/';

    Util.RetornarUrlBaseApp = (): string => `${Util.RetornarUrlBase()}app/`;

    Util.RetornarUrlServidor = (): string => !Util.AcessandoPaginaComGulp() ? '/leblot/' : 'http://localhost/leblot/';

    Util.RetornarUrlServidorApp = (): string => `${Util.RetornarUrlServidor()}app/`;

    Util.RetornarUrlBaseServidor = (): string => !Util.AcessandoPaginaComGulp() ? '/leblot/' : 'http://localhost:9001/';

    Util.RetornarUrlBaseServidorApp = (): string => `${Util.RetornarUrlBaseServidor()}app/`;

    Util.RequireCtrlStateFactory = ($q: angular.IQService, futureState: IState): angular.IPromise<{}> => {
        var d = $q.defer();

        require(futureState.dependencies, (...args: any[]): void => {
            let fullState = <IState>futureState;
            let Controller: string;

            Controller = args[args.length - 1];
            Controller = Controller && Controller.search('Controller') !== 1 ? Controller : null;

            fullState.controller = Controller || null;

            d.resolve(fullState);
        });

        return d.promise;
    };

    Util.IframeStateFactory = ($q: angular.IQService, futureState: any): angular.IPromise<any> => {
        var state = {
            name: futureState.stateName,
            template: "<iframe src='" + futureState.src + "'></iframe>",
            url: futureState.urlPrefix
        };

        return $q.when(state);
    };

    Util.NgLoadStateFactory = ($q: angular.IQService, futureState: any): angular.IPromise<any> => {
        var ngloadDeferred = $q.defer();

        require(['ngload!' + futureState.src, 'ngload', 'angularAMD'],
            function ngloadCallback(result: any, ngload: any, angularAMD: any) {
                angularAMD.processQueue();
                ngloadDeferred.resolve(undefined);
            });

        return ngloadDeferred.promise;
    };

    return Util;
});