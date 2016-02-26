Service.$msgStateImageReceiver = (function() {

    return {
        listen: imageMessageStateChangeReceiver
    }

    function imageMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:
                
                body.message.image.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                
                View.$userImageMessage.onBeginUpload( body.messageId );
                
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                
                if (progress < 0) return;
                if (progress <= 100) {
                    $('#pp-uploading-bar-state-' + body.message.image.fileUploadId).css('width', progress + "%");
                }
                
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.image.fuuid = fileId;
                body.message.image.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId);

                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.image.fileUploadId).hide();
                break;

            case STATE.UPLOAD_FAIL:
                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.image.fileUploadId).hide();
                break;

            case STATE.SEND_DONE:
                View.$userImageMessage.onSendDone(body.messageId, body.message.image.fileServerUrl);
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                View.$userImageMessage.onSendFail(body.messageId, body.extra.errorDescription);
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();
