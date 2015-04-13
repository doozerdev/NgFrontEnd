'use strict';

/**
 * @ngdoc overview
 * @name webClientApp
 * @description
 * # webClientApp
 *
 * Main module of the application.
 */

angular.module('webClientApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngFacebook',
        'ui.sortable',
    ])
    .config(function($routeProvider, $facebookProvider) {
        $facebookProvider.setAppId(1474823829455959);

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    // session: function(doozerSession) {
                    //     // Get the correct module (API or localStorage).
                    //     return doozerSession;
                    // },
                    store: function(doozerList) {
                        return doozerList;
                    }
                }
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })
            .when('/search/:searchTerm', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })
            .when('/solution', {
                templateUrl: 'views/solution.html',
                controller: 'SolutionCtrl'
            })
            .when('/solution/:id',{
                templateUrl: 'views/applySolution.html',
                controller: 'ApplySolutionCtrl'
            })
            .when('/:id', {
                templateUrl: 'views/list.html',
                controller: 'ListCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

.run(function() {

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
});
