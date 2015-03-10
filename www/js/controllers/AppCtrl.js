/**
 * Created by Slavi on 3/8/2015.
 */
app.controller('AppCtrl', function($scope, $log, $ionicPopup, localStorageService){
    'use strict';

    $scope.showClearCacheConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Clear app cache?',
            template: 'All cached data will be removed and next load will be slower!',
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'Cancel',
                type: 'button-assertive',
                onTap: function(e) {
                    // e.preventDefault() will stop the popup from closing when tapped.
                    // e.preventDefault();
                }
            }, {
                text: 'OK',
                type: 'button-balanced',
                onTap: function(e) {
                    // Returning a value will cause the promise to resolve with the given value.
                    // return scope.data.response;
                    $log.info(e);
                    return e;
                }
            }]
        });
        confirmPopup.then(function(res) {
            if(res) {
                clearCache();
            } 
        });
    };

    function clearCache(){
        localStorageService.set('isAppCached', false);
        // TO DO: remove countries and flags data from local memory
        $log.debug('AppC: app cache cleared');
    }
});