/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/oclazyload/oclazyload.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Util.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Lazyloader.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Layout.d.ts" />

define([
    'App',
    'Util',
    'Lazyload',
], (app: any, Util: IUtil, Lazyload: ILazyload) => {

    class LayoutController implements ILayoutClass {
        static $inject = [];

        constructor () {}
    }

    app.controller('LayoutController', LayoutController);

    return LayoutController;
});
