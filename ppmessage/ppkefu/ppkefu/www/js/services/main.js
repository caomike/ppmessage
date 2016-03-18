ppmessageModule.factory("yvMain", [
    "$q",
    "$timeout",
    "$rootScope",
    "yvDB",
    "yvLog",
    "yvSys",
    "yvAPI",
    "yvNav",
    "yvNoti",
    "yvMime",
    "yvSend",
    "yvUser",
    "yvLink",
    "yvFile",
    "yvType",
    "yvBase",
    "yvMessage",
    "yvConstants",
function ($q, $timeout, $rootScope, yvDB, yvLog, yvSys, yvAPI, yvNav, yvNoti, yvMime, yvSend, yvUser, yvLink, yvFile, yvType, yvBase,
          yvMessage, yvConstants) {

    var scope = $rootScope.$new();

    scope.$on("event:logout", function (event) {
        _local_logout();
    });

    scope.$on("event:get_unack_all", function(event) {
        _get_unack_all();
    });

    scope.$on("event:add_message", function(event, message) {
        _add_message(message, true, null);
    });

    scope.$on("event:receive_ack_message", function(event, message) {
        _receive_ack_message(message);
    });
    
    scope.$on("event:update_message_all", function(event, message, params) {
        _update_message_all(message, params);
    });

    scope.$on("event:update_message_status", function(event, message, status) {
        _update_message_status(message, status);
    });

    scope.$on("event:online", function(event, params) {
        _handle_online_message(params);
    });
   
    function _handle_online_message(message) {
        yvLog.log("receive online message", message);
        var object = yvBase.get("object", message.user_uuid);
        if (!object) return;
        $timeout(function () {
            object.extra_data = message.extra_data;
            switch (message.browser) {
            case yvConstants.ONLINE_STATUS.ONLINE:
                object.browser_online = true;
                break;
            case yvConstants.ONLINE_STATUS.OFFLINE:
                object.browser_online = false;
            default:
                // keep unchanged
            }
            switch (message.mobile) {
            case yvConstants.ONLINE_STATUS.ONLINE:
                object.mobile_online = true;
                break;
            case yvConstants.ONLINE_STATUS.OFFLINE:
                object.mobile_online = false;
            default:
                // keep unchanged
            }
        });
    }

    function _init_yvdb(callback) {
        if (yvSys.has_db()) {
            return yvDB.init_yvdb(callback);
        }
        _set_server();
        callback && callback(null);
    }


    function _init_userdb(uuid, callback) {
        if (yvSys.has_db()) {
            return yvDB.init_userdb(uuid, callback);
        }
        callback && callback();
    }


    function _add_login_user(data, callback) {
        var user = yvUser.update_user_from_login(data);
        
        yvLink.get_real_icon(user.icon, function (icon) {
            user.icon = icon;
            yvBase.mset("object", user.uuid, {
                name: user.name,
                icon: user.icon,
                email: user.email,
                fullname: user.fullname,
                signature: user.signature,
                updatetime: user.updatetime
            });
            
            if (!yvSys.has_db()) {
                callback && callback();
                return;
            }

            yvDB.add_login_user(user, data.app, function () {
                yvDB.init_userdb(user.uuid, function () {
                    yvDB.add_object(user);
                    callback && callback();
                });
            });
        });
    }


    function _local_logout() {
        if (yvSys.has_db()) {
            yvDB.logout_user();
        }
        yvNoti.exit();
        yvBase.reset();
        yvNav.exit_app();
    }


    function _logout() {
        yvAPI.logout(null, null, null);
        _local_logout();
    }


    function _set_server() {
        if (yvSys.has_db()) {
            return yvDB.query_server();
        }
        var server = {
            id: 0,
            name: "web",
            host: window.location.hostname,
            port: window.location.port,
            protocol: window.location.protocol + "//"
        };
        yvAPI.set_server(server);
    }


    function _unread_zero(conversation) {
        conversation.unread = 0;
        if (yvSys.has_db()) {
            yvDB.unread_zero(conversation.uuid);
        }
    }


    function _delete_message(conversation, message) {
        conversation.delete_message(message);
        if (yvSys.has_db()) {
            yvDB.delete_message(message);
        }
    }


    function _set_audio_read(message) {
        message.status = yvConstants.RECV_STATUS.RECV_PLAY;

        if (yvSys.has_db()) {
            yvDB.set_audio_read(message.id);
        }
    }


    function _delete_conversation(conversation) {
        yvBase.remove("conversation", conversation.uuid);

        if (yvSys.has_db()) {
            yvDB.delete_conversation(conversation);
        }
    }

    function _delete_all_conversations(callback) {
        yvBase.get_scope("conversation").page = 0;
        yvBase.get_scope("conversation").dict = {};

        if (yvSys.has_db()) {
            yvDB.delete_all_conversations(callback);
        } else {
            callback && callback();
        }
    }

    function _delete_all_contacts(callback) {
        yvBase.get_scope("contact").dict = {};

        if (yvSys.has_db()) {
            yvDB.delete_all_contacts(callback);
        } else {
            callback && callback();
        }
    }

    // key can be 'icon', 'fullname', 'signature'
    function _update_current_user(key, value) {
        if (["icon", "fullname", "signature"].indexOf(key) === -1) {
            return;
        }

        yvUser.set(key, value);
        yvBase.set("object", yvUser.get("uuid"), key, value);

        if (yvSys.has_db()) {
            yvDB.update_current_user(key, value);
        }
    }


    function _update_noti_settings(key, value) {
        if (["show_badge", "mute_notification", "silence_notification", "is_distributor_user"].indexOf(key) === -1) {
            return;
        }

        yvUser.set(key, value);
        
        if (yvSys.has_db()) {
            yvDB.update_noti_settings(key, value);
        } 
    }
    
    function _add_object(object, callback) {
        if (!object) {
            return;
        }

        var local_object = yvBase.get("object", object.uuid);
        if (local_object && local_object.updatetime >= parseInt(object.updatetime)) {
            callback && callback(local_object);
            return;
        }

        var ppobject = yvBase.create("object", object.uuid);
        yvBase.add("object", ppobject);
        yvBase.update("object", ppobject, object, function (obj) {
            callback && callback(obj);
        });
    }


    function _check_object(uuid) {
        var object = yvBase.get("object", uuid);
        console.log("check object: %o, by uuid: %s.", object, uuid);
        object || yvBase.set("object", uuid, "need_update", true);
    }


    function _add_contact(contact) {
        yvBase.mset("contact", contact.uuid, {
            name: contact.user_name,
            email: contact.user_email,
            fullname: contact.user_fullname,
            signature: contact.user_signature,
            is_portal_user: !!contact.is_portal_user,
            is_service_user: !!contact.is_service_user
        });

        _add_object(contact, function (object) {
            yvBase.set("contact", contact.uuid, "icon", object.icon);
        });

        if (yvSys.has_db()) {
            yvDB.add_contact(contact);
        }
    }


    function _is_conversation_online (conversation) {
        switch (conversation.type) {
        case yvConstants.CONVERSATION_TYPE.S2S:
            return true;
        case yvConstants.CONVERSATION_TYPE.P2S:
            var portal_user = yvBase.get("object", conversation.user_uuid);
            if (!portal_user) return false;
            if (portal_user.mobile_online || portal_user.browser_online) return true;
        default:
            return false;
        }
    }


    function _add_conversation(conv, callback) {
        var conversation = yvBase.create("conversation", conv.uuid);
        yvBase.add("conversation", conversation);
        yvBase.update("conversation", conversation, conv, callback);
    }


    // Called when chat with contact. open real conversation if conversation_name matchs a local conversation.
    function _open_conversation(params, callback) {
        var conv_list = yvBase.get_list("conversation"), conv = null;

        for (var i in conv_list) {
            conv = conv_list[i];
            if (conv.type === params.conversation_type && conv.name === params.conversation_name) {
                yvBase.active("conversation", conv);
                callback && callback(conv);
                return;
            }
        }

        yvAPI.create_conversation(params, function (data) {
            _add_conversation(data, function (conversation) {
                yvBase.active("conversation", conversation);
                callback && callback(conversation);
            });
        });
    }


    function _add_message_to_conversation(conversation, message, callback) {
        var active = yvBase.active("conversation");
        if (!active || (active.uuid != conversation.uuid && message.direction === yvConstants.MESSAGE_DIR.DIR_IN)) {
            conversation.unread += 1;
        }
        conversation.add_message(message);
        callback && callback();

        if (yvSys.has_db()) {
            yvDB.update_conversation_unread(conversation);
        }
    }

    function _update_conversation(message, callback) {
        if (!message) {
            callback && callback();
            return;
        }

        var conversation = yvBase.get("conversation", message.conversation_uuid);
        if (conversation) {
            _add_message_to_conversation(conversation, message, callback);
            return;
        }

        conversation = yvBase.create("conversation", message.conversation_uuid);
        conversation.need_update = true;
        conversation.show = false;
        yvBase.add("conversation", conversation);
        _add_message_to_conversation(conversation, message, callback);
    }


    function _download_audio(message, callback) {
        var ext = null, audio = null;
        var body = angular.fromJson(message.body);

        if (yvSys.in_ios_app()) {
            ext = "m4a";
        } else if (yvSys.in_android_app()) {
            ext = "amr";
        }

        audio = body[ext];
        yvAPI.download_file(audio.fid, null, function () {
            message.file = audio.fid;
            message.mime = "audio/" + ext;
            message.duration = audio.dura;
            cb(message);
        });
    }


    function _download_message_file(message, cb) {
        var _ext = null, _url = null, _body = null;

        if (yvType.is_text(message)) {
            return cb(message);
        }

        if (yvType.is_gps_location(message)) {
            _body = angular.fromJson(message.body);
            _body.zoom = Math.round(_body.zoom);
            _url = yvAPI.get_amap_url(_body);
            if (!yvSys.in_mobile_app()) {
                message.file = _url;
                return cb(message);
            }

            yvAPI.download_file(_url, null, function (file) {
                message.file = file.name;
                message.mime = "image/jpeg";
                cb(message);
            });
            return;
        }

        if (yvType.is_txt(message)) {
            _body = angular.fromJson(message.body);
            message.mime = "text/plain";

            if (!yvSys.in_mobile_app()) {
                message.file = _body.fid;
                return cb(message);
            }

            yvAPI.download_file(_body.fid, null, function (file) {
                message.file = _body.fid;
                cb(message);
            });
            return;
        }

        if (yvType.is_audio(message)) {
            if (!yvSys.in_mobile_app()) {
                _body = angular.fromJson(message.body);
                message.duration = _body.mp3.dura;
                message.file = _body.mp3.fid;
                message.mime = "audio/mp3";
                return cb(message);
            }
            return _download_audio(message, cb);
        }

        if (yvType.is_image(message)) {
            _body = angular.fromJson(message.body);
            message.mime = _body.mime;

            if (!yvSys.in_mobile_app()) {
                message.thumbnail = _body.thum;
                message.file = _body.orig;
                return cb(message);
            }

            yvAPI.download_file(_body.thum, null, function () {
                message.thumbnail = _body.thum;
                cb(message);
            });
            return;
        }

        if (yvType.is_file(message)) {
            _body = angular.fromJson(message.body);
            message.mime = _body.mime;
            message.name = _body.name;
            message.size = _body.size;
            message.file = _body.fid;
            return cb(message);
        }

        console.error("download message file can't handle message --> %o", message);
    }


    function _receive_ack_message(message) {
        if (!message || message.code == 0) {
            return;
        }
        yvLog.error("receive ack message error", message.reason, message);
        var conversation = yvBase.get("conversation", message.extra.conversation_uuid);
        if (conversation) { 
            var target = conversation.get_message_by_tid(message.extra.uuid);
            target && _update_message_status(target, yvConstants.SEND_STATUS.SEND_ERROR);
        }
    }

    
    function _ack_message(_message, _success, _error) {
        var list = [_message.push_uuid];
        _ack_message_list(list, _success, _error);
    }


    function _ack_message_list(_uuid_list, _success, _error) {
        var _ack_param = {"list": _uuid_list};
        yvAPI.ack_message(_ack_param, _success, _error, _error);
    }


    function _check_logout(_message, _cb) {
        var _device_uuid = yvUser.get("device_uuid");
        if (_message.body === _device_uuid) {
            $rootScope.$broadcast("event:logout");
        }
        _cb && _cb();
    }


    function _handle_message(message) {
        _download_message_file(message, function (msg) {
            _update_conversation(msg);

            if (yvSys.has_db()) {
                yvDB.insert_message(msg);
            }
        });
    }


    //incoming message
    function _add_message(raw_message, with_ack) {
        var message = yvMessage.get_standard_message(raw_message);

        if (yvType.is_logout(message)) {
            with_ack && _check_logout(message);
            return;
        }

        if (!message.conversation_uuid) {
            with_ack && _ack_message(message);
            return;
        }

        _handle_message(message);
        with_ack && _ack_message(message);
        message.from_user ? _add_object(message.from_user) : _check_object(message.from_uuid);
    }


    function _get_unack_all() {
        yvAPI.get_unacked_messages(function (data) {
            console.log("get unack all:", data.list.length, data.list, data.message);
            if (!data.list.length) {
                return;
            }

            angular.forEach(data.message, function (message, push_uuid) {
                message = angular.fromJson(message);
                if (!message) { return; }
                message.pid = push_uuid;
                _add_message(message, false);
            });
            _ack_message_list(data.list);
        });
    }


    function _load_conversation_messages(conversation, callback) {
        if (!yvSys.has_db()) {
            callback && callback(0);
            return;
        }

        yvDB.query_messages(conversation.uuid, function (res) {
            var item = null, message = null;
            for (var i = 0, len = res.rows.length; i < len; i++) {
                item = res.rows.item(i);
                message = yvMessage.create(item.task_uuid);
                message.id = item.id;
                angular.forEach(item, function (value, key) {
                    message[key] = value;
                });
                conversation.messages.push(message);
            }
            conversation._refresh();
            callback && callback(len);
        });
    }


    function _update_message_all(message, params) {
        $timeout(function () {
            message.status = params.status;
            message.timestamp = params.timestamp;
            message.task_uuid = params.task_uuid;
        });

        yvSys.has_db() && yvDB.update_message_status(message);
    }


    function _update_message_status(message, status) {
        $timeout(function () {
            message.status = status;
        });
        yvSys.has_db() && yvDB.update_message_status(message);
    }


    function _update_message_file(message, file) {
        // Note: do not use $timeout
        message.file = file;
        yvSys.has_db() && yvDB.update_message_file(message);
    }


    // Upload file for TXT, IMAGE, AUDIO, GPS_LOCATION message in native iOS and Android.
    // Message with a valid message_mime will be uploaded, or it will be directly sended.
    // All message in PC and mobile chrome, file message in Android, will be uploaded by other way.
    function _upload_message_file(_message, _cb) {
        if ((yvSys.in_android_app() && yvType.is_file(_message)) || !yvSys.in_mobile_app()) {
            _cb && _cb(_message);
            return;
        }

        // For new type of message, keep message_mime invalid if it should not be uploaded
        if (yvType.is_text(_message) || !_message.mime) {
            _update_message_status(_message, yvConstants.SEND_STATUS.SEND_SENDING);
            _cb && _cb(_message);
            return;
        }

        _update_message_status(_message, yvConstants.SEND_STATUS.SEND_UPLOADING);
        console.log("upload message file", _message.mime, _message.subtype, _message);

        // TXT, AUDIO, IMAGE, GPS_LOCATION
        yvAPI.upload_file(_message.file, _message.mime, function (res) {
            if (res === null) {
                _update_message_status(_message, yvConstants.SEND_STATUS.SEND_ERROR);
                console.error("upload message file error", _message);
                return;
            }

            _message.fid = JSON.parse(res).fuuid;
            _update_message_status(_message, yvConstants.SEND_STATUS.SEND_SENDING);
            _cb && _cb(_message);
        });
    }


    // save message to local storage before send it to server, including 2 steps:
    // 1. insert and display message in this conversation
    // 2. update latest message of this converstion
    function _prepare_send(conversation, raw_message, callback) {
        var message = yvMessage.create_sending_message(conversation, raw_message);
        conversation.add_message(message);
        callback && callback(message);

        if (yvSys.has_db()) {
            yvDB.insert_message(message);
        }
    }


    function _send_message(conversation, raw_message, callback) {
        _prepare_send(conversation, raw_message, function (message) {
            var _upload_message = typeof callback === "function" ? callback : _upload_message_file;
            _upload_message(message, function (msg) {
                yvSend.send_message(msg, false);
            });
        });
    }


    function _forward_message_new(_forward, _cb) {
        var _m = yvMessage.create_forward_message(_forward);

        _prepare_send(_m, function (_message) {
            yvSend.send_message(_message, true);
        });
    }


    function _update_contacts_from_server() {
        var defer = $q.defer();

        function __error() {
            defer.reject("error in update contacts from server");
        }

        yvAPI.get_service_user_list(function (data) {
            console.log("updating contacts from server..., total count: %d.", data.list.length);
            _delete_all_contacts(function () {
                angular.forEach(data.list, function (user) {
                    _add_contact(user);
                });
                defer.resolve("finish update contacts from server");
            });
        }, __error, __error);

        return defer.promise;
    }


    function _reorder_conversations(conv1, conv2) {
        if (conv1.latest_message && !conv2.latest_message) {
            return -1;
        }
        if (!conv1.latest_message && conv2.latest_message) {
            return 1;
        }
        if (!conv1.latest_message && !conv2.latest_message) {
            var upt1 = yvMessage.string_to_ts(conv1.updatetime);
            var upt2 = yvMessage.string_to_ts(conv2.updatetime);
            return upt2 - upt1;
        }
        var t1 = yvMessage.string_to_ts(conv1.latest_message.createtime);
        var t2 = yvMessage.string_to_ts(conv2.latest_message.createtime);
        return t2 - t1;
    }


    function _add_conversation_from_api_reserve(list) {
        var user_set = {};
        angular.forEach(list, function (conv) {
            if (yvBase.get("conversation", conv.uuid) || !conv.latest_message) {
                return; // reserve is old or no latest message, ignore it
            }
            _add_conversation(conv, null);
            user_set[conv.user_uuid] = conv.from_user;
        });
        angular.forEach(user_set, function (user) {
            _add_object(user);
        });
    }


    function _update_conversations_from_server() {
        var defer = $q.defer();
        var args = { "page_offset": 0, "page_size": yvSys.page_size() };

        function __error() {
            defer.reject("error in update conversations from server");
        }

        yvAPI.get_conversation_page(args, function (data) {
            console.log("updating conversations from server..., total count: %d.", data.list.length, data.list);
            _delete_all_conversations(function () {
                _add_conversation_from_api_reserve(data.list);
                defer.resolve("finish update conversations from server");
            });
        }, __error, __error);

        return defer.promise;
    }

    function _load_objects_from_database() {
        var _defer = $q.defer();

        yvDB.load_objects(function (tx, res) {
            var item = null;

            for (var i = 0, len = res.rows.length; i < len; i++) {
                item = res.rows.item(i);
                yvBase.mset("object", item.uuid, item);
            }
            _defer.resolve("finish load objects");
        }, function (tx, error) {
            _defer.reject("error in load objects");
        });

        return _defer.promise;
    }


    function _load_conversations_from_database() {
        var _defer = $q.defer();

        yvDB.load_conversations(function (tx, res) {
            var item = null;
            for (var i = 0, len = res.rows.length; i < len; i++) {
                item = res.rows.item(i);
                yvDB.get_latest_message(item, function (message, conv) {
                    conv.latest_message = message;
                    yvBase.mset("conversation", conv.uuid, conv);
                });
            }
            _defer.resolve("finish load conversations");
        }, function (tx, error) {
            _defer.reject("error in load conversations");
        });

        return _defer.promise;
    }


    function _load_contacts_from_database() {
        var _defer = $q.defer();

        yvDB.load_contacts(function (tx, res) {
            var item = null;

            for (var i = 0, len = res.rows.length; i < len; i++) {
                item = res.rows.item(i);
                item.is_portal_user = !!item.is_portal_user;
                item.is_service_user = !!item.is_service_user;
                yvBase.mset("contact", item.uuid, item);
            }
            _defer.resolve("finish load contacts");
        }, function (tx, error) {
            _defer.reject("error in load contacts");
        });

        return _defer.promise;
    }


    function _update_all_from_server(success, error) {
        var p0 = _update_contacts_from_server();
        var p1 = _update_conversations_from_server();

        yvBase.reset();

        $q.all([p0, p1]).then(function (value) {
            success && success();
        }, function (reason) {
            yvLog.log("update all from server error:", reason);
            error && error();
        });
    }


    function _load_all_from_database(cb) {
        var p0 = _load_objects_from_database();
        var p1 = _load_contacts_from_database();
        var p2 = _load_conversations_from_database();

        yvBase.reset();
        
        $q.all([p0, p1, p2]).finally(function () {
            cb && cb();
        });
    }


    function _reload(callback) {
        _update_all_from_server(function () {
            _get_unack_all();
            callback && callback();
        }, function () {
            _offline_reload(callback);
        });
    }

    function _offline_reload(callback) {
        if (yvSys.has_db()) {
            _load_all_from_database(function () {
                callback && callback();
            });
        }
    }
    

    return {
        init_yvdb: function (callback) {
            _init_yvdb(callback);
        },

        init_userdb: function (uuid, callback) {
            _init_userdb(uuid, callback);
        },

        add_login_user: function (userdata, callback) {
            _add_login_user(userdata, callback);
        },

        logout: function () {
            _logout();
        },

        local_logout: function () {
            _local_logout();
        },

        set_server: function () {
            _set_server();
        },

        unread_zero: function (conversation) {
            _unread_zero(conversation);
        },

        delete_message: function (conversation, message) {
            _delete_message(conversation, message);
        },

        set_audio_read: function (message) {
            _set_audio_read(message);
        },

        delete_conversation: function (conversation) {
            _delete_conversation(conversation);
        },

        update_conversations_from_server: function () {
            return _update_conversations_from_server();
        },

        reload: function (offline, callback) {
            if (!!offline) {
                _offline_reload(callback);
            } else {
                _reload(callback);
            }
        },
        
        open_conversation: function (params, callback) {
            _open_conversation(params, callback);
        },

        is_conversation_online: function (conversation) {
            return _is_conversation_online(conversation);
        },
        
        add_conversation_from_api_reserve: function (list, callback) {
            _add_conversation_from_api_reserve(list, callback);
        },

        add_message: function (message, with_ack, callback) {
            _add_message(message, with_ack, callback);
        },

        prepare_send: function (conversation, raw_message, callback) {
            _prepare_send(conversation, raw_message, callback);
        },
        
        send_message: function (conversation, raw_message, callback) {
            _send_message(conversation, raw_message, callback);
        },

        get_unack_all: function () {
            _get_unack_all();
        },

        load_conversation_messages: function (conversation, callback) {
            _load_conversation_messages(conversation, callback);
        },

        update_message_status: function (message, status) {
            _update_message_status(message, status);
        },

        update_message_file: function (message, file) {
            _update_message_file(message, file);
        },

        update_message_all: function (message, params) {
            _update_message_all(message, params);
        },

        update_current_user: function (key, value) {
            _update_current_user(key, value);
        },

        update_noti_settings: function (key, value) {
            _update_noti_settings(key, value);
        },
    };

}]);
