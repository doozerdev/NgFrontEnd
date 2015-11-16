/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Doozer item - directive to render a user's task in a variety of Expert UI

item: the item object to render

user (optional): the user object for this item

mode: a string to control "modes" - visibility of extra properties/functionality for experts or admins
           values: 'user', 'admin-min', 'admin', 'expert'
  
 checkToggle (optional): the function to call to determine whether the checkbox should be checked or unchecked (in context of expert UI, this usually is used for the state of linking between solution & this item)
              value of -1 means that it should be unchecked
              value of number >= 0 means checked
              any other value, or lack of attribute means the checkbox will not be shown
              
 toggleAction (optional): the function to call on checkbox click (in context of expert UI, this usually is used for the state of linking between solution & this item)
 */
angular.module('webClientApp')
  .directive('dzrItem', function() {
      return {
        restrict: 'E',
        scope: {
          item: '=',
          user: '=',
          mode: '@',
          checkToggle: '&',
          toggleAction: '&',
          //clickAction: '&'
        },
        templateUrl: 'scripts/directives/dzr-item.html'
      };
  });