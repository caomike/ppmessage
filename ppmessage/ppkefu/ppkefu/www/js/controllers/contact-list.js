ppmessageModule.controller("ContactListCtrl", [
    "$scope",
    "$timeout",
    "$rootScope",
    "$stateParams",
    "yvSys",
    "yvUser",
    "yvLink",
    "yvBase",
    "yvLogin",
function ($scope, $timeout, $rootScope, $stateParams, yvSys, yvUser, yvLink, yvBase, yvLogin) {

    $scope.$on("event:reload", function () {
        _init();
    });

    
    $scope.$on("$ionicView.beforeEnter", function (event, currentView) {
        yvLogin.check_session();
    });

    
    $scope.showContact = function (contact) {
        if (contact.uuid === yvUser.get("uuid")) {
            return false;
        }
        return true;
    };

    
    function _init() {
        $scope.contacts = yvBase.get_list("contact");
        
        if (yvSys.in_pc()) {
            $timeout(function () {
                $rootScope.$broadcast("event:view-contact", $stateParams.contact_uuid);
            });
        }
        
    }

    _init();
}]);
