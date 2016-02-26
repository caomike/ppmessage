((function(Service) {

    var textMessageSendSettings = (function() {

        function buildSettings(body) {

            var text = body.message.text.body,
                overflow = Service.$messageToolsModule.isTextLengthLargerThan128( text ),
                upload = body.messageIsConversationValid && overflow;
            
            return {
                
                upload: upload,
                uploadType: 'txt',
                uploadContent: text
                
            };
            
        }
        
        return {

            build: buildSettings
            
        }
        
    })();

    Service.$textMessageSendSettings = textMessageSendSettings;
    
})(Service));
