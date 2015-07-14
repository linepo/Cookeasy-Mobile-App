angular.module('starter.controllers')
.controller('CreateQuizCtrl', [ '$scope', '$rootScope', '$state', 'QuizService',
  function($scope, $rootScope, $state, QuizService) {

  $scope.createQuizInfo = true;
  $scope.createQuestion = false;
  $scope.typeText = false;
  $scope.typeImage = false;
  //$scope.errors = {};
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
  $scope.currentQuestion = {answers: []};
  //Current answer in edition
  $scope.currentAnswer = {};
  //Number of questions
  $scope.nbQuestion = 1;

  // errors............

  //Go to next question
  $scope.newQuestion = function(){
    $scope.createQuizInfo = false;
    $scope.createQuestion = true;
    $scope.typeText = true;
    //Get current question number
    var questNb = $scope.nbQuestion;

    //check input errors...

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
      $scope.currentQuestion = {answers: []};
    }
  }

  //Add an uncorrect answer in the list of answers for the current question
  $scope.uncorrectAnswer = function(){
    //check errors............
    $scope.currentAnswer.text = $scope.currentAnswer.text;
    $scope.currentAnswer.correct = false;
    //$scope.currentAnswer.picture =
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    console.log($scope.currentAnswer);
    $scope.currentAnswer = {};
    console.log($scope.currentQuestion);
    //delete $scope.errors.listAnswer;
  }

  //Add a correct answer in the list of answers for the current question
  $scope.correctAnswer = function(){
    //check errors............
    $scope.currentAnswer.text = $scope.currentAnswer.text;
    $scope.currentAnswer.correct = true;
    //$scope.currentAnswer.picture =
    $scope.currentQuestion.answers.push($scope.currentAnswer);
    console.log($scope.currentAnswer);
    $scope.currentAnswer = {};
    console.log($scope.currentQuestion);
    //delete $scope.errors.listAnswer;
  }

  //Go to previous question
  $scope.questionBack = function(){
    // Get current question number
    var questionNb = $scope.currentQuestion.number;
    // Save current question
    if(questionNb > $scope.questions.length){
      $scope.questions.push($scope.currentStep);
    } else {
      $scope.questions[questionNb-1] = $scope.currentQuestion;
    }
    // Go to previous question
    if(questionNb > 1){
      $scope.currentQuestion = $scope.questions[questionNb-2];
    } else {
      $scope.createQuestion = false;
      $scope.createQuizInfo = true;
      $scope.currentQuestion = {};
    }
  };

  $scope.setPicture = function(picture){
    if($scope.createQuizInfo){
      $scope.mainQuiz.picture = picture;
    }
    if($scope.createQuestion){
      $scope.currentQuestion.picture = picture;
    }
  };

  //Create the quiz with all questions/answers
  $scope.finishQuiz = function(){
    //check errors............
    //Get current question number
    var questionNb = $scope.currentQuestion.number || 0;
    //Save current question
    if(questionNb){
      if(questionNb < ($scope.questions.length+1)){
        $scope.questions[questionNb-1] = $scope.currentQuestion;
      } else {
        $scope.questions.push($scope.currentQuestion);
      }
    }
    //Create quiz
    var quiz = {};
    quiz.questions.title = $scope.myQuizName;
    //quiz.questions.type = ;
    quiz.questions.picture = $scope.mainQuiz.picture;
    quiz.questions.answers = $scope.listAnswer;
    console.log(quiz);
    //Go to final page -> display quiz
    $scope.dataLoading = true;
    QuizService.create(quiz).then(function(id){
      $scope.dataLoading = false;
      //then lead to the display of the created quiz
      $state.go('displayQuiz', {id: id});
      console.log("display quiz");
    },function(err){
      $scope.dataLoading = false;
      alert("Error during creating quiz process: "+err);
    });
  };

}]);
