/**
 * Created by Slavi on 3/7/2015.
 */
app.controller('MapCtrl', function($scope, $ionicLoading, $compile, $stateParams) {
    function initialize() {
        var myLatlng = new google.maps.LatLng($stateParams.lat, $stateParams.long);

        var mapOptions = {
            center: myLatlng,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADS
        };
        var map = new google.maps.Map(document.getElementById("map"),
                                      mapOptions);
        $scope.map = map;
    }
    ionic.Platform.ready(initialize);
});