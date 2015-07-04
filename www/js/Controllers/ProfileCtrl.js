angular.module('starter.controllers')
.controller('ProfileCtrl', ['$scope', '$state', '$stateParams', 'UserService', 'AuthenticationService',
  function($scope, $state, $stateParams, UserService, AuthenticationService) {

    $scope.user = {};

    UserService.getUser($stateParams.username).then(function(user){
      $scope.isUser = AuthenticationService.currentUser().username === user.username;
      $scope.user = user;
      console.log($scope.user);
    });




}]);
