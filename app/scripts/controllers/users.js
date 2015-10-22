'use strict';

angular.module('webClientApp')
    .controller('UsersCtrl', function($scope, $routeParams, User) {
        $scope.betaUsers = [];
        $scope.otherUsers = [];
        
        $scope.refresh = function () {
            User.server.query(function(userData) {
                $scope.otherUsers = userData;
                
                var tempBetaIds = User.getBetaIds();
                var a = 0;
                var b = null;
                while (tempBetaIds.length > 0) {
                    b = $scope.sortHelper($scope.otherUsers[a].uid, tempBetaIds);
                    if (b == -1){
                        a++;
                    } else {
                        $scope.betaUsers.push($scope.otherUsers[a]);
                        $scope.otherUsers.splice(a, 1);
                        tempBetaIds.splice(b, 1);
                    }
                }
            });
            
            //User.server.updateAdmin({userId: 10205054111251934}, function(response){console.log(response);});
        };
        
        $scope.sortHelper = function (checkId, checkList)  {
            for(var b = 0; b < checkList.length; b++){
                if(checkId == checkList[b]){
                    return b;
                }
            };
            return -1;
        }      
    });
