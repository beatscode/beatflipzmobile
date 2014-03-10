'use strict';
// Declare app level module which depends on filters, and services
angular.module('beatflipzApp', [
	'ngRoute',
	'ngTouch',
	'ngSanitize',
	'beatflipzApp.services',
	'beatflipzApp.controllers',
	'ionic'
]).
run(function () {
	//FastClick.attach(document.body);
}).
config(['$routeProvider', '$httpProvider', '$sceProvider',
	function ($routeProvider, $httpProvider, $sceProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		});
		$routeProvider.when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		});
		$routeProvider.when('/contacts', {
			templateUrl: 'views/contact.html',
			controller: 'ContactCtrl'
		});
		$routeProvider.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		});
		$routeProvider.when('/tags', {
			templateUrl: 'views/tag.html',
			controller: 'TagCtrl'
		});
		$routeProvider.when('/beatflipzad', {
			templateUrl: 'views/beatflipzadvertisement.html',
			controller: 'BeatFlipzAdCtrl'
		});
		$routeProvider.when('/inbox', {
			templateUrl: 'views/inbox.html',
			controller: 'InboxCtrl'
		});
		$routeProvider.otherwise({
			redirectTo: '/register'
		});
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

		$sceProvider.enabled(false);
	}
]);
'use strict';

/* Controllers */

angular.module('beatflipzApp.controllers', [])
	.controller('NavigationCtrl', ['$rootScope', '$scope',
		function ($rootScope, $scope) {
			$scope.back = function () {
				console.log("back");
			};

			$scope.next = function () {
				console.log("next");
			}
		}
	])
	.controller('HomeCtrl', ['$scope', 'environment', 'userService', '$location',
		function ($scope, environment, userService, $location) {

			//Check whether user object exists
			if (userService.attempt() === false) {
				$location.path('/register');
			}

		}
	]).controller('TagCtrl', ['$scope', 'environment', '$rootScope', 'tagService', 'userService', '$location',
		function ($scope, environment, $rootScope, tagService, userService, $location) {
			$scope.sTags = {};
		}
	])
	.controller('TagCtrl', ['$scope', 'environment', '$rootScope', 'tagService', 'userService', '$location',
		function ($scope, environment, $rootScope, tagService, userService, $location) {
			$scope.sTags = {};

			$scope.setUserTagsOn = function (serverTags) {
				for (var i = serverTags.length - 1; i >= 0; i--) {
					if ($rootScope.user.tags.indexOf(serverTags[i].tag) != -1) {
						$scope.sTags[serverTags[i].tag] = true;
					}
				}
			}

			$scope.getServerTags = function () {
				tagService.refresh().then(function (serverTags) {
					//console.log(serverTags);
					$scope.tags = serverTags;
					$scope.setUserTagsOn(serverTags);

				}, function (err) {
					console.log(err);
					alert(err);
				});
			};

			$scope.checkUserTag = function (tag) {
				return $scope.sTags && $scope.sTags.hasOwnProperty(tag);
			};

			$scope.selectTag = function (tag) {
				$scope.sTags[tag] = true;
			}

			$scope.deselectTag = function (tag) {
				delete $scope.sTags[tag];
			}

			$scope.saveTags = function () {
				var tags_to_save = [],
					new_user_array = [];

				for (var x in $scope.sTags) {
					if ($scope.sTags[x] === true) {
						tags_to_save.push(x);
					}
				}
				if (tags_to_save.length > 0) {
					tagService.saveTags($rootScope.user.user.id, tags_to_save).then(function (data) {
						var msg;
						if ($rootScope.user.type == "artist") {
							msg = "Tags Saved!\nYou'll recieve music based on your tags shortly";
						} else {
							msg = "Tags Saved!";
						}

						//Save user to persistence layer
						$rootScope.user.tags = tags_to_save;
						userService.setUser($rootScope.user);
						alert(msg);
					}, function (err) {
						alert(err);
					});
				}
			}

			$scope.init = (function () {
				if (userService.attempt()) {
					$scope.getServerTags();
					$scope.user = $rootScope.user.user;
				} else {
					$location.path('/');
				}
			})();

		}
	])
	.controller('InboxCtrl', ['$scope', 'environment',
		function ($scope, environment) {

		}
	])
	.controller('LoginCtrl', ['$scope', 'environment', '$http', '$location', '$rootScope', 'userService',
		function ($scope, environment, $http, $location, $rootScope, userService) {
			$scope.loginModel = {};

			$scope.authenticate = function () {
				$scope.error = false;
				userService.authenticate($scope.loginModel).then(
					function (data) {
						$location.path('/contacts');
					}, function (err) {
						$scope.error = err;
					});
			};

			$scope.init = (function () {

				if (userService.attempt()) {
					$location.path("/contacts");
				}
				$scope.error = false;
			})();
		}
	])
	.controller('RegisterCtrl', ['$rootScope', '$scope', 'environment', '$location', '$http',

		function ($rootScope, $scope, environment, $location, $http) {
			$scope.registerModel = {};

			$scope.register = function () {
				$scope.error = false;
				if (!$scope.registerModel.password || $scope.registerModel.password !== $scope.registerModel.password_conf) {
					$scope.error = 'Invalid Password';
					return false;
				}

				if (!$scope.registerModel.type) {
					$scope.error = "Must select a type";
					return false;
				}

				var postString = "alias=" + $scope.registerModel.email + "&email=" + $scope.registerModel.email + "&password=" + $scope.registerModel.password + "&type=" + $scope.registerModel.type;

				$http.post(environment.api + '/mobile/register', postString).success(function (data) {
					if (data) {
						if (data == 'false') {
							data = [];
						}
						if (data.hasOwnProperty('error')) {
							$scope.error = data.error;
						} else {

							$rootScope.user = data;
							window.localStorage.setItem('user', angular.toJson(data));
							$location.path('/home');
						}
					} else {
						console.log(data);
						$scope.error = "Invalid Registration";
					}
				}).error(function (err) {
					$scope.error = err;
				});
			}
		}
	])

