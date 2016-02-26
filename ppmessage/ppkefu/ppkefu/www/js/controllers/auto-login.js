ppmessageModule.controller("AutoLoginCtrl", [
    "$scope",
    "$state",
    "$stateParams",
    "yvNav",
    "yvMain",
    "yvLogin",
function ($scope, $state, $stateParams, yvNav, yvMain, yvLogin) {

    function login_success() {
        console.log("login successfully...");
    }

    function login_error(reason) {
        console.log("login error:", reason);
        yvNav.disable_next();
        $state.go("noapp.login-error");
    }

    $scope.$on("event:login-error", function (event, error) {
        console.error(error);
    });
    
    function init() {
        $scope.user = {
            request_body: $stateParams.request_body,
        };

        if (!$scope.user.request_body) {
            login_error();
            return;
        }
        
        var _body_str = Base64.decode($scope.user.request_body);
        _body = JSON.parse(_body_str);
        console.log("auto login with %o", _body);
        
        $scope.user.user_email = _body.user_email;
        $scope.user.user_password = _body.user_password;
        yvMain.init_yvdb(function (user) {
            yvLogin.login($scope.user);
        });
    }

    init();
}]);
