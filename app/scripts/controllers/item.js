'use strict';

angular.module('webClientApp')
    .controller('ItemCtrl', function($scope, $routeParams, Item, Solution) {
        
        $scope.refresh = function () {
            Item.server.get({
                item_id: $routeParams.id
            }, function(item) {
                $scope.item = item;
                            
                Item.server.get({
                    item_id: $scope.item.parent
                }, function(parent){
                    $scope.item.parentTitle = parent.title;              
                });
            });
            
            Item.server.solutions({
                item_id: $routeParams.id
            }, function(solutionsData) {
                $scope.solutions = solutionsData.items;
    
                angular.forEach($scope.solutions, function(sol){
                    Solution.server.view({
                    id: sol.id,
                    item_id: $routeParams.id
                    }, function() {
                    });
                });
            });    
        };
        
    });
