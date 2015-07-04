angular.module('starter.controllers')
.controller('ProfileEditCtrl', [ '$scope', '$state', '$stateParams', 'UserService',
  function($scope, $state, $stateParams, UserService) {

    $scope.user = {};
    UserService.getUser($stateParams.username).then(function(user){
      $scope.user = user;
      $scope.dobFormatted = new Date($scope.user.dob);
      console.log($scope.user);
    });

    $scope.errors = {};
    function checkUserInfo(){
      $scope.errors.user = {};
      // About name of user
      if(!$scope.user.name || $scope.user.name == ''){
        $scope.errors.user.name = 'Name of user should not be empty.';
      } else if(!isNaN($scope.user.name)){
        $scope.errors.user.name = 'Name of user should not be a number.';
      } else if($scope.user.name.length < 2){
        $scope.errors.user.name = 'Name of user should be at least 2 characters.';
      }
      // About date of birth
      if(!$scope.dobFormatted || $scope.dobFormatted == ''){
        $scope.errors.user.dob = 'Date of birth should not be empty.';
      }
      // About location
      if(!$scope.user.location || $scope.user.location == ''){
        $scope.errors.user.location = 'Location should not be empty.';
      } else if(!isNaN($scope.user.location)){
        $scope.errors.user.location = 'Location should not be a number.';
      } else if($scope.user.location.length < 2){
        $scope.errors.user.location = 'Location should be at least 2 characters.';
      }
      // About password
      // About description
      if(!$scope.user.description){
        $scope.errors.user.description = 'Description should not be empty.';
      } else if(typeof $scope.user.description !== "string" || $scope.user.description.length < 4){
        $scope.errors.user.description = 'Description should be at least 4 characters.';
      }
    }

    $scope.saveAll = function(){
      //check errors
      checkUserInfo();
      if(Object.keys($scope.errors.user).length){
        return;
      }
      //save all new info
      UserService.updateUser($scope.user).then(function(){
        //then go back to my profile
        $state.go('profile', {username: $scope.user.username});
      });
    };




}]);
