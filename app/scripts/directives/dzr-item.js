/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';
/*
Doozer item - directive to render the a user's task in a variety of Expert UI

 item: the item object to render 
 
 */
angular.module('webClientApp')
  .directive('dzrItem', function() {
      return {
        restrict: 'E',
        scope: {
          item: '=',
          checkToggle: '&',
          toggleAction: '&',
          clickAction: '&'
        },
        templateUrl: 'scripts/directives/dzr-item.html'
      };
  });