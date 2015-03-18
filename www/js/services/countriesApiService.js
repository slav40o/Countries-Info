/**
 * Created by Slavi on 3/7/2015.
 */
app.factory('countriesApiService', function($http, $q, $log){
    var baseUrl = "http://restcountries.eu/rest/v1";
    
    // /all
    function getAll(){
        var defered = $q.defer();
        
        $http.get(baseUrl + '/all')
            .success(function(data){
                $log.debug('All countries fetched');
                defered.resolve(data);
            })
            .error(function(error){
                $log.error(error);
                defered.reject(error);
            });
        
        return defered.promise;
    }

    //// /name/:subname
    //function getBySubstring(subname){
    //
    //}
    //
    //// /alpha/co
    //function getByCallcode(code){
    //
    //}
    //
    //// /lang/et    -   ISO 639-1 Language
    //function getByLanguage(lang){
    //
    //}
    //
    //// /alpha?codes=co;rus;no
    //function getByCodes(codes){
    //
    //}
    
    // alpha/bg
    function getByCode(code){
        var defered = $q.defer();
        
        $http.get(baseUrl + '/alpha/' + code)
            .success(function(data){
                defered.resolve(data);
            })
            .error(function(error){
                $log.error(error);
                defered.reject(error);
            });
        
        return defered.promise;
    }

    //// /currency/eur
    //function getByCurrency(curency){
    //
    //}
    //
    //// /capital/tallinn
    //function getByCapitalCity(city){
    //
    //}
    //
    //// /region/africa
    //function getByRegion(region){
    //
    //}
    //
    //// /subregion/western asia
    //function getBySubregion(subregion){
    //
    //}

    // /name/aruba?fullText=true
    function getByFullName(name){
        var defered = $q.defer();
        
        $http.get(baseUrl + '/name/' + name + '?fullText=true')
            .success(function(data){
                defered.resolve(data);
            })
            .error(function(error){
                $log.error(error);
                defered.reject(error);
            });
        
        return defered.promise;
    }

    return {
        getAll: getAll,
        getByName: getByFullName,
        getByCode: getByCode
    };
});