Service.$notifyOnline = (function () {

    return {
        get: onlineMessageDispatcher
    }

    function onlineMessageDispatcher ( $notifyService, onlineMessage ) {

        return {
            dispatch: dispatch
        }

        function dispatch () {
            onlineMessage && Service.$pubsub.publish ( 'ws/online', onlineMessage );
        }
        
    }
    
})();
