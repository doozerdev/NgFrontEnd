'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller: SolutionCtrl
 * @description
 * # SolutionCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
    .controller('SolutionsCtrl', function($scope, $location, Solution, Search, Item, User) {
        $scope.solutions = [];
        $scope.users = [];
        $scope.active_items = []; //TODO: unused for now
        $scope.active_beta_items = [];
        $scope.all_items = [];
        $scope.show_beta = true;
        //search related objects:
        $scope.item_results = undefined;
        $scope.item_request_time = "";
        $scope.solution_results = undefined;
        $scope.solution_request_time = "";
        $scope.searchField = {items: "title", solutions: "title"};
        $scope.searchTerm = undefined;

        if ($location.path() != "/alltasks") {
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
                var tempusers = userData;
                console.log("total users including test accounts: "+tempusers.length);
                
                User.getTestIds().then(function (response) {
                    var tempTestIds = [];
                    tempTestIds = tempTestIds.concat(response);
                    var b = null;
                    
                    angular.forEach(tempusers, function(user) {
                        if(tempTestIds.length > 0){
                            b = $scope.sortHelper(user.uid, tempTestIds);
                            if (b == -1){
                                $scope.users.push(user);
                                Item.server.listsForUser({
                                    userId: user.uid
                                    }, function(listData) {
                                        $scope.getItemsFromLists(listData.items, user, true, true, true);  
                                });
                            } else {
                                tempTestIds.splice(b, 1);
                                console.log("skipping test user");
                            }
                        } else {
                            $scope.users.push(user);
                            Item.server.listsForUser({
                                userId: user.uid
                                }, function(listData) {
                                    $scope.getItemsFromLists(listData.items, user, true, true, true);  
                            });
                        }
                    });
                });
            });
        }


        if ($location.path() == "/alltasks") {            
            User.server.query(function(userData) {
                $scope.users = userData;
                console.log($scope.users.length);
                angular.forEach($scope.users, function(user) {
                    if(!User.checkTestUser(user.uid)){
                        Item.server.listsForUser({
                            userId: user.uid
                            }, function(listData) {
                                $scope.getItemsFromLists(listData.items, user, false, false, true);  
                        });
                    } else {
                        console.log("skipping test user");
                    }
                });            
            });
        }


        $scope.sortHelper = function (checkId, checkList)  {
            for(var b = 0; b < checkList.length; b++){
                if(checkId == checkList[b]){
                    return b;
                }
            };
            return -1;
        };
        
        $scope.getItemsFromLists = function (lists, user, beta, activeOnly, getparent) {
            var tempitems = [];
            angular.forEach(lists, function(list){
                Item.server.childrenForUser({
                    item_id: list.id,
                    userId: user.uid
                    }, function(itemData){
                        if(activeOnly){
                            tempitems = Item.getActiveItems(itemData.items);
                            console.log("finished getting active items from another list");
                            if(getparent){
                                angular.forEach(tempitems, function(item){
                                    item.parentTitle = list.title;
                                });
                            }
                            $scope.active_items = $scope.active_items.concat(tempitems);
                            if (beta){
                                $scope.active_beta_items = $scope.active_beta_items.concat(tempitems);
                            }                            
                        } else {
                            tempitems = itemData.items;
                            if(getparent){
                                angular.forEach(tempitems, function(item){
                                    item.parentTitle = list.title;
                                });
                            }
                            $scope.all_items = $scope.all_items.concat(tempitems);
                            console.log("finished getting ALL items from another list");
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
                $scope.clearSearch();
                return;
            }
            
            Search.items.query({
                searchTerm: $scope.searchTerm.trim(),
                field: $scope.searchField.items
            }, function(results) {
                $scope.item_results = results.items;
                $scope.item_request_time = results.request_time;
                
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
            
            Search.solutions.query({
                searchTerm: $scope.searchTerm.trim(),
                field: $scope.searchField.solutions
            }, function (results) {
                $scope.solution_results = results.solutions;
                $scope.solution_request_time = results.request_time;
            });
        };
        
        $scope.clearSearch = function () {
            //console.log("entered clear search");
            $scope.searchTerm = "";
            $scope.item_results = undefined;
            $scope.solution_results = undefined;
            //console.log("finished clear search");
        };
        
        $scope.setSearchField = function (field) {
            if (field == "titles") {
                $scope.searchField = {items: "title", solutions: "title"};
            } else if (field == "notes") {
                $scope.searchField = {items: "notes", solutions: "description"};
            } else if (field == "tags") {
                $scope.searchField = {items: "tags", solutions: "tags"};
            } else {
                console.log("search field set to unknown property name");
            }
        };

    });
