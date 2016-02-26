Service.$msgStateFileReceiver = (function() {

    return {
        listen: fileMessageStateChangeReceiver
    }

    function fileMessageStateChangeReceiver( messageIdentifier ) {

        var subscriber = Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function( topics, data ) {

            var body = data.body,
                STATE = Service.$messageSender.$messageStateBroadcast.STATE,
                fileSelector = '#pp-conversation-part-file-by-user-o2-' + body.messageId;

            switch ( data.state ) {

            case STATE.BEGIN_UPLOAD:
                
                body.message.file.fileUploadId = data.stateInfo.uploadTaskId;

                Ctrl.$conversationContent.appendMessage( body );
                
                View.$composerContainer.focus();
                $(fileSelector).css({ 'opacity': 0.6 });
                break;

            case STATE.UPLOADING:
                var progress = data.stateInfo.uploadProgress;
                if (progress < 0) return;
                if (progress <= 100) {
                    $('#pp-uploading-bar-state-' + body.message.file.fileUploadId).css('width', progress + "%");
                }
                break;

            case STATE.UPLOAD_DONE:
                var fileId = data.stateInfo.fileId;
                
                body.message.file.fuuid = fileId;
                body.message.file.fileServerUrl = Service.$tools.getFileDownloadUrl(fileId, body.message.file.fileName);

                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.file.fileUploadId).hide();
                break;

            case STATE.UPLOAD_FAIL:
                // Hide upload bar
                $('#pp-uploading-bar-outer-' + body.message.file.fileUploadId).hide();
                break;

            case STATE.SEND_DONE:
                $('#pp-conversation-part-file-by-user-o2-' + body.messageId).css({
                    'opacity': 1.0
                });
                if (body.message.file.fileServerUrl) {
                    $('#pp-conversation-part-file-by-user-a-' + body.messageId)
                        .attr('href', body.message.file.fileServerUrl);   
                }
                Service.$pubsub.unsubscribe( subscriber );
                break;

            case STATE.SEND_FAIL:
                $('#pp-conversation-part-file-by-user-timestamp-' + body.messageId)
                    .text(body.extra.errorDescription).css({
                        'color': 'red',
                        'display': 'block'
                    });
                Service.$pubsub.unsubscribe( subscriber );
                break;
            }
            
        } );
        
    }
    
})();
