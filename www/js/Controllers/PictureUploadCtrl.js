angular.module('starter.controllers')
.controller('PictureUploadCtrl', ['$scope','$cordovaImagePicker', '$cordovaFileTransfer', '$window', 'Camera',
  function ($scope, $cordovaImagePicker, $cordovaFileTransfer, $window, Camera) {

    $scope.notLoadedPic = true;
    $scope.loadedPic = false;

    $scope.importPicture = function(){
      var options = {
         maximumImagesCount: 1,
         quality: 80
        };

      $cordovaImagePicker.getPictures(options).then(function (results) {
          upload(results[0]);
        }, function(error) {
          // error getting photos
          alert("Error: "+error);
        });

      $scope.notLoadedPic = false;
      $scope.loadedPic = true;
    };

    $scope.takePicture = function(){
        var options = {
        quality: 50,
        destinationType: 1, // Camera.DestinationType.FILE_URI,
        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        encodingType: 0     // 0=JPG 1=PNG
      }

      Camera.getPicture(options).then(upload, onFail);
      $scope.notLoadedPic = false;
      $scope.loadedPic = true;
    };

    var upload = function(fileUri) {
      $scope.$apply();
      var options = new FileUploadOptions();
      options.fileName = fileUri.substr(fileUri.lastIndexOf('/')+1);
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
      options.headers = {'Authorization': 'Bearer ' + $window.localStorage.token};

      $cordovaFileTransfer.upload($scope.targetUrl, fileUri, options).then(win, fail, progress);

      function win (res){
        var json = JSON.parse(res.response);
        $scope.callback(json.picture);
        $scope.uploadProgress = undefined;
      }
      function fail (err){
        alert("Error: "+err);
        //alert(JSON.stringify(err));
      }
      function progress (progress){
        $scope.uploadProgress = (progress.loaded / progress.total) * 100;
      }
    };

    var onFail = function(e) {
      console.log("On fail " + e);
    }

    $scope.uploadPicture = function(){
      $scope.callback();
      $scope.notLoadedPic = true;
      $scope.loadedPic = false;
    };
}]);
