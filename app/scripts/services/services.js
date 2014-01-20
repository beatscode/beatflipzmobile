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