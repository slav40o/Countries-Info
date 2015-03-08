/**
 * Created by Slavi on 3/2/2015.
 */
app.controller('SplashCtrl', ['$scope', '$state',
    function($scope, $state){
        'use strict';

        initialize();

        // For test
        function initialize(){
            setTimeout(function(){
                $state.go('app.main');
            }, 1000)
        }

}]);