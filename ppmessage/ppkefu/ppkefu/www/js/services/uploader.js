ppmessageModule.factory("yvUploader", [
    "$timeout",
    "FileUploader",
    "yvLog",
    "yvAPI",
    "yvSys",
    "yvUser",
    "yvMain",
    "yvBase",
    "yvSend",
    "yvConstants",
function ($timeout, FileUploader, yvLog, yvAPI, yvSys, yvUser, yvMain, yvBase, yvSend, yvConstants) {

    function _get_raw_message(_file) {
        var _type = _file.type;
        var _subtype = null;
        var _pattern = new RegExp("^image/*");

        if (_pattern.test(_type) && !yvSys.in_mobile_app()) {
            _subtype = yvConstants.MESSAGE_SUBTYPE.IMAGE;
        } else {
            _subtype = yvConstants.MESSAGE_SUBTYPE.FILE;
        }

        return {
            type: _subtype,
            data: {
                file: _file,
                size: _file.size,
                name: _file.name,
                mime: _file.type || "application/octet-stream"
            }
        };
    }

    // for android only
    function _upload_file_in_android(message, file_item, success, error) {
        var file_path = file_item.localURL;
        var options = new FileUploadOptions();
        var uri = encodeURI(yvAPI.get_server().upload_url);

        options.fileKey = "file";
        options.mimeType = message.mime;
        options.fileName = message.name;
        options.params = { "user_uuid": yvUser.get("uuid") };
        
        // we can controll this fileTransfer instance anywhere
        message.ft = new FileTransfer();
        message.ft.onprogress = function (event) {
            if (event.lengthComputable) {
                $timeout(function () {
                    message.upload_progress = event.loaded / event.total * 100;
                });
            }
        };

        message.ft.upload(file_path, uri, function (data) {
            var res = angular.fromJson(data.response);
            if (res && res.fuuid) {
                success && success(res.fuuid);
            } else {
                yvLog.error("FileTransfer return invalid response", data);
                error && error();
            }
        }, function (err) {
            if (data.code == 4) {
                yvLog.log("File Transfer canceled", data);
                return;
            }
            yvLog.error("FileTransfer _err: %o.", err);
            error && error();
        }, options, true);
    }

    // for pc only
    function _upload_file_in_pc(_msg, _item, success, error) {
        _item.onProgress = function (progress) {
            $timeout(function () {
                _msg.upload_progress = progress;
            });
        };
        _item.onSuccess = function (response) {
            success && success(response.fuuid);
        };
        _item.onCancel = function (response) {
            yvLog.log("file item upload canceled", _item);
        };
        _item.onError = function (err) {
            yvLog.error("file item upload error", err);
            error && error();
        };
        _msg.fileItem = _item;
        _msg.fileItem.upload();
    }

    function _on_after_adding(_item) {
        var _msg = null, _worker = null;
        var _file = yvSys.in_android_app() ? _item : _item._file;
        var _conv = yvBase.active("conversation");
        var _raw_message = _get_raw_message(_file);

        // if (_file.size > 1024 * 1024 * 20) {
        //     console.log("--------too big");
        //     return;
        // }
        yvMain.prepare_send(_conv, _raw_message, function (_message) {
            _msg = _message;
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_CHECKING);
            _worker = new Worker('lib/sha1calculator.js');
            _worker.onmessage = __on_message;
            window.hash_file(_file, [_worker]);
        });


        function __error() {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_ERROR);
        }

        function __existed(_fid) {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_SENDING);
            yvMain.update_message_file(_msg, _fid);
            yvSend.send_message(_msg, false);
        }

        function __not_existed() {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_UPLOADING);
            if (yvSys.in_android_app()) {
                _upload_file_in_android(_msg, _item, __existed, __error);
            } else {
                _upload_file_in_pc(_msg, _item, __existed, __error);
            }
        }

        function __check_existence(_sha1) {
            yvAPI.is_file_existed(_sha1, function (data) {
                if (data.existed) {
                    __existed(data.fid);
                } else {
                    __not_existed();
                }
            }, __error, __error);
        }

        function __on_message(event) {
            if (event.data.result) {
                _worker.terminate();
                __check_existence(event.data.result);
            }
        }

    }

    function _new_uploader() {
        //TO FIX BUG : can not select same file to upload
        //https://github.com/nervgh/angular-file-upload/wiki/FAQ
        FileUploader.FileSelect.prototype.isEmptyAfterSelection = function () {
            return true;
        };

        var _file_uploader = new FileUploader();
        _file_uploader.onAfterAddingFile = function (item) {
            _on_after_adding(item);
        };
        return _file_uploader;
    }

    return {
        get_uploader: function () {
            return _new_uploader();
        },

        // [NOTE]: only used for Android.
        send_file: function (file) {
            return _on_after_adding(file);
        }
    };
}]);
