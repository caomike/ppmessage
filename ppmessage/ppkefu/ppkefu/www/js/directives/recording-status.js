ppmessageModule.directive("yvRecordStatus", [
    "yvConstants",
function (yvConstants) {

    function _link($scope, $element, $attr) {

        $scope.showCancel = function () {
            if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING_CANCEL) {
                return true;
            }
            return false;
        };

        $scope.showPressure = function () {
            if ($scope.chatStatus.status === yvConstants.CHAT_STATUS.RECORDING) {
                return true;
            }
            return false;
        };

    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/recordingstatus.html",
        link: _link
    };
}]);
