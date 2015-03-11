app.filter('countryName', function(cashedResourcesService) {
    return function(input) {
        return cashedResourcesService.getCountryByAlpha3Code(input).name;
   };
});