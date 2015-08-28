'use strict';

angular.module('webClientApp')
    .controller('ItemExpertCtrl', function($scope, $routeParams, Item, Solution) {
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
            if (solutionsData.items){
                $scope.solutions = solutionsData.items;                   
            }
            else{
                $scope.solutions = [];
            }
        });
        
        Solution.query(function(solutionsData) {
            $scope.allsolutions = solutionsData;
        });
        
        
        $scope.toggleMap = function(solution) {
            var index = $scope.checkLink(solution);
            if(index===-1){
                Item.mapSolution({
                    itemId: $routeParams.id,
                    id: solution.id
                }, function(){
                    $scope.solutions.unshift(solution);
                });
            }else{
                /*TODO: add unmapSolution here
                Solution.unmapItem({
                    id: $routeParams.id,
                    itemId: item.id
                }, function(){
                    $scope.items.splice(index, 1);
                });
                */
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
        
    });
