/**
 * Created by s_tsvetanov on 20.3.2015 г..
 */
app.factory('deviceService', function($window, localStorageService){

    var deviceInfo, isWebView, isIPad, isIOS, isAndroid, isWindowsPhone, currentPlatform, currentPlatformVersion;

    ionic.Platform.ready(function(){
        deviceInfo = ionic.Platform.device();

        isWebView = ionic.Platform.isWebView();
        isIPad = ionic.Platform.isIPad();
        isIOS = ionic.Platform.isIOS();
        isAndroid = ionic.Platform.isAndroid();
        isWindowsPhone = ionic.Platform.isWindowsPhone();

        currentPlatform = ionic.Platform.platform();
        currentPlatformVersion = ionic.Platform.version();
    });

    function getSettings(){
        var settings = localStorageService.getObject('appSettings');

        // Set default
        if(Object.keys(settings).length == 0){
            settings = {
                hqPictures: false,
                hqPicturesSave: true,
                isSavingPhotoEnabled: true
            };
        }

        return settings;
    }

    function setSettings(settings) {
        if (settings) {
            localStorageService.setObject('appSettings', settings);
        }
    }

    return {
        platform: function(){ return currentPlatform; },
        isMobile: function(){
            return isIOS || isAndroid || isWindowsPhone || isIPad;
        },
        isAndroid: function(){ return isAndroid; },
        isIOS: function(){ return isIOS; },
        isWeb: function(){ return isWebView; },
        width: function(){ return $window.innerWidth; },
        height: function(){ return $window.innerHeight; },
        getSettings: getSettings,
        setSettings: setSettings
    };
});