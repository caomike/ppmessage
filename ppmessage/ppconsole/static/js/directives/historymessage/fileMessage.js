angular.module("this_app").directive("yvFileMessage", [
    "$translate",
    "yvUtil",
    "yvLog",
    function ($translate, yvUtil, yvLog) {

        function link($scope, $element, $attrs) {
            var jsonBody = JSON.parse($scope.message.message_body);
            var childElement = $element.find(".yv-chat-file");

            $translate(['statistics.historymessages.MESSAGE_FILE_TYPE_TAG',
                        'statistics.historymessages.MESSAGE_IMAGE_TYPE_TAG',
                        'statistics.historymessages.MESSAGE_TXT_TYPE_TAG'])
                .then(function(translatedObj) {

                    // $element.text(yvUtil.messageUtil.getMessageSummary(translatedObj,
                    childElement.text(yvUtil.messageUtil.getMessageSummary(translatedObj,
                    'FILE',
                    $scope.message.message_body))
                        .attr('href', yvUtil.fileUtil.getFileDownloadUrl(jsonBody.fid, jsonBody.name));                          
                    
                });
            
        }
        
        return {
            restrict: "E",
            replace: true,
            scope: {
                message: "=",
                lang: "="
            },
            link: link,        
            template: "<div class='yv-chat-div'><a class='yv-chat-file'></a></div>"
        };
        
    }]);
