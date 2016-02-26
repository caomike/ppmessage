
angular.module("this_app")
    .directive("slimScroll", function() {
        "use strict";
        
        return {
            restrict: "A",
            
            link: function($scope, $element, $attrs) {
                var off = [];
                var option = {};

                var refresh = function() {
                    if ($attrs.slimScroll) {
                        option = $scope.$eval($attrs.slimScroll);
                    }

                    $($element).slimScroll({destroy: true});
                    $($element).slimScroll(option);
                };

                var destructor = function() {
                    angular.forEach(off, function(_unregister) {
                        _unregister();
                    });
                    off = [];
                };

                var init = function() {
                    refresh();
                    off.push($scope.$watchCollection($attrs.slimScroll, refresh));                             
                };

                off.push($scope.$on("$destroy", destructor));
                init();
                
            }, //end link
        };
    })
;
