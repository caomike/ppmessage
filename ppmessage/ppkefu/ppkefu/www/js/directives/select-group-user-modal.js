ppmessageModule.directive("yvSelectGroupUserModal", [
    "$ionicModal",
    "yvLog",
    "yvAPI",
    "yvLink",
    "yvBase",
function ($ionicModal, yvLog, yvAPI, yvLink, yvBase) {

    function _link($scope, $element, $attrs) {
        var conversation = null;
        $scope.users = [];
        
        $ionicModal.fromTemplateUrl("select-group-user-modal.html", {
            scope: $scope,
            animation: "slide-in-up"
        }).then(function (modal) {
            thisModal = modal;
        });

        $scope.$on("event:select-group-user-modal", function (event, params) {
            group = params.group;            
            conversation = params.conversation;

            $scope.users = [];
            angular.forEach(params.user_list, function (value) {
                $scope.users.push({
                    "uuid": value,
                    "is_selected": true
                });
            });
            
            $scope.showModal();
        });

        $scope.$on("$destroy", function () {
            thisModal && thisModal.remove();
        });

        $scope.getAvatar = function (contact) {
            if (!contact || !contact.uuid) {
                return yvLink.default_user_icon();
            }
            var icon = yvBase.get("object", contact.uuid, "icon");
            return yvLink.get_user_icon(icon);
        };

        $scope.getFullname = function (contact) {
            if (!contact || !contact.fullname) {
                return "";
            }
            return contact.fullname;
        };

        $scope.getSelectedNumber = function () {
            var number = 0;
            angular.forEach($scope.users, function (user) {
                user.is_selected && number++;
            });
            return number;
        };

        $scope.disableSave = function () {
            if ($scope.getSelectedNumber() == 0) {
                return true;
            }
            return false;
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
                "group_uuid": group.uuid,
                "conversation_uuid": conversation.uuid
            };
            
            yvAPI.update_conversation_member(params, function (res) {
                yvLog.log("-------------success add", res);
                conversation.group_uuid = group.uuid;
                thisModal && thisModal.hide();
            });
        };
        
        $scope.showModal = function () {
            thisModal && thisModal.show();
        };

        $scope.closeModal = function () {
            thisModal && thisModal.hide();
        };

    }

    
    return {
        restrict: "E",
        replace: true,
        scope: {
            
        },
        link: _link,
        templateUrl: "templates/directives/select-group-user-modal.html"
    };
}]);
