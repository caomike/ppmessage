angular.module("this_app")
    .controller("LogoutCtrl", function($scope, $cookies, $state, $timeout, yvAjax) {
        console.log("LOGOUT..................................");
        yvAjax.logout(WebRole);
        delete $cookies.PORTALUSER_SESSION_ID;
        delete $cookies.PORTALADMIN_SESSION_ID;
        $timeout(function() {
            $state.go("app.main", null, {reload: true});
        }, 100);
    }); // end logout ctrl
