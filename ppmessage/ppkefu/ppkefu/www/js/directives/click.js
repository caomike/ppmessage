ppmessageModule.directive('yvClick', [
    "$parse",
    "yvSys",
function($parse, yvSys) {

    function _link(scope, element, attrs) {
        var rightClick = $parse(attrs.yvRightClick);
        var leftClick = $parse(attrs.yvLeftClick);

        if (yvSys.in_pc()) {
            initPC();
        } else {
            initOther();
        }
        
        function initPC() {
            element[0].onmousedown = function (event) {
                var button = event.button;
                if (button === 0) {
                    leftClick(scope, {$event: event});
                }
                if (button === 2) {
                    rightClick(scope, {$event: event});
                }
            };
            
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                });
            });
        }

        function initOther() {
            $element.bind("click", function() {
                leftClick(scope, {$event: event});
            });
        }
    }

    return {
        restrict: "A",
        link: _link
    };
}]);
