/**
 * 当用户信息改变的时候(通常指：user_fullname 或者 user_icon)，`$users`服务会publish一个`user/infochange/xxx-xxx-xxx(user_uuid)`事件.
 *
 * 所以如果想在某用户(如：user_uuid:xxx)信息改变的时候doSomething，应该subscribe一个topic:
 * Service.$pubsub.subscribe('user/infochange/xxx', function(topics, user) {
 *     // do something with new user info
 * });
 *
 * 当用户状态改变的时候，offline->online or online->offline, `$users` will publish a `use/infochange/state/xxx-xxx(user_uuid)` topic.
 *
 */
((function(Service) {

    var users = (function() {

        // Store users
        var usersStore = {};
        
        // User Class
        function User(options) {

            // user body
            var user = $.extend({}, User.DEFAULTS, options),

                // does user info (icon or name) has changed ?
                isUserInfoChanged = function(options) {
                    if (!options.user_uuid) return false;
                    
                    // fullname changed or user_avatar changed
                    return (options.user_fullname && options.user_fullname != user.user_fullname) ||
                        (options.user_avatar && options.user_avatar != user.user_avatar);
                },

                // online or offline state changed
                isUserStateChanged = function(options) {
                    if (!options.user_uuid) return false;

                    return options.is_online !== user.is_online;
                };

            // Return user's info
            this.getInfo = function() {
                return user;
            };

            // Update user's info
            this.update = function(options) {
                if (!options.user_uuid) return this;

                // user info changed , publish change event
                // NOTE: 1. MUST first check (`isUserInfoChanged`) is user info changed
                // 2. then update it (`$.extend`)
                var changed = isUserInfoChanged(options),
                    stateChanged = isUserStateChanged(options);
                    
                // update it
                user = $.extend({}, user, options);

                if (changed) {
                    Service.$pubsub.publish('user/infochange/' + user.user_uuid, this);
                }
                
                if (stateChanged) {
                    Service.$pubsub.publish('user/infochange/state/' + user.user_uuid, this);
                }

                return this;
            };
            
        }

        // Default user info options
        // No user_uuid, No device_uuid
        User.DEFAULTS = {
            is_portal_user: false,
            is_anonymous: true,
            ppcom_trace_uuid: null,
            user_fullname: Service.Constants.USER_DEFAULT_NAME,
            user_avatar: Service.Constants.ICON_DEFAULT_USER,
            user_uuid: "",
            device_uuid: "",
            user_signature: '',
            is_browser_online: false,
            is_mobile_online: false,
            is_online: false
        };

        // Create a user with user options
        function createUser(options) {
            return new User(options);
        }

        // Get a user
        function getUser(userUUID) {
            return usersStore[userUUID];
        }

        // Set a user
        function setUser(userUUID, user) {
            if (!userUUID || !user) return;

            usersStore[userUUID] = user;
        }

        // Clear all user's info
        function clearUsers() {
            usersStore = {};
        }

        // Test is a user exist 
        function isUserExist(userUUID) {
            if (!userUUID) return false;
            
            return usersStore[userUUID] !== undefined;
        }

        // Async get user
        function asyncGetUser(options, completeCB) {
            // user exist
            if (isUserExist(options.user_uuid)) {
                updateUser(options);
                if (completeCB) completeCB(getUser(options.user_uuid));
                return;
            }

            // 获取用户信息最主要的原因是需要获取 name 和 avatar, 如果已经有了，那么直接返回
            // 通常这种情况出现在 收到消息的时候，因为消息体本身带有 `from_user` json body
            if (options.user_uuid &&
                options.user_fullname &&
                options.user_avatar) {

                var user = createUser(options);
                setUser(options.user_uuid, user);

                if (completeCB) completeCB(user);
                return;
            }

            // 获取历史消息时候，没有 user_fullname 和 user_avatar
            // Call getUserDetailInfo to get it's detail info
            Service.$api.getUserDetailInfo({
                user_uuid: options.user_uuid
            }, function(response) {

                // Merge options info to response options
                var info = $.extend({}, {
                    user_email: response.email,
                    user_fullname: response.fullname ? response.fullname : Service.Constants.USER_DEFAULT_NAME,
                    user_uuid: response.uuid,
                    user_avatar: response.icon ? Service.$tools.getFileDownloadUrl(response.icon) : Service.Constants.ICON_DEFAULT_USER
                }, options);
                
                var user = createUser(info);

                // Cache it
                setUser(options.user_uuid, user);

                if (completeCB) completeCB(user);
            }, function(error) {
                // Get user failed
                if (completeCB) completeCB(null);
            });    
        }

        // Get all users
        function getUsers() {
            return usersStore;
        }

        // Update user info
        function updateUser(options) {
            if (!options) return;
            if (!options.user_uuid) return;
            if (!isUserExist(options.user_uuid)) return;

            getUser(options.user_uuid).update(options);
        }

        function adapter ( options ) {
            if ( !options ) return;

            var userUUID = options.uuid || options.user_uuid,
                userAvatar = Service.$tools.icon.get( options.user_icon || options.icon || options.user_avatar ),
                userName = options.user_fullname,
                userOnline = ( options.is_mobile_online || options.is_browser_online ),
                userBrowserOnline = options.is_browser_online,
                userMobileOnline = options.is_mobile_online,
                // ( options.user_signature === null ) => true
                // ( typeof null === 'object' ) => true
                userSignature = options.user_signature ? options.user_signature : '';

            return {
                user_uuid: userUUID,
                user_fullname: userName,
                user_avatar: userAvatar,
                user_signature: userSignature,
                is_online: userOnline,
                is_browser_online: userBrowserOnline,
                is_mobile_online: userMobileOnline
            };

        }

        function getOrCreateUser ( options ) {
            if ( !options || !options.user_uuid ) return;

            var user_uuid = options.user_uuid;
            
            if ( isUserExist( user_uuid ) ) {
                return getUser( user_uuid ).update( options );
            } else {
                setUser( user_uuid, createUser( options ) );
                return getUser( user_uuid );
            }
        }

        return {
            createUser: createUser,
            
            // get user
            getUser: getUser,
            getOrCreateUser: getOrCreateUser,
            asyncGetUser: asyncGetUser,
            getUsers: getUsers,

            // set user
            setUser: setUser,

            // update user
            updateUser: updateUser,

            // user adapter
            adapter: adapter,
            
            clear: clearUsers,
            exist: isUserExist
        }
        
    })();

    Service.$users = users;
    
})(Service));
