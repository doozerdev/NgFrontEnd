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

        var eOV = function(item) {
            return item ? item.trim() : '';
        };

        Solution.query(function(solutionData) {
            $scope.solutions = solutionData;
        });
        
        User.query(function(userData) {
            $scope.users = userData;
            $scope.active_items = [];
            
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
                    itemId: list.id,
                    userId: user.uid
                    }, function(itemData){
                        $scope.active_items = $scope.active_items.concat($scope.getActiveItems(itemData.items));
                });
            });
        };
        
        $scope.getActiveItems = function(items){
            var temp = [];
            angular.forEach(items, function(item){
                if(item.type==undefined || item.type==""){
                    if(item.archive!=true && item.done!=true){
                        temp.push(item);      
                    }
                }
            });
            console.log("finished getting active items from another list");
            return temp;
        };

        $scope.createSolution = function() {
            var newSolution = new Solution({
                title: eOV($scope.solution.title),
                source: eOV($scope.solution.source),
                price: eOV($scope.solution.price),
                phone_number: eOV($scope.solution.phone_number),
                open_hours: eOV($scope.solution.open_hours),
                link: eOV($scope.solution.link),
                tags: eOV($scope.solution.tags),
                expire_date: $scope.solution.expire_date,
                img_link: eOV($scope.solution.img_link),
                description: eOV($scope.solution.description),
                address: eOV($scope.solution.address),
                notes: eOV($scope.solution.notes),
            });

            Solution.save(newSolution, function(savedSolution) {
                $scope.solutions.push(savedSolution);
                $scope.solution = angular.copy({});
            });
        };

        $scope.removeSolution = function(solution) {
            Solution.delete({id: solution.id}, function(){
                $scope.solutions.splice($scope.solutions.indexOf(solution), 1);
            });
        };
        
        $scope.getItemParent = function(item){
            Item.get({
                itemId: item.parent
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
