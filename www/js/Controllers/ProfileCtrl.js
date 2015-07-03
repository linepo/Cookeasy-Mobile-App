angular.module('starter.controllers')
.controller('ProfileCtrl', ['$scope', '$state', '$stateParams', 'UserService',
  function($scope, $state, $stateParams, UserService) {

    $scope.user = {};
    UserService.getUser($stateParams.username).then(function(user){
      $scope.user = user;
      console.log($scope.user);
    });





}]);
