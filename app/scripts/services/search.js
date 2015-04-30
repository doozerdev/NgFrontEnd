'use strict';

angular.module('webClientApp')
  .factory('Search', function($resource, $http, $cookies) {

    var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

    $http.defaults.headers.common.sessionId= $cookies.get('doozerSession');

    return $resource(doozerURL + 'items/:searchTerm/search', 
      {searchTerm:'@searchTerm'}, 
      {
        query: {
          method: 'GET'
          // TODO: for some reason this needs to be here, leave for now, debug later
        }
      }
    );
});