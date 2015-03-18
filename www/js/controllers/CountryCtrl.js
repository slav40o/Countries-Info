/**
 * Created by Slavi on 3/7/2015.
 */
app.controller('CountryCtrl', function($scope, $log, $stateParams, $state, $ionicPopup, $ionicLoading, cashedResourcesService, countriesApiService, localStorageService){
    'use strict';

    var baseUrl = "http://www.geonames.org/flags/x";
    $ionicLoading.show({
        noBackdrop: true
    });
    
    $scope.isDataLoaing = true;
    $scope.country = cashedResourcesService.getCountryByAlpha3Code($stateParams.code);
    $scope.flagSource = baseUrl + '/' + $scope.country.alpha2Code.toLowerCase() + '.gif';
    
    
    /* 
        Loads full info for the selected country
    */
    countriesApiService.getByName($scope.country.name).then(function(data){
        if (data.length <= 0) {
            $log.error('CountryCtrl: no such country with the name {0} found'.format($scope.country.name));
            $state.go('app.main');
        } else {
            $scope.details = data[0];
            $scope.isDataLoaing = false;
            $ionicLoading.hide();
            $log.debug("CountryCtrl: {0} full details fetched".format($scope.details.name));
        }
    }, function(error){
        $ionicLoading.hide();
        $log.error("CountryCtrl: Error getting details for {0}".format($scope.country.name));
        showErrorPopup(error)
    });

    /* 
        Sets current country as home and redirects to home screen
    */
    $scope.setAsHome = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Set as home country?',
            template: 'Are you sure you want to set ' + $scope.country.name + ' as home?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                localStorageService.setObject('home', $scope.details);
                $state.go('app.main');
                $log.debug("CountryCtrl: set {0} as home confirmed".format($scope.country.name));
            } else {
                $log.debug("CountryCtrl: set {0} as home NOT confirmed".format($scope.country.name));
            }
        });
    };

    /* 
        Shows current country on google maps
    */
    $scope.showMap = function(){
        var lat, long;
        lat = $scope.details.latlng[0];
        long = $scope.details.latlng[1];
        $log.debug("CountryCtrl: map view called"); 
        $state.go('app.map', { lat: lat, long: long, area: $scope.details.area });

    };

    function showErrorPopup(error) {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<p>This might be caused by a server or a network error</p>',
            title: 'Unable to get full data!',
            scope: $scope,
            buttons: [
                { 
                    text: 'OK',
                    type: 'button-positive'
                }
            ]
        });
        myPopup.then(function(){
            $log.error('CountryCtrl: error popup closed');
        });

    }
});