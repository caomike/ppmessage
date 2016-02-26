Service.$notifyAuth = (function() {

    var AUTH_TYPE = 'auth';

    //////// API ////////////
    return {
        get: authMessageDispatcher
    }

    function authMessageDispatcher ( $notifyService, authMsg ) {
        
        return {
            auth: auth,
            dispatch: onAuth
        }

        function auth () {
            
            var $api = Service.$api,
                $json = Service.$json,
                wsSettings = $notifyService.getWsSettings(),

                // auth params
                user_uuid = wsSettings.user_uuid,
                device_uuid = wsSettings.device_uuid,
                app_uuid = wsSettings.app_uuid,
                is_service_user = false,
                extra_data = {
                    title: document.title,
                    location: ( ( function() { // fetch `window.location`
                        var loc = {};
                        for (var i in location) {
                            if (location.hasOwnProperty(i) && (typeof location[i] == "string")) {
                                loc[i] = location[i];
                            }
                        }
                        return loc;
                    } )() )
                };

            // register webSocket
            $notifyService.write($json.stringify({
                type: AUTH_TYPE,
                app_uuid: app_uuid,
                user_uuid: user_uuid,
                device_uuid: device_uuid,
                extra_data: extra_data,
                is_service_user: is_service_user
            }));

        }

        function onAuth () {
            if ( !authMsg ) return;

            // auth success
            if ( authMsg.error_code === 0 || authMsg.code === 0 ) {

                var wsSettings = $notifyService.getWsSettings();
                
                // make me online
                Service.$user.online();

                // get unacked messages
                Service.$api.getUnackedMessages({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    user_uuid: wsSettings.user_uuid,
                    device_uuid: wsSettings.device_uuid
                }, function(response) {
                    
                    response.list && response.message && $.each(response.list, function(index, item) {
                        var rawData = response.message[item],
                            message = null;

                        if (rawData) {
                            message = Service.$json.parse(rawData);
                            message.pid = item;

                            // let message dispatch to `dispatch` this message
                            Service.$notifyMsg.get( $notifyService, message ).dispatch();
                        }
                        
                    });
                    
                });
                
            }
        }
        
    }
    
})();
