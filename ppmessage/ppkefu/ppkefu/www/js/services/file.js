ppmessageModule.factory("yvFile", [
    "yvLog",
    "yvSys",
function (yvLog, yvSys) {

    var _fs = null;

    function errorHandler(e) {
        var file_error = window.FileError,
            msg = '';

        switch (e.code) {
        case file_error.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case file_error.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case file_error.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case file_error.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case file_error.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }
        yvLog.error(msg);
    }

    function _randomFileName() {
        return yvSys.get_uuid();
    }

    function _has_file(file, yes, no) {
        var url = _fs.toURL() + file;
        window.resolveLocalFileSystemURL(url, function (_file) {
            yes && yes(_file);
        }, function (error) {
            no && no(error);
        });
    }

    function _remove_file(file, cb) {
        _has_file(file, function (entry) {
            entry.remove(function () {
                cb && cb(file);
            }, function () {
                yvLog.log("===========remove file error", file);
            });
        }, function () {
            cb && cb(file);
        });
    }

    function _getFileExt(_file_name) {
        var list = _file_name.split(".");
        var _ext = list[list.length - 1];
        return _ext;
    }
    
    function _readRandomFile(file_path, readAsText, callback) {
        window.resolveLocalFileSystemURL(file_path, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onerror = function (e) {
                    yvLog.log(e);
                };
                reader.onprogress = function (e) {
                    yvLog.log();
                };
                reader.onabort = function (e) {
                    yvLog.log(e);
                };
                reader.onloadend = function (e) {
                    callback(reader.result);
                };
                
                if (readAsText == true) {
                    reader.readAsText(file);
                } else {
                    reader.readAsDataURL(file);
                }
            }, function (e) {
                callback && callback("");
                errorHandler
            });
        });
    }

    function _createRandomFileWithoutData(_s, _e) {
        var _file_name = _randomFileName();

        _fs.getFile(_file_name, {create: true}, function (fileEntry) {
            if (_s) {
                _s(_file_name, fileEntry);
            }
        }, function (e) {
            if (_e) {
                _e(e);
            } else {
                errorHandler(e);
            }
        });

        return _file_name;
    }

    function _create_nodata(_file_name, _s, _e) {
        _fs.getFile(_file_name, {create: true}, function (fileEntry) {
            _s && _s(fileEntry);
        }, function (e) {
            errorHandler(e);
        });
        return _file_name;
    }

    function _create_data(_data, _file_name, _encoded, _cb) {
        var _content_data = _data;
        //exclusive:true, if file existed then error
        _fs.getFile(_file_name, {create: true}, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
                if (_encoded) {
                    _content_data = Base64Binary.decodeArrayBuffer(_data);
                }
                writer.onwrite = function (e) {
                    if (_cb) { _cb(_file_name); }
                };
                writer.write(_content_data);
            }, function (e) {
                if (_cb) { _cb(null); }
                errorHandler(e);
            });
        }, function (e) {
            if (_cb) { _cb(null); }
            errorHandler(e);
        });
        return _file_name;
    }

    function _createRandomFile(_data, _encoded, _cb) {
        var _file_name = _randomFileName();
        _create_data(_data, _file_name, _encoded, _cb);
        return _file_name;
    }

    return {
        init: function (cb) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 16 * 1024 * 1024, function (fs) {
                if (yvSys.in_ios_app()) {
                    _fs = fs.root;
                    if (cb) { cb(); }
                    yvLog.log("iOS root dir : ", _fs.toURL());
                } else if (yvSys.in_android_app()) {
                    fs.root.getDirectory("YvDoc", {create: true}, function (dirEntry) {
                        _fs = dirEntry;
                        if (cb) { cb(); }
                        yvLog.log("Android root dir: ", _fs.toURL());
                    }, errorHandler);
                }
            }, errorHandler);
        },

        copy_random: function (_url, _ext, _cb) {
            var _file_name = _randomFileName() + "." + _ext;
            window.resolveLocalFileSystemURL(_url, function (fileEntry) {
                fileEntry.copyTo(_fs, _file_name, function (newEntry) {
                    if (_cb) { _cb(_file_name, newEntry); }
                }, errorHandler);
            }, errorHandler);

            return _file_name;
        },

        copy: function (origin, dist, cb) {
            window.resolveLocalFileSystemURL(origin, function (originEntry) {
                originEntry.copyTo(_fs, dist, function (distEntry) {
                    cb && cb(distEntry);
                }, errorHandler);
            }, errorHandler);
        },
        
        read_as_dataurl : function (_name, _cb) {
            return _readRandomFile(_name, false, _cb);
        },

        read_as_text: function (_file, _cb) {
            return _readRandomFile(_file, true, _cb);
        },
        
        create_random: function (_data, _encoded, _cb) {
            return _createRandomFile(_data, _encoded, _cb);
        },

        create_random_nodata: function (_s, _e) {
            return _createRandomFileWithoutData(_s, _e);
        },

        create_nodata: function (_name, _s, _e) {
            return _create_nodata(_name, _s, _e);
        },

        create_data: function (_data, _name, _encoded, _cb) {
            return _create_data(_data, _name, _encoded, _cb);
        },

        get_root_dir: function () {
            if (_fs) {
                return _fs.toURL();
            }
            return null;
        },

        get_random_file_name: function () {
            return _randomFileName();
        },

        has_file: function (file, yes, no) {
            return _has_file(file, yes, no);
        },

        remove_file: function (file, cb) {
            _remove_file(file, cb);
        }

    };
}]);
