'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller: SolutionCtrl
 * @description
 * # SolutionCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
  .controller('SolutionCtrl', function ($scope, $routeParams, Solution) {

    $scope.createSolution = function() {
      var newSolution = {
                title: $scope.solution.title.trim(),
                source: $scope.solution.source.trim(),
                price: $scope.solution.price.trim(),
                phoneNumber: $scope.solution.phoneNumber.trim(),
                openHours: $scope.solution.openHours.trim(),
                link: $scope.solution.link.trim(),
                tags: $scope.solution.tags.trim(),
                expirationDate: $scope.solution.expirationDate.trim(),
                imgLink: $scope.solution.imgLink.trim(),
                description: $scope.solution.description.trim(),
                address: $scope.solution.address.trim(),
                notes: $scope.solution.notes.trim(),
            };
            $scope.solutions.push(newSolution);
    };
});