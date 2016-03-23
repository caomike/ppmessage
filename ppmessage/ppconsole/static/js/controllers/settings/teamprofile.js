angular.module("this_app")
    .controller("ApplicationProfileCtrl", function($scope, $stateParams, $state, $translate, $timeout, yvTransTags, yvAjax, yvUtil, yvUser, yvDebug, yvConstants, yvLogin) {

        var team_name = "";

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        $scope.can_delete = false;
        $scope.team_info = {};

        var _reset_team_info = function() {
            $scope.team_info = {
                app_uuid: null,
                app_name: null,
                ppconsole_thirdparty: {
                    api_uuid: null,
                    api_key: null,
                    api_secret: null,
                },
                ppkefu_thirdparty: {
                    api_uuid: null,
                    api_key: null,
                    api_secret: null,
                },
            };
        };
        
        $scope.show_remove_modal = function() {
            jQuery('#remove_app').modal({show:true});
        };

        $scope.remove_app = function() {
            
            var app_info = {
                "user_uuid": yvUser.get_uuid(),
                "app_uuid": yvUser.get_team().uuid,
            };
            yvAjax.remove_app(app_info)
                .success(function(data) {
                    console.log("remove app info back",data);
                    jQuery('#remove_app').modal('hide');
                    if(data.error_code == 0) {
                        _note("flash-notice", "application.profile.REMOVE_APP_SUCCESS_TAG");
                        var team_uuid = '';
                        yvUser.set_team_uuid(team_uuid);
                        _reset_team_info()
                    }else if(data.error_code == -1){
                        // params miss
                        _note(1, "application.profile.UPDATE_APP_LACK_PARAMS_TAG");
                    }else if(data.error_code == 1){
                        //no such app
                        _note(1, "application.profile.UPDATE_APP_NOT_EXIST_TAG");
                    }else if(data.error_code == 2){
                        //not app owner
                        _note(2, "application.profile.PERMISSION_DENIED_TAG");
                    }else {
                        //encounter an error
                        _note(1, "application.profile.UPDATE_FAILED_TAG");
                    };
                })
                .error(function(data) {
                    jQuery('#remove_app').modal('hide');
                    _note(2, "application.profile.UPDATE_FAILED_TAG");
                });
        };

        var modify_check = function() {
            if(team_name == $scope.team_info.app_name) {
                _note("flash-error", "application.profile.NO_CHANGE_TAG");
                return false;
            };
            
            if(!yvUtil.regexp_check($scope.team_info.app_name)) {
                _note(1, "application.profile.NOT_REGULAR_WORDS_TAG");
                $scope.team_info.app_name = team_name;
                return false;
            };
            if(String($scope.team_info.app_name).length>63) {
                _note(1, "application.profile.WORDS_OUT_OF_LENGTH_TAG");
                $scope.team_info.app_name = team_name;
                return false;
            };
            return true;
        }
            
        $scope.modify = function() {
            console.log("$scope.team_info is",$scope.team_info);
            if(!modify_check()) {
                return;
            };
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "app_name": $scope.team_info.app_name,
            };
            yvAjax.update_app_info(update)
                .success(function(data) {
                    console.log("update team info back",data);
                    if(data.error_code == 0) {
                        $scope.team_info.app_name = data.app_name;
                        team_name = data.app_name;
                        yvUser && yvUser.get_team() && ( yvUser.get_team().app_name = team_name );
                        _note(0, "application.profile.UPDATE_SUCCESSFULLY_TAG");
                    }else if(data.error_code == -1) {
                        _note(1, "application.profile.UPDATE_APP_LACK_PARAMS_TAG");
                    }else if(data.error_code == 1) {
                        _note(1, "application.profile.UPDATE_APP_NOT_EXIST_TAG");
                    }else{
                        _note(1, "application.profile.UPDATE_FAILED_TAG");
                    }
                })
                .error(function(data) {
                    console.log("error data is",data);
                    _note(2, "application.profile.UPDATE_FAILED_TAG");
                });
        };

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }

            var app_uuid = _own_team.uuid;
            $scope.team_info.app_uuid = app_uuid;
            $scope.team_info.app_name = _own_team.app_name;
            var _get = yvAjax.get_api_info({app_uuid: app_uuid, user_uuid: yvUser.get_uuid()});
            _get.success(function(data) {
                $scope.team_info.ppconsole_thirdparty = data.ppconsole_thirdparty;
                $scope.team_info.ppkefu_thirdparty = data.ppkefu_thirdparty;
            });
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, {
                $scope: $scope,
                onRefresh: function() {
                    _team();
                }
            } );
        };

        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            _reset_team_info();
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };
        _init();

        yvDebug.attach( 'yvBasicInfo', { yvUser: yvUser } );
    }); 
