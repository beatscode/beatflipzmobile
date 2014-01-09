describe('Controller: TagCtrl', function () {

	// load the controller's module
	beforeEach(module('beatflipzApp'));

	var TagCtrl,
		scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		TagCtrl = $controller('TagCtrl', {
			$scope: scope
		});
	}));

	it("should have an object sTags", function () {
		expect(scope.hasOwnProperty('sTags')).toBe(true);
	});

	it("should have an authentication function", function () {
		expect(scope.hasOwnProperty('getServerTags')).toBe(true);
	});
});