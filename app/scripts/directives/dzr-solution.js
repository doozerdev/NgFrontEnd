/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Doozer Solution item - directive to render the solution into a template in a variety of Expert UI

 solution: the solution object to render 
 [expert]: a string to control expert "modes" - visibility of extra properties/functionality for experts (values: 'false', 'true', 'true-min')
 */
angular.module('webClientApp')
  .directive('dzrSolution', function() {
      return {
        restrict: 'E',
        scope: {
          solution: '=',
          expert: '@',
          saveEdits: '&'
        },
        templateUrl: 'scripts/directives/dzr-solution.html'
      };
  });