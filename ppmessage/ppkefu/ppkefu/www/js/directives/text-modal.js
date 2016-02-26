ppmessageModule.directive("yvTextModal", [
    "$ionicModal",
    "yvSys",
    "yvLink",
function ($ionicModal, yvSys, yvLink) {

    function _link($scope, $element, $attr) {

        $ionicModal.fromTemplateUrl('text-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.textModal = modal;
        });

        $scope.showModal = function () {
            $scope.textModal.show();
        };

        $scope.closeModal = function (event) {
            yvLink.open_link(event, function () {
                $scope.textModal.hide();
            });
        };

        $scope.isContentEditable = function () {
            if (yvSys.in_mobile_app()) {
                return false;
            }
            return true;
        };

        $scope.$on("event:show-text-modal", function (event, content) {
            $scope.content = content;
            $scope.showModal();
        });

        $scope.$on('$destroy', function () {
            $scope.textModal.remove();
        });

    }

    return {
        restrict: "E",
        scope: true,
        templateUrl: "templates/directives/textmodal.html",
        link: _link
    };

}]);
