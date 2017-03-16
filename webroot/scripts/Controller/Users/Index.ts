/// <reference path="../../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../../bower_components/DefinitelyTyped/angular-material/angular-material.d.ts" />
/// <reference path="../../../Lib/DefinitelyTyped/Lazyload.d.ts"/>
/// <reference path="../../../Lib/DefinitelyTyped/Users.d.ts"/>

define([
    'App',
], (app: any) => {

    class UsersIndexController implements IUsersIndexClass {
        static $inject = ['$scope', '$mdToast', '$mdDialog', 'ngLazyload', 'UsersService'];
        public promise;
        public results;
        public editing: boolean;
        public openingDialog: boolean;
        public query: {};
        public isClient: boolean;
        public Users: IUsersModel[];
        public User: IUsersModel;

        constructor (private $scope: IUsersIndexScope,
            private $mdToast: ng.material.IToastService,
            private $mdDialog: ng.material.IDialogService,
            private ngLazyload: ILazyload,
            private UsersService) {

            this.GetUsers(true);
        }

        public Add = ($event?: any | boolean) => {
            if (this.openingDialog) return;

            this.openingDialog = true;

            let add: boolean = typeof $event === 'boolean' && !$event ? false : true;

            if (add) this.editing = false;

            require(['UsersAddController'], (UsersAddController: IUsersAddClass) => {
                let options: ng.material.IDialogOptions = {
                    scope: this.$scope,
                    preserveScope: true,
                    controller: <any>UsersAddController,
                    controllerAs: 'UsersAdd',
                    templateUrl: UsersAddController.templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                };

                this.$mdDialog.show(options);
            });
        }

        public GetUsers = (forceReload?: boolean) => {
            if (forceReload !== true && this.promise && !this.promise.$$state.status) return;

            this.promise = this.UsersService.query(this.query, this.UsersObtained, this.UsersNotObtained).$promise;
        }

        public Edit = (user: IUsersModel, $event: any) => {
            if (this.promise && !this.promise.$$state.status) return;

            this.editing = true;
            this.promise = this.UsersService.get({ id: user.id }, this.UserObtained, this.UsersNotRemoved).$promise;
        }

        public Delete = (user: IUsersModel, $event: any) => {
            var confirm = this.$mdDialog.confirm()
                .title('Excluir usuário')
                .content('Tem certeza que deseja excluir o usuário e seu histórico?')
                .ariaLabel('Excluir usuário')
                .ok('Quero excluir')
                .cancel('Não exclua');

            this.$mdDialog.show(confirm).then(() => {
                this.promise = this.UsersService.delete({ id: user.id }, this.UsersRemoved, this.UsersNotRemoved).$promise;
            });
        }

        public UserObtained = (...args) => {
            this.User = args[0].data;

            this.Add(false);
        }

        public UsersNotObtained = (...args) => {
            this.$mdToast.show(this.$mdToast.simple().content('Houve um problema ao listar os usuários.'));
        }

        public TreatUsers = (users: IUsersModel[]) => {
            for (let i = 0, l = users.length; i < l; i++) {
                let user: IUsersModel = users[i];

                if (!user.user_updates.length) {
                }
            }
        }

        private UsersObtained = (...args) => {
            let users: IUsersModel[] = args[0].data;

            this.TreatUsers(users);

            this.Users = users;
        }

        private UsersRemoved = (...args) => {
            this.$mdToast.show(this.$mdToast.simple().content('Excluído.'));

            this.GetUsers(true);
        }

        private UsersNotRemoved = (...args) => {
            this.$mdToast.show(this.$mdToast.simple().content('Ops!'));
        }
    }

    app.controller('UsersIndexController', UsersIndexController);

    return UsersIndexController;
});
