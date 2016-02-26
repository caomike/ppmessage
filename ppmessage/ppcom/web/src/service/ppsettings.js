((function() {

    var ppSettings = (function() {

        var settings = null,
            userSettings = null,

            ANONYMOUS_USER_COOKIE_KEY = 'pp-id',

            // Default settings
            DEFAULT = {

                app_uuid: null,
                api_key: null,
                api_secret: null,
                
                user_email: null,
                user_name: null,
                user_icon: null,

                language: 'zh-CN',

                view: {
                    launcher_bottom_margin: '20px',
                    launcher_right_margin: '20px',
                    launcher_is_show: true
                }
                
            },

            // Initialize pp settings
            init = function(options) {
                settings = $.extend({}, DEFAULT, options);
                settings.api_key = Configuration.api_key;
                settings.api_secret = Configuration.api_secret;
            },

            // Get user's settings
            getUserSettings = function() {
                if (settings == null) return null;
                if (userSettings != null) return userSettings;

                // is anonymous user
                var isAnonymousUser = settings.user_email ? false : true;

                // 保持键的名字与`$service.User.DEFAULT`相同，因为我们会使用`userSettings`来Create
                // `$service.User`
                userSettings = {

                    user_email: settings.user_email,
                    user_fullname: settings.user_name,
                    user_avatar: settings.user_icon,
                    user_uuid: null,
                    device_uuid: null,

                    is_portal_user: true,
                    is_anonymous: isAnonymousUser,
                    ppcom_trace_uuid: (function() {
                        
                        if (!isAnonymousUser) return null;

                        // get ppcom_trace_uuid
                        var id = Service.$cookies.get(ANONYMOUS_USER_COOKIE_KEY) || function() {
                            var uuid = Service.$tools.getUUID();
                            Service.$cookies.set(ANONYMOUS_USER_COOKIE_KEY, uuid, {
                                expires: 365 * 15 * 24 * 3600 //15 year, never delete it
                            });
                            return uuid;
                        }();

                        return id;
                        
                    })()
                    
                };

                return userSettings;
                
            },

            // update user settings
            updateUserSettings = function(options) {
                userSettings = $.extend(getUserSettings(), options);
            },

            // get language
            getLanguage = function() {
                return settings.language;
            },

            getAppUuid = function() {
                return settings.app_uuid;
            },

            getApiKey = function() {
                return settings.api_key;
            },

            getApiSecret = function() {
                return settings.api_secret;
            },

            // Clear state
            clear = function() {
                settings = null;
                userSettings = null;                
            }

        // api
        return {
            init: init,
            
            getUserSettings: getUserSettings,
            updateUserSettings: updateUserSettings,
            
            getLanguage: getLanguage,
            getAppUuid: getAppUuid,
            getApiKey: getApiKey,
            getApiSecret: getApiSecret,
            
            clear: clear
        }
        
    })();
    
    Service.$ppSettings = ppSettings;
    
})());
