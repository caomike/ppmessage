((function(Service) {

    var factory = (function() {

        var build = function(ppMessageJsonBody) {
            var body = ppMessageJsonBody;
            
            sendSettings = function(){
                
                switch (body.messageType) {
                case 'TEXT':
                    return Service.$textMessageSendSettings.build(body);
                    
                case 'EMOJI':
                    return Service.$emojiMessageSendSettings.build(body);
                    
                case 'IMAGE':
                    return Service.$imageMessageSendSettings.build(body);

                case 'FILE':
                    return Service.$fileMessageSendSettings.build(body);
                }
            }();

            return sendSettings;
        };
        
        return {
            get: build
        }
        
    })();

    Service.$sendSettingsFactory = factory;
    
})(Service));
