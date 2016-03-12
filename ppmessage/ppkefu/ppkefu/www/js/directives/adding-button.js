ppmessageModule.directive("yvAddingButton", [
    "$rootScope",
    "yvLocal",
    "yvSys",
    "yvAPI",
    "yvUser",
    "yvFile",
    "yvUploader",
    "yvConstants",
function ($rootScope, yvLocal, yvSys, yvAPI, yvUser, yvFile, yvUploader, yvConstants) {

    function _link($scope, $element, $attr) {

        function _camera_success(_file) {
            console.log("camera success: %s", _file);
            yvFile.copy(_file, yvSys.get_uuid(), function (file) {
                $scope.prepareImage(file.name);                
            });
        }

        function _camera_error(_data) {
            console.error("camera error %o", _data);
        }

        function _camera(_source_type, _media_type) {
            var _options = {
                quality: 50,
                sourceType : _source_type,
                destinationType: Camera.DestinationType.FILE_URL,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                targetHeight: 800
            };

            if (_media_type) {
                _options.mediaType = _media_type;
            }

            navigator.camera.getPicture(_camera_success, _camera_error, _options);
        }

        function _click_picture() {
            if (yvSys.in_mobile_app()) {
                _camera(Camera.PictureSourceType.PHOTOLIBRARY, Camera.MediaType.PICTURE);
            }
        }

        function _click_camera() {
            if (yvSys.in_mobile_app()) {
                _camera(Camera.PictureSourceType.CAMERA);
            }
        }

        function _click_file() {
            if (yvSys.in_android_app()) {
                $rootScope.$broadcast("event:show-filechooser-modal");
            }
        }

        function _click_location() {
            $rootScope.$broadcast("event:show-send-location-modal");
        }
        
        $scope.prepareImage = function (_data) {
            $scope.sendMessage({type: yvConstants.MESSAGE_SUBTYPE.IMAGE, data: {file: _data}});
        };

        $scope.uploaderOption = function (button) {
            if (yvSys.in_mobile_app()) {
                return null;
            }

            var _uploader_options = {
                url: yvAPI.get_server().upload_url,
                formData: [{upload_type: "file", user_uuid: yvUser.get("uuid")}]
            };

            return _uploader_options;
        };

        $scope.clickButton = function (button) {
            console.log("clicking ... %s", button.type);
            return button.click();
        };

        $scope.buttonName = function (button) {
            var type = yvConstants.ADDING_TYPE;

            switch (button.type) {
            case type.FILE:
                return yvLocal.translate("app.GLOBAL.FILE");
            case type.PICTURE:
                return yvLocal.translate("app.GLOBAL.PICTURE");
            case type.CAMERA:
                return yvLocal.translate("app.GLOBAL.CAMERA");
            case type.LOCATION:
                return yvLocal.translate("app.GLOBAL.LOCATION");
            case type.SLACK:
                return yvLocal.translate("app.GLOBAL.SLACK");
            case type.EVERNOTE:
                return yvLocal.translate("app.GLOBAL.EVERNOTE");
            default:
                console.error("unknown type: %s", button.type);
            }
            return "";
        };

        $scope.hasUploader = function (button) {
            var type = yvConstants.ADDING_TYPE;

            switch (button.type) {
            case type.FILE:
            case type.PICTURE:
                if (yvSys.in_mobile_app()) {
                    return false;
                }
                return true;
            case type.CAMERA:
            case type.LOCATION:
            case type.SLACK:
            case type.EVERNOTE:
                return false;
            default:
                console.error("unknown type: %s", button.type);
            }
            return false;
        };

        function _init() {
            var _t = yvConstants.ADDING_TYPE, temp, len, i;

            $scope.adding = {buttons: null, buttonrows: []};

            if (yvSys.in_android_app()) {
                $scope.adding.buttons = [
                    {type: _t.FILE, image: "img/adding_file.png", click: _click_file},
                    {type: _t.PICTURE, image: "img/adding_picture.png", click: _click_picture},
                    {type: _t.CAMERA, image: "img/adding_camera.png", click: _click_camera}
                    //{type: _t.LOCATION, image: "img/adding_location.png", click: _click_location},
                    //{type: _t.EVERNOTE, image: "img/adding_evernote.png", click: _click_evernote},
                ];
            } else if (yvSys.in_ios_app()) {
                $scope.adding.buttons = [
                    //{type: _t.FILE, image: "img/adding_file.png", click: _click_file},
                    {type: _t.PICTURE, image: "img/adding_picture.png", click: _click_picture},
                    {type: _t.CAMERA, image: "img/adding_camera.png", click: _click_camera}
                    //{type: _t.LOCATION, image: "img/adding_location.png", click: _click_location},
                    //{type: _t.EVERNOTE, image: "img/adding_evernote.png", click: _click_evernote},
                ];
            } else {
                $scope.adding.buttons = [
                    {type: _t.FILE, image: "img/adding_file.png", click: _click_file},
                    {type: _t.PICTURE, image: "img/adding_picture.png", click: _click_picture}
                    //{type: _t.LOCATION, image: "img/adding_location.png", click: _click_location},
                    //{type: _t.EVERNOTE, image: "img/adding_evernote.png", click: _click_evernote},
                ];
            }

            temp = angular.copy($scope.adding.buttons);
            len = Math.ceil($scope.adding.buttons.length / 4);
            for (i = 0; i < len; i++) {
                $scope.adding.buttonrows[i] = temp.slice(i * 4, (i + 1) * 4);
            }

            if (!yvSys.in_ios_app()) {
                $scope.uploader = yvUploader.get_uploader();
            }
        }

        _init();
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/addingbutton.html",
        link: _link
    };

}]);
