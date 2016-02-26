ppmessageModule.controller("NoAppCtrl", [
    "$scope",
    "yvSys",
    "yvConstants",
function ($scope, yvSys, yvConstants) {
    $scope.showServerButton = function () {
        return ppmessage.developerMode && yvSys.has_db();
    };

}]);
