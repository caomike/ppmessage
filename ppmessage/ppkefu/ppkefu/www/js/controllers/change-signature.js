ppmessageModule.controller("ChangeSignatureCtrl", [
    "$scope",
    "$ionicLoading",
    "$ionicHistory",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvMain",
    "yvLocal",
function ($scope, $ionicLoading, $ionicHistory, yvSys, yvAPI, yvUser, yvMain, yvLocal) {

    $scope.data = {
        signature: yvUser.get("signature") || ""
    };

    
    function _show_loading(template) {
        $ionicLoading.show({
            duration: 1000,
            noBackdrop: true,
            template: yvLocal.translate(template)
        });       
    }
    
    
    function _error() {
        _show_loading("app.GLOBAL.UPDATE_FAILED");
    }

    
    $scope.save = function () {
        var signature = $scope.data.signature;
        yvAPI.update_user({user_signature: signature}, function(data) {
            yvMain.update_current_user("signature", signature);
            _show_loading("app.GLOBAL.UPDATE_SUCCESS");
            if (yvSys.in_mobile()) {
                $ionicHistory.goBack();
            }
        }, _error, _error);
    };

    
    $scope.disableSave = function () {
        var signature = $scope.data.signature;      
        if ((signature && signature.length > 50) || signature === yvUser.get("signature")) {
            return true;
        }
        return false;
    };
    
}]);
