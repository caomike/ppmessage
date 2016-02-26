angular.module("this_app").directive("yvTextMessage", [function () {

    function link($scope, $element, $attrs) {
        $element.html($scope.message.message_body);
    }

    return {
        restrict: "E",
        replace: true,
        scope: {
            message: "="
        },
        link: link,
        template: "<pre class='yv-chat-text'></pre>"
    };

}]);
