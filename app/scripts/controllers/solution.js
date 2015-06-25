'use strict';

angular.module('webClientApp')
    .controller('SolutionCtrl', function($scope, $routeParams, Solution, Search) {

        Solution.get({
            id: $routeParams.id
        }, function(solution) {
            $scope.solution = solution;
        });

        Solution.items({
            id: $routeParams.id
        }, function(response) {
            if (response.items)
                $scope.items = response.items;
            else
                $scope.items = [];
        });

        $scope.toggleMap = function(item) {
            var index = $scope.checkLink(item);
            if(index===-1){
                Solution.mapItem({
                    id: $routeParams.id,
                    itemId: item.id
                }, function(){
                    $scope.items.unshift(item);
                });
            }else{
                Solution.unmapItem({
                    id: $routeParams.id,
                    itemId: item.id
                }, function(){
                    $scope.items.splice(index, 1);
                });
            }

        };
        
        $scope.checkLink = function(item){
            if(item===null){return -1;}
            if($scope.items.length<1){return -1;}
            
            for (var i = 0; i < $scope.items.length; i++){
                if ($scope.items[i].id===item.id){
                  //console.log("indexOf this result is: "+i);
                  return i;
                }
            }
            //console.log("didn't find this result in linked items");
            return -1;
        };

        $scope.search = function() {
            Search.query({
                searchTerm: $scope.searchTerm.trim()
            }, function(results) {
                $scope.results = results.items;
                $scope.request_time = results.request_time;
            });
        };
        
        $scope.saveSolutionEdits = function(sol){
            Solution.get({id: sol.id}, function(toUpdate) {
                toUpdate.tags = sol.tags;
                toUpdate.link = sol.link;
                toUpdate.imgLink = sol.imgLink;
                toUpdate.expireDate = sol.expireDate;
                toUpdate.notes = sol.notes;
                toUpdate.title = sol.title;
                toUpdate.source = sol.source;
                toUpdate.price = sol.price;
                toUpdate.phoneNumber = sol.phoneNumber;
                toUpdate.openHours = sol.openHours;
                toUpdate.address = sol.address;
                toUpdate.description = sol.description;
                toUpdate.$update({id: sol.id}, function(updated){
                    console.log("solution saved: ");
                    console.log(updated);
                });
            });  
        };

    });
