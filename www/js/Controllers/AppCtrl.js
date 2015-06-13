angular.module('starter.controllers')
.controller('AppCtrl', ['$scope', '$ionicPopover', 'Header', function($scope, $ionicPopover, Header) {

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.showHeader = false;
  $scope.$watch(function(){
    return Header.isDisplayed();
  }, function(val){
    $scope.showHeader = val;
  });

}]);
