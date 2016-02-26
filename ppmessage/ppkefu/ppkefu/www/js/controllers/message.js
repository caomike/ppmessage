ppmessageModule.controller("MessageCtrl", [
    "$scope",
    "$filter",
    "$sce",
    "yvDelegate",
function controller($scope, $filter, $sce, yvDelegate) {
    var self = this;

    self.isLast = $scope.isLast;
    
    self.scrollBottom = function () {
        if ($scope.isLast === true && !$scope.message.disableScroll) {
            yvDelegate.scroll_bottom();
        }
    };

    self.scrollDownByElement = function (element) {
        var height = getClientRectHeight(element);
        if ($scope.isLast === true || $scope.message.disableScroll) {
            return;
        }
        yvDelegate.scroll_down(height);
    };
    
    self.getTrustedText = function (rawText) {
        var newText = $filter("linky")(rawText, "_blank");
        return $sce.trustAsHtml(newText);
    };

    
    function getClientRectHeight(element) {
        var height = 0;
        if (element.getBoundingClientRect) {
            height = element.getBoundingClientRect().height;
        }
        return height;
    }
    
}]);
