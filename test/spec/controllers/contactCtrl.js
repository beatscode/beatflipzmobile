describe('Controller: ContactCtrl', function () {

  // load the controller's module
  beforeEach(module('beatflipzApp'));

  var ContactCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactCtrl = $controller('ContactCtrl', {
      $scope: scope
    });
  }));

  it("should have an object loginModel", function () {
    expect(scope.hasOwnProperty('getContacts')).toBe(true);
  });

  it("should have an authentication function", function () {
    expect(scope.hasOwnProperty('search')).toBe(true);
    expect(scope.search).toBe('');
  });

});