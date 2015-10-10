'use strict';

angular.module('webClientApp')
    .factory('Session', function($resource, $cookies, $http, $q, doozerURL, Item) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

        var loggedIn = null;
        
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
                        Item.lists(function(data){
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
                        })
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
            }
        };
    });
