/// <reference path="../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Lazyload.d.ts" />
/// <reference path="../lib/DefinitelyTyped/App.d.ts" />
/// <reference path="../lib/DefinitelyTyped/Users.d.ts" />

define(() => {
    let Lazyload = <ILazyload>{},
        requireMap: RequireMap[] = [],
        requireMaped: string[] = [],
        requireShim: RequireShim,
        isMap: boolean = false;

    Lazyload.local = document.getElementById('Body').getAttribute('local') ? true : false;
    Lazyload.ec2 = document.getElementById('Body').getAttribute('ec2') ? true : false;
    Lazyload.rootStatic = document.getElementById('Body').getAttribute('data-root-static') || '';
    Lazyload.urlApi = location.origin.search('localhost') <= -1 || location.origin.search(':') <= -1 ? `${location.origin}/userstimeline` : 'http://localhost/userstimeline';

    Lazyload.Set = (object: {}) => {
        let prop: string;

        for (prop in object) Lazyload[prop] = object[prop];
    };

    return Lazyload;
});
