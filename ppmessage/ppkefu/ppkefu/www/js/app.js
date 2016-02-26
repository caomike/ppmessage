angular.element(document).ready(function () {
    function onDeviceReady() {
        try {
            angular.bootstrap(document, ['ppmessage'], {'strictDi': true});
        } catch (e) {
            console.error(e);
        }
    }
    
    if (window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});
