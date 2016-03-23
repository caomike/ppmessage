angular.module("this_app")
    .controller("SettingsProfileCtrl", function($scope, yvAjax, yvUtil, yvUser, yvTransTags, yvLogin) {

        $scope.change = function(user) {            
        };

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        $scope.submit = function(user) {
            if (user.fullname == null) {
                return;
            }
            var _d = {
                app_uuid:yvUser.get_team().uuid,
                user_uuid:yvUser.get_uuid(),
                user_fullname:user.fullname
            };
            var _u = yvAjax.update_user(_d);
            _u.success(function(data) {
                console.log(data);
                if (data.error_code == 0) {
                    yvUser.set_fullname(user.fullname);
                    _note(0, "settings.profile.UPDATE_SUCCESSFULLY_TAG");
                } else {
                    _note(1, "settings.profile.UPDATE_FAILED_TAG");
                }
            });
            _u.error(function(data) {
                _note(2, "settings.profile.UPDATE_FAILED_TAG");
            });
        };

        var _team = function() {
            $scope.user = {
                fullname: yvUser.get_fullname(),
                email: yvUser.get_email(),
            };
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };

        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.profile) {
                var _t = "settings.profile." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
                console.log("trans lang %o", $scope.lang)
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
            return;
        };
        
        _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };
        _init();
        
    }); // end ctrl
