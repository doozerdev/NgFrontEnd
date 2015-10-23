'use strict';

angular.module('webClientApp')
    .controller('CreateSolutionCtrl', function($scope, $routeParams, Solution) {

        var eOV = function(item) {
            return item ? item.trim() : '';
        };
        
        $scope.solution = {};
        $scope.imageOptions = [];
        $scope.currentImageIndex = null;

        if (!$scope.btnText){
            $scope.btnText = "Create tip";
        }
        /*DEMO mode sample data
        if ($scope.mode=="expert") {
            $scope.solution.source = "Rebecca Deutsch";
            $scope.solution.notes = "Urban Vegetable Gardener";
            $scope.solution.phone_number = "Rebecca Deutsch";
            $scope.solution.open_hours = "Urban Vegetable Gardener";
        }
        */
        
        
        $scope.createSolution = function() {
            var newSolution = new Solution.server({
                title: eOV($scope.solution.title),
                source: eOV($scope.solution.source),
                price: eOV($scope.solution.price),
                phone_number: eOV($scope.solution.phone_number),
                open_hours: eOV($scope.solution.open_hours),
                link: eOV($scope.solution.link),
                tags: eOV($scope.solution.tags),
                expire_date: $scope.solution.expire_date,
                img_link: eOV($scope.solution.img_link),
                description: eOV($scope.solution.description),
                address: eOV($scope.solution.address),
                notes: eOV($scope.solution.notes),
            });

            Solution.server.save(newSolution, function(savedSolution) {
                console.log("saved solution: ");
                console.log(savedSolution);
                
                if($scope.mapItem){
                    $scope.map(savedSolution, $scope.mapItem);
                }
                else if($scope.solutions){
                    $scope.solutions.push(savedSolution);
                }

                $('#newSolution').collapse('hide');
                $scope.solution = angular.copy({});
            });
        };
        
        $scope.map = function(solution, item){
            Solution.server.mapItem({
                id: solution.id,
                item_id: item.id
            }, function(){
                
                Solution.server.get({
                    id: solution.id
                }, function(updatedSolution) {
                    if($scope.mappedSolutions){
                        $scope.mappedSolutions.push(updatedSolution);
                    }
                    if($scope.solutions){
                        $scope.solutions.push(updatedSolution);
                    }
                });
            });
        };
        
        $scope.fillPreview = function(url) {
            Solution.opengraph.get({
                url: url
            }, function(response) {
                console.log(response);
                if (response.hybridGraph){
                    if (response.hybridGraph.title){
                        $scope.solution.title = response.hybridGraph.title;
                    }
                    if (response.hybridGraph.image){
                        $scope.solution.img_link = response.hybridGraph.image;
                    }
                    if (response.htmlInferred){
                        $scope.imageOptions = response.htmlInferred.images;
                        if($scope.imageOptions.length > 0){
                            $scope.currentImageIndex = 0;
                        }
                    }
                }
            });
        };
        
        $scope.cycleImage = function (dest) {
          if($scope.currentImageIndex != null){
              if(dest=="next") {
                  if($scope.currentImageIndex < $scope.imageOptions.length-1){
                      $scope.currentImageIndex++;
                      $scope.solution.img_link = $scope.imageOptions[$scope.currentImageIndex];
                  }else {
                      $scope.currentImageIndex = 0;
                      $scope.solution.img_link = $scope.imageOptions[0];
                  }
              }else if(dest=="prev") {
                  if($scope.currentImageIndex > 0){
                      $scope.currentImageIndex--;
                      $scope.solution.img_link = $scope.imageOptions[$scope.currentImageIndex];
                  }else {
                      $scope.currentImageIndex = $scope.imageOptions.length-1;
                      $scope.solution.img_link = $scope.imageOptions[$scope.currentImageIndex];
                  }
              }else if(dest >= 0 && dest < $scope.imageOptions.length) {
                  $scope.currentImageIndex = dest;
                  $scope.solution.img_link = $scope.imageOptions[dest];
              }
          }
          
        };
    });