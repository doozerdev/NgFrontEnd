'use strict';

angular.module('webClientApp')
    .factory('User', function($resource, $http, $cookies, doozerURL) {

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return $resource(doozerURL + 'users/:userId', {
            userId: '@userId'
        }, {
            updateAdmin: {
                url: doozerURL + 'updateAdmin',
                method: 'PUT'
            }
        });
    });
