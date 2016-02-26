angular.module("this_app")
    .controller("ApplicationChangePlanCtrl", function($scope, $cookies, $state, $stateParams, $timeout, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants) {
        
        var app_uuid;

        var plan_name;

        $scope.should_show_ok = function(name){
        	if(name == $scope.plan_name){
        		return true;
        	}
        	return false;
        }

        $scope.upgrade = function(plan_uuid){

            $state.go('app.pay',{'app_uuid':$scope.app_uuid});
        }

        var _init = function() {
      	    var _tag_list = [];

      	    for (var i in yvTransTags.en.application.changeplan) {
      	        var _t = "application.changeplan" + i;
      	        _tag_list.push(_t);
      	    }

      	    $scope.translate = function() {
      	    
      	    };

      	    yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);

      	    var _l = yvAjax.ajax_get_plan_list();
            
            _l.success(function(data) {
				
			    console.log('plan info list is',data);

                if (data.error_code == 0) {

                    $scope.plans = data.list;

                };
            });
            _l.error(function(data) {
                console.error(data);
                return;
            });

            $scope.app_uuid = $stateParams.app_uuid;
            $scope.plan_name = $stateParams.plan_name;
       	};

      	_init();
    }); // end ctrl
