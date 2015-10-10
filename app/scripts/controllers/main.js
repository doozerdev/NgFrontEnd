'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webClientApp
 */



angular.module('webClientApp')
    .controller('MainCtrl', function($scope, $cookies, Item) {
        
        $scope.refresh = function() {
            // Item.items({
            //     last_sync: "1433740362" 
            // },

            Item.lists(
                function(listData) {
                    $scope.lists = listData.items;
                    $scope.username = $cookies.get('username');
                }, function (error) {
                    if (error.status == 401) {
                        //TODO replace this with a logout/cleanup call?? or remove entirely? 
                        console.log('got a 401 on refresh - should have already been caught by checkSession!!');
                    }
                }
            );
        };


        $scope.addList = function() {
            var newList = {
                title: $scope.newList.trim(),
                archive: false
            };

            if (!newList.title) {
                return;
            }

            var item = new Item();
            item.title = newList.title;
            item.archive = newList.archive;    

            Item.save(item, function(savedList) {
                $scope.lists.push(savedList);
                $scope.newList = '';
            });
        };

        $scope.removeList = function(item) {
            Item.archive({item_id: item.id}, function(){
                $scope.lists.splice($scope.lists.indexOf(item), 1);
            });

            // console.log('removeList');
            // Item.get({
            //     item_id: item.id
            // }, function(toUpdate) {
            //     toUpdate.archive = true;
            //     toUpdate.$update({
            //         item_id: item.id
            //     });
            //     Item.children({
            //         item_id: item.id
            //     }, function(listData) {
            //         var children = listData.items;
            //         angular.forEach(children, function(child) {
            //             Item.get({
            //                 item_id: child.id
            //             }, function(toArchive) {
            //                 toArchive.archive = true;
            //                 toArchive.$update({
            //                     item_id: child.id
            //                 });
            //             });
            //         });
            //         $scope.lists.splice($scope.items.indexOf(item), 1);
            //     });
            // });
        };

        $scope.editItem = function(item) {
            $scope.editedItem = item;
            // Clone the original item to restore it on demand.
            $scope.originalItem = angular.extend({}, item);
        };

        $scope.saveEdits = function(item) {
            Item.get({
                item_id: item.id
            }, function(toUpdate) {
                toUpdate.title = item.title;
                toUpdate.$update({
                    item_id: item.id
                });
                $scope.editedItem = null;
            });
        };

    });
