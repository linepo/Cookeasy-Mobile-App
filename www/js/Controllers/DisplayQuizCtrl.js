angular.module('starter.controllers')
.controller('DisplayQuizCtrl', [ '$scope', '$state', '$stateParams', '$http', 'GameService',
  function($scope, $state, $stateParams, $http, GameService) {

    $scope.errors = {};
    $scope.quizInfo = true;
    //$scope.uploadPictureUrl = "https://mysterious-eyrie-9135.herokuapp.com/games/" + $stateParams.id +"/pictures";
    $scope.nbMistake = 0;
    $scope.score = 0;

    $scope.quiz = {};
    GameService.get($stateParams.id).then(function(quiz){
      console.log(quiz);
      $scope.quiz = quiz;
      //$filter('orderObjectBy')($scope.recipe.pictures,'createdOn',-1);
    });

    // Current question
    $scope.currentQuestion = {answers: [], type: "text"};
    $scope.questNb = 0;
    //Current answer
    $scope.currentAnswer = {};

    $scope.typeChecked = function(type){
      if($scope.currentQuestion.type == type){
        return true;
      }
      return false;
    }

    // If the anwsers are checkbox or radio button
    $scope.isMulti = function(){
      var count = 0;
      var isMulti = false;
      var answers = $scope.currentQuestion.answers;
      answers.forEach(function(e){
        if(e.correct){
          count++;
          if(count == 2) return isMulti = true; //checkbox
        }
      });
      return isMulti; //radio button
    }

    //When click on Start Quiz button -> display quiz question by question, begining with the first one
    //When click on Submit button -> display next question
    $scope.nextQuestion = function(){
      $scope.quizInfo = false;
      $scope.endQuizButton = false;
      $scope.displayQuestion = true;
      //$scope.questNb++;

      //Go to next question
      if($scope.questNb < ($scope.quiz.questions.length)){
        $scope.currentQuestion = $scope.quiz.questions[$scope.questNb];
        $scope.currentAnswer = $scope.currentQuestion.answers;
        $scope.questNb++;
      } else {
        $scope.displayQuestion = false;
        $scope.endQuizButton = true;
      }
    };

    $scope.validateAnswer = function(answer){
      if($scope.isMulti()){
         var answers = $scope.currentQuestion.answers;
         answers.forEach(function(e){
           var answer = e;
           if(answer.correct && !answer.checked || !answer.correct && answer.checked) return fail();
         });
      }
      else {
        if(answer.text !== getCurrentAnswer()) return fail();
      }
      $scope.score = $scope.score + 5;
      $scope.nextQuestion();
    };

    function fail(){
      $scope.nbMistake++;
      return $scope.score = $scope.score - 3;
    };

    function getCurrentAnswer(){
       var answers = $scope.currentQuestion.answers;
       answers.forEach(function(e){
         if(e.correct) res = e.text;
       });
       return res;
    };

    $scope.retry = function(){
      $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: true,
          notify: true
      });
    };

    $scope.goToSearch = function(){
      $state.go('searchQuiz');
    };

    $scope.onClickAnswer = function(answer){
      if($scope.isMulti()){
        answer.checked = !answer.checked;
      } else {
        $scope.validateAnswer(answer);
      }
    };

    $scope.gameLiked = false;
    $scope.like = function(){
      GameService.likeGame($stateParams.id).then(function(){
        $scope.gameLiked = true;
        console.log('Game liked');
      },function(err){
        $scope.gameLiked = false;
        alert("Error during liking game process: "+err);
      });
    };

}]);
