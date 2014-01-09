'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('beatflipzApp'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it("should have an object loginModel", function () {
    expect(scope.hasOwnProperty('loginModel')).toBe(true);
  });

  it("should have an authentication function", function () {
    expect(scope.hasOwnProperty('authenticate')).toBe(true);
  });

});