angular.module("this_app")
    .controller("ApplicationMessageRouteCtrl", function($scope, $state, $stateParams, $timeout, yvAjax, yvUser, yvTransTags, yvUtil, yvLogin){

        $scope.current_app = {
            "app_route_policy": null,
        };
        
        //show info to user after operation 
        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };

        var _ajax_update_team_info = function(update, cb) {
            yvAjax.update_app_info(update)
                .success(function(data) {
                    console.log(data);
                    if(data.error_code == 0) {
                        _note(0, "application.welcome.UPDATE_APP_SUCCESSFULLY_TAG");
                        cb && cb();
                    }else if(data.error_code == -1) {
                        //app_uuid miss
                        _note(1, "application.welcome.UPDATE_APP_LACK_PARAMS_TAG");
                    }else if(data.error_code == 1) {
                        //app not exist
                        _note(1, "application.welcome.UPDATE_APP_NOT_EXIST_TAG");
                    }else {
                        //error encounter
                        _note(1, "application.welcome.UPDATE_ENCOUNTER_AN_ERROR_TAG");
                    };
                })
                .error(function(data) {
                    console.log(data);
                    _note(2, "application.welcome.UPDATE_ENCOUNTER_AN_ERROR_TAG");
                });
        };

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $scope.current_app.app_route_policy = yvUser.get_team().app_route_policy;

            $timeout(function() {
                _begin_watch();
            });
        };
        
        var _change_app_route_policy = function(name) {
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "app_route_policy": name
            };
            _ajax_update_team_info(update);
        };
        
        var _begin_watch = function() {
            $scope.$watch('current_app.app_route_policy', function(newValue, oldValue) {
                if(oldValue !== newValue) {
                    console.log("update app route policy from: %s to: %s", oldValue, newValue);
                    _change_app_route_policy(newValue);
                };
            });
        };

        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.welcome) {
                var _t = "application.messageroute." + i;
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
    });
