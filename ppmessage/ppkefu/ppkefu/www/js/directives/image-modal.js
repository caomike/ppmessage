ppmessageModule.directive("yvImageModal", [
    "$timeout",
    "$ionicModal",
    "$ionicActionSheet",
    "$ionicScrollDelegate",
    "yvAlert",
    "yvSys",
    "yvLocal",
function ($timeout, $ionicModal, $ionicActionSheet, $ionicScrollDelegate, yvAlert, yvSys, yvLocal) {

    function _link($scope, $element, $attr) {

        function _save_image_in_mobile() {
            var image = new Image();
            $scope.disable.save = true;

            image.onload = function () {
                var canvas = document.createElement("canvas");

                function __success() {
                    $timeout(function () {
                        $scope.disable.save = false;
                        yvAlert.toast(yvLocal.translate("app.GLOBAL.SAVE_PHOTO_SUCCESS"));
                    });
                }

                function __fail() {
                    $timeout(function () {
                        $scope.disable.save = false;
                        yvAlert.toast(yvLocal.translate("app.GLOBAL.SAVE_PHOTO_FAILURE"));
                    });
                }

                canvas.height = image.height;
                canvas.width = image.width;
                canvas.getContext("2d").drawImage(image, 0, 0);
                window.canvas2ImagePlugin.saveImageDataToLibrary(__success, __fail, canvas);
            };

            image.src = $scope.imgSrc;
        }

        $scope.showModal = function () {
            $ionicScrollDelegate.$getByHandle("image-scroll").zoomTo(1);
            $scope.imageModal.show();
        };

        $scope.closeModal = function () {
            $scope.hide.bars = false;
            $scope.imageModal.hide();
        };

        $scope.onHold = function () {
            if (!yvSys.in_mobile_app()) {
                return;
            }
            var actionSheet = $ionicActionSheet.show({
                cancelText: yvLocal.translate("app.GLOBAL.CANCEL"),
                cancel: function() {
                    actionSheet();
                },
                buttons: [
                    { text: yvLocal.translate("app.GLOBAL.SAVE") },
                ],
                buttonClicked: function(index) {
                    if (index === 0) {
                        _save_image_in_mobile();
                    }
                    return true;
                }
            });
        };
        
        $scope.saveImage = function () {
            _save_image_in_mobile();
            // In PC. right click the image to save
        };

        $scope.showSaveButton = function () {
            if (yvSys.in_mobile_app()) {
                return true;
            }
            return false;
        };

        $scope.toggleHide = function () {
            $scope.hide.bars = !$scope.hide.bars;
        };

        $scope.$on("event:show-image-modal", function (event, image) {
            $scope.imgSrc = image;
            $scope.showModal();
        });
        
        $scope.$on('$destroy', function () {
            $scope.imageModal.remove();
        });

        function _init() {
            $scope.hide = {
                bars: false
            };
            $scope.disable = {
                save: false
            };
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.imageModal = modal;
            });
        }

        _init();

    }

    return {
        restrict: "E",
        scope: true,
        templateUrl: "templates/directives/imagemodal.html",
        link: _link
    };
}]);
