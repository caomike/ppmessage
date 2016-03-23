angular.module("this_app")
    .controller("CreateTeamCtrl", function($scope, $state, $timeout, $translate, yvUtil, yvTransTags, yvAjax, yvUser, yvConstants, yvLogin, yvDebug) {

        $scope.team = null;

        var _error_string = "";
        var _set_error_string = function(str) {
            $timeout(function() {
                _error_string = str;
            });

            $timeout(function() {
                _error_string="";
            }, 2000);
            return;
        };
        var disableSubmitButton = function( disable ) {
            angular.element( 'button[type=submit]' ).prop( 'disabled', disable );
        };

        $scope.should_show_error = function() {
            return _error_string.length > 0;
        };

        $scope.get_error_string = function() {
            return _error_string;
        };

        $scope.create_team = function(team_name) {

            if(!team_name) {
                _set_error_string($scope.lang["settings.createapplication.NO_APPNAME_TAG"]);
                return;
            };
            if(String(team_name).length > 64) {
                _set_error_string($scope.lang["settings.createapplication.APP_NAME_LENGTH_LIMIT_TAG"]);
                return;
            };
            if(!yvUtil.regexp_check(team_name)) {
                _set_error_string($scope.lang["settings.createapplication.CONTAIN_UNREGULAR_WORDS_TAG"]);
                return;
            };

            disableSubmitButton( true );
            
            yvAjax.create_app(yvUser.get_uuid(), team_name)
                .success(function(data) {
                    if (data.error_code == 0) {
                        yvUser.set_team(data);
                        console.log(data);
                        var update = {
                            app_uuid: yvUser.get_team().uuid,
                            user_uuid: yvUser.get_uuid(),
                            user_status: "OWNER_1",
                        };
                        console.log(update);
                        yvAjax.update_user(update)
                            .success(function(data) {
                                
                                _on_completed();
                                if(data.error_code == 0) {
                                    $state.go("app.startteam");
                                }else if(data.error_code == 1) {
                                    console.info(data);
                                }else {
                                    console.info(data);
                                };
                            })
                            .error(function(data) {
                                _on_completed();
                                console.log("create team failed, please try again!");
                            });
                    } else {
                        _on_completed();
                        $state.go("app.main");
                    };
                })
                .error(function(date) {
                    _on_completed();
                    $state.go("app.main");
                });

            function _on_completed() {
                disableSubmitButton( false );
            }
        };

        var _logined = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.createapplication) {
                var _t = "settings.createapplication." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
            if(yvUser.get_status() != "OWNER_0") {

                if(yvUser.get_status()) {
                    $state.go(yvConstants.USER_STATUS[yvUser.get_status()]);
                }else {
                    $state.go("app.main");
                };
            };
        };

        var _unlogined = function() {
            $timeout(function(){
                $state.go("app.main");
            }, 1000)
        };

        var _init = function() {
            yvLogin.checkActiveUser(_logined, _unlogined);
        };

        _init();
    }); // end createteam ctrl
