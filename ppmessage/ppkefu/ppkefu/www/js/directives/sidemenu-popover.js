ppmessageModule.directive("yvSidemenuPopover", [
    "$timeout",    
    "$rootScope",
    "yvDB",
    "yvSys",
    "yvAPI",
    "yvMain",
    "yvUser",
    "yvLogin",
    "yvLocal",
    "yvAlert",
function ($timeout, $rootScope, yvDB, yvSys, yvAPI, yvMain, yvUser, yvLogin, yvLocal, yvAlert) {
    
    function _link($scope, $element, $attr) {

        var filter = {
            "en": "en",
            "zh-cn": "zh-Hans",
            "zh_cn": "zh-Hans",
            "zh-hans": "zh-Hans"
        };

        function _filter_language(language) {

            // for Chinese, which can't be distinguished by prefix: zh
            var lower = language.toLowerCase();
            if (filter[lower]) {
                return filter[lower];
            }
            // for other language like EN, just return the 2-leter prefix
            if (language.length >= 2) {
                return language.slice(0, 2);
            }
            return language;
        }

        function _sort_by_app_name(app1, app2) {
            if (app1.app_name < app2.app_name) {
                return -1;
            }
            if (app1.app_name === app2.app_name) {
                return 0;
            }
            return 1;
        }

        function _init_cb(language) {
            language = _filter_language(language);
            angular.forEach($scope.popover.languages, function (lang, index) {
                if (lang.language === language) {
                    $scope.popover.active_language = lang;
                }
            });
        }

        function _close_popover(event) {
            $scope.event_count += 1;
            if ($scope.event_count === 1) {
                return; // the 'show popover' button is clicked
            }
            if (!event.target.hasAttribute("yv-no-close")) {
                $timeout(function () {
                    $scope.page.show_popover = false;
                });
            }
        }

        $scope.logout = function () {
            $scope.page.show_popover = false;
            yvLogin.logout();
        };

        $scope.$watch("popover.active_language.language", function (newVal, oldVal) {
            console.log("switch language", oldVal, "--->", newVal);
            if (!oldVal || !newVal || newVal === oldVal) {
                return;
            }
            if (yvSys.in_mobile_app()) {
                navigator.globalization.setPreferredLanguage(newVal, function () {
                    yvLocal.localize(function () {
                        yvAlert.success();
                        $timeout(function () {
                            $scope.page.show_popover = false;
                        });
                    });
                });
            } else {
                yvLocal.localize_by_language(newVal);
                yvAlert.success();
                $timeout(function () {
                    $scope.page.show_popover = false;
                });
            }
        });

        $scope.$watch("popover.active_app.app_key", function (newVal, oldVal) {
            console.log("switch app_key", oldVal, "--->", newVal);
            if (!oldVal || !newVal || newVal === oldVal) {
                return;
            }
            yvDB.set_active_app($scope.popover.active_app);
            yvDB.init_userdb(yvUser.get("uuid"), function () {
                yvMain.reload();
                $rootScope.$broadcast("event:reload");
                $timeout(function () {
                    $scope.page.show_popover = false;
                });
            });
        });

        $scope.$on("$destroy", function () {
            document.removeEventListener("click", _close_popover);
            document.removeEventListener("dragstart", _close_popover);
        });

        function _init() {
            $scope.popover = {};
            $scope.event_count = 0;
            $scope.popover.languages = [
                {display_name: "English", language: "en"},
                {display_name: " 简体中文", language: "zh-Hans"}
            ];

            if (yvSys.in_mobile_app()) {
                navigator.globalization.getPreferredLanguage(function (language) {
                    _init_cb(language.value);
                });
            } else {
                _init_cb(yvLocal.get_current_language());
            }

            document.addEventListener("click", _close_popover);
            document.addEventListener("dragstart", _close_popover);

            yvAPI.get_app_list(yvUser.get("uuid"), function (data) {
                $scope.popover.apps = [];
                angular.forEach(data.list, function (app, key) {
                    if (app.is_service_user || app.is_owner_user) {
                        $scope.popover.apps.push(app);
                    }
                });

                $scope.popover.apps.sort(_sort_by_app_name);
                var active_app_key = yvUser.get("app").app_key;
                for (var i = 0, len = data.list.length; i < len; i++) {
                    if (data.list[i].app_key === active_app_key) {
                        $scope.popover.active_app = data.list[i];
                        break;
                    }
                }
            });
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/side-menu-popover.html",
        link: _link
    };

}]);
