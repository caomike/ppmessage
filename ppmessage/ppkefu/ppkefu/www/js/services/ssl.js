ppmessageModule.factory("yvSSL", [
    "yvConstants",
function (yvConstants) {
    return {
        ws_protocol: function (host) {
            var _ws = "ws://";
            if (location.protocol == "https") {
                _ws = "wss://";
            }
            return _ws
        }
    };
}]);
