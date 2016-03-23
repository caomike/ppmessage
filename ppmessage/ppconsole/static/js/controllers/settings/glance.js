angular.module("this_app")
    .controller("GlanceCtrl", function($scope, $state, $stateParams, $timeout, yvAjax, yvUser, yvTransTags, yvUtil, yvLogin){
        
        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
        };
        
        var _logined = function() {
            _team();
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
            yvLogin.check_logined(_logined, null);
        };

        // _init();
    });
