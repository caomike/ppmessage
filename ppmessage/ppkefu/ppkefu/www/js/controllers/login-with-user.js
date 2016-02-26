ppmessageModule.controller("LoginWithUserCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "$stateParams",
    "yvNav",
    "yvMain",
    "yvLink",
    "yvLogin",
function ($scope, $state, $timeout, $stateParams, yvNav, yvMain, yvLink, yvLogin) {

    $scope.user = {
        user_password: "",
        icon: $stateParams.icon,
        user_email: $stateParams.email || "",
        fullname: $stateParams.fullname || ""
    };
    
    if (!$scope.user.user_email) {
        yvNav.login_no_user();        
    }
    
    $scope.$on("$ionicView.enter", function () {
        yvNav.clear();
        yvMain.set_server();
    });
    
    $scope.nouser = function () {
        yvNav.login_no_user();        
    };


    $scope.disableLogin = function () {
        if ($scope.user.user_password) {
            return false;
        }
        return true;
    };
    
    $scope.getDeviceUserIcon = function () {
        return yvLink.get_user_icon($scope.user.icon);
    };

    $scope.deviceUserLogin = function () {
        var _user = {
            user_email: $scope.user.user_email,
            user_password: hex_sha1($scope.user.user_password)
        };
        yvLogin.login(_user);
    };

}]);
