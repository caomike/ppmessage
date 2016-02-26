ppmessageModule.factory('yvLocal', [
    "$filter",
    "$translate",
    "yvSys",
function ($filter, $translate, yvSys) {

    var current_language = null;

    if (!yvSys.in_mobile_app()) {
        current_language = navigator.language;
    }
   
    function _translate(str) {
        if (str && typeof str === "string") {
            return $filter("translate")(str);
        }
        return str;
    }

    
    function _format_timestamp(timestamp, in_conversation) {
        if (!timestamp) {
            return "";
        }
        
        // Note: It should be noted that moments are mutable.
        // Calling any of the manipulation methods will change the original moment.
        var now = moment();
        var start = now.clone().startOf("day");
        var end = now.clone().endOf("day"); 
        var target = moment.unix(timestamp);

        // today
        if (target.isBetween(start, end)) {
            return target.format("HH:mm");
        }

        // future, should not happen, just in case
        if (target.isAfter(end)) {
            if (in_conversation) {
                return target.format("MM-DD");
            }
            return target.format("MM-DD HH:mm")
        }

        // yesterday
        start.subtract(1, "day");
        end.subtract(1, "day");
        if (target.isBetween(start, end)) {
            if (in_conversation) {
                return _translate("app.GLOBAL.YESTERDAY") + target.format(" HH:mm");
            }
            return _translate("app.GLOBAL.YESTERDAY");
        }
        
        // before yesterday, if in conversation, show date & time, if not, only show date
        if (in_conversation) {
            return target.format("MM-DD HH:mm");
        }
        return target.format("MM-DD");
    }

    
    function _set_moment_locale() {
        var locale = _translate("app.GLOBAL.TIMESTAMP_LANGUAGE");
        moment.locale(locale);
    }

    function _filter_language(language) {
        var lower = language.toLowerCase();
        if (lower.indexOf("zh") === 0) {
            return "zh-Hans";
        }
        if (lower.indexOf("en") === 0) {
            return "en";
        }
        return language;
    }
    
    return {
        localize: function (cb) {
            if (yvSys.in_mobile_app()) {
                navigator.globalization.getPreferredLanguage(function (local) {
                    var language = _filter_language(local.value);
                    $translate.use(language).then(function () {
                        _set_moment_locale();
                        cb && cb();
                    });
                });
            } else {
                $translate.use(navigator.language).then(function () {
                    _set_moment_locale();
                    cb && cb();
                });
            }
        },
        
        localize_by_language: function (language) {
            $translate.use(language).then(function () {
                _set_moment_locale();
                current_language = language;
            });
        },

        filter_language: function (language) {
            return _filter_language(language);
        },
        
        get_current_language: function () {
            return current_language;
        },

        translate: function (_str) {
            return _translate(_str);
        },

        format_timestamp: function (timestamp, in_conversation) {
            return _format_timestamp(timestamp, in_conversation);
        }
    };
}]);
