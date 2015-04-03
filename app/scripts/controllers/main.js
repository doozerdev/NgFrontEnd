'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webClientApp
 */



angular.module('webClientApp')
  .controller('MainCtrl', function ($scope, $cookies, $facebook, session, Item) {

    var refresh = function(){
      var listData = Item.query(function() {
        var lists = listData.items;
        if(lists)
        {
          $facebook.api('/me').then(function(response) {
            $scope.username = response.name;
            $scope.loggedIn = true;
            $scope.lists = lists;
            $scope.loggedIn = true;
            $scope.sessionId = $cookies.doozerSession;
          });
        }
        else
        {
          $scope.loggedIn = false;
          $cookies.doozerSession = '';
        }
      });
    };

    if($cookies.doozerSession)
    {
      refresh();
    }

    $scope.login = function() {
      $facebook.login().then(function(response) {
        session.login(response.authResponse.accessToken).$promise.then(function (session){
          $scope.sessionId = session.sessionId;
          $cookies.doozerSession = session.sessionId;
          refresh();
        });
      });
    };

    $scope.logout = function() {
      $facebook.logout().then(function() {
        session.logout().$promise.then(function(){
          $cookies.doozerSession = '';
          $scope.loggedIn = false;  
        });
      });
    };

    $scope.addList = function () {
      var newList = {
        title: $scope.newList.trim(),
        completed: false
      };

      if (!newList.title) {
        return;
      }

      var item = new Item();
      item.title = newList.title;

      Item.save(item, function(savedList){
        $scope.lists.push(savedList);
        $scope.newList = '';
      });
    };

    $scope.removeList = function(idx, item) {
      Item.delete({itemId: item.id}, function() {
        $scope.lists.splice(idx, 1);
      });
    };

    $scope.editItem = function (item) {
      $scope.editedItem = item;
      // Clone the original item to restore it on demand.
      $scope.originalItem = angular.extend({}, item);
    };

    $scope.saveEdits = function(item) {
      Item.get({itemId: item.id}, function(toUpdate) {
        toUpdate.title = item.title;
        toUpdate.$update({itemId: item.id});
        $scope.editedItem = null;
      });
    };

  });
