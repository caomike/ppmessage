Service.$hovercardWelcome = ( function() {

    var hovercardWelcome,

        welcomeText;

    ///////////API////////////////
    return {
        
        // async get hovercard welcome info
        asyncGet: asyncGet,
        
        // directly get app welcome info
        getWelcomeText: getWelcomeText
        
    }

    //////////Implentation////////

    /**
     * zh_cn
     * en_us
     * zh_tw
     */
    function _fixLanguage (language) {
        if (language) {
            language = language.toLowerCase();
            switch (language) {
            case 'zh-cn':
                return 'zh_cn';

            case 'en':
                return 'en_us';
            }
        }
        return 'en';
    }

    function buildWelcomeInfo (team, welcomeText, serviceUsers) {
        return {
            appTeamName: team,
            appWelcomeText: welcomeText,
            
            activeAdmins: (function() {
                
                var users = [];

                serviceUsers && $.each(serviceUsers, function(index, item) {

                    var userUUID = item.uuid,
                        userName = item.user_fullname,
                        userAvatar = Service.$tools.icon.get(item.user_icon),
                        isBrowserOnline = item.is_browser_online,
                        isMobileOnline = item.is_mobile_online,
                        isOnline = item.is_mobile_online || item.is_browser_online;
                    
                    // user not exist
                    if (!Service.$users.exist(userUUID)) {
                        
                        // Create and store a user
                        Service.$users.setUser(userUUID, Service.$users.createUser({
                            is_portal_user: false,
                            user_uuid: userUUID,
                            user_fullname: userName,
                            user_avatar: userAvatar,
                            is_browser_online: isBrowserOnline,
                            is_mobile_online: isMobileOnline,
                            is_online: isOnline
                        }));
                        
                    } else {
                        
                        // Update it
                        Service.$users.getUser(userUUID).update({
                            user_fullname: userName,
                            user_avatar: userAvatar,
                            is_online: isOnline
                        });
                    }
                    
                    users.push(Service.$users.getUser(userUUID).getInfo());
                });

                return users;
                
            })()
        };
    }

    function asyncGet ( callback ) {
        
        if ( hovercardWelcome !== undefined ) {
            $onResult ( hovercardWelcome, callback );
            return;
        }
        
        Service.$api.getWelcomeTeam( {
            language: _fixLanguage( Service.$language.getLanguage() )
        }, function(response) {

            // cache data
            hovercardWelcome = buildWelcomeInfo ( response.team, response.welcome, response.list );
            welcomeText = response.welcome;
            
            $onResult ( hovercardWelcome, callback );
        }, function(error) {
            $onResult ( null, callback);
        } );
        
    }

    function getWelcomeText () {
        return welcomeText;
    }
    
} )();
