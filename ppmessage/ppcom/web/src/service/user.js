Service.$user = (function() {

    // web_site user
    var user_uuid = null;

    return {
        
        // Get website user info
        getUser: function() {
            if ( !user_uuid ) return null;
            
            return getUser( user_uuid );
        },
        
        // Set website user
        setUser: function(userInfo) {
            user_uuid = userInfo.user_uuid;
            Service.$users.setUser(user_uuid, Service.$users.createUser(userInfo));
        },
        
        // Make user offline
        offline: function() {
            if (!user_uuid) return;

            var userInfo = getUserInfo( user_uuid );
            
            userInfo && // user info is ok
            userInfo.device_uuid && // user device_uuid is also ok
            userInfo.is_online && // user really `online` now
            Service.$api.offline( {
                user_uuid: user_uuid,
                device_uuid: userInfo.device_uuid
            }, function ( response ) {
                
                if ( response && response.error_code === 0 ) {
                    // update user's local info
                    getUser( user_uuid ).update( {
                        user_uuid: user_uuid,
                        is_online: false
                    } );
                }
                
            } );

        },

        online: function() {
            if ( !user_uuid ) return;

            var userInfo = getUserInfo( user_uuid );
            userInfo &&
                userInfo.device_uuid &&
                ( !userInfo.is_online ) &&
                Service.$api.online( {
                    user_uuid: user_uuid,
                    device_uuid: userInfo.device_uuid
                }, function ( response ) {
                    if ( response && response.error_code === 0 ) {
                        getUser( user_uuid ).update( {
                            user_uuid: user_uuid,
                            is_online: true
                        } );
                    }
                } );
        },

        // Clear user
        clear: function() {
            user_uuid = null;
        },

        // quick get current user's id
        quickId: function() {
            return user_uuid;
        }
    }

    //////// Implentation /////////

    function getUser ( userId ) {
        if ( !userId ) return;

        return Service.$users.getUser( userId );
    }

    function getUserInfo ( userId ) {
        if ( !userId ) return;

        var user = getUser( userId ),
            userInfo = user && user.getInfo();

        return userInfo;
    }

    function isOnline ( userId ) {

        var userInfo = getUserInfo( userId );

        if ( userInfo ) {
            return userInfo.is_online;
        }

        return false;
        
    }
    
}());
