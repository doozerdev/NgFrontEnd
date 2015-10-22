'use strict';

angular.module('webClientApp')
    .factory('User', function($resource, $http, $cookies, doozerURL) {
        var betaUsers = ["10102089177523563", "10206549132149223", "10100937175140396", "4614807584795", "10100716370439739", "10103069913924734"]; //dan = 888679437823595, rebecca = 10153226353173625
        var testUsers = ["888679437823595", "122084741480641", "101199530240934", "137086416631587", "117079795309261", "112111952468018", 
        "576667532471768", "10205412832264814", "116507982027936", "141847546150698", "142353602768062", "114492295563780", "123927551283708", 
        "112243779123425", "115426775470435", "117065725305424", "127213977620124", "110215842661130", "131274290547238", "141793539496778"];
        //these test users don't show up in prod db, eventhough they're on intercom: "123771421303813", "113634438988835", "153254961678849", "123830877964946", "137153963293746", "137881396555304"];

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
            getBetaIds: function () {
                return betaUsers;                
            },
            checkBetaUser: function (id) {
                for (var i = 0; i < betaUsers.length; i++) {
                    if (id == betaUsers[i]) {
                        return true;
                    }
                };
                return false;
            },
            checkTestUser: function (id) {
                for (var i = 0; i < testUsers.length; i++) {
                    if (id == testUsers[i]) {
                        return true;
                    }
                };
                return false;
            }
        };
    });
