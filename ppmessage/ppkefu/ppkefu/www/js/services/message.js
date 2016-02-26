ppmessageModule.factory('yvMessage', [
    "$timeout",
    "yvSys",
    "yvUser",
    "yvFile",
    "yvType",
    "yvLocal",
    "yvConstants",
function ($timeout, yvSys, yvUser, yvFile, yvType, yvLocal, yvConstants) {

    function Message(task_uuid) {
        this.task_uuid = task_uuid;

        if (typeof this.from_uuid !== "string") {
            Message.prototype.to_uuid = "";
            Message.prototype.to_type = "";
            Message.prototype.from_uuid = "";
            Message.prototype.push_uuid = "";
            Message.prototype.conversation_uuid = "";

            Message.prototype.is_history = false;

            Message.prototype.id = 0;
            Message.prototype.size = 0;
            Message.prototype.type = "";
            Message.prototype.body = "";
            Message.prototype.file = "";
            Message.prototype.name = "";
            Message.prototype.mime = "";
            Message.prototype.title = "";
            Message.prototype.status = "";
            Message.prototype.duration = 0;
            Message.prototype.subtype = "";
            Message.prototype.timestamp = 0;
            Message.prototype.thumbnail = "";
            Message.prototype.direction = "";
        }
    }

    function _new_message(task_uuid) {            
        if (!task_uuid) {
            task_uuid = yvSys.get_uuid();
        }
        var message = new Message(task_uuid);
        return message;
    }

    
    function _get_real_direction(from_uuid, to_uuid) {
        var _direction = yvConstants.MESSAGE_DIR.DIR_IN;
        if (from_uuid === yvUser.get("uuid")) {
            // this is a sync message from another device
            _direction = yvConstants.MESSAGE_DIR.DIR_OUT;
        }
        return _direction;
    }

    function _get_real_status(from_uuid, to_uuid) {
        var _status = yvConstants.RECV_STATUS.RECV_NEW;
        if (from_uuid === yvUser.get("uuid")) {
            // this is a sync message from another device
            _status = yvConstants.SEND_STATUS.SEND_SUCCESS;
        }
        return _status;
    }

    function _get_raw_title(_body, _subtype) {
        var type = yvConstants.MESSAGE_SUBTYPE;

        switch (_subtype) {
        case type.TEXT:
            return _body;
        case type.TXT:
            return "app.GLOBAL.TITLE_TXT";
        case type.IMAGE:
            return "app.GLOBAL.TITLE_IMAGE";
        case type.FILE:
            return "app.GLOBAL.TITLE_FILE";
        case type.AUDIO:
            return "app.GLOBAL.TITLE_AUDIO";
        case type.GPS_LOCATION:
            return "app.GLOBAL.TITLE_GPS_LOCATION";
        case type.SINGLE_CARD:
            return "app.GLOBAL.TITLE_SINGLE_CARD";
        case type.MULTIPLE_CARD:
            return "app.GLOBAL.TITLE_MULTIPLE_CARD";
        case type.ACCEPT_CONTACT:
            return "app.GLOBAL.TITLE_ACCEPT_CONTACT";
        case type.INVITE_CONTACT:
            return _body;
        case type.DG_INVITED:
            return "app.GLOBAL.TITLE_DG_INVITED";
        case type.REQUEST_JOIN_OG:
            return "app.GLOBAL.BODY_REQUEST_JOIN_OG";
        case type.APPROVE_JOIN_OG:
            return "app.GLOBAL.BODY_APPROVE_JOIN_OG";
        case type.LOGOUT:
            return "app.GLOBAL.TITLE_LOGOUT";
        default:
            console.error("unknown message subtype", _subtype);
            return "app.GLOBAL.TITLE_UNKNOWN";
        }
    }

    function _get_standard_message(raw_message) {
        var message = _new_message(raw_message.ci);
        
        message.to_uuid = raw_message.ti;
        message.to_type = raw_message.tt;
        message.from_uuid = raw_message.fi;
        message.from_type = raw_message.ft;
        message.task_uuid = raw_message.id;
        message.push_uuid = raw_message.pid;
        message.from_user = raw_message.from_user;
        message.conversation_uuid = raw_message.ci;

        message.body = raw_message.bo;        
        message.type = raw_message.mt;
        message.subtype = raw_message.ms;
        message.timestamp = raw_message.ts;
        
        message.title = _get_raw_title(raw_message.bo, raw_message.ms);
        message.status = _get_real_status(raw_message.fi, raw_message.ti);
        message.direction = _get_real_direction(raw_message.fi, raw_message.ti);
        
        return message;
    }

    function _create_api_send_message(_message) {
        if (yvType.is_file(_message)) {
            return _file_api_message(_message);
        }
        
        if (yvType.is_image(_message)) {
            return _image_api_message(_message);
        }

        if (yvType.is_text(_message)) {
            return _text_api_message(_message);
        }

        if (yvType.is_txt(_message)) {
            return _txt_api_message(_message);
        }

        if (yvType.is_gps_location(_message)) {
            return _gps_api_message(_message);
        }

        if (yvType.is_audio(_message)) {
            return _audio_api_message(_message);
        }

        console.log("create_api_message can not handle message: ", _message);
        return null;
    }

    function _real_api_message(_message, _body) {
        var _m = {
            "uuid": _message.task_uuid,
            "app_uuid": yvUser.get("app").uuid,
            "to_uuid": _message.to_uuid,
            "to_type": _message.to_type,
            "from_uuid": yvUser.get("uuid"),
            "from_type": yvConstants.YVOBJECT.DEVICE_USER,
            "device_uuid": yvUser.get("device_uuid"),
            "message_type": _message.type,
            "message_subtype": _message.subtype,
            "conversation_uuid": _message.conversation_uuid,
            "conversation_type": _message.conversation_type,
            "message_body": _body ? JSON.stringify(_body) : _message.body
        };
        return _m;
    }

    function _file_api_message(_message) {
        var _body = {fid: _message.file, mime: _message.mime, name: _message.name};
        return _real_api_message(_message, _body);
    }
    
    function _audio_api_message(_message) {
        var _body = {fid: null, mime: _message.mime, dura: _message.duration};

        if (yvSys.in_mobile_app()) {
            _body.fid = _message.fid;
        } else {
            _body.fid = _message.file;
        }
        return _real_api_message(_message, _body);
    }

    function _image_api_message(_message) {
        var _body = {fid: null, mime: _message.mime};
        if (yvSys.in_mobile_app()) {
            _body.fid = _message.fid;
        } else {
            _body.fid = _message.file;
        }
        return _real_api_message(_message, _body);
    }


    function _text_api_message(_message) {
        return _real_api_message(_message);
    }

    function _txt_api_message(_message) {
        var _body = {fid: null};
        if (yvSys.in_mobile_app()) {
            _body.fid = _message.fid;
        } else {
            _body.fid = _message.file;
        }
        return _real_api_message(_message, _body);
    }

    function _gps_api_message(_message) {
        return _real_api_message(_message);
    }

    function _string_to_ts(_str) {
        // Safari doesn't understand yyyy-mm-dd,
        // Chrome understands both yyyy-mm-dd and yyyy/mm/dd
        var _f = "yyyy/MM/dd HH:mm:ss",
            _s = _str.slice(0, _f.length).replace(/-/g, "/");
        return Date.parse(_s) / 1000;
    }

    function _history_message(raw_message) {
        var msg = _new_message(raw_message.uuid);

        msg.is_history = true;
        msg.to_uuid = raw_message.to_uuid;
        msg.to_type = raw_message.to_type;
        msg.id = yvSys.get_uuid();
        msg.body = raw_message.body;
        msg.from_uuid = raw_message.from_uuid;
        msg.type = raw_message.message_type;
        msg.subtype = raw_message.message_subtype;
        msg.conversation_uuid = raw_message.conversation_uuid;
        msg.timestamp = _string_to_ts(raw_message.createtime);
        msg.title = _get_raw_title(raw_message.body, raw_message.message_subtype);
        
        if (raw_message.from_uuid === yvUser.get("uuid") && raw_message.to_type !== yvConstants.CONVERSATION_TYPE.P2S) {
            msg.direction = yvConstants.MESSAGE_DIR.DIR_OUT;
            msg.status = yvConstants.SEND_STATUS.SEND_SUCCESS;
        } else {
            msg.direction = yvConstants.MESSAGE_DIR.DIR_IN;
            msg.status = yvConstants.RECV_STATUS.RECV_OPEN;
            if (msg.subtype === yvConstants.MESSAGE_SUBTYPE.AUDIO) {
                msg.status = yvConstants.RECV_STATUS.RECV_PLAY;
            }
        }

        return msg;
    }

    function _create_sending_message(conversation, raw_message) {
        var _message = _new_message();
        var _data = raw_message.data;
        var _subtype = raw_message.type;

        _message.subtype = _subtype;
        _message.type = yvConstants.MESSAGE_TYPE.NOTI;
        _message.title = _get_raw_title(_data, _subtype);
        _message.timestamp = Math.round(Date.now() / 1000);
        _message.direction = yvConstants.MESSAGE_DIR.DIR_OUT;
        _message.status = yvConstants.SEND_STATUS.SEND_PENDING;

        _message.from_uuid = yvUser.get("uuid");
        _message.to_uuid = conversation.user_uuid;
        _message.conversation_uuid = conversation.uuid;
        _message.conversation_type = conversation.type;
        _message.to_type = yvConstants.YVOBJECT.DEVICE_USER;

        if (conversation.type == yvConstants.CONVERSATION_TYPE.P2S) {
            _message.conversation_type = yvConstants.CONVERSATION_TYPE.S2P;
        }

        if (yvType.is_text(_message)) {
            return _sending_text_message(_message, _data);
        }

        if (yvType.is_txt(_message)) {
            return _sending_txt_message(_message, _data);
        }

        if (yvType.is_gps_location(_message)) {
            return _sending_location_message(_message, _data);
        }

        if (yvType.is_audio(_message)) {
            return _sending_audio_message(_message, _data);
        }

        if (yvType.is_image(_message)) {
            return _sending_image_message(_message, _data);
        }

        if (yvType.is_file(_message)) {
            return _sending_file_message(_message, _data);
        }
        
        console.error("unknown message:", raw_message);
        return null;
    }

    function _sending_text_message(message, data) {
        message.body = data;
        return message;
    }

    function _sending_txt_message(message, data) {
        message.file = data.fid;
        message.mime = "text/plain";
        return message;
    }

    function _sending_audio_message(message, data) {
        message.duration = data.dura;
        message.file = data.url;
        if (yvSys.in_ios_app()) {
            message.mime = "audio/m4a";
        } else if (yvSys.in_android_app()) {
            message.mime = "audio/amr";
        } else {
            console.error("pc not support recording...");
            return null;
        }
        return message;
    }

    function _sending_image_message(message, data) {
        if (yvSys.in_mobile_app()) {
            // data file
            message.mime = "image/jpeg";
            message.file = data.file;
        } else {
            // remote file file uuid is not return now.
            message.file = data.file;
            message.name = data.name;
            message.size = data.size;
            message.mime = data.mime;
        }
        return message;
    }

    function _sending_file_message(message, data) {
        if (yvSys.in_ios_app()) {
            console.error("mobile txt should not create here.");
            return null;
        }
        message.name = data.name;
        message.size = data.size;
        message.mime = data.mime;
        return message;
    }

    function _sending_location_message(message, data) {
        message.file = data.file;
        message.body = data.body;
        message.mime = "image/jpeg";
        return message;
    }

    return {
        create_slack_message: function (_from_object_id,
                                      _to_object_id,
                                      _from_object_fullname,
                                      _message_loop_id,
                                      _file_item) {

            var _message = _new_message();
            _message.direction = yvConstants.MESSAGE_DIR.DIR_OUT;
            _message.status = yvConstants.SEND_STATUS.SEND_PENDING;
            _message.from_id = _from_object_id;
            _message.to_id = _to_object_id;
            _message.from_name = _from_object_fullname;
            _message.loop_id = _message_loop_id;
            _message.type = yvConstants.MESSAGE_TYPE.NOTI;
            _message.name = _file_item.name;
            _message.size = _file_item.size;
            _message.mime = _file_item.mimetype;
            _message.subtype = yvConstants.MESSAGE_SUBTYPE.FILE;
            return _message;
        },


        // create sending message for api service based on db record
        create_api_send_message: function (_message) {
            return _create_api_send_message(_message);
        },

        history_message: function (raw_message) {
            return _history_message(raw_message);
        },

        get_raw_title: function (_body, _subtype) {
            return _get_raw_title(_body, _subtype);
        },

        localize_title: function (_raw_title) {
            return yvLocal.translate(_raw_title);
        },

        get_localized_title: function (_body, _subtype) {
            var raw_title = _get_raw_title(_body, _subtype);
            var type = yvConstants.MESSAGE_SUBTYPE;
            
            if (_subtype === type.TEXT) {
                return _body;
            }
            return yvLocal.translate(raw_title);
        },

        create_forward_message: function (_forward) {
            var _msg = _forward.message,
                _m = {
                    from_uuid: yvUser.get("uuid"),
                    to_uuid: _forward.conv_uuid,
                    to_type: _forward.conv_type,
                    task_uuid: _msg.task_uuid,
                    conversation_uuid: _forward.conv_uuid,
                    timestamp: Math.round(Date.now() / 1000),
                    direction: yvConstants.DIR.DIR_OUT,
                    status: yvConstants.SEND_STATUS.SEND_PENDING,
                    type: _msg.type,
                    subtype: _msg.subtype,
                    title: _msg.title,
                    body: _msg.body,
                    duration: _msg.duration,
                    file: _msg.file,
                    name: _msg.name,
                    mime: _msg.mime,
                    size: _msg.size,
                    thumbnail: _msg.thumbnail
                };

            _m.conversation_type = yvConstants.CONVERSATION_TYPE.S2S;
            if (_forward.conv_type == yvConstants.CONVERSATION_TYPE.P2S) {
                _m.to_type = yvConstants.CONVERSATION_TYPE.S2P;
                _m.conversation_type = yvConstants.CONVERSATION_TYPE.S2P;
            }

            return _m;
        },

        create_sending_message: function (conversation, raw_message) {
            return _create_sending_message(conversation, raw_message);
        },

        get_standard_message: function (message) {
            return _get_standard_message(message);
        },

        create_api_forward_message: function (_message) {
            var _data = {
                to_uuid: _message.to_uuid,
                to_type: _message.to_type,
                conversation_type: _message.conversation_type,
                task_uuid: _message.task_uuid
            };
            return _data;
        },

        string_to_ts: function (str) {
            return _string_to_ts(str);
        },

        create: function (task_uuid) {
            return _new_message(task_uuid);
        },

        check_prototype: function (message) {
            if (Message.prototype.isPrototypeOf(messsage)) {
                return true;
            }
            return false;
        },
    };
}]);
