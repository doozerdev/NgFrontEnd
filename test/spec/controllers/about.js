'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('webClientApp'));

  var AboutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AboutCtrl = $controller('AboutCtrl', {
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
