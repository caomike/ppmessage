ppmessageModule.controller("AddServerCtrl", [
    "$scope",
    "$ionicHistory",
    "yvDB",
function ($scope, $ionicHistory, yvDB) {

    $scope.server = {select: true};
    $scope.addDisabled = true;

    $scope.$watchCollection("[server.host, server.name]", function (new_values, old_values, scope) {
        if (new_values && new_values[0] && new_values[1] && new_values[0].length > 0 && new_values[1].length > 0) {
            $scope.addDisabled = false;
        } else {
            $scope.addDisabled = true;
        }
    });

    $scope.add = function (server) {
        yvDB.add_server(server, function () {
            $ionicHistory.goBack();
        });
    };

}]);
