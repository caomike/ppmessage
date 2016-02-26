angular.module("this_app")
    .directive("focusMe", function() {
        return {
            restrict: "A",
            
            link: function($scope, $element, $attrs) {
                $element[0].focus();
            },
        };
    })
;
