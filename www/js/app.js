// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('splash', {
                url: '/',
                templateUrl: 'views/splash.html',
                controller: 'SplashCtrl'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'views/partials/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.main', {
                url: '/main',
                views: {
                    'menuContent': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    }
                }

            })
            .state('app.map', {
                url: '/map/:lat/:long',
                views: {
                    'menuContent': {
                        templateUrl: 'views/map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('app.countries', {
                url: '/countries',
                views: {
                    'menuContent': {
                        templateUrl: 'views/countries.html',
                        controller: 'CountriesCtrl'
                    }
                }
            })
            .state('app.country-index', {
                url: '/country/:code',
                views: {
                    'menuContent': {
                        templateUrl: 'views/country.html',
                        controller: 'CountryCtrl'
                    }
                }
            })
            .state('app.about', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'views/about.html'
                    }
                }
            });
});
