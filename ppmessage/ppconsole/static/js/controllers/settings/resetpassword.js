angular.module("this_app")
    .controller("SettingsResetpasswordCtrl", function($scope, $state, $stateParams, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvLogin ) {
        
        var _error_string = "";

        var _email,
            
            disableSubmitButton = function( enable ) {
                angular.element( 'input[type=submit]' ).prop( 'disabled', enable );
            };

        var _set_error_string = function(str) {
            $timeout(function() {
                _error_string = str;
            });

            $timeout(function() {
                _error_string="";
            }, 2000);
            return;
        };

        $scope.get_error_string = function() {
            return _error_string;
        }

        $scope.should_show_error_string= function() {
            return _error_string.length > 0;
        }

        $scope.close_error_string = function() {
            $timeout(function() {
                $scope._error_string= "";
            });
        }

        $scope.resetpassword = function(email) {
            if (!email) {
                _set_error_string($scope.lang["settings.resetpassword.NO_EMAIL_TAG"]);
                return;
            };

            if (_email) {

                if ($scope.reset_email != _email) {
                    _set_error_string($scope.lang["settings.resetpassword.EMAIL_NOT_MATCH_TAG"]);
                    return;
                };
                
            };

            disableSubmitButton( true );

            var l = yvAjax.send_reset_password_email(email);

            l.success(function(data) {

                switch ( data.error_code ) {
                case 0:
                    $timeout( function() { $state.go("app.confirmreset"); } );
                    break;

                case 1:
                    _set_error_string($scope.lang["settings.resetpassword.ERR_NO_USER"]);
                    break;

                default:
                    _set_error_string($scope.lang["settings.resetpassword.SERVICE_ERROR_TAG"]);
                    break;
                }

                disableSubmitButton( false );

            });

            l.error(function(data) {
                _set_error_string($scope.lang["settings.resetpassword.SERVICE_ERROR_TAG"]);
                disableSubmitButton( false );
            });
        
        };
        
        var _init = function() {
            var _tag_list = [];

            for (var i in yvTransTags.en.settings.resetpassword) {
                var _t = "settings.resetpassword." + i;
                _tag_list.push(_t);
            }

            $scope.translate = function() {                
            };
            
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);

            $scope.reset_email = _email = yvUtil.base64_decode($stateParams.email);

        };

        _init();
        
    });
