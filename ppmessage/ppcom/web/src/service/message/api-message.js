((function(Service) {

    function ApiMessage(apiMessageJsonBody) {

        var body = apiMessageJsonBody;
        
        this.getBody = function() {
            return body;
        };
        
    }

    ApiMessage.TYPE_OG = 'OG'; // group mode, policy is `group`
    ApiMessage.TYPE_AP = 'AP'; // No group, policy is `broadcast`

    function Builder(conversationId) {

        var basicApiMessage = {
            conversation_uuid: conversationId,
            to_uuid: '', // app_uuid or group_uuid
            to_type: '', // AP or OG
            conversation_type: Service.Constants.MESSAGE.TO_TYPE,
            message_type: Service.Constants.MESSAGE_TYPE.NOTI,
            message_subtype: '',
            from_uuid: '',
            device_uuid: '',

            // THE FOLLOWING THREE FILEDS ONLY WORKING FOR `SEND MESSAGE`
            uuid: '',
            from_type: 'DU',
            app_uuid: Service.$ppSettings.getAppUuid()
        };

        // `uuid`
        this.uuid = function( uuid ) {
            basicApiMessage.uuid = uuid;
            return this;
        };

        this.type = function(type) {
            basicApiMessage.message_subtype = type;
            return this;
        };

        // `ApiMessage.TYPE_OG`
        // `ApiMessage.TYPE_AP`
        this.toType = function(toType) {
            basicApiMessage.to_type = toType;
            return this;
        }

        this.toId = function(toId) {
            basicApiMessage.to_uuid = toId;
            return this;
        };

        this.fromUuid = function(fromUuid) {
            basicApiMessage.from_uuid = fromUuid;
            return this;
        };

        this.deviceUuid = function(deviceUuid) {
            basicApiMessage.device_uuid = deviceUuid;
            return this;
        };

        this.build = function() {

            var copy = $.extend({}, basicApiMessage, true);

            if ( !copy.to_uuid ) throw new Error ('to_uuid == null');
            if ( !copy.to_type ) throw new Error ('to_type == null');
            
            return new ApiMessage(copy);
        };
    }

    ApiMessage.Builder = Builder;
    Service.ApiMessage = ApiMessage;
    
})(Service));
