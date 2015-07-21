angular.module('starter.controllers')
.controller('SearchQuizCtrl', [ '$scope', '$rootScope', '$state', 'GameService',
  function($scope, $rootScope, $state, GameService) {

  $scope.quizzes = [];
  $scope.quizzesTrends = [];

  init();
  function init(){
    GameService.getTrends().then(function(res){
      $scope.quizzesTrends = res;
      $scope.quizzes = res;
    });
  }

  $scope.searchQuiz = function(){
    var mysearch = $scope.mySearchQuiz;

    if($scope.mySearchQuiz.length){
      GameService.getSearchQuiz(mysearch).then(function(res){
        $scope.quizzes = res;
        console.log($scope.quizzes);
      });
    } else {
      $scope.quizzes = $scope.quizzesTrends;
    }
  };

  $scope.displayQuiz = function(id){
    $state.go('displayQuiz', {id: id});
  };

}]);
