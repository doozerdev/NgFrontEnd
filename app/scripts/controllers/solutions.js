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
        $scope.active_beta_items = [];
        $scope.all_items = []; //TODO - unused for now
        $scope.show_beta = true;

        $scope.refresh = function () {
            Solution.server.query(function(solutionData) {
                $scope.solutions = solutionData;
                
                angular.forEach($scope.solutions, function(solution){
                    Solution.server.performance({
                            id: solution.id
                        }, function (response) {
                            solution.performance = response;
                        }
                    );
                });
            });
            
            User.server.query(function(userData) {
                $scope.users = userData;
                        
                angular.forEach($scope.users, function(user) {
                    Item.server.listsForUser({
                        userId: user.uid
                        }, function(listData) {
                            //$scope.lists = listData.items;
                            var tempbeta = User.checkBetaUser(user.uid);
                            $scope.getItemsFromLists(listData.items, user, tempbeta);  
                    });
                });            
            });
        };
        
        
        $scope.getItemsFromLists = function (lists, user, beta) {
            var tempitems = [];
            angular.forEach(lists, function(list){
                Item.server.childrenForUser({
                    item_id: list.id,
                    userId: user.uid
                    }, function(itemData){
                        tempitems = Item.getActiveItems(itemData.items);
                        console.log("finished getting active items from another list");
                        $scope.active_items = $scope.active_items.concat(tempitems);
                        if (beta){
                            $scope.active_beta_items = $scope.active_beta_items.concat(tempitems);
                        }
                });
            });
        };

        

        $scope.removeSolution = function(solution) {
            Solution.server.delete({id: solution.id}, function(){
                $scope.solutions.splice($scope.solutions.indexOf(solution), 1);
            });
        };
        
        $scope.getItemParent = function(item){
            Item.server.get({
                item_id: item.parent
            }, function(parent){
                item.parentTitle = parent.title;
            });
        };
        
        $scope.search = function() {
            if($scope.searchTerm.trim() == ""){
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
                
                //TODO: also check here for results belonging to beta users (item.user_id) and build 2 lists for all users vs. beta users
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
