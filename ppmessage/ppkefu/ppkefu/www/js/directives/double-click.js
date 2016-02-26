ppmessageModule.directive("yvDoubleClick", [
    "$timeout",
function ($timeout) {

    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            var clicks = 0;

            $element.bind('click', function (evt) {
                clicks++;
                if (clicks === 1) {
                    $timeout(function () {
                        if (clicks !== 1) {
                            $scope.$apply(function () {
                                $scope.$eval($attr.yvDoubleClick);
                            });
                        }
                        clicks = 0;
                    },  300);
                }
            });
        }
    };

}]);
