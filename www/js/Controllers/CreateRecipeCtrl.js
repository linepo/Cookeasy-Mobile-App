angular.module('starter.controllers')
.controller('CreateRecipeCtrl', [ '$scope', '$rootScope', '$state', 'RecipeService',
  function($scope, $rootScope, $state, RecipeService) {

  $scope.createRecipeInfo = true;
  $scope.finishStep = false;
  $scope.createStep = false;
  $scope.errors = {};
  $scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/picture/upload";

  //List of different courses
  $scope.courses = [{name: 'Starter', value: 1},{name: 'Main course', value: 2},
  {name: 'Dessert', value: 3}];
  $scope.myCourse = {};

  //List for the difficulty of the recipe
  $scope.difficulties = [{name: '1 - easy', value: 1},{name: '2', value: 2},
  {name: '3', value: 3},{name: '4', value: 4},{name: '5 - difficult', value: 5}];
  $scope.difficulty = {};

  //All ingredients in recipe
  $scope.ingredients = [];
  //Current ingredient in edition
  $scope.currentIngredient = {};

  function checkIngredientInfo(){
    $scope.errors.ingredient = {};
    // Name of ingredients
    if(!$scope.currentIngredient.name || $scope.currentIngredient.name == ''){
      $scope.errors.ingredient.name = 'Name of ingredient should not be empty.';
    } else if(!isNaN($scope.currentIngredient.name)){
      $scope.errors.ingredient.name = 'Name of ingredient should not be a number.';
    } else if($scope.currentIngredient.name.length < 2){
      $scope.errors.ingredient.name = 'Name of ingredient should be at least 2 characters.';
    }
    // About quantity input
    if($scope.currentIngredient.qte && isNaN($scope.currentIngredient.qte)){
      $scope.errors.ingredient.qte = 'Quantity should be a number.';
    } else if($scope.currentIngredient.qte && (!typeof $scope.currentIngredient.qte==='number' || $scope.currentIngredient.qte <= 0)){
      $scope.errors.ingredient.qte = 'Quantity should be a positive integer.';
    }
    // About unit input
    if($scope.currentIngredient.unit && !isNaN($scope.currentIngredient.unit)){
      $scope.errors.ingredient.unit = 'Unit should not be a number.';
    }
  }

  //Add an ingredient
  $scope.addIngredient = function(){
    checkIngredientInfo();
    if(Object.keys($scope.errors.ingredient).length){
      return;
    }
    $scope.currentIngredient.qte = $scope.currentIngredient.qte;
    $scope.ingredients.push($scope.currentIngredient);
    $scope.currentIngredient = {};
    delete $scope.errors.listIngredient;
  }
  //Delete an ingredient
  $scope.deleteIngredient = function (id){
    $scope.ingredients.splice(id,1);
  }

  //All utensils in recipe
  $scope.utensils = [];
  //Current utensil in edition
  $scope.currentUtensil = '';
  //Add an utensil
  $scope.addUtensil = function(){
    delete $scope.errors.currentUtensil;
    // Errors on utensils
    if(!$scope.currentUtensil || $scope.currentUtensil == ''){
      $scope.errors.currentUtensil = 'Please enter an utensil name.';
    } else if(!isNaN($scope.currentUtensil)){
      $scope.errors.currentUtensil = 'Utensil should not be a number.';
    } else if($scope.currentUtensil.length < 2){
      $scope.errors.currentUtensil = 'Utensil should be at least 2 characters.';
    }
      else {
      $scope.utensils.push($scope.currentUtensil);
      $scope.currentUtensil = '';
    }
  }
  //Delete an utensil
  $scope.deleteUtensil = function (id){
    $scope.utensils.splice(id,1);
  }

  //show/hide timer in step page
  $scope.showTimer = function(){
    $scope.timer = !$scope.timer;
  }
  //show/hide picture in step page
  $scope.showPic = function(){
    $scope.pic = !$scope.pic;
  }

  //Steps of the recipe
  $scope.steps = [];
  //Current step in edition
  $scope.currentStep = {};
  //Delete current step
  $scope.deleteStep = function(){
    // Get current step number
    var stepNb = $scope.currentStep.number;
    // Go to previous step
    $scope.stepBack();
    // Remove from array only if it is already in
    if (stepNb < ($scope.steps.length+1)) {
      // Delete step
      $scope.steps.splice(stepNb-1,1);
      // Change step numbers
      $scope.steps.map(function(step){
        if(step.number > stepNb-1){
          step.number--;
        }
      });
    }
  };

  function checkRecipeInfo(){
    $scope.errors = {};
    // Name of recipe
    if(!$scope.myRecipeName || $scope.myRecipeName == ''){
      $scope.errors.name = 'Name of recipe should not be empty.';
    } else if($scope.myRecipeName.length < 5){
      $scope.errors.name = 'Name of recipe should be at least 5 characters.';
    }
    // Type of course
    if(!$scope.myCourse.name){
      $scope.errors.myCourse = 'Please select a type of course.';
    }
    // Nb of person
    if(!$scope.nbPerson || $scope.nbPerson == ''){
      $scope.errors.nbPerson = 'Please enter a number of person.';
    } else if(isNaN($scope.nbPerson)){
      $scope.errors.nbPerson = 'Number of person should be a number.';
    } else if(!(typeof $scope.nbPerson==='number' && ($scope.nbPerson%1)===0) || $scope.nbPerson <= 0){
      $scope.errors.nbPerson = 'Number of person should be a positive integer.';
    }
    // Difficulty
    if(!$scope.difficulty.name){
      $scope.errors.difficulty = 'Please select a difficulty.';
    }
    // Total time to do the recipe
    if(!$scope.totalTime || $scope.totalTime == ''){
      $scope.errors.totalTime = 'Please enter the total time to do the recipe.';
    } else if(isNaN($scope.totalTime)){
      $scope.errors.totalTime = 'Total time (in min) should be a number.';
    } else if(!(typeof $scope.totalTime==='number' && ($scope.totalTime%1)===0) || $scope.totalTime <= 0){
      $scope.errors.totalTime = 'Total time (in min) should be a positive integer.';
    }
    // List of ingredients
    if(!$scope.ingredients.length){
      $scope.errors.listIngredient = 'Please enter some ingredients.';
    }
    // No check of list of utensils
  }

  function checkCurrentStepInfo(){
    $scope.errors.step = {};
    // Description area
    if(!$scope.currentStep.action){
      $scope.errors.step.action = 'Please enter a description.';
    } else if(typeof $scope.currentStep.action !== "string" || $scope.currentStep.action.length < 10){
      $scope.errors.step.action = 'Description should be at least 10 characters.';
    }
    // Timer is optional in steps
    if($scope.currentStep.time && isNaN($scope.currentStep.time)){
      $scope.errors.step.time = 'Time should be a number.';
    } else if($scope.currentStep.time && (!(typeof $scope.currentStep.time==='number' && ($scope.currentStep.time%1)===0) || $scope.currentStep.time <= 0)){
      $scope.errors.step.time = 'Time should be a positive integer.';
    }
    // Delete error if no errors
    if(Object.keys($scope.errors.step).length == 0){
      delete $scope.errors.step;
    }
  }

  //Go to next step
  $scope.newStep = function(){
    //Get current step number
    var stepNb = $scope.currentStep.number || 0;
    //Check input errors
    if(stepNb == 0){
      checkRecipeInfo();
    } else {
      checkCurrentStepInfo();
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }

    $scope.createRecipeInfo = false;
    $scope.createStep = true;
    $scope.finishStep = false;

    //Save current step
    if(stepNb){
      if(stepNb < ($scope.steps.length+1)){
        $scope.steps[stepNb-1] = $scope.currentStep;
      } else {
        $scope.steps.push($scope.currentStep);
      }
    }

    //Go to next step
    if(stepNb < ($scope.steps.length)){
      $scope.currentStep = $scope.steps[stepNb];
    } else {
      $scope.currentStep = {number: (stepNb+1)};
    }

    $scope.timer = false;
  }

  //Go to previous step
  $scope.stepBack = function(){
    // Get current step number
    var stepNb = $scope.currentStep.number;

    // Save current step
    if(stepNb > $scope.steps.length){
      $scope.steps.push($scope.currentStep);
    } else {
      $scope.steps[stepNb-1] = $scope.currentStep;
    }

    // Go to previous step
    if(stepNb > 1){
      $scope.currentStep = $scope.steps[stepNb-2];
    } else {
      $scope.createStep = false;
      $scope.createRecipeInfo = true;
      $scope.currentStep = {};
    }

    $scope.timer = false;
  };

  //Insert a step
  $scope.insertStep = function(){
    //Get current step number
    var stepNb = $scope.currentStep.number || 0;
    //Check input errors
    if(stepNb == 0){
      checkRecipeInfo();
    } else {
      checkCurrentStepInfo();
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }

    $scope.createRecipeInfo = false;
    $scope.createStep = true;
    $scope.finishStep = false;

    //Save current step
    if(stepNb){
      if(stepNb < ($scope.steps.length+1)){
        $scope.steps[stepNb-1] = $scope.currentStep;
      } else {
        $scope.steps.push($scope.currentStep);
      }
    }

    //Change step number of each next step in our steps array after the current step
    $scope.steps = $scope.steps.map(function(step){
      if(step.number >= stepNb){
        step.number++;
      }
      return step;
    });

    //Insert new step
    $scope.currentStep = {number: stepNb};
    $scope.steps.splice(stepNb-1, 0, $scope.currentStep);

    $scope.timer = false;
  }

  $scope.setPicture = function(picture){
    if($scope.finishStep){
      $scope.finalPicture = picture;
    }
    if($scope.createStep){
      $scope.currentStep.picture = picture;
    }
  };

  //Save recipe info with steps
  $scope.finishRecipe = function(){

    checkCurrentStepInfo();

    if(Object.keys($scope.errors).length){
      return;
    }

    //Go to final page -> take/import final picture
    $scope.finishStep = true;
    $scope.createRecipeInfo = false;
    $scope.createStep = false;

    //Get current step number
    var stepNb = $scope.currentStep.number || 0;
    //Save current step
    if(stepNb){
      if(stepNb < ($scope.steps.length+1)){
        $scope.steps[stepNb-1] = $scope.currentStep;
      } else {
        $scope.steps.push($scope.currentStep);
      }
    }
  };

  $scope.back = function(){
    // Go to last step
    $scope.currentStep = $scope.steps[$scope.steps.length-1];

    $scope.createStep = true;
    $scope.createRecipeInfo = false;
    $scope.finishStep = false;
  };

  //Create the recipe with the final photo
  $scope.finishRecipeAll = function(){

    var recipe = {};
    recipe.name = $scope.myRecipeName;
    recipe.course = $scope.myCourse.value;
    recipe.nbPerson = $scope.nbPerson;
    recipe.difficulty = $scope.difficulty.value;
    recipe.ingredients = $scope.ingredients;
    recipe.utensils = $scope.utensils;
    recipe.steps = $scope.steps;
    recipe.picture = $scope.finalPicture;
    recipe.time = $scope.totalTime;
    console.log(recipe);

    $scope.dataLoading = true;
    RecipeService.create(recipe).then(function(id){
      $scope.dataLoading = false;
      //then lead to the display of the created recipe
      $state.go('displayRecipe', {id: id});
    },function(err){
      $scope.dataLoading = false;
      alert("Error during creating recipe process: "+err);
    });
  };

}]);
