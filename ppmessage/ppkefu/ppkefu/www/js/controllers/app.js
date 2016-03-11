ppmessageModule.controller("AppCtrl", [
    "$scope",
    "yvDB",
    "yvLog",
    "yvSys",
    "yvNav",
    "yvBase",
    "yvLogin",
function ($scope, yvDB, yvLog, yvSys, yvNav, yvBase, yvLogin) {

    yvNav.clear();

    if (yvSys.in_pc_browser()) {
        yvSys.request_desktop_notification();
    }

    $scope.$on("event:reload", function (e, m) {
        yvNav.clear();
    });


    $scope.$on("$ionicView.unloaded", function () {
        console.log("appctrl onloaded....");
    });

    $scope.isInAndroidApp = function () {
        return yvSys.in_android_app();
    };
    
    $scope.isInMobileNative = function () {
        if (yvSys.in_mobile_app()) {
            return true;
        }
        return false;
    };


    $scope.isInMobile = function () {
        if (yvSys.in_mobile()) {
            return true;
        }
        return false;
    };


    $scope.showNavButton = function () {
        if (window.innerWidth >= 768) {
            return false;
        }
        return true;
    };


    $scope.getUnread = function () {
        var sum = 0;
        var list = yvBase.get_list("conversation");
        angular.forEach(list, function (conversation) {
            sum += conversation.unread;
        });
        return sum > 99 ? "99+" : sum;
    };


    $scope.openSearchModal = function () {
        $scope.$broadcast("event:show-search-modal");
    };

}]);
