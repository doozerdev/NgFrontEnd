'use strict';

angular.module('webClientApp')
    .factory('Solution', function($resource, $http, $cookies) {

        var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'solutions/:id', {
            id: '@id'
        }, {
            query: {
                isArray: true
                // TODO: for some reason this needs to be here, leave for now, debug later
            },
            delete: {
                method: 'DELETE'
            },
            get: {
                // TODO: for some reason this needs to be here, leave for now, debug later
            },
            update: {
                method: 'PUT'
            },
            mapItem: {
                url: doozerURL + 'solutions/:id/mapItem',
                method: 'POST'
            },
            items: {
                url: doozerURL + 'solutions/:id/items',
                method: 'GET'
            }
        });
    });
