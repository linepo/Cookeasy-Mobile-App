angular.module('starter.controllers')
.controller('SearchRecipeCtrl', [ '$scope', '$rootScope', '$state', 'RecipeService',
  function($scope, $rootScope, $state, RecipeService) {

  $scope.recipes = [];

  $scope.searchRecipe = function(){
    var mysearch = $scope.mySearchRecipe;
    
    if($scope.mySearchRecipe.length){
      RecipeService.getSearchRecipe(mysearch).then(function(res){
        $scope.recipes = res;
        console.log($scope.recipes);
      });
    } else {
      RecipeService.getTrends().then(function(res){
        $scope.recipes = res;
        console.log($scope.recipes);
      });
    }
  };

  $scope.displayRecipe = function(id){
    $state.go('displayRecipe', {id: id});
  };

}]);
