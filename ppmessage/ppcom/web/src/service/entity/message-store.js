// @description
//    global message pool store `send` and `received` messages, instead of `history` messages
Service.$messageStore = ( function() {

    var msgGroupIdToMsgIdMap = {
        // msg-id-1: msg-group-id,
        // msg-id-2: msg-group-id
        // ...
    };

    /////// API /////////
    
    return {
        map: map,
        find: find
    }

    /////// Implementation ///////

    function map( msgId, msgGroupId ) {
        msgGroupIdToMsgIdMap [ msgId ] = msgGroupId;
    }

    // Find `ppMessageJsonBody` by `messageId`
    function find( messageId ) {
        if ( !messageId ) return;

        var groupId = msgGroupIdToMsgIdMap [ messageId ],
            ppMessage;
        
        if ( groupId ) {
            var conversationContentModal = Modal.$conversationContentGroup.get( groupId );

            if ( conversationContentModal ) {
                ppMessage = conversationContentModal.find( messageId );
            }
        }

        return ppMessage;
    }
    
} )();
