'use strict';

angular.module('webClientApp')
    .controller('ItemExpertCtrl', function($scope, $routeParams, Item, Solution) {
        $scope.solutions = [];
        $scope.allsolutions = [];
        
        Item.get({
            item_id: $routeParams.id
        }, function(item) {
            $scope.item = item;
                        
            Item.get({
                item_id: $scope.item.parent
            }, function(parent){
                $scope.item.parentTitle = parent.title;              
            });
        });
        
        Item.solutions({
            item_id: $routeParams.id
        }, function(solutionsData) {
            if (solutionsData.items){
                $scope.solutions = solutionsData.items;
                console.log("got all solutions");
                console.log($scope.solutions);  
                console.log(solutionsData);             
            }
            else{
                console.log("no linked solutions");
                $scope.solutions = [];
            }
        });
        
        Solution.query(function(solutionsData) {
            $scope.allsolutions = solutionsData;
        });
        
        
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
            Solution.mapItem({
                id: solution.id,
                item_id: $routeParams.id
            }, function(){
                $scope.solutions.unshift(solution);
            });
        };
        
        $scope.unmap = function(solution, index){
            Solution.unmapItem({
                id: solution.id,
                item_id: $routeParams.id
            }, function(){
                $scope.solutions.splice(index, 1);
            });
        };
        
    });
