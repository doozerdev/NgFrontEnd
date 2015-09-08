'use strict';

angular.module('webClientApp')
  .factory('doozerList', function($resource, $http, $cookies, doozerURL) {

    // var Items = $resource(doozerURL + 'items/:item_id',
    //   {item_id:'@id'},
    //   {
    //     headers:{'sessionId': $cookies.doozerSession
    //   }
    // });

    //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

    var Item = $resource(doozerURL + 'items/:item_id', { }, {
      query: {
        headers: {'sessionId': $cookies.get('doozerSession')}
      },
      get: {
        headers: {'sessionId': $cookies.get('doozerSession')}
      }
    });

    var store = {
      getLists: function(){
        return Item.query({item_id:'index'});
      },

      getChildren: function(item_id){
        return Item.query({item_id: item_id});
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