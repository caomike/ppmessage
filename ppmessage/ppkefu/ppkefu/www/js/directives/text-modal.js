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
            $scope.inMobile = yvSys.in_mobile();
        });

        $scope.showModal = function () {
            $scope.textModal.show();
        };

        $scope.closeModal = function (event) {
                $scope.textModal.hide();
        };

        $scope.clickContent = function (event) {
            yvLink.open_link(event);
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
