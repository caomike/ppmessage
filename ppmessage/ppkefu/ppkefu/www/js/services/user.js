ppmessageModule.factory('yvUser', [
    "yvSys",
    "yvConstants",
function (yvSys, yvConstants) {
    var user = {
        id: null,
        icon: null,
        name: null,
        uuid: null,
        email: null,
        fullname: null,
        signature: null,
        device_uuid: null,
        updatetime: null,
        is_online: false,
        access_token: null,
        
        app: {
            uuid: "",
            app_key: "",
            app_name: "",
            app_secret: ""
        },
        
        show_badge: null,
        mute_notification: null,
        is_distributor_user: null,
        silence_notification: null,
        mute_other_mobile_device: null
    };

    // update user from API return
    function _update_user_from_login(data) {
        user.app = data.app;
        user.uuid = data.uuid;
        user.icon = data.user_icon;
        user.name = data.user_name;
        user.email = data.user_email;
        user.fullname = data.user_fullname;
        user.signature = data.user_signature;
        user.updatetime = data.updatetime;
        user.is_online = true;
        
        if (yvSys.in_mobile_app()) {
            user.device_uuid = data.mobile_device_uuid;
        } else {
            user.device_uuid = data.browser_device_uuid;
        }

        user.show_badge = !!data.user_show_badge;
        user.is_distributor_user = !!data.is_distributor_user;
        user.mute_notification = !!data.user_mute_notification;
        user.silence_notification = !!data.user_silence_notification;
        user.mute_other_mobile_device = !!data.user_mute_other_mobile_device;
        
        return user;
    }

    function _update_user_from_db(item) {
        user.id = item.id;
        user.uuid = item.user_uuid;
        user.is_online = !!item.is_online;
        user.device_uuid = item.device_uuid;
        user.access_token = item.access_token;
        
        user.app = {
            uuid: item.app_uuid,
            app_key: item.app_key,
            app_name: item.app_name,
            app_secret: item.app_secret
        };

        user.show_badge = !!item.show_badge;
        user.is_distributor_user = !!item.is_distributor_user;
        user.mute_notification = !!item.mute_notification;
        user.silence_notification = !!item.silence_notification;

        return user;
    }
    
    return {
        update_user_from_login: function (_user) {
            return _update_user_from_login(_user);
        },

        update_user_from_db: function (item) {
            return _update_user_from_db(item);
        },

        set: function (attribute, value) {
            if (user.hasOwnProperty(attribute)) {
                user[attribute] = value;
            }
        },

        mset: function (data) {
            angular.forEach(data, function (value, key) {
                if (user.hasOwnProperty(key)) {
                    user[key] = value;
                }
            });
        },

        get: function (attribute) {
            if (arguments.length === 0) {
                return user;
            }
            if (user.hasOwnProperty(attribute)) {
                return user[attribute];
            }
            return null;
        },
    };
}]);
