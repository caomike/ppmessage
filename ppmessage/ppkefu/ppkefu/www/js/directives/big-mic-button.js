ppmessageModule.directive("yvBigMicButton", [
    "$timeout",
    "$ionicGesture",
    "yvConstants",
    "yvFile",
    "yvSys",
    "yvLocal",
function ($timeout, $ionicGesture, yvConstants, yvFile, yvSys, yvLocal) {

    function _link($scope, $element, $attr) {

        function _count_cb() {
            var min_height = null, level_meter = null;

            $timeout(function () {
                $scope.record.duration += 1;
            });

            if (yvSys.in_ios_app()) {
                level_meter = Math.pow(10, 0.01 * $scope.record.media._levelMeter);
                if (level_meter !== null) {
                    min_height = 50 * level_meter + 5 + "px";
                } else {
                    min_height = 5 + "px";
                }
                $timeout(function () {
                    $scope.record.pressureHeight = {"min-height": min_height};
                });
            } else if (yvSys.in_android_app()) {
                $scope.record.media.readAudioLevel(function (level) {
                    level_meter = 0.00008 * level;
                    if (isFinite(level_meter)) {
                        min_height = 40 * level_meter + 15 + "px";
                    } else {
                        min_height = 15 + "px";
                    }
                    $timeout(function () {
                        console.log("---------height:", min_height);
                        $scope.record.pressureHeight = {"min-height": min_height};
                    });
                });
            }
        }

        function _start_in_mobile() {
            var root = null;
            var file_name = yvSys.get_uuid();

            if (yvSys.in_ios_app()) {
                root = "documents://";
                file_name = file_name + ".m4a";
            } else if (yvSys.in_android_app()) {
                root = yvFile.get_root_dir();
                file_name = file_name + ".amr";
            } else {
                console.error("unsupported platform");
                return;
            }

            yvFile.create_nodata(file_name, function (file) {
                $scope.record.media_file = file.name;
                $scope.record.media = new Media(root + file.name, function () {
                    yvFile.read_as_dataurl($scope.record.media_file, function (result) {
                        console.log("amr file size:", result.length / 1024, "kb");
                    });
                }, function (error) {
                    console.log("record error", error);
                    _stop(false);
                }, function (status) {
                    console.log("record status:", status);
                });

                $scope.record.media.startRecord();
            }, null);
        }

        function _stop(_need_send) {
            if ($scope.record.count_interval) {
                clearInterval($scope.record.count_interval);
                $scope.record.count_interval = null;
            }

            if ($scope.record.media) {
                $scope.record.media.stopRecord();
                $scope.record.media.release();
                $scope.record.media = null;
            }

            if (yvSys.in_mobile_app() && _need_send) {
                var _message = {dura: $scope.record.duration, url: $scope.record.media_file};
                $scope.prepareAudio(_message);
            }
        }

        function _start() {
            $scope.record.duration = 0;
            $scope.record.media = null;
            $scope.record.media_file = null;
            $scope.record.count_interval = setInterval(_count_cb, 1000);
            $scope.record.note = yvLocal.translate("app.GLOBAL.RECORD_CANCEL");

            if (yvSys.in_mobile_app()) {
                _start_in_mobile();
            }

        }

        function _drag_gesture_cb(e) {
            if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING) {
                if (e.gesture.deltaY < -30) {
                    _stop(false);
                    $scope.record.note = yvLocal.translate("app.GLOBAL.RECORD_RELEASE");
                    $timeout(function () {
                        $scope.chatStatus.status = yvConstants.CHAT_STATUS.RECORDING_CANCEL;
                    });
                } else {
                    $scope.record.note = yvLocal.translate("app.GLOBAL.RECORD_CANCEL");
                }
            }
        }

        function _hold_gesture_cb(e) {
            if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING_PRE) {
                $timeout(function () {
                    $scope.chatStatus.status = yvConstants.CHAT_STATUS.RECORDING;
                });
                _start();
            }
        }

        function _release_gesture_cb(e) {
            if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING) {
                _stop(true);
                console.log("save and send record: " + $scope.record.duration);
            } else if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING_CANCEL) {
                _stop(false);
                console.log("cancel record: " + $scope.record.duration);
            }

            $timeout(function () {
                $scope.chatStatus.status = yvConstants.CHAT_STATUS.RECORDING_PRE;
            });
        }

        $scope.prepareAudio = function (_message) {
            if (_message && _message.dura > 0) {
                $scope.sendMessage({type: yvConstants.MESSAGE_SUBTYPE.AUDIO, data: _message});
            } else {
                console.log("speak too short to send.");
            }
        };

        $scope.showRecordStatus = function () {
            var _s = $scope.chatStatus.status,
                _S = yvConstants.CHAT_STATUS;
            if (_s === _S.RECORDING || _s === _S.RECORDING_CANCEL) {
                return true;
            }
            return false;
        };

        function _init() {
            var _record_btn = angular.element(document.getElementById("record-btn")),
                _drag_gesture = $ionicGesture.on('drag', _drag_gesture_cb, _record_btn),
                _hold_gesture = $ionicGesture.on("hold", _hold_gesture_cb, _record_btn),
                _release_gesture = $ionicGesture.on("release", _release_gesture_cb, _record_btn);

            $scope.record = {
                media: null,
                media_file: null,
                count_interval: null,
                duration: 0,
                pressureHeight: {"min-height": "40px"},
                note: yvLocal.translate("app.GlOBAL.RECORD_CANCEL")
            };

            $scope.$on("$destroy", function () {
                $ionicGesture.off(_drag_gesture, "drag", _drag_gesture_cb);
                $ionicGesture.off(_hold_gesture, "hold", _hold_gesture_cb);
                $ionicGesture.off(_release_gesture, "release", _release_gesture_cb);
                _drag_gesture = null;
                _hold_gesture = null;
                _release_gesture = null;
            });
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/bigmicbutton.html",
        link: _link
    };

}]);
