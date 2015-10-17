'use strict';

angular.module('webClientApp')
    .factory('User', function($resource, $http, $cookies, doozerURL) {
        var betaUsers = [10206549132149223, 10100937175140396, 4614807584795, 10100716370439739, 10103069913924734]; //dan = 888679437823595, rebecca = 10153226353173625

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return {
            server: $resource(doozerURL + 'users/:userId', {
                userId: '@userId'
            }, {
                updateAdmin: {
                    url: doozerURL + 'updateAdmin',
                    method: 'PUT'
                }
            }),
            getBetaUsers: function () {
                return betaUsers;                
            },
            checkBetaUser: function (id) {
                for (var i = 0; i < betaUsers.length; i++) {
                    if (id == betaUsers[i]) {
                        return true;
                    }
                };
                return false;
            }
        };
    });
