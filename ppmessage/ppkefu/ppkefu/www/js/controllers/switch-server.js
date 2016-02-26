ppmessageModule.controller("SwitchServerCtrl", [
    "$scope",
    "$timeout",
    "$state",
    "yvDB",
function ($scope, $timeout, $state, yvDB) {

    function _reload() {
        yvDB.query_servers(function (_servers) {
            $timeout(function () {
                $scope.serverList = _servers;
            });
        });
    }

    $scope.serverList = [];

    $scope.select = function (_server) {
        yvDB.select_server(_server, function () {
            _reload();
        });
    };

    $scope.deleteService = function (_server, $event) {
        yvDB.delete_server(_server, function () {
            _reload();
        });
        $event.stopPropagation();
    };

    $scope.add = function () {
        $state.go("noapp.add-server");
    };

    _reload();
}]);
