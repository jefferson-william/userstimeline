/// <reference path="bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="lib/DefinitelyTyped/App.d.ts" />
/// <reference path="lib/DefinitelyTyped/Lazyload.d.ts" />

const rootStatic = document.getElementById('Body').getAttribute('data-root-static') || '';
const ec2 = document.getElementById('Body').getAttribute('data-ec2') || false;
const gz = ec2 ? '.gz' : '';

let config = {
    paths: {
        'css-builder': 'bower_components/require-css/css-builder',
        'normalize': 'bower_components/require-css/normalize',
        css: 'bower_components/require-css/css',
        moment: 'bower_components/moment/moment',
        momentPtBr: 'bower_components/moment/locale/pt-br',
        angularMaterial: 'bower_components/angular-material/angular-material',
        angularMaterialCss: 'bower_components/angular-material/angular-material',
        angular: 'bower_components/angular/angular',
        angularAnimate: 'bower_components/angular-animate/angular-animate',
        angularAria: 'bower_components/angular-aria/angular-aria',
        angularMessages: 'bower_components/angular-messages/angular-messages',
        angularResource: 'bower_components/angular-resource/angular-resource',
        angularSanitize: 'bower_components/angular-sanitize/angular-sanitize',
        angularPortuguese: 'bower_components/angular-i18n/angular-locale_pt-br',
        angularUiRouter: 'bower_components/angular-ui-router/release/angular-ui-router',
        angularAMD: 'bower_components/angularAMD/dist/angularAMD',
        angularTimeline: 'bower_components/angular-timeline/dist/angular-timeline',
        angularTimelineCss: 'bower_components/angular-timeline/dist/angular-timeline',
        libAngularTimelineCss: 'lib/angular-timeline/angular-timeline',
        BootstrapCss: 'css/Bootstrap',
        Bootstrap: 'Bootstrap',
        Lazyload: 'js/Lazyload',
        Util: 'js/Util',
        Route: 'js/Route',
        App: 'js/App',
        LayoutController: 'js/Controller/Layout',
        HeaderController: 'js/Controller/Header',
        UsersIndexController: 'js/Controller/Users/Index',
        UsersAddController: 'js/Controller/Users/Add',
        UsersService: 'js/Service/Users',
        MomentFilter: 'js/Filter/Moment',
    }
};

require.config({
    paths: config.paths,
    shim: {
        angular: { deps: ['css'] },
        angularAnimate: { deps: ['angularAMD'] },
        angularAria: { deps: ['angularAMD'] },
        angularMessages: { deps: ['angularAMD'] },
        angularResource: { deps: ['angularAMD'] },
        angularSanitize: { deps: ['angularAMD'] },
        angularPortuguese: { deps: ['angularAMD'] },
        angularUiRouter: { deps: ['angularAMD'] },
        angularAMD: { deps: ['angular'] },
        angularMaterial: { deps: ['angularAnimate', 'angularAria'] },
        angularTimeline: { deps: ['angularAMD'] },
        momentPtBr: { deps: ['moment'] },
        MomentFilter: { deps: ['momentPtBr'] },
        Lazyload: { deps: ['angularAMD'] },
        Route: { deps: ['Lazyload'] },
        Util: { deps: ['Lazyload', 'Route'] },
        App: { deps: ['Util', 'angularMessages', 'angularResource', 'angularSanitize', 'angularPortuguese', 'angularUiRouter', 'angularMaterial', 'angularTimeline'] },
        LayoutController: { deps: ['HeaderController'] },
        UsersIndexController: { deps: ['UsersService', 'MomentFilter'] },
        UsersAddController: { deps: ['UsersService'] },
    }
});

if (ec2) {
    for (let prop in config.paths) {
        config.paths[prop] = config.paths[prop] + gz;
    }
}

require.config({
    baseUrl: rootStatic,
    waitSeconds: 0,
    paths: config.paths,
    // urlArgs: 't=' + (new Date()).getTime(),
});

require(['Lazyload', 'App'], (Lazyload: ILazyload) => {

    Lazyload.Set({ rootStatic: rootStatic, ec2: ec2 });

    require(['css!angularMaterialCss'], () => require(['css!BootstrapCss'], () => require(['css!angularTimelineCss', 'css!libAngularTimelineCss'])));
});

if (ec2 && 'serviceWorker' in navigator) {
    (<any>navigator).serviceWorker.register(`${rootStatic}/sw.js${gz}`).then(function() {
        console.log("Service Worker Registered.");
    });
}