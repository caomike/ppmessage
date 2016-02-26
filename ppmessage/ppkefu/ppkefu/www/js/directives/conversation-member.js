ppmessageModule.directive("yvConversationMember", [
    "$timeout",
    "$rootScope",
    "yvLog",
    "yvAPI",
    "yvUser",
    "yvBase",
    "yvLink",
function ($timeout, $rootScope, yvLog, yvAPI, yvUser, yvBase, yvLink) {

    function _link($scope, $element, $attrs) {
        $scope.members = [];
        $scope.removeMode = false;
        
        document.addEventListener("click", _close);
        document.addEventListener("dragstart", _close);
        
        yvAPI.get_conversation_user_list($scope.conversation.uuid, function (res) {
            angular.forEach(res.list, function (user) {
                $scope.members.push(user.uuid);
            });
        });


        $scope.$on("$destroy", function () {
            document.removeEventListener("click", _close);
            document.removeEventListener("dragstart", _close);
        });

        
        function _close(event) {
            var target = angular.element(event.target);

            // if user click the toggle button, ignore ...
            if (target.hasClass("toggle-conversation-member")) {
                return;
            }

            // if user click area outside this directive, close ...
            if (!_isParentOrSelf(target, ".conversation-member")) {
                $timeout(function () {
                    $scope.toggleShowMember();
                });
            }
        }

        function _isParentOrSelf(child, parent) {
            return child.parents(parent).length || child.closest(parent).length; 
        }
        
        $scope.toggleRemoveMode = function () {
            $scope.removeMode = !$scope.removeMode;
        };

        
        $scope.isMe = function (member) {
            return member == yvUser.get("uuid");
        };

        
        $scope.removeMember = function (member) {
            var params = {
                "action": "REMOVE",
                "member_list": [member],
                "conversation_uuid": $scope.conversation.uuid
            };
            yvAPI.update_conversation_member(params, function (res) {
                var index = $scope.members.indexOf(member);
                $scope.members.splice(index, 1);
            });          
        };
        
        
        $scope.addMember = function () {
            $scope.toggleShowMember();
            $rootScope.$broadcast("event:add-member-modal", $scope.conversation, $scope.members);
        };


        $scope.getAvatar = function (uuid) {
            var icon = yvBase.get("object", uuid, "icon");
            return yvLink.get_user_icon(icon);
        };

        
        $scope.getFullname = function (uuid) {
            return yvBase.get("object", uuid, "fullname");
        };
        
    }
    
    return {
        restrict: "E",
        link: _link,
        templateUrl: "templates/directives/conversation-member.html"
    };

}]);
