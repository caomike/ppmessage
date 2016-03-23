angular.module("this_app")
    .controller("StartTeamCtrl", function($scope, $state, $translate, $timeout, yvAjax, yvUtil, yvUser, yvConstants, yvTransTags, yvLogin, yvDebug ) {

        $scope.luanch_team = function() {
            //update portal user status
            var update = {
                app_uuid: yvUser.get_team().uuid,
                user_uuid: yvUser.get_uuid(),
                user_status: "OWNER_2",
            };
            yvAjax.update_user(update)
                .success(function(data) {
                    if(data.error_code == 0) {
                        $state.go("app.settings.teamprofile");
                    }else if(data.error_code == 1) {
                        $state.go("app.main");
                    }else {
                        $state.go("app.main");
                    };
                })
                .error(function(data) {
                    $state.go("app.main");
                });
            
        };
        
        var _logined = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.signup) {
                var _t = "signup." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        var _unlogined = function() {
            $timeout(function() {
                $state.go("app.main");
            }, 1000);
        };
        
        var _init = function() {
            yvLogin.checkActiveUser(_logined, _unlogined);
        };

        _init();
    }); // end login ctrl
