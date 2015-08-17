
describe('Controllers - CreateRecipeCtrl', function(){
  // load the controller's module
  beforeEach(module('starter.controllers'));

  var scope,
  CreateRecipeCtrl,
  mockRecipeService,
  state,
  recipe,
  pic;

  beforeEach(inject(function($rootScope, $controller, $q) {

    // Fake recipe service
    mockRecipeService = {
      create: jasmine.createSpy("create").and.callFake(function(recipe){
        var deferred = $q.defer();
        // return something (res)
        deferred.resolve({});
        return deferred.promise;
      })
    };

    scope = $rootScope.$new();
    // no Providers here

    CreateRecipeCtrl = $controller('CreateRecipeCtrl', {
      $scope: scope,
      $state: state,
      RecipeService: mockRecipeService
    });
  }));

  // tests start here
  describe('Info recipe',function(){

    it('should be empty at the begining', function(){
      expect(scope.errors).toEqual({});
      expect(scope.myCourse).toEqual({});
      expect(scope.difficulty).toEqual({});
      expect(scope.ingredients).toEqual([]);
      expect(scope.currentIngredient).toEqual({});
      expect(scope.utensils).toEqual([]);
      expect(scope.currentUtensil).toEqual('');
      expect(scope.steps).toEqual([]);
      expect(scope.currentStep).toEqual({});
      expect(scope.createRecipeInfo).toBe(true);
      expect(scope.createStep).toBe(false);
      expect(scope.finishStep).toBe(false);
      expect(scope.uploadPictureUrl).toEqual("https://mysterious-eyrie-9135.herokuapp.com/pictures");
    });

    it('course and difficulty should be choosen among the list', function(){
      expect(scope.courses).toEqual([{name: 'Starter', value: 1},{name: 'Main course', value: 2},
      {name: 'Dessert', value: 3}]);
      expect(scope.difficulties).toEqual([{name: '1 - easy', value: 1},{name: '2', value: 2},
      {name: '3', value: 3},{name: '4', value: 4},{name: '5 - difficult', value: 5}]);
    });

    it('should create errors when wrong parameters for add ingredient', function(){
      scope.addIngredient();
      expect(scope.errors.ingredient.name).toEqual('Name of ingredient should not be empty.');
      expect(scope.errors.ingredient.qte).not.toBeDefined();
      expect(scope.errors.ingredient.unit).not.toBeDefined();
      expect(scope.ingredients).toEqual([]);
      expect(scope.currentIngredient).toEqual({});
      expect(scope.errors.listIngredient).not.toBeDefined();

      scope.currentIngredient = {name: 'milk',qte: 'e',unit: 'L'};
      scope.addIngredient();
      expect(scope.errors.ingredient.name).not.toBeDefined();
      expect(scope.errors.ingredient.qte).toEqual('Quantity should be a number.');
      expect(scope.errors.ingredient.unit).not.toBeDefined();
      expect(scope.ingredients).toEqual([]);

      scope.currentIngredient = {name: '',qte: '-2',unit: ''};
      scope.addIngredient();
      expect(scope.errors.ingredient.name).toEqual('Name of ingredient should not be empty.');
      expect(scope.errors.ingredient.qte).toEqual('Quantity should be a positive integer.');
      expect(scope.errors.ingredient.unit).not.toBeDefined();
      expect(scope.ingredients).toEqual([]);

      scope.currentIngredient = {name: '34',qte: '2',unit: '2'};
      scope.addIngredient();
      expect(scope.errors.ingredient.name).toEqual('Name of ingredient should not be a number.');
      expect(scope.errors.ingredient.qte).not.toBeDefined();
      expect(scope.errors.ingredient.unit).toEqual('Unit should not be a number.');
      expect(scope.ingredients).toEqual([]);

      scope.currentIngredient = {name: 'milk',qte: '2',unit: 'L'};
      scope.addIngredient();
      expect(scope.errors.ingredient.name).not.toBeDefined();
      expect(scope.errors.ingredient.qte).not.toBeDefined();
      expect(scope.errors.ingredient.unit).not.toBeDefined();
      expect(scope.ingredients).toEqual([{name: 'milk',qte: '2',unit: 'L'}]);
      expect(scope.currentIngredient).toEqual({});
      expect(scope.errors.listIngredient).not.toBeDefined();

      scope.currentIngredient.name = undefined;
      scope.currentIngredient.qte = undefined;
      scope.currentIngredient.unit = undefined;
      scope.addIngredient();
      expect(scope.errors.ingredient.name).toEqual('Name of ingredient should not be empty.');
      expect(scope.errors.ingredient.qte).not.toBeDefined();
      expect(scope.errors.ingredient.unit).not.toBeDefined();

    });

    it('should delete ingredient at index 2', function(){
      scope.ingredients = [{name: 'milk',qte: '2',unit: 'L'},
      {name: 'tomato',qte: '5',unit: 'pieces'},
      {name: 'butter',qte: '200',unit: 'gr'},
      {name: 'flour',qte: '250',unit: 'gr'}];
      scope.deleteIngredient(2);
      expect(scope.ingredients).toEqual([{name: 'milk',qte: '2',unit: 'L'},
      {name: 'tomato',qte: '5',unit: 'pieces'},
      {name: 'flour',qte: '250',unit: 'gr'}]);
    });

    it('should create errors when wrong parameters for add utensil', function(){
      scope.addUtensil();
      expect(scope.errors.currentUtensil).toEqual('Please enter an utensil name.');
      expect(scope.utensils).toEqual([]);
      expect(scope.currentUtensil).toEqual('');

      scope.currentUtensil = '42';
      scope.addUtensil();
      expect(scope.errors.currentUtensil).toEqual('Utensil should not be a number.');
      expect(scope.utensils).toEqual([]);

      scope.currentUtensil = 'fork';
      scope.addUtensil();
      expect(scope.errors.currentUtensil).not.toBeDefined();
      expect(scope.utensils).toEqual(['fork']);
      expect(scope.currentUtensil).toEqual('');
    });

    it('should delete utensil at index 3', function(){
      scope.utensils = ['fork', 'knife', 'spoon', 'pan', 'pot', 'mixer'];
      scope.deleteUtensil(3);
      expect(scope.utensils).toEqual(['fork', 'knife', 'spoon', 'pot', 'mixer']);
    });
  });

  describe('Next/Previous steps',function(){

    it('should create errors when wrong parameters for recipe info', function(){
      scope.steps.length = null;
      scope.myRecipeName = undefined;
      scope.myCourse.name = undefined;
      scope.nbPerson = undefined;
      scope.difficulty.name = undefined;
      scope.ingredients.length = null;
      scope.totalTime = undefined;
      scope.utensils.length = null;
      scope.newStep();
      expect(scope.errors.name).toEqual('Name of recipe should not be empty.');
      expect(scope.errors.myCourse).toEqual('Please select a type of course.');
      expect(scope.errors.nbPerson).toEqual('Please enter a number of person.');
      expect(scope.errors.difficulty).toEqual('Please select a difficulty.');
      expect(scope.errors.listIngredient).toEqual('Please enter some ingredients.');
      expect(scope.errors.totalTime).toEqual('Please enter the total time to do the recipe.');

      scope.nbPerson = 'nada';
      scope.totalTime = 2.4;
      scope.utensils = undefined;
      scope.newStep();
      expect(scope.errors.nbPerson).toEqual('Number of person should be a number.');
      expect(scope.errors.totalTime).toEqual('Total time (in min) should be a positive integer.');

      scope.nbPerson = -3;
      scope.totalTime = -2;
      scope.newStep();
      expect(scope.errors.nbPerson).toEqual('Number of person should be a positive integer.');
      expect(scope.errors.totalTime).toEqual('Total time (in min) should be a positive integer.');

      scope.myRecipeName = "Pie";
      scope.nbPerson = 3.7;
      scope.totalTime = "loop";
      scope.newStep();
      expect(scope.errors.name).toEqual('Name of recipe should be at least 5 characters.');
      expect(scope.errors.nbPerson).toEqual('Number of person should be a positive integer.');
      expect(scope.errors.totalTime).toEqual('Total time (in min) should be a number.');

    });

    it('should create no errors about recipe info', function(){
      scope.myRecipeName = "Onion pie";
      scope.myCourse.name = "Starter";
      scope.nbPerson = 4;
      scope.difficulty.name = 2;
      scope.ingredients.length = 2;
      scope.totalTime = 120;
      scope.utensils = ["knife"];
      scope.steps = [{action: 'Cut the carrot in slides',number: 1, time: 10, picture: {}},
      {action: 'Cook the carrot in a pan',number: 2, time: 20, picture: {}}];
      scope.ingredients = [{name: 'milk',qte: '2',unit: 'L'},
      {name: 'tomatoes',qte: '5',unit: 'pieces'}];

      scope.newStep();
      expect(scope.errors.length).not.toBeDefined();
    });

    it('should create errors when wrong steps parameters', function(){
      scope.currentStep.number = 1;
      scope.currentStep.action = undefined;
      scope.currentStep.time = undefined;
      scope.currentStep.picture = undefined;
      scope.newStep();
      expect(scope.errors.step.action).toEqual('Please enter a description.');

      scope.currentStep.number = 2;
      scope.currentStep.action = 'bla';
      scope.currentStep.time = 'bla';
      scope.newStep();
      expect(scope.errors.step.action).toEqual('Description should be at least 10 characters.');
      expect(scope.errors.step.time).toEqual('Time should be a number.');

      scope.currentStep.number = 3;
      scope.currentStep.action = 'Cut the carrot in slides';
      scope.currentStep.time = -2;
      scope.newStep();
      expect(scope.errors.step.time).toEqual('Time should be a positive integer.');
    });

    // next step -----------
    it('should update existing step', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2}];
      scope.currentStep = scope.steps[0];
      scope.newStep();
      expect(scope.errors).not.toBeDefined;
      expect(scope.steps[1]).toEqual(scope.currentStep);
    });

    it('should create a new step', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},{action: 'Cook the carrot in a pan',number: 2}];
      scope.currentStep.number = 3;
      scope.currentStep.action = 'Display carrots in a plate with the chicken';
      scope.newStep();
      expect(scope.errors).not.toBeDefined;
      expect(scope.steps).toEqual([{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Display carrots in a plate with the chicken',number: 3}]);
    });

    it('should go to next step when next step already created', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Display carrots in a plate with the chicken',number: 3}];
      scope.currentStep.number = 2;
      scope.currentStep.action = 'Cook the carrot in a pan';
      scope.newStep();
      expect(scope.currentStep).toEqual(scope.steps[2]);
    });

    it('should go to next step when next step not yet created', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Display carrots in a plate with the chicken',number: 3}];
      scope.currentStep.number = 3;
      scope.newStep();
      expect(scope.currentStep).toEqual({number: (scope.currentStep.number)});
    });

    // step back ----------
    it('should save the new current step before go back', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2}];
      scope.currentStep.number = 3;
      scope.currentStep.action = 'Do it';
      scope.stepBack();
      expect(scope.steps).toEqual([{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Do it',number: 3}]);
    });

    it('should save the current step before go back', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2}];
      scope.currentStep.number = 2;
      scope.stepBack();
      expect(scope.currentStep).toEqual(scope.steps[0]);
    });

    it('should go to previous step when previous step already exist', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Display carrots',number: 3}];
      scope.currentStep.number = 3;
      scope.stepBack();
      expect(scope.currentStep).toEqual(scope.steps[1]);
    });

    it('should go to recipe info when current step is step 1', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {descriptioactionn: 'Display carrots in a plate with the chicken',number: 3}];
      scope.currentStep.number = 1;
      scope.stepBack();
      expect(scope.createStep).toBe(false);
      expect(scope.createRecipeInfo).toBe(true);
      expect(scope.currentStep).toEqual({});
    });

    // insert step ----------
    it('should insert a new current step', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2}];
      scope.currentStep = scope.steps[1];
      scope.insertStep();
      scope.currentStep.action = 'I insert a new step here.';
      scope.newStep();
      expect(scope.steps).toEqual([{action: 'Cut the carrot in slides',number: 1},
        {action: 'I insert a new step here.',number: 2},
        {action: 'Cook the carrot in a pan',number: 3}]);
    });
  });

  describe('Delete step',function(){
    it('should delete step and change step number', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Do nothing',number: 3},
      {action: 'Display well carrots in the plate',number: 4}];
      scope.currentStep.number = 3;
      scope.deleteStep();
      expect(scope.steps).toEqual([{action: 'Cut the carrot in slides',number: 1},
      {action: 'Cook the carrot in a pan',number: 2},
      {action: 'Display well carrots in the plate',number: 3}]);
    });
  });

  describe('Show/Hide step timer',function(){
    it('should hide step timer', function(){
      expect(scope.timer).not.toBe(true);
    });
    it('should show step timer', function(){
      scope.showTimer();
      expect(scope.timer).toBe(true);
    });
  });

  describe('Show/Hide step picture',function(){
    it('should hide step picture', function(){
      expect(scope.pic).not.toBe(true);
    });
    it('should show step picture', function(){
      scope.showPic();
      expect(scope.pic).toBe(true);
    });
  });

  describe('Take/Import picture',function(){
    it('Set the picture', function(){
      scope.finishStep = true;
      picture = {url: "http://blabla.com/12.jpg",thumbUrl: "http://blabla.com/12.jpg"};
      scope.setPicture(picture);
      expect(scope.finalPicture).toEqual(picture);

      scope.finishStep = false;
      scope.createStep = true;
      picture = {url: "http://blabla.com/12.jpg",thumbUrl: "http://blabla.com/12.jpg"};
      scope.setPicture(picture);
      expect(scope.currentStep.picture).toEqual(picture);
    });
  });

  // save the entire recipe -------
  describe('Save all recipe',function(){

    it('should save recipe', function(){
      scope.currentStep.action = 'Finally, display the chicken with carrots in a plate.'
      scope.finishRecipe();
      expect(scope.createRecipeInfo).toBe(false);
      expect(scope.createStep).toBe(false);
      expect(scope.finishStep).toBe(true);
    });

    it('possibility to go back when on last page', function(){
      scope.steps = [{action: 'Cut the carrot in slides',number: 1, time: 10,
      picture: {url: "http://blabla.com/12.jpg",thumbUrl: "http://blabla.com/12.jpg"}},
      {action: 'Cut the cheese in slides',number: 2, time: 10,
      picture: {url: "http://blabla.com/12.jpg",thumbUrl: "http://blabla.com/12.jpg"}}];
      scope.back();
      expect(scope.createRecipeInfo).toBe(false);
      expect(scope.createStep).toBe(true);
      expect(scope.finishStep).toBe(false);
      expect(scope.currentStep.picture).toEqual(scope.steps[1].picture);
    });

    it('should have call recipe create and save all recipe with final picture',function(){
      scope.myRecipeName = 'Courgettes à la provencale';
      scope.myCourse = 'Starter';
      scope.nbPerson = 4;
      scope.difficulty = 1;
      scope.ingredients = [{name: 'courgettes',qte: '2',unit: 'pieces'},
      {name: 'tomates',qte: '6',unit: 'pieces'}];
      scope.utensils = ['forks','knifes','spoons'];
      scope.steps = [{number: 1, action: 'couper courgettes',time: 10, picture: {}},
      {number: 2, action: 'etaler tomates provencales', time: 45, picture: {}}];
      scope.totalTime = 120;
      scope.finalPicture = {url: "http://blabla.com/12.jpg",thumbUrl: "http://blabla.com/12.jpg"};
      var recipe = {};
      recipe.name = scope.myRecipeName;
      recipe.course = scope.myCourse.value;
      recipe.nbPerson = scope.nbPerson;
      recipe.difficulty = scope.difficulty.value;
      recipe.ingredients = scope.ingredients;
      recipe.utensils = scope.utensils;
      recipe.steps = scope.steps;
      recipe.picture = scope.finalPicture;
      recipe.time = scope.totalTime;
      scope.finishRecipeAll();
      expect(mockRecipeService.create).toHaveBeenCalledWith(recipe);
    });
  });

});
