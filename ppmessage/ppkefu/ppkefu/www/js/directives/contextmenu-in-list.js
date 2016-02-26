ppmessageModule.directive('yvContextmenu', [
    "$timeout",
    "$document",
    "yvSys",
    "yvAPI",
    "yvDB",
    "yvBase",
function ($timeout, $document, yvSys, yvAPI, yvDB, yvBase) {
    
    function _link($scope, $element, $attr) {

        function rightclickEvent(event, conversation) {
            
            $scope.conversation = null;
            $scope.conversation = conversation;
            $scope.unread = $scope.conversation.unread ? true : false;
            
            var e = event || window.event;

            var x = e.pageX || e.clientX + scrollX;
            x = x - jQuery('ion-content:last').offset().left;
            
            var y = e.pageY || e.clientY + scrollY;
            y = y - jQuery('ion-content:last').offset().top;

            
            $scope.isShow = true;

            $scope.menuStyle = {
                left: x,
                top: y
            };

            // $document.addEventListener('click', function () {
            //     $scope.isShow = false;
            //     $scope.$apply();
            // });
            
        };

        $scope.deleteConversation = function ($event) {
            // yvBase.delete_conversation($scope.conversation.uuid);
            $rootScope.$broadcast("event:count");
            if ($scope.conversation === yvBase.active_conversation()) {
                yvBase.active_conversation(null);
                if (yvSys.in_pc_browser() || yvSys.in_electron()) {
                    $rootScope.$broadcast("event:open-conversation", null);
                }
            }
            $event.stopPropagation();
            yvAPI.close_conversation($scope.conversation.uuid);
            yvDB.delete_conversation($scope.conversation.uuid);

            $scope.isShow = false;
        };

        $scope.markAsRead = function ($event) {
            var _info = {unread: 0, uuid: _conv_uuid};
            yvBase.update_conversation(_info);
            $rootScope.$broadcast("event:count");
            $event.stopPropagation();

            yvDB.unread_zero($scope.conversation.uuid);
            $scope.isShow = false;
        };

        $scope.$on('event:open-menu',function (event, e, conversation){
            $scope.isShow = false;
            rightclickEvent(e, conversation);
        });

        function _init() {
            $scope.isShow = false;
        };

        _init();
    }

    return {
        restrict: 'EA',
        scope: {

        },
        link: _link,
        templateUrl: "templates/directives/contextmenu.html"
    };
}]);
