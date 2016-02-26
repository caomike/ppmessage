ppmessageModule.directive("yvAddMemberByGroup", [
    "yvDB",
    "yvLog",
    "yvAPI",
    "yvLink",
    "yvBase",
function (yvDB, yvLog, yvAPI, yvLink, yvBase) {

    function _link($scope, $element, $attrs) {
        var selected_gid = null;
        var current_gid = $scope.conversation.group_uuid;
        
        $scope.users = [];
        $scope.groups = [];
        
        yvAPI.get_app_org_group_list(null, function (res) {
            $scope.groups = res.list;
        });
        
        $scope.isCurrentGroup = function (group) {
            return group.uuid == current_gid;
        };

        $scope.isSelectedGroup = function (group) {
            return group.uuid == selected_gid;
        };

        $scope.getImageClass = function (group) {
            return group.uuid == selected_gid ? "selected" : "";
        };
        
        $scope.getGroupIcon = function (group) {
            return yvLink.get_user_icon(group.group_icon);
        };

        $scope.getGroupName = function (group) {
            return group.group_name;
        };

        $scope.save = function () {
            var members = [];
            angular.forEach($scope.users, function (user) {
                if (user.is_selected) {
                    members.push(user.uuid);
                }
            });
            var params = {
                "action": "ADD",
                "member_list": members,
                "group_uuid": selected_gid,
                "conversation_uuid": $scope.conversation.uuid
            };

            yvAPI.update_conversation_member(params, function (res) {
                $scope.conversation.group_uuid = selected_gid;
                yvDB.update_conversation_group($scope.conversation);
                $scope.closeModal();
            });
        };

        $scope.setGroup = function (group) {
            if ($scope.isCurrentGroup(group)) {
                // fixme: should reset conversation group ?
                return;
            }
            var params = {
                "group_uuid": group.uuid,
                "conversation_uuid": $scope.conversation.uuid
            };

            yvAPI.get_selected_group_user(params, function (res) {
                $scope.users.length = 0;
                selected_gid = group.uuid;
                angular.forEach(res.list, function (gid) {
                    $scope.users.push({ "uuid": gid, "is_selected": true });
                });
            });
        };

    }

    return {
        restrict: "E",
        replace: true,
        link: _link,
        templateUrl: "templates/directives/add-member-by-group.html"
    };

}]);
