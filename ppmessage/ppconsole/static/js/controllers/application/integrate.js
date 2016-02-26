angular.module("this_app")
	.controller("IntegrateCtrl", function($scope, $rootScope, $stateParams, $cookies, $state, $timeout, $http, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants) {

        $scope.enterprise = {
            link: null,
        };

        var _generate_enterprise_link = function() {
            var _team = yvUser.get_team();
            if (_team == null) {
                return;
            }

            var _url = location.protocol + "//" + location.host + "/ppcom/enterprise/";
            var _param = Base64.encode(JSON.stringify(_team));
            $timeout(function() {
                $scope.enterprise.link = _url + _param;
            });
        };
        
        // clip integrate code to clipboard
        // The ZeroClipboard library using an invisible Adobe Flash movie and a JavaScript interface.
        var copyEl = document.getElementById("link_clip_action"),
            client = new ZeroClipboard( copyEl );
        client.on("ready", function( readyEvent ) {
            client.on( "aftercopy", function( event ) {
                $scope.set_flash_style( 0 );
                $scope.set_update_string( $scope.lang[ 'application.profile.COPY_SUCCESSFUL_TAG' ] );
            } );
        } );
        client.on( 'error', function( errorEvent ) {
            
            angular.element( copyEl ).bind( 'click' , function( e ) {
                $scope.set_flash_style( 1 );
                $scope.set_update_string( $scope.lang[ 'application.profile.COPY_FAIL_TAG' ] );    
            } );
            
        } );
        
        $scope.auto_install = function() {
            $state.go( "app.settings.autoinstall" );
        };

        $scope.manual_install = function() {
            $state.go("app.settings.manualinstall");
        };
        
        $scope.get_support = function(user) {
            //do something
            console.log(user);
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
                    _generate_enterprise_link();
                });
            } else {
                _generate_enterprise_link();
            }
        };

        var _translate = function() {
            var _tag_list = [];
            var i;
            for (i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            };

            $scope.translate = function() {
                console.log($scope.lang);
            };
            
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
		var _init = function() {
            _translate();
            $scope.refresh_settings_menu();
            yvAjax.check_logined(_logined, null);
        };
		
		_init();
	}); // end ctrl
