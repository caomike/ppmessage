/**
 * Prepare info for each page when init
 */
( function() {

    yvLogin.$inject = [ 'yvUser', 'yvAjax' ];
    function yvLogin( yvUser, yvAjax ) {

        var ERROR_CODE = { OK: 0, STATUS_ILLEGAL: 1 };

        return {
            ERROR_CODE: ERROR_CODE,
            
            prepare: prepare
        }

        // @param config
        // {
        //     expect_status: 'OWNER_1'/'OWNER_2'..., default is 'OWNER_2'
        // }
        function prepare( config, callback ) {

            var c = angular.extend( { expect_status: 'OWNER_2' }, config );
            
            if ( yvUser.get_status() != c.expect_status ) {
                onResponse( ERROR_CODE.STATUS_ILLEGAL );
                return;
            }

            if( !yvUser.get_team() ) {
                var _get = yvAjax.get_app_owned_by_user( yvUser.get_uuid() );
                _get.success( function(data) {
                    yvUser.set_team( data.app );
                } );
            } else {
                onResponse( ERROR_CODE.OK );
            }

            function onResponse( errorCode ) {
                if ( callback ) callback( errorCode );
            }
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvLogin", yvLogin );

    
} ) ();
