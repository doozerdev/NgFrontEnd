'use strict';

angular.module('webClientApp')
    .controller('SolutionCtrl', function($scope, $routeParams, Solution, Search) {

        Solution.get({
            id: $routeParams.id
        }, function(solution) {
            $scope.solution = solution;
        });

        Solution.items({
            id: $routeParams.id
        }, function(response) {
            if (response.items)
                $scope.items = response.items;
            else
                $scope.items = [];
        });

        $scope.toggleMap = function(item) {
            if($scope.items.indexOf(item)===-1){
                Solution.mapItem({
                    id: $routeParams.id,
                    itemId: item.id
                }, function(){
                    $scope.items.unshift(item);
                });
            }else{
                Solution.unmapItem({
                    id: $routeParams.id,
                    itemId: item.id
                }, function(){
                    $scope.items.splice($scope.items.indexOf(item), 1);
                });
            }

        }

        $scope.search = function() {
            Search.query({
                searchTerm: $scope.searchTerm.trim()
            }, function(results) {
                $scope.results = results.items;
                $scope.request_time = results.request_time;
            });
        };

    })
