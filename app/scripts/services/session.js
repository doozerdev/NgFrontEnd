'use strict';

angular.module('webClientApp')
    .factory('Session', function($rootScope, $resource, $cookies, $http, $q, doozerURL, Item) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

        var loggedIn = null;
        
        var retryHttpRequest = function(config, deferred) {
            config.headers.sessionId = $http.defaults.headers.common.sessionId;

            $http(config).then(function(success){
                deferred.resolve(success);
            }, function(error){
                deferred.reject(error);
            });
        };
        
        return { 
            server: $resource(doozerURL + 'login/:token', {
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
                }),
            checkSession: function () {
                var deferred = $q.defer();
                
                if (loggedIn == null){
                    if ($cookies.get('doozerSession')) {
                        Item.server.lists(function(data){
                            loggedIn = true;
                            $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');
                            console.log('checkSession: cookies have session and server call succeeded');
                            deferred.resolve(loggedIn);
                        }, function(error) {
                            if (error.status == 401) {
                                loggedIn = false;
                                $cookies.remove('doozerSession');
                                $cookies.remove('username');
                                console.log('checkSession: cookies had session but server 401');
                                deferred.resolve(loggedIn);
                            }
                        });
                    } else {
                        loggedIn = false;
                        console.log('checkSession: no session in the cookies!');
                        deferred.resolve(loggedIn);
                   }
                } else {
                    if (loggedIn == true) {
                        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');
                    }
                    console.log('checkSession: already have a value of: ' + loggedIn);
                    deferred.resolve(loggedIn);   
                }

                return deferred.promise; 
            },
            setupSession: function (sessionId, name) {
                loggedIn = true;
                $cookies.put('doozerSession', sessionId);
                $http.defaults.headers.common.sessionId = sessionId;
                if (name) {
                    $cookies.put('username', name);   
                }
            },
            cleanupSession: function () {
                loggedIn = false;
                $cookies.remove('doozerSession');
                $cookies.remove('username');
            },
            /**
            * Abandon or reject (if reason provided) all the buffered http requests.
            */
            rejectAllHttp: function(reason) {
                if (reason) {
                    for (var i = 0; i < $rootScope.httpRetryBuffer.length; i++) {
                        $rootScope.httpRetryBuffer[i].deferred.reject(reason);
                    }
                }
                $rootScope.httpRetryBuffer = [];
            },
            /**
            * Retry all the buffered http requests, and then clears the buffer
            */
            retryAllHttp: function() {
                for (var i = 0; i < $rootScope.httpRetryBuffer.length; i++) {
                    retryHttpRequest($rootScope.httpRetryBuffer[i].config, $rootScope.httpRetryBuffer[i].deferred);
                }
                $rootScope.httpRetryBuffer = [];
            }
        };
    });
