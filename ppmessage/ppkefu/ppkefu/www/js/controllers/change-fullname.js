ppmessageModule.controller("ChangeFullnameCtrl", [
    "$scope",
    "$ionicHistory",
    "yvAPI",
    "yvUser",
    "yvMain",
    "yvAlert",
    "yvConstants",
function ($scope, $ionicHistory, yvAPI, yvUser, yvMain, yvAlert, yvConstants) {

    $scope.fullname = {};
    $scope.fullname.text = yvUser.get("fullname");

    var _fullname  = function(_name) {
        var _d = yvAPI.update_user({user_fullname: _name}, function(data) {
            yvMain.update_current_user("fullname", _name);
            yvAlert.success();
            $ionicHistory.goBack();
        }, function() {
            yvAlert.fail();
        }, function() {
            yvAlert.fail();
        });
    };

    $scope.shouldShowSave = function() {
        if ($scope.fullname.text.length == 0) {
            return true;
        }
        return false;
    };
    
    $scope.save = function() {
        var _nameLen = $scope.fullname.text.length;
        var _alert = "";
        
        if (_nameLen == 0) {
            yvAlert.tip("app.changefullnamectrl.FULLNAME_EMPTY");
            return;
        }
        
        if (_nameLen > 32) {
            yvAlert.tip("app.changefullnamectrl.FULLNAME_TOO_LARGE");
            return;
        }
        
        if (_nameLen > 0 && _nameLen <= 32) {
            _fullname($scope.fullname.text);
            return;
        }
        return;
    };
    
}]);
