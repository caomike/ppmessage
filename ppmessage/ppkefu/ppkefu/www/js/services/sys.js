ppmessageModule.factory('yvSys', [
    "$state",
    "$cookies",
    "$window",
    "yvLog",
    "yvConstants",
function ($state, $cookies, $window, yvLog, yvConstants) {
    var _page_size = 15;
    var _keyboard_height = 216;
    var _device_online = true;
    var _bundle = {
        id: "",
        display_name: yvConstants.DEFAULT_BUNDLE_NAME
    };
    var _p = ionic.Platform;
    var _platform = {
        'isWebView': _p.isWebView(),
        'isIPad': _p.isIPad(),
        'isIOS': _p.isIOS() || _p.isIPad(),
        'isAndroid': _p.isAndroid(),
        'isWindowsPhone': _p.isWindowsPhone(),
        'platform': _p.platform(),
        'version': _p.version(),
        'device': _p.device()
    };

    if (_platform.isIOS || _platform.isAndroid || _platform.isWindowsPhone) {
        _page_size = Math.floor(screen.height / 72);
    }

    function _request_desktop_notification() {
        if (window.Notification === undefined) {
            console.error("No Notification support.");
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

    function _desktop_notification(_title, _body, _icon) {
        var _option = null, _noti = null;

        _request_desktop_notification();

        if (window.Notification && Notification.permission !== "granted") {
            console.error("Needs Notification permission.");
            return;
        }

        if (window.Notification && Notification.permission === "granted") {
            _option = {body: _body};
            if (_icon) {
                _option.icon = _icon;
            }
            console.log(_option);
            if (document.hidden === false) {
                return;
            }
            _noti = new Notification(_title, _option);
            setTimeout(_noti.close.bind(_noti), 3000);
        }
        return;
    }

    function _get_uuid() {
        var d, uuid;
        d = new Date().getTime();
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    function _set_device_uuid_cookie(name) {
        var expire_date = new Date();
        var device_uuid = _get_uuid();
        expire_date.setDate(expire_date.getDate() + "30");
        $cookies.put(name, device_uuid, {
            expires: expire_date
        });
        return device_uuid;
    }

    // should fix the bug: download won't start in firefox
    // when download link is clicked
    function _click_download(href, filename) {
        var link = document.createElement("a");
        var event = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": true
        });
        if (filename) {
            link.download = filename;
        }
        link.href = href;
        link.dispatchEvent(event);
    }
    
    return {
        // running in a mobile device, iphone, ipad, android, windows phone .etc
        in_mobile: function () {
            return this.in_mobile_app() || this.in_mobile_browser();
        },
        
        // running in a mobile device, and is a cordova app
        in_mobile_app: function () {
            return _platform.isWebView;
        },

        // running in a mobile browser
        in_mobile_browser: function () {
            return jscd.mobile && !_platform.isWebView;
        },

        // running in browser, either in mobile or in pc
        in_browser: function () {
            return this.in_pc_browser() || this.in_mobile_browser();
        },

        // running in pc browser
        in_pc_browser: function () {
            return !jscd.mobile && !window.require;
        },

        // running in pc (mac, win, linux), either in browser or in electron
        in_pc: function () {
            return this.in_pc_browser() || this.in_electron();
        },
        
        // based in sqllite plugin, either a cordova app or electron app
        has_db: function () {
            return this.in_mobile_app() || this.in_electron();
        },

        // running in electron
        in_electron: function() {
            return window.require && process && process.versions && process.versions.electron;
        },
        
        /* mobile app begin */
        // a cordova app, running in iOS
        in_ios_app: function () {
            return this.in_mobile_app() && _platform.isIOS;
        },
        
        // a cordova app, running in Android
        in_android_app: function () {
            return this.in_mobile_app() && _platform.isAndroid;
        },
        
        // a cordova app, running in windows phone
        in_wp_app: function () {
            return this.in_mobile_app() && _platform.isWindowsPhone;
        },
        
        /* mobile app end */

        /* mobile browser begin */

        // running in iOS browser
        in_ios_browser: function () {
            return this.in_mobile_browser() && _platform.isIOS;
        },

        // running in Android browser
        in_android_browser: function () {
            return this.in_mobile_browser() && _platform.isAndroid;
        },

        // running in windows phone browser
        in_wp_browser: function () {
            return this.in_mobile_browser() && _platform.isWindowsPhone;
        },        
        /* mobile browser end */
        
        /* pc browser begin */        
        // runnign in windows browser
        in_win_browser: function () {
            return this.in_pc_browser() && jscd.os.indexOf("Win") === 0;
        },

        // running in mac os x browser
        in_mac_browser: function () {
            return this.in_pc_browser() && jscd.os.indexOf("Mac") === 0;
        },

        // running in linux browser
        in_linux_browser: function () {
            return this.in_pc_browser() && jscd.os.indexOf("Lin") === 0;
        },        
        /* pc browser end */

        /* pc electron begin */
        // running in mac electron
        in_mac_electron: function () {
            return this.in_electron() && process.platform === "darwin";
        },

        // running in win32 electron
        in_win32_electron: function () {
            return this.in_electron() && process.platform === "win32";
        },

        // running in win64 electron
        in_win64_electron: function () {
            return this.in_electron() && process.platform === "win64";
        },

        // running in linux electron
        in_linux_electron: function () {
            return this.in_electron() && process.platform === "linux";
        },
        /* pc electron end */
        
        in_nw: function () {
            return window.require && process && process.versions && !process.versions.electron;
        },

        in_node: function() {
            return window.require && process;
        },

        // get cordova app's bundle info
        get_bundle_info: function () {
            return _bundle;
        },

        // set cordova app's bundle info
        set_bundle_info: function () {
            cordova.getAppVersion.getPackageName(function (name) {
                _bundle.id = name;
            }, null);
            cordova.getAppVersion.getAppName(function (name) {
                _bundle.display_name = name;
            }, null);
        },

        // get device info, offered by ionic
        get_device_info: function () {
            return _platform.device;
        },

        // get unique android device uuid, or null
        get_device_uuid: function (_user_id) {
            if (this.in_android_app()) {
                return _platform.device.uuid;
            }
            if (this.in_browser() || this.in_electron()) {
                var _name = "ppkefu-device-uuid:" + _user_id;
                _name = hex_sha1(_name).toLowerCase();
                var device_uuid = $cookies.get(_name);
                if (!device_uuid) {
                    device_uuid = _set_device_uuid_cookie(_name);
                }
                return device_uuid;
            }
            return null;
        },

        // get device platform
        get_device_platform: function () {
            var P = yvConstants.PLATFORM;
            
            // mobile app
            if (this.in_ios_app()) {
                return P.IOS
            }
            if (this.in_android_app()) {
                return P.ANDROID;
            }
            if (this.in_wp_app()) {
                return P.WIP;
            }
            
            // mobile browser
            if (this.in_ios_browser()) {
                return P.IOS_BROWSER;
            }
            if (this.in_android_browser()) {
                return P.ANDROID_BROWSER;
            }
            if (this.in_wp_browser()) {
                return P.WIP_BROWSER;
            }
            
            // pc electron
            if (this.in_win32_electron()) {
                return P.WIN32;
            }
            if (this.in_win64_electron()) {
                return P.WIN64;
            }
            if (this.in_mac_electron()) {
                return P.MAC;
            }
            if (this.in_linux_electron()) {
                return P.LINUX;
            }

            // pc browser
            if (this.in_win_browser()) {
                return P.WIN_BROWSER;
            }
            if (this.in_mac_browser()) {
                return P.MAC_BROWSER;
            }
            if (this.in_linux_browser()) {
                return P.LINUX_BROWSER;
            }
            
            return _platform.platform.substring(0, 3).toUpperCase();
        },

        // get device model
        get_device_model: function () {
            return _platform.device.model;
        },

        // get device friendly fullname
        get_device_fullname: function () {
            if (this.in_mobile_app()) {
                var deviceName = cordova.plugins.deviceName;
                return deviceName.name;
            }
            return _platform.platform + " " + _platform.version + " " + jscd.browser + " " + jscd.browserVersion;
        },

        // get device version
        get_device_version: function () {
            return _platform.version;
        },

        request_desktop_notification: function () {
            return _request_desktop_notification();
        },

        desktop_notification: function (_title, _body, _icon) {
            return _desktop_notification(_title, _body, _icon);
        },

        get_app_body_style: function () {
            if (this.in_mobile() || this.in_electron()) {
                return {};
            }

            var _top = "0%";
            var _height = "100%";
            var _left = 0;
            var _max_width = 1068;
            var _browser_width = window.innerWidth;
            var _browser_height = window.innerHeight;
            var _style = {
                width: "100%",
                minHeight: "600px",
                maxWidth: _max_width + "px"
            };

            if (_browser_width >= _max_width) {
                _left = (_browser_width - _max_width) / 2;
            }

            if (_browser_height > 667) {
                _top = "7%";
                _height = "83%";
            }

            _style.left = _left + "px";
            _style.height = _height;
            _style.top = _top;
            return _style;
        },

        set_keyboard_height: function (kh) {
            if (this.in_android_app()) {
                var navbar_height = screen.height - window.innerHeight;
                _keyboard_height = kh - navbar_height;
            } else if (this.in_ios_app()) {
                _keyboard_height = kh;
            }
        },

        get_keyboard_height: function () {
            var _h = _keyboard_height;
            if (_platform.isAndroid && _h > 400) {
                _h = _h - 50;
            }
            return _h;
        },

        get_uuid: function () {
            return _get_uuid();
        },

        encode_utf8: function(s) {
            return unescape(encodeURIComponent(s));
        },

        page_size: function () {
            return _page_size;
        },

        device_online: function () {
            _device_online = true;
        },

        device_offline: function () {
            _device_online = false;
        },

        is_device_online: function () {
            return _device_online;
        },

        get_device_network: function () {
            return navigator.connection.type;
        },

        click_download: function (href, filename) {
            return _click_download(href, filename);
        },
        
    };
}]);
