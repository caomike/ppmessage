((function(Service) {

    var imageMessageSendSettings = (function() {

        function buildSettings(body) {
            
            return {

                upload: true,
                uploadContent: body.message.image.file

            };
            
        }
        
        return {
            build: buildSettings
        }
        
    })();

    Service.$imageMessageSendSettings = imageMessageSendSettings;
    
})(Service));
