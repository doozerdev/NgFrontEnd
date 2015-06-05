'use strict';

angular.module('webClientApp')
    .factory('Item', function($resource, $http, $cookies, doozerURL) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'


        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'items/:itemId', {
            itemId: '@itemId'
        }, {
            lists: {
                url: doozerURL + 'lists',
                method: 'GET'
            },
            items: {
                url: doozerURL + 'items',
                method: 'GET'
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
            },
            mapSolution:{
                url: doozerURL + 'items/:itemId/mapSolution',
                method: 'POST'
            },
            solutions:{
                url: doozerURL + 'items/:itemId/solutions',
                method: 'GET'
            }
        });
    });
