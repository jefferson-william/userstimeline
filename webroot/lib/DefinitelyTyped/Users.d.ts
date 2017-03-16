/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />
/// <reference path="UserUpdates.d.ts" />

interface IUsersModel {
    id: string;
	name: string;
    created: Date;
    modified: Date;
    user_updates: IUserUpdatesModel[];
}

interface IUsersIndexScope extends ng.IScope {}

interface IUsersIndexClass {
    TreatUsers(users: IUsersModel[]);
    GetUsers(forceReload?: boolean);
    UserObtained(...args);
    UsersNotObtained(...args);
    Add(event: any);
    editing: boolean;
    openingDialog: boolean;
    isClient: boolean;
    promise: any;
    query: {};
    Users: IUsersModel[];
    User: IUsersModel;
}

interface IUsersAddForm extends ng.IFormController, IUsersModel {}

interface IUsersAddClass {
    templateUrl?: string;
    saving: boolean;
    title: string;
    states: string[];
    userCopy: IUsersModel;
}

interface IUsersAddScope extends ng.IScope {
    UsersIndex: IUsersIndexClass;
    UsersAdd: IUsersAddClass;
    GetUser();
}

interface IUsersService {}