/**
 * Created by Slavi on 3/8/2015.
 */
app.controller('AppCtrl', function($scope, $log, $ionicPopup, $state, $ionicLoading, $cordovaGeolocation, $cordovaToast, localStorageService, countriesApiService){
    'use strict';

    $scope.showReloadConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Reload app data?',
            template: 'Main countries info will be reloaded!',
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'Cancel',
                type: 'button-assertive',
                onTap: function() {
                    // e.preventDefault() will stop the popup from closing when tapped.
                    $log.debug("AppCtrl: reload canceled")
                }
            }, {
                text: 'OK',
                type: 'button-balanced',
                onTap: function(e) {
                    // Returning a value will cause the promise to resolve with the given value.
                    // return scope.data.response;
                    $log.debug("AppCtrl: reload accepted");
                    return e;
                }
            }]
        });
        confirmPopup.then(function(res) {
            if(res) {
                reload();
            } 
        });
    };

    $scope.locateHome = function(){
        $ionicLoading.show();
        var posOptions = {timeout: 10000, enableHighAccuracy: false},
            geocoder = new google.maps.Geocoder();
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat  = position.coords.latitude;
                var lng = position.coords.longitude;
                var latlng = new google.maps.LatLng(lat, lng);
                $log.debug("AppCtrl: Location fetched {0} {1}".format(lat, lng));
            
                geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[7]) {
                            $log.debug("AppCtrl: address from geocoder recieved");
                            var alpha2Code = results[7].address_components[0].short_name;
                            countriesApiService.getByCode(alpha2Code)
                                .then(function(data){
                                    localStorageService.setObject('home', data);
                                    $ionicLoading.hide();
                                    $log.debug("AppCtrl: country {0} fetched".format(data.name));
                                    $state.transitionTo($state.current, null, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                            }, function(err){
                                $log.error('AppCtrl: Error getting country info ' + err);
                                $cordovaToast.showLongBottom('Unnable to get country info!');
                                $ionicLoading.hide();
                            });
                        }
                    } 
                    else {
                        $log.error('AppCtrl: Geocoder failed due to: ' + status);
                        $cordovaToast.showLongBottom('Geocoder failed due to: ' + status);
                        $ionicLoading.hide();
                    }
            });
        }, function(err) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom('Geolocation failed');
            $log.error('AppCtrl: Geolocation failed ' + err);
        });
    };

    /* 
        Forses the application to load Splashscreen to reload the data from the REST API
    */
    function reload(){
        localStorageService.set('isAppCached', false);
        localStorageService.setObject('home', {});
        $state.go('splash');
        window.location.reload();
        $log.debug('AppC: app cache cleared');
    }
});