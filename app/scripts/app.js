'use strict';
// Declare app level module which depends on filters, and services
angular.module('beatflipzApp', [
	'ionic',
	'ngRoute',
	'ngTouch',
	'ngSanitize',
	'beatflipzApp.services',
	'beatflipzApp.controllers',
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
		$routeProvider.when('/submission', {
			templateUrl: 'views/submission.html',
			controller: 'SubmissionCtrl'
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
			redirectTo: '/login'
		});


		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

		$sceProvider.enabled(false);
	}
]);