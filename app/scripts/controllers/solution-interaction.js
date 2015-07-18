'use strict';

angular.module('webClientApp')
    .controller('SolutionInterCtrl', function($scope, $routeParams, Solution, Search, Item) {
        $scope.likeSolution = function(sol){
            Solution.like({
              id: sol.id,
              itemId: $routeParams.id
            }, function() {
              alert('liked');
            });
        };

        $scope.dislikeSolution = function(sol){
            Solution.dislike({
              id: sol.id,
              itemId: $routeParams.id
            }, function() {
              alert('disliked');
            });
        };

    });