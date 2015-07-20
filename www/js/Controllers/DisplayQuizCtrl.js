angular.module('starter.controllers')
.controller('DisplayQuizCtrl', [ '$scope', '$state', '$stateParams', '$http', 'GameService',
  function($scope, $state, $stateParams, $http, GameService) {

    $scope.errors = {};
    $scope.quizInfo = true;
    //$scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/games/" + $stateParams.id +"/pictures";

    $scope.quiz = {};
    GameService.get($stateParams.id).then(function(quiz){
      console.log(quiz);
      $scope.quiz = quiz;
      //$filter('orderObjectBy')($scope.recipe.pictures,'createdOn',-1);
    });

    // Current question
    $scope.currentQuestion = {answers: [], type: "text"};
    $scope.questNb = 0;

    $scope.typeChecked = function(type){
      if($scope.currentQuestion.type == type){
        return true;
      }
      return false;
    }

    //When click on Start Quiz button -> display quiz question by question, begining with the first one
    //When click on Question forward button -> display next question
    $scope.questionForward = function(){
      $scope.quizInfo = false;
      $scope.endQuizButton = false;
      $scope.displayQuestion = true;

      //Go to next question
      if($scope.questNb < ($scope.quiz.questions.length)){
        $scope.currentQuestion = $scope.quiz.questions[$scope.questNb];
        $scope.questNb++;
      } else {
        $scope.displayQuestion = false;
        $scope.endQuizButton = true;
      }
    };



}]);
