/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />

interface IUsersModel {
	name: string;
}

interface IUsersIndexScope extends ng.IScope {}

interface IUsersIndexClass {
    GetUser(forceReload?: boolean);
    UserObtained(...args);
    Add(event: any);
    editing: boolean;
    openingDialog: boolean;
    isClient: boolean;
    promise: any;
    Users: any;
}

interface IUsersAddForm extends ng.IFormController, IUsersModel {}

interface IUsersAddClass {
    templateUrl?: string;
    saving: boolean;
    title: string;
    states: string[];
}

interface IUsersAddScope extends ng.IScope {
    UsersIndex: IUsersIndexClass;
    UsersAdd: IUsersAddClass;
    GetUser();
}

interface IUsersService extends angular.resource.IResourceClass<angular.resource.IResourceArray<IUsersModel>> {
    $resouce(): any;
}