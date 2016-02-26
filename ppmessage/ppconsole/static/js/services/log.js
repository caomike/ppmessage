// convenience to manager log
// let you easily find you log messages !

// Copy and modified from ppcom/jquery/src/service/pp-service-debug.js
// @author kun.zhao@yvertical.com
//
// How to use:
//
// yvLog.h().d(obj1, obj2, obj3, ...);
//

$yvLog.$inject = [];
function $yvLog() {

    var DEBUG = true, // open or close debug
        DEBUG_WARNING = true, // debug `warning` info
        
        supportConsole = !(typeof console === "undefined" || typeof console.log === "undefined"),
        supportConsoleApply = supportConsole && !(typeof console.log.apply === "unknown" || typeof console.log.apply === "undefined");

    // Highlight
    function h() {
        var cssStr = "%c" + '↓↓↓↓↓↓↓↓↓↓';
        d(cssStr, "font-size:28px; color:blue;");
        return this;
    }

    // Debug
    function d() {
        if (DEBUG) {
            var args = Array.prototype.slice.call(arguments);
            supportConsoleApply ? console.log.apply(console, args) : console.log(args);
        }
        return this;
    }

    function w() {
        if ( DEBUG_WARNING ) {
            var args = Array.prototype.slice.call(arguments);
            supportConsoleApply ? console.log.apply(console, args) : console.log(args);
        }
        return this;
    }
    
    return {
        h: h,
        d: d,
        w: w
    }
}

angular.module("this_app.services")
    .factory("yvLog", $yvLog);
