ppmessageModule.controller("ChangePasswordCtrl", [
    "$scope",
    "$ionicHistory",
    "yvDB",
    "yvAPI",
    "yvUser",
    "yvAlert",
    "yvConstants",
function ($scope, $ionicHistory, yvDB, yvAPI, yvUser, yvAlert, yvConstants) {

    $scope.password = {};
    $scope.password.old = "";
    $scope.password.new0 = "";
    $scope.password.new1 = "";
    
    var _password = function(_password) {
        var _d = yvAPI.update_user({ user_password:_password }, function() {
            yvUser.set("password", _password);
            yvAlert.success();
            $ionicHistory.goBack();
        }, function() {
            yvAlert.fail();
        }, function() {
            yvAlert.fail();
        });
    };

    $scope.save = function() {
        var origin_password = yvUser.get("password");
        if ($scope.password.old.length  == 0  ||
            $scope.password.new0.length == 0  ||
            $scope.password.new1.length == 0) {
            yvAlert.tip("app.changepwdctrl.PROMPT_EMPTY");
            return;
        }
        if ($scope.password.old != origin_password) {
            yvAlert.tip("app.changepwdctrl.PROMPT_PWD_ERROR");
            return;
        }
        
        if ($scope.password.new0 != $scope.password.new1) {
            yvAlert.tip("app.changepwdctrl.PROMPT_VERIFY_ERROR");
        } else if ($scope.password.new0 == origin_password) {
            yvAlert.tip("app.changepwdctrl.PROMPT_SAME_ERROR");
        } else if ($scope.password.new0.length > 16) {
            yvAlert.tip("app.changepwdctrl.PROMPT_LENGTH");
        } else {
            _password($scope.password.new0);
        }
    };

}]);
