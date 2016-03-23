angular.module("this_app")
    .controller("SignupCtrl", function($scope, $state, $timeout, $translate, $cookieStore, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLogin) {
        
        $scope.user = {
            user_status: "OWNER_0",
            is_service_user: false,
            user_fullname: "",
            user_email: "",
            user_password: "",
            user_password_repeat: "",
        };
        
        var _error_string = "",

            _set_error_string = function(str) {
                $timeout(function() {
                    _error_string = str;
                });

                $timeout(function() {
                    _error_string="";
                }, 2000);
                return;
            },

            disableSubmitButton = function( disable ) {
                angular.element( 'button[type=submit]' ).prop( 'disabled', disable );
            };
        
        var _valid_noti = function(user) {
            if (!user) {
                _set_error_string($scope.lang["signup.PARAMS_MISS_TAG"]);
                return false;
            };
            if (!user.user_fullname || String(user.user_fullname).length > 20) {
                _set_error_string($scope.lang["signup.FULLNAME_ERROR_TAG"]);
                return false;
            };
            if (!user.user_email || !yvUtil.is_valid_email(user.user_email)) {
                _set_error_string($scope.lang["signup.NO_EMAIL_TAG"]);
                return false;
            };
            if(String(user.user_email).length>28) {
                console.log(String(user.user_email).length);
                _set_error_string($scope.lang["signup.EMAIL_TOO_LONG_TAG"]);
                return false;
            };

            if ( !_valid_password( user ) ) return false;
            
            user.user_fullname = user.user_fullname.replace(/(^\s*)|(\s*$)/g, "");
            user.user_email = user.user_email.replace(/(^\s*)|(\s*$)/g, "");

            if (!yvUtil.regexp_check(user.user_fullname)) {
                _set_error_string($scope.lang["signup.FULLNAME_UNREGULAR_TAG"]);
                return; 
            };
            return true;
        };

        var _valid_password = function( user ) {
            var passwordValidateError = yvUtil.validator
                .validateRepeatPassword(
                    user.user_password,
                    user.user_password_repeat
                ),
                errorTag;

            switch( passwordValidateError ) {
            case yvUtil.validator.ERR_CODE.MIN_LENGTH_LIMIT:
                errorTag = 'signup.NO_PASSWORD_TAG';
                break;

            case yvUtil.validator.ERR_CODE.MAX_LENGTH_LIMIT:
                errorTag = 'signup.LENGTH_OUT_OF_RANGE_TAG';
                break;

            case yvUtil.validator.ERR_CODE.CONTAIN_WHITESPACE_AT_HEAD_OR_TAIL:
                errorTag = 'signup.ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL';
                break;

            case yvUtil.validator.ERR_CODE.REPEAT_PASSWORD_MIS_MATCH:
                errorTag = 'signup.PASSWORD_NOT_MATCHED_TAG';
                break;
            }

            if ( errorTag ) {
                _set_error_string( $scope.lang [ errorTag ] );
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
        
        $scope.signup = function(user) {
            if (!_valid_noti(user)) {
                console.error("user not valid");
                return;
            };

            disableSubmitButton( true );

            // first try to get token
            getToken( function(response) {
                
                var credentialsToken = response.access_token;

                // angular.copy(source, [destination]);
                // angular.extend(dst, src);
                var copyUser = angular.extend(
                    angular.copy(user),
                    { user_password: sha1( user.user_password ),
                      app_uuid: yvConstants.PPMESSAGE_APP.uuid }
                );
                
                yvAjax.signup(copyUser, credentialsToken)
                    .success(function(data) {
                        
                        if (data.error_code == 0) {
                            yvAjax.login(copyUser).success(function(data) {

                                if ( data.error_code == 0 ) {
                                    yvLogin.updateActiveUserCookieKey( data.user_uuid );
                                    yvLogin.updateLoginedUserCookieKey( data.user_uuid, data.access_token );
                                }

                                yvLogin.updateLoginedUser( copyUser );
                                yvLogin.setLogined( true );
                                
                                _on_completed();
                                $state.go("app.createteam");
                                
                            }).error(function(data) {
                                _on_completed();
                                console.error("login error");
                                _set_error_string($scope.lang["signup.SERVICE_ERROR_TAG"]);
                            });
                        } else {
                            _on_completed();
                            if (data.error_code == yvAjax.API_ERR.EX_USER) {
                                _set_error_string($scope.lang["signup.EMAIL_USED_TAG"]);
                            } else {
                                _set_error_string($scope.lang["signup.SERVICE_ERROR_TAG"]);
                            }
                        }
                    })
                    .error(function(data) {
                        _on_completed();
                        console.error("create portal user error");
                    });
                
            }, function(error) {
                
                // get token error
                _on_completed();
                _set_error_string($scope.lang["signup.SERVICE_ERROR_TAG"]);
                
            } );

            function _on_completed() {
                disableSubmitButton( false );
            }
        };

        $scope.init = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.signup) {
                var _t = "signup." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
            // check if user backforward from createteam to this
            if(yvUser.get_status()) {
                $state.go(yvConstants.USER_STATUS[yvUser.get_status()]);
            };
        };
        $scope.init();

        yvDebug.attach( 'yvSignupController', { valid_password: _valid_password } );

        // ===========get token====================

        function getToken( onSuccess, onError ) {

            yvAjax.get_credentials_token()
                .success( function( response ) {
                    if (response.access_token) {
                        onSuccess && onSuccess( response );
                    } else {
                        onError && onError( response );
                    }
                } )
                .error( function( error ) {
                    onError && onError( error );
                } );
            
        }
        
    }); // end login ctrl
