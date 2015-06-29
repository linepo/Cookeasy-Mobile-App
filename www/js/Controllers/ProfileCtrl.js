angular.module('starter.controllers')
.controller('ProfileCtrl', ['$scope', '$state',
  function($scope, $state) {

    $scope.editAll = function(){
      $state.go('profileEdit');
    };




}]);
