((function(Service) {

    function PPMessage(ppMessageJsonBody) {

        var body = ppMessageJsonBody;

        //----------------------
        // Set info
        //----------------------

        this.setConversationId = function(conversationId) {
            body.messageConversationId = conversationId;
            return this;
        };

        this.setConversationIdValid = function(valid) {
            body.messageIsConversationValid = valid;
            return this;
        };

        this.setMessageState = function(state) {
            body.messageState = state;
            return this;
        };

        this.setRawData = function(data) {
            body.messageRawData = data;
            return this;
        };

        //----------------------
        // Get Info
        //----------------------

        this.isConversationValid = function() {
            return body.messageIsConversationValid;
        };

        this.getBody = function() {
            return body;
        };

        this.getMessageState = function() {
            return body.messageState;
        };

        this.getMessageSummary = function() {
            return PPMessage.getMessageSummary( body );
        };

        //----------------------
        // Send information
        //----------------------

        this.send = function() {
            
            // Send message callback
            var settings = Service.$sendSettingsFactory.get( body );
            Service.$msgStateReceiverFactory.get( body.messageType ).listen( body.messageId );
            Service.$messageSender.send( this, settings );

        };
    }

    // supported types now
    PPMessage.TYPE = {
        TEXT: 'TEXT',
        EMOJI: 'EMOJI',
        IMAGE: 'IMAGE',
        FILE: 'FILE',
        AUDIO: 'AUDIO',
        
        WELCOME: 'WELCOME',
        TIMESTAMP: 'TIMESTAMP'
    };

    // TO_TYPE
    //
    // @see ApiMessage.TYPE_OG
    //      ApiMessage.TYPE_AP
    PPMessage.TO_TYPE = {
        AP: 'AP',
        OG: 'OG'
    };

    // static method
    // get message summary
    PPMessage.getMessageSummary = function( ppMessageJsonBody ) {

        var summary = "",
            message = ppMessageJsonBody,
            TYPE = PPMessage.TYPE,
            i18n = Service.Constants.i18n;

        if (!message || !message.messageType) return ""; //messageType not exist !
        
        switch(message.messageType) {
        case TYPE.TEXT:
            summary = message.message.text.body;
            break;
            
        case TYPE.EMOJI:
            summary = message.message.emoji.code;
            break;

        case TYPE.FILE:
            summary = '[' + i18n('FILE') + ': ' + message.message.file.fileName + ']';
            break;

        case TYPE.IMAGE:
            summary = '[' + i18n('IMAGE') + ']';
            break;

        case TYPE.AUDIO:
            summary = '[' + i18n('AUDIO') + ']';
            break;

        case TYPE.WELCOME:
            summary = '';
            break;

        default:
            summary = "";
            break;
        }

        return summary;
    };

    function Builder(messageType) {

        var ppMessage = {
            messageId: Service.$tools.getUUID(),
            messageTimestamp: Date.now() / 1000,
            messageType: messageType,
            messageToType: Service.$messageToolsModule.toType(), // detect toType by different policy
            messageState: 'SENDING',
            messageConversationId: '',
            messageIsConversationValid: true,
            messageRawData: '',
            extra: {
                errorDescription: '',
                description: ''
            },
            message: {
                text: {},
                file: {},
                image: {},
                welcome: {},
                emoji: {},
                audio: {},
                timestamp: {
                    time: Date.now()
                }
            },
            user: {
                id: null,
                admin: false,
                name: '',
                avatar: Service.Constants.ICON_DEFAULT_USER
            },
            conversation: undefined
        };

        //----------------------
        //BASIC INFO
        //----------------------
        
        this.id = function(id) {
            ppMessage.messageId = id;
            return this;
        };

        this.timestamp = function(timestamp) {
            ppMessage.messageTimestamp = timestamp;
            return this;
        };

        this.toType = function(toType) {
            ppMessage.messageToType = toType;
            return this;
        };

        this.conversationId = function(conversationId) {
            ppMessage.messageConversationId = conversationId;
            return this;
        };

        this.conversationIsValid = function(valid) {
            ppMessage.messageIsConversationValid = valid;
            return this;
        };

        this.rawData = function(rawData) {
            ppMessage.messageRawData = rawData;
            return this;
        };

        this.messageState = function(messageState) {
            ppMessage.messageState = messageState;
            return this;
        };

        this.extraDescription = function(description) {
            ppMessage.extra.description = description;
            return this;
        };

        this.conversation = function( conversation ) {
            ppMessage.conversation = conversation;
            return this;
        };

        //----------------------
        //USER
        //----------------------
        
        this.admin = function(isAdmin) {
            ppMessage.user.admin = isAdmin;
            return this;
        };

        this.userName = function(name) {
            ppMessage.user.name = name;
            return this;
        };

        this.userIcon = function(icon) {
            ppMessage.user.avatar = icon;
            return this;
        };

        this.userId = function(userId) {
            ppMessage.user.id = userId;
            return this;
        };

        //----------------------
        //WELCOME
        //----------------------

        /**
         * the param `welcomeBody` is something like the following structure: 
         *
         * {
         *     appTeamName: 'ppMessage', 
         *     appWelcomeText: 'Hello boy!', 
         *     activeAdmins: [
         *         {name: 'jin.he', avatar: 'aa.png'},
         *         {name: 'kun.zhao', avatar: 'bb.png'},
         *         ...
         *     ]
         * }
         */
        this.welcomeBody = function(welcomeBody) {
            ppMessage.message.welcome = welcomeBody;
            return this;
        };

        //----------------------
        //EMOJI
        //----------------------
        
        this.emojiMessageCode = function(code) {
            ppMessage.message.emoji.code = code;
            return this;
        };

        //----------------------
        //TEXT
        //----------------------
        
        this.textMessageBody = function(text) {
            ppMessage.message.text.body = text;
            return this;
        };

        //----------------------
        //FILE
        //----------------------

        /**
         * the param `fileBody` is something like the following structure:
         */
        this.fileBody = function(fileBody) {
            ppMessage.message.file = fileBody;
            return this;
        };

        this.fileMessageLocalUrl = function(fileLocalUrl) {
            ppMessage.message.file.fileUrl = fileLocalUrl;
            return this;
        };

        this.fileMessageName = function(fileName) {
            ppMessage.message.file.fileName = fileName;
            return this;
        };

        this.fileMessageServerUrl = function(fileServerUrl) {
            ppMessage.message.file.fileServerUrl = fileServerUrl;
            return this;
        };

        //----------------------
        //IMAGE
        //----------------------
        
        /**
         * the params `imageBody` is something like the following structure:
         */
        this.imageBody = function(imageBody) {
            ppMessage.message.image = imageBody;
            return this;
        };

        this.imageMessageUrl = function(imageUrl) {
            ppMessage.message.image.url = imageUrl;
            return this;
        };

        //----------------------
        //AUDIO
        //----------------------
        
        this.audio = function( config ) {
            ppMessage.message.audio = new PPMessage.Audio( config );
            return this;
        };

        //----------------------
        //TIMESTAMP
        //----------------------

        this.timestampBody = function(timestampBody) {
            ppMessage.message.timestamp = timestampBody;
            return this;
        };

        //Build PPMessage
        this.build = function() {
            
            // make a copy
            var copy = $.extend({}, ppMessage, true);
            if ( copy.conversation === undefined ) {
                copy.conversation = Service.$conversationManager.activeConversation();   
            }

            return new PPMessage(copy);
        };
        
    }

    PPMessage.Builder = Builder;
    Service.PPMessage = PPMessage;
    
})(Service));
