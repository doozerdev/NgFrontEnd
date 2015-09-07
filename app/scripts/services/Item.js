'use strict';

angular.module('webClientApp')
    .factory('Item', function($resource, $http, $cookies, doozerURL) {

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'items/:itemId', {
            itemId: '@item_id',
            userId: '@userId'
        }, {
            lists: {
                url: doozerURL + 'lists',
                method: 'GET'
            },
            listsForUser: {
                url: doozerURL + 'listsForUser/:userId',
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
            childrenForUser: {
                url: doozerURL + 'items/:itemId/childrenForUser/:userId',
                method: 'GET'
            },
            archive: {
                url: doozerURL + 'items/:itemId/archive',
                method: 'DELETE'
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
