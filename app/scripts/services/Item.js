'use strict';

angular.module('webClientApp')
    .factory('Item', function($resource, $http, $cookies, doozerURL) {

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'items/:item_id', {
            item_id: '@item_id',
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
                url: doozerURL + 'items/:item_id/children',
                method: 'GET'
            },
            childrenForUser: {
                url: doozerURL + 'items/:item_id/childrenForUser/:userId',
                method: 'GET'
            },
            archive: {
                url: doozerURL + 'items/:item_id/archive',
                method: 'DELETE'
            },
            delete: {
                method: 'DELETE'
            },
            get: {
                // TODO: for some reason this needs to be here, leave for now, debug later
            },
            update: {
                url: doozerURL + 'items/:item_id',
                method: 'PUT'
            },
            mapSolution:{
                url: doozerURL + 'items/:item_id/mapSolution',
                method: 'POST'
            },
            solutions:{
                url: doozerURL + 'items/:item_id/solutions',
                method: 'GET'
            }
        });
    });
