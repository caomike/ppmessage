((function(Modal) {

    function ConversationContentModal(groupId) {
        
        var $api = Service.$api, // $api Service
            $json = Service.$json, // $json Service
            $tools = Service.$tools,

            id = groupId, // group identifier

            self = this,

            inMobile = Service.$device.isMobileBrowser(), // is in mobile

            isAddedWelcomeInfo = false,
            loadable = true, // can load history (has more historys)
            unreadCount = 0, // unread count associated with this group `id`

            // add PCWelcome msg
            getPCWelcomeMsg = function(appProfileInfo) {

                if (!appProfileInfo) return;
                
                var Builder = Service.PPMessage.Builder,

                    welcome = {
                        appTeamName: appProfileInfo.appTeamName,
                        appWelcomeText: appProfileInfo.appWelcomeText,
                        activeAdmins: appProfileInfo.activeAdmins
                    },

                    welcomeMsg = new Builder( 'WELCOME' )
                    .messageState( 'FINISH' )
                    .conversationId(Service.$tools.getUUID())
                    .welcomeBody(welcome)
                    .build()
                    .getBody();
                
                return welcomeMsg;
            },

            getMobileWelcomeMsg = function() { // add mobile welcome msg
                var Builder = Service.PPMessage.Builder,
                    // welcome text in mobile
                    welcomeText = Service.Constants.i18n('WELCOME_MSG'),
                    // welcome msg in mobile
                    welcomeMsg = new Builder('TEXT')
                    .messageState('FINISH')
                    .conversationId(Service.$tools.getUUID())
                    .textMessageBody(welcomeText)
                    .admin(true)
                    .userName(Service.Constants.i18n('DEFAULT_SERVE_NAME'))
                    .build()
                    .getBody();

                return welcomeMsg;
            },

            getWelcomeMsg = function ( welcomeInfo ) {
                
                // Welcome msg
                if (inMobile) {
                    return getMobileWelcomeMsg();
                } else {
                    // if welcomeInfo fetched from server is presented
                    if (welcomeInfo) {
                        return getPCWelcomeMsg(welcomeInfo);
                    }
                }
                
            },

            pushWelcomeMessage = function( messageArray, welcome ) {

                if ( welcome ) {
                    isAddedWelcomeInfo = true;
                    messageArray.push ( welcome );    
                }
                
                return messageArray;
            },

            getInitChatMessages = function() {
                return pushWelcomeMessage( [], getWelcomeMsg() );
            },
            
            chatMessages = getInitChatMessages(), // Store messages
            chatMessagesIds = [], // Cache messages Ids (for check is message exist) if message.id exist
            
            isMessageIdExist = function(messageId) {
                return $.inArray(messageId, chatMessagesIds) != -1;
            },
            isMessageExist = function(msg) { // Is message exist
                
                if (!msg.messageId) return false;
                
                return isMessageIdExist(msg.messageId);
            },

            DEFAULT_PAGE_SIZE = 20, // Default page size 
            loadMessageHistorysPageOffset = 0, // message history page offset
            loadMessageHistorysPageSize = DEFAULT_PAGE_SIZE, // current page size
            loadMessageHistorysMaxId = null, // max id
            loadMessageHistorys = function(conversationId, callback) { // get message historys by conversationId

                // conversation id is empty
                if (!conversationId) {
                    if (callback) callback([]);
                    return;
                }
                
                // get message history by api
                $api.getMessageHistory({
                    conversation_uuid: conversationId,
                    page_offset: loadMessageHistorysPageOffset,
                    page_size: loadMessageHistorysPageSize,
                    max_id: loadMessageHistorysMaxId
                }, function(response) { // On get message history success callback

                    // Update page offset and max id for next load
                    loadMessageHistorysPageOffset++;
                    loadMessageHistorysMaxId = loadMessageHistorysMaxId ? loadMessageHistorysMaxId : (response.list.length > 0 ? response.list[0].uuid : null);

                    // Convert response api message array to ppMessage array
                    var ppMessageArray = [];
                    (function apiMessageArrayToPPMessageArray(index, length, apiMessageArray, completeCallback) {

                        if (index < length) {
                            new Service.ApiMessageAdapter($json.parse(apiMessageArray[index].message_body))
                                .asyncGetPPMessage(function(ppMessage, succ) {
                                    
                                    // If not exist , add it 
                                    if (succ && !isMessageExist(ppMessage.getBody())) {
                                        ppMessageArray.push(ppMessage.getBody());
                                    }
                                    apiMessageArrayToPPMessageArray(index + 1, length, apiMessageArray, completeCallback);
                                });
                        } else {
                            // complete
                            if (completeCallback) completeCallback();
                        }
                        
                    })(0, response.list.length, response.list, function() {
                        
                        // apiMessageArray -> ppMessageArray completed
                        //
                        // HISTORY MESSAGE ORDER
                        // |     newer      | <-- big timestamp
                        // |     ......     |
                        // |     older      | <-- small timestamp
                        //
                        // We need to add history message timestamp to array here:
                        //
                        //
                        var messageHistorysWithTimestamp = addTimestampsToHistoryMessageArrays(ppMessageArray);
                        // Store message historys to `chatMessages`
                        unshiftMessageArrays(messageHistorysWithTimestamp);
                        if (callback) callback(messageHistorysWithTimestamp);
                        
                    });
                    
                }, function(error) { // On get message history error callback
                    if (callback) callback([]);
                });
                
            },

            DEFAULT_MESSAGE_TIMESTAMP_DELAY = 5 * 60, // 5 minutes

            messageTimestampDelay = DEFAULT_MESSAGE_TIMESTAMP_DELAY,

            // |     new-01     |
            // |     new-02     |
            // |     .....      |
            // |     new-xx     | <-- `lastMessageTimestamp`
            lastMessageTimestamp = null, // last message timestamp

            // |     old-01     |
            // |     old-02     |
            // |     ......     |
            // |     old-20     | <-- `historyMoreOldMessageTimestamp`
            historyMoreOldMessageTimestamp = null, // history more old message timestamp
            
            shouldAddMessageTimestamp = function(msg) {
                
                var lastTimestamp = lastMessageTimestamp,
                    newTimestamp = msg.messageTimestamp,
                    shouldUpdateLastTimestamp = Service.$messageToolsModule.isMessage(msg);

                // Update lastMessageTimestamp if need
                lastMessageTimestamp = shouldUpdateLastTimestamp ?
                    (newTimestamp ? newTimestamp : lastMessageTimestamp) : lastMessageTimestamp;

                if (!shouldUpdateLastTimestamp || !newTimestamp ) return false; // not a legal message
                
                if (!lastTimestamp) return true; // normally , if lastTimestamp is not set, meaning this message is the first message
                
                if (newTimestamp - lastTimestamp <= messageTimestampDelay) return false;

                return true;
            },

            // Return history message arrays with timestamps
            addTimestampsToHistoryMessageArrays = function(historyMessageArray) {
                if (!historyMessageArray) return historyMessageArray;

                // Empty, meaning we have reached the begining of the whole historys
                if (historyMessageArray.length === 0) {
                    if (historyMoreOldMessageTimestamp != null) {
                        historyMessageArray.push(buildTimestampMessage(historyMoreOldMessageTimestamp));
                        historyMoreOldMessageTimestamp = null; // Then , we reset to `null`
                    }
                    return historyMessageArray;
                }

                var resultArray = []; // store result

                var lastOne = historyMoreOldMessageTimestamp || historyMessageArray[0].messageTimestamp;
                $.each(historyMessageArray, function(index, item) {
                    
                    var shouldAdd = lastOne - item.messageTimestamp > messageTimestampDelay;
                    if (shouldAdd) {
                        resultArray.unshift(buildTimestampMessage(lastOne)); // push timestamp if need
                    }

                    resultArray.unshift(item); // push message

                    lastOne = item.messageTimestamp;
                });

                // Cache timestamp
                historyMoreOldMessageTimestamp = historyMessageArray[historyMessageArray.length - 1].messageTimestamp;
                
                return resultArray;
            },

            // add message arrays (generally: history message arrays) to head of `chatMessages` array
            // @description
            //     assume `chatMessages` = [a,b,c];
            //            `messageArrays` = [1,2,3,4,5];
            //
            //     result `chatMessages` would be `[1,2,3,4,5,a,b,c]`
            unshiftMessageArrays = function(messageArrays) {
                if (!messageArrays || messageArrays.length == 0) return;

                var reverseArr = messageArrays.slice().reverse(); // make a copy
                $.each(reverseArr, function(index, item) {
                    chatMessages.unshift(item);
                });
            },
            
            buildTimestampMessage = function(messageTimestamp) {

                var time = messageTimestamp * 1000,
                    timeStr = Service.Constants.I18N[Service.$language.getLanguage()].timeFormat(time);
                
                return new Service.PPMessage.Builder( 'TIMESTAMP' )
                    .id($tools.getUUID())
                    .timestampBody({
                        time: time,
                        timeStr: timeStr
                    })
                    .messageState( 'FINISH' )
                    .build()
                    .getBody();
                
            };

        // add a new messageId
        this.updateMessageIdsArray = function(messageId) {
            if (!isMessageIdExist(messageId)) {
                chatMessagesIds.push(messageId);   
            }
        };

        // Clear data
        this.clear = function() {
            chatMessages = [];
            chatMessagesIds = [];

            loadMessageHistorysPageOffset = 0;
            loadMessageHistorysMaxId = null;

            lastMessageTimestamp = null;
        };

        // load message history
        this.getConversationHistory = function(conversationId, callback) {
            loadMessageHistorys(conversationId, callback);
        };

        // Append a new messgae
        // @return if should append timestamp, return timestamp message, else null.
        this.addMessage = function(msg) {
            
            // message exist
            if (msg.messageId && isMessageExist(msg)) return null;

            // check and decide whether or not should add timestamp message
            var addTimestampMessage = shouldAddMessageTimestamp(msg);
            var timestampMsg = null;
            if (addTimestampMessage) {
                timestampMsg = buildTimestampMessage(msg.messageTimestamp);
                chatMessages.push(timestampMsg);
            }
            
            chatMessages.push(msg); // append it
            Service.$messageStore.map( msg.messageId, id ); // append it to global message store
            
            // append message id
            if (msg.messageId) self.updateMessageIdsArray(msg.messageId);

            return timestampMsg;
        };

        // find msg by msgId
        this.find = function ( msgId ) {
            if ( !isMessageIdExist( msgId ) ) return;

            var len = chatMessages.length;
            while( len-- ) {
                if ( chatMessages [ len ].messageId === msgId ) {
                    return chatMessages [ len ];
                }
            }
            return msgId;
        };

        // Is chat messages empty
        this.isEmpty = function() {
            return chatMessages.length == 0;
        };

        // get all messages
        this.getMessages = function() {
            return chatMessages;
        };

        // Can load more historys
        this.setLoadable = function(l) {
            loadable = l;
        };

        // Is historys loadable
        this.isLoadable = function() {
            return loadable;
        };

        // can add welcomeInfo
        this.canAddWelcomeInfo = function() {
            return this.isEmpty() && !isAddedWelcomeInfo;
        };

        // push welcome info
        this.addWelcomeInfo = function(welcomeInfo) {
            var welcome = getWelcomeMsg( welcomeInfo );
            pushWelcomeMessage( this.getMessages(), welcome );
            return welcome;
        };

        // -----------
        // UNREAD COUNT
        // -----------
        this.unreadCount = function() {
            return unreadCount;
        };

        this.incrUnreadCount = function() {
            unreadCount++;            
        };

        this.clearUnread = function() {
            unreadCount = 0;
        };

        this.token = function() {
            return id;
        };
    }

    Modal.ConversationContentModal = ConversationContentModal;
    
})(Modal));
