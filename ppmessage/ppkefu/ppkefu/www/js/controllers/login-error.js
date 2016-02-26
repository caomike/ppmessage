ppmessageModule.controller("LoginErrorCtrl", [
    "$scope",
    "$timeout",
    "yvNav",
function ($scope, $timeout, yvNav) {

    $scope.remainTime = 5;

    var interval = setInterval(function () {
        if ($scope.remainTime > 0) {
            $timeout(function () {
                $scope.remainTime -= 1;
            });
        } else {
            $scope.goToPortal();
        }
    }, 1000);

    $scope.goToPortal = function () {
        interval && clearInterval(interval);
        yvNav.exit_app();
    };

}]);
