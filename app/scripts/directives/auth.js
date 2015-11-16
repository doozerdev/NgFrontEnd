/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Auth directive to handle user login and session info   

mode: either 'login' or 'logout'

*/
angular.module('webClientApp')
  .directive('auth', function() {
      return {
        restrict: 'E',
        scope: {
          mode: '@'
        },
        templateUrl: 'scripts/directives/auth.html',
        controller: 'AuthCtrl'
      };
  });