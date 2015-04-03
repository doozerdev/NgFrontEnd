'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('webClientApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  //fake tests since karma requires at least one
  describe('A suite', function() {
    it('contains spec with an expectation', function() {
      expect(true).toBe(true);
    });
  });
});
