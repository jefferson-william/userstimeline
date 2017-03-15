/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/moment/moment.d.ts" />

define([
    'App',
], (app: ng.IModule) => {

    class MomentFilter {
        constructor () {
            return (input, momentFormat) => {
                if (!input) return '';

                momentFormat = momentFormat || 'L HH:mm';

                let justDate = /00:00\+00:00/.test(input);
                let useUtcDate = justDate;
                let momentInput = moment(input);

                if (useUtcDate) {
                    return momentInput.utc().format(momentFormat);
                } else {
                    return momentInput.format(momentFormat);
                }
            }
        }
    }

    app.filter('moment', MomentFilter);

    return MomentFilter;
});
