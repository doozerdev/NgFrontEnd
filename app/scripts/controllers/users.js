'use strict';

angular.module('webClientApp')
    .controller('UsersCtrl', function($scope, $routeParams, User) {
        
        $scope.refresh = function () {
            User.query(function(userData) {
                $scope.users = userData;
            });
        };        
    });
