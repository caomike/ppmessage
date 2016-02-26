ppmessageModule.directive("yvContact", [
    "$state",    
    "$timeout",
    "$rootScope",
    "yvSys",
    "yvBase",
    "yvLink",
function ($state, $timeout, $rootScope, yvSys, yvBase, yvLink) {

    function link($scope, $element, $attrs) {
        
        $scope.getIcon = function (contact) {
            var icon = yvBase.get("object", contact.uuid, "icon");
            return yvLink.get_user_icon(icon);
        };

        
        $scope.getFullname = function (contact) {
            return contact.fullname;
        };


        $scope.getContactClass = function (contact) {
            if (yvSys.in_mobile()) {
                return "";
            }            
            if (contact === yvBase.active("contact")) {
                return "active";
            }
            return "";
        };
        
        
        $scope.viewDetail = function (contact) {
            if (contact === yvBase.active("contact")) {
                if ($state.is("app.contact-list") && (yvSys.in_pc())) {
                    return;
                }
            }
            
            yvBase.active("contact", contact);
            
            if (yvSys.in_pc()) {
                if ($state.is("app.contact-list")) {
                    $rootScope.$broadcast("event:view-contact", contact.uuid);
                } else {
                    $state.go("app.contact-list", {"contact_uuid": contact.uuid});
                }
            } else {
                $state.go("app.contact-list-mobile");
                $timeout(function () {
                    $state.go("app.contact-mobile", {"contact_uuid": contact.uuid});
                });
            }
        };

    }
    
    return {
        restrict: "E",
        replace: true,
        scope: {
            contact: "="
        },
        link: link,
        templateUrl: "templates/directives/contact.html"
    };

}]);
