/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Create Solution popup - directive to render the solution creation fields in a modular pop-up. 
The directive displays a button in whatever space the directive is inserted. The button launches the modal dialog. 

solutions (optional): the array containing all solutions that this new solutions should be added to

text (optional): override default button text with custom string

mapItem (optional): the item to use in calling map with the newly created solution (if applicable)

*/
angular.module('webClientApp')
  .directive('newSolution', function() {
      return {
        restrict: 'E',
        scope: {
          solutions: '=',
          btnText: '@',
          mapItem: '='
        },
        templateUrl: 'scripts/directives/new-solution.html',
        controller: 'CreateSolutionCtrl'
      };
  });