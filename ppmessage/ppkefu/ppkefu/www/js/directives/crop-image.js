ppmessageModule.directive("yvCropImage", [
    "yvLink",
    "yvConstants",
function (yvLink, yvConstants) {

    /* This directive is intended to work in pc-browser, mobile-browser, electron, NOT INCLUDING mobile-native !
     * It is used together with controller: changeAvatarCtrl.
     */
    
    function _link($scope, $element, $attrs) {
        var jcrop_api = null;
        var thumbnail = null;
        var img = $element.find("img#target-image");
        var thumb_width = yvConstants.AVATAR.WIDTH;
        var thumb_height = yvConstants.AVATAR.HEIGHT;
        var thumb_size = {
            width: thumb_width,
            height: thumb_height
        };
        var options = {
            boxWidth: 600,
            boxHeight: 400,
            aspectRatio: 1,
            minSize: [thumb_width, thumb_height],
            setSelect: [100, 100, 400, 400]
        };

        setCurrentAvatar();

        $scope.$on("event:restore-avatar", function (event, callback) {
            restore(callback);
        });

        
        $scope.$on("event:crop-avatar", function (event, callback) {
            cropAvatar(callback);
        });

        
        // CR: use jcrop_api.setImage rather than jcrop_api.destroy
        $scope.$watch("imgSrc", function (new_src, old_src) {
            if (!new_src) {
                return;
            }
            if (jcrop_api) {
                jcrop_api.destroy();
            }
            img.attr("src", new_src);
            initJcrop();
        });

        
        function setCurrentAvatar() {
            $scope.userIcon = yvLink.current_user_avatar();
        }
        
        
        function setDirty(bool) {
            $scope.$emit("event:set-dirty", !!bool);
        }

        
        function initJcrop() {
            img.Jcrop(options, function () {
                jcrop_api = this;
                thumbnail = this.initComponent("Thumbnailer", thumb_size);
                setDirty(true);
            });
        }

        
        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }


        function getTrueSelection(selection, scale) {
            return {
                x: Math.round(selection.x / scale.x),
                y: Math.round(selection.y / scale.y),
                x2: Math.round(selection.x2 / scale.x),
                y2: Math.round(selection.y2 / scale.y),
                w: Math.round(selection.w / scale.x),
                h: Math.round(selection.h / scale.y),
            };
        }
        
        
        function cropAvatar (callback) {
            if (!jcrop_api) {
                return;
            }
            var canvas = jcrop_api.container.context;
            var selection = jcrop_api.getSelection();
            var container_size = jcrop_api.getContainerSize();
            var scale = {
                x: container_size[0] / canvas.width,
                y: container_size[1] / canvas.height
            };
            var s = getTrueSelection(selection, scale);
            
            var avatar = document.createElement("canvas");
            avatar.width = thumb_width;
            avatar.height = thumb_height;
            var context = avatar.getContext("2d");
            context.drawImage(canvas, s.x, s.y, s.w, s.h, 0, 0, thumb_width, thumb_height);

            var data_url = avatar.toDataURL();
            var blob = dataURLtoBlob(data_url);
            // var file = new File([blob], "avatar-blob", {type: blob.type});
            // callback && callback(blob, file);

            // NOTICE: Safari, IE, Edge doesn't support File constructor.
            // So we wont't construct a File, just return blob.
            callback && callback(blob);
        }

        
        function restore(callback) {
            if (!jcrop_api) {
                return;
            }
            jcrop_api.destroy();
            jcrop_api = null;
            setDirty(false);
            setCurrentAvatar();
            img.attr("src", null);
            callback && callback();
        };
        
    }
    
    return {
        restrict: "E",
        replace: true,
        scope: {
            imgSrc: "=",
            isDirty: "="
        },
        link: _link,
        templateUrl: "templates/directives/crop-image.html"
    };
}]);
