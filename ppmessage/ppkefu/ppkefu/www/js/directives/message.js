ppmessageModule.directive("yvMessage", [
    "$rootScope",
    "$timeout",
    "$ionicLoading",
    "$ionicActionSheet",
    "yvDB",
    "yvAPI",
    "yvSys",
    "yvLog",
    "yvUser",
    "yvMain",
    "yvFile",
    "yvBase",
    "yvMime",
    "yvType",
    "yvLink",
    "yvAlert",
    "yvLocal",
    "yvConstants",
function ($rootScope, $timeout, $ionicLoading, $ionicActionSheet, yvDB, yvAPI, yvSys, yvLog, yvUser, yvMain, yvFile, yvBase, yvMime, yvType, yvLink,
          yvAlert, yvLocal, yvConstants) {
        
    function _link($scope, $element, $attrs) {

        $scope.copyMessage = function (message) {
            var text = "";
            if (yvType.is_text(message)) {
                text = message.body;
            } else if (yvType.is_txt(message)) {
                text = message.txt_content;
            }
            if (yvSys.in_mobile_app()) {
                cordova.plugins.clipboard.copy(text);
                return;
            }
            if (!yvSys.in_mobole()) {
                return;
            }
            // Fixme: copy in browser
        };

        $scope.deleteMessage = function (message) {
            $scope.$parent.deleteMessage(message);
        };

        $scope.hold = function (message) {
            yvLog.log("holding.....");
            var _copy = "<center style='color: #007aff'>" + yvLocal.translate("app.GLOBAL.COPY") + "</center>";
            var _forward = "<center style='color: #007aff'>" + yvLocal.translate("app.GLOBAL.FORWARD") + "</center>";
            var _delete = "<center style='color: #ff3b30'>" + yvLocal.translate("app.GLOBAL.DELETE") + "</center>";
            var _cancel = "<center style='color: #007aff'>" + yvLocal.translate("app.GLOBAL.CANCEL") + "</center>";
            var _bs = null, _hide = null;

            if ($scope.$parent.conversation.history) {
                yvLog.log("converstion.history is true, don't show hold options");
                return;
            }

            if (yvSys.in_mobile_app() && cordova.plugins.Keyboard.isVisible) {
                cordova.plugins.Keyboard.close();
            }

            if (yvType.is_text(message) || yvType.is_txt(message)) {
                if (yvSys.in_mobile_app()) {
                    _bs = [
                        {text: _copy},
                        // {text: _forward}
                    ];
                } else {
                    _bs = [];
                    // _bs = [{text: _forward}];
                }
            } else {
                _bs = [];
                // _bs = [{text: _forward}];
            }

            _hide = $ionicActionSheet.show({
                buttons: _bs,

                destructiveText: _delete,
                destructiveButtonClicked: function () {
                    $scope.deleteMessage(message);
                    return true;
                },

                cancelText: _cancel,
                cancel: function () {
                    yvLog.log();
                },

                buttonClicked: function (_index) {
                    yvLog.log(_bs[_index]);
                    if (_bs[_index].text === _forward) {
                        $scope.$parent.showForwardModal(message);
                    }

                    if (_bs[_index].text === _copy) {
                        $scope.copyMessage(message);
                    }
                    return true;
                }
            });

            $timeout(function () {
                _hide();
            }, 5000);
        };

        $scope.dbclick = function (message) {
            yvLog.log('dbclick ...');
            if (yvType.is_text(message)) {
                $scope.$parent.showTextModal(message.body_linky);
            } else if (yvType.is_txt(message)) {
                $scope.$parent.showTextModal(message.txt_content_linky);
            }
            return;
        };

        $scope.openFile = function (file_url) {
            file_url = decodeURI(file_url);
            cordova.plugins.disusered.open(file_url, function () {
                $ionicLoading.hide();
            }, function (error_code) {
                $ionicLoading.hide();
                yvAlert.toast(yvLocal.translate("app.GLOBAL.CANT_OPEN_FILE"));
            });
        };

        $scope.handleNormalFile = function (message) {
            var file_name = message.name || (message.file + "." + yvSys.mime_ext(message.mime));
            if (yvSys.in_mobile_app()) {
                $ionicLoading.show();
                yvFile.has_file(file_name, function (file) {
                    $scope.openFile(file.toURL());
                }, function () {
                    yvAPI.download_file(message.file, file_name, function (file) {
                        $scope.openFile(file.toURL());
                    });
                });
                return;
            }
            
            $timeout(function () {
                yvAPI.download_web_material(message.file, message.name);
            }, 300);
        };

        $scope.click = function (message, event) {
            yvLog.log("click .....", message);
            var s = message.status,
                S = yvConstants.SEND_STATUS;

            if (yvType.is_audio(message)) {
                $rootScope.$broadcast("event:toggle-play-audio", $scope.message);
                return;
            }

            if (yvType.is_image(message)) {
                $scope.viewImage(message);
                return;
            }

            if (yvType.is_gps_location(message)) {
                $scope.viewLocation(message);
                return;
            }

            if (yvType.is_text(message) || yvType.is_txt(message)) {
                yvLink.open_link(event);
                return;
            }

            if (yvType.is_file(message)) {
                if (message.direction === yvConstants.MESSAGE_DIR.DIR_IN) {
                    $scope.handleNormalFile(message);
                    return;
                }
                if (s === S.SEND_SUCCESS || s === S.SEND_SENDING) {
                    $scope.handleNormalFile(message);
                    return;
                }
                return;
            }

            return;
        };

        $scope.isFileMessage = function (message) {
            return yvType.is_file(message);
        };

        $scope.isVideoMessage = function (message) {
            return yvType.is_video(message);
        };

        $scope.isGPSLocationMessage = function (message) {
            return yvType.is_gps_location(message);
        };

        $scope.isTextMessage = function (message) {
            return yvType.is_text(message);
        };

        $scope.isTxtMessage = function (message) {
            return yvType.is_txt(message);
        };

        $scope.isImageMessage = function (message) {
            return yvType.is_image(message);
        };

        $scope.isAudioMessage = function (message) {
            return yvType.is_audio(message);
        };

        $scope.isCardMessage = function (message) {
            return yvType.is_single_card(message) || yvType.is_multiple_card(message);
        };

        $scope.viewImage = function (message) {
            yvLog.log(message.id, message.mime);

            function __show() {
                var image_url = yvLink.get_message_image(message);
                $ionicLoading.hide();
                $scope.$parent.showImageModal(image_url);
            }

            function __update_and_show(file) {
                message.file = file;
                __show();
                if (!$scope.message.in_history) {
                    yvMain.update_message_file(message, file);
                }
            }

            function __download() {
                if (!yvSys.in_mobile_app()) {
                    return;
                }
                var _body = JSON.parse(message.body);
                $ionicLoading.show();
                yvFile.has_file(_body.orig, function () {
                    __update_and_show(_body.orig);
                }, function () {
                    yvAPI.download_file(_body.orig, null, function () {
                        __update_and_show(_body.orig);
                    });
                });
            }

            function __init() {
                if (message.file) {
                    __show();
                } else {
                    __download();
                }
            }

            __init();
        };

        $scope.viewLocation = function (message) {
            $scope.$parent.showLocationModal({
                position: message.body,
                address: message.address
            });
        };

        $scope.viewCard = function (card) {
            // fixme: broadcast a cardModal show event
        };

        $scope.showAlertIcon = function (message) {
            if (yvType.is_right(message) && message.status === yvConstants.SEND_STATUS.SEND_ERROR) {
                return true;
            }
            return false;
        };

        $scope.showMouth = function (message) {
            if (yvType.is_image(message) || yvType.is_gps_location(message)) {
                return false;
            }
            return true;
        };

        $scope.viewProfile = function (message) {
            $scope.message.show_profile = true;
        };

        // match with the directive yv-userinfo-settings.
        $scope.viewUserinfo = function (message) {
            if(message.direction == "DIR_OUT") {
                return;
            }

            $scope.$parent.showUserinfoModal(message.from_uuid);
            // $scope.message.show_userinfo = true;
         }

         // $scope.$on('close_userinfo', function(){
         //    $scope.message.show_userinfo = false;
         // });

        $scope.getUserIcon = function (message) {
            var user_uuid = message.from_uuid;
            var icon = null;

            if (yvType.is_right(message)) {
                user_uuid = yvUser.get("uuid");
            }

            icon = yvBase.get("object", user_uuid, "icon");
            return yvLink.get_user_icon(icon);
        };

        $scope.getMessageClass = function (message) {
            var _class = "";

            if (yvType.is_left(message)) {
                _class += " yv-left ";
            } else if (yvType.is_right(message)) {
                _class += " yv-right ";
            }

            if (yvSys.in_mobile()) {
                _class += " yv-mobile ";
            } else {
                _class += "yv-pc";
            }

            return _class;
        };

        //if the interval chat message is more than one minute
        $scope.shouldShowTimestamp = function (message) {
            var _pre = $scope.$parent.timestamp.pre;

            // if existed, show it
            if (message.show_timestamp) {
                $scope.$parent.timestamp.pre = message.timestamp;
                return true;
            }

            message.show_timestamp = Math.abs(message.timestamp - _pre) > 60;
            if (message.show_timestamp) {
                $scope.$parent.timestamp.pre = message.timestamp;
            }
            return message.show_timestamp;
        };

        $scope.getTimestamp = function (message) {
            return yvLocal.format_timestamp(message.timestamp, true);
        };

        $scope.getFontStyle = function () {
            return {"font-size": "14px"};
        };


        $scope.$on("$destroy", function () {
            $rootScope.$broadcast("event:stop-play-audio");
        });

        function _init() {
            $scope.message.show_profile = false;
        }

        _init();
    }

    return {
        restrict: "E",
        scope: {
            message: "=",
            isLast: "="
        },
        link: _link,
        controller: "MessageCtrl",
        templateUrl: "templates/directives/message.html"
    };

}]);
