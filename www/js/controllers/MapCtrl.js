/**
 * Created by Slavi on 3/7/2015.
 */
app.controller('MapCtrl', function($scope, $log, $ionicLoading, $compile, $stateParams, $window) {
    function initialize() {
        var myLatlng = new google.maps.LatLng($stateParams.lat, $stateParams.long);
        var zoom = getZoom($stateParams.area);
        var mapOptions = {
            center: myLatlng,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADS
        };
        $scope.map = new google.maps.Map(document.getElementById("map"),
                                      mapOptions);
        $log.debug('MapCtrl: map initialized to coordinates {0} - {1}'.format($stateParams.lat, $stateParams.long));
    }
    
    ionic.Platform.ready(initialize);
    
    /*
        Defines zoom depending on screen size and country area. 
        There shoud be more optimized way. 90px on zoom level 12 is 2 km. 
    */
    function getZoom(area){
        var width = $window.innerWidth,
            multiplier = width / 90,
            countryWidth = Math.sqrt(area),
            zoomLevel = 16,
            widthFor90Px = 0.125,
            currentWidth = widthFor90Px * multiplier;
        
        while(currentWidth + currentWidth/12 < countryWidth){
            widthFor90Px *= 2;
            zoomLevel--;
            currentWidth = widthFor90Px * multiplier;
        }
        
        $log.debug('MapCtrl: map zoom set to {0}'.format(zoomLevel));
        return zoomLevel;
    }
});