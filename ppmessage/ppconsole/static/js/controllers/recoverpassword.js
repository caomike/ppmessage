angular.module("this_app")
    .controller("RecoverPasswordCtrl", function($scope, $cookies, $state, $stateParams, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants) {

        var _changepassword_string = "";

        var _flash_style;

        var _user;

        var _set_changepassword_string = function(str) {
            $timeout(function() {
                _changepassword_string = str;
            });

            $timeout(function() {
                _changepassword_string="";
            }, 2000);
            return;
        };

        var _set_flash_style = function(style) {
            $timeout(function() {
                _flash_style = style;
            });
        };
        
        $scope.get_flash_style = function() {
            return _flash_style;
        };

        $scope.should_show_changepassword_string = function() {
            return _changepassword_string.length > 0;
        };

        $scope.get_changepassword_string = function() {
            return _changepassword_string;
        };
        
        $scope.close_changepassword_string = function() {
            $timeout(function() {
                _changepassword_string= "";
            });
        };
               
        $scope.changepassword = function(password,confirm_password) {
            if (!password || !confirm_password) {

                _set_flash_style("flash flash-error");
                _set_changepassword_string($scope.lang["changepassword.NO_PASSWORD_TAG"]);
                return;
            };
            
            if (password != confirm_password) {

                _set_flash_style("flash flash-error");
                _set_changepassword_string($scope.lang["changepassword.PASSWORD_NOT_MATCH_TAG"]);
                return;
            };

            var l = yvAjax.update_user({
                app_uuid: yvConstants.PPMESSAGE_APP.uuid,
                user_uuid: _user.uuid,
                user_password: password
            });
            
            l.success(function(data) {
                if (data.error_code == 0) {
                    
                    _set_flash_style("flash flash-notice");
                    _set_changepassword_string($scope.lang["changepassword.CHANGE_PASSWORD_SUCCESS_TAG"]);

                    $timeout(function() {
                        $state.go("app.signin");
                    },3000);

                } else {
                    _set_flash_style("flash flash-error");
                    _set_changepassword_string($scope.lang["changepassword.CHANGE_PASSWORD_FAIL_TAG"]);
                }
            });

            l.error(function(data) {
                _set_flash_style("flash flash-error");
                _set_changepassword_string($scope.lang["changepassword.CHANGE_PASSWORD_FAIL_TAG"]);
            });
       
        };

        var _init = function() {

            var _decoded = yvUtil.base64_decode($stateParams.account);

            var _u = JSON.parse(_decoded);         

            _user = _u;

            console.log("_user is %o",_user);

            var _tag_list = [];
            for (var i in yvTransTags.en.changepassword) {
                var _t = "changepassword." + i;
                _tag_list.push(_t);
            }

            $scope.translate = function() {
            };
            
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);

        };

        _init();
        
    }); // end ctrl
