ppmessageModule.factory("yvSSL", [
    "yvConstants",
function (yvConstants) {

    function _is_test_host (host) {
        if (host.indexOf("ppmessage.cn") === -1) {  
            return true;
        }
        return false;
    }

    return {

        http_protocol: function (host) {
            if (_is_test_host(host)) {
                return "http://";
            }
            return "https://";
        },

        ws_protocol: function (host) {
            if (_is_test_host(host)) {
                return "ws://";
            }
            return "wss://";
        }

    };
}]);
