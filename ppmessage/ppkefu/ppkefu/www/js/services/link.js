ppmessageModule.factory("yvLink", [
    "$window",
    "yvAPI",
    "yvSys",
    "yvUser",
    "yvMime",
    "yvFile",
    "yvLocal",
    "yvConstants",
function ($window, yvAPI, yvSys, yvUser, yvMime, yvFile, yvLocal, yvConstants) {

    return {
        default_user_icon: function () {
            return "img/default_user.png";
        },

        default_image_pic: function () {
            return "img/default_pic.png";
        },

        default_card_cover: function () {
            return "img/default_card_cover.png";
        },

        current_user_avatar: function () {
            var icon = yvUser.get("icon");
            return this.get_user_icon(icon);
        },
        
        get_user_icon: function (_icon) {
            if (_icon && _icon.indexOf("http") === 0) {
                return _icon;
            }
            
            var _img = null;
            if (_icon) {
                if (yvSys.in_mobile_app()) {
                    _img = yvFile.get_root_dir() + _icon;
                } else {
                    _img = yvAPI.get_icon_url(_icon);
                }
            }
            if (_img === null) {
                _img = this.default_user_icon();
            }
            return _img;
        },

        get_real_icon: function (_icon, _cb) {
            if (!_icon) {
                return _cb(null);
            }
            if (!yvSys.in_mobile_app()) {
                return _cb(_icon);
            }            
            yvAPI.download_file(_icon, null, function (file) {
                _cb(file.name);
            }, function () {
                _cb(null);
            });
        },
        
        get_message_image: function (_message) {
            if (_message.file instanceof $window.File) {
                return _message.file;
            }

            var file = _message.file || _message.thumbnail;

            if (!file) {
                return this.default_image_pic();                
            }            

            if (yvSys.in_mobile_app()) {
                if (file.indexOf("file://") === 0) {
                    return file;
                }
                return yvFile.get_root_dir() + file;
            }
            
            return yvAPI.get_image_url(file, yvMime.mime_ext(_message.mime));
        },

        get_message_location_image: function (_message) {
            if (yvSys.in_mobile_app()) {
                if (_message.file) {
                    return yvFile.get_root_dir() + _message.file;
                }
            } else {
                if (_message.file) {
                    return _message.file;
                }
            }
            return this.default_image_pic();
        },

        get_card_cover: function (card) {
            if (yvSys.in_mobile_app()) {
                if (card && card.cover_local_file) {
                    return yvFile.get_root_dir() + card.cover_local_file;
                }
            } else {
                if (card && card.cover_server_uuid) {
                    return yvAPI.get_image_url(card.cover_server_uuid, "png");
                }
            }
            return this.default_card_cover();
        },

        open_link: function (event, cb) {
            // prevent opening link by default
            event.preventDefault();
            var href = event.target.href,
                options = "location=yes,closebuttoncaption=" + yvLocal.translate("app.GLOBAL.CLOSE");

            if (!href) {
                if (cb) { cb(); }
                return;
            }
            if (yvSys.in_mobile_app()) {
                window.open(href, "_blank", options);
                return;
            }
            window.open(href, "_blank");
        }
    };
}]);
