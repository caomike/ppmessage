ppmessageModule.directive("yvUserinfoModal", [
    "$ionicModal",
    "$timeout",
    "yvSys",
    "yvLink",
    "yvAPI",
    "yvBase",
function ($ionicModal, $timeout, yvSys, yvLink, yvAPI, yvBase) {

    function _link($scope, $element, $attr) {

        $ionicModal.fromTemplateUrl('userinfo-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.userinfoModal = modal;
        });

        $scope.showModal = function () {

            $timeout(function () {
                $scope.userinfo = {
                    nickname: "",
                    tel: "",
                    qq: "",
                    remarks: "",
                };

                yvAPI.get_user_info($scope.user_uuid, function(data) {


                    console.log(data);

                    $scope.userinfo = {
                        nickname: data.user_fullname ? data.user_fullname : "",
                        tel: data.user_mobile ? data.user_mobile : "",
                        qq: data.user_qq ? data.user_qq : "",
                        remarks: data.user_defined ? data.user_defined : "",
                    };
                }, null, null);
            });

            $scope.userinfoModal.show();
        };

        $scope.closeModal = function () {
            $scope.userinfoModal.hide();
            $scope.$parent.$broadcast('close_userinfo');
        };

        $scope.save = function() {

            var _postdata = {
                user_uuid: $scope.user_uuid,
                user_fullname: $scope.userinfo.nickname,
                user_mobile: $scope.userinfo.tel,
                user_qq: $scope.userinfo.qq,
                user_defined: $scope.userinfo.remarks,
            };

            yvAPI.update_user(_postdata, null, null, null);

            $scope.closeModal();
        };

        $scope.$on("event:show-userinfo-modal", function (event, uuid) {
            $scope.user_uuid = uuid;

            if (yvBase.get("contact", uuid) === null) {
                $scope.showModal();
            }
        });

        $scope.$on('$destroy', function () {
            $scope.userinfoModal.remove();
        });

    }


    return {
        restrict: "E",
        templateUrl: "templates/directives/userinfo-modal.html",
        link: _link
    };

}]);
