ppmessageModule.factory("yvLog", [

function () {
    var log = {};
    var methods = ["log", "warn", "error", "info", "dir"];
    
    if (ppmessage.developerMode) {
        log = window.console;
    } else {
        angular.forEach(methods, function (method) {
            log[method] = angular.noop;
        });
    }
    
    return log;
}]);
