angular.module('starter.controllers')
.controller('CreateQuizCtrl', [ '$scope', '$rootScope', '$state', 'GameService',
  function($scope, $rootScope, $state, GameService) {

  $scope.createQuizInfo = true;
  $scope.createQuestion = false;
  $scope.errors = {};
  $scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/pictures";

  $scope.typeChecked = function(type){
    if($scope.currentQuestion.type == type){
      return true;
    }
    return false;
  }

  //Questions of the quiz
  $scope.questions = [];
  //Current question in edition
  $scope.currentQuestion = {number: 0, answers: [], type: "text"};
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
    // Presence of main picture not needed
  }
  function checkCurrentQuestionInfo(){
    $scope.errors.question = {};
    // Name of question
    if(!$scope.currentQuestion.title || $scope.currentQuestion.title == ''){
      $scope.errors.question.title = 'Question should not be empty.';
    } else if($scope.currentQuestion.title.length < 5){
      $scope.errors.question.title = 'Question should be at least 5 characters.';
    }
    // Number of answers
    if($scope.currentQuestion.answers.length < 2 || $scope.currentQuestion.answers.length > 4){
      $scope.errors.question.answer = 'Number of answers should be between 2 and 4.';
    }
    // Have at least 1 true answer
    var oneIsTrue = false;
    $scope.currentQuestion.answers.forEach(function(e){
      if(e.correct){
        return oneIsTrue = true;
      }
    });
    if(!oneIsTrue){
      $scope.errors.question.answerCorrect = 'One answer at least should be correct.';
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
      checkCurrentQuestionInfo();
    }
    if(Object.keys($scope.errors).length > 0){
      return;
    }
    $scope.createQuizInfo = false;
    $scope.createQuestion = true;
    //Save current question
    if(questNb){
      if(questNb < ($scope.questions.length+1)){
        $scope.questions[questNb-1] = $scope.currentQuestion;
      } else {
        $scope.questions.push($scope.currentQuestion);
      }
    }
    //Go to next question
    if(questNb < ($scope.questions.length)){
      $scope.currentQuestion = $scope.questions[questNb];
    } else {
      $scope.currentQuestion = {number: (questNb+1), answers: [], type: "text"};
    }
  }

  function checkCurrentAnswerInfo(){
    $scope.errors = {};
    // TYPE TEXT --------------
    // Name of answer
    if(!$scope.currentAnswer.text || $scope.currentAnswer.text == ''){
      $scope.errors.answer = 'Answer should not be empty.';
    } else if($scope.currentAnswer.text.length < 3){
      $scope.errors.answer = 'Answer should be at least 3 characters.';
    }
    // TYPE IMAGE -------------

  }

  //Add an uncorrect answer in the list of answers for the current question
  $scope.uncorrectAnswer = function(){
    //check errors
    checkCurrentAnswerInfo();
    if(Object.keys($scope.errors).length > 0){
      return;
    }
    if(typeChecked('image')){
      $scope.currentAnswer.text = $scope.currentAnswer.optionalText;
    }
    $scope.currentAnswer.correct = false;
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    $scope.currentAnswer = {};
  }
  //Add a correct answer in the list of answers for the current question
  $scope.correctAnswer = function(){
    //check errors
    checkCurrentAnswerInfo();
    if(Object.keys($scope.errors).length > 0){
      return;
    }
    if(typeChecked('image')){
      $scope.currentAnswer.text = $scope.currentAnswer.optionalText;
    }
    $scope.currentAnswer.correct = true;
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    $scope.currentAnswer = {};
  }
  //Delete an answer
  $scope.deleteAnswer = function (id){
    $scope.currentQuestion.answers.splice(id,1);
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
      $scope.quizPicture = picture;
    }
    if($scope.createQuestion){
      $scope.currentAnswer.picture = picture;
    }
  };

  //Create the quiz with all questions/answers
  $scope.finishQuiz = function(){
    //check errors
    checkCurrentQuestionInfo();
    if(Object.keys($scope.errors).length > 0){
      return;
    }

    //Get current question number
    var questNb = $scope.currentQuestion.number || 0;
    //Save current question
    if(questNb){
      if(questNb < ($scope.questions.length+1)){
        $scope.questions[questNb-1] = $scope.currentQuestion;
      } else {
        $scope.questions.push($scope.currentQuestion);
      }
    }
    //Create quiz
    var quiz = {};
    quiz.questions = $scope.questions;
    quiz.title = $scope.quizTitle;
    quiz.picture = $scope.quizPicture;

    //Go to final page -> display quiz
    $scope.dataLoading = true;
    GameService.create(quiz).then(function(id){
      $scope.dataLoading = false;
      //then lead to the display of the created quiz
      $state.go('displayQuiz', {id: id});
    },function(err){
      $scope.dataLoading = false;
      alert("Error during creating quiz process: "+err);
    });
  };

}]);
