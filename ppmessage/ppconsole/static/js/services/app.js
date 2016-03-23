/**
 *
 * [app1, app2, ...]
 *   | 
 *   |
 * `user_uuid`
 *   |
 *   |
 * yvAjax.get_user_detail
 *   |
 *   |
 * `yvUser.set_login_data`
 *
 */
( function() {

    yvAppService.$inject = [ 'yvDebug', 'yvAjax', 'yvUser', '$cookies', '$rootScope', 'yvConstants', 'yvLoginedUser' ]
    function yvAppService( yvDebug, yvAjax, yvUser, $cookieStore, $rootScope, yvConstants, yvLoginedUser ) {

        var apps = [],

            appUserMap = {
                //
                // user_uuid: {
                //     user_response: `response` which get from `yvAjax.get_user_detail`
                // },
                //
                // ...
            };

        return {
            getApps: asyncGetApps,
            selectApp: selectApp,
            activeApp: activeApp,

            clear: clear
        }

        // ==============

        function asyncGetApps( callback ) {
            if ( !yvLoginedUser.get() ||
                 !yvLoginedUser.isAdminUser() ) {
                if (callback) callback( [] );
                return;
            }

            if ( apps && apps.length > 0 ) {
                if (callback) callback( apps );
                return;
            }

            yvAjax.get_all_apps( {
                user_uuid: yvLoginedUser.userUUID()
            })
                .success( function( r ) {                    
                    if ( r.error_code === 0 ) {
                        
                        var teams = r.app;
                        angular.forEach( teams, function( value, index ) { // assign `is_selected` to each app
                            value.is_selected = yvLoginedUser.userUUID() === value.user_uuid;
                        } );
                        apps = teams;
                        
                        if (callback) callback( teams );
                        
                    } else {
                        if (callback) callback( [] );
                    }
                } )
                .error( function( e ) {
                    if (callback) callback( [] );
                } );
        }

        function selectApp( app, succCB, errorCB ) {

            angular.forEach( apps, function( value, index ) {
                value.is_selected = value.uuid === app.uuid;
            } );

            if ( appUserMap[ app.user_uuid ] ) {

                var cachedUserInfo = appUserMap[ app.user_uuid ];
                _updateUser( cachedUserInfo.user_response );
                if (succCB) succCB();
                
            } else {
                
                yvAjax.get_{WEB_ROLE}_detail_with_password( app.user_uuid )
                    .success( function( response ) {
                        if ( response.error_code === 0 ) {

                            _updateUser( response );
                            var cacheUser = {
                                user_response: response
                            };
                            appUserMap[ response.uuid ] = cacheUser;                                        
                            
                            if (succCB) succCB();
                            
                        } else {
                            if (errorCB) errorCB( response );
                        }
                    } )
                    .error( function( error ) {
                        if (errorCB) errorCB( error );
                    } );
            }
            
        }

        function activeApp() {
            var activeApp;
            angular.forEach( apps, function( value, index ) {
                if ( value.is_selected ) {
                    activeApp = value;
                }
            } );
            return activeApp;
        }

        function clear() {
            apps = [];            
        }

        function _updateUser( userResponse ) {
            yvUser.set_login_data( userResponse );
            yvUser.set_team( null );
        }
        
    }

    angular.module( "this_app.services" ).factory( "yvAppService", yvAppService );
    
}() )
