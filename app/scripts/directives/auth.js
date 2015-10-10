/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Auth directive to handle user login and session info   

mode: either 'login' or 'logout'

retry (optional): the function to call when auth succeeds (e.g. to retry/refresh the data call to populate the page)
                  if parameter not present, then the auth UI will disappear and not change anything else on the page

*/
angular.module('webClientApp')
  .directive('auth', function() {
      return {
        restrict: 'E',
        scope: {
          mode: '@',
          retry: '&'
        },
        templateUrl: 'scripts/directives/auth.html',
        controller: 'AuthCtrl'
      };
  });