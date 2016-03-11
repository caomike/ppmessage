ppmessageModule.controller("ConversationListCtrl", [
    "$scope",
    "$timeout",
    "$rootScope",
    "$stateParams",
    "yvLog",
    "yvSys",
    "yvAPI",
    "yvBase",
    "yvMain",
    "yvAlert",
    "yvLogin",
    "yvDelegate",
    "yvConstants",
function ($scope, $timeout, $rootScope, $stateParams, yvLog, yvSys, yvAPI, yvBase, yvMain, yvAlert, yvLogin, yvDelegate, yvConstants) {

    var content_delegate = yvDelegate.get_scroll_delegate("conversation-list-scroll");

    $scope.showS2S = true;
    $scope.showP2S = true;
    $scope.showOnline = true;
    $scope.showOffline = true;
    $scope.showFilterBar = true;
    $scope.eableInfiniteScroll = true;
    $scope.canShowNoConversation = true;

    $scope.conversations = yvBase.get_scope("conversation");
    
    $scope.$on("$ionicView.beforeEnter", function (event, currentView) {
        yvLogin.check_session();
        if (yvSys.in_pc() && $stateParams.conv_uuid) {
            $timeout(function () {
                $rootScope.$broadcast("event:open-conversation", $stateParams);
            });
        }
    });
    
    $scope.showConversation = function (conversation) {
        if (!conversation.show) return false;
        var type_filter = false;
        var status_filter = false;

        switch (conversation.type) {
        case yvConstants.CONVERSATION_TYPE.S2S:
            if ($scope.showOnline) status_filter = true;
            if ($scope.showS2S) type_filter = true;
            break;
        case yvConstants.CONVERSATION_TYPE.P2S:
            var status = yvMain.is_conversation_online(conversation);
            if (($scope.showOnline && status) || ($scope.showOffline && !status)) status_filter = true;
            if ($scope.showP2S) type_filter = true;
            break;
        }
        return type_filter && status_filter;
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
            if (yvSys.in_pc()) {
                $rootScope.$broadcast("event:open-conversation", null);
            }
        }, function () {
            yvAlert.tip("app.GLOBAL.CANT_REFRESH_CONVERSATIONS");
        });
        
        promise.finally(function () {
            $scope.eableInfiniteScroll = true;
            $scope.canShowNoConversation = true;
            $scope.$broadcast("scroll.refreshComplete");
        });
    };

    $scope.onScroll = function () {
        var min = yvSys.in_mobile() ? 0 : -5;
        var max = 5;
        var position = content_delegate.getScrollPosition();
        if (position.top <= min) {
            if ($scope.showFilterBar == false) {
                $timeout(function () {
                    $scope.showFilterBar = true;
                    content_delegate.resize();
                });
            }
            return;
        }
        if (position.top >= max) {
            if ($scope.showFilterBar == true) {
                $timeout(function () {
                    $scope.showFilterBar = false;
                    content_delegate.resize();
                });
            }
        }
    };
        
}]);
