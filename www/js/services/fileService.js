app.factory('fileService', function($http, $q, $log, $ionicPlatform, $cordovaToast, $cordovaFile, $cordovaFileTransfer){

    var appDirectory,   // relative path used by $cordovaFile
        fullDirectory;  // full path used by $cordovaFileTransfer

    /*
        Set app directories depending on the platform
     */
    $ionicPlatform.ready(function(){
        var myFsRootDirectory1 = 'file:///storage/emulated/0/',   // path for tablet
            myFsRootDirectory2 = 'file:///storage/sdcard0/', // path for phone
            myFsRootDirectory3 = 'file:///storage/sdcard/'; // path for emulator Bluestacks

        if (ionic.Platform.isAndroid()) {
            fullDirectory = cordova.file.externalDataDirectory;
            if (fullDirectory.indexOf(myFsRootDirectory1) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory1, '');
            }
            else if (fullDirectory.indexOf(myFsRootDirectory2) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory2, '');
            }
            else if (fullDirectory.indexOf(myFsRootDirectory3) === 0) {
                appDirectory = fullDirectory.replace(myFsRootDirectory3, '');
            }
        }
        if (ionic.Platform.isIOS()) {
            // I use cordova.file.documentsDirectory because this url is for IOS (NOT backed on iCloud) devices
            fullDirectory = cordova.file.documentsDirectory;
            appDirectory = '';
        }

        $log.debug('FileService: app directory = ' + appDirectory);
        $log.debug('FileService: full directory = ' + fullDirectory);
    });

    function saveImageFile(country, image) {
        var deferred = $q.defer();

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
            var photoUrl = image.url,
                targetDirectory = appDirectory + country.name + '/',
                targetPath = '{0}{1}/{2}.jpg'.format(fullDirectory, country.name, image.title),
                trustHosts = true,
                options = {};

            $cordovaFile.createDir(targetDirectory).then(function(){
                $cordovaFileTransfer.download(photoUrl, targetPath, trustHosts, options).then (function(success) {
                    deferred.resolve(success);
                }, function(err){
                    $log.error(err);
                    deferred.reject("Unable to save file");
                });
            }, function(err){
                deferred.reject("Unable to create directory!");
                $log.error(err);
            });
        }
        else {
            deferred.reject('Unsupported platform!')
        }

        return deferred.promise;
    }

    // TO DO!
    function getImagesPaths(countryName){
        $cordovaFile.checkDir(fullDirectory, countryName + '/')
            .then(function (success) {
                $cordovaToast.showLongBottom(success);
            }, function (error) {
                $log.error(JSON.stringify(error));
                $cordovaToast.showLongBottom(error);
            });
    }

    return {
        addImage: saveImageFile,
        getImagesPaths: getImagesPaths
    };
});