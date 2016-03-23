/**
 * Prepare info for each page when init
 *
 * - For each page, on `_init` method, you should call `yvLogin.prepare` to prepare `active user` and `active user_team` info
 *
 * ```javascript
 * yvLogin.prepare( function() { // prepare ok ... }, { $scope: $scope, onRefresh: function() { // refresh page ... } } );
 * ```
 * 
 * - Difference between `activeUser` and `yvLoginedUser`. 
 *
 *   for `Non-Admin` user, `yvLoginedUser` is equal to `yvActiveUser`; 
 *
 *   for `Admin` user, `yvLoginedUser` is `Admin User`, and `yvActiveUser` is current active user which associated with current
 *   selected app. if you pass `{ $scope: xxx, onRefresh: xxx }` param in `yvLogin.prepare` method, then `yvLogin` will try to 
 *   bind `$destroy` and `yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE` event to `$scope`, when a new app is selected, then you 
 *   will receive a notify callback to let you `refresh page`;
 * 
 * ----------------------------------------------------
 * |                               ( yvLoginedUser )  | <= `website header`
 * ----------------------------------------------------
 * |                                                  | 
 * |                                                  |
 * |                                                  |
 * |           ( activeUser: yvUser )                 | <= `website content`
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * ----------------------------------------------------
 *
 */
