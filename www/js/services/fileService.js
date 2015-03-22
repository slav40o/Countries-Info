app.factory('fileService', function($http, $q, $log, $cordovaFile, $cordovaFileTransfer, $ionicPlatform,$ionicPopup, deviceService){

    /*
        Defines application directories and directory for the Pictures (Tested only on android)
     */

    var appDirectory,   // relative path used by $cordovaFile
        fullDirectory,  // full path used by $cordovaFileTransfer
        pictureDirectory,
        fullPictureDirectory;

    /*
        Set app directories depending on the platform. Not finished and tested for iOS
     */
    $ionicPlatform.ready(function(){
        var myFsRootDirectory1 = 'file:///storage/emulated/0/',   // path for tablet
            myFsRootDirectory2 = 'file:///storage/sdcard0/', // path for phone
            myFsRootDirectory3 = 'file:///storage/sdcard/'; // path for emulator Bluestacks

        if (deviceService.isAndroid()) {
            fullDirectory = cordova.file.externalDataDirectory;
            pictureDirectory = 'Pictures/';

            if (fullDirectory.indexOf(myFsRootDirectory1) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory1, '');
                fullPictureDirectory = myFsRootDirectory1 + 'Pictures/';
            }
            else if (fullDirectory.indexOf(myFsRootDirectory2) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory2, '');
                fullPictureDirectory = myFsRootDirectory2 + 'Pictures/';

            }
            else if (fullDirectory.indexOf(myFsRootDirectory3) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory3, '');
                fullPictureDirectory = myFsRootDirectory3 + 'Pictures/';
            }
        }
        if (deviceService.isIOS()) {
            // I use cordova.file.documentsDirectory because this url is for IOS (NOT backed on iCloud) devices
            fullDirectory = cordova.file.documentsDirectory;
            appDirectory = '';
        }

        $log.debug('FileService: app directory = ' + appDirectory);
        $log.debug('FileService: full directory = ' + fullDirectory);
    });

    function saveImageFile(country, image) {
        var deferred = $q.defer();

        if (deviceService.isMobile()) {
            var photoUrl = image.url,
                targetDirectory = pictureDirectory + country.name + '/',
                targetPath = '{0}{1}/{2}.jpg'.format(fullPictureDirectory, country.name, image.title),
                trustHosts = true,
                options = {};

            $cordovaFile.createDir(targetDirectory).then(function(){
                $cordovaFileTransfer.download(photoUrl, targetPath, trustHosts, options).then (function(success) {
                    deferred.resolve(success);
                }, function(error){
                    $log.error(JSON.stringify(error));
                    showError(JSON.stringify(error));
                    deferred.reject("Unable to save file!");
                });
            }, function(error){
                deferred.reject("Unable to create directory!");
                $log.error(JSON.stringify(error));
            });
        }
        else {
            deferred.reject('Unsupported platform!')
        }

        return deferred.promise;
    }

     function showError(error) {
        var alertPopup = $ionicPopup.alert({
            title: 'FUCK!',
            template: error
        });

        alertPopup.then(function() {

        });
     }

    // TO DO!
    function getImagesPaths(countryName){
        $cordovaFile.checkDir(pictureDirectory, countryName)
            .then(function (success) {
                $log.debug(JSON.stringify(success));
            }, function (error) {
                $log.error(JSON.stringify(error));
            });
    }

    return {
        addImage: saveImageFile,
        getImagesPaths: getImagesPaths
    };
});