ppmessageModule.factory("yvLogin", [
    "$state",    
    "$timeout",
    "$ionicLoading",
    "yvSys",
    "yvAPI",
    "yvNav",
    "yvNoti",
    "yvUser",
    "yvMain",
    "yvLink",
    "yvAlert",
function ($state, $timeout, $ionicLoading, yvSys, yvAPI, yvNav, yvNoti, yvUser, yvMain, yvLink, yvAlert) {

    var session = null;
    
    function LoginSession() {
        // user info for manual-login
        this.user_email = null;
        this.user_password = null;
        this.access_token = null;

        // make sure init one time
        if (typeof this.device_token !== "string") {
            // device info
            LoginSession.prototype.device_token = "";  // iOS only
            LoginSession.prototype.device_uuid = "";
            LoginSession.prototype.device_model = yvSys.get_device_model();
            LoginSession.prototype.device_version = yvSys.get_device_version();
            LoginSession.prototype.device_platform = yvSys.get_device_platform();
            LoginSession.prototype.device_fullname = yvSys.get_device_fullname();
            
            LoginSession.prototype.login = function () {
                var self = this;
                yvAPI.token(self, function (response) {
                    yvAPI.login(self, function (response) {
                        self._login_success(response);
                    }, function () {
                        self._login_error("app.GLOBAL.ERR_NET");
                    }, function () {
                        self._login_error("app.GLOBAL.ERR_LOGIN");
                    });
                }, function () {
                    self._login_error("app.GLOBAL.ERR_NET");
                }, function () {
                    self._login_error("app.GLOBAL.ERR_USERPASS");
                });
            };

            LoginSession.prototype._login_error = function (error) {
                _stop_loading();
                yvAlert.tip(error);
            };
            
            LoginSession.prototype._login_success = function (data) {
                data.access_token = this.access_token;
                yvMain.add_login_user(data, _enter_app);
            };
        }
    };


    function _stop_loading() {
        $ionicLoading.hide();
    }

    
    function _start_loading() {
        $ionicLoading.show({
            delay: 100,
            duration: 150000,
            template: "<ion-spinner></ion-spinner>"
        });
    }

    
    function _api_error(res) {
        _stop_loading();
        yvNav.login_with_user();
        yvAlert.tip("app.GLOBAL.ERR_NET");
        console.error("api error, session invalid ?", res);
    }

    
    function _enter_app(offline) {
        yvNoti.init();
        yvMain.reload(offline, function () {
            $timeout(function () {
                yvNav.go_conversation_list();
                _stop_loading();
            });
        });
    }
    
    function _login_with_session(user) {
        if (!session) {
            session = new LoginSession();
        }
        session.user_email = user.email;
        session.access_token = user.access_token;
        session.device_uuid = user.device_uuid;

        // if api failed because of token, then login with user.
        // if api failed because of network, enter app without network.
        // if api success, enter app with network.
        yvAPI.test_api(function () {
            _enter_app();
        }, function () {
            _enter_app(true);       
        }, function () {
            yvNav.login_with_user();
        });
    }

    
    function _login(user) {
        var server = yvAPI.get_server();
        
        if (!session) {
            session = new LoginSession();
        }
        
        _start_loading();
        
        if (!user.user_email || !user.user_password) {
            session._login_error("app.GLOBAL.ERR_NO_ENOUGH_INFO");            
            return;
        }
   
        session.user_email = user.user_email;
        session.user_password = user.user_password;
        
        if (!server || server.id === -1) {
            session._login_error("app.GLOBAL.ERR_NO_SERVER");
            return;
        }

        if (yvSys.in_ios_app()) {
            yvNoti.get_ios_token(function (token) {
                session.device_uuid = hex_sha1(token);
                session.device_token = token;
                session.login();
            }, function () {
                session._login_error("app.GLOBAL.ERR_IOSTOKEN");
            });
            return;
        }

        session.device_uuid = yvSys.get_device_uuid(session.user_email);
        console.log("session device_uuid is %s", session.device_uuid);
        
        session.login();
        return;
    }

    
    function _check_session() {
        session || yvMain.local_logout();
    }
    
    return {
        login: function (user) {
            return _login(user);
        },

        login_with_session: function (user) {
            return _login_with_session(user);
        },
        
        after_login: function () {
            return _after_login();
        },
        
        enter_app: function (offline) {
            return _enter_app(offline);
        },
        
        check_session: function () {
            return _check_session();
        },

        current_session: function () {
            return session;
        }
    };
}]);
