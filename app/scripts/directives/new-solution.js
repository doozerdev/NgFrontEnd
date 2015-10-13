/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Create Solution popup - directive to render the solution creation fields in a modular pop-up. 
The directive displays a button in whatever space the directive is inserted. The button launches the modal dialog. 

solutions (optional): the array containing all solutions that this new solutions should be added to

btntext (optional): override default button text with custom string

mode (optional): just used to set mode to "expert" for simplifying the creation process for external experts

mapItem (optional): the item to use in calling map with the newly created solution (if applicable)

mappedSolutions (optional): the array containing the solutions mapped to mapItem, to push the new solution into, only if mapItem is provided as well (if applicable)

*/
angular.module('webClientApp')
  .directive('newSolution', function() {
      return {
        restrict: 'E',
        scope: {
          solutions: '=',
          btnText: '@',
          mode: '@',
          mapItem: '=',
          mappedSolutions: '='
        },
        templateUrl: 'scripts/directives/new-solution.html',
        controller: 'CreateSolutionCtrl'
      };
  });