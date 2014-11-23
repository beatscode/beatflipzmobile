"use strict";angular.module("beatflipzApp",["ionic","ngRoute","ngTouch","ngSanitize","beatflipzApp.services","beatflipzApp.controllers"]).run(function(){}).config(["$routeProvider","$httpProvider","$sceProvider",function(a,b,c){a.when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}),a.when("/register",{templateUrl:"views/register.html",controller:"RegisterCtrl"}),a.when("/contacts",{templateUrl:"views/contact.html",controller:"ContactCtrl"}),a.when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl"}),a.when("/submission",{templateUrl:"views/submission.html",controller:"SubmissionCtrl"}),a.when("/tags",{templateUrl:"views/tag.html",controller:"TagCtrl"}),a.when("/beatflipzad",{templateUrl:"views/beatflipzadvertisement.html",controller:"BeatFlipzAdCtrl"}),a.when("/inbox",{templateUrl:"views/inbox.html",controller:"InboxCtrl"}),a.otherwise({redirectTo:"/login"}),b.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",c.enabled(!1)}]),angular.module("beatflipzApp.controllers",[]).controller("NavigationCtrl",["$rootScope","$scope",function(a,b){b.back=function(){console.log("back")},b.next=function(){console.log("next")}}]).controller("HomeCtrl",["$scope","environment","userService","$location",function(a,b,c,d){c.attempt()===!1&&d.path("/login")}]).controller("BeatFlipzAdCtrl",["$scope","environment",function(){}]).controller("SubmissionCtrl",["$scope","environment","userService","$location","$rootScope",function(a,b,c,d,e){a.soundManager=!1,(c.attempt()===!1||e.hasOwnProperty("selectedSubmission")===!1)&&d.path("/inbox"),a.init=function(){a.submission=e.selectedSubmission,console.log(a.submission)}(),a.getTwitter=function(){if(a.submission.twitter.length<1)return null;var b;return b=a.submission.twitter.indexOf("http")>-1?a.submission.twitter:"https://twitter.com/"+a.submission.twitter},a.play=function(b){for(var c,d=a.submission.tracks.length-1;d>=0;d--)b.id==a.submission.tracks[d].id?(a.submission.tracks[d].nowplaying="Loading...",c=d):a.submission.tracks[d].nowplaying=!1;a.stop(),a.soundManager=soundManager.createSound({id:b.id,url:b.url,autoLoad:!0,autoPlay:!0,onload:function(){a.submission.tracks[c].nowplaying="Now Playing",a.$apply()},volume:85})},a.stop=function(){a.soundManager&&a.soundManager.stop()}}]).controller("TagCtrl",["$scope","environment","$rootScope","tagService","userService","$location",function(a,b,c,d,e,f){a.sTags={},a.setUserTagsOn=function(b){for(var d=b.length-1;d>=0;d--)-1!=c.user.tags.indexOf(b[d].tag)&&(a.sTags[b[d].tag]=!0)},a.getServerTags=function(){d.refresh().then(function(b){a.tags=b,a.setUserTagsOn(b)},function(a){console.log(a),alert(a)})},a.checkUserTag=function(b){return a.sTags&&a.sTags.hasOwnProperty(b)},a.selectTag=function(b){a.sTags[b]=!0},a.deselectTag=function(b){delete a.sTags[b]},a.saveTags=function(){var b=[];for(var f in a.sTags)a.sTags[f]===!0&&b.push(f);b.length>0&&d.saveTags(c.user.user.id,b).then(function(){var a;a="artist"==c.user.type?"Tags Saved!\nYou'll recieve music based on your tags shortly":"Tags Saved!",c.user.tags=b,e.setUser(c.user),alert(a)},function(a){alert(a)})},a.init=function(){e.attempt()?(a.getServerTags(),a.user=c.user.user):f.path("/login")}()}]).controller("InboxCtrl",["$scope","environment","inboxService","userService","$rootScope","$location",function(a,b,c,d,e,f){a.init=function(){return d.attempt()===!1?void f.path("/login"):void c.getInbox(e.user.user.id).then(function(b){a.submissions=b},function(a){alert(a)})}(),a.loadSubmission=function(a){e.selectedSubmission=a,f.path("submission")}}]).controller("LoginCtrl",["$scope","environment","$http","$location","$rootScope","userService",function(a,b,c,d,e,f){a.loginModel={},a.authenticate=function(){a.error=!1,f.authenticate(a.loginModel).then(function(){d.path("/home")},function(b){a.error=b})},a.init=function(){1==f.attempt()&&d.path("/home"),a.error=!1}()}]).controller("RegisterCtrl",["$rootScope","$scope","environment","$location","$http",function(a,b,c,d,e){b.registerModel={},b.register=function(){if(b.error=!1,!b.registerModel.password||b.registerModel.password!==b.registerModel.password_conf)return b.error="Invalid Password",!1;if(!b.registerModel.type)return b.error="Must select a type",!1;var f="alias="+b.registerModel.email+"&email="+b.registerModel.email+"&password="+b.registerModel.password+"&type="+b.registerModel.type;e.post(c.api+"/mobile/register",f).success(function(c){c?("false"==c&&(c=[]),c.hasOwnProperty("error")?b.error=c.error:(a.user=c,window.localStorage.setItem("user",angular.toJson(c)),d.path("/home"))):(console.log(c),b.error="Invalid Registration")}).error(function(a){b.error=a})}}]).controller("ContactCtrl",["$rootScope","$scope","environment","contactService","$location","userService",function(a,b,c,d,e,f){b.search="",b.showSearch=!1,b.getContacts=function(){d.refresh().then(function(a){b.contacts=a},function(a){alert(a)})},b.renderIframe=function(a){if(a){{var b=a.match(/'(http:.+)'/);b&&b[1]}window.console.log(b)}return a},b.showContact=function(a){alert(a.date+"\n"+a.tweet)},b.getTagClass=function(a){var b="label label-default";switch(a.tag.toLowerCase()){case"commercial":b="badge badge-positive";break;case"trap":b="badge badge-royal";break;case"fire":b="badge badge-energized";break;case"bangers":case"original":b="badge badge-calm";break;case"free":case"soulful":b="badge badge-assertive";break;default:b="badge badge-dark"}return b},b.init=function(){return f.attempt()===!1?void e.path("/"):void b.getContacts()}()}]),angular.module("beatflipzApp.services",[]).service("contactService",["$rootScope","environment","$q","$http",function(a,b,c,d){var e=this;return e.shuffle=function(a){for(var b,c,d=a.length;0!==d;)c=Math.floor(Math.random()*d),d-=1,b=a[d],a[d]=a[c],a[c]=b;return a},e.refresh=function(){var a="",f=c.defer(),g=angular.fromJson(window.localStorage.getItem("contacts")),h=window.localStorage.getItem("contact-expirationtime");return g&&h&&0==b.shouldIRefreshData(h)?(console.log("Get From localStorage"),f.resolve(g)):d.post(b.api+"/mobile/getcontacts",a).success(function(a){if(a){var b=a.artists,c=a.producers;a=e.shuffle(b.concat(c));var d=new Date;d.setDate(d.getDate()+1),console.log("Setting Local Stoage",d.toString()),window.localStorage.setItem("contact-expirationtime",d.getTime().toString());var g=angular.toJson(a);window.localStorage.setItem("contacts",g),f.resolve(a)}else f.reject("Data was rejected")}),f.promise},{refresh:function(){return e.refresh()}}}]).service("tagService",["$q","$http","environment",function(a,b,c){var d=this;return d.refresh=function(){var d=a.defer();return b.post(c.api+"/mobile/getPopularTags","").success(function(a){if(a){var b=new Date;b.setDate(b.getDate()+1),console.log("Setting Local Stoage",b.toString()),window.localStorage.setItem("tags-expirationtime",b.getTime().toString());var c=angular.toJson(a);window.localStorage.setItem("tags",c),d.resolve(a)}else d.reject("Data was rejected")}),d.promise},d.saveTags=function(d,e){var f=a.defer();if(d&&0!==e.length){for(var g="user_id="+d+"&",h=e.length-1;h>=0;h--)g+="tag[]="+e[h]+"&";b.post(c.api+"/mobile/savetags",g).success(function(a){a?f.resolve(a):f.reject("Data was rejected")})}else f.reject("Could Not Save");return f.promise},{refresh:function(){return d.refresh()},saveTags:function(a,b){return d.saveTags(a,b)}}}]).service("userService",["$rootScope","$http","$q","environment",function(a,b,c,d){var e=this;return e.authenticate=function(e){var f=c.defer();e.email&&e.password||f.reject("Invalid Authentication");var g="email="+e.email+"&password="+e.password;return b.post(d.api+"/mobile/login",g).success(function(b){b?("false"==b&&(b=[]),b.hasOwnProperty("error")?f.reject(b.error):(a.user=b,window.localStorage.setItem("user",angular.toJson(b)),f.resolve(b))):f.reject("Data was rejected")}).error(function(a){console.log(a),f.reject("Invalid Authentication")}),f.promise},e.setUser=function(b){return b.hasOwnProperty("error")?!1:(a.user=b,window.localStorage.setItem("user",angular.toJson(b)),b)},e.attempt=function(){var b=!1,c=window.localStorage.getItem("user");return a.user||c?(a.user=angular.fromJson(c),b=a.user.hasOwnProperty("user")===!1?!1:!0):b=!1,b},{attempt:function(){return e.attempt()},setUser:function(a){return e.setUser(a)},authenticate:function(a){return e.authenticate(a)}}}]).service("inboxService",["$rootScope","$http","$q","environment",function(a,b,c,d){var e=this;return this.getInbox=function(a){var e=c.defer(),f="user_id="+a;return b.post(d.api+"/mobile/getInbox",f).success(function(a){a?e.resolve(angular.fromJson(a)):e.reject("Data was rejected")}).error(function(a){console.log(a),e.reject("Invalid Authentication")}),e.promise},{getInbox:function(a){return e.getInbox(a)}}}]).service("environment",[function(){var a=!1;return{api:a?"http://beatflipz.dev/app":"http://www.beatflipz.com/app",shouldIRefreshData:function(a){var b=new Date,c=new Date(Number(a)),d=c.getTime()<b.getTime();return d?!0:!1}}}]);