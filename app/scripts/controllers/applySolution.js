'use strict';

angular.module('webClientApp')
  .controller('ApplySolutionCtrl', function ($scope, $routeParams, Solution) {

    Solution.get({id: $routeParams.id}, function(solution){
      $scope.solution=solution;
    });
})