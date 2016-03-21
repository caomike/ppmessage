angular.module("this_app")
    .controller("SettingsCtrl", function($scope, $rootScope, $cookies, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvConstants, yvDebug) {

        $scope.left_style = null;
        $scope.right_style = null;
        $scope.icon_style = null;
        
        $scope.should_show_update_string = function() {
            return $scope._update_string && $scope._update_string.length > 0;
        };

        $scope.get_update_string = function() {
            return $scope._update_string;
        };
        
        $scope.close_update_string = function() {
            $timeout(function() {
                $scope._update_string= "";
            });
        };
        
        $scope.set_update_string = function(str) {
            $timeout(function() {
                $scope._update_string = str;
            });
            
            $timeout(function() {
                $scope._update_string= "";
            }, 5000);
            return;
        };

        $scope.set_flash_style = function(index) {
            //three style:success, warning, failed
            var _style_type = [
                //success
                {
                    "left_style": "toast-style-success-l",
                    "right_style": "toast-style-success-r",
                    "icon_style": "glyphicon glyphicon-ok",
                },
                //warning
                {
                    "left_style": "toast-style-warning-l",
                    "right_style": "toast-style-warning-r",
                    "icon_style": "glyphicon glyphicon-info-sign",
                },
                //failed
                {
                    "left_style": "toast-style-fail-l",
                    "right_style": "toast-style-fail-r",
                    "icon_style": "glyphicon glyphicon-remove",
                },
            ];
            $timeout(function() {
                var _style = _style_type[index];
                $scope.left_style = _style.left_style;
                $scope.right_style = _style.right_style;
                $scope.icon_style = _style.icon_style;
            });
        };

        $scope.get_left_flash_style = function() {
            return $scope.left_style;
        };

        $scope.get_right_flash_style = function() {
            return $scope.right_style;
        };

        $scope.get_icon = function() {
            return $scope.icon_style;
        };
        
        $scope.create_team = function() {
            $state.go("app.settings.createteam");
        };

        $scope.refresh_settings_menu = function() {
            var _j = angular.element(".menu-item");
            for (var i = 0; i < _j.length; i++) {
                angular.element(_j[i]).removeClass("selected");
            }
            
            _j = document.getElementById($state.current.name);
            if (_j && _j.className && _j.className.indexOf("selected") < 0) {
                _j.className += " selected";
            }            
            return;
        };

        $scope.action_toast = function(scope, index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string(scope.lang[tag]);
        };
        
        var _init = function() {
            $scope._update_string = "";
        };

        _init();
        
    }); // end login ctrl
