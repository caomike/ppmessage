angular.module("this_app")
    .controller("SDKCtrl", function($scope, $cookies, $window, $location, $state, $timeout, yvAjax) {
        var base_path = $location.protocol() + "://" + $window.location.host + "/portal/static/yvertical/portal/resources/app/";
        $scope.download_path_win32 = base_path + "ppmessage-win32-setup.exe";
        $scope.download_path_win64 = base_path + "ppmessage-win64-setup.exe";
        $scope.download_path_mac = base_path + "ppmessage.dmg";

        var _init = function() {
            var link = $location.protocol() + "://" + window.location.host + "/portal/static/yvertical/portal/download-app/download-app.html";
            jQuery('#qrcode_for_download').qrcode({
                "width": 160,
                "height": 160,
                "text": link,
            });
        };

        _init();

    }); // end sdk ctrl
