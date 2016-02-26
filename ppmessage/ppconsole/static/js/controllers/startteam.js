angular.module("this_app")
    .controller("StartTeamCtrl", function($scope, $state, $translate, $timeout, yvAjax, yvUtil, yvUser, yvConstants, yvTransTags, yvLogin ) {

        $scope.luanch_team = function() {
            //TODO 该处应该只能创建免费试用的计划，付费的应该由后台确认付款之后自动创建
            var billing = {
                "app_uuid": yvUser.get_team().uuid,
                "user_uuid": yvUser.get_uuid(),
                "months": 3,
                "agent_num": 2,
                "pay_type": "free",
                "currency_code": "CNY",
                "amount": 0,
            };
            yvAjax.ajax_create_app_billing(billing)
                .success(function(data) {
                    if(data.error_code == 0) {
                        console.log("startteam.js create app billing",data);
                        //update portal user status
                        var update = {
                            app_uuid: yvUser.get_team().uuid,
                            user_uuid: yvUser.get_uuid(),
                            user_status: "OWNER_2",
                        };
                        yvAjax.update_user(update)
                            .success(function(data) {
                                console.log("startteam.js-30",data);
                                if(data.error_code == 0) {
                                    $state.go("app.settings.teamprofile");
                                }else if(data.error_code == 1) {
                                    $state.go("app.main");
                                }else {
                                    $state.go("app.main");
                                };
                            })
                            .error(function(data) {
                                console.error("createteam.js-89",data);
                                $state.go("app.main");
                            });
                    }else if(data.error_code == 1) {
                        console.log(data);
                        return;
                        // permisstion denied
                    }else {
                        console.log(data);
                        return;
                        // params miss
                    };
                })
                .error(function(data) {
                    console.log("startteam.js create app billing",data);
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

            yvLogin.prepare( { expect_status: 'OWNER_1' }, function( errorCode ) {

                switch ( errorCode ) {
                case yvLogin.ERROR_CODE.OK:
                    break;

                case yvLogin.ERROR_CODE.STATUS_ILLEGAL:
                    $state.go( yvUser.get_status() ?
                               yvConstants.USER_STATUS [ yvUser.get_status() ] :
                               "app.main" );
                    break;
                }
                
            } );

        };

        var _unlogined = function() {
            $timeout(function() {
                $state.go("app.main");
            }, 1000);
        };
        
        var _init = function() {
            yvAjax.check_logined(_logined, _unlogined);
        };

        _init();
    }); // end login ctrl
