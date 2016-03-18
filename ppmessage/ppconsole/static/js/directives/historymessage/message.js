angular.module("this_app").
    directive("yvMessage", [
        "$rootScope",
        "$timeout",
        "yvConstants",
        "yvType",
        "yvUtil",
        function ($rootScope, $timeout, yvConstants, yvType, yvUtil) {

            function _link($scope, $element, $attrs) {

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

                };

                $scope.viewLocation = function (message) {

                };

                $scope.viewCard = function (card) {
                    // fixme: broadcast a cardModal show event
                };

                $scope.showAlertIcon = function (message) {
                    if (yvType.is_right(message) && message.message_status === yvConstants.SEND_STATUS.SEND_ERROR) {
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

                $scope.getUserIcon = function (message) {
                    return message.user_icon;
                };

                $scope.getMessageClass = function (message) {
                    var _class = "";

                    if (yvType.is_left(message)) {
                        _class += " yv-left ";
                    } else if (yvType.is_right(message)) {
                        _class += " yv-right ";
                    }

                    _class += " yv-pc ";
                    return _class;
                };

                //if the interval chat message is more than one minute
                $scope.shouldShowTimestamp = function (message) {
                    var last_message = $scope.lastMessage;
                    if(!last_message) {
                        return true;
                    }
                    var last_message_timestamp = last_message.message_timestamp;
                    var this_message_timestamp = message.message_timestamp;
                    var times = this_message_timestamp - last_message_timestamp;
                    if(times>60) {
                        return true;
                    }
                    return false;
                };

                $scope.getTimestamp = function (message) {
                    var _timestamp = message.message_timestamp*1000;
                    return yvUtil.formateTimestamp(_timestamp);
                };

                $scope.getFontStyle = function () {
                    return {};
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
                    isLast: "=",
                    lastMessage: "=",
                },
                link: _link,
                // controller: "MessageCtrl",
                templateUrl: yvConstants.STATIC_PREFIX + "html/directive/message.html"
            };

        }]);
