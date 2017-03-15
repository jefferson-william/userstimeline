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
        public Users;
        public isClient: boolean;

        constructor (private $scope: IUsersIndexScope,
            private $mdToast: ng.material.IToastService,
            private $mdDialog: ng.material.IDialogService,
            private ngLazyload: ILazyload,
            private UsersService: IUsersService) {
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

        public GetUser = (forceReload?: boolean) => {
            if (forceReload !== true && this.promise && !this.promise.$$state.status) return;

            this.promise = this.UsersService.query(this.query, this.UsersObtained).$promise;
        }

        public Edit = (user: IUsersModel, $event: any) => {
            if (this.promise && !this.promise.$$state.status) return;

            this.editing = true;
            this.Users = this.UsersService.get({ id: user.id }, this.UserObtained, this.UsersNotRemoved);
            this.promise = this.Users.$promise;
        }

        public Delete = ($event: any) => {
            var confirm = this.$mdDialog.confirm()
                .title('Excluir endereço')
                .content('Tem certeza que deseja excluir o endereço?')
                .ariaLabel('Excluir endereço')
                .ok('Quero excluir')
                .cancel('Não exclua');

            this.$mdDialog.show(confirm).then(() => {
                var ids = this.selected.map((item) => item.id);

                this.promise = this.UsersService.delete({ id: ids[0] }, this.UsersRemoved, this.UsersNotRemoved).$promise;
            });
        }

        public UserObtained = (...args) => {
            this.Add(false);
        }

        private UsersRemoved = (...args) => {
            console.log('Excluído.', args);

            this.selected = [];

            this.GetUser(true);

            this.$mdToast.show(this.$mdToast.simple().content('Excluído.'));
        }

        private UsersNotRemoved = (...args) => {
            console.log('Não excluído.', args);

            this.$mdToast.show(this.$mdToast.simple().content('Ops!'));
        }

    app.controller('UsersIndexController', UsersIndexController);

    return UsersIndexController;
});
