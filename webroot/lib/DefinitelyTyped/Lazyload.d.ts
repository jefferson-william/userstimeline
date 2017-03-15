/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../lib/DefinitelyTyped/Util.d.ts" />
/// <reference path="../../lib/DefinitelyTyped/Lazyloader.d.ts" />
/// <reference path="../../lib/DefinitelyTyped/App.d.ts" />

interface ILazyload extends ILazyloader {
    Set(object: {}): void;
    $httpProvider: ng.IHttpProvider;
    $stateProvider: IStateProvider;
    $state: angular.ui.IStateService;
    $location: any;
    $timeout: any;
    rootStatic: string;
    urlApi: string;
    local: boolean;
    ec2: boolean;
}