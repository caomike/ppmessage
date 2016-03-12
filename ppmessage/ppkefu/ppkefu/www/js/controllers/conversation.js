ppmessageModule.controller("ConversationCtrl", [
    "$scope",
    "$timeout",
    "$rootScope",
    "$stateParams",
    "$ionicLoading",
    "yvAPI",
    "yvSys",
    "yvLog",
    "yvMain",
    "yvNoti",
    "yvBase",
    "yvAlert",
    "yvLocal",
    "yvMessage",
    "yvDelegate",
    "yvConstants",
function ($scope, $timeout, $rootScope, $stateParams, $ionicLoading, yvAPI, yvSys, yvLog, yvMain, yvNoti, yvBase, yvAlert, yvLocal, yvMessage,
          yvDelegate, yvConstants) {

    var page_size = 12;
    $scope.inMobile = yvSys.in_mobile();
    $scope.chatStatus = { "status": yvConstants.CHAT_STATUS.NULL };

    _init_common();
    _init_typing_animate();
    
    $scope.$on("$ionicView.beforeEnter", function () {
        if (yvSys.in_mobile()) {
            $ionicLoading.show();
        }
    });
    
    $scope.$on("$ionicView.enter", function () {
        if (yvSys.in_mobile()) {
            _init_core($stateParams);
        }
    });

    $scope.$on('$destroy', function () {
        clearInterval($scope.typingInterval);
        yvBase.active("conversation", null);
        $scope.$broadcast("event:save-chat-text", $scope.conversation);
        if ($scope.conversation && $scope.conversation.uuid) {
            yvNoti.unwatch_typing($scope.conversation.uuid);
        }
    });

    $scope.$on("event:open-conversation", function (event, params) {
        if ($scope.conversation && $scope.conversation.uuid) {
            yvNoti.unwatch_typing($scope.conversation.uuid);
        }
        $scope.$broadcast("event:save-chat-text", $scope.conversation);
        $ionicLoading.show();
        _init_core(params);
    });

    $scope.$on("event:typing", function(event, params) {
        console.log("receiving typing message in conversation.");
        $timeout(function() {
            var _name = yvBase.get("object", params.user_uuid, "fullname");
            $scope.typingName = _name;
            if ($scope.typingAnimateIndex == 0) {
                $scope.typingTitle = _name + yvLocal.translate("app.GLOBAL.TYPING");
            }
            $scope.typingValue = 3;
        });
    });

    function _stop_loading() {
        $timeout(function () {
            yvDelegate.scroll_bottom("conversation-scroll", true);
        });
        $ionicLoading.hide();
    }

    function _init_common() {
        $scope.title = "";
        $scope.messages = [];
        $scope.valid = false;
        $scope.api_uuid = null;
        $scope.titleClass = "";
        $scope.conversation = {};
        $scope.showMember = false;
        $scope.timestamp = { "pre": 0};
        $scope.max_display_count = page_size;
    }

    function _init_typing_animate() {
        $scope.typingAnimateIndex = 0;
        $scope.typingAnimate = [
            yvLocal.translate("app.GLOBAL.TYPING") + ".",
            yvLocal.translate("app.GLOBAL.TYPING") + "..",
            yvLocal.translate("app.GLOBAL.TYPING") + "...",
        ];
        $scope.typingInterval = setInterval(function() {
            if ($scope.typingValue > 0) {
                $scope.typingValue--;
                var _value = $scope.typingAnimateIndex % 3;
                $scope.$apply(function() {
                    $scope.typingTitle = $scope.typingName + $scope.typingAnimate[_value];
                });
                if ($scope.typingValue == 0) {
                    $scope.$apply(function() {
                        $scope.typingTitle = null;
                    });
                    $scope.typingName = null;
                    $scope.typingAnimateIndex = 0;
                } else {
                    $scope.typingAnimateIndex++;
                }
            }
        }, 1000);
    }

    function _init_valid (conversation) {
        $scope.valid = true;
        $scope.timestamp.pre = 0;
        $scope.showMember = false;
        $scope.titleClass = "arrow-down";
        $scope.api_uuid = yvSys.get_uuid();
        $scope.conversation = conversation;
        $scope.max_display_count = page_size;
        $scope.messages = conversation.messages;

        if (conversation.type === yvConstants.CONVERSATION_TYPE.S2S) {
            $scope.title = conversation.name;
        } else if (conversation.type === yvConstants.CONVERSATION_TYPE.P2S) {
            $scope.title = yvBase.get("object", conversation.user_uuid, "fullname");
        }
        
        _load_messages();
        yvMain.unread_zero(conversation);
        yvNoti.watch_typing(conversation.uuid);
        $scope.$broadcast("event:restore-chat-text", conversation);
    }
    
    function _init_core(params) {
        if (!params || !params.conv_uuid) {
            _init_common();
            _stop_loading();
            return;
        }
        var conversation = yvBase.get("conversation", params.conv_uuid);
        if (conversation === null) {
            _init_common();
            _stop_loading();
            return;
        }
        _init_valid(conversation);
    }

    function _load_messages() {
        var api_uuid = $scope.api_uuid;
        var conversation = $scope.conversation;
        var args = {
            "page_offset": 0,
            "page_size": page_size,
            "conversation_uuid": conversation.uuid
        };

        if (conversation.messages.length) {
            _stop_loading();
            return;
        }

        yvAPI.get_page_history_message(args, function (response) {
            angular.forEach(response.list, function (message) {
                conversation.messages.unshift(yvMessage.history_message(message));
            });
            conversation._refresh();
            if (api_uuid == $scope.api_uuid) {
                _stop_loading();
            }
        }, __get_local_messages, __get_local_messages);

        function __get_local_messages() {
            yvMain.load_conversation_messages(conversation, function (length) {
                if (api_uuid == $scope.api_uuid) {
                    _stop_loading();
                }
            });
        }
    }


    function _get_history_messages() {
        var api_uuid = $scope.api_uuid;
        var conversation = $scope.conversation;
        var args = { "page_size": page_size, "conversation_uuid": conversation.uuid };

        if (conversation.messages.length == 0) {
            args.page_offset = 0;
        } else {
            args.max_uuid = conversation.messages[0].task_uuid;
        }

        yvAPI.get_page_history_message(args, function (response) {
            var repeat_count = 0;
            angular.forEach(response.list, function (message) {
                message = yvMessage.history_message(message);
                if (conversation.has_message(message)) {
                    repeat_count += 1;
                    return;
                }
                message.disableScroll = true;
                conversation.messages.unshift(message);
            });

            conversation._refresh();
            
            if (api_uuid == $scope.api_uuid) {
                $scope.$broadcast("scroll.refreshComplete");
                $scope.max_display_count += response.list.length - repeat_count;                
                if (response.list.length == repeat_count) {
                    yvAlert.tip("app.GLOBAL.NO_MORE_HISTORY_MESSAGES");
                }
            }
        }, __error, __error);
        
        function __error() {
            if (api_uuid == $scope.api_uuid) {
                yvAlert.tip("app.GLOBAL.CANT_GET_MORE_HISTORY_MESSAGES");
            }
        }
    }


    $scope.showMessage = function (message) {
        var number = $scope.messages.length - $scope.messages.indexOf(message);
        return number <= $scope.max_display_count;
    };


    $scope.getContentBottomStyle = function () {
        var _s = $scope.chatStatus.status,
            _S = yvConstants.CHAT_STATUS,
            _b = 49;

        if (!$scope.conversation || !$scope.valid) {
            return {"bottom": "0px"};
        }

        if (yvSys.in_pc()) {
            return {"bottom": "180px"};
        }

        if (_s === _S.NULL) {
            return {"bottom": _b + "px"};
        }

        if (_s === _S.TEXTING) {
            if (yvSys.in_mobile_app()) {
                if (cordova.plugins.Keyboard.isVisible) {
                    _b = _b + yvSys.get_keyboard_height();
                }
            }
            return {"bottom": _b + "px"};
        }

        if (_s === _S.RECORDING_PRE || _s === _S.RECORDING || _s === _S.RECORDING_CANCEL || _s === _S.ADDING) {
            _b = _b + yvSys.get_keyboard_height();
            return {"bottom": _b + "px"};
        }

        return {"bottom": _b + "px"};
    };


    $scope.deleteMessage = function (message) {
        yvMain.delete_message($scope.conversation, message);
    };


    $scope.doRefresh = function () {
        $scope.timestamp.pre = 0;
        var difference = $scope.messages.length - $scope.max_display_count;

        if (difference <= 0) {
            _get_history_messages();
            return;
        }

        var increment = difference < page_size ? difference : page_size;
        $scope.max_display_count += increment;
        $scope.$broadcast("scroll.refreshComplete");
    };


    $scope.sendMessage = function (message) {
        yvMain.send_message($scope.conversation, message);
    };

    $scope.showImageModal = function (image) {
        $rootScope.$broadcast("event:show-image-modal", image);
    };

    $scope.showTextModal = function (content) {
        $rootScope.$broadcast("event:show-text-modal", content);
    };
    
    $scope.toggleShowMember = function () {
        $scope.showMember = !$scope.showMember;
        $scope.titleClass = $scope.showMember ? "arrow-up" : "arrow-down";
    };

}]);
