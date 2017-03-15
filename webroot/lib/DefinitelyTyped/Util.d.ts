/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />

interface IUtil {
    AcessandoPaginaComGulp(): boolean;
    RetornarUrlBase(): string;
    RetornarUrlBaseApp(): string;
    RetornarUrlServidor(): string;
    RetornarUrlServidorApp(): string;
    RetornarUrlBaseServidor(): string;
    RetornarUrlBaseServidorApp(): string;
    RequireCtrlStateFactory($q: any, futureState: any): void;
    IframeStateFactory($q: angular.IQService, futureState: any): angular.IPromise<any>;
    NgLoadStateFactory($q: angular.IQService, futureState: any): angular.IPromise<any>;
    LoadAndRegisterFutureStates(): void;
}