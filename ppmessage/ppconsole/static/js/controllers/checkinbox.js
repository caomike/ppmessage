angular.module("this_app")
    .controller("CheckInboxCtrl", function($scope, $cookies, $state, $stateParams, $timeout, $translate, yvAjax, yvUtil, yvUser, yvConstants) {
        $scope.get_email_address = function() {
            if (!yvUser.get_email()){
                return $scope.email;
            }else{
                return yvUser.get_email();
            };
        };
        var init = function() {
            var _url = location.href;
            var _encode_email = _url.substring(_url.lastIndexOf('/')+1,_url.length);
            $scope.email = yvUtil.base64_decode(_encode_email);
            if (!$scope.email){
                $state.go('app.signup');
            }
        };
        init();
    }); // end ctrl
