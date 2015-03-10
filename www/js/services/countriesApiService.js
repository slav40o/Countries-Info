/**
 * Created by Slavi on 3/7/2015.
 */
app.factory('countriesInfoService', function($http){
    var baseUrl = "http://restcountries.eu/rest/v1";
    
    // /all
    function getAll(){
        var defered = $q.defer();
        
        $http.get(baseUrl + '/all')
            .success(function(data){
                console.debug('All countries fetched');
                defered.resolve(data);
            })
            .error(function(error){
                console.error(error);
                defered.reject(error);
            });
        
        return defered.promise;
    }

    // /name/:subname
    function getBySubstring(subname){

    }

    // /alpha/co
    function getByCallcode(code){

    }

    // /lang/et    -   ISO 639-1 Language
    function getByLanguage(lang){

    }

    // /alpha?codes=co;rus;no
    function getByCodes(codes){

    }

    // /currency/eur
    function getByCurrency(curency){

    }

    // /capital/tallinn
    function getByCapitalCity(city){

    }

    // /region/africa
    function getByRegion(region){

    }

    // /subregion/western asia
    function getBySubregion(subregion){

    }

    // /name/aruba?fullText=true
    function getByFullName(name){

    }

    return {
        getAll: getAll
    };
});
