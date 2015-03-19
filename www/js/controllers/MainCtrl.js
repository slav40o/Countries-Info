/**
 * Created by Slavi on 3/2/2015.
 */

app.controller('MainCtrl',function($scope, $log, $timeout, $ionicScrollDelegate, $ionicLoading, $cordovaToast,
                                   imagesService, localStorageService, fileService){
    'use strict';

    var deviceInformation = ionic.Platform.device(),
        isRealPageNumberFound = false;

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
            $log.error('MainCtrl: Error occured whie loading images! ' + error);

            if(Object.keys(deviceInformation).length == 0){
                // TO DO: show eventually toast on web
            }
            else{
                $cordovaToast.showLongBottom('Error occurred while loading images!');
                $scope.startPage = 1;
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

    $scope.savePhoto = function(index){
        var photo = $scope.photos[index];
        var imageData = {
            title: photo.photo_title,
            url: photo.photo_file_url.replace('&size=medium&', '&size=large&')
        };
        if(Object.keys(deviceInformation).length > 0){
            $cordovaToast.showLongBottom('Saving image...');
            fileService.addImage($scope.country, imageData).then(function(){
                $cordovaToast.showLongBottom('Image saved!');
            }, function(err){
                $cordovaToast.showLongBottom('Image NOT saved!');
                $cordovaToast.showLongBottom(err);
            });
        }
        else {
            $log.debug('MainCtrl: Not a mobile device. Photo is not saved');
        }
    };

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
            if(!isRealPageNumberFound){
                $scope.pagesCount = Math.round(data.count / 20);
            }

            $scope.isServerWrong = !(data.has_more) && data.photos.length <= 0;
            $scope.photos = data.photos;
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