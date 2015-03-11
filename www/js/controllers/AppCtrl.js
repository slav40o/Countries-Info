/**
 * Created by Slavi on 3/8/2015.
 */
app.controller('AppCtrl', function($scope, $log, $ionicPopup, $state, localStorageService){
    'use strict';

    $scope.showReloadConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Reload app data?',
            template: 'Main countries info will be reloaded!',
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
                reload();
            } 
        });
    };

    function reload(){
        localStorageService.set('isAppCached', false);
        $state.go('splash');
        window.location.reload();
        $log.debug('AppC: app cache cleared');
    }
});