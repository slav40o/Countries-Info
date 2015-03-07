/**
 * Created by Slavi on 3/2/2015.
 */
app.controller('SplashCtrl', ['$scope', '$state',
    function($scope, $state){
        'use strict';

        initialize();

        $scope.author = "Slavi";

        function initialize(){
            setTimeout(function(){
                $state.go('main');
            }, 1000)
        }

}]);