ppmessageModule.directive("yvSelectAppModal", [
    "$timeout",
    "$ionicModal",
    "yvDB",
    "yvAPI",
    "yvSys",
    "yvNav",
    "yvUser",
    "yvLogin",
    "yvAlert",
function ($timeout, $ionicModal, yvDB, yvAPI, yvSys, yvNav, yvUser, yvLogin, yvAlert) {
    
    function _link($scope, $element, $attr) {
        
        function _sort_by_app_name(app1, app2) {
            if (app1.app_name < app2.app_name) {
                return -1;
            }
            if (app1.app_name === app2.app_name) {
                return 0;
            }
            return 1;
        }

        
        function _api_error(res) {
            yvAlert.tip("app.GLOBAL.ERR_NET");
            console.log("api error, session invalid ?", res);
            yvNav.login_with_user();
        }

        
        $scope.$on("modal.shown", function (event, modal) {
        });

        
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        
        
        $scope.$on("event:show-select-app-modal", function () {
            $scope.checkbox = {selected: false};
            yvAPI.get_app_list(yvUser.get("uuid"), yvLogin.select_app_from_list, _api_error, _api_error);
                
            // $scope.apps = data.list.sort(_sort_by_app_name);
            // yvDB.get_active_app(function (active_app) {
            //     if (!active_app) {
            //         console.log("no active app");
            //         return;
            //     }
            //     $timeout(function () {
            //         $scope.active_app = active_app;
            //     });
            //     angular.forEach($scope.apps, function (app) {
            //         if (active_app.app_key === app.app_key) {
            //             yvDB.set_active_app($scope.apps[i]);
            //         }
            //     });
            // });                
            // $scope.showModal();
        });

        
        $scope.isAppChecked = function (app) {
            if ($scope.active_app && app.app_key === $scope.active_app.app_key) {
                return true;
            }
            return false;
        };

        
        $scope.isPreceedDisabled = function () {
            if ($scope.active_app && $scope.active_app.app_key) {
                return false;
            }
            return true;
        };

        
        $scope.showModal = function () {
            $scope.modal.show();
        };

        
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        
        $scope.selectApp = function (app) {
            yvDB.set_active_app(app);
            $scope.active_app = app;
        };


        $scope.preceed = function () {
            $scope.modal.hide();
            yvLogin.logined();
            if ($scope.checkbox.selected) {
                yvDB.set_show_select_app(0);
            } else {
                yvDB.set_show_select_app(1);
            }
        };

        
        $scope.quit = function () {
            $scope.modal.hide();
            yvLogin.logout();
        };

        
        function init() {
            $ionicModal.fromTemplateUrl("select-app-modal.html", {
                scope: $scope,
                animation: "slide-in-up"
            }).then(function (modal) {
                $scope.modal = modal;
            });
        }

        init();
    }
        
    return {
        restrict: "E",
        templateUrl: "templates/directives/select-app-modal.html",
        link: _link
    };

}]);
