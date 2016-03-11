ppmessageModule.controller("LoginNoUserCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "yvNav",
    "yvMain",
    "yvLogin",
function ($scope, $state, $timeout, yvNav, yvMain, yvLogin) {

    $scope.user = {user_email: "", user_password: ""};

    $scope.$on("$ionicView.enter", function () {
        yvNav.clear();
        yvMain.set_server();
    });
    
    $scope.disableLogin = function () {
        if ($scope.user.user_email && $scope.user.user_password) {
            return false;
        }
        return true;
    };

    $scope.deviceUserLogin = function () {
        var _user = {
            user_email: $scope.user.user_email,
            user_password: hex_sha1($scope.user.user_password)
        };
        yvLogin.login(_user);
    };

}]);
