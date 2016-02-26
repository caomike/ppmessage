Service.$notifyFactory = ( function() {

    var TYPE = {
        AUTH: 'AUTH',
        ACK: 'ACK', // ack
        MSG: 'MSG', // message arrived
        ONLINE : 'ONLINE',
        SYS: 'SYS',
        TYPING : 'TYPING'
    },

        WHAT = {
            AUTH: "AUTH",
            SEND: 'SEND'
        };

    //////// API ///////////
    
    return {
        get: get
    }

    ////////////////////////

    function get ( $notifyService, msg ) {

        var type = findType( msg ),
            handler;

        switch ( type ) {
            
        case TYPE.MSG:
            handler = Service.$notifyMsg;
            break;

        case TYPE.ONLINE:
            handler = Service.$notifyOnline;
            break;

        case TYPE.TYPING:
            handler = Service.$notifyTyping;
            break;

        case TYPE.AUTH:
            handler = Service.$notifyAuth;
            break;

        case TYPE.SYS:
            handler = Service.$notifySys;
            break;

        default:
            handler = Service.$notifyUnknown;
            break;
        }

        return handler.get( $notifyService, msg.msg ? msg.msg : msg );
        
    }

    function findType ( msg ) {

        var t = msg.type;

        if ( t === TYPE.MSG )  { // fix 'LOGOUT' message

            if ( msg.msg.mt === TYPE.SYS ) {
                
                t = TYPE.SYS;
            }
            
        } else if ( t === TYPE.ACK ) {

            switch ( msg.what ) {

            case WHAT.AUTH:
                t = TYPE.AUTH;
                break;

            case WHAT.SEND:
                t = TYPE.MSG;
                break;
                
            }
            
        }

        return t;
        
    }
    
} )();
