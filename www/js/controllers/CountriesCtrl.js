/**
 * Created by Slavi on 3/7/2015.
 */
app.controller('CountriesCtrl', function($scope, cashedResourcesService){
    'use strict';

    $scope.isSearchActive = false;
    $scope.search = {};
    $scope.countries = cashedResourcesService.getAll();
    $scope.toggleSearch = function(){
        $scope.search.name = '';
        $scope.isSearchActive = !$scope.isSearchActive;
    }

});
