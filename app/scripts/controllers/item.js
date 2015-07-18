'use strict';

angular.module('webClientApp')
    .controller('ItemCtrl', function($scope, $routeParams, Item, Solution) {
        Item.get({
            itemId: $routeParams.id
        }, function(item) {
            $scope.item = item;
            
            Item.get({
                itemId: $scope.item.parent
            }, function(parent){
                $scope.item.parentTitle = parent.title;              
            });
        });
        
        Item.solutions({
            itemId: $routeParams.id
        }, function(solutionsData) {
            $scope.solutions = solutionsData.items;

            angular.forEach($scope.solutions, function(sol){
                Solution.view({
                  id: sol.id,
                  itemId: $routeParams.id
                }, function() {
                });
            });
        });
    });
