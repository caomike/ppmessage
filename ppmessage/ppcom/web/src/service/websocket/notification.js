/**
 *
 * WebSocket.readyState
 *
 * CONNECTING	0	The connection is not yet open.
 * OPEN	1	The connection is open and ready to communicate.
 * CLOSING	2	The connection is in the process of closing.
 * CLOSED	3	The connection is closed or couldn't be opened.
 *
 * - Start:
 *
 * Service.$notification.init({user_uuid: xxxx, device_uuid: xxxx}).start();
 *
 * - onNewMessageArrived:
 *     Service.$pubsub.publish('ws/msg', ppMessage);
 *
 * - onTypingMessageArrived:
 *     Service.$pubsub.publish('ws/typing', { type: 'typing', 'user_uuid': user_uuid, 'conversation_uuid': conversation_uuid } );
 *
 * - onUserOnlineMessageArrived:
 *     Service.$pubsub.publish('ws/online, { type: 'online' } );
 *
 * - onLogoutMessageArrived:
 *     `We will close webSocket`
 *
 * - reset:
 *
 * reset $notification to initialization status
 *
 */
Service.$notification = (function() {

    var wsSettings = null,
        ws = null, // WebSocket
        wsUrl = Configuration.web_socket_url,
        supportWebSocket = !(typeof WebSocket === "undefined"), // Does browser support webSocket ?

        checkWebSocketIntervalHandle = null, // check webSocket status every 10s
        _resetCallback = null, // reset callback

        // On WebSocket open
	    // An event listener to be called when the WebSocket connection's readyState changes to OPEN;
        // this indicates that the connection is ready to send and receive data. 
        onWebSocketOpen = function() {

            if (wsSettings == null) return;
            if (ws == null) return;

            // send auth message
            Service.$notifyAuth.get( Service.$notification ).auth();
            
        },

        // on webSocket close
        // An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
        onWebSocketClose = function() {
            if (wsSettings == null) return;

            Service.$user.offline();
            
            // reset status
            ws = null;

            // reset callback
            if (_resetCallback) {
                _resetCallback();
            }
        },

        // on webSocket message
        // An event listener to be called when a message is received from the server.
        onWebSocketMessage = function(event) {
            var $json = Service.$json,
                $debug = Service.$debug,
                apiMessage =
                ( typeof event.data === 'string' && function () {
                    try {
                        return $json.parse(event.data);
                    } catch ( e ) {
                        e && $debug.d ( e );
                        return undefined;
                    }
                } () ) || ( typeof event.data === 'object' && event.data );

            if ( apiMessage !== undefined ) {
                
                //debug api message
                $debug.d('[Message][Arrived][WsMessage]:', apiMessage);

                Service.$notifyFactory.get( Service.$notification, apiMessage ).dispatch();

            }
            
        },

        // on webSocket error
        onWebSocketError = function(event) {
            ws = null;
        },

        // Close webSocket
        closeWebSocket = function() {
            if (ws == null) return;            
            ws.close();
        },

        // check webSocket connect status
        checkWebSocketConnectStatus = function() {

            if (ws == null ||
                ws.readyState == WebSocket.CONNECTING ||
                ws.readyState == WebSocket.CLOSED) {
                reconnect();
            }
            
        },

        // reconnect 
        reconnect = function() {
            start();
        },

        // cancel reconnect task
        cancelCheckWebSocketStatus = function() {
            if (checkWebSocketIntervalHandle == null) return;

            // Cancel task
            clearInterval(checkWebSocketIntervalHandle);
            checkWebSocketIntervalHandle = null;
        },

        // check webSocket status every 10s
        startCheckWebSocketStatusAndTryReconnectTask = function() {
            cancelCheckWebSocketStatus();
            checkWebSocketIntervalHandle = setInterval(checkWebSocketConnectStatus, 1000 * 10);
        },
        
        // Initialization
        init = function(settings) {
            wsSettings = settings;
            return this;
        },

        // Start 
        start = function() {
            if (!supportWebSocket) return;
            if (wsSettings == null) return;
            if (ws != null) return;
            
            ws = new WebSocket(wsUrl);
            ws.onopen = onWebSocketOpen;
            ws.onclose = onWebSocketClose;
            ws.onmessage= onWebSocketMessage;
            ws.onerror = onWebSocketError;

            startCheckWebSocketStatusAndTryReconnectTask();
        },

        // generally, this method called only by `PP.shutdown()`, so we clear all status
        reset = function(resetCallback) {
            _resetCallback = resetCallback;
            
            closeWebSocket();
            cancelCheckWebSocketStatus();
        },

        getWebSocket = function () {
            return ws;
        };

    ///////// API //////////////
    
    return {

        init: init,
        start: start,
        reset: reset,

        write: write,
        getWs: getWs,
        isWsOk: isWsOk,
        getWsSettings: getWsSettings,

        onWebSocketMessage: onWebSocketMessage
        
    }

    // @param `errorCallback` :
    //        NOTE: this is an `error callback`, it will called when the `WebSocket` is not open
    function write ( data, errorCallback ) {
        if ( isWsOk() ) {
            
            getWs().send( data );
            Service.$debug.d( '[Message][Send]', data );
            
        } else {
            if ( errorCallback ) errorCallback ( data );
        }
    }

    function getWs () {
        return ws;
    }

    function isWsOk () {
        return ws != null && ws.readyState === WebSocket.OPEN;
    }

    function getWsSettings () {
        return wsSettings;
    }
    
})();
