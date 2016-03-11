ppmessageModule.controller("ChangeAvatarCtrl", [
    "$scope",
    "$timeout",
    "FileUploader",
    "$ionicLoading",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvMain",
    "yvFile",
    "yvLocal",
    "yvDelegate",
function ($scope, $timeout, FileUploader, $ionicLoading, yvSys, yvAPI, yvUser, yvMain, yvFile, yvLocal, yvDelegate) {

    /* This Controller is intended to work in pc-browser, mobile-browser, electron, NOT INCLUDING mobile-native !
     * It must be used together with directive: yvCropImage.
     */
    
    var fileItem = null;
    var reader = new FileReader();

    $scope.imgSrc = null;
    $scope.isDirty = false;
    $scope.uploader = new FileUploader();
    $scope.uploaderOptions = {
        url: yvAPI.get_server().upload_url,
        formData: [{ "user_uuid": yvUser.get("uuid") }]
    };
    
    reader.onloadstart = onReaderLoadStart;
    reader.onprogress = onReaderProgress;
    reader.onloadend = onReaderLoadEnd;
    reader.onload = onReaderLoad;

    $scope.uploader.onAfterAddingFile = onAfterAddingFile;
    $scope.uploader.onSuccessItem = onSuccessItem;
    $scope.uploader.onErrorItem = onErrorItem;

    $scope.$on("event:set-dirty", setDirty);

    function onReaderLoadStart(event) {
        var text = yvLocal.translate("app.settings.profile_photo.LOADING_TAG");
        var template = "<p>" + text + "</p>";
        $ionicLoading.show({
            delay: 100,
            scope: $scope,
            duration: 10000,
            noBackdrop: true,
            template: template
        });
    }


    function onReaderLoadEnd(event) {
        $ionicLoading.hide();
    }


    function onReaderLoad(event) {
        $timeout(function () {
            $scope.imgSrc = event.target.result;
        });
    }


    function onReaderProgress(event) {
        //CR: Show progress bar, necesarry in mobile browser
        return;
    }

    // return true if reader is loading...
    function abortActiveReader(reader) {
        if (reader && reader.readyState === FileReader.LOADING) {
            reader.abort();
            return true;
        }
        return false;
    }


    function onAfterAddingFile(item) {
        if (!reader) {
            return;
        }
        fileItem = item;
        abortActiveReader(reader);
        reader.readAsDataURL(item._file);
        return;
    }


    function onSuccessItem(item, response, status, headers) {
        if (item !== fileItem) {
            return;
        }
        var fid = response.fuuid;
        yvAPI.update_user({ user_icon: fid }, function (res) {
            yvMain.update_current_user("icon", fid);
            $scope.restore();
        });
    }


    function onErrorItem(item, response, status, headers) {
        console.error("upload item error", item, response);
    }


    function cropAvatarCallback(blob) {
        if (!fileItem) {
            return;
        }
        fileItem._file = blob;
        fileItem.upload();
        return;
    }


    function restoreAvatarCallback() {
        $scope.imgSrc = null;
        abortActiveReader(reader);
        $scope.uploader.clearQueue();
        yvDelegate.scroll_top("change-avatar", true);
    }


    function setDirty(event, bool) {
        event.stopPropagation();
        if ($scope.isDirty === !bool) {
            $timeout(function () {
                $scope.isDirty = bool;
            });
        }
    }

    
    $scope.choosePhoto = function () {
        // CR: If is loading, pop up a confirm modal
        if (abortActiveReader(reader)) {
            return;
        }
        if (yvSys.in_browser() || yvSys.in_electron()) {
            var input = document.querySelector("input#upload-avatar");
            input && input.click();
            return;
        }
        return;
    };


    // save avatar
    $scope.save = function () {
        $scope.$broadcast("event:crop-avatar", cropAvatarCallback);
    };

    
    // restore current avatar
    $scope.restore = function () {
        $scope.$broadcast("event:restore-avatar", restoreAvatarCallback);
    };

}]);
