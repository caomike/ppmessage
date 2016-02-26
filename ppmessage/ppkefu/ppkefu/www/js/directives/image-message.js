ppmessageModule.directive("yvImageMessage", [
    "$window",
    "yvLink",
    "yvSys",
    "yvFile",
    "yvMime",
    "yvAPI",
function($window, yvLink, yvSys, yvFile, yvMime, yvAPI) {

    var helper = {
        support: !!$window.FileReader,
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    function link($scope, $element, $attrs, messageCtrl) {

        function renderElement(file) {
            var DEFAULT_IMAGE = yvLink.default_image_pic();
            var img = $element.find("img")[0];
            var reader = null;
            
            if (arguments === 0 || !file) {
                file = $scope.message.file || $scope.message.thumbnail;
            }
            
            // if it is the lastest message, content should scroll bottom when image is loaded
            if (messageCtrl.isLast) {
                img.onload = function (event) {
                    messageCtrl.scrollBottom();
                };
            }
            
            if (!helper.isFile(file)) {
                img.src = yvLink.get_message_image($scope.message);
                return;
            }

            if (helper.isImage(file)) {
                if (!helper.support) {
                    img.src = DEFAULT_IMAGE;
                    return;
                }
                reader = new FileReader();
                reader.onload = function(event) {
                    img.src = event.target.result || DEFAULT_IMAGE;
                };
                reader.readAsDataURL(file);
                return;
            }
        }

        function setThumb(thumbFile) {
            $scope.message.thumbnail = thumbFile;
            $scope.message.file = null;
            renderElement(thumbFile);
        }
        
        function init (message) {
            var body = {}, unregister = null;
            
            if (message.body) {
                body = angular.fromJson(message.body);
            }
            
            if (body.mime && message.mime === null) {
                message.mime = body.mime;
            }
            
            // in browser, file is either a fileItem or a file_uuid
            if (!yvSys.in_mobile_app()) {
                message.file = message.file || body.orig;
                renderElement();
                return;
            }
            
            // watcher for updating thumnail to orgin image when click & view image
            unregister = $scope.$watch("message.file", function (newFile, oldFile) {
                if (newFile && newFile !== oldFile) {
                    renderElement(newFile);
                    unregister();
                }
            });
            
            // In mobile, if file or thumbnail is valid,
            // it is either a downloaded message or a sent message. If both
            // file and thumnail is null, it must be a history
            // message. In that case, we have to check whether file is already
            // existed in mobile, and download it if the answer is not.
            if (message.file || message.thumbnail) {
                renderElement();
                return;
            }
                        
            yvFile.has_file(body.orig, function () {
                message.file = body.orig;
                renderElement();
            }, function () {
                yvFile.has_file(body.thum, function () {
                    setThumb(body.thum);
                }, function () {
                    yvAPI.download_file(body.thum, null, function () {
                        setThumb(body.thum);
                    });
                });
            });
        }

        init($scope.message);
    }

    return {
        restrict: 'E',
        replace: true,
        require: "^yvMessage",
        scope: {
            message: "="
        },
        link: link,
        template: '<div class="yv-chat-image"><img></div>'
    };

}]);
