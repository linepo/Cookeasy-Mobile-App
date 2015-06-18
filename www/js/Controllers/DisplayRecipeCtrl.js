angular.module('starter.controllers')
.controller('DisplayRecipeCtrl', [ '$scope', '$state', '$stateParams', '$filter', '$timeout', '$ionicModal', '$ionicSlideBoxDelegate','$http', '$cordovaFileTransfer', 'RecipeService',
  function($scope, $state, $stateParams, $filter, $timeout, $ionicModal, $ionicSlideBoxDelegate, $http, $cordovaFileTransfer, RecipeService) {

  $scope.errors = {};
  $scope.displayInfo = true;
  $scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/recipe/pictures/upload/" + $stateParams.id;
  // Seconds passed for timer
  $scope.timerSecondsPassed = 0;

  $scope.recipe = {};
  RecipeService.get($stateParams.id).then(function(recipe){
    $scope.recipe = recipe;
    $filter('orderObjectBy')($scope.recipe.pictures,'createdOn',-1);
  });

  // Current step
  $scope.currentStep = {};
  // Current mark
  $scope.mark = 0;

  //When click on Steps button -> display steps of recipe
  $scope.setSteps = function(){
    $scope.showStep = !$scope.showStep;
  };
  //When click on Utensils button -> display utensils of recipe
  $scope.setUtensils = function(){
    $scope.showUtensil = !$scope.showUtensil;
  };

  // ---------------------slide box

    $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      //$ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
      $ionicSlideBoxDelegate.update();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };
  	$scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    }
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

  // ------------------------------

  //When click on Start Recipe button -> display recipe step by step, begining with the first one
  //When click on Step forward button -> display next step
  $scope.stepForward = function(){

    $scope.displayInfo = false;
    $scope.endRecipeButton = false;
    // Reset timer
    $scope.timerSecondsPassed = 0;

    // Get current step number
    var stepNb = $scope.currentStep.number || 0;

    if(stepNb == 0){
      $scope.displayStep = true;
    }

    //Go to next step
    if(stepNb < ($scope.recipe.steps.length)){
      $scope.currentStep = $scope.recipe.steps[stepNb];
    } else {
      $scope.endRecipeButton = true;
    }
  };

  //When click on Step back button -> display previous step
  $scope.stepBack = function(){

    $scope.endRecipeButton = false;
    // Reset timer
    $scope.timerSecondsPassed = 0;

    // Get current step number
    var stepNb = $scope.currentStep.number;
    // Go to previous step
    if(stepNb > 1){
      $scope.currentStep = $scope.recipe.steps[stepNb-2];
    } else {
      $scope.displayInfo = true;
      $scope.currentStep = {};
    }
  };

  //When click on End Recipe button -> display end page
  $scope.endRecipe = function(){
    $scope.displayStep = false;
    $scope.final = true;
  };

  //When click on Recipe button -> display first page with recipe info
  $scope.back = function(){
    // Go to recipe info page
    $scope.final = false;
    $scope.displayStep = false;
    $scope.displayInfo = true;
  };

  //When click on Search button -> display recipe/search
  $scope.new = function(){
    // Go to search recipe page
    $state.go('searchRecipe');
  };

  // ---------------------take/import picture
  $scope.setPicture = function(picture){
    $scope.uploadedPicture = picture;
    $scope.recipe.pictures.unshift(picture);
  };

  // ---------------------comment part
  // Events on marking recipe
  $scope.tapMark = function(add,index){
    if(add){
      $scope.mark += index + 1;
    } else {
      $scope.mark = index + 1;
    }
  };

  function checkCommentInfo(){
    delete $scope.errors.comment;
    // Check comment textarea
    if(!$scope.mycomment){
      $scope.errors.comment = 'Comment should not be empty.';
    } else if(typeof $scope.mycomment !== "string" || $scope.mycomment.length < 10){
      $scope.errors.comment = 'Comment should be at least 10 characters.';
    }
  }

  $scope.addMyComment = function(){
    $scope.dataLoading = true;
    var comment = {};
    comment.message = $scope.mycomment;
    checkCommentInfo();
    if($scope.errors.comment){
      return;
    }
    if($scope.mark !== 0){
      comment.mark = $scope.mark;
    }

    RecipeService.createComment($scope.recipe._id,comment).then(function(comment){
      $scope.dataLoading = false;
      //add comment in the list of comments
      $scope.recipe.comments.unshift(comment);
      $scope.mycomment = '';
      $scope.mark = 0;
    });
  };

  // ---------------------chronometer

  var timer;
  // Pause timer
  $scope.timerPause = function(){
    $scope.timerRunning = false;
    $timeout.cancel(timer);
  }
  // Start timer
  $scope.timerStart = function(){
    timer = $timeout($scope.timerTick,1000);
    $scope.timerRunning = true;
  };
  // Stop timer
  $scope.timerStop = function(){
    $scope.timerRunning = false;
    $timeout.cancel(timer);
    $scope.timerSecondsPassed = 0;
  };
  // Update timer each seconds
  $scope.timerTick = function(){
    $scope.timerSecondsPassed++;
    if($scope.timerSecondsPassed == $scope.currentStep.time*60){
      return $scope.timerStop();
    }
    timer = $timeout($scope.timerTick,1000);
  };

  // ------------------------------

}]);
