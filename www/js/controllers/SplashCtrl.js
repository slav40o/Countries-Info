/**
 * Created by Slavi on 3/2/2015.
 */
app.controller('SplashCtrl', function($scope, $state, $timeout, $log, $ionicPopup, $ionicHistory, $ionicPlatform, countriesApiService, localStorageService, cashedResourcesService){
    'use strict';

    $scope.degrees = 0;
    $scope.isRotating = true;

    initialize();

    /*
        Initializes initial app data. Checks if main countries data is already cached to the device.
        Loads them into cashedResourcesService.
    */
    function initialize(){
        rotateLogo();
        var isAppCashed = localStorageService.get('isAppCached', false);
        $log.debug('SplashC: app is cached - ' + isAppCashed);
        $ionicPlatform.registerBackButtonAction(function (e) {
            $ionicHistory.goBack();
            e.preventDefault();
        }, 100);


        // If the countries are cashed just show that badass rotating logo; 
        if(isAppCashed){
            $timeout(function(){
                cashedResourcesService.setCountries(localStorageService.getObject('savedCountries'));
                goToMain();
                $log.debug('SplashC: loaded cached(saved) countries');
            }, 1000);
        }
        else {
            countriesApiService.getAll()
                .then(function(data){
                var countries = extractMainCountriesInfo(data);
                cashedResourcesService.setCountries(countries);
                localStorageService.setObject('savedCountries', countries);
                localStorageService.set('isAppCached', true);
                $log.debug('SplashC: fetched, loaded and cached countries');
                goToMain();
            }, function(error){
                showErrorPopup(error);
            });
        }
    }

    /*

    */
    function extractMainCountriesInfo(countriesArray){
        var i,
            countries = [];
        for(i = 0; i < countriesArray.length; i += 1){
            var fullCountry = countriesArray[i];
            var country = {
                alpha3Code: fullCountry.alpha3Code,
                alpha2Code: fullCountry.alpha2Code,
                capital: fullCountry.capital,
                name: fullCountry.name,
                population: fullCountry.population,
                languages: fullCountry.languages
            };

            countries.push(country);
        }

        return countries;
    }

    /*
        Navigates to main(home) screen
    */
    function goToMain(){
        $scope.isRotating = false;
        $state.go('app.main');
    }

    /*
        Starts a loop that rotates tha splashscreen logo
    */
    function rotateLogo(){
        $scope.degrees += 0.2;

        if($scope.isRotating){
            $timeout(function(){
                rotateLogo();
            }, 10);
        }
    }

    /*
        Shows error when there is no data cached and there was a problem with conection to the server.
    */
    function showErrorPopup() {
        $scope.data = {};

        // An elaborate, custom popup
        var alertPopup = $ionicPopup.alert({
            template: '<p>Please check your network connection.</p>',
            title: 'Error while conencting to the server!'
        });
        alertPopup.then(function() {
            goToMain();
        });
    }

});