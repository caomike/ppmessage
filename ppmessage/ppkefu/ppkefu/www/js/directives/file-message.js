ppmessageModule.directive("yvFileMessage", [
    "yvMime",
    "yvSys",
    "yvUploader",
    "yvConstants",
    "yvLocal",
function (yvMime, yvSys, yvUploader, yvConstants, yvLocal) {

    function link($scope, $element, $attrs, messageCtrl) {
        
        $scope.getFileIcon = function (message) {
            return yvMime.mime_icon(message.mime);
        };
        
        $scope.getFileName = function (message) {
            return message.name;
        };
        
        $scope.getFileSize = function (message) {
            var _d = message.direction,
                _s = message.status,
                _whole,
                _uploaded,
                _size;
            
            function __bytesToSize(bytes) {
                if (bytes == 0) {
                    return '0 B';
                }
                var k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }
            
            _whole = __bytesToSize(message.size);
            
            if (_d === yvConstants.MESSAGE_DIR.DIR_OUT && _s === yvConstants.SEND_STATUS.SEND_UPLOADING) {
                _uploaded = $scope.getFileProgress(message);
                _size = parseInt(_uploaded.width) * message.size / 100;
                return __bytesToSize(_size) + "/" + _whole;
            }
            return _whole;
        };

        $scope.getMessageStatus = function (message) {

            if (message.direction === yvConstants.MESSAGE_DIR.DIR_IN) {
                return $scope.getFileSize(message);
            }
            if (message.status === yvConstants.SEND_STATUS.SEND_CHECKING) {
                return yvLocal.translate("app.GLOBAL.CHECKING_FILE");
            }
            if (message.status === yvConstants.SEND_STATUS.SEND_UPLOADING) {
                return yvLocal.translate("app.GLOBAL.UPLOADING_FILE");
            }
            if (message.status === yvConstants.SEND_STATUS.SEND_SENDING) {
                return yvLocal.translate("app.GLOBAL.SENDING");
            }
            return $scope.getFileSize(message);
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

        $scope.getFileProgress = function (message) {
            var _d = message.direction,
                _s = message.status,
                _whole = 100,
                _p;

            if (_d === yvConstants.MESSAGE_DIR.DIR_OUT && _s === yvConstants.SEND_STATUS.SEND_UPLOADING) {
                _p = yvUploader.get_item_progress(message.id);
                console.log("uploading progress ", _whole, _p);
                return {"width": _p + "%"};
            }
            return {"width": "0%"};
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
