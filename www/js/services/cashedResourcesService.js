/**
 * Created by Slavi on 3/7/2015.
 */
app.factory('cashedResourcesService', function($http, $log){
    'use strict';
    
    var countries = {},
        countriesList = new Array(300),
        flags = {};

    function getFlag(alpha3Code){
        return flags[alpha3Code];
    }
    
    function addFlag(alpha3Code, flag){
        if(!(flags[alpha3Code])){
            flag[alpha3Code] = flag;
        }
    }
    
    function addCountry(country){
        if(!(countries[country.alpha3Code])){
            countries[country.alpha3Code] = country;
            countriesList.push(country);
            $log.debug('CashResS: ' + country.name + ' added');
        }
    }
    
    function addCountries(countriesArray){
        var i;
        for(i = 0; i < countriesArray.length; i += 1){
            addCountry(countriesArray[i]);
        }
    }
    
    function getCountryByAlpha3Code(alpha3Code){
        var country = countries[alpha3Code];
        $log.debug('CashResS: ' + country.name + ' fetched');
        return country;
    }
    
    function getCountryById(id){
        var country = countriesList[id];
        $log.debug('CashResS: ' + country.name + ' fetched');
        return country;
    }
    
    function getAllCountries(){
        $log.debug('CashResS: all countries fetched');
        return countriesList.slice();
    }
    
    function setCountries(countriesArray){
        var country, i;
        countriesList = new Array(300);
        countries = {};
        
        for(i = 0; i < countriesArray.length; i += 1){
            country = countriesArray[i];
            countriesList.push(country);
            countries[country.alpha3Code] = country;
        }
        
        $log.debug('CashResS: set new countries');
    }

    return {
        addCountry: addCountry,
        addCountries: addCountries,
        setCountries: setCountries,
        getCountryByAlpha3Code: getCountryByAlpha3Code,
        getCountryById: getCountryById,
        getAll: getAllCountries
    };
});