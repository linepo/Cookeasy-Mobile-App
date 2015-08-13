angular.module('starter.controllers')
.controller('SignUpCtrl', [ '$scope', '$rootScope', '$state', '$window', 'UserService','AuthenticationService', 'Header',
    function($scope, $rootScope, $state, $window, UserService, AuthenticationService, Header) {

  $scope.user = {email: '', password: '', username: '', confirmPassword: ''};
  $scope.error = "";

  //Go to next page -> enter username
  $scope.newUser = function(){
    if($scope.user.email != $scope.user.email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-z]{2,4}/i)){
      $scope.error = "Email not valid.";
      return;
    }
    if($scope.user.password.length < 6){
      $scope.error = "Password too short.";
      return;
    }
    if($scope.user.password !== $scope.user.confirmPassword){
      $scope.error = "Passwords do not match.";
      return;
    }
    $scope.createAccount = true;
    delete $scope.error;
  };

  $scope.register = function () {
    $scope.dataLoading = true;

    UserService.signUp($scope.user.email, $scope.user.password, $scope.user.username).then(function(data) {
      AuthenticationService.setUser(data.token,data.user);
      $scope.dataLoading = false;
      Header.show();
      $state.go('searchRecipe');
    },function(error){
      $scope.error = error;
      $scope.dataLoading = false;
      if(Object.keys($scope.error).length){
        return;
      }
    });
  };

}]);
