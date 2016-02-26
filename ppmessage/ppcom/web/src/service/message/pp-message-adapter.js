/**
 * 对 PPMessage 进行适配，使其能够返回 apiMessage 的数据结构表示
 *
 * var apiMessageJsonBody = new PPMessageAdapter(ppMessageJsonBody).getApiMessageBody();
 *
 */
((function(Service) {

    function PPMessageAdapter(ppMessageJsonBody) {        

        var $json = Service.$json,
            $messageToolsModule = Service.$messageToolsModule,
            data = ppMessageJsonBody,

            getMessageType = function(ppMessageBody) {
                var type = '',
                    msg = ppMessageBody;
                
                switch(msg.messageType) {
                case Service.Constants.MESSAGE.TYPE_EMOJI:
                    type = Service.Constants.MESSAGE_SUBTYPE.TEXT;
                    break;

                case Service.Constants.MESSAGE.TYPE_TEXT:
                    type = $messageToolsModule.isMessageTextOverflow(msg) ? Service.Constants.MESSAGE_SUBTYPE.TXT : Service.Constants.MESSAGE_SUBTYPE.TEXT;
                    break;
                    
                case Service.Constants.MESSAGE.TYPE_FILE:
                    type = Service.Constants.MESSAGE_SUBTYPE.FILE;
                    break;

                case Service.Constants.MESSAGE.TYPE_IMAGE:
                    type = Service.Constants.MESSAGE_SUBTYPE.IMAGE;
                    break;
                }

                return type;
            },

            getMessageFileType = function(msg) {
                var type = '';
                var DEFAULT = 'application/octet-stream';
                switch(msg.messageType) {
                case 'FILE':
                    type = msg.message.file.file.type || DEFAULT;
                    break;

                case 'IMAGE':
                    type = msg.message.image.file.type || DEFAULT;
                    break;

                case 'TEXT':
                    type = msg.message.image.file.type || DEFAULT;
                    break;

                default:
                    type = DEFAULT;
                }

                return type;
            },

            getMessageToType = function() {
                return data.messageToType;
            };

        /**
         * get apiMessage body
         */
        this.getApiMessageBody = function() {

            var apiMessage = new Service.ApiMessage.Builder(data.messageConversationId)
                .uuid(data.messageId)
                .type(getMessageType(data))
                .toType(getMessageToType())
                .toId( data.conversation.token )
                .fromUuid(Service.$user.getUser().getInfo().user_uuid)
                .deviceUuid(Service.$user.getUser().getInfo().device_uuid)
                .build()
                .getBody();
            
            switch(data.messageType) {
            case 'TEXT':
                var body = {
                    fid: data.message.text.fuuid
                };
                apiMessage['message_body'] = $messageToolsModule.isMessageTextOverflow(data) ? $json.stringify(body) : data.message.text.body;
                break;

            case 'EMOJI':
                apiMessage['message_body'] = data.message.emoji.code;
                break;

            case 'FILE':
                var body = {
                    fid: data.message.file.fuuid,
                    mime: getMessageFileType(data)
                };
                apiMessage['message_body'] = $json.stringify(body);
                break;

            case 'IMAGE':
                var body = {
                    fid: data.message.image.fuuid,
                    mime: getMessageFileType(data)
                };
                apiMessage['message_body'] = $json.stringify(body);
                break;
            }
            
            return apiMessage;    
        };
        
    }

    Service.PPMessageAdapter = PPMessageAdapter;
    
})(Service));
