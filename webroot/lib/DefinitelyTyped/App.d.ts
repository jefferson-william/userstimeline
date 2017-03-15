/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angular-ui-router/angular-ui-router.d.ts" />

interface IStateProvider {
    $get(): Function;
    decorator(name: string, func: Function): Function;
    state(name: string, routeObject: {}): Function;
}

interface IStateEvent {
    currentScope: angular.IScope;
    defaultPrevented: boolean;
    name: string;
    preventDefault: Function;
    targetScope: angular.IScope;
}

interface IState extends angular.ui.IState {
    type: string;
    urlMachter: RegExp;
    $$state: Function;
    dependencies?: string[];
    resolves?: any[];
}

interface IStateChange {
    parent?: {} | string;
    data?: {};
    url?: {} | string;
    navigable?: {};
    params?: {};
    views?: {};
    ownParams?: {};
    path?: {};
    includes?: {};
    controller?: string | any[] | Function;
    name?: string;
    templateUrl?: string;
}

interface IFutureStateProvider {
	futureState(route: IState): void;
	stateFactory(type: string, stateFactory: IStateChange): void;
	addResolve: Function;
}