'use strict';

angular.module('webClientApp')
    .controller('UserCtrl', function($scope, $routeParams, User, Item, Solution) {
        $scope.items = [];
        $scope.solutions = [];
        $scope.lists = [];
        $scope.user = {};

        $scope.refresh = function () {
            User.server.get({
                userId: $routeParams.id
            }, function(userData) {
                $scope.user = userData;
            });
    
            Item.server.listsForUser({
                userId: $routeParams.id
            }, function(listData) {
                $scope.lists = listData.items;
                
                var tempitems = [];
                angular.forEach($scope.lists, function(list){
                    Item.server.childrenForUser({
                        item_id: list.id,
                        userId: $routeParams.id
                        }, function(itemData){
                            tempitems = Item.getActiveItems(itemData.items);
                            console.log("finished getting active items from another list");
                            angular.forEach(tempitems, function(item){
                                item.parentTitle = list.title;
                                if (item.solutions_count > 0){
                                    $scope.getSolutionsForItem(item);
                                }
                            });
                            $scope.items = $scope.items.concat(tempitems);
                    });
                });
            });
            
            /*TODO: this doesn't work because it doesn't accept a user ID - only getting my own solutions back. 
            Solution.server.for_user({
                last_sync: "0"
            }, function (solutionsData) {
                console.log(solutionsData);
            });
            */
        };
        
        $scope.getSolutionsForItem = function(item) {
            Item.server.solutions({
                item_id: item.id
            }, function(solutionsData){
                var tempSolutions = solutionsData.items;
                angular.forEach(tempSolutions, function(solution){
                   Solution.setupState(solution.id, item.id).then(function (result) {
                       solution.item_state = result;
                       $scope.solutions = $scope.solutions.concat(solution);
                   });
                });
            });
        };
    });
