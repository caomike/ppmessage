Modal.$conversationContentGroup = (function() {

    var conversationContentArray = {
        // broadcast: modal of `broadcast`,
        // 
        // group_uuid_1: modal of `group_uuid_1`,
        // group_uuid_2: modal of `group_uuid_2`,
        // ...
    };

    return {
        get: get,
        set: set,
        exist: exist
    }

    function set( groupIdentifier, modal ) {
        
        if ( !modal ) throw new Error('Modal == null');
        if ( exist( groupIdentifier ) ) throw new Error('Modal ' + groupIdentifier + ' exist!');

        conversationContentArray [ groupIdentifier ] = modal;
    }

    // @param groupIdentifier:
    //            group_uuid or null('broadcast')
    //
    function get( groupIdentifier ) {
        
        var modal;
        if ( !exist( groupIdentifier ) ) {
            modal = conversationContentArray [ groupIdentifier ] = create( groupIdentifier );
        } else {
            modal = conversationContentArray [ groupIdentifier ];                
        }
        
        return modal;
    }

    function exist( groupIdentifier ) {
        return conversationContentArray [ groupIdentifier ] !== undefined;
    }

    function create( groupIdentifier ) {
        return new Modal.ConversationContentModal( groupIdentifier );
    }
    
})();
