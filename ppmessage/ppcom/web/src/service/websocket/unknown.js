Service.$notifyUnknown = (function() {

    return {
        get: unknownHandler
    }

    function unknownHandler( $notifyService, msg ) {

        return {
            dispatch: dispatch
        }

        function dispatch() {
            Service.$debug.d( 'unknown msg : ', msg );
        }
        
    }
    
})();
