'use strict';

angular.module('webClientApp')
    .controller('ItemExpertCtrl', function($scope, $routeParams, Item, Solution, User) {
        $scope.solutions = [];
        $scope.allsolutions = [];
        $scope.item = null; 
        $scope.user = null;
        
        $scope.refresh = function () {
            Item.get({
                item_id: $routeParams.id
            }, function(item) {
                $scope.item = item;
                            
                Item.get({
                    item_id: $scope.item.parent
                }, function(parent){
                    $scope.item.parentTitle = parent.title;              
                });
                
                User.get({
                    userId: $scope.item.user_id
                }, function(userData) {
                    $scope.user = userData;
                });
            });
            
            Item.solutions({
                item_id: $routeParams.id
            }, function(solutionsData) {
                if (solutionsData.items){
                    $scope.solutions = solutionsData.items;
                    
                    angular.forEach($scope.solutions, function (solution) {
                        $scope.getState(solution);
                    });
                }
                else{
                    $scope.solutions = [];
                }
            });
            
            Solution.query(function(solutionsData) {
                $scope.allsolutions = solutionsData;
            });
        };

        $scope.getState = function(solution) {
            Solution.state({
                    id: solution.id,
                    item_id: $routeParams.id
                }, function (response) {
                    solution.item_state = response;

                    if (solution.item_state.like > 0) {
                        solution.item_state.current = "Liked";
                    }
                    else if (solution.item_state.like < 0) {
                        solution.item_state.current = "Disliked";
                    }
                    else if (solution.item_state.views > 0) {
                        solution.item_state.current = "Viewed";
                    }
                    else {
                        solution.item_state.current = "Unseen";
                    }
                }, function (error) {
                    if (error.status == 404) {
                        solution.item_state = {};
                        solution.item_state.current = "Unseen";
                        solution.item_state.like = 0;
                        solution.item_state.clicks = 0;
                        solution.item_state.views = 0;
                    }
                }
            );
        };

        $scope.toggleMap = function(solution) {
            var index = $scope.checkLink(solution);
            if(index===-1){
                $scope.map(solution);
            }else{
                $scope.unmap(solution, index);
            }
        };
        
        $scope.checkLink = function(solution){
            if(solution===null){return -1;}
            if($scope.solutions.length<1){return -1;}
            
            for (var i = 0; i < $scope.solutions.length; i++){
                if ($scope.solutions[i].id===solution.id){
                  //console.log("indexOf this result is: "+i);
                  return i;
                }
            }
            //console.log("didn't find this result in linked items");
            return -1;
        };
        
        $scope.map = function(solution){
            Item.mapSolution({
                solution_id: solution.id,
                item_id: $routeParams.id
            }, function(){
                $scope.solutions.unshift(solution);
            });
        };
        
        $scope.unmap = function(solution, index){
            Item.unmapSolution({
                solution_id: solution.id,
                item_id: $routeParams.id
            }, function(){
                $scope.solutions.splice(index, 1);
            });
        };
        
    });
