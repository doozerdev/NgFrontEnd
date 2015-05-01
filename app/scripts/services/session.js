'use strict';

angular.module('webClientApp')
    .factory('Session', function($resource, $cookies, doozerURL) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

        return $resource(doozerURL + 'login/:token', {
            token: '@token'
        }, {
            login: {
                method: 'GET'
            },
            logout: {
                url: doozerURL + 'logout',
                method: 'DELETE',
                headers: {
                    'sessionId': $cookies.get('doozerSession')
                }
            }
        });
    });
