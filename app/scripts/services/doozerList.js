'use strict';

angular.module('webClientApp')
  .factory('doozerList', function($resource, $http, $cookies) {

    // var Items = $resource(doozerURL + 'items/:itemId', 
    //   {itemId:'@id'}, 
    //   {
    //     headers:{'sessionId': $cookies.doozerSession
    //   }
    // });

    var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    
    var Item = $resource(doozerURL + 'items/:itemId', { }, {
      query: {
        headers: {'sessionId': $cookies.doozerSession}
      },
      get: {
        headers: {'sessionId': $cookies.doozerSession}
      }
    });

    var store = {
      getLists: function(){
        return Item.query({itemId:'index'});
      },

      getChildren: function(itemId){
        return Item.query({itemId: itemId});
      },

      createItem: function(item){
        return Item.save(item);
      },

      getItem: function(){

      },

      updateItem: function(){

      },

      deleteItem: function(){

      },

      searchTitles: function(){

      },

    };
    return store;
  });