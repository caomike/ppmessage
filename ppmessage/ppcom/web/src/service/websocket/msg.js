Service.$notifyMsg = (function() {

    var TYPE_SEND = 'send',
        WHAT_SEND = 'SEND';

    //////// API //////////////
    return {
        get: messageDispatcher
    }

    function messageDispatcher ( $notifyService, msg ) {

        var $api = Service.$api,
            $pubsub = Service.$pubsub,
            $debug = Service.$debug;
        
        return {
            send: send,
            dispatch: dispatch
        }

        // @description:
        //     if `WebSocket` is not ok, then this method will throw a Exception
        function send () {

            var apiMessage = msg;

            if ( apiMessage ) {
                
                var wsMsg = Service.$json.stringify( {
                    type: TYPE_SEND,
                    send: apiMessage
                } );

                $notifyService.write( wsMsg, function() {
                    throw new Error( 'ws not open' );
                } );
                
            }
            
        }

        function dispatch () {
            
            var isAckMessage = ( msg.what !== undefined && msg.what === WHAT_SEND );

            if ( isAckMessage ) {
                dispatchAckMessage( msg );
            } else {
                dispatchWsMessage( msg );
            }
            
        }

        function dispatchAckMessage( ackMessage ) {
            var msgId = ackMessage.extra.uuid; // the message id
            if ( msgId ) {

                if ( ackMessage.code === 0 ) { // success
                    Service.$messageSender.notifySendDone( msgId );
                } else {
                    Service.$messageSender.notifySendFail( msgId );
                }
                
            }
        }

        function dispatchWsMessage( apiMessage ) {
            //ack message
            $api.ackMessage({
                list: [ apiMessage.pid ]
            });

            //convert api message to ppMessage
            new Service.ApiMessageAdapter(apiMessage)
                .asyncGetPPMessage(function(ppMessage, succ) {
                    if (succ) {
                        // publish new message arrived msg
                        $pubsub.publish("ws/msg", ppMessage);
                    }
                });            
        }
        
    }
    
})();
