'use strict';

angular.module('webClientApp')
    .controller('UsersCtrl', function($scope, $routeParams, User) {
        $scope.betaUsers = [];
        $scope.testUsers = [];
        

        User.server.query(function(userData) {
            $scope.betaUsers = userData;
            console.log("total number of users returned from server: "+ $scope.betaUsers.length);
            
            User.getTestIds().then(function (response) {
                var tempTestIds = [];
                tempTestIds = tempTestIds.concat(response);
                var a = 0;
                var b = null;
                while (tempTestIds.length > 0 && a < $scope.betaUsers.length) {
                    b = $scope.sortHelper($scope.betaUsers[a].uid, tempTestIds);
                    if (b == -1){
                        a++;
                    } else {
                        $scope.testUsers.push($scope.betaUsers[a]);
                        $scope.betaUsers.splice(a, 1);
                        tempTestIds.splice(b, 1);
                    }
                }
                
                if (tempTestIds.length != 0){
                    console.log("couldn't find these test users:");
                    console.log(tempTestIds);
                }
            });
        });
            
            //User.server.updateAdmin({userId: 10205054111251934}, function(response){console.log(response);});

        
        $scope.sortHelper = function (checkId, checkList)  {
            for(var b = 0; b < checkList.length; b++){
                if(checkId == checkList[b]){
                    return b;
                }
            };
            return -1;
        };
              
    });
