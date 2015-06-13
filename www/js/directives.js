angular.module('starter.directives', ['starter.controllers'])
.directive('pictureUpload', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/picture-upload.html',
    scope: {
      callback: "=",
      getPictureUrl: "=",
      uploadedPicture: '='
    }
  };
});
