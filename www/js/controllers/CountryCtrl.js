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
    
    countriesApiService.getByName($scope.country.name).then(function(data){
        if(data){
            $scope.details = data[0];
            $ionicLoading.hide();
            $scope.isDataLoaing = false;
            $log.debug($scope.details);
        }
        else{
            $state.go('app.main');
        }
    }, function(error){
        $ionicLoading.hide();
        showErrorPopup(error)
    });

    $scope.setAsHome = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Set as home country?',
            template: 'Are you sure you want to set ' + $scope.country.name + ' as home?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                localStorageService.setObject('home', $scope.details);
                $state.go('app.main');
            } else {
                console.log('canceled');
            }
        });
    };

    $scope.showMap = function(){
        var lat, long;
        lat = $scope.details.latlng[0];
        long = $scope.details.latlng[1];
        $log.debug(lat + ':' + long); 
        $state.go('app.map', { lat: lat, long: long });

    };

    function showErrorPopup(error) {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<p>This might be caused by a server or a network error</p>',
            title: 'Unnable to get full data!',
            scope: $scope,
            buttons: [
                { 
                    text: 'OK',
                    type: 'button-positive',
                }
            ]
        });
    };
});