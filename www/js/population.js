app.filter('population', function() {
    return function(input) {
        var value = 'Nan';
        
        if(input < 1000){
            value = input;
        }
        else if(input < 1000000){
            value = Math.round(input / 1000) + ' thousand';
        }
        else{
            value = Math.round(input / 1000000) + ' million';
        }
        
        return value;
   };
});
