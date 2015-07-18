angular.module('starter.controllers')
.controller('LoginCtrl', ['$scope', '$rootScope', '$state','$window', 'UserService','AuthenticationService',
    function ($scope, $rootScope, $state, $window, UserService, AuthenticationService) {

  $scope.user = {email: '', password: ''};
  $scope.error = "";

  $scope.login = function () {
    $scope.dataLoading = true;

    UserService.login($scope.user.email, $scope.user.password).then(function (data) {
      AuthenticationService.setUser(data.token,data.user);
      $scope.dataLoading = false;
      $state.go('searchRecipe');
    },function(err){
      $scope.error = err.message;
      $scope.dataLoading = false;
      if(Object.keys($scope.error).length){
        return;
      }
    });

  };
}]);
