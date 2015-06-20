'use strict';

angular.module('webClientApp')
    .controller('UsersCtrl', function($scope, $routeParams, User) {

        User.query(function(userData) {
            $scope.users = userData;
        });
    });
