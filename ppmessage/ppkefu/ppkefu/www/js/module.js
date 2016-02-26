/*
 *  guijin.ding@yvertical.com
 *  2010-2015
 */

window.ppmessage = {
    api_key: '{ppkefu_api_key}',
    server: '{server}',
    version: '{version}',
    developerMode: {developer_mode},
    disableOnbeforeunload: false
};

var ppmessageModule = angular.module("ppmessage", [
    "ionic",
    "blockUI",
    "ngCookies",
    "ngSanitize",
    "angularFileUpload",
    "pascalprecht.translate",
]);

ppmessageModule.config([
    "$sceProvider",
    "blockUIConfig",
    "$ionicConfigProvider",
function ($sceProvider, blockUIConfig, $ionicConfigProvider) {
    $sceProvider.enabled(false);

    blockUIConfig.autoBlock = false;
    blockUIConfig.autoInjectBodyBlock = true;

    $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");

    $ionicConfigProvider.backButton.text("");

    if (window.cordova && ionic.Platform.isAndroid()) {
        ionic.Platform.fullScreen(true, false);
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
}]).run([
    "$state",
    "$timeout",
    "$rootScope",
    "$ionicPlatform",
    "yvSys",
    "yvLocal",
    "yvMonitor",
function ($state, $timeout, $rootScope, $ionicPlatform, yvSys, yvLocal, yvMonitor) {

    yvLocal.localize();

    if (ppmessage.developerMode) {
        ppmessage.monitor = yvMonitor;
    }

    if (yvSys.in_pc_browser()) {
        window.onresize = function () {
            $timeout(function () {
                $rootScope.getAppBodyStyle();
            });
        };
        
        window.onbeforeunload = function (event) {
            if (ppmessage.disableOnbeforeunload) {
                ppmessage.disableOnbeforeunload = false;
                return;
            }
            if (!ppmessage.developerMode && $state.includes("app.*")) {
                event.returnValue = yvLocal.translate("app.GLOBAL.ON_BEFORE_UNLOAD_WARNING");
            }
        };
    }

    $rootScope.getAppBodyStyle = function () {
        return yvSys.get_app_body_style();
    };

    $ionicPlatform.ready(function () {
        if (window.cordova && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
        if (window.cordova && cordova.getAppVersion) {
            yvSys.set_bundle_info();
        }
        if (window.cordova && navigator.connection) {
            document.addEventListener("online", yvSys.device_online, false);
            document.addEventListener("offline", yvSys.device_offline, false);
        }
    });

}]).constant("$ionicLoadingConfig", {
    // delay: 100,
    duration: 5000,
    noBackdrop: true,
    hideOnStateChange: true,
    template: "<ion-spinner></ion-spinner>"
});
