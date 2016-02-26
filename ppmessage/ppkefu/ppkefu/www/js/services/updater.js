ppmessageModule.factory("yvUpdater", [
    "yvSys",
    "yvAPI",
    "yvLocal",
    "yvAlert",
    "yvConstants",
function (yvSys, yvAPI, yvLocal, yvAlert, yvConstants) {

    var local_version = null;
    var electron_app = null;

    if (yvSys.in_electron()) {
        electron_app = require("remote").require("app");
    }
    
    _get_local_version(function (version) {
        local_version = version;
    });

    
    function _download_update(data) {
        if (yvSys.in_android_app() && data.download_url) {
            window.open(data.download_url, "_system");
            return;
        }
        
        if (yvSys.in_electron() && data.download_url) {
            var a = document.createElement("a");
            a.href = data.download_url;
            a.click();
            return;
        }
        
        if (yvSys.in_ios_app() && data.plist_url){
            var a = document.createElement("a");
            a.href = data.plist_url;
            a.click();
            return;
        }
    }
    
    
    function _confirm_update(data) {
        var title = yvLocal.translate("app.GLOBAL.UPDATE_TITLE");
        var content = yvLocal.translate("app.GLOBAL.UPDATE_CONTENT1") + local_version +
            yvLocal.translate("app.GLOBAL.UPDATE_CONTENT2") + data.newest_version + 
            yvLocal.translate("app.GLOBAL.UPDATE_CONTENT3");
        
        yvAlert.confirm(title, content, function () {
            _download_update(data);
        }, null);
    }


    function _version_is_better(_old, _new) {
        var _olda = _old.split("."), _newa = _new.split("."), len = _newa.length;

        for (var i = 0; i < len; i++) {
            if (!_olda[i]) {
                return true;
            }
            if (parseInt(_newa[i]) > parseInt(_olda[i])) {
                return true;
            }
        }
        return false;
    }
    
    
    function _get_local_version(callback) {
        if (yvSys.in_mobile_app()) { 
            window.cordova.getAppVersion(function (version) {
                callback && callback(version);
            });
            return;
        }
        if (yvSys.in_electron()) {
            callback && callback(electron_app.getVersion());
            return;
        }
    }

    
    function _get_api_args () {
        var args = {};
        var P = yvConstants.PLATFORM;
        
        if (yvSys.in_mobile_app()) {
            args.app_platform = yvSys.get_device_platform();
            args.app_distinct_name = yvSys.get_bundle_info().id;
            return args;
        }
        
        if (yvSys.in_electron()) {
            var package_name = electron_app.getName();
            var platform = yvSys.get_device_platform();
            
            if (platform === P.MAC) {
                args.app_distinct_name = package_name + ".dmg";
            } else if (platform === P.WIN32 || platform === P.WIN64) {
                args.app_distinct_name = [package_name, platform.toLowerCase(), "setup.exe"].join("-");
            }
            
            args.app_platform = platform;
            return args;
        }
        
        return args;
    }
    
    
    function _check_version(outdated_callback, updated_callback, error_callback) {
        if (!yvSys.in_mobile_app() && !yvSys.in_electron()) {
            return;
        }
        
        yvAPI.get_app_version(_get_api_args(), function (res) {
            var data = {
                newest_version: res.app_version_name,
                download_url: res.app_file_url,
                plist_url: res.app_plist_url
            };
            
            if (_version_is_better(local_version, data.newest_version)) {
                outdated_callback && outdated_callback(data);
            } else {
                updated_callback && updated_callback(data);
            }
        }, error_callback, error_callback);
    }
    
    
    return {
        confirm_update: function (data) {
            _confirm_update(data);
        },

        check_version: function (outdated_callback, updatedated_callback, error_callback) {
            _check_version(outdated_callback, updatedated_callback, error_callback);
        },
        
        check_update: function () {
            _check_version(_confirm_update, null);
        },
        
        download_update: function (data) {
            _download_update(data);
        },

        current_version: function () {
            return local_version;
        }
    };
    
}]);
