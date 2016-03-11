ppmessageModule.directive("yvConversation", [
    "$state",
    "$timeout",
    "$rootScope",
    "yvSys",
    "yvAPI",
    "yvLog",
    "yvMain",
    "yvLink",
    "yvLocal",
    "yvBase",
    "yvMessage",
    "yvDelegate",
    "yvConstants",
function ($state, $timeout, $rootScope, yvSys, yvAPI, yvLog, yvMain, yvLink, yvLocal, yvBase, yvMessage, yvDelegate, yvConstants) {

    function link($scope, $element, $attrs) {
        var delegate = yvDelegate.get_list_delegate("conversation-list");

        $scope.isOnline = function (conversation) {
            return yvMain.is_conversation_online(conversation);
        };

        $scope.getIcon = function (conversation) {
            var icon = null;
            if (conversation.type === yvConstants.CONVERSATION_TYPE.P2S) {
                icon = yvBase.get("object", conversation.user_uuid, "icon");
            } else {
                icon = conversation.icon;
            }
            return yvLink.get_user_icon(icon);
        };


        $scope.getConversationName = function (conversation) {
            if (conversation.type === yvConstants.CONVERSATION_TYPE.P2S) {
                return yvBase.get("object", conversation.user_uuid, "fullname");
            } else {
                return conversation.name;
            }
        };


        $scope.getTimestamp = function (conversation) {
            var message = conversation.latest_message;
            if (!message) {
                return "";
            }
            return yvLocal.format_timestamp(message.timestamp) || "";
        };


        $scope.getTitle = function (conversation) {
            var message = conversation.latest_message;
            if (!message) {
                return "";
            }
            return yvMessage.localize_title(message.title) || "";
        };


        $scope.getUnread = function (conversation) {
            var count = conversation.unread;
            return count > 99 ? "99+" : count;
        };

        $scope.deleteConversation = function (conversation, event) {
            event.stopPropagation();
            delegate.closeOptionButtons();
            if (conversation === yvBase.active("conversation")) {
                yvBase.active("conversation", null);
                if (yvSys.in_pc()) {
                    $rootScope.$broadcast("event:open-conversation", null);
                }
            }
            yvMain.delete_conversation(conversation);
            yvAPI.close_conversation(conversation.uuid);            
        };


        $scope.showContextMenu = function (event) {
            console.log("---------right click", event);
            console.log("broadcast the event");
            $scope.$parent.$parent.$broadcast("event:open-menu", event, $scope.conversation);
        };


        $scope.markAsRead = function (conversation, event) {
            event.stopPropagation();
            delegate.closeOptionButtons();
            yvMain.unread_zero(conversation);
        };


        $scope.openConversation = function (conversation) {
            var _params = {
                conv_uuid: conversation.uuid,
                conv_type: conversation.type,
                user_uuid: conversation.user_uuid
            };

            console.log(">>>>> Click conversaiton: ", conversation);
            delegate.closeOptionButtons();

            if (yvSys.in_pc() && $state.is("app.conversation-list") && conversation.active) {
                return;
            }

            yvBase.active("conversation", conversation);
            if (yvSys.in_pc()) {
                if ($state.is("app.conversation-list")) {
                    $rootScope.$broadcast("event:open-conversation", _params);
                } else {
                    $state.go("app.conversation-list", _params);
                }
            } else {
                $state.go("app.conversation-list-mobile");
                $timeout(function () {
                    $state.go("app.conversation-mobile", _params);
                });
            }
        };

        function _init() {
            $scope.isDesktop = yvSys.in_pc_browser() || yvSys.in_electron();

            // $element.on("contextmenu", function(e) {
            //     if (e.preventDefault) {
            //         e.preventDefault();
            //     } else {
            //         windows.event.returnValue = false;
            //     }
            //     $scope.$broadcast('event:open-menu', e);
            // });
        };

        _init();

    }

    return {
        restirct: "E",
        replace: true,
        scope: {
            conversation: "=",
        },
        link: link,
        templateUrl: "templates/directives/conversation.html"
    };

}]);
