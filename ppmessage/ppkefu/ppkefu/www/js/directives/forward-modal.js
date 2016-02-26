ppmessageModule.directive("yvForwardModal", [
    "$timeout",
    "$ionicModal",
    "yvDB",
    "yvBase",
    "yvLink",
    "yvConstants",
function ($timeout, $ionicModal, yvDB, yvBase, yvLink, yvConstants) {

    function _link($scope, $element, $attr) {
        var _contacts = null;

        $ionicModal.fromTemplateUrl("forward-modal.html", {
            scope: $scope,
            animation: "slide-in-up"
        }).then(function (modal) {
            $scope.forwardModal = modal;
        });

        function _forward_message(_contact_uuid, _message) {
            console.log("_forward_message: %o", _message.task_uuid);
            var _conv_type = yvConstants.CONVERSATION_TYPE.S2S;
            yvDB.open_conversation(_contact_uuid, _conv_type, function (_conv_uuid, assigned_uuid) {
                var _forward = {
                    conv_uuid: _conv_uuid,
                    conv_type: _conv_type,
                    user_uuid: _contact_uuid,
                    message: $scope.message
                };
                yvDB.forward_message_new(_forward);
            });
        }

        function _update_contact() {
            yvDB.query_deviceuser_contacts(function (_o) {
                $timeout(function () {
                    _contacts = _o;
                    $scope.contacts = _o;
                });
            });
        }

        function _update_selected_row() {
            var temp = angular.copy($scope.selected),
                len_sc = temp.length,
                len_row = Math.ceil(len_sc / 5),
                row = [],
                i;

            for (i = 0; i < len_row; i++) {
                row[i] = temp.slice(i * 5, (i + 1) * 5);
            }

            $timeout(function () {
                $scope.selectedRow = row;
            });
        }

        $scope.sureForward = function () {
            console.log("sure forward......", $scope.selected, $scope.message);
            $scope.closeModal();
            angular.forEach($scope.selected, function (contact_uuid) {
                _forward_message(contact_uuid, $scope.message);
            });
        };

        $scope.getObjectIcon = function (contact) {
            return yvLink.get_user_icon(contact.icon);
        };

        $scope.getSelectedIcon = function (_uuid) {
            var icon = yvBase.get("object", _uuid, "icon");
            return yvLink.get_user_icon(icon);
        };

        $scope.getSelectedFullname = function (_uuid) {
            return yvBase.get("object", _uuid, "fullname");
        };

        $scope.searchContacts = function () {
            if (!$scope.page.search_key) {
                $scope.contacts = _contacts;
            } else {
                var reg = new RegExp($scope.page.search_key);
                $scope.contacts = [];
                angular.forEach(_contacts, function (contact) {
                    if (reg.test(contact.fullname) || reg.test(contact.name)) {
                        $scope.contacts.push(contact);
                    }
                });
            }
        };

        $scope.removeSelected = function (contact) {
            var index = $scope.selected.indexOf(contact);
            if (index !== -1) {
                $scope.selected.splice(index, 1);
                _update_selected_row();
            }
        };

        $scope.toggleCheckbox = function (contact) {
            var index = $scope.selected.indexOf(contact.uuid);
            if (index === -1) {
                $scope.selected.push(contact.uuid);
            } else {
                $scope.selected.splice(index, 1);
            }
            _update_selected_row();
        };

        $scope.isSelected = function (contact) {
            if ($scope.selected.indexOf(contact.uuid) !== -1) {
                return true;
            }
            return false;
        };

        $scope.showModal = function () {
            $scope.forwardModal.show();
        };

        $scope.closeModal = function () {
            $scope.forwardModal.hide();
        };

        $scope.$on("event:show-forward-modal", function () {
            $scope.contacts = [];
            $scope.selected = [];
            $scope.selectedRow = [];
            $scope.page = {search_key: ""};

            _update_contact();
            $scope.showModal();
        });

        $scope.$on('$destroy', function () {
            $scope.forwardModal.remove();
        });

    }

    return {
        restrict: "E",
        scope: {
            message: "="
        },
        templateUrl: "templates/directives/forwardmodal.html",
        link: _link
    };

}]);
