describe('Controller: RegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('beatflipzApp'));

  var RegisterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisterCtrl = $controller('RegisterCtrl', {
      $scope: scope
    });
  }));

  it("should have an object loginModel", function () {
    expect(scope.hasOwnProperty('registerModel')).toBe(true);
  });

  it("should have an authentication function", function () {
    expect(scope.hasOwnProperty('register')).toBe(true);
  });

  it("should return false if password doesn't match", function () {
    scope.registerModel = {
      'password': '12341234',
      'password_conf': '1234'
    };

    expect(scope.register()).toBe(false);

    //expect(scope.error).toBe('Invalid Password');

    scope.registerModel = {
      'password_conf': '1234'
    };
    expect(scope.register()).toBe(false);
    //expect(scope.error).toBe("Must select a type");
  });
});