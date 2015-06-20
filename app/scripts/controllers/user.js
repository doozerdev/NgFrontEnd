'use strict';

angular.module('webClientApp')
    .controller('UserCtrl', function($scope, $routeParams, User) {

        User.get({
            userId: $routeParams.id
        }, function(userData) {
          console.log('hey');
          console.log($routeParams.id);
            $scope.user = userData;
        });
    });
