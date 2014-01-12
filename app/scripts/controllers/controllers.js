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
	.controller('HomeCtrl', ['$scope', 'environment',
		function ($scope, environment) {



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

			$scope.saveTags = function () {
				console.log($scope.sTags, $rootScope.user, $scope.sTags);
				var tags_to_save = [];
				for (var x in $scope.sTags) {
					if ($scope.sTags[x] === "true") {
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
	.controller('BeatFlipzAdCtrl', ['$scope', 'environment',
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
						$location.path('/home');
					}, function (err) {
						$scope.error = err;
					});
			};

			$scope.init = (function () {
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

		$scope.getContacts = function () {

			contactService.refresh().then(
				function (data) {
					$scope.contacts = data;
				}, function (err) {
					alert(err);
				});

		};

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