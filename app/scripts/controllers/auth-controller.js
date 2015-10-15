'use strict';

angular.module('webClientApp')
    .controller('AuthCtrl', function($scope, $route, $facebook, Session) {
        
        //if ($scope.mode=='login'){
            Session.checkSession().then(function (result) {
                    if (result == true) {
                        $scope.showLogin = false;
                        $('.modal').modal('hide');
                        $('.modal-backdrop').remove();
                        $scope.retry();
                        //console.log('in directive, checkSession returned true');
                    } else {
                        //console.log('in directive, checkSession returned not true');
                        $scope.showLogin = true;
                        $('.modal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        console.log('just tried to show modal');
                    }
                }, function (error) {
                    console.log("Error: Nothing returned from checkSession!");
                    console.log(error);
            });            
       // }


        $scope.login = function() {
            $facebook.login().then(function (fbResponse) {
                Session.server.login({
                    token: fbResponse.authResponse.accessToken
                }, function(dzrSession) {
                    $facebook.api('/me').then(function(fbMeResponse) {
                        Session.setupSession(dzrSession.sessionId, fbMeResponse.name);
                        $scope.showLogin = false;
                        $('.modal').modal('hide');
                        $('.modal-backdrop').remove();
                        $scope.retry();
                    }, function(error) {
                        console.log("Setting up session without name. Facebook /me call failed with error:");
                        console.log("error");
                        Session.setupSession(dzrSession.sessionId);
                        $scope.showLogin = false;
                        $('.modal').modal('hide');
                        $('.modal-backdrop').remove();
                        $scope.retry();
                    });
                }, function (error) {
                    console.log("Session login to Doozer server failed with error:");
                    console.log(error);
                });
            }, function (error) {
                console.log("Facebook login returned with error:");
                console.log(error);
            });
        };
        
        $scope.logout = function() {
            $facebook.logout().then(function(fbResponse) {
                Session.server.logout(function() {
                    Session.cleanupSession();
                    $route.reload();
                }, function (error) {
                    //TODO: THIS FAILS with 401!! (also flip order to logout of doozer first? doozer is failing with unauth, but fb succeeds and then no valid token!)
                    console.log("Session logout to Doozer server failed with error:");
                    console.log(error);
                });
            }, function (error) {
                console.log("Facebook logout failed with error:");
                console.log(error);
            });
        };

    });