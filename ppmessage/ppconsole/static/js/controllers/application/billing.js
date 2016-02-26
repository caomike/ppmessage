angular.module("this_app")
    .controller("ApplicationBillingCtrl", function($scope, $state, $stateParams, $timeout, yvAjax, yvUser, yvTransTags, yvUtil){
        $scope.app_uuid = null;
        $scope.app_billing_email = null;
        $scope.bills = [];

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        //TODO 未处理现在团队存在的客服数，后台暂时未提供接口
        $scope.exist_agents = 1;

        $scope.current_app = {
            plan: {
                endtime: "",
            },
        };

        $scope.change_billing_email_modal = function() {
            $scope.app_billing_email = $scope.current_app.app_billing_email;
            $("#changeappbillingemail").modal({show:true});
        };

        $scope.change_app_billing_email = function() {
            if ($scope.app_billing_email == null || $scope.app_billing_email.length == 0) {
                return;
            };
            var update = {
                "app_uuid": yvUser.get_team().uuid,
                "app_billing_email": $scope.app_billing_email,
            };
        	yvAjax.update_app_info(update)
                .success(function(data) {
                    jQuery("#changeappbillingemail").modal('hide');
                    if (data.error_code == 0) {	
                        $scope.current_app.app_billing_email = $scope.app_billing_email;
                        _note(0, "application.profile.UPDATE_SUCCESSFULLY_TAG");
                    }else {
                        _note(1, "application.profile.UPDATE_FAILED_TAG");
                        console.error(data);
                    }
                })
                .error(function(data) {
                    _note(2, "application.profile.UPDATE_FAILED_TAG");
                    console.error(data);
                    jQuery("#changeappbillingemail").modal('hide');
                    return;
                });
        };

        $scope.time_handler = function(_time) {
            if (typeof _time !== "string"){
                return "";
            };
            return _time.split(" ")[0] + " " + _time.split(" ")[1];
        };

        $scope.get_rest_time = function() {
            var begin = Date.now();
            var end_time = $scope.time_handler($scope.current_app.plan.endtime).toString();
            var end = new Date(Date.parse(end_time.replace(/-/g,"/"))).getTime();
            return Math.floor((end-begin)/(24*3600*1000));
        };

        $scope.currency_code_handler = function(currency_code) {
            if (currency_code == "USD" ){
                return "/美元";
            }else if(currency_code == "HKD"){
                return "/港币";
            }else{
                return "/人民币";
            };
        };
        
        $scope.payment_handler = function(payment) {
            if (payment == "free"){
                return "系统赠送";
            }else if (payment == "alipay"){
                return "支付宝";
            }else if (payment == "wechatpay"){
                return "微信支付";
            }else if (payment == "paypalpay"){
                return "paypal";
            }else{
                return "error";
            };
        };

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }

            yvAjax.ajax_get_app_billing_history(_own_team.uuid)
                .success(function(data) {
                    if (data.error_code == 0) {
                        $scope.bills = data.list;
                    } else {
                        console.error(data);
                    }
                })
                .error(function(data) {
                    console.error(data);
                    return;
                });

            yvAjax.get_app_owned_by_user(yvUser.get_uuid())
                .success(function(data) {
                    console.log(data);
                    if (data.error_code == 0) {           
                        $scope.current_app = data.app;
                        $scope.current_app.plan = data.bill;
                        $scope.app_uuid = data.app.uuid;
                    }else{
                        console.error(data);
                    }
                })
                .error(function(data) {
                    console.error(data);
                    return;
                });
            
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
                return;
            }
            _team();
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            }
            for (var i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            }

            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
            return;
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            yvAjax.check_logined(_logined, null);   
        };

        _init();
    });
