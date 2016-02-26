(function() {

    yvCallbackService.$inject = [];
    function yvCallbackService() {
        
        return {
            response: onResponse,
            success: onSuccess,
            error: onError
        }

        function onResponse( r, successCallback, errorCallback ) {
            if ( r && r.error_code === 0 ) {
                onSuccess( r, successCallback );
            } else {
                onError( r, errorCallback );
            }
        }

        function onSuccess( r, successCallback ) {
            successCallback && successCallback( r );
        }

        function onError( e, errorCallback ) {
            errorCallback && errorCallback( e );
        }
        
    }

    angular.module("this_app.services").factory( "yvCallbackService", yvCallbackService );

} )();
