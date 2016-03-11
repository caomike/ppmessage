ppmessageModule.directive("yvSearchModal", [
    "$ionicModal",
    "yvBase",
    "yvUser",
    "yvConstants",
function ($ionicModal, yvBase, yvUser, yvConstants) {

    function _link($scope, $element, $attr) {
        
        $scope.showModal = function () {
            $scope.modal.show();
        };

        
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        
        $scope.$on("event:show-search-modal", function () {
            $scope.showModal();
        });

        
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        
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
                    return;
                }
                if (conv.type == yvConstants.CONVERSATION_TYPE.P2S) {
                    var user_name = yvBase.get("object", conv.user_uuid, "fullname");
                    if (reg.test(user_name)) {
                        $scope.search.conversations.push(conv);                        
                    }
                } 
            });
            angular.forEach(yvBase.get_list("contact"), function (contact) {
                if (reg.test(contact.fullname) && contact.uuid !== my_uuid) {
                    $scope.search.contacts.push(contact);
                } 
            });
        }


        $scope.clearSearchKey = function () {
            $scope.search.searchKey = "";
            $scope.startSearch();
        };


        $scope.clickItem = function () {
            $scope.closeModal();
        };

        function _init() {
            $scope.search = {
                searchKey: "",
                contacts: [],
                conversations: []
            };
            
            $ionicModal.fromTemplateUrl('search-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
        }

        _init();

    }

    return {
        restrict: "E",
        scope: true,
        link: _link,
        templateUrl: "templates/directives/search-modal.html"
    };
    
}]);
