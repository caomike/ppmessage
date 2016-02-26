ppmessageModule.directive('yvRightclickMenu', [
    "$timeout",
    "yvSys",
function ($timeout, yvSys) {
    
    function _link($scope, $element, $attr) {

        // $scope.unread = $attr[conversation].unread;

        function rightclickEvent(event) {
            
            var e = event || window.event;

            // prevent the default menu of browser.
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;

            $scope.isShow = true;
            $scope.startX = x;
            $scope.startY = y;

            $scope.menuStyle = {
                top: startX,
                right: startY
            }

            function clickEventListener(event) {
                $scope.click_count += 1;
                if ($scope.click_count === 1) {
                    return;
                }
                if (!event.target.hasAttribute("yv-menu")) {
                    $scope.isShow = false;
                    document.removeEventListener('click', clickEventLister);
                }
            };

            document.addEventListener('click', clickEventListener);

        };

        function _init() {
            $element.on('contextmenu', rightclickEvent);
        };

        _init();
    }

    return {
        restrict: 'EA',
        scope: {
            conversation: "="
        },
        link: _link,
        templateUrl: "templates/directives/rightclickmenu.html"
    };
}]);
