angular.module("this_app").directive("yvTxtMessage", [
    "yvUtil",
    "yvLog",
    function (yvUtil, yvLog) {

    function link($scope, $element, $attrs) {

        function init(message) {
            
            var fileDownloadUrl = yvUtil.fileUtil.getFileDownloadUrl(JSON.parse(message.message_body).fid);

            yvUtil.fileUtil.getRemoteTextFileContent(fileDownloadUrl, function(text) {
                $element.text(text);    
            }, function(error) {
                $element.text(error);
            });

        }
        
        init($scope.message);
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
