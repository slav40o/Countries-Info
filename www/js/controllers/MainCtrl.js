/**
 * Created by Slavi on 3/2/2015.
 */

app.controller('MainCtrl',function($scope, localStorageService){
    'use strict';

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.country = localStorageService.getObject('home');
    });
});