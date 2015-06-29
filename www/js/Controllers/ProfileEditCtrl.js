angular.module('starter.controllers')
.controller('ProfileEditCtrl', [ '$scope', '$state',
  function($scope, $state) {

    $scope.saveAll = function(){
      $state.go('profile');
    };




}]);
