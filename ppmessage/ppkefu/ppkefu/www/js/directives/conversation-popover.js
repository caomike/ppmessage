ppmessageModule.directive("yvConversationPopover", [
    "$timeout",
    "yvConstants",
function ($timeout, yvConstants) {

    function _link($scope, $element, $attr) {

        function _close_popover(event) {
            $scope.event_count += 1;
            if ($scope.event_count === 1) {
                return; // the 'show popover' button is clicked
            }
            if (!event.target.hasAttribute("yv-no-close")) {
                $timeout(function () {
                    $scope.conversation.show_popover = false;
                });
            }
        }

        $scope.assignConversation = function () {
            $timeout(function () {
                $scope.conversation.show_popover = false;
                $scope.conversation.show_assign_popover = true;
            });
        };

        $scope.showAssign = function () {
            if ($scope.conversation.conv_type === yvConstants.CONVERSATION_TYPE.S2P) {
                return true;
            }
            return false;
        };

        $scope.$on("$destroy", function () {
            document.removeEventListener("click", _close_popover);
            document.removeEventListener("dragstart", _close_popover);
        });

        function _init() {
            $scope.popover = {};
            $scope.event_count = 0;
            document.addEventListener("click", _close_popover);
            document.addEventListener("dragstart", _close_popover);
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/conversation-popover.html",
        link: _link
    };

}]);
