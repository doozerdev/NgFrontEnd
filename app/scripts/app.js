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
    .config(function($routeProvider, $facebookProvider, $httpProvider) {
        //$facebookProvider.setAppId(1474823829455959); //prod
        //$facebookProvider.setAppId(1637385519866455); //beta
        $facebookProvider.setAppId(1637385749866432); //test
        //$facebookProvider.setAppId(1615408935397447); //dev

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
                templateUrl: 'views/solutions.html',
                controller: 'SolutionsCtrl'
            })
            .when('/alltasks', {
                templateUrl: 'views/alltasks.html',
                controller: 'SolutionsCtrl'
            })
            .when('/solution/:id', {
                templateUrl: 'views/solution.html',
                controller: 'SolutionCtrl'
            })
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'UsersCtrl'
            }).when('/user/:id', {
                templateUrl: 'views/user.html',
                controller: 'UserCtrl'
            }).when('/:id', {
                templateUrl: 'views/list.html',
                controller: 'ListCtrl'
            }).when('/:id/item',{
                templateUrl: 'views/item.html',
                controller: 'ItemCtrl'
            }).when('/:id/itemexpert',{
                templateUrl: 'views/itemexpert.html',
                controller: 'ItemExpertCtrl'
            }).when('/:id/itemadmin',{
                templateUrl: 'views/itemadmin.html',
                controller: 'ItemExpertCtrl'
            }).otherwise({
                redirectTo: '/'
            });

        /* Intercepts all server call rejections to act on 401 unauthorized and retry login */
        $httpProvider.interceptors.push(function($rootScope, $q) {
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        var deferred = $q.defer();
                        
                        $rootScope.httpRetryBuffer.push({
                            config: rejection.config,
                            deferred: deferred
                        });
                        $rootScope.$broadcast("dzr-loginRequired");
                        return deferred.promise;
                    }
                    // if a non-401 error, send it back to caller to handle
                    return $q.reject(rejection);
                }
            };
        });
        
    })
//.constant('doozerURL','https://api.doozer.tips/api/')
//.constant('doozerURL','http://api.beta.doozer.tips/api/')
.constant('doozerURL','http://api.test.doozer.tips/api/')
//.constant('doozerURL','http://localhost:3000/api/')

.run(function($rootScope) {
    
    //Initialize the http retry buffer for future failed-401 calls that we want to retry
    $rootScope.httpRetryBuffer = [];

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
