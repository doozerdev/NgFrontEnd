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
        $scope.beta_uids = [10153226353173625]; //10206549132149223, 10100937175140396, 4614807584795, 10100716370439739, 10103069913924734]; //dan = 888679437823595, rebecca = 10153226353173625
        $scope.active_items = [];
        $scope.active_beta_items = [];
        $scope.all_items = []; //TODO - unused for now
        $scope.show_beta = true;

        $scope.refresh = function () {
            Solution.query(function(solutionData) {
                $scope.solutions = solutionData;
                
                angular.forEach($scope.solutions, function(solution){
                    Solution.performance({
                            id: solution.id
                        }, function (response) {
                            solution.performance = response;
                        }
                    );
                });
            });
            
            User.query(function(userData) {
                $scope.users = userData;
                        
                angular.forEach($scope.users, function(user) {
                    Item.listsForUser({
                        userId: user.uid
                        }, function(listData) {
                            //$scope.lists = listData.items;
                            var tempbeta = $scope.checkBetaUser(user.uid);
                            $scope.getItemsFromList(listData.items, user, tempbeta);  
                    });
                });            
            });
        };
        
        
        $scope.getItemsFromList = function (lists, user, beta) {
            var tempitems = [];
            angular.forEach(lists, function(list){
                Item.childrenForUser({
                    item_id: list.id,
                    userId: user.uid
                    }, function(itemData){
                        tempitems = $scope.getActiveItems(itemData.items);
                        $scope.active_items = $scope.active_items.concat(tempitems);
                        if (beta){
                            $scope.active_beta_items = $scope.active_beta_items.concat(tempitems);
                        }
                });
            });
        };
        
        $scope.getActiveItems = function (items) {
            var tempactive = [];
            
            angular.forEach(items, function(item) {
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
        
        $scope.checkBetaUser = function (id) {
            for (var i = 0; i < $scope.beta_uids.length; i++) {
                if (id == $scope.beta_uids[i]) {
                    return true;
                }
            };
            return false;
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
