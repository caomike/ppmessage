angular.module("this_app")
    .controller("AppCtrl", function($window, $scope, $rootScope, $location, $state, $translate, $timeout, $cookies, yvAjax, yvUser, yvUtil, yvDebug, yvLogin, yvAppService, yvConstants, yvLoginedUser) {

        $scope._languages = [
            {
                lang: "zh-CN",
            },            
            {
                lang: "en",
            },
        ];

        var isLogin = yvLogin.isLogined();

        $scope.isAdminUser = false; // is `ppconsole admin` user
        $scope.apps = []; // apps
        $scope.selectApp = selectApp; // Event: `selectApp`
        $scope.appStyle = appStyle; // css style
        $scope.menuStyle = {
            'margin-top': $scope.isAdminUser ? '12px' : '24px'
        }; // menu style

        var _getPreferredLanguage = function() {
            var _p = $translate.use();
            var _l = $scope._languages.length;
            for (var i = 0; i < _l; i++) {
                if ($scope._languages[i].lang == _p) {
                    return $scope._languages[i].lang;
                }
            }
            return $scope._languages[0].lang;
        };
        
        var _getLanguage = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                _l = _getPreferredLanguage();
                yvUser.set_language(_l);
            }
            return _l;
        };
        
        $scope.toggle_mobile_menu = function($event) {
            if ($(".mobile-menu").hasClass("active")) {
                $(".mobile-menu").removeClass("active");
                $(".mobile-menu-items").removeClass("active");
            } else {
                $(".mobile-menu").addClass("active");
                $(".mobile-menu-items").addClass("active");
            }
        };

        $scope.click_mobile_items = function($event) {
            if ($(".mobile-menu").hasClass("active")) {
                $(".mobile-menu").removeClass("active");
                $(".mobile-menu-items").removeClass("active");
            } 
        };

        $scope.switch_to = function(route_str) {
            var url = 'app.' + route_str;
            $state.go(url);
        };
        
        $scope.main = function() {
            $state.go("app.main");
        };

        $scope.blog = function() {
            window.open("http://blog.ppmessage.cn");
        };
        
        $scope.forum = function() {
            window.open("http://forum.ppmessage.cn");
        };
        
        $scope.switch_to_english = function () {
            yvUser.set_language("en");
            $translate.use("en");
        };

        $scope.switch_to_chinese = function () {
            yvUser.set_language("zh-CN");
            $translate.use("zh-CN");
        };

        $scope.is_lang_english = function() {
            var _l = yvUser.get_language();
            if (_l == null) {
                return true;
            }
            if (_l == "en") {
                return true;
            }
            return false;
        };
        
        $scope.get_user_fullname = function() {
            return yvLogin.getLoginedUser() ? yvLogin.getLoginedUser().user_fullname : "";
        };

        $scope.is_logined = function() {
            return isLogin;
        };

        $scope.login = function() {
            $state.go("login");
        };

        $scope.show_settings_menu = function() {
            return yvLoginedUser.get() && yvLoginedUser.get().user_status === "OWNER_2";
        };
        
        $scope.start_ppmessage = function(in_this) {
            var userUuid = yvUser.get_uuid();
            var password = yvUser.get_password();
            var userEmail = yvUser.get_email();
            var uuid = yvUtil.uuid();
            var signature = sha1(uuid + userEmail + password);
            var body = {
                user_email: yvUser.get_email(),
                user_password: yvUser.get_password(),
                user_uuid: yvUser.get_uuid()
            };
            body = yvUtil.base64_encode(JSON.stringify(body));
            var http = yvUtil.http_protocol(location.hostname);
            var url = http + location.host + "/ppkefu/#/noapp/auto-login/" + body;
            if (in_this) {
                self.location = url;
            } else {
                window.open(url, "ppmessage" + "-" + userEmail);
            }
        };
        
        $scope.logout = function() {
            var _logout = yvAjax.logout("user");
            
            $timeout(function() {

                yvLogin.logout();
                isLogin = false;
                yvAppService.clear();
                
                $scope.menuStyle[ 'margin-top' ] = '24px';
                $scope.isAdminUser = false;
                
            });
            
            $timeout(function() {
                $state.go("app.signin");
            });
        };
        
        $scope.$on("$destroy", function() {
            
        });

        var _init = function() {

            // Event: login successful
            $rootScope.$on( yvConstants.BROADCAST_EVENT_KEY.LOGIN_FINISHED , function( event, args ) {

                isLogin = true;
                $scope.isAdminUser = args.isAdmin;
                if ( $scope.isAdminUser === true ) {
                    
                    $scope.menuStyle[ 'margin-top' ] = '12px';

                    refreshApps();
                    
                }
                
            } );
            
        };

        _init();

        // ===========
        function refreshApps() {
            fetchApps( function( apps ) {
                setupAppsDropDownButton( apps );
            } );            
        }
        
        function fetchApps( callback ) {
            yvAppService.getApps( callback );
        }
        
        function setupAppsDropDownButton( apps ) {
            $scope.apps = apps;
        }

        function selectApp( app ) {
            yvAppService.selectApp( app, function() {

                refreshApps();
                $scope.$broadcast( yvConstants.BROADCAST_EVENT_KEY.REFRESH_PAGE );
                
            }, function( error ) {
                
                yvDebug.d( 'select app error', error );
                
            } );
        }

        function appStyle( app ) {
            if ( app.is_selected ) {
                return {
                    'background-color': 'red'
                };
            }
            return { };
        }

    }); // end app ctrl
