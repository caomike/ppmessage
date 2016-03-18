ppmessageModule.factory("yvNoti", [
    "$timeout",
    "$rootScope",
    "yvAPI",
    "yvSys",
    "yvSSL",
    "yvUser",
    "yvLink",
    "yvType",
    "yvAlert",
    "yvLocal",
    "yvBase",
    "yvMessage",
    "yvConstants",
function ($timeout, $rootScope, yvAPI, yvSys, yvSSL, yvUser, yvLink, yvType, yvAlert, yvLocal, yvBase, yvMessage, yvConstants) {
    
    var SOCKET_STATE = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var _ios_plugin = null;
    var _pc_socket = null;
    var _typing_promise = null;
    var _reconnect_interval = null;
    var _pending_messages = [];
        
    function _typing() {
        if (_typing_promise == null) {
            _typing_promise = $timeout(function () {
                _typing_promise = null;
            }, 1500);
            _send_type_message({type: "typing"});
        }
    }
        
    function _socket_reconnect_interval() {
        var _d = new Date(), _s = _socket_reconnect();
        // console.log("SOCKET RECONNECT AT: ", _d.toUTCString(), "CURRENT STATE IS: ", _s);
    }
    
    function _is_socket_type_data(data) {
        if (data.type !== undefined) {
            return true;
        }
        return false;
    }
    
    function _is_socket_meta_data(data) {
        if (data.error_code !== undefined) {
            return true;
        }
        return false;
    }
    
    function _is_socket_message_data(data) {
        // message type and message subtype
        if (data.mt !== undefined && data.ms !== undefined) {
            return true;
        }
        return false;
    }

    function _handle_socket_meta_data(obj) {
    }

    function _handle_socket_type_data(obj) {
        //FIXME: online message
        //FIXME: typing message

        if (obj.type == "ONLINE" || obj.type == "TYPING") {
            $rootScope.$broadcast("event:" + obj.type.toLowerCase(), obj);
            return;
        }
        
        if (obj.type == "MSG") {
            _handle_socket_message_data(obj.msg);
            return;
        }

        if (obj.type == "ACK") {
            console.log("ws ack message: %o", obj);
            $rootScope.$broadcast("event:receive_ack_message", obj);
            return;
        }

        console.error("unknown ws message: %o", obj)
        return;
    }
    
    function _handle_socket_message_data(obj) {
        console.log("incoming message: %o", obj);
        $rootScope.$broadcast("event:add_message", obj);
        if (yvSys.in_pc_browser()) {
            _desktop_notification(obj);
            return;
        }
    }

    function __connect_mqtt() {
        var url = "tcp://" + yvAPI.get_server().host + ":1883";
        var options = {
            timeout: 10, //optional
            keepAliveInterval: 20 * 60, //optional
            userName: yvUser.get("uuid"), //user_uuid
            password: yvUser.get("session_uuid"), //session_uuid
            notificationTitle: "ppmessage" //optional
        };

        //FIXME: mqttPlugin connect should check if connected then ignore
        mqttPlugin.connect(url, yvUser.get("device_uuid"), options, null, function () {
            console.log('---->connect failed:');
        });
        mqttPlugin.setOnMessageArrivedCallback(null);
    }

    function __disconnect_mqtt() {
        mqttPlugin.disconnect(function () {
            console.log('------->disconnect mqtt successful.');
        });
    }

    function __open_socket() {
        _socket_init();
        _reconnect_interval = setInterval(_socket_reconnect_interval, 1000 * 10);
    }
    
    function __close_socket() {
        console.log("closing socket..... %o", _pc_socket);
        
        if (_pc_socket != null) {
            _pc_socket.close();
            _pc_socket = null;
        }
        
        if (_reconnect_interval != null) {
            clearInterval(_reconnect_interval);
            _reconnect_interval = null;
        }
    }
    
    function _desktop_notification(_incoming) {
        // don't care about logout message or sync message
        if (yvType.is_logout(_incoming) || _incoming.fi == yvUser.get("uuid")) {
            return;
        }
        
        var _icon = null, _body = null;
        var _from_object = yvBase.get("object", _incoming.fi);
        var _noti_title = yvLocal.translate("app.GLOBAL.TITLE_DESKTOP");
        var _message_title = yvMessage.get_localized_title(_incoming.bo, _incoming.ms);
        
        if (_from_object) {
            _body = _from_object.fullname + ": " + _message_title;
            _icon = yvLink.get_user_icon(_from_object.icon);
        } else {
            _body =  "...: " + _message_title;
            _icon = yvLink.default_user_icon();
        }
        yvSys.desktop_notification(_noti_title, _body, _icon);
    }
    
    function _fn_pc_open() {
        if (!_pc_socket) {
            console.error("there is no pc socket");
            return;
        }

        var _socket_state = _pc_socket.readyState;
        var _auth = {
            type: "auth",
            is_service_user: true,
            api_token: yvUser.get("access_token"),
            user_uuid: yvUser.get("uuid"),
            device_uuid: yvUser.get("device_uuid"),
            app_uuid: yvUser.get("app").uuid
        };

        if (_socket_state === WebSocket.OPEN) {
            console.log("pc socket is open, will send auth type message to server...");
            _pc_socket.send(JSON.stringify(_auth));

            // send pending message
            angular.forEach(_pending_messages, function (message) {
                console.log("-------send pending message", message);
                _pc_socket.send(JSON.stringify(message));
            });
            _pending_messages.length = 0;
            return;
        }
        
        console.error("pc socket is not open, current state is: ", SOCKET_STATE[_socket_state]);
        return;
    }

    function _fn_pc_close() {
        console.log("======WS closed==========");
    }

    function _fn_pc_listener(message) {
        var _o = JSON.parse(message.data);
        console.log("ws message: ", _o);

        if (_is_socket_type_data(_o)) {
            _handle_socket_type_data(_o);
            return;
        }
        
        console.error("unknown message: ", _o);
        return;
    }

    function _socket_init() {
        var server = yvAPI.get_server();
        var ws = server.protocol == "https://" ? "wss://" : "ws://";
        var host = server.port ? server.host + ":" + server.port : server.host;
        var url = ws + host + "/pcsocket/WS";
        _pc_socket = new WebSocket(url);
        _pc_socket.onopen = _fn_pc_open;
        _pc_socket.onmessage = _fn_pc_listener;
        _pc_socket.onclose = _fn_pc_close;
    }

    function _socket_reconnect() {
        if (!_pc_socket) {
            _socket_init();
            return "NO_SOCKET";
        }
        var _socket_state = _pc_socket.readyState;
        if (_socket_state === WebSocket.CLOSING || _socket_state === WebSocket.CLOSED) {
            console.log("socket_reconnect, socket is closing or closed, will reconnect");
            _socket_init();
        }
        return SOCKET_STATE[_socket_state];
    }

    function _on_init_error() {
        console.error("error for notification register.");
    }

    function _fn_ios_unregister_success() {
        console.log("unregister ios notification success.");
    }

    function _fn_ios_unregister_failed() {
        console.error("unregister ios notification failed");
    }

    function _real_ios_register(_success, _error) {
        var _options = {
            "badge": "true",
            "sound": "true",
            "alert": "true",
            "ecb": "_fn_ios_listener"
        };
        _ios_plugin = window.plugins.pushNotification;
        if (device.isVirtual) {
            _success && _success("YOU-GOT-A-FAKE-IOS-TOKEN-IN-EMULATOR");
            return;
        }
        if (_ios_plugin) {
            _ios_plugin.register(_success, _error, _options);
        }
    }

    function _on_ios_resume() {
        // When called from a resume event handler, interactive functions
        // such as alert() need to be wrapped in a setTimeout() call with
        // a timeout value of zero, or else the app hangs.
        // resume means the app exists, but the network action already closed
        // FIXME: display the resume status in title bar "Connecting...", "Loading..."
        $timeout(function () {
            __open_socket();
            $rootScope.$broadcast("event:get_unack_all");
            _real_ios_register(function (_token) {
                console.log("_register success when on resume");
                console.log("TOKEN: " + _token);
            }, _on_init_error);
        });
    }

    function _on_android_resume() {
        $timeout(function () {
            __open_socket();
            $rootScope.$broadcast("event:get_unack_all");
            __connect_mqtt();
        });
    }

    function _on_ios_pause() {
        $timeout(function() {
            __close_socket();
        });
    }

    function _on_android_pause() {
        $timeout(function() {
            __close_socket();
        });
    }
    
    function _android_init() {
        document.addEventListener('resume', _on_android_resume, false);
        document.addEventListener('pause', _on_android_pause, false);
        __connect_mqtt();
    }

    function _ios_init(_success, _error) {
        if (!_error) {
            _error = _on_init_error;
        }
        console.log("_ios_register and register resume now");
        document.addEventListener('resume', _on_ios_resume, false);
        document.addEventListener('pause', _on_ios_pause, false);
        _real_ios_register(_success, _error);
    }

    function _exit() {
        if (yvSys.in_ios_app()) {
            if (_ios_plugin) {
                _ios_plugin.unregister(_fn_ios_unregister_success, _fn_ios_unregister_failed);
                _ios_plugin = null;
            }
            document.removeEventListener('resume', _on_ios_resume, false);
            document.removeEventListener('pause', _on_ios_pause, false);
        }
        
        if (yvSys.in_android_app()) {
            __disconnect_mqtt();
            document.removeEventListener('resume', _on_android_resume, false);
            document.removeEventListener('pause', _on_android_pause, false);
        }

        // for every platform
        __close_socket();
    }

    function _send_type_message(_body) {
        if (!_pc_socket || _pc_socket.readyState != WebSocket.OPEN) {
            console.error("send type message failed for socket not open");
            return;
        }
        _pc_socket.send(JSON.stringify(_body));
    }

    function _send_pp_message(_m, _s, _e, _e) {
        if (!_pc_socket || _pc_socket.readyState != WebSocket.OPEN) {
            console.error("send type message failed for socket not open, push it to pending list");
            _pending_messages.push(_m);
            _e && _e();
            return;
        }
        _pc_socket.send(JSON.stringify(_m));
        _s && _s();
        return
    }
    
    return {
        init: function (_success, _error) {
            if (yvSys.in_ios_app()) {
                _ios_init(_success, _error);
            }
            
            if (yvSys.in_android_app()) {
                _android_init();
            }
            
            // every platform
            // force close previous active socket and reconnect interval
            __close_socket();            
            __open_socket();
        },

        exit: function () {
            _exit();
        },

        watch_typing: function(_conversation_uuid) {
            var _m = {
                type: "typing_watch",
                conversation_uuid: _conversation_uuid
            };
            _send_type_message(_m);
        },

        unwatch_typing: function(_conversation_uuid) {
            var _m = {
                type: "typing_unwatch",
                conversation_uuid: _conversation_uuid
            };
            _send_type_message(_m);
        },

        typing: function() {
            _typing();
        },
        
        get_ios_token: function (_success, _error) {
            _real_ios_register(_success, _error);
        },

        send_message: function(_m, _s, _e, _e) {
            _send_pp_message(_m, _s, _e, _e);
        },
        
    };
}]);
