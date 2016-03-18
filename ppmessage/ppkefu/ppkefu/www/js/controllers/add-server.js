ppmessageModule.controller("AddServerCtrl", [
    "$scope",
    "$ionicHistory",
    "yvDB",
function ($scope, $ionicHistory, yvDB) {

    $scope.server = {
        select: true,
        protocol: "",
        host: "",
        port: "",
        name: ""
    };

    $scope.shouldDisableAdd = function () {
        if ($scope.server.protocol != "https://" && $scope.server.protocol != "http://") {
            return true;
        }
        if (!$scope.server.host) {
            return true;
        }
        if (!$scope.server.name) {
            return true;
        }
        return false;
    };
    
    $scope.add = function () {
        yvDB.add_server($scope.server, function () {
            $ionicHistory.goBack();
        });
    };

}]);
