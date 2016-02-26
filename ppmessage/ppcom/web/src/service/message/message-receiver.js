/**
 *
 * @description: 
 *
 * 1. messageBox not visible (launcher is showing):
 *     publish('msgArrived/launcher', ppMessageJsonBody);
 *
 * 2. messageBox visible:
 *
 *     2.1 in chating panel and you are chatting with `group_id`:
 *         publish('msgArrived/chat', ppMessageJsonBody);
 *
 *     2.2 in group list panel:
 *         publish('msgArrived/group', ppMessageJsonBody);
 *
 */
Service.$messageReceiverModule = (function() {

    var isGroupOnChatting = function ( groupUUID ) {

        return groupUUID &&
            View.$conversationContentContainer.visible() &&
            !Ctrl.$launcher.get().isLauncherShow() && // launcher is not visible
            Service.$conversationManager.activeConversation() && Service.$conversationManager.activeConversation().uuid === groupUUID;
        
    },

        getModal = function ( groupUUID ) {
            return Modal.$conversationContentGroup.get( groupUUID );
        },

        onNewMessageArrived = function(topics, ppMessage) {
            
            var $pubsub = Service.$pubsub,
                body = ppMessage.getBody(),
                groupId = body.conversation.uuid;

            if ( isGroupOnChatting ( groupId ) ) { // we are chating with `groupId`

                $pubsub.publish('msgArrived/chat', ppMessage);
                
            } else {

                // store message && record unread count
                var modal = getModal ( groupId );
                modal.addMessage ( body );
                modal.incrUnreadCount();
                Ctrl.$sheetheader.incrUnread();

                if ( Ctrl.$launcher.get().isLauncherShow() ) { // launcher is showing
                    
                    $pubsub.publish('msgArrived/launcher', ppMessage);
                    
                } else if (View.$groupContent.visible()) { // group list is showing ( only working in `group` policy )
                    
                    $pubsub.publish('msgArrived/group', ppMessage);
                    
                }
                
            }

        },

        // Start me by call this method !
        // settings: {user_uuid: xxxx, device_uuid: xxxx}
        start = function(settings) {

            if (!settings) return;

            // Initialization notification by user_uuid and device_uuid, and start it !
            Service.$notification.init({
                user_uuid: settings.user_uuid,
                device_uuid: settings.device_uuid,
                app_uuid: settings.app_uuid
            }).start();

            // Subscribe newMessageArrivced event
            Service.$pubsub.subscribe("ws/msg", onNewMessageArrived);
        };
    
    return {
        start: start
    };
    
})();
