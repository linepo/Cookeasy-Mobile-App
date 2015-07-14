// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in each controllers
angular.module('App', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.directives', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) {

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('login', {
      url: "/",
      controller: 'LoginCtrl',
      templateUrl: "templates/login.html"
    })

    .state('createRecipe', {
      url: "/recipe/create",
      controller: 'CreateRecipeCtrl',
      templateUrl: "templates/create-recipe.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('displayRecipe', {
      url: "/recipe/display/:id",
      controller: 'DisplayRecipeCtrl',
      templateUrl: "templates/display-recipe.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('searchRecipe', {
      url: "/recipe/search",
      controller: 'SearchRecipeCtrl',
      templateUrl: "templates/search-recipe.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('menu', {
      url: "/menu",
      controller: 'MenuCtrl',
      templateUrl: "templates/menu.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('profile', {
      url: "/profile/:username",
      controller: 'ProfileCtrl',
      templateUrl: "templates/profile.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('profileEdit', {
      url: "/profile-edit/:username",
      controller: 'ProfileEditCtrl',
      templateUrl: "templates/profile-edit.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('signUp', {
      url: "/sign-up",
      controller: 'SignUpCtrl',
      templateUrl: "templates/sign-up.html"
    })

    .state('games', {
      url: "/games",
      controller: 'GamesCtrl',
      templateUrl: "templates/games.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('createQuiz', {
      url: "/quiz/create",
      controller: 'CreateQuizCtrl',
      templateUrl: "templates/create-quiz.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    });
/*
    .state('displayQuiz', {
      url: "/quiz/display/:id",
      controller: 'DisplayQuizCtrl',
      templateUrl: "templates/display-quiz.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    })

    .state('searchQuiz', {
      url: "/quiz/search",
      controller: 'SearchQuizCtrl',
      templateUrl: "templates/search-quiz.html",
      resolve: { promise: function($q,$state,Header){
        var deferred = $q.defer();
        deferred.resolve();
        if(localStorage.token){
          Header.show();
        } else {
          $state.go('login');
        }
        return deferred.promise;
      }}
    });
*/
  $httpProvider.interceptors.push('TokenInterceptor');

}])

.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
