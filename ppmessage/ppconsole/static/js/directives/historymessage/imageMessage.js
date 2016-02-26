angular.module("this_app").directive("yvImageMessage", [
    "yvUtil",
    "yvLog",
    function(yvUtil, yvLog) {

        function link($scope, $element, $attrs) {
            
            function init (message) {

                var imageMessageBody = message.message_body,
                    icon = yvUtil.iconUtil.getIcon(JSON.parse(imageMessageBody).orig); // or thum
                
                $element.find("img").attr('src', icon);
                
            }

            init($scope.message);
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                message: "="
            },
            link: link,
            template: '<div class="yv-chat-image"><img></div>'
        };

    }]);
