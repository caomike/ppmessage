ppmessageModule.directive("yvNewChatTool", [
    "$timeout",
    "yvLog",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvNoti",
    "yvConstants",
    "yvUploader",
    "yvDelegate",
function ($timeout, yvLog, yvSys, yvAPI, yvUser, yvNoti, yvConstants, yvUploader, yvDelegate) {

    // function _link($scope, $element, $attr) {
    function _controller($scope, $element, $attrs) {
        
        function _iframe_onload() {
            var iframe = $element.find("iframe")[0];

            if (!iframe) { return; }

            iframe.onload = function () {
                var _data = iframe.contentDocument.getElementsByTagName("pre")[0];
                if (_data) {
                    _data = JSON.parse(_data.innerHTML);
                    $scope.sendMessage({
                        type: yvConstants.MESSAGE_SUBTYPE.TXT,
                        data: {fid: _data.fid}
                    });
                }
            };
        }

        $scope.prepareText = function () {
            if ($scope.textarea.text === "") {
                console.log("can't send empty message");
                return;
            }

            console.log("prepareTextMessage...");
            var _text = $scope.textarea.text,
                _len = yvSys.encode_utf8(_text).length,
                _form = $element.find("form")[0];

            if (_len > yvConstants.MESSAGE_MAX_TEXT_LEN) {
                if (yvSys.in_electron()) {
                    var _server = yvAPI.get_server();
                    _form.action = _server.protocol + _server.host + "/ppkefu/upload/";
                }
                _form.submit();
            } else {
                $scope.sendMessage({
                    type: yvConstants.MESSAGE_SUBTYPE.TEXT,
                    data: _text
                });
            }

            $timeout(function () {
                $scope.textarea.text = "";
                $element.find("textarea")[0].focus();
            });
        };

        $scope.onKeyPress = function (event) {
            var code = event.keyCode || event.which;
            if (code == 13 || code == 10) {
                event.preventDefault();
                if (event.ctrlKey) {
                    $scope.textarea.text += "\n";
                } else {
                    $scope.prepareText();
                }
            }
            yvNoti.typing();
        };

        $scope.onFocus = function () {
            //Jin He: it works in Safari, but not in Chrome
            if ($scope.inMobileChrome()) {
                yvDelegate.scroll_bottom();
            }
        };

        $scope.uploadFile = function () {
            angular.element("input#send-file").click();
        };
        
        $scope.sendLocation = function () {
            $scope.$broadcast("event:show-send-location-modal");
        };

        $scope.getPlatformClass = function () {
            var _class = "";

            if (yvSys.in_mobile_browser()) {
                _class += " yv-mobile ";
            } else {
                _class += " yv-pc ";
            }

            return _class;
        };
        
        $scope.inMobileChrome = function () {
            return yvSys.in_mobile_browser();
        };

        $scope.$on("event:restore-chat-text", function (event, conversation) {
            if (conversation && conversation.last_chat_text) {
                $scope.textarea.text = conversation.last_chat_text;
            } else {
                $scope.textarea.text = "";
            }
        });
        
        $scope.$on("event:save-chat-text", function (event, conversation) {
            if (conversation) {
                conversation.last_chat_text = $scope.textarea.text;
            }
        });
        
        function _init() {
            $scope.textarea = {text: ""};
            var _server = yvAPI.get_server();
            $scope.uploaderOptions = {
                url: _server.upload_url,
                formData: [{upload_type: "file", user_uuid: yvUser.get("uuid")}]
            };
            $scope.uploader = yvUploader.get_uploader();
            _iframe_onload();
        }

        _init();
    }

    _controller.$inject = ["$scope", "$element", "$attrs"];

    return {
        restrict: "E",
        templateUrl: 'templates/directives/new-chat-tool.html',
        controller: _controller
    };

}]);
