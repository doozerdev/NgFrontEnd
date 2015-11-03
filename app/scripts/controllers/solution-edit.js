'use strict';

angular.module('webClientApp')
    .controller('EditSolutionCtrl', function($scope, $routeParams, Solution) {

        var eOV = function(item) {
            return item ? item.trim() : '';
        };
        
        if ($scope.mode!="edit") {
            $scope.solution = {};
        }
        
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
            if ($scope.mode!="edit"){
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
                    console.log("created solution: ");
                    console.log(savedSolution);
                    
                    if($scope.mapItem){
                        //don't check to push savedsolution to all solutions; map already does it
                        $scope.map(savedSolution, $scope.mapItem);
                    }
                    else if($scope.solutions){
                        $scope.solutions.push(savedSolution);
                    }
    
                    $('#newSolution').collapse('hide');
                    $scope.solution = angular.copy({});
                });
            } else {
                console.log("createSolution called when in Edit mode");
            }
        };
        
        $scope.saveEdits = function () {
            if ($scope.mode=="edit") {
                Solution.server.get({
                    id: $scope.solution.id
                }, function (toUpdate) {
                    toUpdate.tags = $scope.solution.tags;
                    toUpdate.link = $scope.solution.link;
                    toUpdate.img_link = $scope.solution.img_link;
                    toUpdate.expire_date = $scope.solution.expire_date;
                    toUpdate.notes = $scope.solution.notes;
                    toUpdate.title = $scope.solution.title;
                    toUpdate.source = $scope.solution.source;
                    toUpdate.price = $scope.solution.price;
                    toUpdate.phone_number = $scope.solution.phone_number;
                    toUpdate.open_hours = $scope.solution.open_hours;
                    toUpdate.address = $scope.solution.address;
                    toUpdate.description = $scope.solution.description;
                    
                    toUpdate.$update({
                        id: $scope.solution.id
                    }, function (updated) {
                        console.log("solution saved: ");
                        console.log(updated);
                    });
                });
            } else {
                //console.log("saveEdits called without being in edit mode")
            } 
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
            if ($scope.mode=="edit") {
                console.log("fillpreview called while in edit mode!");
            }
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