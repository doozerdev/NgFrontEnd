/// <reference path="../../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc function
 * @name webClientApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the webClientApp
 */
angular.module('webClientApp')
  .controller('ListCtrl', function ($scope, $routeParams, Item) {
    
    var step = 33554432; //assume about 63 items per list optimally
    var max = 2147483647; //maxIn32
    
    var isDoneGroupOpen = false; 
    //TODO: fix this (git hub issue #8). toggling isDoneGroupOpen on ng-click has issues (e.g. double-click is taken as 2 clicks). 
    //Instead, I tried to get isDoneGroupOpen toggling to happen on the js events, but it didn't work...
//    $('.donecollapse').on('shown.bs.collapse', function () {
//     isDoneGroupOpen = true;
//     console.log("shown event "+ isDoneGroupOpen);
//    });
//    $('.donecollapse').on('hidden.bs.collapse', function () {
//      isDoneGroupOpen = false;
//      console.log("hidden event "+ isDoneGroupOpen);
//    });

    Item.children({itemId: $routeParams.id}, function(listData) {
        $scope.items = listData.items;
        $scope.list = Item.get({itemId: $routeParams.id});

        var greatest = -1;
        angular.forEach($scope.items, function(item) {
          if(item.order && item.order > greatest){
            greatest = item.order;
          }
        });

        //nothing has a sort order
        if(greatest === -1){
           Sorting.reorderList($scope.items);
        }
    });

    var Sorting = {

      persistItem: function(item){
        Item.get({itemId: item.id}, function(toUpdate) {
          toUpdate.order = item.order;
          toUpdate.$update({itemId: item.id});
          console.log('saved item: ' + item.title + ' new order: ' + item.order);
        });
      },

      move: function(items, newIndex){
        if (items.length === 1){
          items[0].order = step;
          Sorting.persistItem(items[0]);          
        }
        else if(0 === newIndex){
          if(items[1].order > 2){
            items[newIndex].order = Math.floor(items[1].order/2);
            Sorting.persistItem(items[newIndex]);
          }else{
            items[newIndex].order = 0;
            //don't call persist here, reorder will do it
            Sorting.reorderList(items);
          }
        }else if(newIndex === items.length-1){
          //can we just add it to the end?
          if(items[items.length-2].order + step < max){
            items[newIndex].order = items[items.length-2].order+step;
            Sorting.persistItem(items[newIndex]);
          }//add it right after the last value and reorder list
          else{ 
            items[newIndex].order = items[items.length-2].order+1;
            //don't call persist here, reorder will do it
            Sorting.reorderList(items);
          }
        }else{
          var difference = items[newIndex+1].order - items[newIndex-1].order;
          if(difference > 3){
            var newOrder = items[newIndex-1].order + Math.floor(difference/2);
            items[newIndex].order = newOrder;
            Sorting.persistItem(items[newIndex]);
          }else{
            items[newIndex].order = items[newIndex-1].order+1;
            Sorting.reorderList(items);
          }
        }
        return items;
      },

      reorderList: function(items){
        var newStep = step;
        console.log('reorderList');
        if((items.length-1) * step > max){
          newStep = Math.floor(max/items.length);
        }

        var current = newStep;

        angular.forEach(items, function(item){
          item.order = current;
          Sorting.persistItem(item);
          current = current + newStep;
        });
        return items;
      },
      


      //for debugging purposes
      outputList: function(items){
        var list = '';
        angular.forEach(items, function(item){
          list = list + ', ' + item.title +': ' +  item.order;
        });
        console.log(list);
      }
    };

    //TODO: cache the index value for performance, and only recalculate on appropriate delete/complete/reorder functions
    //This method assumes that "done" items are all at the end of the items array (that the toggle function moves the order of these items)
    //Returns: the index of the first done item. 
    //         if no 'done' items, then it returns the length of items array (aka the index where the first done item should go)
    $scope.indexOfFirstDone = function(){
      if($scope.items === undefined){
        console.log("indexOfFirstDone() called while $scope.items is undefined");
        return undefined;
      }
      for (var i = 0; i < $scope.items.length; i++){
        if ($scope.items[i].done){
          //console.log("indexOfFirstDone is: "+i);
          return i;
        }
      }
      //console.log("indexOfFirstDone - there are no done items");
      return $scope.items.length;  
    };


    $scope.sortableOptions = {
      beforeStop: function(e, ui) {
        $scope.dest = ui.item.index();
      },
      stop: function() {
        Sorting.move($scope.items, $scope.dest);
      },
      cursor: 'move',
      cancel: ".unsortable",
      items: "li:not(.unsortable)"
    };

    $scope.addItem = function () {
      var newItem = {
        title: $scope.newItem.trim(),
        parent: $scope.list.id,
        done: false,
        archive: false
      };

      if (!newItem.title) {
        return;
      }

      var item = new Item();
      item.title = newItem.title;
      item.parent = newItem.parent;
      item.done = newItem.done;
      item.archive = newItem.archive;
 
      Item.save(item, function(savedItem){
        $scope.items.unshift(savedItem);
        $scope.newItem = ''; 
        Sorting.move($scope.items, 0);
      });
    };

    $scope.removeItem = function(item) {
      Item.get({itemId: item.id}, function(toUpdate){
        toUpdate.archive = true;
        console.log(item.id);
        toUpdate.$update({itemId: item.id}, function(){
          $scope.items.splice($scope.items.indexOf(item), 1);
        });
      });
    };

    $scope.toggle = function(item) {
      Item.get({itemId: item.id}, function(toUpdate) {
        console.log(item);
        //TODO: without these 2 lines, the server data doesn't get updated... but why isn't the Sorting.move call in $update enough to do so? 
        toUpdate.done = item.done;  
        toUpdate.done = !toUpdate.done;   
           
        toUpdate.$update({itemId: item.id}, function(){
          var toMove = $scope.items.splice($scope.items.indexOf(item), 1);
          toMove[0].done = !toMove[0].done;
          var newIndex = $scope.indexOfFirstDone();
          if(newIndex === undefined){
            newIndex = $scope.items.length;
          }
          $scope.items.splice(newIndex, 0, toMove[0]);
          Sorting.move($scope.items, newIndex);                  
        });
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

    //TODO, this is broken
    $scope.revertEdits = function(item) {
      item = $scope.originalItem;
      $scope.editedItem = null;
    };
  });
