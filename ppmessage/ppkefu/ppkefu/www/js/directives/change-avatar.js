ppmessageModule.directive("yvChangeAvatar", [
    "$timeout",
    "$ionicLoading",
    "$ionicActionSheet",
    "yvSys",
    "yvAPI",
    "yvMain",
    "yvUser",
    "yvFile",
    "yvLocal",
    "yvConstants",
function ($timeout, $ionicLoading, $ionicActionSheet, yvSys, yvAPI, yvMain, yvUser, yvFile, yvLocal, yvConstants) {

    /* This directive is intended to work in ONLY mobile-native. Different from controller: changeAvatarCtrl,
     * it pop up a actionSheet for user to change avatar, rather than open a new page.
     */
    
    function _link($scope, $element, $attrs) {
        var actionSheet = null;
        
        $element.on("click", function (event) {
            if (!yvSys.in_mobile_app()) {
                return;
            }
            showActionSheet();
        });


        function startLoading() {
            $ionicLoading.show({
                duration: 5000,
                template: "<ion-spinner></ion-spinner>"
            });
        }

        
        function finishLoading() {
            $ionicLoading.hide();
        }

        
        function createAvatarFile(dataUrl, callback) {
            yvFile.create_random(dataUrl, true, function (fileName) {
                callback && callback(fileName);
            });
        }

        
        function createCanvasDataURL(img, dx, dy, w, h) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = yvConstants.AVATAR.WIDTH;
            canvas.height = yvConstants.AVATAR.HEIGHT;
            context.drawImage(img, dx, dy, w, h, 0, 0, canvas.width, canvas.height);            
            return canvas.toDataURL("image/jpeg", 1);
        }

        
        function dataURLtoFile(dataUrl, callback) {
            var img = document.createElement("img");
            img.onload = function (event) {
                var imgWidth = img.width;
                var imgHeight = img.height;
                // If the crop process works well, this will be the case
                if (imgWidth == yvConstants.AVATAR.WIDTH && imgHeight == yvConstants.AVATAR.HEIGHT) {
                    createAvatarFile(dataUrl, callback);
                    return;
                }
                // Should we crop the image when image size is not 140x140 ?
                // Currently we just scale image to 140x140, seems not bad.
                dataUrl = createCanvasDataURL(img, 0, 0, imgWidth, imgHeight);
                dataUrl = dataUrl.split(",")[1];
                createAvatarFile(dataUrl, callback);
            };
            img.src = "data:image/jpeg;base64," + dataUrl;
        }
        

        function saveAvatar(fileName) {
            yvAPI.upload_file(fileName, "image/jpeg", function(response) {
                if (!response) {
                    return;
                }
                response = JSON.parse(response);
                yvAPI.update_user({ user_icon: response.fuuid }, function() {
                    $timeout(function () {
                        finishLoading();
                        yvMain.update_current_user("icon", fileName);
                    });
                });
            });
        }

        
        function cropAvatar(choosePicture) {
            // In Android, setting destinationType to be Camera.DestinationType.FILE_URL results in invalid
            // image-crop (the saved file would be the origin image, not the cropped image). In iOS, both
            // Camera.DestinationType.DATA_URL and Camera.DestinationType.FILE_URL works. The Plugin itself
            // says options.allowEdit should not be used in Android, because it is unpredictable, but we have
            // not another choice.
            var options = {
                quality: 100,
                allowEdit: true,
                targetWidth: yvConstants.AVATAR.WIDTH,
                targetHeight: yvConstants.AVATAR.HEIGHT,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: choosePicture ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA,
            };
            
            // Including a JavaScript alert() in either of the callback functions can cause problems.
            // Wrap the alert within a setTimeout() to allow the iOS image picker or popover to fully
            // close before the alert displays:
            navigator.camera.getPicture(function (dataUrl) {
                startLoading();
                dataURLtoFile(dataUrl, function (fileName) {
                    saveAvatar(fileName);
                });
            }, function (message) {
                console.log("camera fail because: ", message);
            }, options);
        };

        
        // used to delay closing actionSheet after click button 
        function closeActionSheet(delay) {
            if (!delay || typeof delay !== "number") {
                delay = 0;
            }
            $timeout(function () {
                if (actionSheet) {
                    actionSheet();
                    actionSheet = null;
                }
            }, delay);
        }

        
        function showActionSheet() {
            actionSheet = $ionicActionSheet.show({
                cssClass: "change-avatar-action-sheet",
                cancelText: yvLocal.translate("app.GLOBAL.CANCEL"),
                cancel: function() {
                    closeActionSheet();
                },
                buttons: [
                    { text: yvLocal.translate("app.settings.profile_photo.TAKE_PHOTO_TAG") },
                    { text: yvLocal.translate("app.settings.profile_photo.CHOOSE_FROM_PHOTOS_TAG") }
                ],
                // Note: If button-clicked-callback return true, actionSheet will be closed In this
                // page (app.setting-list), if actionSheet closes upon button clicked, the LOGOUT
                // button could be accidently clicked, which would result in unwanted logout ...
                buttonClicked: function(index) {
                    closeActionSheet(100);
                    if (index === 0) {
                        cropAvatar(false);
                        return false;
                    }
                    if (index === 1) {
                        cropAvatar(true);
                        return false;
                    }
                    return true;
                }
            });
        }                
    }
    
    return {
        restrict: "A",
        replace: true,
        scope: true,
        link: _link
    };

}]);
