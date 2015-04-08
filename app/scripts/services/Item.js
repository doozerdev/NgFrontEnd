'use strict';

angular.module('webClientApp')
    .factory('Item', function($resource, $http, $cookies) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
        var doozerURL = 'http://localhost:3000/api/';

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'items/:itemId', {
            itemId: '@itemId'
        },
        {
            query: {
                // TODO: for some reason this needs to be here, leave for now, debug later
            },
            children: {
                url: doozerURL + 'items/:itemId/children',
                method: 'GET'
            },
            delete: {
                method: 'DELETE'
            },
            get: {
                // TODO: for some reason this needs to be here, leave for now, debug later
            },
            update: {
                url: doozerURL + 'items/:itemId',
                method: 'PUT'
            }
        });
    });
