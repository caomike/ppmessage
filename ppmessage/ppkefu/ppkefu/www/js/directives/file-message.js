ppmessageModule.directive("yvFileMessage", [
    "yvMime",
    "yvSys",
    "yvMain",
    "yvUploader",
    "yvConstants",
    "yvLocal",
function (yvMime, yvSys, yvMain, yvUploader, yvConstants, yvLocal) {

    function link($scope, $element, $attrs, messageCtrl) {
                
        function bytesToSize(bytes) {
            if (bytes == 0) {
                return '0 B';
            }
            var k = 1000, // or 1024
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        }

        $scope.getMessageStatus = function (message) {
            switch (message.status) {
            case yvConstants.SEND_STATUS.SEND_CHECKING:
                return yvLocal.translate("app.GLOBAL.CHECKING_FILE");
            case yvConstants.SEND_STATUS.SEND_UPLOADING:
                return yvLocal.translate("app.GLOBAL.UPLOADING_FILE");
            case yvConstants.SEND_STATUS.SEND_SENDING:
                return yvLocal.translate("app.GLOBAL.SENDING");
            case yvConstants.SEND_STATUS.SEND_CANCELED:
                return yvLocal.translate("app.GLOBAL.CANCELED");
            default:
                return "";
            }
        };
        
        $scope.shouldShowProgress = function (message) {
            var _d = message.direction,
                _s = message.status;

            if (yvSys.in_ios_app()) {
                return false;
            }
            if (_d === yvConstants.MESSAGE_DIR.DIR_OUT && _s === yvConstants.SEND_STATUS.SEND_UPLOADING) {
                return true;
            }
            return false;
        };
        
        $scope.cancelUpload = function (message) {
            yvMain.update_message_status(message, yvConstants.SEND_STATUS.SEND_CANCELED);
            if (yvSys.in_android_app()) {
                message.ft.abort();
            } else {
                message.fileItem.cancel();
            }
            return {"width": "0%"};
        };
        
        $scope.getFileProgress = function (message) {
            var progress = (message.upload_progress || 0) + "%";
            return {"width": progress };
        };
        
        function init(m) {
            var body = {};
            
            if (m.body) {
                body = angular.fromJson(m.body);
            }
            
            if (body !== null) {
                m.mime = m.mime || body.mime || "";
                m.size = m.size || body.size || "";
                m.name = m.name || body.name || "";
                m.file = m.file || body.fid || "";
            }
            
            $scope.fileName = m.name;
            $scope.fileSize = bytesToSize(m.size);
            $scope.fileIcon = yvMime.mime_icon(m.mime);
            messageCtrl.scrollBottom();
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
        templateUrl: "templates/directives/file-message.html"
    };
    
}]);
