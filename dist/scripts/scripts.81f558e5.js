"use strict";angular.module("webClientApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngFacebook","ui.sortable"]).config(["$routeProvider","$facebookProvider",function(a,b){b.setAppId(0x5d13193fb27c0),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{store:["doozerList",function(a){return a}]}}).when("/search",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/:searchTerm",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/solution",{templateUrl:"views/solutions.html",controller:"SolutionsCtrl"}).when("/solution/:id",{templateUrl:"views/solution.html",controller:"SolutionCtrl"}).when("/users",{templateUrl:"views/users.html",controller:"UsersCtrl"}).when("/user/:id",{templateUrl:"views/user.html",controller:"UserCtrl"}).when("/:id",{templateUrl:"views/list.html",controller:"ListCtrl"}).when("/:id/item",{templateUrl:"views/item.html",controller:"ItemCtrl"}).when("/:id/itemexpert",{templateUrl:"views/itemexpert.html",controller:"ItemExpertCtrl"}).otherwise({redirectTo:"/"})}]).constant("doozerURL","http://api.test.doozer.tips/api/").run(function(){!function(a,b,c){var d,e=a.getElementsByTagName(b)[0];a.getElementById(c)||(d=a.createElement(b),d.id=c,d.src="//connect.facebook.net/en_US/sdk.js",e.parentNode.insertBefore(d,e))}(document,"script","facebook-jssdk")}),angular.module("webClientApp").controller("MainCtrl",["$scope","$cookies","$resource","$http","$facebook","Session","Item","doozerURL","Solution",function(a,b,c,d,e,f,g,h,i){a.refresh=function(){i.for_user({last_sync:"1443931652"}),g.lists(function(c){var e=c.items;e&&(a.username=b.get("username"),a.loggedIn=!0,a.lists=e,a.sessionId=b.get("doozerSession"),d.defaults.headers.common.sessionId=b.get("doozerSession"))},function(c){401==c.status&&(a.loggedIn=!1,b.remove("doozerSession"),console.log("not logged in"))})},b.get("doozerSession")?a.refresh():(a.loggedIn=!1,console.log("no session in the cookies!")),a.login=function(){e.login().then(function(g){f.login({token:g.authResponse.accessToken},function(f){b.put("doozerSession",f.sessionId),d.defaults.headers.common.sessionId=f.sessionId,e.api("/me").then(function(c){a.username=c.name,b.put("username",c.name)});var i=c(h+"/lists",null,{query:{headers:{sessionId:f.sessionId}}});i.query(function(b){a.lists=b.items,a.username=g.name,a.loggedIn=!0,a.sessionId=f.sessionId})})})},a.logout=function(){e.logout().then(function(){f.logout(function(){b.remove("doozerSession"),a.loggedIn=!1})})},a.addList=function(){var b={title:a.newList.trim(),archive:!1};if(b.title){var c=new g;c.title=b.title,c.archive=b.archive,g.save(c,function(b){a.lists.push(b),a.newList=""})}},a.removeList=function(b){g.archive({item_id:b.id},function(){a.lists.splice(a.lists.indexOf(b),1)})},a.editItem=function(b){a.editedItem=b,a.originalItem=angular.extend({},b)},a.saveEdits=function(b){g.get({item_id:b.id},function(c){c.title=b.title,c.$update({item_id:b.id}),a.editedItem=null})}}]),angular.module("webClientApp").controller("SearchCtrl",["$scope","$routeParams","$facebook","$location","Search",function(a,b,c,d,e){a.search=function(){e.query({searchTerm:a.searchTerm.trim()},function(b){a.results=b.items,a.request_time=b.request_time,d.path("search/"+a.searchTerm)})},c.api("/me").then(function(b){a.userId=b.id}),b.searchTerm&&(a.searchTerm=b.searchTerm,a.search())}]),angular.module("webClientApp").controller("SolutionCtrl",["$scope","$routeParams","Solution","Search","Item",function(a,b,c,d,e){c.get({id:b.id},function(b){a.solution=b,a.solution.expire_date=new Date(a.solution.expire_date)}),c.items({id:b.id},function(b){b.items?(a.items=b.items,angular.forEach(a.items,function(b){a.getParent(b),a.getState(b)})):a.items=[]}),c.performance({id:b.id},function(b){a.solution_performance=b}),a.getParent=function(a){e.get({item_id:a.parent},function(b){a.parentTitle=b.title})},a.getState=function(a){c.state({id:b.id,item_id:a.id},function(b){a.solution_state=b,a.solution_state.current=a.solution_state.like>0?"Liked":a.solution_state.like<0?"Disliked":a.solution_state.views>0?"Viewed":"Unseen"},function(b){404==b.status&&(a.solution_state={},a.solution_state.current="Unseen",a.solution_state.like=0,a.solution_state.clicks=0,a.solution_state.views=0)})},a.toggleMap=function(d){var e=a.checkLink(d);-1===e?c.mapItem({id:b.id,item_id:d.id},function(){a.items.unshift(d)}):c.unmapItem({id:b.id,item_id:d.id},function(){a.items.splice(e,1)})},a.checkLink=function(b){if(null===b)return-1;if(a.items.length<1)return-1;for(var c=0;c<a.items.length;c++)if(a.items[c].id===b.id)return c;return-1},a.search=function(){return""==a.searchTerm.trim()?(a.results=void 0,void(a.request_time="")):void d.query({searchTerm:a.searchTerm.trim()},function(b){a.results=b.items,a.request_time=b.request_time;for(var c=a.results.length-1;c>=0;c--)if(a.results[c].parent)a.getParent(a.results[c]);else{var d=a.results.splice(c,1);console.log("skipped list: "),console.log(d)}})},a.saveSolutionEdits=function(a){c.get({id:a.id},function(b){b.tags=a.tags,b.link=a.link,b.img_link=a.img_link,b.expire_date=a.expire_date,b.notes=a.notes,b.title=a.title,b.source=a.source,b.price=a.price,b.phone_number=a.phone_number,b.open_hours=a.open_hours,b.address=a.address,b.description=a.description,b.$update({id:a.id},function(a){console.log("solution saved: "),console.log(a)})})}}]),angular.module("webClientApp").controller("SolutionsCtrl",["$scope","$routeParams","Solution","Search","Item","User",function(a,b,c,d,e,f){a.solutions=[],a.users=[],a.beta_uids=[4614807584795,0x23e28c4b3cae3c,0x23e4b0455c447e],a.active_items=[],a.active_beta_items=[],a.all_items=[],a.show_beta=!0,c.query(function(b){a.solutions=b,angular.forEach(a.solutions,function(a){c.performance({id:a.id},function(b){a.performance=b})})}),f.query(function(b){a.users=b,angular.forEach(a.users,function(b){e.listsForUser({userId:b.uid},function(c){var d=a.checkBetaUser(b.uid);a.getItemsFromList(c.items,b,d)})})}),a.getItemsFromList=function(b,c,d){var f=[];angular.forEach(b,function(b){e.childrenForUser({item_id:b.id,userId:c.uid},function(b){f=a.getActiveItems(b.items),a.active_items=a.active_items.concat(f),d&&(a.active_beta_items=a.active_beta_items.concat(f))})})},a.getActiveItems=function(a){var b=[];return angular.forEach(a,function(a){(void 0==a.type||""==a.type)&&1!=a.archive&&1!=a.done&&b.push(a)}),console.log("finished getting active items from another list"),b},a.checkBetaUser=function(b){for(var c=0;c<a.beta_uids.length;c++)if(b==a.beta_uids[c])return!0;return!1},a.removeSolution=function(b){c["delete"]({id:b.id},function(){a.solutions.splice(a.solutions.indexOf(b),1)})},a.getItemParent=function(a){e.get({item_id:a.parent},function(b){a.parentTitle=b.title})},a.search=function(){return""==a.searchTerm.trim()?(a.item_results=void 0,a.item_request_time="",void(a.solution_results=void 0)):void d.query({searchTerm:a.searchTerm.trim()},function(b){a.item_results=b.items,a.item_request_time=b.request_time,a.solution_results=!0;for(var c=a.item_results.length-1;c>=0;c--)if(a.item_results[c].parent)a.getItemParent(a.item_results[c]);else{var d=a.item_results.splice(c,1);console.log("skipped list: "),console.log(d)}})}}]),angular.module("webClientApp").controller("SolutionInterCtrl",["$scope","$routeParams","Solution","Search","Item",function(a,b,c){a.likeSolution=function(a){c.like({id:a.id,item_id:b.id},function(){alert("liked")})},a.dislikeSolution=function(a){c.dislike({id:a.id,item_id:b.id},function(){alert("disliked")})}}]),angular.module("webClientApp").controller("UsersCtrl",["$scope","$routeParams","User",function(a,b,c){c.query(function(b){a.users=b})}]),angular.module("webClientApp").controller("UserCtrl",["$scope","$routeParams","User","Item",function(a,b,c,d){c.get({userId:b.id},function(b){a.user=b}),d.listsForUser({userId:b.id},function(b){a.lists=b.items})}]),angular.module("webClientApp").controller("ListCtrl",["$scope","$routeParams","Item",function(a,b,c){var d=33554432,e=2147483647;a.editedItem=null,a.isDoneGroupOpen=!1,a.hasDoneHeader=!1,c.children({item_id:b.id},function(d){a.items=d.items,a.list=c.get({item_id:b.id});var e=-1;angular.forEach(a.items,function(b){b.order&&b.order>e&&(e=b.order),b.duedate=new Date(b.duedate),"completed_header"==b.type&&(console.log("completed header found:"),console.log(b),a.hasDoneHeader=!0)}),-1===e&&f.reorderList(a.items)});var f={move:function(b,c){if(1===b.length)b[0].order=d,a.saveEdits(b[0]);else if(0===c)b[1].order>2?(b[c].order=Math.floor(b[1].order/2),a.saveEdits(b[c])):(b[c].order=0,f.reorderList(b));else if(c===b.length-1)b[b.length-2].order+d<e?(b[c].order=b[b.length-2].order+d,a.saveEdits(b[c])):(b[c].order=b[b.length-2].order+1,f.reorderList(b));else{var g=b[c+1].order-b[c-1].order;if(g>3){var h=b[c-1].order+Math.floor(g/2);b[c].order=h,a.saveEdits(b[c])}else b[c].order=b[c-1].order+1,f.reorderList(b)}return b},reorderList:function(b){var c=d;console.log("reorderList"),(b.length-1)*d>e&&(c=Math.floor(e/b.length));var f=c;return angular.forEach(b,function(b){b.order=f,a.saveEdits(b),f+=c}),b},outputList:function(a){var b="";angular.forEach(a,function(a){b=b+", "+a.title+": "+a.order}),console.log(b)}};a.indexOfFirstDone=function(){if(void 0===a.items)return void console.log("indexOfFirstDone() called while $scope.items is undefined");for(var b=0;b<a.items.length;b++)if(a.items[b].done)return b;return a.items.length},a.lengthOfUndone=function(){var b=a.indexOfFirstDone();return 1==a.hasDoneHeader?b-1:b},a.sortableOptions={beforeStop:function(b,c){a.dest=c.item.index()},stop:function(){f.move(a.items,a.dest)},cursor:"move",cancel:".unsortable",items:"li:not(.unsortable)"},a.addItem=function(){var b={title:a.newItem.trim(),parent:a.list.id,done:!1,archive:!1};if(b.title){var d=new c;d.title=b.title,d.parent=b.parent,d.done=b.done,d.archive=b.archive,c.save(d,function(b){a.items.unshift(b),a.newItem="",f.move(a.items,0)})}},a.removeItem=function(b){c.archive({item_id:b.id},function(){a.items.splice(a.items.indexOf(b),1)})},a.toggle=function(b){c.get({item_id:b.id},function(c){console.log(b);var d;c.done=b.done,c.done=!c.done,c.duedate=new Date(b.duedate),a.items.splice(a.items.indexOf(b),1),d=1==c.done?a.indexOfFirstDone():a.lengthOfUndone(),void 0===d&&(d=a.items.length),a.items.splice(d,0,c),f.move(a.items,d)})},a.editItem=function(b){null===b?a.editedItem=null:(a.editedItem=b,a.originalItem=angular.extend({},b))},a.saveEdits=function(b){c.get({item_id:b.id},function(c){c.title=b.title,c.type=b.type,c.order=b.order,c.done=b.done,c.notes=b.notes,c.duedate=b.duedate,c.$update({item_id:b.id}),a.editedItem=null,console.log("saved item: "),console.log(b)})},a.revertEdits=function(b){b=a.originalItem,a.editedItem=null}}]),angular.module("webClientApp").controller("ItemCtrl",["$scope","$routeParams","Item","Solution",function(a,b,c,d){c.get({item_id:b.id},function(b){a.item=b,c.get({item_id:a.item.parent},function(b){a.item.parentTitle=b.title})}),c.solutions({item_id:b.id},function(c){a.solutions=c.items,angular.forEach(a.solutions,function(a){d.view({id:a.id,item_id:b.id},function(){})})})}]),angular.module("webClientApp").controller("IndexCtrl",["$scope",function(a){a.username="joe"}]),angular.module("webClientApp").controller("ItemExpertCtrl",["$scope","$routeParams","Item","Solution","User",function(a,b,c,d,e){a.solutions=[],a.allsolutions=[],a.item=null,a.user=null,c.get({item_id:b.id},function(b){a.item=b,c.get({item_id:a.item.parent},function(b){a.item.parentTitle=b.title}),e.get({userId:a.item.user_id},function(b){a.user=b})}),c.solutions({item_id:b.id},function(b){b.items?(a.solutions=b.items,angular.forEach(a.solutions,function(b){a.getState(b)})):a.solutions=[]}),d.query(function(b){a.allsolutions=b}),a.getState=function(a){d.state({id:a.id,item_id:b.id},function(b){a.item_state=b,a.item_state.current=a.item_state.like>0?"Liked":a.item_state.like<0?"Disliked":a.item_state.views>0?"Viewed":"Unseen"},function(b){404==b.status&&(a.item_state={},a.item_state.current="Unseen",a.item_state.like=0,a.item_state.clicks=0,a.item_state.views=0)})},a.toggleMap=function(b){var c=a.checkLink(b);-1===c?a.map(b):a.unmap(b,c)},a.checkLink=function(b){if(null===b)return-1;if(a.solutions.length<1)return-1;for(var c=0;c<a.solutions.length;c++)if(a.solutions[c].id===b.id)return c;return-1},a.map=function(d){c.mapSolution({solution_id:d.id,item_id:b.id},function(){a.solutions.unshift(d)})},a.unmap=function(d,e){c.unmapSolution({solution_id:d.id,item_id:b.id},function(){a.solutions.splice(e,1)})}}]),angular.module("webClientApp").controller("CreateSolutionCtrl",["$scope","$routeParams","Solution",function(a,b,c){a.btnText||(a.btnText="Create tip");var d=function(a){return a?a.trim():""};a.createSolution=function(){var b=new c({title:d(a.solution.title),source:d(a.solution.source),price:d(a.solution.price),phone_number:d(a.solution.phone_number),open_hours:d(a.solution.open_hours),link:d(a.solution.link),tags:d(a.solution.tags),expire_date:a.solution.expire_date,img_link:d(a.solution.img_link),description:d(a.solution.description),address:d(a.solution.address),notes:d(a.solution.notes)});c.save(b,function(b){console.log("saved solution: "),console.log(b),a.mapItem?a.map(b,a.mapItem):a.solutions&&a.solutions.push(b),$("#newSolModal").modal("hide"),a.solution=angular.copy({})})},a.map=function(b,d){c.mapItem({id:b.id,item_id:d.id},function(){c.get({id:b.id},function(b){a.mappedSolutions&&a.mappedSolutions.push(b),a.solutions&&a.solutions.push(b)})})}}]),angular.module("webClientApp").factory("Session",["$resource","$cookies","doozerURL",function(a,b,c){return a(c+"login/:token",{token:"@token"},{login:{method:"GET"},logout:{url:c+"logout",method:"DELETE",headers:{sessionId:b.get("doozerSession")}}})}]),angular.module("webClientApp").factory("doozerList",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){var e=a(d+"items/:item_id",{},{query:{headers:{sessionId:c.get("doozerSession")}},get:{headers:{sessionId:c.get("doozerSession")}}}),f={getLists:function(){return e.query({item_id:"index"})},getChildren:function(a){return e.query({item_id:a})},createItem:function(a){return e.save(a)},getItem:function(){},updateItem:function(){},deleteItem:function(){},searchTitles:function(){}};return f}]),angular.module("webClientApp").factory("Item",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"items/:item_id",{item_id:"@item_id",userId:"@userId"},{lists:{url:d+"lists",method:"GET"},listsForUser:{url:d+"listsForUser/:userId",method:"GET"},items:{url:d+"items",method:"GET"},children:{url:d+"items/:item_id/children",method:"GET"},childrenForUser:{url:d+"items/:item_id/childrenForUser/:userId",method:"GET"},archive:{url:d+"items/:item_id/archive",method:"DELETE"},"delete":{method:"DELETE"},get:{},update:{url:d+"items/:item_id",method:"PUT"},mapSolution:{url:d+"items/:item_id/mapSolution",method:"POST"},unmapSolution:{url:d+"items/:item_id/unmapSolution",method:"POST"},solutions:{url:d+"items/:item_id/solutions",method:"GET"}})}]),angular.module("webClientApp").factory("User",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"users/:userId",{userId:"@userId"},{updateAdmin:{url:d+"updateAdmin",method:"PUT"}})}]),angular.module("webClientApp").factory("Search",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"items/:searchTerm/search",{searchTerm:"@searchTerm"},{query:{method:"GET"}})}]),angular.module("webClientApp").factory("Solution",["$resource","$http","$cookies","doozerURL",function(a,b,c,d){return b.defaults.headers.common.sessionId=c.get("doozerSession"),a(d+"solutions/:id",{id:"@id",item_id:"@item_id"},{query:{isArray:!0},"delete":{method:"DELETE"},get:{},update:{method:"PUT"},mapItem:{url:d+"solutions/:id/mapItem",method:"POST"},unmapItem:{url:d+"solutions/:id/unmapItem/:item_id",method:"DELETE"},items:{url:d+"solutions/:id/items",method:"GET"},like:{url:d+"solutions/:id/like/:item_id",method:"POST"},dislike:{url:d+"solutions/:id/dislike/:item_id",method:"POST"},view:{url:d+"solutions/:id/view/:item_id",method:"POST"},state:{url:d+"solutions/:id/state/:item_id",method:"GET"},performance:{url:d+"solutions/:id/performance",method:"GET"},for_user:{url:d+"solutions/for_user/:last_sync",method:"GET"}})}]),angular.module("webClientApp").directive("itemEscape",function(){var a=27;return function(b,c,d){c.bind("keydown",function(c){c.keyCode===a&&b.$apply(d.itemEscape)})}}),angular.module("webClientApp").directive("itemFocus",["$timeout",function(a){return function(b,c,d){b.$watch(d.itemFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]),angular.module("ui.sortable",[]).value("uiSortableConfig",{}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,b,c){return{require:"?ngModel",scope:{ngModel:"=",uiSortable:"="},link:function(d,e,f,g){function h(a,b){return b&&"function"==typeof b?function(){a.apply(this,arguments),b.apply(this,arguments)}:a}function i(a){var b=a.data("ui-sortable");return b&&"object"==typeof b&&"ui-sortable"===b.widgetFullName?b:null}function j(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}function k(a){return/left|right/.test(a.css("float"))||/inline|table-cell/.test(a.css("display"))}function l(a,b){for(var c=null,d=0;d<a.length;d++){var e=a[d];if(e.element[0]===b[0]){c=e.scope;break}}return c}function m(a,b){b.item.sortable._destroy()}var n,o={},p={"ui-floating":void 0},q={receive:null,remove:null,start:null,stop:null,update:null},r={helper:null};return angular.extend(o,p,a,d.uiSortable),angular.element.fn&&angular.element.fn.jquery?(g?(d.$watch("ngModel.length",function(){b(function(){i(e)&&e.sortable("refresh")},0,!1)}),q.start=function(a,b){if("auto"===o["ui-floating"]){var c=b.item.siblings(),d=i(angular.element(a.target));d.floating=k(c)}b.item.sortable={model:g.$modelValue[b.item.index()],index:b.item.index(),source:b.item.parent(),sourceModel:g.$modelValue,cancel:function(){b.item.sortable._isCanceled=!0},isCanceled:function(){return b.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!b.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:b.item.sortable._isCustomHelperUsed,_destroy:function(){angular.forEach(b.item.sortable,function(a,c){b.item.sortable[c]=void 0})}}},q.activate=function(a,b){n=e.contents();var c=e.sortable("option","placeholder");if(c&&c.element&&"function"==typeof c.element){var f=c.element();f=angular.element(f);var g=e.find('[class="'+f.attr("class")+'"]:not([ng-repeat], [data-ng-repeat])');n=n.not(g)}var h=b.item.sortable._connectedSortables||[];h.push({element:e,scope:d}),b.item.sortable._connectedSortables=h},q.update=function(a,b){if(!b.item.sortable.received){b.item.sortable.dropindex=b.item.index();var c=b.item.parent();b.item.sortable.droptarget=c;var f=l(b.item.sortable._connectedSortables,c);b.item.sortable.droptargetModel=f.ngModel,e.sortable("cancel")}j(e,b)&&!b.item.sortable.received&&"parent"===e.sortable("option","appendTo")&&(n=n.not(n.last())),n.appendTo(e),b.item.sortable.received&&(n=null),b.item.sortable.received&&!b.item.sortable.isCanceled()&&d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)})},q.stop=function(a,b){!b.item.sortable.received&&"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()?d.$apply(function(){g.$modelValue.splice(b.item.sortable.dropindex,0,g.$modelValue.splice(b.item.sortable.index,1)[0])}):"dropindex"in b.item.sortable&&!b.item.sortable.isCanceled()||j(e,b)||n.appendTo(e),n=null},q.receive=function(a,b){b.item.sortable.received=!0},q.remove=function(a,b){"dropindex"in b.item.sortable||(e.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||d.$apply(function(){b.item.sortable.moved=g.$modelValue.splice(b.item.sortable.index,1)[0]})},r.helper=function(a){return a&&"function"==typeof a?function(b,c){var d=a.apply(this,arguments);return c.sortable._isCustomHelperUsed=c!==d,d}:a},d.$watch("uiSortable",function(a){var b=i(e);b&&angular.forEach(a,function(a,c){return c in p?("ui-floating"!==c||a!==!1&&a!==!0||(b.floating=a),void(o[c]=a)):(q[c]?("stop"===c&&(a=h(a,function(){d.$apply()}),a=h(a,m)),a=h(q[c],a)):r[c]&&(a=r[c](a)),o[c]=a,void e.sortable("option",c,a))})},!0),angular.forEach(q,function(a,b){o[b]=h(a,o[b]),"stop"===b&&(o[b]=h(o[b],m))})):c.info("ui.sortable: ngModel not provided!",e),void e.sortable(o)):void c.error("ui.sortable: jQuery should be included before AngularJS!")}}}]),angular.module("webClientApp").directive("dzrSolution",function(){return{restrict:"E",scope:{solution:"=",solutionPerf:"=",expert:"@",checkToggle:"&",toggleAction:"&",saveEdits:"&"},templateUrl:"scripts/directives/dzr-solution.html",controller:"SolutionInterCtrl"}}),angular.module("webClientApp").directive("dzrItem",function(){return{restrict:"E",scope:{item:"=",user:"=",expert:"@",checkToggle:"&",toggleAction:"&"},templateUrl:"scripts/directives/dzr-item.html"}}),angular.module("webClientApp").directive("newSolution",function(){return{restrict:"E",scope:{solutions:"=",btnText:"@",mapItem:"=",mappedSolutions:"="},templateUrl:"scripts/directives/new-solution.html",controller:"CreateSolutionCtrl"}});