/**
 * Created by Slavi on 3/2/2015.
 */

app.controller('MainCtrl',function($scope, $log, $timeout, $ionicScrollDelegate, $ionicLoading, $cordovaToast,
                                   imagesService, localStorageService, fileService, deviceService){
    'use strict';

    // Often server shows wrong photos count. When user reaches the real last page this is set to true until next country reload
    var isRealPageNumberFound = false;

    $log.info('-----------device information/--------');
    $log.info('Platform ->' + deviceService.platform());
    $log.info('Mobile ->' + deviceService.isMobile());
    $log.info('Web ->' + deviceService.isWeb());
    $log.info('Height ->' + deviceService.height());
    $log.info('Width ->' + deviceService.width());
    $log.info('-----------/device information--------');

    /*
        Scope variables. They will be set in loadCountry function which is called on every appearence of the view
     */

    // Info about photos
    $scope.photos = [];

    // Used to show spinner while downloading image
    $scope.isSavingPhoto = false;

    // Shows if a home country is set. It has value false after firs launch until the first home country is set
    $scope.isHomeSet = false;

    // Shows from which page the photos will be fetched
    $scope.startPage = 1;

    // Full data ata about the home country
    $scope.country = {};

    // Current loaded page
    $scope.page = 0;

    // Shows if there is more photos that could be loaded
    $scope.hasMore = true;

    /*
        Event handler to check if there is a change in the home country
        on every appearing of the view
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
        Sets or adds 20 new images to the photos array.
    */
    $scope.loadImages = function(isReloading){
        var from, to;
        $ionicLoading.show();

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
            reloadData(data, isReloading);
        }, function(error){
            $ionicLoading.hide();
            $log.error('MainCtrl: Error occurred while loading images! ' + error);

            if(deviceService.isMobile()){
                $cordovaToast.showLongBottom('Error occurred while loading images!');
                $scope.startPage = 1;
            }
            else{
                // TO DO: show eventually toast on web
            }
        });
    };

    $scope.scrollToTop = function(){
        $ionicScrollDelegate.scrollTop(true);
    };

    $scope.scrollToBottom = function(){
        $ionicScrollDelegate.scrollBottom(true);
    };

    /*
        Checks if startPage is in right boundaries and loads images
        starting from the chosen page.
     */
    $scope.reloadImagesFromPage = function(){
        if(1 < $scope.startPage && $scope.startPage <= $scope.pagesCount){
            $scope.page = $scope.startPage - 1;
        }
        else if(1 == $scope.startPage){
            $scope.page = 0;
            $scope.startPage = 1;
        }
        else{
            // TO DO Show invalid page toast
            $scope.startPage = 1;
            return;
        }

        $scope.loadImages(true);
    };

    /*
        Saves photo to phone memory.Changes url depending on what quality user desire (medium or original - hq)
     */
    $scope.savePhoto = function(index){
        if(!(deviceService.getSettings().isSavingPhotoEnabled)){
            if(deviceService.isMobile()){
                $cordovaToast.showLongBottom('Saving images not enabled!');
            }
            else{
                alert('Saving not enabled!');
            }

            return;
        }

        $scope.isSavingPhoto = true;
        var photo = $scope.photos[index],
            url = getPhotoUrl(photo),
            imageData = {
                title: photo.photo_title,
                url: url
        };

        if(deviceService.isMobile()){
            $cordovaToast.showShortBottom('Saving image...');
            fileService.addImage($scope.country, imageData).then(function(){
                $cordovaToast.showShortBottom('Image saved!');
                $scope.isSavingPhoto = false;
            }, function(err){
                $cordovaToast.showShortBottom('Image NOT saved! ' + err);
                $log.error(JSON.stringify(err));
                $scope.isSavingPhoto = false;
            });
        }
        else {
            $log.debug('MainCtrl: Not a mobile device. Photo is not saved');
            $scope.isSavingPhoto = false;
            alert('Not a mobile device');
        }
    };

    function getPhotoUrl(photo){
        // "http://static.panoramio.com/photos/original/84458375.jpg"
        var photoSetting = deviceService.getSettings(),
            quality = photoSetting.hqPicturesSave ? 'original' : 'medium',
            id, startIndex, endIndex;
        startIndex = photo.photo_file_url.lastIndexOf('/') + 1;
        endIndex = photo.photo_file_url.lastIndexOf('.');
        id = photo.photo_file_url.substr(startIndex, endIndex - startIndex);
        return "http://static.panoramio.com/photos/{0}/{1}.jpg".format(quality, id);
    }

    /* 
        Resets a home country. Sets current $scope.page to 0 and loads images for it
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

        isRealPageNumberFound = false;


        $scope.isHomeSet = true;
        $scope.startPage = 1;
        $scope.country = country;
        $scope.page = 0;
        $scope.hasMore = true;
        $log.debug('MainCtrl: loading {0} as home country'.format(country.name));
        $scope.loadImages(true);
    }

    /*
        Reloads or loads 20 new images. Checks if server is returning the right amount of pages

     */
    function reloadData(data, isReloading){
        if(isReloading){
            // If last page is not found show the count based on server info(which is probably wrong)
            if(!isRealPageNumberFound){
                $scope.pagesCount = Math.round(data.count / 20);
            }

            // TO show error message to user when data is empty
            $scope.isServerWrong = !(data.has_more) && data.photos.length <= 0;
            $scope.photos = data.photos;

            // Wait enough so scroll could activate properly
            $timeout(function(){ $ionicScrollDelegate.scrollTop(true); });
        }
        else{
            $scope.photos = $scope.photos.concat(data.photos);
        }

        if(!(data.has_more)){
            $scope.pagesCount = $scope.page + 1;
            isRealPageNumberFound = true;
        }

        $log.debug("MainCtrl: page {0} loaded".format($scope.page));
        $scope.hasMore = data.has_more;
        $scope.page++;
        $ionicLoading.hide();
    }
});