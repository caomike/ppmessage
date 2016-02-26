Service.$msgStateReceiverFactory = ( function() {

    return {
        get: get
    }

    function get( ppMessageType ) {

        switch ( ppMessageType ) {

        case 'TEXT':
            return Service.$msgStateTextReceiver;

        case 'EMOJI':
            return Service.$msgStateEmojiReceiver;

        case 'FILE':
            return Service.$msgStateFileReceiver;

        case 'IMAGE':
            return Service.$msgStateImageReceiver;

        default:
            
            return {
                listen: function () {}
            }
            
        }
        
    }
    
} )();
