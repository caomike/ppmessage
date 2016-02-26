/**
 *
 * Pub/Sub Pattern
 *
 * var pubsub = Service.$pubsub;
 *
 * // 订阅事件，绑定监听函数
 * var subscription = pubsub.subscribe( "inbox/newMessage", function(topics, data) {
 *     console.log( "Logging: " + topics + ": " + data );
 * });
 *
 * // Publishers are in charge of publishing topics or notifications of
 * // interest to the application. e.g:
 * // 发布事件: 字符串
 * pubsub.publish( "inbox/newMessage", "hello world!" );
 *
 * // or 发布事件：array
 * pubsub.publish( "inbox/newMessage", ["test", "a", "b", "c"] );
 
 * // or 发布事件：object
 * pubsub.publish( "inbox/newMessage", {
 * sender: "hello@google.com",
 * body: "Hey again!"
 * });
 *
 * // 取消订阅
 * pubsub.unsubscribe( subscription );
 *
 */
((function(Service) {

    (function(myObject) {
        
        // Storage for topics that can be broadcast
        // or listened to
        var topics = {};
        
        // An topic identifier
        var subUid = -1;
        
        // Publish or broadcast events of interest
        // with a specific topic name and arguments
        // such as the data to pass along
        myObject.publish = function( topic, args ) {
            
            if ( !topics[topic] ) {
                return false;
            }
            
            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;
            
            while (len--) {
                subscribers[len].func( topic, args );
            }
            
            return this;
        };
        
        // Subscribe to events of interest
        // with a specific topic name and a
        // callback function, to be executed
        // when the topic/event is observed
        myObject.subscribe = function( topic, func ) {
            
            if (!topics[topic]) {
                topics[topic] = [];
            }
            
            var token = ( ++subUid ).toString();
            topics[topic].push({
                token: token,
                func: func
            });
            return token;
        };
        
        // Unsubscribe from a specific
        // topic, based on a tokenized reference
        // to the subscription
        myObject.unsubscribe = function( token ) {
            for ( var m in topics ) {
                if ( topics[m] ) {
                    for ( var i = 0, j = topics[m].length; i < j; i++ ) {
                        if ( topics[m][i].token === token ) {
                            topics[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return this;
        };

        // Remove all subscribers
        myObject.clear = function() {
            topics = {};
            subUid = -1;            
        };
        
    }(Service.$pubsub || (Service.$pubsub = {})));
    
})(Service));
