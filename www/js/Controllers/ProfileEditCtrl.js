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
      // About name of user - nothing
      // About date of birth
      if(!$scope.dobFormatted && !($scope.dobFormatted intanceof Date){
        $scope.errors.user.dob = 'Date of birth should be a valid date.';
      }
      // About location - nothing
      // About password
      // About description - nothing
    }

    $scope.saveAll = function(){
      //check errors
      checkUserInfo();
      if(Object.keys($scope.errors.user).length){
        return;
      }
      //transform date of birth in the good format
      $scope.user.dob = $scope.dobFormatted.getTime();
      //save all new info
      UserService.updateUser($scope.user).then(function(){
        //then go back to my profile
        $state.go('profile', {username: $scope.user.username});
      });
    };




}]);
