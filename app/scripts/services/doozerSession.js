'use strict';

angular.module('webClientApp')
  .factory('doozerSession', function($resource, $http, $cookies) {

    //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    var doozerURL = 'http://localhost:3000/api/'

    var session = {
      login: function(token){
        var Session = $resource(doozerURL + 'login/' + token);

        return Session.get();
      },

      logout: function(){

      	var Session = $resource(doozerURL + 'logout', { }, {
          delete: {
            method: 'DELETE',
            headers: {'sessionId': $cookies.get('doozerSession')}
          }
        });
        return Session.delete();
      }
    };
    return session;
  });