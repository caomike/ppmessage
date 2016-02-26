ppmessageModule.directive("yvAddMemberByContact", [
    "yvLog",
    "yvAPI",
    "yvLink",
    "yvBase",
function(yvLog, yvAPI, yvLink, yvBase) {
    
    function _link($scope, $element, $attrs) {
        var all_contacts = [];

        setAllContacts();
        $scope.search = { search_key: "" };
        $scope.all_contacts = all_contacts;
        $scope.display_contacts = all_contacts;
        
        function setAllContacts() {
            angular.copy(yvBase.get_list("contact"), all_contacts);
            if (!$scope.ignore_list) {
                return;
            }
            var uuid = null;
            for(var len = all_contacts.length, i = len - 1; i >= 0; i--) {
                if ($scope.ignore_list.indexOf(all_contacts[i].uuid) !== -1) {
                    all_contacts.splice(i, 1);
                }
            }
        }
        
        $scope.startSearch = function () {
            var reg = new RegExp($scope.search.search_key);
            if (!reg) {
                $scope.display_contacts = all_contacts;
                return;
            }

            $scope.display_contacts = [];
            angular.forEach(all_contacts, function (contact, index) {
                if (reg.test(contact.fullname)) {
                    $scope.display_contacts.push(contact);
                }
            });
        };

        $scope.save = function () {
            var members = [];
            angular.forEach(all_contacts, function (contact) {
                if (contact.is_selected) {
                    members.push(contact.uuid);
                }
            });
            var params = {
                "action": "ADD",
                "member_list": members,
                "conversation_uuid": $scope.conversation.uuid
            };
            yvAPI.update_conversation_member(params, function (res) {
                $scope.closeModal();
            });
        };

    }

    return {
        restrict: "E",
        replace: true,
        link: _link,
        templateUrl: "templates/directives/add-member-by-contact.html"
    };
    
}]);
