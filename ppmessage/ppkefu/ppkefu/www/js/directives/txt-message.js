ppmessageModule.directive("yvTxtMessage", [
    "yvSys",
    "yvFile",
    "yvAPI",
    "yvLog",
function (yvSys, yvFile, yvAPI, yvLog) {

    function link($scope, $element, $attrs, messageCtrl) {
        
        function renderElement(data) {
            var text = messageCtrl.getTrustedText(data);
            
            $scope.message.txt_content = data;
            $scope.message.txt_content_linky = text;
            $element.html(text);
            
            messageCtrl.scrollDownByElement($element[0]);
            messageCtrl.scrollBottom();
        }
        
        function readTxt(filePath) {
            yvFile.read_as_text(filePath, function (data) {
                renderElement(data);
            });
        }

        function init(message) {
            var body = {};
            var fileName = null;
            var filePath = null;
            
            if (message.body) {
                body = angular.fromJson(message.body);
            }

            fileName = message.file || body.fid;            
            if (!yvSys.in_mobile_app()) {
                yvAPI.download_txt(fileName).success(function (data) {
                    renderElement(data);
                });
                return;
            }

            yvFile.has_file(fileName, function (file) {
                readTxt(file.toURL());
            }, function () {
                if (!body.fid) {
                    console.error("TXT MESSAGE MISSING MESSAGE FILE", message);
                    $element.html("...");
                    return;
                }
                yvAPI.download_file(body.fid, null, function (file) {
                    readTxt(file.toURL());
                    //fixme: update db, should not read file again !
                });
            });
        }
        
        init($scope.message);
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
