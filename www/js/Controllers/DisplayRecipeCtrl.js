angular.module('starter.controllers')
.controller('DisplayRecipeCtrl', [ '$scope', '$stateParams', 'RecipeService', '$ionicModal', '$ionicSlideBoxDelegate','$http', '$cordovaFileTransfer',
  function($scope, $stateParams, RecipeService, $ionicModal, $ionicSlideBoxDelegate, $http, $cordovaFileTransfer) {

  $scope.errors = {};

  $scope.displayInfo = true;

  $scope.recipe = {};
  RecipeService.get($stateParams.id).then(function(recipe){
    $scope.recipe = recipe;
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
/*
    $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
*/
    $scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
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

  // Events on marking recipe
  $scope.tapMark = function(add,index){
    if(add){
      $scope.mark += index + 1;
    } else {
      $scope.mark = index + 1;
    }
  };

  //When click on End Recipe button -> display end page
  $scope.endRecipe = function(){

    $scope.displayStep = false;
    $scope.final = true;

  };

  // ---------------------take/import picture

  $scope.importFinalPicture = function(){

  }

  $scope.takeFinalPicture = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
      encodingType: 0     // 0=JPG 1=PNG
    }
    navigator.camera.getPicture(onSuccess,onFail,options).then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  }

  var onSuccess = function(fileUri) {
    $scope.$apply();
    var options = new FileUploadOptions();
    options.fileName = fileUri.substr(fileUri.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    var ft = new FileTransfer();
    // ft.onprogress = function(progressEvent){
    //   if(progressEvent.lengthComputable){
    //     $scope.test = progressEvent.loaded / progressEvent.total;
    //   } else {
    //     $scope.test = 'pppp';
    //   }
    // }
    $cordovaFileTransfer.upload("https://mysterious-eyrie-9135.herokuapp.com/recipe/pictures/upload/" + $scope.recipe._id, fileUri, options);
    function uploadSuccess(r){
      $scope.test = "t - " + r;
    }
    function uploadError(error) {
      $scope.test = error;
    }
  };

  var onFail = function(e) {
    console.log("On fail " + e);
  }

  // ------------------------------

  function checkCommentInfo(){
    delete $scope.errors.comment;
    // Check comment textarea
    if(typeof $scope.mycomment === 'undefined' || $scope.mycomment == ''){
      $scope.errors.comment = 'Comment should not be empty.';
    } else if($scope.mycomment.length < 10){
      $scope.errors.comment = 'Comment should be more developped.';
    }
  }

  $scope.addMyComment = function(){

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
      //add comment in the list of comments
      $scope.recipe.comments.unshift(comment);

      $scope.mycomment = '';
      $scope.mark = 0;
    });

  };

}]);
