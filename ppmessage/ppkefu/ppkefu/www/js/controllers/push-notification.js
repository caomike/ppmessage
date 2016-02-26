ppmessageModule.controller("PushNotificationCtrl", [
    "$scope",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvMain",
function ($scope, yvSys, yvAPI, yvUser, yvMain) {

    var user = yvUser.get();
    
    var item_badge = _item("show_badge");
    var item_mute_noti = _item("mute_notification");
    var item_distributor = _item("is_distributor_user");
    var item_silence_noti = _item("silence_notification");
    var item_mute_other = _item("mute_other_mobile_device");

    _init();
    
    function _init() {
        if (user.show_badge !== null) {
            return _init_settings();        
        }
        
        yvAPI.get_user_info(user.uuid, function (response) {
            user.show_badge = !!response.user_show_badge;
            user.is_distributor_user = !!reponse.is_distributor_user;
            user.mute_notification = !!response.user_mute_notification;
            user.silence_notification = !!response.user_silence_notification;
            user.mute_other_mobile_device = !!response.user_mute_other_mobile_device;
            _init_settings();
        });
    }

    
    function _init_settings() {
        // if (yvSys.in_android_app()) {
        //     $scope.settings = [item_distributor];
        //     return;
        // }

        if (yvSys.in_mobile_app()) {
            $scope.settings = [item_badge, item_mute_noti, item_silence_noti, item_distributor];
            return;
        }

        $scope.settings = [item_mute_other, item_distributor];
    }


    function _item(key) {
        return {
            key: key,
            value: user[key],
            on_change: _on_change,
            title: "app.GLOBAL." + key.toUpperCase(),
            note: "app.GLOBAL." + key.toUpperCase() + "_NOTE",
        }
    }
    

    function _on_change() {
        var key = this.key;
        var value = !!this.value;

        if (key === "mute_notification" && value == true) {
            item_silence_noti.value && (item_silence_noti.value = false);
            _update_user(item_silence_noti.key, false);
        }
        
        if (key === "silence_notification" && value == true) {
            item_mute_noti.value && (item_mute_noti.value = false);
            _update_user(item_mute_noti.key, false);
        }

        _update_user(key, value);
    }

    
    function _update_user(key, value) {
        var data = {};
                
        if (key === "is_distributor_user") {
            data[key] = value;
        } else {
            data["user_" + key] = value;
        }
        
        yvAPI.update_user(data, function () {
            yvMain.update_noti_settings(key, value);
        });
    }
}]);
