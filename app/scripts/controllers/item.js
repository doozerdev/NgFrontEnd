'use strict';

angular.module('webClientApp')
    .controller('ItemCtrl', function($scope, $routeParams, Item) {
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
