angular.module("this_app")
    .controller("SettingsCreateAppCtrl", function($scope, $rootScope, $cookies, $state, $timeout, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants) {
        
        $scope.create_team = function(team_name){
            console.log("createapplication.js-6",team_name);
            if (!team_name) {
                $scope.set_flash_style("flash flash-error");
                $scope.set_update_string($scope.lang["settings.createapplication.NO_APPNAME_TAG"]);
                return;
            };
            if (team_name.length>10) {
                $scope.set_flash_style("flash flash-error");
                $scope.set_update_string($scope.lang["settings.createapplication.APP_NAME_LENGTH_LIMIT_TAG"]);
                return;
            };
            yvAjax.create_app(yvUser.get_uuid(), team_name)
                .success(function(data) {
                    if (data.error_code == 0) {
                        console.log("createapplication.js-19",data);
                        yvUser.set_team_uuid(data.app.uuid);
                        $scope.set_flash_style("flash flash-notice");
                        $scope.set_update_string($scope.lang["settings.createapplication.CREATEAPP_SUCCESSFULLY_TAG"]);
                        $timeout(function(){
                            $state.go("app.settings.teamprofile");
                        },1000);
                    } else if(data.error_code == 1) {
                        $scope.set_flash_style("flash flash-error");
                        $scope.set_update_string($scope.lang["settings.createapplication.APP_ALREADY_EXITED_TAG"]);
                    } else {
                        $scope.set_flash_style("flash flash-error");
                        $scope.set_update_string($scope.lang["settings.createapplication.CREATEAPP_FAILED_TAG"]);
                    }
                })
                .error(function() {
                    $scope.set_flash_style("flash flash-error");
                    $scope.set_update_string($scope.lang["settings.createapplication.CREATEAPP_FAILED_TAG"]);
                });
        };


        $scope.init = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.createapplication) {
                var _t = "settings.createapplication." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        $scope.init();
        
    }); // end ctrl
