ppmessageModule.factory("yvAlert", [
    "$timeout",
    "$ionicPopup",
    "blockUI",
    "yvConstants",
    "yvSys",
    "yvLocal",
function ($timeout, $ionicPopup, blockUI, yvConstants, yvSys, yvLocal) {

    function _alert(_title, _content, _cb) {
        var _popup = $ionicPopup.alert({
            title: _title,
            template: "<p style='font-family: Helvetica; text-align: center;'>" + _content + "</p>",
            okText: yvLocal.translate("app.GLOBAL.ALERT_OK")
        });
        _popup.then(function (res) {
            if (res && _cb) { _cb(); }
        });
        $timeout(function () {
            _popup.close();
        }, 1000);
    }

    function _confirm(_title, _content, _yes, _no) {
        var _popup = $ionicPopup.confirm({
            title: _title,
            template: "<p style='font-family: Helvetica;'>" + _content + "</p>",
            cancelText: yvLocal.translate("app.GLOBAL.ALERT_CANCEL"),
            okText: yvLocal.translate("app.GLOBAL.ALERT_OK")
        });
        _popup.then(function (res) {
            if (res && _yes) {
                _yes();
            } else if (_no) {
                _no();
            }
        });
    }

    function _prompt(_title, _default_input, _then) {
        var _popup = $ionicPopup.prompt({
            title: _title,
            inputPlaceholder: _default_input,
            cancelText: yvLocal.translate("app.GLOBAL.ALERT_CANCEL"),
            okText: yvLocal.translate("app.GLOBAL.ALERT_OK")
        });

        _popup.then(function (res) {
            if (res === undefined) {
                console.log("canceld.");
                return;
            }
            if (_then) {
                _then(res);
            }
        });
    }

    function _show(_title, _content, _scope, _yes, _no) {
        // _content should be compatible with ng-model, example: "data.name"
        var _popup = $ionicPopup.show({
            title: _title,
            template: "<input type='text' ng-model=" + _content + ">",
            scope: _scope,
            buttons: [
                {
                    text: yvLocal.translate("app.GLOBAL.ALERT_CANCEL"),
                    onTap: function (e) {
                        if (_no) { _no(e); }
                        return "cancel"; // return a value to resolve promise.
                    }
                },
                {
                    text: yvLocal.translate("app.GLOBAL.ALERT_OK"),
                    type: "button-positive",
                    onTap: function (e) {
                        if (_yes) { _yes(e); }
                        return "ok";
                    }
                }
            ]
        });

        _popup.then(function (res) {
            console.log("tapped", res); // res could be 'cancel' or 'ok'
        });
    }

    function _toast(msg) {
        window.plugins.toast.showShortCenter(msg);
    }

    function _success() {
        var content = yvLocal.translate("app.COMMON.SET_SUCCESS");
        if (yvSys.in_mobile_app()) {
            _toast(content);
        } else {
            blockUI.start();
            blockUI.message(content);
            $timeout(function () {
                blockUI.stop();
            }, 1000);
        }
    }

    function _fail() {
        var content = yvLocal.translate("app.COMMON.SET_FAILURE");
        if (yvSys.in_mobile_app()) {
            _toast(content);
        } else {
            blockUI.start();
            blockUI.message(content);
            $timeout(function () {
                blockUI.stop();
            }, 1000);
        }
    }

    // by default, content will be translated to current locale
    function _tip(content, dontTranslate) {
        if (!dontTranslate) {
            content = yvLocal.translate(content);
        }
        if (yvSys.in_mobile_app()) {
            _toast(content);
        } else {
            blockUI.start();
            blockUI.message(content);
            $timeout(function () {
                blockUI.stop();
            }, 1000);
        }
    }

    return {
        alert: function (title, content, cb) {
            _alert(title, content, cb);
        },

        confirm: function (title, content, yes, no) {
            _confirm(title, content, yes, no);
        },

        prompt: function (title, default_input, then) {
            _prompt(title, default_input, then);
        },

        show: function (title, content, scope, yes, no) {
            _show(title, content, scope, yes, no);
        },

        toast: function (msg) {
            _toast(msg);
        },

        success: function () {
            _success();
        },

        fail: function () {
            _fail();
        },

        tip: function (content, dontTranslate) {
            _tip(content, dontTranslate);
        }
    };

}]);
