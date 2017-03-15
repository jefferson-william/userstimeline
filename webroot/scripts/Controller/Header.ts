/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../Lib/DefinitelyTyped/Header.d.ts"/>

define([
    'App',
], (app: any) => {

    class HeaderController implements IHeaderClass {
        static $inject = [];

        constructor () {}
    }

    app.controller('HeaderController', HeaderController);

    return HeaderController;
});
