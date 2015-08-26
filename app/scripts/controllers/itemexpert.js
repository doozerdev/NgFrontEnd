'use strict';

angular.module('webClientApp')
    .controller('ItemExpertCtrl', function($scope, $routeParams, Item, Solution) {
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
        });
    });
