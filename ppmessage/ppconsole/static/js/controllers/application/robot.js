angular.module("this_app")
    .controller("ApplicationRobotCtrl", function($scope, $state, $stateParams, $timeout, yvAjax, yvUser, yvTransTags, yvUtil){

        $scope.current_app = {};

        var _ajax_update_team_info = function(update, cb) {
            yvAjax.update_app_info(update)
                .success(function(data) {
                    console.log(data);
                    if(data.error_code == 0) {
                        $scope.action_toast($scope, 0, "application.welcome.UPDATE_APP_SUCCESSFULLY_TAG");
                        cb && cb();
                    }else if(data.error_code == -1) {
                        //app_uuid miss
                        $scope.action_toast($scope, 1, "application.welcome.UPDATE_APP_LACK_PARAMS_TAG");
                    }else if(data.error_code == 1) {
                        //app not exist
                        $scope.action_toast($scope, 1, "application.welcome.UPDATE_APP_NOT_EXIST_TAG");
                    }else {
                        //error encounter
                        $scope.action_toast($scope, 1, "application.welcome.UPDATE_ENCOUNTER_AN_ERROR_TAG");
                    };
                })
                .error(function(data) {
                    console.log(data);
                    $scope.action_toast($scope, 2, "application.welcome.UPDATE_ENCOUNTER_AN_ERROR_TAG");
                });
        };

        var _change_robot_train = function(name, value) {
            var _name = "robot_train_" + name;
            var _update = {
                "app_uuid": yvUser.get_team().uuid,
            };
            _update[_name] = value;
            _ajax_update_team_info(_update);
        };

        var _change_robot_method = function(value) {
            var _update = {
                "app_uuid": yvUser.get_team().uuid,
                "robot_train_method": value
            };
            _ajax_update_team_info(_update);
        };

        var _watch = function() {
            
            $scope.$watch('current_bubble.robot_train_chat', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    _change_robot_train('chat', newValue);
                };
            });

            $scope.$watch('current_bubble.robot_train_track', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    _change_robot_train('track', newValue);
                };
            });

            $scope.$watch('current_bubble.robot_train_click', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    _change_robot_train('click', newValue);
                };
            });

            $scope.$watch('current_bubble.robot_train_method', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    _change_robot_method(newValue);
                };
            });

        };
        
        var _team = function() {
            var _own_team = yvUser.get_team();
            
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            
            var _fields = ["robot_train_chat", "robot_train_track", "robot_train_click"];
            for (var i = 0; i < _fields.length; i++) {
                var name = _fields[i];
                $scope.current_app[name] = _own_team[name];
            }

        };
        
        var _logined = function() {
            if(yvUser.get_status() != "OWNER_2") {
                console.error("should not be here");
                return;
            };
            if(!yvUser.get_team()) {
                var _get = yvAjax.get_app_owned_by_user(yvUser.get_uuid());
                _get.success(function(data) {
                    yvUser.set_team(data.app);
                    _team();
                });
            } else {
                _team();
            }
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.welcome) {
                var _t = "application.robot." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {};
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            yvAjax.check_logined(_logined, null);
        };
        
        _init();
    });
