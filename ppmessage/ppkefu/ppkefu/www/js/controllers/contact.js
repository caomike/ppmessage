ppmessageModule.controller("ContactCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "$stateParams",
    "yvSys",
    "yvLink",
    "yvMain",
    "yvUser",
    "yvBase",
    "yvConstants",
function ($scope, $state, $timeout, $stateParams, yvSys, yvLink, yvMain, yvUser, yvBase, yvConstants) {
    
    function openConversationCallback(conversation) {
        var params = {
            conv_uuid: conversation.uuid,
            conv_type: conversation.type,
            user_uuid: conversation.user_uuid
        };
        
        if (yvSys.in_pc()) {
            $state.go("app.conversation-list", params);
        } else {
            $state.go("app.conversation-list-mobile");
            $timeout(function () {
                $state.go("app.conversation-mobile", params);
            });
        }
    }
    
    
    $scope.chatWithContact = function () {
        var params = {
            member_list: [$scope.contact.uuid],
            conversation_name: $scope.contact.fullname,
            conversation_type: yvConstants.CONVERSATION_TYPE.S2S,
        };
        
        yvMain.open_conversation(params, openConversationCallback);
    };
    
    
    $scope.getIcon = function () {
        var icon = yvBase.get("object", $scope.contact.uuid, "icon");
        return yvLink.get_user_icon(icon);
    };

    
    $scope.$on("event:view-contact", function (event, _uuid) {
        _init(_uuid);
    });

    
    function _init(_contact_uuid) {
        if (_contact_uuid) {
            $scope.contact = yvBase.get("contact", _contact_uuid);
        } else {
            $scope.contact = {};
        }
    }

    _init($stateParams.contact_uuid);
}]);
