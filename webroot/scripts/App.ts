/// <reference path="../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Util.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../lib/DefinitelyTyped/App.d.ts" />

define([
    'angularAMD',
    'Util',
    'Route',
    'Lazyload',
], (angularAMD: any, Util: IUtil, Route: any, Lazyload: ILazyload) => {

    var app: any, bootstrap: any,
        Configuration: Function, Runner: Function,
        Locales: {};

    /**
     * Configurações gerais ao inicializar a aplicação
     */
    Configuration = (
        $sceDelegateProvider,
        $stateProvider: IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider,
        $locationProvider: angular.ILocationProvider,
        $controllerProvider: angular.IControllerProvider,
        $provide: angular.auto.IProvideService,
        $filterProvider: angular.IFilterProvider,
        $compileProvider: angular.ICompileProvider,
        $httpProvider: angular.IHttpProvider,
        $mdThemingProvider,
        $mdIconProvider): void => {

        $mdIconProvider.defaultFontSet('material-icons');

        let overrideProvider: {};

        // Sobrescrever métodos do AngularJS através de seus respectivos Providers
        overrideProvider = {
            controller: $controllerProvider.register,
            service: $provide.service,
            factory: $provide.factory,
            filter: $filterProvider.register,
            directive: $compileProvider.directive
        };

        for (var providerName in overrideProvider) {
            angular[providerName] = overrideProvider[providerName];
        }

        // Adicionar alguns Providers no objeto Lazyload para serem usados futuramente
        Lazyload.Set({
            '$stateProvider': $stateProvider,
            '$httpProvider': $httpProvider,
        });

        $sceDelegateProvider.resourceUrlWhitelist(['self', /^http[s]?:\/\/localhost\/.*/, 'http://userstimeline.s3-website-sa-east-1.amazonaws.com/**']);

        (<any>$httpProvider.defaults).useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Redirecionar para a url inicial caso a url informada não tenha sido configurada/não exista
        $urlRouterProvider.otherwise(Util.AcessandoPaginaComGulp() ? '/app/users' : `${Lazyload.rootStatic}/app/users`);

        Route.SetarTodas();

        $locationProvider.html5Mode(Lazyload.rootStatic ? true : false);

        $mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('deep-purple');
    };
    Configuration.$inject = ['$sceDelegateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', '$httpProvider', '$mdThemingProvider', '$mdIconProvider'];

    /**
     * Rodar ações ao iniciar a aplicação
     */
    Runner = (
        $rootScope: angular.IRootScopeService,
        $location: any,
        $timeout: any,
        $state: angular.ui.IStateService,
        $templateCache: angular.ITemplateCacheService,
        ngUtil: IUtil): void => {

        Lazyload.Set({ '$state': $state, '$location': $location, '$timeout': $timeout });

        var user, withoutAuth, fromStateLogin, toStateLogin, toStateLogin;

        $rootScope.$on('$stateChangeStart', (
            event: IStateEvent,
            toState: IState,
            toParams: {},
            fromState: IState,
            fromParams: {},
            options: angular.ui.IStateOptions): void => {
        });

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams, options): void => {
            var $body, SetarClasseNomePaginaBody;

            $body = angular.element(document).find('body');

            SetarClasseNomePaginaBody = (): void => {
                $body.removeClass('hide');

                toState.name && $body.removeClass(fromState.name.replace(/[.]/, ' ')).addClass('Page ' + toState.name.replace(/[.]/, ' '));
            };

            SetarClasseNomePaginaBody();
        });
    };
    Runner.$inject = ['$rootScope', '$location', '$timeout', '$state', '$templateCache', 'ngUtil'];

    app = angular.module('app', [
        'ngLocale', 'ngResource', 'ngAria', 'ngAnimate', 'ngSanitize', 'ngMessages', 'ngMaterial', 'ui.router.state',
    ])
    .factory('ngUtil', () => Util)
    .factory('ngLazyload', () => Lazyload)
    .config(Configuration)
    .run(Runner);

    bootstrap = angularAMD.bootstrap(app);

    return bootstrap;
});
