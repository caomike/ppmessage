ppmessageModule.controller("SwitchAppCtrl", [
    "$scope",
    "$state",
    "$timeout",
    "$rootScope",
    "$ionicHistory",
    "yvDB",
    "yvAPI",
    "yvSys",
    "yvMain",
    "yvUser",
    "yvAlert",
function ($scope, $state, $timeout, $rootScope, $ionicHistory, yvDB, yvAPI, yvSys, yvMain, yvUser, yvAlert) {

    function _sort_by_app_name(app1, app2) {
        if (app1.app_name < app2.app_name) {
            return -1;
        }
        if (app1.app_name === app2.app_name) {
            return 0;
        }
        return 1;
    }

    
    $scope.isAppChecked = function (app) {
        if (app.app_key === $scope.active_app_key) {
            return true;
        }
        return false;
    };

    
    $scope.selectApp = function (app) {
        if ($scope.active_app_key === app.app_key) {
            return;
        }
        
        $scope.active_app_key = app.app_key;
        yvUser.set("app", app);
        yvDB.set_active_app(app);
        yvDB.init_userdb(yvUser.get("uuid"), function () {
            yvMain.reload();
            yvAlert.success();
            $rootScope.$broadcast("event:reload");
            $state.go("app.conversation-list");
        });
    };

    
    function _init() {
        $scope.apps = [];
        $scope.active_app_key = yvUser.get("app").app_key;
        yvAPI.get_app_list(yvUser.get("uuid"), function (data) {
            angular.forEach(data.list, function (app, key) {
                if (app.is_service_user || app.is_owner_user) {
                    $scope.apps.push(app);
                }
            });
            $scope.apps.sort(_sort_by_app_name);
        });
    }

    
    $scope.$on("$ionicView.enter", function (event) {
        _init();
    });
    
}]);
