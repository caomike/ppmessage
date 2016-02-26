ppmessageModule.controller("AboutCtrl", [
    "$scope",
    "$filter",
    "yvSys",
    "yvUpdater",
function ($scope, $filter, yvSys, yvUpdater) {
    
    $scope.downloadUpdate = function () {
        var data = {
            download_url: $scope.download_url,
            plist_url: $scope.plist_url
        }
        yvUpdater.download_update(data);
    };

    
    $scope.getButtonText = function () {
        var text = $filter("translate")($scope.button_text);
        if (!$scope.is_newest && $scope.newest_version) {
            return text + $scope.newest_version;
        }
        return text;
    };

    
    $scope.showUpdateButton = function () {
        if (yvSys.in_browser()) {
            return false;
        }
        return true;
    };

    
    function _handle_version_data(data) {
        $scope.plist_url = data.plist_url;
        $scope.download_url = data.download_url;
        $scope.newest_version = data.newest_version;
    }

    
    function _check_version() {
        yvUpdater.check_version(function (data) {
            $scope.is_newest = false;
            _handle_version_data(data);
            $scope.button_text = "app.settings.about.UPGRADE_TO_VERSION_TAG";
        }, function (data) {
            $scope.is_newest = true;
            _handle_version_data(data);            
            $scope.button_text = "app.settings.about.IS_NEWEST_VERSION_TAG";
        }, function (error) {
            $scope.button_text = "app.settings.about.CANT_GET_NEWEST_VERSION_TAG";
        });
    }

    
    function _init() {
        $scope.is_newest = true;
        $scope.button_text = "";
        $scope.local_version = "";
        $scope.newest_version = "";
        $scope.app_name = yvSys.get_bundle_info().display_name;
        
        if (yvSys.has_db()) {
            $scope.local_version = yvUpdater.current_version();
            _check_version();
            return;
        }

        $scope.local_version = "v" + ppmessage.version;
    }

    _init();
    
}]);
