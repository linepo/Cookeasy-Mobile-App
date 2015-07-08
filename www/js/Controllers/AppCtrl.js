angular.module('starter.controllers')
.controller('AppCtrl', ['$scope', 'Header', function($scope, Header) {

  $scope.showHeader = false;
  $scope.$watch(function(){
    return Header.isDisplayed();
  }, function(val){
    $scope.showHeader = val;
  });

}]);
