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
        
        $scope.$on("event:online", function(event, params) {
            console.log("receive online message in contact-list");
            //params.type: online, params.online: true/false, params.user_uuid: user_uuid
            console.log("params %o", params);
            //FIXME: should load contact online which already set in yvObject
        });

    }

    _init();
}]);
