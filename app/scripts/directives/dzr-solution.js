/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
 Doozer Solution item - directive to render the solution as the user will see it. 
 It will also show relevant stats for Experts/Admins, and allow for linking to tasks, if both functionality provided by caller

 solution: the solution object to render

 mode (optional): a string to control expert "modes" - visibility of extra properties/functionality for experts 
        values: 'user', 'admin', 'admin-min', 'expert'

 checkToggle (optional): the function to call to determine whether the checkbox should be checked or unchecked 
        (in context of expert UI, this usually is used for the state of linking between solution & item)
        value of -1 means that it should be unchecked
        value of number >= 0 means checked
        any other value, or lack of attribute means the checkbox will not be shown

 toggleAction (optional): the function to call on checkbox click 
        (in context of expert UI, this usually is used for the state of linking between solution & item)
        only used if checkToggle is also present

 */
angular.module('webClientApp')
    .directive('dzrSolution', function () {
        return {
            restrict: 'E',
            scope: {
                solution: '=',
                mode: '@',
                checkToggle: '&',
                toggleAction: '&'
            },
            templateUrl: 'scripts/directives/dzr-solution.html',
            controller: 'SolutionInterCtrl'
        };
    });