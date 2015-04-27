'use strict';

angular.module('webClientApp')
  .controller('SolutionCtrl', function ($scope, $routeParams, Solution, Search) {

    Solution.get({id: $routeParams.id}, function(solution){
      $scope.solution=solution;
    });

    Solution.items({id: $routeParams.id}, function(response){
      $scope.items=response.items;
    });

    $scope.search = function() {
            Search.query({
                searchTerm: $scope.searchTerm.trim()
            }, function(results) {
                $scope.results = results.items;
                $scope.request_time = results.request_time;
            });
        };
    
}) 