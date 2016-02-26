ppmessageModule.directive("yvAddMemberModal", [
    "$rootScope",
    "$ionicModal",
    "yvLog",
    "yvAPI",
    "yvLink",
    "yvBase",
function ($rootScope, $ionicModal, yvLog, yvAPI, yvLink, yvBase) {

    function _link($scope, $element, $attrs) {
        var thisModal = null;

        $scope.conversation = {};
        $scope.ignore_list = [];
        $scope.addByGroup = false;
        $scope.addByContact = false;
        
        $ionicModal.fromTemplateUrl("add-member-modal.html", {
            scope: $scope,
            animation: "slide-in-up"
        }).then(function (modal) {
            thisModal = modal;
        });

        $scope.$on("event:add-member-modal", function (event, conversation, ignore_list) {
            $scope.conversation = conversation;
            $scope.ignore_list = ignore_list;
            $scope.showModal();
        });

        $scope.$on("$destroy", function () {
            thisModal && thisModal.remove();
        });


        // tell chat-tool to pause keyboard listener
        $scope.$on("modal.shown", function () {
            $rootScope.$broadcast("event:pause-listen-keyboard");
        });
        
        $scope.$on("modal.hidden", function () {
            $rootScope.$broadcast("event:resume-listen-keyboard");
        });
        
        $scope.showModal = function () {
            $scope.addByGroup = false;
            $scope.addByContact = true;
            thisModal && thisModal.show();
        };

        $scope.closeModal = function () {
            $scope.addByGroup = false;
            $scope.addByContact = false;
            thisModal && thisModal.hide();
        };

        $scope.toggleAddMode = function (mode) {
            if (mode == "contact") {
                $scope.addByGroup = false;
                $scope.addByContact = true;
                return;
            }
            if (mode == "group") {
                $scope.addByGroup = true;             
                $scope.addByContact = false;
                return;
            }
        };

        $scope.getSubtitleClass = function (mode) {
            if (mode == "contact") {
                return $scope.addByContact == true ? "button-balanced" : "button-stable";
            }
            if (mode == "group") {
                return $scope.addByGroup == true ? "button-balanced" : "button-stable";
            }
        };

        $scope.getAvatar = function (user) {
            var icon = yvBase.get("object", user.uuid, "icon");
            return yvLink.get_user_icon(icon);
        };
        
        $scope.getFullname = function (user) {
            return yvBase.get("object", user.uuid, "fullname");
        };

        $scope.getSelectedNumber = function (list) {
            var number = 0;
            angular.forEach(list, function (item) {
                item.is_selected && number++;
            });
            return number;
        };
        
        $scope.disableSave = function (list) {
            return $scope.getSelectedNumber(list) ? false : true;
        };

        $scope.getScrollMaxHeight = function (sibling_id) {
            var parent_height = angular.element(".modal-content").height();
            var sibling_height = angular.element(sibling_id).height();
            var save_height = angular.element(".save-button").height();
            var height = parent_height - sibling_height - save_height;

            if (height) {
                return {"max-height": height + "px"};
            }
        };
        
    }
    
    return {
        restrict: "E",
        replace: true,
        scope: true,
        link: _link,
        templateUrl: "templates/directives/add-member-modal.html"
    };
}]);
