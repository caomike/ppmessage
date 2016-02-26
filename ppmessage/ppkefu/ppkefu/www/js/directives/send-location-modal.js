ppmessageModule.directive("yvSendLocation", [
    "$timeout",
    "$ionicModal",
    "yvDB",
    "yvAPI",
    "yvConstants",
    "yvFile",
    "yvBase",
    "yvSys",
function ($timeout, $ionicModal, yvDB, yvAPI, yvConstants, yvFile, yvBase, yvSys) {
    
    function _link($scope, $element, $attr) {

        $scope.showModal = function () {
            $scope.sendLocationModal.show();
        };

        $scope.closeModal = function () {
            $scope.sendLocationModal.hide();
        };

        $scope.$on("event:show-send-location-modal", function () {
            $scope.showLocation = true;
            $scope.showModal();
        });

        $scope.$on("modal.hidden", function (event, modal) {

            /* In Android, when location modal is shown,
             * if you click hardware back-button, the modal will hide,
             * but $scope.closeModal() will not be invoked!
             * We must destroy yv-view-position when modal is hidden.
             */
            $scope.showLocation = false;
        });

        $scope.$on('$destroy', function () {
            $scope.sendLocationModal.remove();
        });

        $scope.show_error_detail = function () {
            $scope.gpslocation.error_detail = true;
        };

        $scope.sendCurrentPosition = function () {
            var _url;

            function __send(_data) {
                var _active_conv = yvBase.active("conversation");
                var _send = {
                    conv_uuid: _active_conv.uuid,
                    conv_type: _active_conv.type,
                    user_uuid: _active_conv.user_uuid,
                    message_subtype: yvConstants.MESSAGE_SUBTYPE.GPS_LOCATION,
                    message_data: {
                        body: JSON.stringify($scope.current_pos),
                        file: _data
                    }
                };

                yvDB.send_message(_send);

                $scope.showIcon = false;
                $scope.closeModal();
            }

            if ($scope.current_pos.lng !== null && $scope.current_pos.lat !== null) {
                $scope.showIcon = true;
                _url = yvAPI.get_amap_url($scope.current_pos);

                if (yvSys.in_mobile_app()) {
                    yvAPI.download_file(_url, null, function (_f) {
                        __send(_f.name);
                    });
                } else {
                    __send(_url);
                }
            }
        };

        function _init() {
            $scope.gpslocation = {
                error_detail: false,
                address: null
            };
            $scope.current_pos = {
                lng: null,
                lat: null,
                zoom: 12
            };
            $ionicModal.fromTemplateUrl('send-location-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.showLocation = false;
                $scope.sendLocationModal = modal;
            });
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/sendlocationmodal.html",
        link: _link
    };
}]);
