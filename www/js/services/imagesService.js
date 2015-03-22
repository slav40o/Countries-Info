app.factory('imagesService', function($http, $q, $log, deviceService){
    var baseUrl = "http://www.panoramio.com/map/get_panoramas.php?set=public&from={0}&to={1}&minx={2}&miny={3}&maxx={4}&maxy={5}&size={6}&mapfilter=true";
    
    /*
        {
            startLat: 
            startLong:
            endLat:
            endLong:
            from:
            to:
        }
    */
    function getImages(opt){
        var defered = $q.defer(),
            size = deviceService.getSettings().hqPictures ? 'original' : 'medium';
            url = baseUrl.format(opt.from, opt.to, opt.startLat, opt.startLong, opt.endLat, opt.endLong, size);
        $http.get(url)
            .success(function(data){
                $log.debug('ImagesService: Images from {0} to {1} loaded'.format(opt.from, opt.to));
                $log.info(data);
                defered.resolve(data);
            })
            .error(function(error){
                defered.reject(error);
            });
        
        return defered.promise;
    }

    return {
        getAll: getImages
    };
});