.controller('ContactCtrl', ['$rootScope', '$scope', 'environment', 'contactService', '$location', 'userService',
	function ($rootScope, $scope, environment, contactService, $location, userService) {

		$scope.search = '';
		$scope.showSearch = false;

		$scope.getContacts = function () {

			contactService.refresh().then(
				function (data) {
					$scope.contacts = data;
				}, function (err) {
					alert(err);
				});

		};

		$scope.renderIframe = function (iframe) {

			if (iframe) {
				var testUrl = iframe.match(/'(http:.+)'/),
					onlyUrl = testUrl && testUrl[1];
				window.console.log(testUrl);
			}
			return iframe;
		}

		function getYouTubeLink(url) {
			var isYouTube = RegExp(/\.youtube\.com.+v=([\w_\-]+)/i);
			var r = isYouTube.exec(url);
			if (r && r[1]) {
				var video = 'http://www.youtube.com/v/' + url + '&hl=en&fs=1&';
				var youtube = '<embed src="' + video + '" type="application/x-shockwave-flash"' +
					' allowscriptaccess="always"' +
					' allowfullscreen="true" width="90" height="60"></embed>';
				return youtube;
			}
		}

		//Show Contact Tweet
		$scope.showContact = function (contact) {
			alert(contact.date + "\n" + contact.tweet);
		};

		/**
		 * Show different labels for different tags
		 * @param  {[type]} contact [description]
		 * @return {[type]}         [description]
		 */
		$scope.getTagClass = function (contact) {
			var _class = 'label label-default';

			switch (contact.tag.toLowerCase()) {
			case 'commercial':
				_class = "badge badge-positive";
				break;
			case 'trap':
				_class = "badge badge-royal";
				break;
			case 'fire':
				_class = "badge badge-energized";
				break;
			case 'bangers':
			case 'original':
				_class = "badge badge-calm";
				break;
			case 'free':
			case 'soulful':
				_class = "badge badge-assertive";
				break;
			default:
				_class = "badge badge-dark";
			}
			return _class;
		}

		$scope.init = (function () {
			if (userService.attempt() === false) {
				$location.path("/");
				return;
			}
			$scope.getContacts();
		})();

	}
]);
//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
// angular.module('beatflipzApp.filters', []).filter('startFrom', function () {
// 	return function (input, start) {
// 		start = +start; //parse to int
// 		return input.slice(start);
// 	}
// });
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('beatflipzApp.services', []).
// value('version', '0.1');

angular.module('beatflipzApp.services', [])
	.service('contactService', ['$rootScope', 'environment', '$q', '$http',
		function ($rootScope, environment, $q, $http) {

			var self = this;
			self.shuffle = function (array) {
				var currentIndex = array.length,
					temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			}
			self.refresh = function () {
				var post = "";
				var deferred = $q.defer();

				var contacts = angular.fromJson(window.localStorage.getItem('contacts'));
				var expiry_date = window.localStorage.getItem('contact-expirationtime');

				if (contacts && expiry_date && environment.shouldIRefreshData(expiry_date) == false) {
					console.log('Get From localStorage');
					deferred.resolve(contacts);
				} else {
					$http.post(environment.api + '/mobile/getcontacts', post).success(function (data) {
						if (data) {
							var artists = data.artists;
							var producers = data.producers;
							data = self.shuffle(artists.concat(producers));
							//Set Expiration 1 day in the future
							var targetDate = new Date();
							targetDate.setDate(targetDate.getDate() + 1);
							console.log('Setting Local Stoage', targetDate.toString());

							window.localStorage.setItem('contact-expirationtime', targetDate.getTime().toString());
							var dataToStore = angular.toJson(data);
							window.localStorage.setItem('contacts', dataToStore);
							deferred.resolve(data);
						} else {
							deferred.reject("Data was rejected");
						}
					});
				}
				return deferred.promise;
			};

			return {
				refresh: function () {
					return self.refresh();
				}
			};
		}
	])

