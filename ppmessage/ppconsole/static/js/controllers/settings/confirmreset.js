angular.module("this_app")
    .controller("SettingsConfirmresetCtrl", function($scope, $cookies, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants) {

    	$scope.sign_in = function() {
    		if (yvUser.get_logined()) {
    			$state.go("app.main");
    			return;
       		};
       		$state.go("app.signin");
    	}

    	var _init = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.settings.confirmreset) {
                var _t = "settings.confirmreset." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {
                
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        _init();
        

    }); // end ctrl
