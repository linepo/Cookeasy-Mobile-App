describe('Controllers - DisplayRecipeCtrl', function(){
  // load the controller's module
  beforeEach(module('starter.controllers'));

  var scope,
  state,
  http,
  filter,
  timeout,
  DisplayRecipeCtrl,
  mockRecipeService,
  stateParams = {id: '12345'};

  beforeEach(inject(function($rootScope, $controller, $q) {

    // Initiate modal
    //var modal;
    // Recipe sample
    var recipe = {
      "_id": {
        "$oid": "556862d9e4b0926349bdbf60"
      },
      "name": "Chicken tomato",
      "course": 1,
      "createdOn": 1432307009187,
      "nbPerson": 2,
      "time": 1432307009187,
      "difficulty": 2,
      "author": "GeorgePompidou",
      "picture": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653456/cwnlqcwoha8jdzv2bfwk.jpg",
      "utensils": [],
      "comments": [
        {
          "date": 1432741022616,
          "message": "This is awesome",
          "author": "trtr",
          "mark": 3
        },
        {
          "date": 1432802668649,
          "message": "This was an awesome recipe I look forward to make it again.\nAll my children really liked it !",
          "author": "John"
        },
        {
          "date": 1432891113453,
          "author": "plop",
          "mark": 3,
          "message": "kjcbkbefc zvdfbvqeghtnb"
        },
      ],
      "steps": [
        {
          "picture": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653408/hackklsbfxaoks9jhveu.jpg",
          "action": "Cut the carrot",
          "number": 1
        },
        {
          "picture": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653438/itia83uxfq19xhqvjktx.jpg",
          "action": "Cut the onions",
          "number": 2
        },
        {
          "picture": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653456/cwnlqcwoha8jdzv2bfwk.jpg",
          "action": "Steam the chicken",
          "number": 3
        }
      ],
      "ingredients": [
        {
          "unit": "kg",
          "qte": 1,
          "name": "Carott"
        },
        {
          "unit": "kg",
          "qte": 2,
          "name": "Onions"
        }
      ],
      "pictures": [
        {
          "thumbUrl": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653408/hackklsbfxaoks9jhveu.jpg",
          "url": " http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653408/hackklsbfxaoks9jhveu.jpg"
        },
        {
          "thumbUrl": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653438/itia83uxfq19xhqvjktx.jpg",
          "url": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653438/itia83uxfq19xhqvjktx.jpg"
        },
        {
          "thumbUrl": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653408/hackklsbfxaoks9jhveu.jpg",
          "url": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653408/hackklsbfxaoks9jhveu.jpg"
        },
        {
          "thumbUrl": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653456/cwnlqcwoha8jdzv2bfwk.jpg",
          "url": "http://res.cloudinary.com/hqk7wz0oa/image/upload/v1432653456/cwnlqcwoha8jdzv2bfwk.jpg"
        }
      ],
      "__v": 0
    };

    // Fake recipe service
    mockRecipeService = {
      createComment: jasmine.createSpy("createComment").and.callFake(function(id,comment){
        var deferred = $q.defer();
        deferred.resolve(comment);
        return deferred.promise;
      }),
      get: jasmine.createSpy("get").and.callFake(function(id){
        var deferred = $q.defer();
        deferred.resolve(recipe);
        return deferred.promise;
      })
    };

    scope = $rootScope.$new();
    // Providers
    ionicModal = jasmine.createSpyObj('ionicModal',['fromTemplateUrl']);
    ionicSlideBoxDelegate = jasmine.createSpyObj('ionicSlideBoxDelegate',['next','previous','slide', 'update']);
    cordovaFileTransfer = jasmine.createSpyObj('cordovaFileTransfer',['upload']);
    state = jasmine.createSpyObj('state',['go']);
    timeout = jasmine.createSpyObj('timeout',['cancel']);
    //filter = jasmine.createSpyObj('filter',['orderObjectBy']);

    DisplayRecipeCtrl = $controller('DisplayRecipeCtrl', {
      $scope: scope,
      $state: state,
      $stateParams: stateParams,
      $http: http,
      $filter: filter,
      $timeout: timeout,
      $ionicModal: ionicModal,
      $ionicSlideBoxDelegate: ionicSlideBoxDelegate,
      $cordovaFileTransfer: cordovaFileTransfer,
      $http: http,
      RecipeService: mockRecipeService
    });

    scope.$apply();
  }));

  // tests start here
  it('should have call recipe get',function(){
    expect(mockRecipeService.get).toHaveBeenCalledWith(stateParams.id);
  });

  describe('Info recipe',function(){

    it('should be empty or null at the begining', function(){
      expect(scope.currentStep).toEqual({});
      expect(scope.errors).toEqual({});
      expect(scope.mark).toEqual(0);
      expect(scope.displayInfo).toBe(true);
    });

    describe('Show/Hide utensils',function(){

      it('should hide utensils', function(){
        expect(scope.showUtensil).not.toBe(true);
      });

      it('should show utensils', function(){
        scope.setUtensils();
        expect(scope.showUtensil).toBe(true);
      });
    });

    describe('Show/Hide steps',function(){

      it('should hide steps', function(){
        expect(scope.showStep).not.toBe(true);
      });

      it('should show steps', function(){
        scope.setSteps();
        expect(scope.showStep).toBe(true);
      });
    });

    describe('Display step by step',function(){

      // When click on "Start Recipe" button
      it('should show the first step', function(){
        scope.currentStep.number = 0;
        scope.stepForward();
        expect(scope.displayInfo).toBe(false);
        expect(scope.endRecipeButton).toBe(false);
        expect(scope.displayStep).toBe(true);
        expect(scope.currentStep).toEqual(scope.recipe.steps[0]);
      });

      // When click on "Next Step" button from step 1
      it('should show the next step', function(){
        scope.currentStep.number = 1;
        scope.stepForward();
        expect(scope.displayInfo).toBe(false);
        expect(scope.endRecipeButton).toBe(false);
        expect(scope.currentStep).toEqual(scope.recipe.steps[1]);
      });

      // When click on "Next Step" button from last step
      it('should show the "End" button', function(){
        scope.currentStep.number = 3;
        scope.stepForward();
        expect(scope.displayInfo).toBe(false);
        expect(scope.endRecipeButton).toBe(true);
      });

      // When click on "Step Back" button from a middle step
      it('should show the previous step', function(){
        scope.currentStep.number = 2;
        scope.stepBack();
        expect(scope.endRecipeButton).toBe(false);
        expect(scope.currentStep).toEqual(scope.recipe.steps[0]);
      });

      // When click on "Step Back" button from step 1
      it('should show the info recipe page', function(){
        scope.currentStep.number = 1;
        scope.stepBack();
        expect(scope.endRecipeButton).toBe(false);
        expect(scope.displayInfo).toBe(true);
        expect(scope.currentStep).toEqual({});
      });

      // When click on "Step Back" button from last step
      it('should show the previous step', function(){
        scope.currentStep.number = 3;
        scope.stepBack();
        expect(scope.endRecipeButton).toBe(false);
        expect(scope.currentStep).toEqual(scope.recipe.steps[1]);
      });
    });

    // When click on "End" button
    it('should show the final page when recipe is completed', function(){
      scope.endRecipe();
      expect(scope.displayStep).toBe(false);
      expect(scope.final).toBe(true);
    });

  });

  describe('Mark and Comment',function(){

    it('should save the mark related to the comment', function(){
      scope.tapMark(true, 1);
      expect(scope.mark).toEqual(2);
      scope.tapMark(true, 3);
      expect(scope.mark).toEqual(6);
      scope.tapMark(false, 1);
      expect(scope.mark).toEqual(2);
      scope.tapMark(false, 3);
      expect(scope.mark).toEqual(4);
    });

    it('should check errors then add comment', function(){

      // Try to add comment but with errors
      scope.addMyComment();
      expect(scope.errors.comment).toEqual('Comment should not be empty.');

      scope.mycomment = '';
      scope.addMyComment();
      expect(scope.errors.comment).toEqual('Comment should not be empty.');

      scope.mycomment = 'abcd';
      scope.addMyComment();
      expect(scope.errors.comment).toEqual('Comment should be more developped.');

      // Add a comment without errors without mark
      scope.mycomment = 'This is a complete comment.';
      scope.addMyComment();
      scope.$apply();
      expect(scope.errors.comment).not.toBeDefined();
      expect(scope.recipe.comments[0].message).toEqual('This is a complete comment.');
      expect(scope.recipe.comments[0].mark).not.toBeDefined();

      // Add a comment without errors with a mark
      scope.mycomment = 'This is a complete comment with a mark.';
      scope.mark = 4;
      scope.addMyComment();
      scope.$apply();
      expect(scope.errors.comment).not.toBeDefined();
      expect(scope.recipe.comments[0].message).toEqual('This is a complete comment with a mark.');
      expect(scope.recipe.comments[0].mark).toEqual(4);
    });
  });

  describe('Take/Import picture',function(){

  });

  describe('Slide Box images',function(){

  });
});
