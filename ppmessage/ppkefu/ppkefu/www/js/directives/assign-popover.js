ppmessageModule.directive("yvAssignPopover", [
    "$timeout",
    "yvDB",
    "yvAPI",
    "yvLink",
    "yvAlert",
    "yvLocal",
    "yvBase",
function ($timeout, yvDB, yvAPI, yvLink, yvAlert, yvLocal, yvBase) {

    function _link($scope, $element, $attr) {

        function _update() {
            var _conv_uuid = $scope.conversation.conv_uuid;
            $scope.servants.length = 0;
            yvAPI.get_conversation(_conv_uuid, function (data) {
                if ($scope.conversation.assigned_uuid !== data.assigned_uuid) {
                    $scope.conversation.assigned_uuid = data.assigned_uuid;
                    // yvDB.assign_conversation(_conv_uuid, data.assigned_uuid, function () {
                    //     var _info = {"uuid": _conv_uuid, "assigned_uuid": data.assigned_uuid};
                    //     yvBase.set_conversation(_info);
                    // });
                }
            });
            // yvDB.query_servant_contacts(function (_o) {
            //     $timeout(function () {
            //         $scope.servants = _o;
            //     });
            // });
        }

        function _close_popover(event) {
            if (!event.target.hasAttribute("yv-no-close")) {
                $timeout(function () {
                    $scope.conversation.show_assign_popover = false;
                });
            }
        }

        $scope.getServantIcon = function (servant) {
            return yvLink.get_user_icon(servant.object_icon);
        };

        $scope.getServantStyle = function (servant) {
            if (servant.contact_uuid === $scope.conversation.assigned_uuid) {
                return {"color": "blue", "font-weight": "bold"};
            }
            return {};
        };

        $scope.assignConversation = function (servant) {
            var _conv_uuid = $scope.conversation.conv_uuid;
            yvAPI.assign_conversation(_conv_uuid, servant.contact_uuid, function () {
                // yvDB.assign_conversation(_conv_uuid, servant.contact_uuid, function () {
                //     var _text = yvLocal.translate("app.GLOBAL.ASSIGN_TO");
                //     var _info = {"uuid": _conv_uuid, "assigned_uuid": servant.contact_uuid};
                    
                //     yvBase.set_conversation(_info);
                //     yvAlert.tip(_text + servant.object_fullname, true);
                //     $timeout(function () {
                //         $scope.conversation.assigned_uuid = servant.contact_uuid;
                //         $scope.conversation.show_assign_popover = false;
                //     });
                // });
            });
        };

        $scope.$on("$destroy", function () {
            document.removeEventListener("click", _close_popover);
            document.removeEventListener("dragstart", _close_popover);
        });

        function _init() {
            $scope.servants = [];
            document.addEventListener("click", _close_popover);
            document.addEventListener("dragstart", _close_popover);

            _update();
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/assignpopover.html",
        link: _link
    };

}]);
