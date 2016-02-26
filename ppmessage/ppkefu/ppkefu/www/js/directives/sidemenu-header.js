ppmessageModule.directive("yvSidemenuHeader", [
    "$rootScope",
    "yvSys",
    "yvAPI",
    "yvMain",
    "yvLink",
    "yvUser",
    "yvBase",
    "yvLogin",
function ($rootScope, yvSys, yvAPI, yvMain, yvLink, yvUser, yvBase, yvLogin) {

    function link($scope, $element, $attrs) {

        $scope.getUserIcon = function () {
            var _icon = yvUser.get("icon");
            return yvLink.get_user_icon(_icon);
        };

        
        $scope.getUserFullname = function () {
            return yvUser.get("fullname");
        };

        
        $scope.getCurrentAppName = function () {
            return yvUser.get("app").app_name;
        };
        
        
        $scope.showPopover = function () {
            $scope.page.show_popover = !$scope.page_show_popover;
        };


        $scope.logout = function () {
            yvMain.logout();
        };

        
        $scope.clickItem = function () {
            $scope.clearSearchKey();
        };

        
        $scope.startSearch = function () {
            var my_uuid = yvUser.get("uuid");
            var reg = new RegExp($scope.search.searchKey);
            $scope.search.conversations.length = 0;
            $scope.search.contacts.length = 0;
            if (!$scope.search.searchKey) {
                return;
            }
            angular.forEach(yvBase.get_list("conversation"), function (conv) {
                if (reg.test(conv.name)) {
                    $scope.search.conversations.push(conv);
                } 
            });
            angular.forEach(yvBase.get_list("contact"), function (contact) {
                if (reg.test(contact.fullname) && contact.uuid !== my_uuid) {
                    $scope.search.contacts.push(contact);
                } 
            });
        };

        
        $scope.clearSearchKey = function () {
            $scope.search.searchKey = "";
        };

        
        $scope.page = {"show_popover": false};
        
        $scope.search = {
            searchKey: "",
            conversations: [],
            contacts: []
        };
    }
    
    return {
        restrict: "E",
        replace: true,
        scope: true,
        link: link,
        templateUrl: "templates/directives/sidemenu-header.html"
    };
    
}]);
