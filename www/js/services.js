angular.module('starter.services', [])

.factory('Header', function(){
  var displayed = false;
  function show(){displayed = true;}
  function hide(){displayed = false;}
  function isDisplayed () {return displayed;}
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
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipes',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: recipe
    };
    $http(req).success(function(recipes){
      deferred.resolve(recipes.id);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.get = function(id){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/recipes/' + id).success(function(recipes){
      deferred.resolve(recipes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.getTrends = function(){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/recipes').success(function(recipes){
      deferred.resolve(recipes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.getSearchRecipe = function(mysearch){
    var deferred = $q.defer();
    var req = {
      method: 'GET',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipes',
      params: {match: mysearch}
    };
    $http(req).success(function(recipes){
      deferred.resolve(recipes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.createComment = function (id,comment){
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/recipes/' + id + '/comments',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: comment
    };
    $http(req).success(function(data){
      deferred.resolve(data);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  return services;
})

.factory('UserService', function ($http, $q) {
  var services = {};

  services.getUser = function(username){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/users/' + username).success(function(users){
      deferred.resolve(users);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.login = function (email, password) {
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/login',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {id: email, password: password }
    };
    $http(req).success(function(data){
      deferred.resolve(data);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.signUp = function (email, password, username) {
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/users',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {email: email, password: password, username: username }
    };
    $http(req).success(function(data){
      deferred.resolve(data.token,data.user);
    }).error(function(res){
      deferred.reject(res.error);
    });
    return deferred.promise;
  };

  services.updateUser = function(user){
    var deferred = $q.defer();
    var req = {
      method: 'PUT',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/users/' + user.username,
      data: user
    };
    $http(req).success(function(){
      deferred.resolve();
    }).error(function(res){
      deferred.reject(res.error);
    });
    return deferred.promise;
  };

  return services;
})

.factory('AuthenticationService', function ($window) {
   var userLogged = false;
   var auth = {
     currentUser: currentUser,
     setUser: setUser
   };

   function currentUser(){
     if(!userLogged){
       var user = $window.localStorage.user;
       if(user) userLogged = JSON.parse(user);
     }
     return userLogged;
   }

   function setUser(token,user){
     $window.localStorage.user = JSON.stringify(user);
     $window.localStorage['token'] = token;
   }
   return auth;
})

.factory('TokenInterceptor', function ($q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
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
  };
})

.factory('GameService', function ($http,$q) {
  var services = {};

  services.create = function (quiz){
    var deferred = $q.defer();
    var req = {
      method: 'POST',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/games/quizzes',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: quiz
    };
    $http(req).success(function(quizzes){
      deferred.resolve(quizzes.id);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.get = function(id){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/games/' + id).success(function(quizzes){
      deferred.resolve(quizzes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.getTrends = function(){
    var deferred = $q.defer();
    $http.get('https://mysterious-eyrie-9135.herokuapp.com/games').success(function(quizzes){
      deferred.resolve(quizzes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  services.getSearchQuiz = function(mysearch){
    var deferred = $q.defer();
    var req = {
      method: 'GET',
      url: 'https://mysterious-eyrie-9135.herokuapp.com/quizzes',
      params: {match: mysearch}
    };
    $http(req).success(function(quizzes){
      deferred.resolve(quizzes);
    }).error(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  return services;
});
