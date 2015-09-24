/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
 Doozer Solution item - directive to render the solution into a template in a variety of Expert UI

 solution: the solution object to render

 [expert]: a string to control expert "modes" - visibility of extra properties/functionality for experts 
 values: 'false', 'true', 'true-min'

 checkToggle: the function to call to determine whether the checkbox should be checked or unchecked (in context of expert UI, this usually is used for the state of linking between solution & item)
 value of -1 means that it should be unchecked
 value of number >= 0 means checked
 any other value, or lack of attribute means the checkbox will not be shown

 toggleAction: the function to call on checkbox click (in context of expert UI, this usually is used for the state of linking between solution & item)

 */
angular.module('webClientApp')
    .directive('dzrSolution', function () {
        return {
            restrict: 'E',
            scope: {
                solution: '=',
                solutionPerf: '=',
                expert: '@',
                checkToggle: '&',
                toggleAction: '&',
                saveEdits: '&'
            },
            templateUrl: 'scripts/directives/dzr-solution.html',
            controller: 'SolutionInterCtrl'
        };
    });