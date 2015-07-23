angular.module('starter.controllers')
.controller('MenuCtrl', ['$scope', 'AuthenticationService',
  function($scope, AuthenticationService) {

    $scope.userLogged = AuthenticationService.currentUser();

    $scope.logout = function(){
      console.log('logout');
      AuthenticationService.logout();
    }


}]);
