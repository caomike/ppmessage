ppmessageModule.factory("yvDB", [
    "$rootScope",
    "$timeout",
    "yvAPI",
    "yvSys",
    "yvSSL",
    "yvNav",
    "yvUser",
    "yvConstants",
function ($rootScope, $timeout, yvAPI, yvSys, yvSSL, yvNav, yvUser, yvConstants) {

    "use strict";

    var _userdb = null, _yvdb = null, _current_server = {id: -1};

    function _open_db(name) {
        //
        //0 (default): Documents - will be visible to iTunes and backed up by iCloud
        //1: Library - backed up by iCloud, NOT visible to iTunes
        //2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
        //
        if (yvSys.in_mobile_app()) {
            return window.sqlitePlugin.openDatabase({name: name, location: 0});
        }
        return window.openDatabase(name, "1.0", name, 12 * 1024 * 1024);
    }


    function _reset() {
        var _yvdb = _open_db("yvdb");
        _yvdb.transaction(function (tx) {
            var _sql = "UPDATE yvdb_login_users SET is_online = 0, logout_time = ? WHERE id = ?";
            var _values = [Math.round(Date.now() / 1000), yvUser.get("id")];
            //FIXME: yvUser.get_master_db_id() return null
            tx.executeSql(_sql, _values, null, function (tx, err) {
                console.log(err);
            });
        });
        $rootScope.$broadcast("event:reset-base");
        yvNav.exit_app(true);
    }


    function _exec(_db, _sql, _value, _success, _error) {
        if (!_db) {
            _reset();
            return;
        }

        function __default_success(tx, res) {
            return;
        }

        function __default_error(tx, res) {
            console.error(res);
            console.error("error SQL statement", _sql);
            console.error("error SQL value", _value);
        }

        _success = _success || __default_success;
        _error = _error || __default_error;

        _db.transaction(function (tx) {
            tx.executeSql(_sql, _value, _success, _error);
        }, function (error) {
            console.error(error);
        });
    }


    function _open_yvdb() {
        try {
            _yvdb = _open_db("yvdb");
        } catch (error) {
            console.error("encount error when init yvdb", error);
        }

        return _yvdb;
    }


    function _set_server(server) {
        _current_server.id = server.id;
        _current_server.name = server.name;
        _current_server.host = server.host;
        _current_server.port = server.port;
        _current_server.protocol = server.protocol;
        yvAPI.set_server(_current_server);
    }


    function _init_yvdb_has_user(user_uuid, callback) {
        function _init_callback() {
            callback && callback(yvUser.get());
        }
        
        _init_userdb(user_uuid, function () {
            var _sql = "SELECT * FROM userdb_objects WHERE uuid = ?";
            
            _exec(_userdb, _sql, [user_uuid], function (tx, res) {
                if (res.rows.length === 0) {
                    return _init_callback();
                }
                yvUser.mset(res.rows.item(0));
                _init_callback();
            }, function (tx, err) {
                _init_callback();
            });
        });
    }


    function _pick_user(cb) {
        var _sql0 = "SELECT * FROM yvdb_servers WHERE is_selected = 1 LIMIT 1";
        var _sql1 = "SELECT * FROM yvdb_login_users WHERE server_id = ? ORDER BY login_time DESC LIMIT 1";

        _exec(_yvdb, _sql0, [], function (tx, res) {
            if (res.rows.length === 0) {
                cb && cb(null);
                return;
            }

            var _o = res.rows.item(0);
            _set_server(_o);
            
            _exec(_yvdb, _sql1, [_o.id], function (tx, res) {
                if (res.rows.length === 0) {
                    cb && cb(null);
                    return;
                }
                var item = res.rows.item(0);
                yvUser.update_user_from_db(item);
                _init_yvdb_has_user(item.user_uuid, cb);
            }, function (tx, err) {
                cb && cb(null);
            });
        });
    }


    function _create_servers() {
        // uncomment this to force drop tables
        // _exec(_yvdb, "drop table if exists yvdb_servers", [], null, null);
        var _sql0 = "CREATE TABLE IF NOT EXISTS yvdb_servers (id integer primary key, name text UNIQUE, " +
            " host text UNIQUE, port text, protocol text, is_selected integer)";
        var _sql1 = "SELECT * FROM yvdb_servers WHERE name=? AND host=?";
        var _sql2 = "UPDATE yvdb_servers SET is_selected = 0";
        var _sql3 = "INSERT INTO yvdb_servers (name, host, port, protocol, is_selected) VALUES (?, ?, ?, ?, ?)";
        var _servers = [
            [ppmessage.server.name, ppmessage.server.host, ppmessage.server.port, ppmessage.server.protocol, 1],
        ];

        _exec(_yvdb, _sql0, [], null, null);
        angular.forEach(_servers, function (server, index) {
            _exec(_yvdb, _sql1, [server[0], server[1]], function (tx, res) {
                if (res.rows.length === 0) {
                    _exec(_yvdb, _sql2, [], function (tx, res) {
                        _exec(_yvdb, _sql3, server, null, null);
                    }, null);
                }
            }, null);
        });
    }


    function _create_login_user () {
        // uncomment this to force drop tables
        // _exec(_yvdb, "drop table if exists yvdb_login_users", [], null, null);
        var _sql = "CREATE TABLE IF NOT EXISTS yvdb_login_users (id integer primary key, server_id integer, " +
            " user_uuid text, device_uuid text, session_uuid text, app_uuid text, app_name text, app_key text, " +
            " app_secret text, show_badge integer, mute_notification integer, silence_notification integer, " +
            " is_distributor_user integer, login_time integer, logout_time integer, is_online integer)";
        
        _exec(_yvdb, _sql, [], null, null);
    }


    function _update_yvdb(cb) {
        var _sql0 = "PRAGMA user_version";
        var _sql1 = "PRAGMA user_version = 1";
        var _sql2 = "PRAGMA user_version = 2";

        if (yvSys.in_electron()) {
            _create_servers();
            _create_login_user();
            cb && cb();
            return;
        }

        _exec(_yvdb, _sql0, [], function (tx, res) {
            var _v = res.rows.item(0).user_version;
            _create_servers(); // alway try to create new server
            if (_v === 0) {
                console.log("NO DB -> create now.");
                _create_login_user();
                _exec(_yvdb, _sql1, [], null, null);
            } else if (_v === 1) {
                console.log("HAS DB and updated.");
            }
            cb && cb();
        }, null);
    }


    function _init_yvdb(callback) {
        _open_yvdb();
        _update_yvdb(function () {
            _pick_user(callback);
        });
    }


    function _add_login_user(user, app, cb) {
        var _sql0 = "SELECT id FROM yvdb_login_users WHERE server_id = ? AND user_uuid = ?";
        var _sql1 = "INSERT INTO yvdb_login_users (server_id, user_uuid, device_uuid, session_uuid, app_uuid, " +
            " app_name, app_key, app_secret, show_badge, mute_notification, silence_notification, is_distributor_user, " +
            " login_time, is_online) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var _sql2 = "UPDATE yvdb_login_users SET device_uuid = ?, session_uuid = ?, app_uuid = ?, app_name = ?, " +
            " app_key = ?, app_secret = ?, show_badge = ?, mute_notification = ?, silence_notification = ?, " +
            " is_distributor_user = ?, login_time = ?, is_online = ? WHERE id = ?";
        
        var _td = Math.round(Date.now() / 1000);
        var _show_badge = user.show_badge ? 1 : 0;
        var _mute_notification = user.mute_notification ? 1 : 0;
        var _silence_notification = user.silence_notification ? 1 : 0;
        var _is_distributor_user = user.is_distributor_user ? 1 : 0;
        var _values0 = [_current_server.id, user.uuid];
        var _values1 = [_current_server.id, user.uuid, user.device_uuid, user.access_token, app.uuid, app.app_name,
                        app.app_key, app.app_secret, _show_badge, _mute_notification, _silence_notification,
                        _is_distributor_user, _td, 1];
        
        function __success(id) {
            yvUser.set("id", id);
            cb && cb();
        }

        _exec(_yvdb, _sql0, _values0, function (tx, res) {
            if (res.rows.length === 0) {
                _exec(_yvdb, _sql1, _values1, function (tx, res) {
                    __success(res.insertId);
                }, null);
                return;
            }
            
            var _id = res.rows.item(0).id;
            var _values2 = [user.device_uuid, user.access_token, app.uuid, app.app_name, app.app_key, app.app_secret, _show_badge,
                            _mute_notification, _silence_notification, _is_distributor_user, _td, 1, _id];

            _exec(_yvdb, _sql2, _values2, function (tx, res) {
                __success(_id);
            }, null);
        }, null);
    }


    function _logout_user(_cb) {
        var _sql = "UPDATE yvdb_login_users SET is_online = 0, logout_time = ? WHERE id = ?";
        var _values = [Math.round(Date.now() / 1000), yvUser.get("id")];

        _exec(_yvdb, _sql, _values, function (tx, res) {
            _cb && _cb();
        }, null);
    }


    function _update_noti_settings(key, value) {
        var _sql = "update yvdb_login_users set " + key + " = ? where id = ?";
        var _values = [value ? 1 : 0, yvUser.get("id")];
        
        _exec(_yvdb, _sql, _values, null, null);
    }

    
    function _query_server() {
        var _sql = "SELECT * FROM yvdb_servers WHERE is_selected = ?";

        _exec(_yvdb, _sql, [1], function (tx, res) {
            var _o = null;
            if (res.rows.length === 1) {
                _o = res.rows.item(0);
                _set_server(_o);
            } else {
                _current_server = {id: -1};
                yvAPI.set_server(_current_server);
            }
        }, null);
    }


    function _query_servers(_cb) {
        var _sql = "select * from yvdb_servers";

        _exec(_yvdb, _sql, [], function (tx, res) {
            var len = res.rows.length, _oa = [], _o, i;

            for (i = 0; i < len; i++) {
                _o = angular.copy(res.rows.item(i));
                _oa.push(_o);
            }

            if (_cb) { _cb(_oa); }
        }, null);
    }


    function _select_server(_server, _cb) {
        var _sql = "update yvdb_servers set is_selected = case when id=? then 1 else 0 end";
        _exec(_yvdb, _sql, [_server.id], _cb, null);
    }


    function _delete_server(_server, _cb) {
        var _sql1 = "delete from yvdb_servers where id=?";
        _exec(_yvdb, _sql1, [_server.id], _cb, null);
    }


    function _add_server(_server, _cb) {
        var _sql0 = "insert into yvdb_servers (name, host, port, protocol, is_selected) values (?, ?, ?, ?, ?)",
            _sql1 = "update yvdb_servers set is_selected = case when id=? then 1 else 0 end",
            _selected = _server.select ? 1 : 0,
            _values0 = [_server.name, _server.host, _server.port, _server.protocol, _selected];

        _exec(_yvdb, _sql0, _values0, function (tx, res) {
            if (_server.select) {
                _exec(_yvdb, _sql1, [res.insertId], function (tx, res) {
                    if (_cb) { _cb(); }
                }, null);
            } else {
                if (_cb) { _cb(); }
            }
        }, null);
    }


    function _open_userdb(uuid) {
        var app_key = yvUser.get("app").app_key;
        var db_name = hex_sha1(uuid + app_key);

        try {
            _userdb = _open_db(db_name);
        } catch (error) {
            console.error("encount error when init userdb", error);
        }

        return _userdb;
    }


    function _create_userdb(cb) {
        // uncomment this to drop tables
        // _exec(_userdb, "drop table if exists userdb_objects", [], null, null);
        // _exec(_userdb, "drop table if exists userdb_messages", [], null, null);
        // _exec(_userdb, "drop table if exists userdb_conversations", [], null, null);
        // _exec(_userdb, "drop table if exists userdb_contacts", [], null, null);
        var _sql0 = "CREATE TABLE IF NOT EXISTS userdb_objects (id integer primary key, type text, uuid text unique, " +
            " name text, fullname text, signature text, email text, icon text, updatetime integer)";

        var _sql1 = "CREATE TABLE IF NOT EXISTS userdb_messages (id integer primary key, conversation_uuid text, task_uuid text, " +
            " push_uuid text, from_uuid text, to_uuid text, to_type text, type text, subtype text, title text, body text, file text, " +
            " size integer, name text, mime text, duration integer, thumbnail text, direction text, status text, timestamp integer)";

        var _sql2 = "CREATE TABLE IF NOT EXISTS userdb_conversations (id integer primary key, uuid text unique, " +
            " name text, icon text, type text, assigned_uuid text, user_uuid text, group_uuid text, unread integer)";

        var _sql3 = "CREATE TABLE IF NOT EXISTS userdb_contacts (id integer primary key, uuid text unique, " +
            " is_portal_user boolean, is_service_user boolean)";

        _exec(_userdb, _sql0, [], null, null);
        _exec(_userdb, _sql1, [], null, null);
        _exec(_userdb, _sql2, [], null, null);
        _exec(_userdb, _sql3, [], null, null);
        cb && cb();
    }


    function _update_userdb(cb) {
        var _sql0 = "PRAGMA user_version";
        var _sql1 = "PRAGMA user_version = 1";

        if (yvSys.in_electron()) {
            _create_userdb(cb);
            return;
        }

        _exec(_userdb, _sql0, [], function (tx, res) {
            var version = res.rows.item(0).user_version;
            if (version === 0) {
                console.log("NO USERDB -> create now.");
                _create_userdb(cb);
                _exec(_userdb, _sql1, [], null, null);
                return;
            }
            if (version === 1) {
                console.log("HAS USERDB and updated.");
                cb && cb();
                return;
            }
        }, null);
    }


    function _init_userdb(uuid, callback) {
        _open_userdb(uuid);
        _update_userdb(callback);
    }


    function _is_conversation_existed(_uuid, _yes, _no) {
        var _sql = "SELECT uuid FROM userdb_conversations WHERE uuid = ?";

        _exec(_userdb, _sql, [_uuid], function (tx, res) {
            if (res.rows.length) {
                _yes && _yes();
            } else {
                _no && _no();
            }
        });
    }


    function _insert_conversation(conv, _cb) {
        var _sql = "INSERT INTO userdb_conversations (uuid, name, icon, type, assigned_uuid, user_uuid, group_uuid, unread) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var _value = [conv.uuid, conv.name, conv.icon, conv.type, conv.assigned_uuid, conv.user_uuid, conv.group_uuid, conv.unread];

        _exec(_userdb, _sql, _value, _cb, null);
    }


    function _update_conversation_unread(conv, _cb) {
        var _sql = "UPDATE userdb_conversations SET unread = ? WHERE uuid = ?";
        var _value = [conv.unread, conv.uuid];

        _exec(_userdb, _sql, _value, _cb, null);
    }


    function _update_conversation_group(conv, _cb) {
        var _sql = "UPDATE userdb_conversations SET group_uuid = ? WHERE uuid = ?";
        var _value = [conv.group_uuid, conv.uuid];

        _exec(_userdb, _sql, _value, _cb, null);
    }


    // only for add conversation after getting app conversations from server
    function _add_conversation(conv) {
        _is_conversation_existed(conv.uuid, function () {
            console.log("conversation already exists in database, will not add.", conv);
        }, function () {
            _insert_conversation(conv);
        });
    }


    function _delete_conversation(_conv) {
        var _sql0 = "DELETE FROM userdb_messages WHERE conversation_uuid = ?";
        var _sql1 = "DELETE FROM userdb_conversations WHERE uuid = ?";
        
        _exec(_userdb, _sql0, [_conv.uuid], null, null);
        _exec(_userdb, _sql1, [_conv.uuid], null, null);
    }


    function _delete_all_conversations(callback) {
        var _sql = "DELETE FROM userdb_conversations";

        _exec(_userdb, _sql, [], callback, callback);
    }

    function _delete_all_contacts(callback) {
        var _sql = "DELETE FROM userdb_contacts";

        _exec(_userdb, _sql, [], callback, callback);
    }


    function _update_current_user(key, value) {
        var _sql = null, _value = null;
        if (arguments.length === 0) {
            _sql = "UPDATE userdb_objects SET fullname = ?, icon = ?, signature = ? WHERE uuid = ?";
            _value = [yvUser.get("fullname"), yvUser.get("icon"), yvUser.get("signature"), yvUser.get("uuid")];
        } else {
            _sql = "UPDATE userdb_objects SET " + key + " = ? WHERE uuid = ?";
            _value = [value, yvUser.get("uuid")];
        }
        
        _exec(_userdb, _sql, _value, null, null);
    }


    function _is_object_existed(_uuid, _yes, _no) {
        var _sql = "SELECT * FROM userdb_objects WHERE uuid = ?";

        _exec(_userdb, _sql, [_uuid], function (tx, res) {
            if (res.rows.length) {
                _yes && _yes();
            } else {
                _no && _no();
            }
        }, null);
    }


    function _update_object(data) {
        var _sql = "UPDATE userdb_objects SET icon = ?, fullname = ?, signature = ?, " +
            " name = ?, email = ?, updatetime = ? WHERE uuid = ?";
        var _values = [data.icon, data.fullname, data.signature, data.name, data.email, data.updatetime, data.uuid];

        _exec(_userdb, _sql, _values, null, null);
    }


    function _insert_object(_data) {
        var _sql = "INSERT INTO userdb_objects (uuid, type, icon, signature, " +
            " fullname, name, email, updatetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var _type = _data.type || yvConstants.YVOBJECT.DEVICE_USER;
        var _values = [_data.uuid, _type, _data.icon, _data.signature, _data.fullname, _data.name,
                       _data.email, _data.updatetime];
        
        _exec(_userdb, _sql, _values, null, null);
    }


    function _add_object(object) {
        _is_object_existed(object.uuid, function () {
            _update_object(object);
        }, function () {
            _insert_object(object);
        });
    }


    function _add_contact(contact) {
        var _sql0 = "SELECT id FROM userdb_contacts WHERE uuid = ?";
        var _sql1 = "INSERT INTO userdb_contacts (uuid, is_portal_user, is_service_user) VALUES (?, 0, 1)";

        _exec(_userdb, _sql0, [contact.uuid], function (tx, res) {
            if (res.rows.length === 0) {
                _exec(_userdb, _sql1, [contact.uuid], null, null);
            }
        }, null);
    }


    function _query_messages(conv_uuid, success, error) {
        var _sql = "SELECT * FROM userdb_messages WHERE conversation_uuid = ? ORDER BY timestamp, id LIMIT 12";

        _exec(_userdb, _sql, [conv_uuid], function (tx, res) {
            success && success(res);
        }, function (tx, err) {
            error && error(err);
        });
    }


    function _insert_message(msg, callback) {
        var _sql0 = "SELECT task_uuid FROM userdb_messages WHERE task_uuid = ? AND direction = ?";
        var _sql1 = "INSERT INTO userdb_messages ( conversation_uuid, task_uuid, push_uuid, from_uuid, to_uuid, to_type, type, " +
            " subtype, title, body, file, size, mime, name, duration, thumbnail, direction, status, timestamp) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var _value0 = [msg.task_uuid, msg.direction];
        var _value1 = [msg.conversation_uuid, msg.task_uuid, msg.push_uuid, msg.from_uuid, msg.to_uuid, msg.to_type,
                       msg.type, msg.subtype, msg.title, msg.body, msg.file, msg.size, msg.mime, msg.name, msg.duration,
                       msg.thumbnail, msg.direction, msg.status, msg.timestamp];

        _exec(_userdb, _sql0,  _value0, function (tx, res) {
            if (res.rows.length) {
                console.log("msg is duplicated task_uuid: " + msg.task_uuid);
                msg.id = res.rows.item(0).id;
                callback && callback(msg);
                return;
            }

            _exec(_userdb, _sql1, _value1, function (tx, res) {
                msg.id = res.insertId;
                callback && callback(msg);
            }, null);
        }, null);
    }


    function _delete_message(_message) {
        var _sql = "DELETE FROM userdb_messages WHERE id = ?";

        _exec(_userdb, _sql, [_message.id], null, null);
    }


    function _update_message_all(_message) {
        var _sql = 'UPDATE userdb_messages SET status = ?, task_uuid = ?, timestamp = ? WHERE id = ?';
        var _value = [_message.status, _message.task_uuid, _message.timestamp, _message.id];

        _exec(_userdb, _sql, _value, null, null);
    }


    function _update_message_status(_message) {
        var _sql = 'UPDATE userdb_messages SET status = ? WHERE id = ?';

        _exec(_userdb, _sql, [_message.status, _message.id], null, null);
    }


    function _update_message_file(_message) {
        var _sql = 'UPDATE userdb_messages SET file = ? WHERE id = ?';

        _exec(_userdb, _sql, [_message.file, _message.id], null, null);
    }


    function _unread_zero(_conv_uuid) {
        var _sql0 = "UPDATE userdb_conversations SET unread = 0 WHERE uuid = ?";
        var _sql1 = "UPDATE userdb_messages SET status = ? WHERE conversation_uuid = ? AND status = ?";
        var _value1 = [yvConstants.RECV_STATUS.RECV_OPEN, _conv_uuid, yvConstants.RECV_STATUS.RECV_NEW];

        _exec(_userdb, _sql0, [_conv_uuid], null, null);
        _exec(_userdb, _sql1, _value1, null, null);
    }


    function _set_audio_read(_id, _cb) {
        var _sql = "UPDATE userdb_messages SET status = ? WHERE id = ?";

        _exec(_userdb, _sql, [yvConstants.RECV_STATUS.RECV_PLAY, _id], _cb, null);
    }


    function _get_latest_message(conversation, callback) {
        var _sql = "SELECT * FROM userdb_messages WHERE conversation_uuid = ? ORDER BY TIMESTAMP DESC LIMIT 1";

        _exec(_userdb, _sql, [conversation.uuid], function (tx, res) {
            callback && callback(res.rows.item(0), conversation);
        }, null);
    }


    function _load_common(_sql, success, error) {
        _exec(_userdb, _sql, [], function (tx, res) {
            success && success(tx, res);
        }, function (tx, err) {
            error && error(tx, err);
        });
    }

    function _load_contacts(success, error) {
        var _sql = "SELECT * FROM userdb_contacts LEFT JOIN userdb_objects WHERE userdb_contacts.uuid = userdb_objects.uuid";

        _load_common(_sql, success, error);
    }


    function _load_objects(success, error) {
        var _sql = "SELECT * FROM userdb_objects ORDER BY fullname";

        _load_common(_sql, success, error);
    }


    function _load_conversations(success, error) {
        var limit = yvSys.page_size();
        var _sql = "SELECT * FROM userdb_conversations ORDER BY unread DESC limit " + limit;

        _load_common(_sql, success, error);
    }

    return {
        init_yvdb: function (cb) {
            return _init_yvdb(cb);
        },

        init_userdb: function (_uuid, _cb) {
            return _init_userdb(_uuid, _cb);
        },

        query_server: function () {
            return _query_server();
        },

        query_servers: function (_cb) {
            return _query_servers(_cb);
        },

        select_server: function (_server, _cb) {
            return _select_server(_server, _cb);
        },

        add_server: function (_server, _cb) {
            return _add_server(_server, _cb);
        },

        delete_server: function (_server, _cb) {
            return _delete_server(_server, _cb);
        },

        logout_user: function (cb) {
            return _logout_user(cb);
        },

        add_login_user: function (user, app, cb) {
            return _add_login_user(user, app, cb);
        },

        add_conversation: function (conversation) {
            return _add_conversation(conversation);
        },

        update_conversation_unread: function (conversation) {
            return _update_conversation_unread(conversation);
        },

        update_conversation_group: function (conversation) {
            return _update_conversation_group(conversation);
        },

        add_contact: function (contact) {
            return _add_contact(contact);
        },

        add_object: function (object) {
            return _add_object(object);
        },

        load_contacts: function (success, error) {
            return _load_contacts(success, error);
        },

        load_objects: function (success, error) {
            return _load_objects(success, error);
        },

        load_conversations: function (success, error) {
            return _load_conversations(success, error);
        },

        query_messages: function (conv_uuid, success, error) {
            return _query_messages(conv_uuid, success, error);
        },

        insert_message: function (message, callback) {
            _insert_message(message, callback);
        },

        delete_message: function (_message) {
            return _delete_message(_message);
        },

        delete_conversation: function (_conv) {
            return _delete_conversation(_conv);
        },

        delete_all_conversations: function (callback) {
            return _delete_all_conversations(callback);
        },

        delete_all_contacts: function (callback) {
            return _delete_all_contacts(callback);
        },

        update_message_all: function (_message) {
            return _update_message_all(_message);
        },

        update_message_status: function (_message) {
            return _update_message_status(_message);
        },

        update_message_file: function (_message) {
            return _update_message_file(_message);
        },

        set_audio_read: function (_id, _cb) {
            return _set_audio_read(_id, _cb);
        },

        get_latest_message: function (_conv, _cb) {
            return _get_latest_message(_conv, _cb);
        },

        update_current_user: function (key, value) {
            return _update_current_user(key, value);
        },

        update_noti_settings: function (key, value) {
            return _update_noti_settings(key, value);
        },

        unread_zero: function (_conv_uuid) {
            return _unread_zero(_conv_uuid);
        }
    };
}]);
