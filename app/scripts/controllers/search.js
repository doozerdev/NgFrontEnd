'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller: SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
    .controller('SearchCtrl', function($scope, $routeParams, $facebook, $location, Search) {

        $scope.search = function() {
            Search.items.query({
                searchTerm: $scope.searchTerm.trim(),
                field: 'title'
            }, function(results) {
                $scope.results = results.items;
                $scope.request_time = results.request_time;
                $location.path( 'search/'+$scope.searchTerm );
            });
        };

        $facebook.api('/me').then(function(response) {
            $scope.userId = response.id;
        });

        if ($routeParams.searchTerm) {
            $scope.searchTerm = $routeParams.searchTerm;
            $scope.search();
        }
    });
