/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Solution Edit - directive to render the solution creation/editing fields in an expanded area. 
The directive displays a button in whatever space the directive is inserted. The button expands inplace into a full panel. 

solution (optional): if editing an existing solution, pass that solution in (if not provided, this is creating a new solution)
    if provided, directive shows existing properties and saves edits automatically, instead of creating a new one with a commit button
    must set mode="edit" as well

btntext (optional): override default button text with custom string

mode (optional): used to specify the following behavior differences: 
    "expert" mode simplifies the creation process for external experts creating a new solution
    "edit" sets to editing an existing solution (not creating new) - must include solution as well

solutions (optional): the array containing all solutions that this new solutions should be added to, if new solution being created

mapItem (optional): the item to use in calling map with the newly created solution (if applicable)

mappedSolutions (optional): the array containing the solutions mapped to mapItem, to push the new solution into, 
    only if mapItem is provided as well (if applicable)

*/
angular.module('webClientApp')
  .directive('dzrSolutionEdit', function() {
      return {
        restrict: 'E',
        scope: {
          solution: '=',
          btnText: '@',
          mode: '@',
          solutions: '=',
          mapItem: '=',
          mappedSolutions: '='
        },
        templateUrl: 'scripts/directives/dzr-solution-edit.html',
        controller: 'EditSolutionCtrl'
      };
  });