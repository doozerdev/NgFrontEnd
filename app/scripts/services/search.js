'use strict';

angular.module('webClientApp')
  .factory('Search', function($resource, $http, $cookies, doozerURL) {

    //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

    $http.defaults.headers.common.sessionId= $cookies.get('doozerSession');

    return {
       items: $resource(doozerURL + 'items/:searchTerm/:field/search', {
          searchTerm:'@searchTerm',
          field: '@field'
        }, {
          query: {
            method: 'GET'
            // TODO: for some reason this needs to be here, leave for now, debug later
          }
      }),
      solutions: $resource(doozerURL + 'solutions/:searchTerm/:field/search', {
          searchTerm:'@searchTerm',
          field: '@field'
        }, {
          query: {
            method: 'GET'
            // TODO: for some reason this needs to be here, leave for now, debug later
          }
      })
    };
});