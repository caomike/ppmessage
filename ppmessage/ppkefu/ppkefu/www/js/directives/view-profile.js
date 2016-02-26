ppmessageModule.directive("yvViewProfile", [
    "$rootScope",
    "$timeout",
    "yvBase",
    "yvConstants",
    "yvDB",
function ($rootScope, $timeout, yvBase, yvConstants, yvDB) {

    function _link($scope, $element, $attr) {

        function _close_popover(event) {
            $scope.click_count += 1;
            if ($scope.click_count === 1) {
                return;
            }
            if (!event.target.hasAttribute("yv-no-close")) {
                $timeout(function () {
                    $scope.message.show_profile = false;
                });
            }
        }

        $scope.getUserFullname = function (message) {
            return yvBase.get("object", message.from_uuid, "fullname");
        };

        $scope.getContactType = function (message) {
            return yvBase.get("contact", message.from_uuid, "type");
        };

        $scope.chatWithContact = function (message) {
            var _conv_type,
                _object = yvBase.get("object", message.from_uuid);

            function __close() {
                $timeout(function () {
                    $scope.message.show_profile = false;
                });
            }

            if (!_object) {
                __close();
                return;
            }

            if (message.from_uuid === yvBase.active("conversation").user_uuid) {
                __close();
                return;
            }

            if (_object.is_portal_user) {
                _conv_type = yvConstants.CONVERSATION_TYPE.S2P;
            } else if (_object.is_service_user) {
                _conv_type = yvConstants.CONVERSATION_TYPE.S2S;
            } else {
                console.log("can't distingush contact type by object uuid:", message.from_uuid);
                __close();
                return;
            }

            yvDB.open_conversation(message.from_uuid, _conv_type, function (_conv_uuid, _assigned_uuid) {
                var _p = {
                    conv_uuid: _conv_uuid,
                    conv_type: _conv_type,
                    object_uuid: message.from_uuid,
                    assigned_uuid: _assigned_uuid,
                    history: false
                };
                $scope.$emit("event:open-conversation", _p);
                __close();
            });
        };

        $scope.$on("$destroy", function () {
            document.removeEventListener("click", _close_popover);
            document.removeEventListener("dragstart", _close_popover);
        });

        function _init() {
            $scope.click_count = 0;
            document.addEventListener("click", _close_popover);
            document.addEventListener("dragstart", _close_popover);
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/view-profile.html",
        link: _link
    };

}]);