.service('tagService', ['$q', '$http', 'environment',

	function ($q, $http, environment) {

		var self = this;

		self.refresh = function () {
			var deferred = $q.defer();
			$http.post(environment.api + '/mobile/getPopularTags', '').success(function (data) {
				if (data) {
					//Set Expiration 1 day in the future
					var targetDate = new Date();
					targetDate.setDate(targetDate.getDate() + 1);
					console.log('Setting Local Stoage', targetDate.toString());
					window.localStorage.setItem('tags-expirationtime', targetDate.getTime().toString());
					var dataToStore = angular.toJson(data);
					window.localStorage.setItem('tags', dataToStore);
					deferred.resolve(data);
				} else {
					deferred.reject("Data was rejected");
				}
			});
			return deferred.promise;
		};

		self.saveTags = function (id, tags) {
			var deferred = $q.defer();
			if (!id || tags.length === 0) {
				deferred.reject("Could Not Save");
			} else {
				var post = "user_id=" + id + "&";
				for (var i = tags.length - 1; i >= 0; i--) {
					post += "tag[]=" + tags[i] + "&";
				}
				$http.post(environment.api + '/mobile/savetags', post).success(function (data) {
					if (data) {
						deferred.resolve(data);
					} else {
						deferred.reject("Data was rejected");
					}
				});
			}
			return deferred.promise;
		};

		return {
			refresh: function () {
				return self.refresh();
			},
			saveTags: function (id, tags) {
				return self.saveTags(id, tags);
			}
		};
	}
])
	.service('userService', [
		'$rootScope', '$http', '$q', 'environment',

		function ($rootScope, $http, $q, environment) {

			var self = this;

			self.authenticate = function (loginObj) {

				var deferred = $q.defer();

				if (!loginObj.email || !loginObj.password) {
					deferred.reject('Invalid Authentication');
				}

				var postString = "email=" + loginObj.email + "&password=" + loginObj.password;

				$http.post(environment.api + '/mobile/login', postString)
					.success(function (data, status, headers, config) {

						if (data) {
							if (data == 'false') {
								data = [];
							}
							if (data.hasOwnProperty('error')) {
								deferred.reject(data.error);
							} else {
								console.log(data)
								$rootScope.user = data;
								window.localStorage.setItem('user', angular.toJson(data));
								deferred.resolve(data);
							}
						} else {
							deferred.reject("Data was rejected");
						}
					})
					.error(function (data, status, headers, config) {
						console.log(data);
						deferred.reject('Invalid Authentication');
					});

				return deferred.promise;
			}
			/**
			 * Set user data inside localstorage
			 * @param {[type]} data [description]
			 */
			self.setUser = function (data) {
				if (data.hasOwnProperty('error')) {
					return false;
				}
				$rootScope.user = data;
				window.localStorage.setItem('user', angular.toJson(data));
				return data;
			};
			/**
			 * Authentication Check to see if a user
			 * model is available
			 * @return {[type]} [description]
			 */
			self.attempt = function () {
				var result = false;
				var localUser = window.localStorage.getItem('user');
				if (!$rootScope.user && !localUser) {
					result = false;
				} else {
					$rootScope.user = angular.fromJson(localUser);
					console.log($rootScope.user);
					result = true;
				}
				return result;
			};

			return {
				'attempt': function () {
					return self.attempt();
				},
				'setUser': function (data) {
					return self.setUser(data);
				},
				'authenticate': function (data) {
					return self.authenticate(data);
				}
			};
		}
	])
	.service('environment', [

		function () {
			var test = false;
			return {
				'api': (test) ? 'http://app.cassbeats.dev' : 'http://app.cassbeats.com',
				/**
				 * Should refresh data if expiration date is less then current date
				 * @param  {[type]} expiry_date_time [description]
				 * @return {[type]}                  [description]
				 */
				shouldIRefreshData: function (expiry_date_time) {

					var currentDate = new Date();
					var expirydate = new Date(Number(expiry_date_time));

					var shouldRefresh = expirydate.getTime() < currentDate.getTime();

					return (shouldRefresh) ? true : false;
				}

			};
		}
	]);