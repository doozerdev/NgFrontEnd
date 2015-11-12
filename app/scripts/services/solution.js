'use strict';

angular.module('webClientApp')
    .factory('Solution', function($resource, $http, $cookies, $q, doozerURL) {

        //var doozerURL = 'https://warm-atoll-6588.herokuapp.com/api/';
    //var doozerURL = 'http://localhost:3000/api/'

        $http.defaults.headers.common.sessionId = $cookies.get('doozerSession');

        return {
            server: $resource(doozerURL + 'solutions/:id', {
                id: '@id',
                item_id: '@item_id'
                }, {
                    query: {
                        isArray: true
                        // TODO: for some reason this needs to be here, leave for now, debug later
                    },
                    delete: {
                        method: 'DELETE'
                    },
                    get: {
                        // TODO: for some reason this needs to be here, leave for now, debug later
                    },
                    update: {
                        method: 'PUT'
                    },
                    mapItem: {
                        url: doozerURL + 'solutions/:id/mapItem',
                        method: 'POST'
                    },
                    unmapItem: {
                        url: doozerURL + 'solutions/:id/unmapItem/:item_id',
                        method: 'DELETE'
                    },
                    items: {
                        url: doozerURL + 'solutions/:id/items',
                        method: 'GET'
                    },
                    like: {
                        url: doozerURL + 'solutions/:id/like/:item_id',
                        method: 'POST'  
                    },
                    dislike: {
                        url: doozerURL + 'solutions/:id/dislike/:item_id',
                        method: 'POST'  
                    },
                    view: {
                        url: doozerURL + 'solutions/:id/view/:item_id',
                        method: 'POST'  
                    },
                    state: {
                        url: doozerURL + 'solutions/:id/state/:item_id',
                        method: 'GET'
                    },
                    performance: {
                        url: doozerURL + 'solutions/:id/performance',
                        method: 'GET'
                    },
                    for_user: {
                        url: doozerURL + 'solutions/for_user/:last_sync',
                        method: 'GET'
                    }
                }
            ),
            setupState: function(solutionId, itemId) {
                var tempState = {};
                var self = this;
                var deferred = $q.defer();
                
                self.server.state({
                    id: solutionId,
                    item_id: itemId
                }, function (response) {
                    tempState = response;
                    
                    if (tempState.like > 0) {
                        tempState.current = "Liked";
                    }
                    else if (tempState.like < 0) {
                        tempState.current = "Disliked";
                    }
                    else if (tempState.views > 0) {
                        tempState.current = "Viewed";
                    }
                    else {
                        tempState.current = "Unseen";
                    }
                    
                    deferred.resolve(tempState);
                    
                }, function (error) {
                    if (error.status == 404) {
                        tempState.current = "Unseen";
                        tempState.like = 0;
                        tempState.clicks = 0;
                        tempState.views = 0;
                    }
                    deferred.resolve(tempState);
                });
                
                return deferred.promise; 
            },
            opengraph: $resource('http://opengraph.io/api/1.0/site/' + ':url', {
                url: '@url'
                }, {
                    get: {
                         headers: {
                          'sessionId': undefined
                        }
                    }
                }
            )
        };
    });
