angular.module("this_app")
	.controller("ManualInstallCtrl", function($scope, $rootScope, $stateParams, $cookies, $state, $timeout, $http, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants) {

        $scope.integrate_code = null;

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        // clip integrate code to clipboard
        var client = new ZeroClipboard(document.getElementById("clip_action"));
        client.on("ready", function( readyEvent ) {            
            client.on( "aftercopy", function( event ) {
                $scope.clip_tooltips_hide();
                _note(0, "application.manualinstall.COPY_SUCCESSFUL_TAG");
            } );
        } );

        $scope.clip_tooltips_show = function() {
            $(".boxed-group .integrate_toast span").css("visibility","visible");
        };

        $scope.clip_tooltips_hide = function() {
            $(".boxed-group .integrate_toast span").css("visibility","hidden");
        };
        
        $scope.go_back_integrate = function() {
            $state.go("app.settings.integrate");
        };
        
        var _set_embedded_code = function(_own_team) {
            var server = yvConstants.CURRENT_SERVER;
            var _url = null;
            if(server=="ppmessage.cn") {
                _url = "https://ppmessage.cn";
            }else {
                _url = "http://" + server;
            };
            var _pre = "<script> window.ppSettings = {";
            _pre = _pre + "app_key:";
            _pre = _pre + "'" + _own_team.app_key + "',";
            _pre = _pre + "app_secret:";
            _pre = _pre + "'" + _own_team.app_secret + "'};";
            _pre = _pre + "(function(){var w=window,d=document;function l(){var a=d.createElement('script');a.type='text/javascript';a.async=!0;a.src='URL/ppcom/assets/pp-library.min.js';var b=d.getElementsByTagName('script')[0];b.parentNode.insertBefore(a,b)}w.attachEvent?w.attachEvent('onload',l):w.addEventListener('load',l,!1);})()</script>";
            _pre = _pre.replace("URL", _url);
            $scope.integrate_code = _pre;
        };
        
        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            _set_embedded_code(_own_team);
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
            var _tag_list = [];
            for (var i in yvTransTags.en.application.manualinstall) {
                var _t = "application.manualinstall." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        
		var _init = function() {
            _translate();
            _logined();
        };
		
		_init();
	}); // end ctrl
