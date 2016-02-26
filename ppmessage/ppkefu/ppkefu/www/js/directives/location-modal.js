ppmessageModule.directive("yvLocationModal", [
    "$ionicModal",
function ($ionicModal) {

    function _link($scope, $element, $attr) {

        $ionicModal.fromTemplateUrl('location-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.showViewPosition = false;
            $scope.locationModal = modal;
        });

        $scope.showModal = function () {
            $scope.locationModal.show();
        };

        $scope.closeModal = function () {
            $scope.locationModal.hide();
        };

        $scope.$on("event:show-location-modal", function () {
            $scope.showViewPosition = true;
            $scope.showModal();
        });

        $scope.$on("modal.hidden", function (event, modal) {

            /* In Android, when location modal is shown,
             * if you click hardware back-button, the modal will hide,
             * but $scope.closeLocationModal() will not be invoked!
             * We must destroy yv-view-position when modal is hidden.
             */
            $scope.showViewPosition = false;
        });

        $scope.$on('$destroy', function () {
            $scope.locationModal.remove();
        });
    }

    return {
        restrict: "E",
        scope: {
            location: "="
        },
        templateUrl: "templates/directives/locationmodal.html",
        link: _link
    };

}]);
