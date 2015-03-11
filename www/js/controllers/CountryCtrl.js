/**
 * Created by Slavi on 3/7/2015.
 */
app.controller('CountryCtrl', function($scope, $log, $stateParams, $state, cashedResourcesService, flagService, countriesApiService){
    'use strict';

    var baseUrl = "http://www.geonames.org/flags/x";
    $scope.country = cashedResourcesService.getCountryByAlpha3Code($stateParams.code);
    countriesApiService.getByName($scope.country.name).then(function(data){
        if(data){
            $scope.details = data[0];
            $scope.flagSource = baseUrl + '/' + $scope.details.alpha2Code.toLowerCase() + '.gif';
            $log.debug($scope.details);
        }
        else{
            // TO DO: Show error loading
        }
    });
    
    $scope.showMap = function(){
        var lat, long;
        lat = $scope.details.latlng[0];
        long = $scope.details.latlng[1];
        $log.debug(lat + ':' + long); 
        $state.go('app.map', { lat: lat, long: long });
    };
});