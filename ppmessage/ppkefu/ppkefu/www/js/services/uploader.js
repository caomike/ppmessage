ppmessageModule.factory("yvUploader", [
    "$timeout",
    "FileUploader",
    "yvAPI",
    "yvSys",
    "yvMain",
    "yvBase",
    "yvConstants",
function ($timeout, FileUploader, yvAPI, yvSys, yvMain, yvBase, yvConstants) {

    var _progress = {};

    function _set_item_progress(_mid, _p) {
        var _id = _mid.toString();
        _progress[_id] = _p;
    }

    function _get_item_progress(_mid) {
        var _id = _mid.toString();
        if (_progress.hasOwnProperty(_id)) {
            return _progress[_id];
        }
        return 0;
    }

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


    function _on_after_adding(_item) {
        var _msg = null, _file = null, _worker = null, _after_upload = null;
        
        if (!yvSys.in_mobile_app()) {
            _file = _item._file;
        } else if (yvSys.in_android_app()) {
            _file = _item;
        } else {
            console.error("upload file in unsuported platform !");
            return;
        }
        
        var _conv = yvBase.active("conversation");
        var _raw_message = _get_raw_message(_file);

        yvMain.send_message(_conv, _raw_message, function (_message, _after_cb) {
            _msg = _message;
            _after_upload = _after_cb;
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_CHECKING);
            
            _worker = new Worker('lib/sha1calculator.js');
            _worker.onmessage = __on_message;
            window.hash_file(_file, [_worker]);
        });


        function __error() {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_ERROR);
        }

        function __on_progress(event) {
            if (event.lengthComputable) {
                var _p = event.loaded / event.total * 100;
                $timeout(function () {
                    _set_item_progress(_msg.id, _p);
                });
            }
        }

        function __existed(_fid) {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_SENDING);
            yvMain.update_message_file(_msg, _fid);
            _after_upload(_msg);
        }

        function __not_existed() {
            yvMain.update_message_status(_msg, yvConstants.SEND_STATUS.SEND_UPLOADING);
            _set_item_progress(_msg.id, 0);

            if (yvSys.in_android_app()) {
                yvAPI.upload_file(_file.localURL, _msg.mime, function (_result) {
                    _result = angular.fromJson(_result);
                    if (_result) {
                        __existed(_result.fuuid);
                    } else {
                        __error();
                    }
                }, __on_progress);
            } else if (!yvSys.in_mobile_app()) {
                _item.after_upload = _after_upload;
                _item.message = _msg;
                _item.upload(_item);
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
                console.log('---------fileSha1', event.data.result);
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

        _file_uploader.onWhenAddingFileFailed = function (item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        _file_uploader.onAfterAddingFile = function (item) {
            _on_after_adding(item);
        };

        _file_uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };

        _file_uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };

        _file_uploader.onProgressItem = function (item, progress) {
            console.info('onProgressItem', item, progress);
            if (item.message) {
                _set_item_progress(item.message.id, progress);
                console.log("update mid:%d, progress: %d", item.message.id, progress);
            }
        };

        _file_uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        _file_uploader.onSuccessItem = function (item, response, status, headers) {
            console.info('----------onSuccessItem', item, response, status, headers);
            if (item.message && item.after_upload) {
                yvMain.update_message_status(item.message, yvConstants.SEND_STATUS.SEND_SENDING);
                yvMain.update_message_file(item.message, response.fid);
                item.after_upload(item.message);
            }
        };

        _file_uploader.onErrorItem = function (item, response, status, headers) {
            console.info('onErrorItem', item, response, status, headers);
            if (item.message) {
                yvMain.update_message_status(item.message, yvConstants.SEND_STATUS.SEND_ERROR);
            }

        };

        _file_uploader.onCancelItem = function (item, response, status, headers) {
            console.info('onCancelItem', item, response, status, headers);
        };

        _file_uploader.onCompleteItem = function (item, response, status, headers) {
            console.info('onCompleteItem', item, response, status, headers);
        };

        _file_uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        return _file_uploader;
    }

    return {
        get_uploader: function () {
            return _new_uploader();
        },

        set_item_progress: function (_mid, _progress) {
            return _set_item_progress(_mid, _progress);
        },

        get_item_progress: function (_mid) {
            return _get_item_progress(_mid);
        },

        // [NOTE]: only used for Android.
        send_file: function (file) {
            return _on_after_adding(file);
        }
    };
}]);