( function() {

    yvLogin.$inject = [ 'yvUser', 'yvAjax', 'yvDebug', 'yvAppService', 'yvConstants', 'yvLoginedUser',
                        '$rootScope', "$state", "$timeout", "$cookies" ];
    function yvLogin( yvUser, yvAjax, yvDebug, yvAppService, yvConstants, yvLoginedUser, $rootScope, $state, $timeout, $cookieStore ) {

        var ERROR_CODE = { OK: 0, STATUS_ILLEGAL: 1, LOGIN_ERROR: 2 },

            STATUS = {
                OWNER_0: 1 << 0,
                OWNER_1: 1 << 1,
                OWNER_2: 1 << 2,
                ADMIN: 1 << 3
            },

            activeUser;
        
        return {
            
            ERROR_CODE: ERROR_CODE,
            STATUS: STATUS,
            
            prepare: prepare,
            updateLoginedUser: updateLoginedUser,
            updateActiveUser: updateActiveUser,
            check_logined: check_logined,
            checkActiveUser: checkActiveUser,
            checkLoginedUser: checkLoginedUser,

            getLoginedUser: getLoginedUser,
            isLogined: isLogined,
            setLogined: setLogined,
            logout: logout,

            updateActiveUserCookieKey: updateActiveUserCookieKey,
            updateLoginedUserCookieKey: updateLoginedUserCookieKey
            
        }

        function prepare( callback, config ) {
            
            if ( config &&
                 config.$scope &&
                 config.onRefresh ) {
                
                var scope = config.$scope,
                    offListenerToken = scope.$on( yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE, function() {
                        _tryFetchAppTeam( function( errorCode ) {
                            if ( errorCode === ERROR_CODE.OK ) {
                                yvDebug.d( '===event:refreshpage===' );
                                config.onRefresh();
                            }
                        } );
                    } );

                scope.$on( '$destroy', function() {
                    yvDebug.d( '===destroy===' );
                    if ( offListenerToken ) offListenerToken();
                } );
                
            }
            
            checkActiveUser( function() {
                _tryFetchAppTeam( function( errorCode ) {

                    if ( errorCode === ERROR_CODE.OK ) {
                        checkLoginedUser();
                    }
                    if ( callback ) callback( errorCode );
                    
                } , config && config.expectedStatus );
            } );
        }

        function updateLoginedUser( user ) {
            yvLoginedUser.update( user );
            yvDebug.d( '===logined user===', user );
        }

        function updateActiveUser( user ) {
            yvUser.set_login_data( user );
            activeUser = user;
            yvDebug.d( '===active user===', user );
        }

        function updateActiveUserCookieKey( userUUID ) {
            $cookieStore.put(yvConstants.COOKIE_KEY.ACTIVE_USER_UUID, userUUID);
        }

        function updateLoginedUserCookieKey( userUUID, accessToken ) {
            $cookieStore.put(yvConstants.COOKIE_KEY.ACCESS_TOKEN, accessToken); // store access_token
            $cookieStore.put(yvConstants.COOKIE_KEY.LOGINED_USER_UUID, userUUID);
        }

        function getLoginedUser() {
            return yvLoginedUser.get();
        }

        function isLogined() {
            return yvLoginedUser.isLogined();
        }

        function setLogined( l ) {

            yvLoginedUser.setLogined( l );

            if ( l ) {
                var broadcastObj = {
                    isAdmin: yvLoginedUser.isAdminUser()
                };
                $rootScope.$emit( yvConstants.BROADCAST_EVENT_KEY.LOGIN_FINISHED, broadcastObj );
                yvDebug.d( '===event:login finished===' );
            }
                
        }

        function logout() {
            
            yvLoginedUser.logout();
            activeUser = null;
            yvUser.logout();

            $cookieStore.remove( yvConstants.COOKIE_KEY.LOGINED_USER_UUID );
            $cookieStore.remove( yvConstants.COOKIE_KEY.ACTIVE_USER_UUID );
            $cookieStore.remove( yvConstants.COOKIE_KEY.ACCESS_TOKEN );
            
        }

        function checkActiveUser( logined, unlogined, state ) {
            if ( activeUser ) {
                if ( logined ) logined( activeUser );
                return;
            }
            
            _makeSureUserInfoPreparedOK( yvConstants.COOKIE_KEY.ACTIVE_USER_UUID, function( data ) {
                updateActiveUser( data );
                _tryFetchAppTeam( logined );
            } , unlogined, state );            
        }

        function checkLoginedUser( logined, unlogined, state ) {
            check_logined( logined, unlogined, state );
        }

        function check_logined( logined, unlogined, state ) {
            if ( yvLoginedUser.get() ) {
                if ( logined ) logined( yvLoginedUser.get() );
                return;
            }
            
            _makeSureUserInfoPreparedOK( yvConstants.COOKIE_KEY.LOGINED_USER_UUID, function( data ) {

                updateLoginedUser( data );
                setLogined( true );
                
                if ( logined ) logined( data );
            }, function() {

                setLogined( false );
                
                if ( unlogined ) unlogined();
            }, state );
        }

        function _makeSureUserInfoPreparedOK( cookieKey, succCB, errorCB, state ) {
            var _user_uuid = $cookieStore.get( cookieKey );
            if ( !_user_uuid ) {
                if ( errorCB ) {
                    errorCB();
                    return;
                }
                if (state) {
                    $timeout(function() {
                        $state.go(state);
                    });
                }
                return;
            }

            _user_uuid = _user_uuid.replace(/\"/g, "");
            var _loggedin = yvAjax.get_{WEB_ROLE}_detail_with_password(_user_uuid);

            var _error = function() {
                $timeout(function() {
                    if ( errorCB ) {
                        errorCB();
                    } else {
                        if (state) {
                            $timeout(function() {
                                $state.go(state);
                            });
                        }
                    }
                });
            };
            
            _loggedin.success(function(data) {
                if (data.error_code == 0) {
                    $timeout(function() {
                        if ( succCB ) succCB( data );
                    });
                } else {
                    if ( errorCB ) errorCB();
                }
                return;
            });

            _loggedin.error(function(data) {
                if ( errorCB ) errorCB();
            });
        }

        function _tryReselectApp( callback, expectedStatus ) {
            var activeApp = yvAppService.activeApp();
            if ( activeApp ) {
                yvAppService.selectApp( activeApp, function( selectSuccResponse ) {
                    _tryFetchAppTeam( callback, expectedStatus );
                }, function( selectErrorResponse ) {
                    if ( callback ) callback ( ERROR_CODE.LOGIN_ERROR );
                } );
            }
        }

        function _tryFetchAppTeam( callback, expectedStatus ) {
            var avaliableStatus = STATUS.OWNER_2 | STATUS.ADMIN | STATUS.OWNER_1 ;
            
            if ( expectedStatus !== null &&
                 expectedStatus !== undefined &&
                 expectedStatus !== NaN ) {
                avaliableStatus = expectedStatus;
            }

            var status = STATUS[ yvUser.get_status() ];
            if ( status === undefined ||
                 ( status & avaliableStatus !== 1 ) ) {
                onResponse( ERROR_CODE.STATUS_ILLEGAL );
                return;
            }

            if( !yvUser.get_team() ) {
                var _get = yvAjax.get_app_owned_by_user( yvUser.get_uuid() );
                _get.success( function(data) {
                    yvUser.set_team( data.app );
                    onResponse( ERROR_CODE.OK );
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
