'use strict';


// Declare app level module which depends on filters, and services
angular.module('beatflipzApp', [
	'ngRoute',
	'ngTouch',
	'beatflipzApp.services',
	'beatflipzApp.controllers',
	'ionic.ui.content'
]).
config(['$routeProvider', '$httpProvider',
	function ($routeProvider, $httpProvider) {
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
		$routeProvider.otherwise({
			redirectTo: '/login'
		});
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	}
]);