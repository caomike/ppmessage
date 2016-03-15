ppmessageModule.factory('yvAPI', [
    "$rootScope",
    "$timeout",
    "$http",
    "yvLog",
    "yvSys",
    "yvUser",
    "yvFile",
    "yvConstants",
function ($rootScope, $timeout, $http, yvLog, yvSys, yvUser, yvFile, yvConstants) {
    
    var API_REQUEST_TIMEOUT = 150000;   // 15s
    var _current_server = {
        id: -1,
        name: "",
        host: "",
        protocol: "",
        api_url: "",
        auth_url: "",
        pcapp_url: "",
        upload_url: ""
    };

    function _request_signature(request_uuid) {
        var _s = yvUser.get("app").app_secret + request_uuid;
        return hex_sha1(_s).toLowerCase();
    }

    function _api_post(_url, _data, _config, _success, _error, _api_error) {

        function _default_success(response, status, headers, config) {
            var code = response.error_code;
            
            yvLog.log("POST SUCCESS URL: %s, DATA: %o, RESPONSE: %o.", _url, _data, response);
            if (code === 0) {
                if (_success) { _success(response); }
                return;
            }

            if (_api_error) {
                _api_error(response, status, headers, config);
            }

            if (code === yvConstants.API_ERR.NO_ACCESS_TOKEN || code === yvConstants.API_ERR.WRONG_ACCESS_TOKEN) {

                // IGNORE ERROR WHEN LOGOUT
                if (_url.indexOf("LOGOUT") !== -1) {
                    return;
                }

                $timeout(function () {
                    $rootScope.$broadcast("event:logout");
                });
            }
        }

        function _default_error(response, status, headers, config) {
            yvLog.error("POST ERROR url: %s, data: %o, response:%o.", _url, _data, response);
            if (_error) {
                _error(response, status, headers, config);
            }
        }

        var _user_uuid = yvUser.get("uuid"),
            _app_uuid = yvUser.get("app").uuid,
            _device_uuid = yvUser.get("device_uuid"),
            _api_url = _current_server.api_url + _url,
            _api_data = _data || {},
            _api_config = {};

        _api_data.app_uuid = _app_uuid;
        _api_data.user_uuid = _user_uuid;
        _api_data.device_uuid = _device_uuid;

        _api_config.url = _api_url;
        _api_config.method = "POST";
        _api_config.data = _api_data;
        _api_config.headers = {
            "Content-Type": "application/json",
            "Authorization": "OAuth " + yvUser.get("access_token"),
        };
        
        // Add custom config 
        angular.forEach(_config, function (value, key) {
            _api_config[key] = value;
        });
        
        yvLog.log("API POST url: %s, data: %o.", _api_config.url, _api_config.data);
        
        try {
            return $http(_api_config)
                .success(function (response, status, headers, config) {
                    _default_success(response, status, headers, config);
                })
                .error(function (response, status, headers, config) {
                    _default_error(response, status, headers, config);
                });
        } catch (e) {
            yvLog.error(e);
        }
    }

    function _api_token(_session, _success, _error, _api_error) {
        
        function _default_success(response, status, headers, config) {
            yvLog.log("_api_token SUCCESS response: %o", response);
            
            if (response.error_code != 0) {
                yvLog.error("_api_token: %o", response);
                if (_api_error) _api_error();
                return;
            }
            
            yvUser.set("access_token", response.access_token);
            if (_success) { _success(response); }
            return;
        }

        function _default_error(response, status, headers, config) {
            yvLog.error("_api_token ERROR response:%o.", response);
            if (_error) {
                _error(response, status, headers, config);
            }
        }

        var _auth_url = _current_server.auth_url + "/token";
        var _auth_data = "grant_type=password&user_email=" + _session.user_email
            + "&user_password=" + _session.user_password
            + "&client_id=" + window.ppmessage.api_key;
        var _auth_config = {};
        
        _auth_config.url = _auth_url;
        _auth_config.method = "POST";
        _auth_config.data = _auth_data;
        _auth_config.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        
        yvLog.log("AUTH POST url: %s, data: %o.", _auth_config.url, _auth_config.data);
        
        try {
            return $http(_auth_config)
                .success(function (response, status, headers, config) {
                    _default_success(response, status, headers, config);
                })
                .error(function (response, status, headers, config) {
                    _default_error(response, status, headers, config);
                });
        } catch (e) {
            yvLog.error(e);
        }

    }
    
    function _api_login(_session, _success, _error, _api_error) {
        var _url = "/PPKEFU_LOGIN";
        var _config = {timeout: API_REQUEST_TIMEOUT};
        var _data = {
            token: _session.device_token,
            osmodel: _session.device_model,
            terminal: _session.device_uuid,
            ostype: _session.device_platform,
            osversion: _session.device_version,
            device_fullname: _session.device_fullname
        };
        
        if (_session.user_email) {
            _data.user_email = _session.user_email;
            _data.user_password = _session.user_password;
            return _api_post(_url, _data, _config, _success, _error, _api_error);
        }

        yvLog.error("yvAPI._api_login: neither user_email or user_uuid is valid, will return");
        _error && _error();
        return
    }

    function _update_device(_token, _success, _error, _api_error) {
        var _url = "/SET_DEVICE_INFO",
            _device = yvSys.get_device_info(),
            _info = {
                'fullname': yvSys.get_terminal_fullname(),
                'osversion': _device.version,
                'ostype': _device.platform,
                'iosmodel': _device.model
            };

        if (yvSys.in_ios_app()) {
            _info.iostoken = _token;
        }

        _api_post(_url, _info, null, _success, _error, _api_error);
    }

    
    function _get_file_name(url) {
        var list = url.split("/");
        var length = list.length;
        if (!length) {
            return null;
        }
        return list[length - 1];
    }

    
    function _upload_file(_url, _file_url, _mime, _cb, _onprogress) {
        var _uri = encodeURI(_url);
        var ft = new FileTransfer();
        var options = new FileUploadOptions();

        // could begin with "file://" or "cdvfile://"
        if (_file_url.indexOf("file://") !== 0 && _file_url.indexOf("cdvfile://") !== 0) {
            _file_url = yvFile.get_root_dir() + _file_url;
        }
        
        options.fileKey = "file";
        options.mimeType = _mime;
        options.fileName = _get_file_name(_file_url);
        options.params = { user_uuid: yvUser.get("uuid") };

        if (_onprogress) {
            ft.onprogress = _onprogress;
        }

        ft.upload(_file_url, _uri, function (_r) {
            yvLog.log("FileTransfer ok: %o", _r);
            if (_cb) { _cb(_r.response); }
        }, function (_err) {
            yvLog.error("FileTransfer _err: %o.", _err);
            if (_cb) { _cb(null); }
        }, options, true);
    }


    function _download_file(url, targetFile, success, error) {
        targetFile = encodeURI(targetFile);
        yvFile.has_file(targetFile, function (file) {
            success && success(file);
            yvLog.log("no need to download this file", file.name);
        }, function () {
            var ft = new FileTransfer();
            var source = encodeURI(url);
            var target = yvFile.get_root_dir() + targetFile;
            ft.download(source, target, function (file) {
                yvLog.log("download file successfully", file.name);
                success && success(file);
            }, function (err) {
                error && error(err);
            }, true, null);
        });
    }

    function _get_default_header() {
        var header = {
            "X-Device-UUID": yvUser.get("device_uuid"),
            "X-User-UUID": yvUser.get("uuid"),
            "X-Session-UUID": yvUser.get("session_uuid")
        };

        return header;
    }

    function _download_html(_uuid, file_name) {
        var _url = _current_server.pcapp_url + "/material/" + _uuid + "?file_name=" + file_name,
            _header = _get_default_header(),
            _config = {method: "GET", url: _url, headers: _header};

        return $http(_config);
    }

    function _download_txt(_uuid) {
        var file_name = _uuid + ".txt";
        return _download_html(_uuid, file_name);
    }

    return {
        set_server: function (server) {
            if (!server || server.id === -1) {
                _current_server = {id: -1};
                return;
            }

            var pre = server.protocol + server.host;
            _current_server.id = server.id;
            _current_server.name = server.name;
            _current_server.host = server.host;
            _current_server.protocol = server.protocol;

            _current_server.api_url = pre + "/api";
            _current_server.auth_url = pre + "/ppauth";
            _current_server.pcapp_url = pre + "/ppkefu";
            _current_server.upload_url = pre + "/upload";
        },

        get_server: function () {
            return _current_server;
        },

        token: function (_session, _success, _error, _api_error) {
            _api_token(_session, _success, _error, _api_error);
        },
        
        login: function (_session, _success, _error, _api_error) {
            _api_login(_session, _success, _error, _api_error);
        },

        logout: function (_success, _error, _api_error) {
            var _service_url = "/PPKEFU_LOGOUT";
            return _api_post(_service_url, null, null, _success, _error, _api_error);
        },
        
        get_yvobject: function (_id, _type, _ts, _success, _error, _api_error) {
            var _url = "/GET_YVOBJECT_DETAIL";
            var _data = {uuid: _id, type: _type, timestamp: _ts};
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        get_user_info: function (_user_uuid, _success, _error, _api_error) {
            var _url = "/PP_GET_USER_INFO";
            var _data = {user_uuid: _user_uuid};
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        update_device: function (_token, _success, _error, _api_error) {
            _update_device(_token, _success, _error, _api_error);
        },

        send_message: function (_m, _success, _error, _api_error) {
            var _url = "/PP_SEND_MESSAGE";
            _api_post(_url, _m, null, _success, _error, _api_error);
        },

        forward_message: function (_m, _success, _error, _api_error) {
            var _url = "/FORWARD_MESSAGE";
            _api_post(_url, _m, null, _success, _error, _api_error);
        },

        ack_message: function (_data, _success, _error, _api_error) {
            var _url = "/ACK_MESSAGE";
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        update_user: function (_data, _success, _error, _api_error) {
            var _url = "/PP_UPDATE_USER";
            if (!_data.user_uuid) {
                _data.user_uuid = yvUser.get("uuid");
            }
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        get_unacked_messages: function (_success, _error, _api_error) {
            var _url = "/GET_UNACKED_MESSAGES";
            _data = {
                "from_uuid": yvUser.get("uuid"),
                "device_uuid": yvUser.get("device_uuid")
            };
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        get_unacked_message: function (_id, _success, _error, _api_error) {
            var _url = "/GET_UNACKED_MESSAGE";
            var _data = {uuid: _id};
            _api_post(_url, _data, null, _success, _error, _api_error);
        },

        get_latest_app: function (_success, _error, _api_error) {
            var _url = "/GET_LATEST_APP";
            _api_post(_url, null, null, _success, _error, _api_error);
        },

        update_gpslocation: function (_latitude, _longitude, _success, _error, _api_error) {
            var _url = "/UPDATE_GPS_LOCATION";
            var _args = {latitude: _latitude, longitude: _longitude};
            _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_history_message: function (_args, _success, _error, _api_error) {
            var _url = "/PP_GET_HISTORY_MESSAGE";
            _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_page_history_message: function (_args, _success, _error, _api_error) {
            var _url = "/PP_PAGE_HISTORY_MESSAGE";
            _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_app_version: function (_args, _success, _error, _api_error) {
            var _url = "/GET_APP_VERSION";
            _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_single_card: function (_uuid, _success, _error, _api_error) {
            var _url = "/GET_SINGLE_CARD";
            _api_post(_url, {uuid: _uuid}, null, _success, _error, _api_error);
        },

        get_multiple_card: function (_uuid, _success, _error, _api_error) {
            var _url = "/GET_MULTIPLE_CARD";
            _api_post(_url, {uuid: _uuid}, null, _success, _error, _api_error);
        },

        download_txt: function (_uuid) {
            return _download_txt(_uuid);
        },

        download_html: function (_uuid, file_name) {
            return _download_html(_uuid, file_name);
        },

        download_file: function (_id_or_url, _save_name, _success, _error) {
            var _url = null, _target = null;
            
            if (_id_or_url.startsWith("http")) {
                _url = _id_or_url;
                _target = _save_name || hex_sha1(_id_or_url);
            } else {
                _url = _current_server.pcapp_url + "/download/" + _id_or_url;
                _target = _save_name || _id_or_url;
            }
            
            _download_file(_url, _target, _success, _error);
        },

        upload_file: function (_file_url, _mime, _cb, _onprogress) {
            var _url = _current_server.upload_url;
            return _upload_file(_url, _file_url, _mime, _cb, _onprogress);
        },

        is_file_existed: function (_file_sha1, _success, _error, _api_error) {
            var _url = "/FILE_IS_EXISTED";
            _api_post(_url, {digest: _file_sha1}, null, _success, _error, _api_error);
        },

        get_icon_url: function (_icon) {
            var _url = _current_server.pcapp_url + "/icon/" + _icon;
            return _url;
        },

        get_image_url: function (_file, _ext) {
            var _url = _current_server.pcapp_url + "/material/" + _file + "?file_name=" + _file + "." + _ext;
            return _url;
        },

        get_audio_url: function (_file, _ext) {
            var _url = _current_server.pcapp_url + "/material/" + _file + "?file_name=" + _file + "." + _ext;
            return _url;
        },

        get_card_url: function (_file) {
            var _url = _current_server.pcapp_url + "/material/" + _file + "?file_name=" + _file + ".html";
            return _url;
        },

        download_card_content: function (_file) {
            var _url = this.get_card_url(_file);
            var _header = _get_default_header();
            var _config = {method: "GET", url: _url, headers: _header};
            return $http(_config);
        },
        
        get_amap_url: function (_body) {
            //Fixme: http_protocol
            var url = "http://restapi.amap.com/v3/staticmap?scale=2&location=" + _body.lng + "," +
                _body.lat + "&zoom=" + _body.zoom + "&size=150*110&markers=large,,A:"+ _body.lng +
                "," + _body.lat + "&key=ee95e52bf08006f63fd29bcfbcf21df0";
            return url;
        },

        download_web_material: function (_material, _name) {
            var _href = _current_server.pcapp_url + "/material/" + _material + "?file_name=" + _name;
            yvSys.click_download(_href, _name);
        },

        get_service_user_list: function (_success, _error, _api_error) {
            var _url = "/PP_GET_APP_SERVICE_USER_LIST";
            return _api_post(_url, null, null, _success, _error, _api_error);
        },

        get_service_user_conversation_list: function (_success, _error, _api_error) {
            var _url = "/PP_GET_USER_CONVERSATION_LIST";
            var _args = {user_uuid: yvUser.get("uuid"), app_uuid: yvUser.get("app").uuid};
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        create_conversation: function (_args, _success, _error, _api_error) {
            var _url = "/PP_CREATE_CONVERSATION";
            _args.user_uuid = yvUser.get("uuid");
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        close_conversation: function (_conv_uuid, _success, _error, _api_error) {
            var _url = "/PP_CLOSE_CONVERSATION";
            var _args = {user_uuid: yvUser.get("uuid"), conversation_uuid: _conv_uuid};
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_conversation: function (_conv_uuid, _success, _error, _api_error) {
            var _url = "/PP_GET_CONVERSATION_INFO";
            var _args = {
                app_uuid: yvUser.get("app").uuid,
                conversation_uuid: _conv_uuid,
                user_uuid: yvUser.get("uuid")
            };
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        assign_conversation: function (_conv_uuid, _assigned_uuid, _success, _error, _api_error) {
            var _url = "/PP_UPDATE_CONVERSATION";
            var _args = {conversation_uuid: _conv_uuid, assigned_uuid: _assigned_uuid};
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        update_conversation_member: function (_args, _success, _error, _api_error) {
            var _url = "/PP_UPDATE_CONVERSATION_MEMBER";
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_app_org_group_list: function (app_uuid, _success, _error, _api_error) {
            var _url = "/PP_GET_APP_ORG_GROUP_LIST";
            var _args = app_uuid ? { "app_uuid": app_uuid } : {};

            return _api_post(_url, _args, null, _success, _error, _api_error);
        },
        
        get_conversation_user_list: function (conversation_uuid, _success, _error, _api_error) {
            var _url = "/PP_GET_CONVERSATION_USER_LIST";
            var _args = { "conversation_uuid": conversation_uuid }
            
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },
        
        get_selected_group_user: function (_args, _success, _error, _api_error) {
            var _url = "/PP_SELECT_USERS_BY_GROUP_ALGORITHM";
            
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },

        get_conversation_page: function (_args, _success, _error, _api_error) {
            var _url = "/PP_PAGE_USER_CONVERSATION";
            _args.user_uuid = yvUser.get("uuid");
            return _api_post(_url, _args, null, _success, _error, _api_error);
        },
    };
}]);
