ppmessageModule.directive("yvTextMessage", [function () {
    
    function link($scope, $element, $attrs, messageCtrl) {
        var text;
        if (!$scope.message.body_linky) {
            text = messageCtrl.getTrustedText($scope.message.body);
            $scope.message.body_linky = text;
            $element.html(text);
        } else {
            $element.html($scope.message.body_linky);
        }
        messageCtrl.scrollBottom();
    }
    
    return {
        restrict: "E",
        replace: true,
        require: "^yvMessage",
        scope: {
            message: "="
        },
        link: link,
        template: "<pre class='yv-chat-text'></pre>"
    };
    
}]);
