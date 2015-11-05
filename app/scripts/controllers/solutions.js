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
                                        $scope.getItemsFromLists(listData.items, user, true, true, false);  
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
                                    $scope.getItemsFromLists(listData.items, user, true, true, false);  
                            });
                        }
                    });
                });
            });
        }
            /*TODO: remove OLD functionality when sure no longer needed: this is for only getting a subset of hardcoded 'beta users'
            $scope.users = User.getBetaIds();
            angular.forEach($scope.users, function(user, index) {
                User.server.get({
                    userId: user
                }, function(response){
                    $scope.users[index] = response;
                    Item.server.listsForUser({
                        userId: $scope.users[index].uid
                        }, function(listData) {
                            $scope.getItemsFromLists(listData.items, $scope.users[index], true, true);  
                    }); 
                });
            });
            */
            


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
