((function(Service) {

    var fileMessageSendSettings = (function() {
        
        function buildSettings(body) {

            return {
                upload: true,
                uploadContent: body.message.file.file
            };
            
        }
        
        return {
            build: buildSettings
        }
        
    })();

    Service.$fileMessageSendSettings = fileMessageSendSettings;
    
})(Service));
