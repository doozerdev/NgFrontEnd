'use strict';

angular.module('webClientApp')
    .controller('CreateSolutionCtrl', function($scope, $routeParams, Solution) {

        if (!$scope.btnText){
            $scope.btnText = "Create solution";
        }
        
        var eOV = function(item) {
            return item ? item.trim() : '';
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
                if($scope.solutions){
                    $scope.solutions.push(savedSolution);
                }
                console.log(savedSolution);
                if($scope.mapItem){
                    $scope.map(savedSolution, $scope.mapItem);
                }
                $scope.solution = angular.copy({});
            });
        };
        
        $scope.map = function(solution, item){
            Solution.mapItem({
                id: solution.id,
                item_id: item.id
            }, function(out){
                console.log(out);
               //TODO $scope.items.unshift(item);
            });
        }

    });