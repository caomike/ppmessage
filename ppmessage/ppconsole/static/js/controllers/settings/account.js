angular.module("this_app")
    .controller("SettingsAccountCtrl", function($scope, $cookies, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvLogin, yvDebug ) {

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        $scope.resetpassword = function() {            
            $state.go("app.resetpassword", {email: yvUtil.base64_encode(yvUser.get_email())});
        };

        $scope.user = {};

        $scope.changepassword = function(user) {
            
            if (!user.oldpassword || !user.newpassword || !user.confirmnewpassword || !yvUser.get_uuid()) {
                return;
            }

            var errorTag;
            var _pass_hash = sha1(user.oldpassword);
            if (_pass_hash !== yvUser.get_password()) {
                errorTag = "settings.account.OLDPASSWORD_MISMATCH_TAG";
            } else {
                var error_code = yvUtil.validator.validateRepeatPassword( user.newpassword, user.confirmnewpassword );
                switch( error_code ) {
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
            }

            if ( errorTag !== undefined ) {
                _note( 1, errorTag );
                return;
            }

            var _d = {
                "app_uuid": yvUser.get_team().uuid,
                "user_uuid": yvUser.get_uuid(),
                "user_password": sha1( user.newpassword ),
                "old_password": _pass_hash,
            };
            
            var _update = yvAjax.update_user(_d);
            _update.success(function(data) {
                
                if (data.error_code == 0) {

                    yvUser.set_password( sha1( user.newpassword ) );
                    _note(0, "settings.profile.UPDATE_SUCCESSFULLY_TAG");
                    $scope.user = {};                    
                    
                } else {
                    
                    _note(1, "settings.profile.UPDATE_FAILED_TAG");
                    $scope.user = {};
                    
                }
            });
            _update.error(function() {
                
                _note(2, "settings.profile.UPDATE_FAILED_TAG");
                $scope.user = {};
                
            });
        };
        
        $scope.disabled = true;
        $scope.change = function(user) {
            if (user.email === yvUser.get_email() && user.password && user.password.length) {
                $timeout(function() {
                    $scope.disabled = false;
                });
            } else {
                $timeout(function() {
                    $scope.disabled = true;
                });
            }
        }

        $scope.delete_portal_user = function(user) {
            if (!user.password || !user.email || !yvUser.get_uuid()) {
                $timeout(function() {
                    $scope.promote_string = $scope.lang["settings.account.NO_EMAIL_OR_PASSWORD_TAG"]
                });
                console.error("no password/email provided");
                return;
            }

            var _pass_hash = sha1(user.password);
            if (_pass_hash !== yvUser.get_password()) {
                _note(1, "settings.profile.UPDATE_FAILED_TAG");
                return;
            }
            
            var _delete = yvAjax.remove_user({
                "user_email": user.email,
                "user_password": _pass_hash,
                "user_uuid": yvUser.get_uuid()
            });
            
            _delete.success(function(data) {
                console.log(data);
                if (data.error_code == 0) {
                    jQuery("#delete-account-modal").modal('hide');
                    $timeout(function() {
                        $state.go("app.main");
                    }, 1000);
                } else {
                    $timeout(function() {
                        $scope.promote_string = $scope.lang["settings.account.REMOVE_USER_FAILED_TAG"]
                    });
                }
            });
            _delete.error(function() {
                $timeout(function() {
                    $scope.promote_string = $scope.lang["settings.account.REMOVE_USER_FAILED_TAG"]
                });
                return;
            });
        };
        
        $scope.show_delete_modal = function() {
            jQuery("#delete-account-modal").modal({show:true});
            $scope.promote_string = $scope.lang["settings.account.REMOVE_USER_PROMOTE_TAG"];
            return;
        };

        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                switch( errorCode ) {
                    
                case yvLogin.ERROR_CODE.OK:
                    // nothing todo ...
                    break;
                    
                case yvLogin.ERROR_CODE.STATUS_ILLEGAL:
                    // do something ...
                    break;
                    
                }
            });
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.account) {
                var _t = "settings.account." + i;
                _tag_list.push(_t);
            }
            for (var i in yvTransTags.en.settings.profile) {
                var _t = "settings.profile." + i;
                _tag_list.push(_t);
            }
            for (var i in yvTransTags.en.signup) {
                var _t = "signup." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };

        _init();
        
    }); // end account ctrl
