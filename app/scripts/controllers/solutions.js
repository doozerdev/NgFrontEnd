'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller: SolutionCtrl
 * @description
 * # SolutionCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
    .controller('SolutionsCtrl', function($scope, $routeParams, Solution, Search, Item, User) {
        $scope.solutions = [];
        $scope.users = [];
        $scope.active_items = [];
        $scope.all_items = []; //TODO - unused for now

        Solution.query(function(solutionData) {
            $scope.solutions = solutionData;
        });
        
        User.query(function(userData) {
            $scope.users = userData;
                       
            angular.forEach($scope.users, function(user) {
                Item.listsForUser({
                    userId: user.uid
                    }, function(listData) {
                        $scope.lists = listData.items;
                                                
                        $scope.getItemsFromList($scope.lists, user);
                });
            });            
        });
        
        $scope.getItemsFromList = function(lists, user){
            angular.forEach(lists, function(list){
                Item.childrenForUser({
                    item_id: list.id,
                    userId: user.uid
                    }, function(itemData){
                        $scope.active_items = $scope.active_items.concat($scope.getActiveItems(itemData.items));
                });
            });
        };
        
        $scope.getActiveItems = function(items){
            var tempactive = [];
            
            angular.forEach(items, function(item){
                if(item.type==undefined || item.type==""){
                    //TODO:make all items, included done item accessible for analysis
                    // $scope.all_items.push(item);
                    
                    if(item.archive!=true && item.done!=true){
                        tempactive.push(item);      
                    }
                }
            });
            console.log("finished getting active items from another list");
            return tempactive;
        };

        $scope.removeSolution = function(solution) {
            Solution.delete({id: solution.id}, function(){
                $scope.solutions.splice($scope.solutions.indexOf(solution), 1);
            });
        };
        
        $scope.getItemParent = function(item){
            Item.get({
                item_id: item.parent
            }, function(parent){
                item.parentTitle = parent.title;
            });
        };
        
        $scope.search = function() {
            if($scope.searchTerm.trim()==""){
                $scope.item_results = undefined;
                $scope.item_request_time = "";
                $scope.solution_results = undefined;
                return;
            }
            
            Search.query({
                searchTerm: $scope.searchTerm.trim()
            }, function(results) {
                $scope.item_results = results.items;
                $scope.item_request_time = results.request_time;
                
                $scope.solution_results = true;
                
                for (var i=$scope.item_results.length-1; i >= 0; i--) {
                    if (!$scope.item_results[i].parent){
                        var temp = $scope.item_results.splice(i, 1);
                        console.log("skipped list: ");
                        console.log(temp);
                    }
                    else{
                        $scope.getItemParent($scope.item_results[i]);                      
                    }
                }
            });
        };
    });
