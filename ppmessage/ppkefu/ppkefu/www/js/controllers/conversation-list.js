ppmessageModule.controller("ConversationListCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "$rootScope",
    "$stateParams",
    "yvLog",
    "yvSys",
    "yvAPI",
    "yvBase",
    "yvMain",
    "yvLink",
    "yvAlert",
    "yvLogin",
    "yvLocal",
    "yvMessage",
    "yvDelegate",
    "yvConstants",
function ($scope, $state, $timeout, $rootScope, $stateParams, yvLog, yvSys, yvAPI, yvBase, yvMain, yvLink, yvAlert, yvLogin, yvLocal, yvMessage,
          yvDelegate, yvConstants) {

    /* we use collection-repeat, in result conversation could be undefined, must check it when use conversation */
    var delegate = yvDelegate.get_list_delegate("conversation-list");
    $scope.conversations = yvBase.get_scope("conversation");
    $scope.eableInfiniteScroll = true;
    $scope.canShowNoConversation = true;

    $scope.$on("event:online", function(event, params) {
        yvLog.log("receive online message in conversation-list");
        //params.type: online, params.online: true/false, params.user_uuid: user_uuid
        yvLog.log("params %o", params);
        //FIXME: should load converstation online which already set in yvObject
        //if conversation_type == P2S: care the portal user status
        //if conversation_type == S2S: ignore it
        //if show conversation users in the conversation dialog care all online messages
    });

    $scope.$on("$ionicView.beforeEnter", function (event, currentView) {
        yvLogin.check_session();
        if (yvSys.in_pc() && $stateParams.conv_uuid) {
            $timeout(function () {
                $rootScope.$broadcast("event:open-conversation", $stateParams);
            });
        }
    });

    $scope.getIcon = function (conversation) {
        if (!conversation) {
            return yvLink.default_user_icon();
        }
        var icon = null;
        if (conversation.type === yvConstants.CONVERSATION_TYPE.P2S) {
            icon = yvBase.get("object", conversation.user_uuid, "icon");
        } else {
            icon = conversation.icon;
        }
        return yvLink.get_user_icon(icon);
    };


    $scope.getFullname = function (conversation) {
        if (!conversation) {
            return "";
        }
        return yvBase.get("object", conversation.user_uuid, "fullname");
    };


    $scope.getConversationName = function (conversation) {
        if (!conversation) {
            return "";
        }
        if (conversation.type === yvConstants.CONVERSATION_TYPE.P2S) {
            return yvBase.get("object", conversation.user_uuid, "fullname");
        } else {
            return conversation.name;
        }
    };


    $scope.getTimestamp = function (conversation) {
        if (!conversation) {
            return "";
        }
        var message = conversation.latest_message;
        if (!message) {
            return "";
        }
        return yvLocal.format_timestamp(message.timestamp) || "";
    };


    $scope.getTitle = function (conversation) {
        if (!conversation) {
            return "";
        }
        var message = conversation.latest_message;
        if (!message) {
            return "";
        }
        return yvMessage.localize_title(message.title) || "";
    };


    $scope.getUnread = function (conversation) {
        if (!conversation) {
            return "";
        }
        var count = conversation.unread;
        return count > 99 ? "99+" : count;
    };


    $scope.getConversationClass = function (conversation) {
        if (yvSys.in_mobile()) {
            return "";
        }
        if (conversation === yvBase.active("conversation")) {
            return "active";
        }
        return "";
    };

    $scope.markAsRead = function (conversation, event) {
        yvMain.unread_zero(conversation);
        event.stopPropagation();
        delegate.closeOptionButtons();
    };

    $scope.deleteConversation = function (conversation, event) {
        if (conversation === yvBase.active("conversation")) {
            yvBase.active("conversation", null);
            if (yvSys.in_pc()) {
                $rootScope.$broadcast("event:open-conversation", null);
            }
        }
        yvMain.delete_conversation(conversation);
        yvAPI.close_conversation(conversation.uuid);
        delegate.closeOptionButtons();
        event.stopPropagation();
    };


    $scope.openConversation = function (conversation) {
        var _params = {
            conv_uuid: conversation.uuid,
            conv_type: conversation.type,
            user_uuid: conversation.user_uuid
        };

        delegate.closeOptionButtons();

        if (conversation === yvBase.active("conversation")) {
            if (yvSys.in_pc() && $state.is("app.conversation-list")) {
                return;
            }
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


    $scope.loadMoreConversation = function () {
        var page = $scope.conversations.page + 1;
        var args = { "page_offset": page, "page_size": yvSys.page_size() };

        yvAPI.get_conversation_page(args, function (res) {
            if (res.list.length < yvSys.page_size()) {
                $scope.eableInfiniteScroll = false;
            }
            yvMain.add_conversation_from_api_reserve(res.list);
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.conversations.page = page;
        }, _load_error, _load_error);

        function _load_error() {
            $scope.eableInfiniteScroll = false;
            $scope.$broadcast("scroll.infiniteScrollComplete");
            yvAlert.tip("app.GLOBAL.CANT_GET_MORE_CONVERSATIONS");
            $timeout(function () {
                $scope.eableInfiniteScroll = true;
            }, 5000);
        }
    };
    
    $scope.refreshConversations = function () {
        $scope.canShowNoConversation = false;
        var promise = yvMain.update_conversations_from_server();

        promise.then(function () {
            yvDelegate.scroll_resize("conversation-list-scroll");
        }, function () {
            yvAlert.tip("app.GLOBAL.CANT_REFRESH_CONVERSATIONS");
        });
        
        promise.finally(function () {
            $scope.eableInfiniteScroll = true;
            $scope.canShowNoConversation = true;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };
    
}]);
