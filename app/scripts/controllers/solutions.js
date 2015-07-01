'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller: SolutionCtrl
 * @description
 * # SolutionCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
    .controller('SolutionsCtrl', function($scope, $routeParams, Solution) {

        var eOV = function(item) {
            return item ? item.trim() : '';
        };

        Solution.query(function(solutionData) {
            $scope.solutions = solutionData;
        });

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
    });
