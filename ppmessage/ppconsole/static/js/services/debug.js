//////////// MAIN GOLE: HELP US TO DEBUG FROM CONSOLE ///////////////////////////
(function() {

    yvDebug.$inject = [ 'yvLog' ];
    function yvDebug( yvLog ) {

        var ON = true,

            api = {
                attach: attach,

                h: yvLog.h,
                d: yvLog.d,
                w: yvLog.w
            };
        
        return api;

        // attach `func` to `window` obj to help us to see the inner world of our app from `console`
        function attach( name, func ) {
            // `Function.name` is part of ES6
            if ( window !== undefined && ON && name !== undefined ) window [ name ] = func;
            return api;
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvDebug", yvDebug );

})();
