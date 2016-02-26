angular.module("this_app")
    .directive("uniform", function($timeout) {
        return {
            restrict: "A",
            require: 'ngModel',
            
            link: function($scope, $element, $attrs, ngModel) {
                $element.uniform({userID: false});
                $scope.$watch(function() {
                    return ngModel.$modelValue;
                }, function() {
                    $timeout(jQuery.uniform.update, 0);
                });
            },
        };
    })
;
