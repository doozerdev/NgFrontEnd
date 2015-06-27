"use strict";angular.module("webClientApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngFacebook","ui.sortable"]).config(["$routeProvider","$facebookProvider",function(a,b){b.setAppId(0x53d582e760457),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{store:["doozerList",function(a){return a}]}}).when("/search",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/:searchTerm",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/solution",{templateUrl:"views/solutions.html",controller:"SolutionsCtrl"}).when("/solution/:id",{templateUrl:"views/solution.html",controller:"SolutionCtrl"}).when("/users",{templateUrl:"views/users.html",controller:"UsersCtrl"}).when("/user/:id",{templateUrl:"views/user.html",controller:"UserCtrl"}).when("/:id",{templateUrl:"views/list.html",controller:"ListCtrl"}).when("/:id/item",{templateUrl:"views/item.html",controller:"ItemCtrl"}).otherwise({redirectTo:"/"})}]).constant("doozerURL","https://warm-atoll-6588.herokuapp.com/api/").run(function(){!function(a,b,c){var d,e=a.getElementsByTagName(b)[0];a.getElementById(c)||(d=a.createElement(b),d.id=c,d.src="//connect.facebook.net/en_US/sdk.js",e.parentNode.insertBefore(d,e))}(document,"script","facebook-jssdk")}),angular.module("webClientApp").controller("MainCtrl",["$scope","$cookies","$resource","$facebook","Session","Item","doozerURL",function(a,b,c,d,e,f,g){a.refresh=function(){f.lists(function(c){var d=c.items;d?(a.username=b.get("username"),a.loggedIn=!0,a.lists=d,a.sessionId=b.get("doozerSession")):(a.loggedIn=!1,b.remove("doozerSession"))})},b.get("doozerSession")&&a.refresh(),a.login=function(){d.login().then(function(f){e.login({token:f.authResponse.accessToken},function(e){b.put("doozerSession",e.sessionId),d.api("/me").then(function(c){a.username=c.name,b.put("username",c.name)});var h=c(g+"/lists",null,{query:{headers:{sessionId:e.sessionId}}});h.query(function(b){a.lists=b.items,a.username=f.name,a.loggedIn=!0,a.sessionId=e.sessionId})})})},a.logout=function(){d.logout().then(function(){e.logout(function(){b.remove("doozerSession"),a.loggedIn=!1})})},a.addList=function(){var b={title:a.newList.trim(),completed:!1,archive:!1};if(b.title){var c=new f;c.title=b.title,c.archive=b.archive,f.save(c,function(b){a.lists.push(b),a.newList=""})}},a.removeList=function(b){f.archive({itemId:b.id},function(){a.lists.splice(a.lists.indexOf(b),1)})},a.editItem=function(b){a.editedItem=b,a.originalItem=angular.extend({},b)},a.saveEdits=function(b){f.get({itemId:b.id},function(c){c.title=b.title,c.$update({itemId:b.id}),a.editedItem=null})}}]),angular.module("webClientApp").controller("SearchCtrl",["$scope","$routeParams","$facebook","$location","Search",function(a,b,c,d,e){a.search=function(){e.query({searchTerm:a.searchTerm.trim()},function(b){a.results=b.items,a.request_time=b.request_time,d.path("search/"+a.searchTerm)})},c.api("/me").then(function(b){a.userId=b.id}),b.searchTerm&&(a.searchTerm=b.searchTerm,a.search())}]),angular.module("webClientApp").controller("SolutionCtrl",["$scope","$routeParams","Solution","Search",function(a,b,c,d){c.get({id:b.id},function(b){a.solution=b}),c.items({id:b.id},function(b){a.items=b.items?b.items:[]}),a.toggleMap=function(d){var e=a.checkLink(d);-1===e?c.mapItem({id:b.id,itemId:d.id},function(){a.items.unshift(d)}):c.unmapItem({id:b.id,itemId:d.id},function(){a.items.splice(e,1)})},a.checkLink=function(b){if(null===b)return-1;if(a.items.length<1)return-1;for(var c=0;c<a.items.length;c++)if(a.items[c].id===b.id)return c;return-1},a.search=function(){d.query({searchTerm:a.searchTerm.trim()},function(b){a.results=b.items,a.request_time=b.request_time})}}]),angular.module("webClientApp").controller("SolutionsCtrl",["$scope","$routeParams","Solution",function(a,b,c){var d=function(a){return a?a.trim():""};c.query(function(b){a.solutions=b}),a.createSolution=function(){var b=new c({title:d(a.solution.title),source:d(a.solution.source),price:d(a.solution.price),phoneNumber:d(a.solution.phoneNumber),openHours:d(a.solution.openHours),link:d(a.solution.link),tags:d(a.solution.tags),expireDate:d(a.solution.expireDate),imgLink:d(a.solution.imgLink),description:d(a.solution.description),address:d(a.solution.address),notes:d(a.solution.notes)});c.save(b,function(b){a.solutions.push(b),a.solution=angular.copy({})})},a.removeSolution=function(b){c["delete"]({id:b.id},function(){a.solutions.splice(a.solutions.indexOf(b),1)})}}]),angular.module("webClientApp").controller("UsersCtrl",["$scope","$routeParams","User",function(a,b,c){c.query(function(b){a.users=b})}]),angular.module("webClientApp").controller("UserCtrl",["$scope","$routeParams","User","Item",function(a,b,c,d){c.get({userId:b.id},function(b){a.user=b}),d.listsForUser({userId:b.id},function(b){a.lists=b.items})}]),angular.module("webClientApp").controller("ListCtrl",["$scope","$routeParams","Item",function(a,b,c){var d=33554432,e=2147483647;a.editedItem=null,a.isDoneGroupOpen=!1,c.children({itemId:b.id},function(d){a.items=d.items,a.list=c.get({itemId:b.id});var e=-1;angular.forEach(a.items,function(a){a.order&&a.order>e&&(e=a.order),a.duedate=new Date(a.duedate)}),-1===e&&f.reorderList(a.items)});var f={move:function(b,c){if(1===b.length)b[0].order=d,a.saveEdits(b[0]);else if(0===c)b[1].order>2?(b[c].order=Math.floor(b[1].order/2),a.saveEdits(b[c])):(b[c].order=0,f.reorderList(b));else if(c===b.length-1)b[b.length-2].order+d<e?(b[c].order=b[b.length-2].order+d,a.saveEdits(b[c])):(b[c].order=b[b.length-2].order+1,f.reorderList(b));else{var g=b[c+1].order-b[c-1].order;if(g>3){var h=b[c-1].order+Math.floor(g/2);b[c].order=h,a.saveEdits(b[c])}else b[c].order=b[c-1].order+1,f.reorderList(b)}return b},reorderList:function(b){var c=d;console.log("reorderList"),(b.length-1)*d>e&&(c=Math.floor(e/b.length));var f=c;return angular.forEach(b,function(b){b.order=f,a.saveEdits(b),f+=c}),b},outputList:function(a){var b="";angular.forEach(a,function(a){b=b+", "+a.title+": "+a.order}),console.log(b)}};a.indexOfFirstDone=function(){if(void 0===a.items)return void console.log("indexOfFirstDone() called while $scope.items is undefined");for(var b=0;b<a.items.length;b++)if(a.items[b].done)return b;return a.items.length},a.sortableOptions={beforeStop:function(b,c){a.dest=c.item.index()},stop:function(){f.move(a.items,a.dest)},cursor:"move",cancel:".unsortable",items:"li:not(.unsortable)"},a.addItem=function(){var b={title:a.newItem.trim(),parent:a.list.id,done:!1,archive:!1};if(b.title){var d=new c;d.title=b.title,d.parent=b.parent,d.done=b.done,d.archive=b.archive,c.save(d,function(b){a.items.unshift(b),a.newItem="",f.move(a.items,0)})}},a.removeItem=function(b){c.archive({itemId:b.id},function(){a.items.splice(a.items.indexOf(b),1)})},a.toggle=function(b){c.get({itemId:b.id},function(c){console.log(b),c.done=b.done,c.done=!c.done,c.duedate=new Date(b.duedate),a.items.splice(a.items.indexOf(b),1);var d=a.indexOfFirstDone();void 0===d&&(d=a.items.length),a.items.splice(d,0,c),f.move(a.items,d)})},a.editItem=function(b){null===b?a.editedItem=null:(a.editedItem=b,a.originalItem=angular.extend({},b))},a.saveEdits=function(b){c.get({itemId:b.id},function(c){c.title=b.title,c.order=b.order,c.done=b.done,c.notes=b.notes,c.duedate=b.duedate,c.$update({itemId:b.id}),a.editedItem=null,console.log("saved item: "),console.log(b)})},a.revertEdits=function(b){b=a.originalItem,a.editedItem=null}}]),angular.module("webClientApp").controller("ItemCtrl",["$scope","$routeParams","Item",function(a,b,c){c.get({itemId:b.id},function(d){a.item=d,c.solutions({itemId:b.id},function(b){a.solutions=b.items})})}]),angular.module("webClientApp").controller("IndexCtrl",["$scope",function(a){a.username="joe"}]),angular.module("webClientApp").factory("Session",["$resource","$cookies","doozerURL",function(a,b,c){return a(c+"login/:token",{token:"@token"},{login:{method:"GET"},logout:{url:c+"logout",method:"DELETE",headers:{sessionId:b.get("doozerSession")}}})}]),angular.module("webClientApp").factory("doozerList",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){var e=a(d+"items/:itemId",{},{query:{headers:{sessionId:c.get("doozerSession")}},get:{headers:{sessionId:c.get("doozerSession")}}}),f={getLists:function(){return e.query({itemId:"index"})},getChildren:function(a){return e.query({itemId:a})},createItem:function(a){return e.save(a)},getItem:function(){},updateItem:function(){},deleteItem:function(){},searchTitles:function(){}};return f}]),angular.module("webClientApp").factory("Item",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"items/:itemId",{itemId:"@itemId",userId:"@userId"},{lists:{url:d+"lists",method:"GET"},listsForUser:{url:d+"listsForUser/:userId",method:"GET"},items:{url:d+"items",method:"GET"},children:{url:d+"items/:itemId/children",method:"GET"},childrenForUser:{url:d+"items/:itemId/childrenForUser/:userId",method:"GET"},archive:{url:d+"items/:itemId/archive",method:"DELETE"},"delete":{method:"DELETE"},get:{},update:{url:d+"items/:itemId",method:"PUT"},mapSolution:{url:d+"items/:itemId/mapSolution",method:"POST"},solutions:{url:d+"items/:itemId/solutions",method:"GET"}})}]),angular.module("webClientApp").factory("User",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"users/:userId",{userId:"@userId"},{updateAdmin:{url:d+"updateAdmin",method:"PUT"}})}]),angular.module("webClientApp").factory("Search",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"items/:searchTerm/search",{searchTerm:"@searchTerm"},{query:{method:"GET"}})}]),angular.module("webClientApp").factory("Solution",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"solutions/:id",{id:"@id"},{query:{isArray:!0},"delete":{method:"DELETE"},get:{},update:{method:"PUT"},mapItem:{url:d+"solutions/:id/mapItem",method:"POST"},unmapItem:{url:d+"solutions/:id/unmapItem/:itemId",method:"DELETE"},items:{url:d+"solutions/:id/items",method:"GET"}})}]),angular.module("webClientApp").directive("itemEscape",function(){var a=27;return function(b,c,d){c.bind("keydown",function(c){c.keyCode===a&&b.$apply(d.itemEscape)})}}),angular.module("webClientApp").directive("itemFocus",["$timeout",function(a){return function(b,c,d){b.$watch(d.itemFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]),angular.module("ui.sortable",[]).value("uiSortableConfig",{}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,b,c){return{require:"?ngModel",scope:{ngModel:"=",uiSortable:"="},link:function(d,e,f,g){function h(a,b){return b&&"function"==typeof b?function(){a.apply(this,arguments),b.apply(this,arguments)}:a}function i(a){var b=a.data("ui-sortable");return b&&"object"==typeof b&&"ui-sortable"===b.widgetFullName?b:null}function j(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}function k(a){return/left|right/.test(a.css("float"))||/inline|table-cell/.test(a.css("display"))}function l(a,b){for(var c=null,d=0;d<a.length;d++){var e=a[d];if(e.element[0]===b[0]){c=e.scope;break}}return c}function m(a,b){b.item.sortable._destroy()}var n,o={},p={"ui-floating":void 0},q={receive:null,remove:null,start:null,stop:null,update:null},r={helper:null};return angular.extend(o,p,a,d.uiSortable),angular.element.fn&&angular.element.fn.jquery?(g?(d.$watch("ngModel.length",function(){b(function(){i(e)&&e.sortable("refresh")},0,!1)}),q.start=function(a,b){if("auto"===o["ui-floating"]){var c=b.item.siblings(),d=i(angular.element(a.target));d.floating=k(c)}b.item.sortable={model:g.$modelValue[b.item.index()],index:b.item.index(),source:b.item.parent(),sourceModel:g.$modelValue,cancel:function(){b.item.sortable._isCanceled=!0},isCanceled:function(){return b.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!b.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:b.item.sortable._isCustomHelperUsed,_destroy:function(){angular.forEach(b.item.sortable,function(a,c){b.item.sortable[c]=void 0})}}},q.activate=function(a,b){n=e.contents();var c=e.sortable("option","placeholder");if(c&&c.element&&"function"==typeof c.element){var f=c.element();f=angular.element(f);var g=e.find('[class="'+f.attr("class")+'"]:not([ng-repeat], [data-ng-repeat])');n=n.not(g)}var h=b.item.sortable._connectedSortables||[];h.push({element:e,scope:d}),b.item.sortable._connectedSortables=h},q.update=function(a,b){if(!b.item.sortable.received){b.item.sortable.dropindex=b.item.index();var c=b.item.parent();b.item.sortable.droptarget=c;var f=l(b.item.sortable._connectedSortables,c);b.item.sortable.droptargetModel=f.ngModel,e.sortable("cancel")}j(e,b)&&!b.item.sortable.received&&"parent"===e.sortable("option","appendTo")&&(n=n.not(n.last())),n.appendTo(e),b.item.sortable.received&&(n=null),b.item.sortable.received&&!b.item.sortable.isCanceled()&&d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)})},q.stop=function(a,b){!b.item.sortable.received&&"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()?d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,g.$modelValue.splice(b.item.sortable.index,1)[0])}):"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()||j(e,b)||n.appendTo(e),n=null},q.receive=function(a,b){b.item.sortable.received=!0},q.remove=function(a,b){"dropindex"in b.item.sortable||(e.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||d.$apply(function(){b.item.sortable.moved=g.$modelValue.splice(b.item.sortable.index,1)[0]})},r.helper=function(a){return a&&"function"==typeof a?function(b,c){var d=a.apply(this,arguments);return c.sortable._isCustomHelperUsed=c!==d,d}:a},d.$watch("uiSortable",function(a){var b=i(e);b&&angular.forEach(a,function(a,c){return c in p?("ui-floating"!==c||a!==!1&&a!==!0||(b.floating=a),void(o[c]=a)):(q[c]?("stop"===c&&(a=h(a,function(){d.$apply()}),a=h(a,m)),a=h(q[c],a)):r[c]&&(a=r[c](a)),o[c]=a,void e.sortable("option",c,a))})},!0),angular.forEach(q,function(a,b){o[b]=h(a,o[b]),"stop"===b&&(o[b]=h(o[b],m))})):c.info("ui.sortable: ngModel not provided!",e),void e.sortable(o)):void c.error("ui.sortable: jQuery should be included before AngularJS!")}}}]),angular.module("webClientApp").directive("dzrSolution",function(){return{restrict:"E",scope:{solution:"=",expert:"@"},templateUrl:"scripts/directives/dzr-solution.html"}});