/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Doozer Solution item - directive to render the solution into a template in a variety of Expert UI

 @param [solution] the solution object to render 
 [expert] a string either true or false to show extra properties/functionality for experts
 */
angular.module('webClientApp')
  .directive('dzrSolution', function() {
      return {
        restrict: 'E',
        scope: {
          solution: '=',
          expert: '@'
        },
        templateUrl: 'scripts/directives/dzr-solution.html'
      };
  });