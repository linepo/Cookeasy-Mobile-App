angular.module('starter.controllers')
.controller('ProfileEditCtrl', [ '$scope', '$state', '$stateParams', 'UserService',
  function($scope, $state, $stateParams, UserService) {

    $scope.user = {};
    UserService.getUser($stateParams.username).then(function(user){
      $scope.user = user;
      $scope.dobFormatted = new Date($scope.user.dob);
      console.log($scope.user);
    });

    $scope.saveAll = function(){
      //save all new info

      //then go back to my profile
      $state.go('profile/' + $scope.user.username);
    };




}]);
