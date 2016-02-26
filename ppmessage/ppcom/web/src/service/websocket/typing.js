Service.$notifyTyping = (function() {

    var TYPING_WATCH = 'typing_watch',
        TYPING = 'typing',
        TYPING_UNWATCH = 'typing_unwatch';
    
    //////// API //////////////
    
    return {
        get: get,
    }

    function get ( $notifyService, typingMsg ) {
        
        return {
            dispatch: dispatch,
            
            watch: watch,
            unWatch: unWatch,
            typing: typing
        }

        // when some_one is typing ...
        // will publish a event
        // `Service.$pubsub.publish('ws/typing', { type: 'typing', user_uuid: 'xxxx' })`
        function watch ( conversationUUID ) {
            
            if ( $notifyService.isWsOk() ) {
                
                $notifyService.write( Service.$json.stringify( { type: TYPING_WATCH, conversation_uuid: conversationUUID } ) );

                __Monitor.report( __MonitorEvent.watch, conversationUUID );
                
            }
            
        }

        function unWatch ( conversationId ) {
            if ( conversationId && $notifyService.isWsOk() ) {

                $notifyService.write( Service.$json.stringify( { type: TYPING_UNWATCH, conversation_uuid: conversationId } ) );

                __Monitor.report( __MonitorEvent.unwatch, conversationId );
                
            }
        }

        function typing () {
            
            if ( $notifyService.isWsOk() ) {
                
                $notifyService.write( Service.$json.stringify( { type: TYPING } ) );

                __Monitor.report( __MonitorEvent.typing, TYPING );
                
            }
            
        }

        function dispatch () {

            typingMsg !== undefined && Service.$pubsub.publish( 'ws/typing', typingMsg );
            
        }
        
    }
    
})();
