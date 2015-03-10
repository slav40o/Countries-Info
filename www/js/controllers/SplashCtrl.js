/**
 * Created by Slavi on 3/2/2015.
 */
app.controller('SplashCtrl', function($scope, $state, $timeout, $log, countriesApiService, localStorageService, cashedResourcesService){
    'use strict';

    $scope.degrees = 0;
    $scope.isRotating = true;

    initialize();

    function initialize(){
        var isAppCashed;
        
        rotateLogo();
        isAppCashed = localStorageService.get('isAppCached');
        $log.debug('SplashC: app is cached - ' + isAppCashed);
        
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
            });
        }
    }
    
    function extractMainCountriesInfo(countriesArray){
        var i,
            countries = [];
        for(i = 0; i < countriesArray.length; i += 1){
            var fullCountry = countriesArray[i];
            var country = {
                alpha3Code: fullCountry.alpha3Code,
                capital: fullCountry.capital,
                name: fullCountry.name,
                population: fullCountry.population,
                languages: fullCountry.languages
            };
            
            countries.push(country);
        }
        
        return countries;
    }
    
    function goToMain(){
        $scope.isRotating = false;
        $state.go('app.main');
    }

    function rotateLogo(){
        $scope.degrees += 0.2;

        if($scope.isRotating){
            $timeout(function(){
                rotateLogo();
            }, 10);
        }
    }
});
