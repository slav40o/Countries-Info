/**
 * Created by Slavi on 3/7/2015.
 */
app.factory('flagService', function($http, $q, $log){
    var baseUrl = "http://www.geonames.org/flags/x";


    // /bg.gif
    function getFlag(alpha2Code){
        var defered = $q.defer();
        
        $http.get(baseUrl + '/' + alpha2Code.toLowerCase() + '.gif')
            .success(function(data){
                $log.debug(data);
                defered.resolve(data);
            })
            .error(function(error){
                $log.error(error);
                defered.reject(error);
            });
        
        return defered.promise;
    }

    return {
        getByAlpha2Code: getFlag
        
    };
});