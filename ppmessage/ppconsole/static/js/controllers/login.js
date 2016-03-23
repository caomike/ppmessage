angular.module("this_app")
    .controller("LoginCtrl", function($rootScope, $scope, $cookieStore, $state, $location, $stateParams, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLog, yvLogin, yvAppService) {

        $scope.user = {
            email: undefined,
            password: undefined
        };
        
        var _error_string = "";

        var _set_error_string = function(str) {
            $timeout(function() {
                _error_string = str;
            });
            $timeout(function() {
                _error_string= "";
            }, 2000);
            return;
        };

        var _valid_noti = function(user) {
            if (!user) {
                _set_error_string($scope.lang["login.NO_EMAIL_TAG"]);
                return false;
            }
            if (!user.password) {
                _set_error_string($scope.lang["login.NO_PASSWORD_TAG"]);
                return false;
            }
            if (!user.email) {
                _set_error_string($scope.lang["login.NO_EMAIL_TAG"]);
                return false;
            }
            if (!yvUtil.is_valid_email(user.email)) {
                _set_error_string($scope.lang["login.INVALID_EMAIL_TAG"]);
                return false;
            }
            return true;
        };

        $scope.should_show_error = function() {
            return _error_string.length > 0;
        };
        $scope.get_error_string = function() {
            return _error_string;
        };
        $scope.signup = function() {
            $state.go("signup");
        };
        
        //login to portal 
        $scope.login = function(user) {

            // Fix Bug: Form model doesn't update on autocomplete
            //
            // @see:
            // https://github.com/angular/angular.js/issues/1460#issuecomment-32491109
            // http://redmine.ppmessage.cn/issues/237
            // http://stackoverflow.com/questions/21168367/angularjs-chrome-autocomplete-dilemma
            $scope.user = {
                email : ( user && user.email ) || angular.element( '#login_field' ).val(),
                password : ( user && user.password ) || angular.element( '#password' ).val()
            };
            
            if (!_valid_noti($scope.user)) {
                console.error("user not valid.");
                return;
            };

            var password = sha1($scope.user.password);
            yvAjax.login({user_email: $scope.user.email, user_password: password})
                .success(function(data) {
                    if (data.error_code == 0) {

                        yvLogin.updateActiveUserCookieKey( data.user_uuid );
                        yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                        
                        yvAjax.get_{WEB_ROLE}_detail_with_password(data.user_uuid)
                            .success(function(data) {

                                yvDebug.d('get_user_detail', data);
                                if (data.error_code != 0) {
                                    yvLog.w("get detail failed %s", data);
                                    return;
                                }
                                
                                yvLogin.updateLoginedUser( angular.copy( data ) );
                                yvLogin.setLogined( true );
                                
                                if(!data.user_status) {
                                    console.log("no user status provided");
                                    _set_error_string("an error occurred when getting the status.");
                                    return;
                                };
                                
                                var _url = yvConstants.USER_STATUS[data.user_status];
                                if(data.user_status == "SERVICE") {
                                    $scope.start_ppmessage(true);
                                    return;
                                };

                                if (data.user_status == "ADMIN") {
                                    _url = yvConstants.USER_STATUS["OWNER_2"];
                                    yvAppService.getApps( function( apps ) {
                                        $state.go(_url);
                                    } );
                                    return;
                                }
                                
                                if(data.user_status == "OWNER_2") {
                                    $state.go(_url);
                                }
                                return;
                            });
                    } else {
                        _set_error_string($scope.lang["login.LOGIN_FAILED_TAG"]);
                    }
                })
                .error(function(data) {
                    _set_error_string($scope.lang["login.LOGIN_FAILED_TAG"]);
                });
        };

        var _logined = function() {
            if(yvUser.get_status() && yvUser.get_status() == "OWNER_2") {
                $state.go(yvConstants.USER_STATUS[yvUser.get_status()]);
            }else {
                $state.go("app.main");
            };
        };
        
        $scope.init = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.login) {
                var _t = "login." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        $scope.init();
    }); // end login ctrl
