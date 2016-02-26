ppmessageModule.controller("MainWithLogoCtrl", [
    "$scope",
    "yvSys",
    "yvNav",
    "yvMain",
    "yvUser",
    "yvFile",
    "yvLogin",
    "yvUpdater",
function ($scope, yvSys, yvNav, yvMain, yvUser, yvFile, yvLogin, yvUpdater) {

    function nav_login(user) {
        if (!user) {
            return yvNav.login_no_user();
        }
        if (user.is_online && yvSys.has_db()) {
            return yvLogin.login_with_session(user);
        }
        yvNav.login_with_user(user);
    }

    function init_db() {
        yvMain.init_yvdb(function (user) {
            yvUpdater.check_update();
            yvNav.clear(function () {
                nav_login(user);
            });
        });
    }

    function init() {
        if (yvSys.in_mobile_app()) {
            yvFile.init();
        }
        init_db();
    }

    init();
}]);
