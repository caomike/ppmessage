ppmessageModule.directive("yvChatTool", [
    "$timeout",
    "$ionicGesture",
    "yvLog",
    "yvSys",
    "yvNoti",
    "yvFile",
    "yvDelegate",
    "yvConstants",
function ($timeout, $ionicGesture, yvLog, yvSys, yvNoti, yvFile, yvDelegate, yvConstants) {

    function _controller($scope, $element, $attrs) {
        var _close_gesture = null;
        var _s = $scope.chatStatus;
        var _S = yvConstants.CHAT_STATUS;
        var _M = yvConstants.MESSAGE_SUBTYPE;

        $scope.$on("event:pause-listen-keyboard", function () {
            window.removeEventListener('native.keyboardhide', _on_hide);
            window.removeEventListener('native.keyboardshow', _on_show);
        });
        
        $scope.$on("event:resume-listen-keyboard", function () {
            $timeout(function () {
                window.addEventListener('native.keyboardhide', _on_hide);
                window.addEventListener('native.keyboardshow', _on_show);
            }, 1000);
        });
        
        function _on_keypress(event) {
            if (_s.status !== _S.TEXTING) {
                return;
            }
            yvNoti.typing();
        }

        function _iframe_onload() {
            var iframe = $element.find("iframe")[0];

            if (!iframe) { return; }

            iframe.onload = function () {
                var _data = iframe.contentDocument.getElementsByTagName("pre")[0];
                if (_data) {
                    _data = JSON.parse(_data.innerHTML);
                    $scope.sendMessage({
                        type: _M.TXT,
                        data: {fid: _data.fid}
                    });
                }
            };
        }

        function _unregister_close_gesture() {
            if (_close_gesture !== null) {
                $ionicGesture.off(_close_gesture, "tap", _close_gesture_cb);
                _close_gesture = null;
            }
        }

        function _close_gesture_cb(e) {
            var _toolTop = $element.children()[0].offsetTop;

            if (e.gesture.touches[0].pageY >= _toolTop) {
                return;
            }

            console.log("SWITCH STATUS WHEN TAPPING. STATUS: " + _s.status + ", touch_y: " +
                        e.gesture.touches[0].pageY + " < tool_y: " + _toolTop);

            if (_s.status === _S.RECORDING_PRE || _s.status === _S.ADDING) {
                $timeout(function () {
                    _s.status = _S.NULL;
                    yvDelegate.scroll_resize();
                });
                _unregister_close_gesture();
                return;
            }
        }

        function _register_close_gesture() {
            $timeout(function () {
                if (_close_gesture === null) {
                    _close_gesture = $ionicGesture.on("tap", _close_gesture_cb, angular.element(document));
                }
            }, 300);
        }

        function _on_hide() {
            console.log("keyboardhide");
            _s.scroll = true;
        }

        function _on_show(e) {
            console.log("keyboard show", e.keyboardHeight);
            yvSys.set_keyboard_height(e.keyboardHeight);
            $timeout(function () {
                _s.status = _S.TEXTING;
                _s.scroll = true;
            });
        }

        $scope.getPlatformClass = function() {
            if (yvSys.in_mobile_browser()) {
                return "yv-mobile-browser";
            }
            return "";
        };
        
        $scope.showMicButton = function () {
            if (_s.status === _S.RECORDING_PRE || _s.status === _S.RECORDING || _s.status === _S.RECORDING_CANCEL) {
                return true;
            }
            return false;
        };

        $scope.showAddingButton = function () {
            if (_s.status === _S.ADDING) {
                return true;
            }
            return false;
        };

        $scope.getToolbarBottom = function () {
            var _b = 0;
            if (_s.status === _S.NULL) {
                if (_s.scroll) {
                    yvDelegate.scroll_bottom();
                    _s.scroll = false;
                }
                return {"bottom": _b + "px"};
            }

            if (_s.status === _S.TEXTING) {
                if (yvSys.in_mobile_app() && cordova.plugins.Keyboard.isVisible) {
                    _b = yvSys.get_keyboard_height();
                    $scope.textarea.element[0].focus();
                    if (_s.scroll) {
                        yvDelegate.scroll_bottom();
                        _s.scroll = false;
                    }
                    return {"bottom": _b + "px"};
                }
                return {"bottom": _b + "px"};
            }

            if (_s.status === _S.RECORDING_PRE || _s.status === _S.ADDING) {
                _b = yvSys.get_keyboard_height();
                return {"bottom": _b + "px"};
            }

            return {"bottom": _b + "px"};
        };

        $scope.getAddPageStyle = function () {
            return {"height":  yvSys.get_keyboard_height() + "px"};
        };

        $scope.selectToAdd = function () {
            _register_close_gesture();

            if (_s.status === _S.ADDING) {
                _s.status = _S.NULL;
                yvDelegate.scroll_bottom();
                return;
            }

            if (_s.status === _S.TEXTING) {
                if (yvSys.in_mobile_browser()) {
                    $timeout(function () {
                        _s.status = _S.ADDING;
                        yvDelegate.scroll_bottom();
                    }, 400);
                } else {
                    _s.status = _S.ADDING;
                    yvDelegate.scroll_bottom();
                }
                return;
            }

            if (_s.status === _S.RECORDING_PRE || _s.status === _S.NULL) {
                _s.status = _S.ADDING;
                yvDelegate.scroll_bottom();
                return;
            }

            console.error("ADDING can not transit from status: " + _s.status);
            return;
        };

        $scope.selectToSound = function () {
            _register_close_gesture();

            if (_s.status === _S.RECORDING_PRE) {
                _s.status = _S.NULL;
                yvDelegate.scroll_bottom();
                return;
            }
            if (_s.status === _S.TEXTING) {
                if (yvSys.in_mobile_browser()) {
                    $timeout(function () {
                        _s.status = _S.RECORDING_PRE;
                        yvDelegate.scroll_bottom();
                    }, 400);
                } else {
                    _s.status = _S.RECORDING_PRE;
                    yvDelegate.scroll_bottom();
                }
                return;
            }

            if (_s.status === _S.ADDING || _s.status === _S.NULL) {
                _s.status = _S.RECORDING_PRE;
                yvDelegate.scroll_bottom();
                return;
            }

            console.error("PRE_RECORD can not transit from status: " + _s.status);
            return;
        };

        // fixme: chat-tool doesn't rise up when keyboard show
        $scope.lost = function ($event) {
            console.log("INPUT BLURED..... sending " + _s.sending + " status:" + _s.status);
            if (_s.status === _S.TEXTING && _s.sending === true) {
                $scope.textarea.element[0].style.height = $scope.textarea.origin_height;
                $scope.textarea.element[0].focus();
                _s.sending = false;
                return;
            }
            
            if (_s.status === _S.TEXTING && _s.sending === false) {
                $timeout(function () {
                    _s.status = _S.NULL;
                });
                return;
            }
        };

        $scope.focusToText = function () {
            _unregister_close_gesture();

            if (yvSys.in_mobile_browser()) {
                $timeout(function () {
                    _s.status = _S.TEXTING;
                    yvDelegate.scroll_bottom();
                });
            }

            $scope.textarea.element.off('focusout');
            $scope.textarea.element.on('focusout', function (event) {
                $scope.lost(event);
            });
        };

        $scope.prepareText = function () {
            if (!$scope.textarea.text) {
                console.log("can't send empty message");
                return;
            }

            console.log("prepare Text Message...");
            var text = $scope.textarea.text,
                len = yvSys.encode_utf8(text).length;

            if (len > yvConstants.MESSAGE_MAX_TEXT_LEN) {
                if (yvSys.in_mobile_app()) {
                    yvFile.create_random(text, false, function (file) {
                        $scope.sendMessage({type: _M.TXT, data: {fid: file}});
                    });
                } else {
                    $element.find("form")[0].submit();
                }
            } else {
                $scope.sendMessage({type: _M.TEXT, data: text});
            }

            $scope.textarea.text = "";
            $scope.textarea.element[0].focus();
            $scope.textarea.element[0].style.height = $scope.textarea.origin_height;
            _s.sending = true;
        };
        
        $scope.$on("$destroy", function () {
            _unregister_close_gesture();
            if ($scope.conversation) {
                $scope.conversation.last_chat_text = $scope.textarea.text;
            }
            if (yvSys.in_mobile_app()) {
                window.removeEventListener('native.keyboardhide', _on_hide);
                window.removeEventListener('native.keyboardshow', _on_show);
            }
        });

        function _init() {
            $scope.textarea = {
                text: "",
                origin_height: "25px",
                element: $element.find("textarea")
            };
            
            _s.status = yvConstants.CHAT_STATUS.NULL;
            _s.sending = false;

            if ($scope.conversation && $scope.conversation.last_chat_text) {
                $scope.textarea.text = $scope.conversation.last_chat_text;
            }

            $scope.onKeyPress = _on_keypress;
            
            if (yvSys.in_mobile_app()) {
                window.addEventListener('native.keyboardhide', _on_hide, false);
                window.addEventListener('native.keyboardshow', _on_show, false);
                return;
            }
            if (yvSys.in_mobile_browser()) {
                _iframe_onload();
                return;
            }
        }
        
        _init();
    }

    _controller.$inject = ["$scope", "$element", "$attrs"];

    return {
        restrict: "EA",
        templateUrl: 'templates/directives/chat-tool.html',
        controller: _controller
    };

}]);
