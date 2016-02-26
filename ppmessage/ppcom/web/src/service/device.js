// IE8, IE9 not support `WebSocket`, `FormData`, `File` API
((function(Service) {

    Service.$device = (function() {

        var w = window,

            deviceWidth = (w.innerWidth > 0) ? w.innerWidth : screen.width,
            deviceHeight = (w.innerHeight > 0) ? w.innerHeight : screen.height,

            DEVICE_ID_COOKIE_KEY = 'pp-device-id',
            DEVICE_ID_COOKIE_EXPIRE = 10 * 365 * 24 * 3600, // 10 years, never delete it
            deviceId, // device identifier

            userAgent = navigator.userAgent,
            platform = navigator.platform,

            isIOS = /iPhone|iPad|iPod/i.test(userAgent),
            isAndroid = /Android/i.test(userAgent),
            isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isWP = /Windows Phone/i.test(userAgent) || /iemobile/i.test(userAgent) || /WPDesktop/i.test(userAgent),

            isMac = platform.toUpperCase().indexOf('MAC') >= 0,
            isWin = platform.toUpperCase().indexOf('WIN') > -1,
            isLin = platform.toUpperCase().indexOf('LINUX') > -1,

            OS = {
                MAC: 'MAB',
                LIN: 'LIB',
                WIN: 'WIB'
            };

        this.getDeviceWidth = function() {
            return deviceWidth;
        };

        this.getDeviceHeight = function() {
            return deviceHeight;
        };

        this.inMobile = function() {
            var w = this.getDeviceWidth();
            return w <= 736;
        };

        this.disableScroll = function() {
            $('html, body').css({
                'overflow': 'hidden',
                'height': '100%'
            });
        };

        this.enableScroll = function() {
            $('html, body').css({
                'overflow': 'auto',
                'height': 'auto'
            });
        };

        this.isIOS = function() {
            return isIOS;
        };

        this.isAndroid = function() {
            return isAndroid;
        };

        this.isMobileBrowser = function() {
            return isMobile;
        };

        // if IE browser, then return IE version number
        // if not IE browser, then return false
        this.isIE = function () {
            var ua = userAgent;

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // IE 12 => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        };

        this.isIE9 = function() { // IE 9
            var ieVersion = this.isIE();
            return ieVersion && ieVersion == 9;
        };

        this.isIE9OrLowerVersionBrowser = function() { // <= IE 9
            var ieVersion = this.isIE();
            return ieVersion && ieVersion <= 9;
        };

        /** Detect is windwos platform **/
        this.isWindowsPlatform = function() {
            return isWin;
        };

        this.isMac = function() { // is mac platform
            return isMac;
        };

        this.isFirefox = function() {
            return typeof InstallTrigger !== 'undefined'; //Firefox 1.0+
        };

        this.getOSType = function() {

            if ( isAndroid || isLin ) return OS.LIN;

            if ( isIOS || isMac ) return OS.MAC;

            if ( isWP || isWin ) return OS.WIN;

            return OS.MAC;
        };

        this.getDeviceId = function() {

            if (deviceId) return deviceId;

            deviceId = Service.$cookies.get(DEVICE_ID_COOKIE_KEY) || function() {
                var uuid = Service.$tools.getUUID();
                Service.$cookies.set(DEVICE_ID_COOKIE_KEY, uuid, {
                    expires: DEVICE_ID_COOKIE_EXPIRE
                });
                return uuid;
            }();

            return deviceId;
            
        };

        /* Whether or not support play mp3 */
        this.audioMp3 = function() {
            var e = $( '<audio>' )[0];
            return !!e.canPlayType && !!e.canPlayType("audio/mpeg;").replace(/^no$/, "");
        };

        return this;
        
    })();
    
})(Service));
