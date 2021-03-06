'use strict';

angular.module('webClientApp')
    .controller('UserCtrl', function($scope, $routeParams, User, Item) {

        User.get({
            userId: $routeParams.id
        }, function(userData) {
            $scope.user = userData;
        });

        Item.listsForUser({
          userId: $routeParams.id
        }, function(listData) {
          $scope.lists = listData.items;
        })
    });
