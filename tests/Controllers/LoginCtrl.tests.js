describe('Controllers - LoginCtrl', function(){
  // load the controller's module
  beforeEach(module('starter.controllers'));

  var scope,
  LoginCtrl,
  mockUserService,
  mockAuthenticationService,
  state,
  window;

  beforeEach(inject(function($rootScope, $controller, $q) {

    // Fake user service
    var mockUserService = {
      login: function (email, password){},
      signUp: function (email, password, username){}
    };

    spyOn(mockUserService,"login").and.callFake(function(email, password){
      var deferred = $q.defer();
      // return something (res)
      deferred.resolve({});
      return deferred.promise;
    });
    spyOn(mockUserService,"signUp").and.callFake(function(email, password, username){
      var deferred = $q.defer();
      // return something (res)
      deferred.resolve({});
      return deferred.promise;
    });

    // Fake authentication service
    var mockAuthenticationService = {
    };

    scope = $rootScope.$new();
    // Providers

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $state: state,
      $window: window,
      UserService: mockUserService,
      AuthenticationService: mockAuthenticationService
    });
  }));

  // tests start here
  describe('Info user',function(){

    it('should be empty at the begining', function(){
      expect(scope.user).toEqual({email: '', password: ''});
      expect(scope.error).toEqual("");
    });
  });

});
