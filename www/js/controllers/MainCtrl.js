/**
 * Created by Slavi on 3/2/2015.
 */

app.controller('MainCtrl',function($scope, $log, $timeout, $ionicScrollDelegate, $ionicLoading, $cordovaToast, $cordovaFile, $cordovaFileTransfer, imagesService, localStorageService){
    'use strict';

    var deviceInformation = ionic.Platform.device();

    /*
        Event handler to check if there is a change in the home country
    */
    $scope.$on('$ionicView.beforeEnter', function() {
        var homeCountry = localStorageService.getObject('home');
        if($scope.country){
            if(homeCountry.name !== $scope.country.name){
                loadCountry(homeCountry);
            }
        }
        else if(homeCountry.name){
            loadCountry(homeCountry);
        }
        else{
            $scope.isHomeSet = false;
        }
    });

    /* 
        Loads 20 new images to the photos array. If the page is 0
        clears and photos array and sets the fisrt 20 images
    */
    $scope.loadMore = function(){
        var from, to;
        $ionicLoading.show();

        if(!($scope.hasMore)){
            $ionicLoading.hide();
            return;
        }

        from = $scope.page * 20;
        to = from + 20;
        imagesService.getAll({
            from: from,
            to: to,
            startLong: $scope.country.latlng[0] - $scope.delta,
            startLat: $scope.country.latlng[1] - $scope.delta,
            endLong: $scope.country.latlng[0] + $scope.delta,
            endLat: $scope.country.latlng[1] + $scope.delta
        }).then(function(data){
            if($scope.page == 0){
                $scope.photos = data.photos;
                $timeout(function(){ $ionicScrollDelegate.scrollTop(true); });
            }
            else{
                $scope.photos = $scope.photos.concat(data.photos);
            }

            $log.debug("MainCtrl: page {0} loaded".format($scope.page));
            $scope.hasMore = data.has_more;
            $scope.page++;
            $ionicLoading.hide();
        }, function(error){
            $ionicLoading.hide();
            $log.error('MainCtrl: Error occured whie loading images! ' + error);

            if(Object.keys(deviceInformation).length == 0){
                // TO DO: show eventually toast on web
            }
            else{
                $cordovaToast.showLongBottom('Error occured whie loading images!');
            }
        });
    };
    
    $scope.scrollToTop = function(){
        $ionicScrollDelegate.scrollTop(true);
    };
    
    $scope.scrollToBottom = function(){
        $ionicScrollDelegate.scrollBottom(true);
    };

    $scope.savePhoto = function(index){
        if(Object.keys(deviceInformation).length > 0){
            var photoUrl = $scope.photos[index].photo_file_url,
                targetPath = cordova.file.documentsDirectory + photoUrl,
                trustHosts = true,
                options = {};
            $log.debug('MainCtrl: {0} path selected for savin image'.format(photoUrl));
            $cordovaToast.showLongBottom(targetPath);
            $cordovaFileTransfer.download(photoUrl, targetPath, options, trustHosts)
                .then(function(result) {
                $log.debug(result);
            }, function(err) {
                $log.debug(err);
            }, function (progress) {
                $timeout(function () {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                })
            });
        }
        else {
            $log.debug('MainCtrl: No local directory found');
        }
    };

    /* 
        Resets a home country. Sets page count to 0 and reloads images
    */
    function loadCountry(country){
        var degreeLength = 111,
            countryLength = Math.sqrt(country.area),
            degreesDelta = countryLength / degreeLength;
        if(country.area < 10000){
            $scope.delta = 1;
        }else {
            $scope.delta = degreesDelta - (degreesDelta / 3);
        }

        $scope.isHomeSet = true;
        $scope.country = country;
        $scope.page = 0;
        $scope.hasMore = true;
        $log.debug('MainCtrl: loading {0} as home country'.format(country.name));
        $scope.loadMore();
    }

});