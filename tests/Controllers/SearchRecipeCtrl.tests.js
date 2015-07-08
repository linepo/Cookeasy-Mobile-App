describe('Controllers - SearchRecipeCtrl', function(){
  // load the controller's module
  beforeEach(module('starter.controllers'));

  var scope,
  SearchRecipeCtrl,
  mockRecipeService,
  mysearch;

  beforeEach(inject(function($rootScope, $controller, $q) {

    // Fake recipe service
    var mockRecipeService = {
      getSearchRecipe: jasmine.createSpy("getSearchRecipe").and.callFake(function(mysearch){
        var deferred = $q.defer();
        deferred.resolve([{name: 'carrot'}]);
        return deferred.promise;
      })
      // getTrends: jasmine.createSpy("getTrends").and.callFake(function(){
      //   var deferred = $q.defer();
      //   deferred.resolve();
      //   return deferred.promise;
      // })
    };

    scope = $rootScope.$new();
    // Providers
    state = jasmine.createSpyObj('state',['go']);

    SearchRecipeCtrl = $controller('SearchRecipeCtrl', {
      $scope: scope,
      $state: state,
      RecipeService: mockRecipeService
    });
  }));

  // tests start here
  it('should be empty or null at the begining', function(){
    expect(scope.recipes).toEqual([]);
  });

  it('should display recipes related to the word',function(){
    scope.mySearchRecipe = 'carrot';
    scope.searchRecipe();
    scope.$apply();
    expect(scope.recipes).toEqual([{name: 'carrot'}]);
  });

  it('should display the clicked recipe',function(){
    //test state.go -> change of scope because change of CTRL
  });

});
