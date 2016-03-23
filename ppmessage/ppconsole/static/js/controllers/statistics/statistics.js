angular.module("this_app")
    .controller("ApplicationStatisticsCtrl", function($scope, $state, $timeout, $translate, $stateParams, yvAjax, yvUser, yvConstants, yvLogin) {

       	$scope.count = null;

        $scope.get_agent_count = function() {
            if ($scope.count != null) {
                return $scope.count.agent;
            }
            return 0;
        };

        $scope.get_customer_count = function() {
            if ($scope.count != null) {
                return $scope.count.customer;
            }
            return 0;
        };

        $scope.get_message_count = function() {
            if ($scope.count != null) {
                return $scope.count.message;
            }
            return 0;
        };
        
        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            
            // var _g = yvAjax.get_statistics($stateParams.app_uuid);
            // _g.success(function(data) {
            //     if (data.error_code == 0) {
            //         $scope.count = data.count;
            //     }
            // });
            // _g.error(function(data) {
            // });
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
            // var _tag_list = [];
            // for (var i in yvTransTags.en.statistics.overview) {
            //     var _t = "statistics.overview." + i;
            //     _tag_list.push(_t);
            // };
            
            // $scope.translate = function() {
            // };
            // yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            yvLogin.check_logined(_logined, null);
        };

        _init();

}); // end ctrl

