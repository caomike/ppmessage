ppmessageModule.controller("SwitchServerCtrl", [
    "$scope",
    "$timeout",
    "$state",
    "yvDB",
function ($scope, $timeout, $state, yvDB) {

    $scope.serverList = [];

    _reload();

    function _reload() {
        yvDB.query_servers(function (_servers) {
            $timeout(function () {
                $scope.serverList = _servers;
            });
        });
    }

    $scope.getServerPath = function (server) {
        var path = server.protocol + server.host;
        if (server.port) {
            path = path + ":" + server.port;
        }
        return path;
    };
    
    $scope.select = function (_server) {
        yvDB.select_server(_server, function () {
            _reload();
        });
    };

    $scope.deleteServer = function (_server, $event) {
        yvDB.delete_server(_server, function () {
            _reload();
        });
        $event.stopPropagation();
    };

}]);
