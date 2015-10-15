'use strict';

angular.module('webClientApp')
    .controller('SolutionCtrl', function ($scope, $routeParams, Solution, Search, Item) {

        $scope.refresh = function () {
            Solution.get({
                id: $routeParams.id
            }, function (solution) {
                $scope.solution = solution;
                $scope.solution.expire_date = new Date($scope.solution.expire_date);
            });
    
            Solution.items({
                id: $routeParams.id
            }, function (response) {
                if (response.items) {
                    $scope.items = response.items;
    
                    angular.forEach($scope.items, function (item) {
                        $scope.getParent(item);
                        $scope.getState(item);
                    });
                }
                else {
                    $scope.items = [];
                }
            });
    
            Solution.performance({
                    id: $routeParams.id
                }, function (response) {
                    $scope.solution_performance = response;
                }
            );
        };

        $scope.getParent = function (item) {
            Item.get({
                item_id: item.parent
            }, function (parent) {
                item.parentTitle = parent.title;
                //console.log("done with "+item.parentTitle);
            });
        };

        $scope.getState = function(item) {
            Solution.state({
                    id: $routeParams.id,
                    item_id: item.id
                }, function (response) {
                    item.solution_state = response;
                    
                    if (item.solution_state.like > 0) {
                        item.solution_state.current = "Liked";
                    }
                    else if (item.solution_state.like < 0) {
                        item.solution_state.current = "Disliked";
                    }
                    else if (item.solution_state.views > 0) {
                        item.solution_state.current = "Viewed";
                    }
                    else {
                        item.solution_state.current = "Unseen";
                    }
                }, function (error) {
                    if (error.status == 404) {
                        item.solution_state = {};
                        item.solution_state.current = "Unseen";
                        item.solution_state.like = 0;
                        item.solution_state.clicks = 0;
                        item.solution_state.views = 0;
                    }
                }
            );
        };

        $scope.toggleMap = function (item) {
            var index = $scope.checkLink(item);
            if (index === -1) {
                Solution.mapItem({
                    id: $routeParams.id,
                    item_id: item.id
                }, function () {
                    $scope.items.unshift(item);
                });
            } else {
                Solution.unmapItem({
                    id: $routeParams.id,
                    item_id: item.id
                }, function () {
                    $scope.items.splice(index, 1);
                });
            }

        };

        $scope.checkLink = function (item) {
            if (item === null) {
                return -1;
            }
            if ($scope.items.length < 1) {
                return -1;
            }

            for (var i = 0; i < $scope.items.length; i++) {
                if ($scope.items[i].id === item.id) {
                    //console.log("indexOf this result is: "+i);
                    return i;
                }
            }
            //console.log("didn't find this result in linked items");
            return -1;
        };


        $scope.search = function () {
            if ($scope.searchTerm.trim() == "") {
                $scope.results = undefined;
                $scope.request_time = "";
                return;
            }

            Search.query({
                searchTerm: $scope.searchTerm.trim()
            }, function (results) {
                $scope.results = results.items;
                $scope.request_time = results.request_time;

                for (var i = $scope.results.length - 1; i >= 0; i--) {
                    if (!$scope.results[i].parent) {
                        var temp = $scope.results.splice(i, 1);
                        console.log("skipped list: ");
                        console.log(temp);
                    }
                    else {
                        $scope.getParent($scope.results[i]);
                    }
                }
            });
        };

        //TODO: move this to solution-interaction.js and then no need to pass it as an attribute to the directive
        $scope.saveSolutionEdits = function (sol) {
            Solution.get({id: sol.id}, function (toUpdate) {
                toUpdate.tags = sol.tags;
                toUpdate.link = sol.link;
                toUpdate.img_link = sol.img_link;
                toUpdate.expire_date = sol.expire_date;
                toUpdate.notes = sol.notes;
                toUpdate.title = sol.title;
                toUpdate.source = sol.source;
                toUpdate.price = sol.price;
                toUpdate.phone_number = sol.phone_number;
                toUpdate.open_hours = sol.open_hours;
                toUpdate.address = sol.address;
                toUpdate.description = sol.description;
                toUpdate.$update({id: sol.id}, function (updated) {
                    console.log("solution saved: ");
                    console.log(updated);
                });
            });
        };

    });
