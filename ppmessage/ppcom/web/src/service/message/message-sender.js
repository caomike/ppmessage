// @ducumentation at the end of the file
Service.$messageSender = ( function() {

    var $messageStateBroadcast = messageStateBroadcast(),

        STATE = $messageStateBroadcast.STATE,

        DEFAULT = {

            // should upload
            upload: false,

            // file/txt
            uploadType: 'file',

            // put your upload content here
            uploadContent: null //file / 'large text'
            
        };
    
    //////// API ////////////
    return {
        $messageStateBroadcast: $messageStateBroadcast,
        
        send: send,
        notifySendDone: notifySendDone,
        notifySendFail: notifySendFail
    }

    /////// Implentation ////////////
    function send( ppMessage, settings ) {
        
        // make a copy
        var set = $.extend({}, DEFAULT, settings),
            jsonBody = ppMessage.getBody();
        
        // notify we are build message finish
        onBuildMessageFinish( jsonBody, set, jsonBody.conversation.uuid );
        
        if (set.upload) {
            onBeginUpload( jsonBody, set);
        } else {
            sendToServer( jsonBody, set);
        }   
    }

    function onBuildMessageFinish(ppMessage, settings, conversationId) {
        // update ppMessage body
        ppMessage.messageConversationId = conversationId;
        ppMessage.messageIsConversationValid = !!conversationId;

        // callback
        broadcastHelper( ppMessage, STATE.BUILD_DONE, {
            conversationId: conversationId
        } );
    }

    function onBeginUpload(ppMessage, settings) {
        
        // upload file will get local upload file id
        var $fileUploader = Service.$uploader,
            
            UPLOAD_ERROR_CODE = Service.Uploader.ERROR_CODE,
            uploadContent = settings.uploadContent,
            uploadType = settings.uploadType,

            i18n = Service.Constants.i18n,
            
            uploadFileId = $fileUploader.upload({
                type: uploadType,
                content: uploadContent
            }).progress(function(percentage) {
                
                // uploading ...
                broadcastHelper( ppMessage, STATE.UPLOADING, {
                    uploadProgress: percentage
                } );
                
            }).done(function(response) {
                // onEndUpload callback
                onUploadDone(ppMessage, settings, response.fuuid);
                
            }).fail(function(errorCode) {
                
                // Upload failed
                ppMessage.messageState = 'ERROR';
                
                switch (errorCode) {

                case UPLOAD_ERROR_CODE.SERVICE_NOT_AVALIABLE:
                    ppMessage.extra.errorDescription = i18n('SERVICE_NOT_AVALIABLE');
                    break;

                case UPLOAD_ERROR_CODE.CANCEL:
                    ppMessage.extra.errorDescription = i18n('CANCELED');
                    break;

                }
                
                onUploadFail(ppMessage, settings);
            }).query().uploadId;
        
        // begin upload
        broadcastHelper( ppMessage, STATE.BEGIN_UPLOAD, {
            uploadTaskId: uploadFileId
        } );

    }

    function onUploadFail(ppMessage, settings) {
        broadcastHelper( ppMessage, STATE.UPLOAD_FAIL );
        // on upload fail, send it to server
        sendToServer( ppMessage, settings );
    }

    function onUploadDone(ppMessage, settings, fileId) {
        broadcastHelper( ppMessage, STATE.UPLOAD_DONE, {
            fileId: fileId
        } );
        // on upload done, send it to server
        sendToServer(ppMessage, settings);
    }

    function sendToServer(ppMessage, settings) {

        //check message is valid
        if ( !ppMessage.messageIsConversationValid || ppMessage.messageState === 'ERROR') {
            onSendFail( ppMessage, settings );
            return;
        }
        
        //send actually data
        var apiMessageJsonBody = new Service.PPMessageAdapter( ppMessage ).getApiMessageBody();

        try {
            
            //send by `WebSocket`    
            Service.$notifyMsg.get( Service.$notification, apiMessageJsonBody ).send();
            
        } catch ( e ) {
            
            // Try send message from `api` channel
            Service.$api.sendMessage( apiMessageJsonBody, function(response) {
                onSendSuccess( ppMessage, settings, response );
            }, function(error) {
                onSendFail( ppMessage, settings );
            });
            
        }

    }

    function onSendSuccess(ppMessage, settings, response) {
        
        // update ppMessage state when send success
        ppMessage.messageState = 'FINISH';

        // generally `response` if exist, we consider this message was send by `api`, not by `ws`
        if ( response ) {
            updateMessageStateOnSendSucc( ppMessage, response );
        }
        
        broadcastHelper( ppMessage, STATE.SEND_DONE );
    }

    function updateMessageStateOnSendSucc(ppMessage, response) {
        var messageId = response.task;
        ppMessage [ 'messageRawData' ] = {
            id: messageId,
            ts: response.ts
        };

        // NOTE: We need add the new message-id which generated from server to local array here,
        // to prevent duplicate message
        Modal.$conversationContentGroup
            .get(ppMessage.conversation.uuid)
            .updateMessageIdsArray(messageId);
    }

    function onSendFail(ppMessage, settings) {
        ppMessage.messageState = 'ERROR';
        
        // Error , check errorDescription
        var errorDesc = ppMessage.extra.errorDescription;
        if (!errorDesc) errorDesc = Service.Constants.i18n('SEND_ERROR');
        ppMessage.extra.errorDescription = errorDesc;
        
        broadcastHelper( ppMessage, STATE.SEND_FAIL );
    }

    function notifySendDone( msgId ) {
        var ppMessage = Service.$messageStore.find( msgId );
        if ( ppMessage ) {
            onSendSuccess( ppMessage );            
        }
    }

    function notifySendFail( msgId ) {
        var ppMessage = Service.$messageStore.find( msgId );
        if ( ppMessage ) {
            onSendFail( ppMessage );
        }
    }

    function broadcastHelper( ppMessage, state, stateInfo ) {
        $messageStateBroadcast.broadcast( ppMessage.messageId, {
            body: ppMessage,
            state: state,
            stateInfo: stateInfo || {}
        } );
    }

    /////// Message State Broadcast ///////////

    function messageStateBroadcast() {

        var STATE = {
            
            BUILD_DONE: 'BUILD_DONE',
            BEGIN_UPLOAD: 'BEGIN_UPLOAD',
            UPLOADING: 'UPLOADING',
            UPLOAD_DONE: 'UPLOAD_DONE',
            UPLOAD_FAIL: 'UPLOAD_FAIL',
            SEND_DONE: 'SEND_DONE',
            SEND_FAIL: 'SEND_FAIL'
            
        };

        return {
            STATE: STATE,
            broadcast: broadcast
        }

        // @param `data`:
        //     {
        //         body: `ppMessageJsonBody`,
        //         state: xxx,
        //         stateInfo: { xxx }
        //     }
        function broadcast( messageIdentifier, data ) {

            Service.$pubsub.publish( 'msg/send/' + messageIdentifier, data );
            
        }
        
    }

    
} )();

////////////////////////////
//// Documentation /////////
////////////////////////////

// - How to listen message send states change event:

// Service.$pubsub.subscribe( 'msg/send/' + messageIdentifier, function ( topics, data ) {

//     var sendState = data.state,
//         stateInfo = data.stateInfo, // new state info will be stored at `data.stateInfo`
//         ppMessageJsonBody = data.body;

//     switch ( sendState ) {

//     case 'BUILD_FINISH':
//         // the message body is build finish, generally meaning it get a `conversation_id` which required by server-side
//         var conversationId = stateInfo.conversationId;
//         break;

//     case 'BEGIN_UPLOAD':
//         // 'file'/'large-txt' need upload
//         var uploadTaskId = stateInfo.uploadTaskId;
//         break;

//     case 'UPLOADING':
//         // 0 ~ 100
//         var uploadProgress = stateInfo.uploadProgress;
//         break;

//     case 'UPLOAD_DONE':
//         var fileId = stateInfo.fileId; // `fileId` returned by server-side
//         break;

//     case 'UPLOAD_FAIL':
//         break;

//     case 'SEND_DONE':        
//         break;

//     case 'SEND_FAIL':
//         break;

//     }

// });
