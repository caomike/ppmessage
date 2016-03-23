angular.module("this_app")
    .controller("ApplicationWelcomeCtrl", function($scope, $state, $stateParams, $timeout, yvAjax, yvUser, yvTransTags, yvUtil, yvDebug, yvLogin){

        $scope.current_bubble = {
            ppcom_launcher_color: '#54c6d6',
            ppcom_launcher_color_changed: false,
        };

        $scope.enableAutoReply = enableAutoReply; // whether or not enable auto reply auto reply offline msg
        $scope.onAutoReplyInputChanged = onAutoReplyInputChanged;
        
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

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $timeout(function() {
                $scope.current_bubble = {
                    welcome_message: _own_team.welcome_message,
                    ppcom_launcher_color: _own_team.ppcom_launcher_color ? _own_team.ppcom_launcher_color : '#54c6d6', //'#54c6d6',
                    ppcom_launcher_style: _own_team.ppcom_launcher_style ? _own_team.ppcom_launcher_style : 'DEFAULT', //'DEFAULT',
                    app_route_policy: _own_team.app_route_policy,//BROADCAST/GROUP/THIRD
                    show_ppcom_hover: _own_team.show_ppcom_hover, //ALWAYS/NEVER/ONCE
                    ppcom_powered_by_name: _own_team.ppcom_powered_by_name,
                    ppcom_powered_by_link: _own_team.ppcom_powered_by_link,
                    ppcom_powered_by_visible: _own_team.ppcom_powered_by_visible,
                };
                _begin_watch();

                enableAutoReply( autoReply() );
                
            });
        };
        
        var _check = function(update, cb) {
            for(var i in update){
                if(i.length > 512) {
                    $scope.action_toast($scope, 1, "application.welcome.WELCOME_WORDS_OUT_OF_LENGTH_TAG");
                    return;
                };
            };
            cb && cb(update);
            return;
        };

        var _init_flag = function() {
            $scope.current_bubble.ppcom_launcher_color_changed = false;
        };

        var _change_app_route_policy = function(name) {
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "app_route_policy": name
            };
            _ajax_update_team_info(update);
        };

        var _change_ppcom_launcher_style = function(style) {
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "ppcom_launcher_style": style,
            };
            _ajax_update_team_info(update);
        };
        
        var _begin_watch = function() {
            
            $scope.$watch('current_bubble.show_ppcom_hover', function(newValue, oldValue) {
                //check if first load
                if(oldValue !== newValue) {
                    var update = {
                        "app_uuid": yvUser.get_team().uuid,
                        "show_ppcom_hover": newValue,
                    };
                    _ajax_update_team_info(update);
                };
            });

            $scope.$watch('current_bubble.app_route_policy', function(newValue, oldValue) {
                //check if first load
                if(oldValue !== newValue) {
                    console.log("update app route policy from: %s to: %s", oldValue, newValue);
                    _change_app_route_policy(newValue);
                };
            });
            
            $scope.$watch('current_bubble.ppcom_launcher_color', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    $scope.current_bubble.ppcom_launcher_color_changed = true;
                    return;
                };
            });

            $scope.$watch('current_bubble.ppcom_launcher_style', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    _change_ppcom_launcher_style(newValue);
                };
            });

        };

        
        $scope.change_ppcom_color = function() {
            if($scope.current_bubble.ppcom_launcher_color_changed) {
                var update = {
                    "app_uuid": yvUser.get_team().uuid,
                    "ppcom_launcher_color": $scope.current_bubble.ppcom_launcher_color,
                };
                _ajax_update_team_info(update, _init_flag);
            };
        };
        
        $scope.update_team_info = function(dirty) {
            if(!dirty) {
                $scope.action_toast($scope, 1, "application.welcome.NO_CHANGED_TAG");
                return;
            };
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "welcome_message": $scope.current_bubble.welcome_message
            };

            _check(update, _ajax_update_team_info);
        };
                
        $scope.get_launcher_style = function() {
            var _c = null;
            if ($scope.current_bubble && $scope.current_bubble.ppcom_launcher_color) {
                _c = $scope.current_bubble.ppcom_launcher_color;
            }
            if (_c == null) {
                _c = "#54c6d6";
            }
            var _s = {
                "background-color": _c,
            };
            return _s;
        };

        $scope.get_launcher_color_name = function() {
            var _c = null;
            if ($scope.current_bubble && $scope.current_bubble.ppcom_launcher_color) {
                _c = $scope.current_bubble.ppcom_launcher_color;
            }

            if (_c == null) {
                _c = "#54c6d6";
            }
            return _c;
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.welcome) {
                var _t = "application.welcome." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {};
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };

        _init();

        /////////// Implementation /////////////

        function onAutoReplyInputChanged () {
            
            if ( !yvUtil.isNull( yvUser.get_team() ) ) {
                
                _ajax_update_team_info( {
                    "app_uuid": yvUser.get_team().uuid,
                    "return_offline_message": $scope.enableAutoReply
                } );
                
            }
            
        }

        function enableAutoReply ( reply ) {
            $scope.enableAutoReply = reply;
        }

        function autoReply() {
            return yvUser.get_team().return_offline_message ? true : false;
        }

        yvDebug.attach( 'yvAppWelcomeController', { $scope: $scope, yvUser: yvUser } );
    });
