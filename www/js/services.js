angular.module('starter.services', [])

.factory('Header', function(){
  var displayed = false;

  function show(){
    displayed = true;
  }

  function hide(){
    displayed = false;
  }

  function isDisplayed () {
    return displayed;
  }

  return {
    show: show,
    hide: hide,
    isDisplayed: isDisplayed
  };
})

.factory('RecipeService', function ($http,$q) {
  var services = {};

  services.create = function (recipe){
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipe/create',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: recipe
    };

    $http(req).success(function(data){
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.id);
      }
    });
    return deferred.promise;
  };

  services.get = function(id){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/recipe/get/' + id).success(function(data){
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.recipe);
      }
    });
    return deferred.promise;
  };

  services.createComment = function (id,comment){
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipe/comment/add/' + id,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: comment
    };

    $http(req).success(function(data){
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.comment);
      }
    });
    return deferred.promise;
  };

  services.getSearchRecipe = function(mysearch){
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipe/search',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {search: mysearch}
    };

    $http(req).success(function(data){
      console.log(data);
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.recipes);
      }
    });
    return deferred.promise;
  };

  return services;
})

.factory('UserService', function ($http, $q) {
  var services = {};

  services.login = function (email, password) {
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/user/login',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {id: email, password: password }
    };

    $http(req).success(function(data){
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.token);
      }
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;

  }

  services.signUp = function (email, password, username) {
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/user/signup',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {email: email, password: password, username: username }
    };

    $http(req).success(function(data){
      if(data.error){
        deferred.reject(data.error);
      } else {
        deferred.resolve(data.token);
      }
    }).error(function(res){
      deferred.reject(res.error);
    });
    return deferred.promise;
  }

  return services;
})

.factory('AuthenticationService', function () {
   var auth = {
     isLogged: false
   };

   return auth;
})

.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      },

      requestError: function(rejection) {
        return $q.reject(rejection);
      },

      /* Set Authentication.isAuthenticated to true if 200 received */
      response: function (response) {
        if (response != null && response.status == 200 && $window.localStorage.token && !AuthenticationService.isAuthenticated) {
          AuthenticationService.isAuthenticated = true;
        }
        return response || $q.when(response);
      }
    };
})

.factory('Camera', function($q) {

  return {
    getPicture: function(onSuccess,onFail,options) {
      var deferred = $q.defer();

      navigator.camera.getPicture(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);

      return deferred.promise;
    }
  }
});
