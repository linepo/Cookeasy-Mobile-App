angular.module('starter.controllers')
.controller('CreateQuizCtrl', [ '$scope', '$rootScope', '$state', 'GameService',
  function($scope, $rootScope, $state, GameService) {

  $scope.createQuizInfo = true;
  $scope.createQuestion = false;
  $scope.typeText = false;
  $scope.typeImage = false;
  $scope.errors = {};
  $scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/picture/upload";

  $scope.textChecked = function(){
    $scope.typeText = true;
    $scope.typeImage = false;
  }
  $scope.imageChecked = function(){
    $scope.typeImage = true;
    $scope.typeText = false;
  }

  //Questions of the quiz
  $scope.questions = [];
  //Current question in edition
  $scope.currentQuestion = {number: 0, answers: []};
  //Current answer in edition
  $scope.currentAnswer = {};

  function checkQuizInfo(){
    $scope.errors = {};
    // Name of quiz
    if(!$scope.quizTitle || $scope.quizTitle == ''){
      $scope.errors.name = 'Quiz title should not be empty.';
    } else if($scope.quizTitle.length < 5){
      $scope.errors.name = 'Quiz title should be at least 5 characters.';
    }
    // Presence of main picture
  }
  function checkCurrentQuizInfo(){
    $scope.errors.question = {};
    // Name of question
    if(!$scope.currentQuestion.title || $scope.currentQuestion.title == ''){
      $scope.errors.question.title = 'Question should not be empty.';
    } else if($scope.currentQuestion.title.length < 5){
      $scope.errors.question.title = 'Question should be at least 5 characters.';
    }
    // Text answer type
    if($scope.typeText === true){
      if($scope.currentQuestion.answers.length < 4){
        $scope.errors.question.answer = 'You should put 4 possible answers.';
      }
    }
    // Image answer type
    if($scope.typeImage === true){

    }
    // Delete error if no errors
    if(Object.keys($scope.errors.question).length == 0){
      delete $scope.errors.question;
    }
  }

  //Go to next question
  $scope.newQuestion = function(){
    //Get current question number
    var questNb = $scope.currentQuestion.number || 0;
    //check errors
    if(questNb == 0){
      checkQuizInfo();
    } else {
      checkCurrentQuizInfo();
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }
    $scope.createQuizInfo = false;
    $scope.createQuestion = true;
    $scope.typeText = true;
    $scope.typeImage = false;
    //Save current question
    if(questNb){
      if(questNb < ($scope.questions.length+1)){
        $scope.questions[questNb-1] = $scope.currentQuestion;
      } else {
        $scope.questions.push($scope.currentQuestion);
      }
    }
    console.log($scope.questions);
    //Go to next question
    if(questNb < ($scope.questions.length)){
      $scope.currentQuestion = $scope.questions[questNb];
    } else {
      $scope.currentQuestion = {number: (questNb+1), answers: []};
    }
  }

  //Add an uncorrect answer in the list of answers for the current question
  $scope.uncorrectAnswer = function(){
    $scope.errors = {};
    // Name of answer
    if(!$scope.currentAnswer.text || $scope.currentAnswer.text == ''){
      $scope.errors.answer = 'Answer should not be empty.';
    } else if($scope.currentAnswer.text.length < 5){
      $scope.errors.answer = 'Answer should be at least 5 characters.';
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }

    $scope.currentAnswer.text = $scope.currentAnswer.text;
    $scope.currentAnswer.correct = false;
    //$scope.currentAnswer.picture =
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    console.log($scope.currentAnswer);
    $scope.currentAnswer = {};
    console.log($scope.currentQuestion);
    console.log($scope.questions);
    //delete $scope.errors.listAnswer;
  }

  //Add a correct answer in the list of answers for the current question
  $scope.correctAnswer = function(){
    $scope.errors = {};
    // Name of answer
    if(!$scope.currentAnswer.text || $scope.currentAnswer.text == ''){
      $scope.errors.answer = 'Answer should not be empty.';
    } else if($scope.currentAnswer.text.length < 5){
      $scope.errors.answer = 'Answer should be at least 5 characters.';
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }

    $scope.currentAnswer.text = $scope.currentAnswer.text;
    $scope.currentAnswer.correct = true;
    //$scope.currentAnswer.picture =
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    console.log($scope.currentAnswer);
    $scope.currentAnswer = {};
    console.log($scope.currentQuestion);
    console.log($scope.questions);
    //delete $scope.errors.listAnswer;
  }

  //Go to previous question
  $scope.questionBack = function(){
    // Get current question number
    var questNb = $scope.currentQuestion.number;
    // Save current question
    if(questNb > $scope.questions.length){
      $scope.questions.push($scope.currentQuestion);
    } else {
      $scope.questions[questNb-1] = $scope.currentQuestion;
    }
    // Go to previous question
    if(questNb > 1){
      $scope.currentQuestion = $scope.questions[questNb-2];
    } else {
      $scope.createQuestion = false;
      $scope.createQuizInfo = true;
      $scope.currentQuestion = {answers: []};
    }
  };

  $scope.setPicture = function(picture){
    if($scope.createQuizInfo){
      $scope.game.picture = picture;
    }
    if($scope.createQuestion){
      $scope.currentQuestion.picture = picture;
    }
  };

  //Create the quiz with all questions/answers
  $scope.finishQuiz = function(){
    //check errors............
    //Get current question number
    var questNb = $scope.currentQuestion.number || 0;
    console.log($scope.currentQuestion);
    //Save current question
    if(questNb){
      if(questNb < ($scope.questions.length+1)){
        $scope.questions[questNb-1] = $scope.currentQuestion;
      } else {
        $scope.questions.push($scope.currentQuestion);
      }
    }
    console.log($scope.questions);
    //Create quiz
    var game = {quiz: {}};
    game.quiz.questions = $scope.questions;
    game.title = $scope.quizTitle;
    console.log("game : " + game);
    console.log("game.quiz : " + game.quiz);
    console.log("game.quiz.questions : " + game.quiz.questions);
    console.log("game.title : " + game.title);


    //Go to final page -> display quiz
    $scope.dataLoading = true;
    GameService.create(game).then(function(id){
      $scope.dataLoading = false;
      //then lead to the display of the created quiz
      $state.go('displayQuiz', {id: id});
    },function(err){
      $scope.dataLoading = false;
      alert("Error during creating quiz process: "+err);
    });
  };

}]);
