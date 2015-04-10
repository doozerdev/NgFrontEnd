'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webClientApp
 */



angular.module('webClientApp')
    .controller('MainCtrl', function($scope, $cookies, $resource, $facebook, Session, Item) {

        $scope.refresh = function() {
            Item.query(function(listData) {
                var lists = listData.items;
                if (lists) {
                    $scope.username = $cookies.get('username');
                    $scope.loggedIn = true;
                    $scope.lists = lists;
                    $scope.sessionId = $cookies.get('doozerSession');
                } else {
                    $scope.loggedIn = false;
                    $cookies.remove('doozerSession');
                }
            });
        };

        if ($cookies.get('doozerSession')) {
            $scope.refresh();
        }

        $scope.login = function() {
            $facebook.login().then(function(response) {
                Session.login({
                    token: response.authResponse.accessToken
                }, function(result) {
                    $cookies.put('doozerSession', result.sessionId);

                    $facebook.api('/me').then(function(response) {
                        $scope.username = response.name;
                        $cookies.put('username', response.name);
                    });

                    var items = $resource('http://localhost:3000/api/items', null, {
                        query: {
                            headers: {
                                'sessionId': result.sessionId
                            }
                        }
                    });

                    items.query(function(listData) {
                        $scope.lists = listData.items;
                        $scope.username = response.name;
                        $scope.loggedIn = true;
                        $scope.sessionId = result.sessionId;
                    });
                });
            });
        };

        $scope.logout = function() {
            $facebook.logout().then(function() {
                Session.logout(function() {
                    $cookies.remove('doozerSession');
                    $scope.loggedIn = false;
                });
            });
        };

        $scope.addList = function() {
            var newList = {
                title: $scope.newList.trim(),
                completed: false
            };

            if (!newList.title) {
                return;
            }

            var item = new Item();
            item.title = newList.title;

            Item.save(item, function(savedList) {
                $scope.lists.push(savedList);
                $scope.newList = '';
            });
        };

        $scope.removeList = function(idx, item) {

            console.log('removeList');
            Item.get({
                itemId: item.id
            }, function(toUpdate) {
                toUpdate.archive = true;
                toUpdate.$update({
                    itemId: item.id
                });
                Item.children({
                    itemId: item.id
                }, function(listData) {
                    var children = listData.items;
                    angular.forEach(children, function(child) {
                        Item.get({
                            itemId: child.id
                        }, function(toArchive) {
                            toArchive.archive = true;
                            toArchive.$update({
                                itemId: child.id
                            });
                        });
                    });
                    $scope.lists.splice(idx, 1);
                });
            });

            // Item.delete({
            //     itemId: item.id
            // }, function() {
            //     $scope.lists.splice(idx, 1);
            // });
        };

        $scope.editItem = function(item) {
            $scope.editedItem = item;
            // Clone the original item to restore it on demand.
            $scope.originalItem = angular.extend({}, item);
        };

        $scope.saveEdits = function(item) {
            Item.get({
                itemId: item.id
            }, function(toUpdate) {
                toUpdate.title = item.title;
                toUpdate.$update({
                    itemId: item.id
                });
                $scope.editedItem = null;
            });
        };

    });
