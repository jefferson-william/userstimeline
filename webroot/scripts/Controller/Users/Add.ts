/// <reference path="../../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angular-material/angular-material.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angularjs/angular-resource.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/App.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/Util.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/Users.d.ts" />

define([
    'angularAMD',
    'App',
    'Lazyload',
    'Util',
], (angularAMD: ng.IAngularStatic, app: ng.IModule, Lazyload: ILazyload, Util: IUtil) => {

    class UsersAddController implements IUsersAddClass {
        static $inject = ['$scope', '$mdDialog', '$mdToast', 'ngUtil', 'UsersService'];
        static templateUrl: string = `${Lazyload.rootStatic}/partials/Users/Add.html`;
        public saving: boolean;
        public title: string;
        public User = <IUsersModel>{};
        public states: string[];
        public userCopy: IUsersModel;

        constructor (private $scope: IUsersAddScope,
            private $mdDialog: ng.material.IDialogService,
            private $mdToast: ng.material.IToastService,
            private ngUtil: IUtil,
            private UsersService: IUsersService) {

            this.saving = false;
            this.$scope.UsersIndex.openingDialog = this.$scope.UsersIndex.openingDialog ? false : this.$scope.UsersIndex.openingDialog;

            if (this.$scope.UsersIndex.editing) {
                this.title = 'Editar';
                this.User = this.$scope.UsersIndex.User;
                this.userCopy = angular.copy(this.User);
            } else {
                this.title = 'Cadastrar';
                this.User = <IUsersModel>{};
            }
        }

        public Submit = ($event, form: IUsersAddForm) => {
            if (form.$invalid || this.saving) return;

            let User = angular.copy<IUsersModel>(this.User);

            this.saving = true;

            let editing: boolean = this.$scope.UsersIndex.editing;

            if (editing) {
                User.user_updates = User.user_updates || [];
                User.user_updates.push(<any>{ old_value: this.userCopy.name, new_value: User.name, user_id: User.id });
            }

            this.UsersService[editing ? 'update' : 'save'](User, this.AddSuccess, this.AddError);
        }

        public DialogClose = () => {
            this.saving = false;

            this.$mdDialog.cancel();
        }

        private AddSuccess = (...args) => {
            this.saving = false;

            this.ngUtil.FactoryDealErrors(args, this, 'Users');

            if (args[0].errors) return;

            this.$scope.UsersIndex.GetUsers();

            this.$mdDialog.cancel();

            this.$mdToast.show(this.$mdToast.simple().content(this.$scope.UsersIndex.editing ? 'Editado.' : 'Cadastrado.'));
        }

        private AddError = (...args) => {
            this.saving = false;

            this.$mdToast.show(this.$mdToast.simple().content('Ops!'));
        }
    }

    app.controller('UsersAddController', UsersAddController);

    return UsersAddController;
});
