//
// $conversationContent ----( conversation_uuid )-----> [ modal - 1 ,
//                                                        modal - 2 ,
//                                                        modal - 3 ,
//                                                        ...       ]
//
// $conversationContent.init(); // call only once
//
Ctrl.$conversationContent = (function() {

    var self = this,

        DEFAULT_SHOW_TIMEOUT = 200,

        activeConversation, // VERY VERY IMPORTANT

        selector = '#pp-conversation-content',
        conversationSelector = 'pp-conversation',

        // call once
        init = function() {

            // on new message arrived
            Service.$pubsub.subscribe('msgArrived/chat', function(topics, ppMessage) {

                var body = ppMessage.getBody(),
                    groupId = body.conversation.uuid;

                appendMessage( body );
                View.$conversationContent.scrollToBottom();    
                
            });

            // some one typing ...
            Service.$pubsub.subscribe('ws/typing', function ( topics, typingMessage ) {

                // We are in chatting panel and the `conversation_uuid` equal current chatting group
                // We only watching the current chatting conversation and unwatch it immediately once close current conversation
                if ( View.$conversationContentContainer.visible() ) {

                    var conversationId = getConversationId();
                    if ( conversationId ) {
                        
                        var EVENT_ID = 'typing', // default typing event identifier
                            eventId = EVENT_ID, // typing event identifier

                            oldHeaderTitle,
                            $sheetHeaderCtrl = Ctrl.$sheetheader,
                            setHeaderTitle = View.$sheetHeader.setTitle, // We only change title in `view`, not affect the `modal`
                            getHeaderTitle = $sheetHeaderCtrl.getHeaderTitle; // so `getHeaderTitle` always return the origin header title

                        Service.$schedule
                            .schedule(function() {
                                oldHeaderTitle = getHeaderTitle();
                                setHeaderTitle(Service.Constants.i18n('TYPING'));
                            }, eventId )
                            .after(function() {
                                setHeaderTitle(oldHeaderTitle);
                            })
                            .onCancel(function() {
                                setHeaderTitle(oldHeaderTitle);
                            })
                            .start();
                        
                    }
                    
                }
                
            });

            // user online or offline
            Service.$pubsub.subscribe ( 'ws/online', function ( topics, onlineMessage ) {
                // `user_uuid` may not exist, may be `welcome info` is downloading or some other reasons
                if (!Service.$users.exist(onlineMessage.user_uuid)) {
                    return;
                }
	            if (onlineMessage.mobile == "UNCHANGED" && onlineMessage.browser == "UNCHANGED") {
                    return;
	            }
                var user = Service.$users.getUser(onlineMessage.user_uuid).getInfo();
                if (onlineMessage.mobile != "UNCHANGED") {
                    user.is_mobile_online = (onlineMessage.mobile=="ONLINE");
                }
                if (onlineMessage.browser != "UNCHANGED") {
                    user.is_browser_online = (onlineMessage.browser=="ONLINE");
                }
                var is_online = user.is_mobile_online || user.is_browser_online;
                if (is_online !== user.is_online) {
                    Service.$users.getUser(user.user_uuid).update({user_uuid: user.user_uuid, is_online: is_online});
                }
            });
            
            return this;
        },

        // get modal associated with `conversationId`
        // @param `conversationId` is @optional
        getModal = function( conversationId ) {
            var uuid = conversationId || getConversationId();
            return uuid && Modal.$conversationContentGroup.get( uuid );
        },

        prependMessages = function(msgs, callback) { // add msgs(message array) at head

            var chatBox = $(selector),
                
                // Store current scrollPosition
                scrollPosition = chatBox[0].scrollHeight,

                html = '';
            
            $.each(msgs, function(index, item) {
                html += new View.PPConversationPart(msgs[index]).getElement()[0].outerHTML;
            });

            chatBox.prepend(html);
            chatBox.scrollTop(chatBox[0].scrollHeight - scrollPosition);
            
            if (callback) callback();
        },

        loadHistorys = function(beforeUpdateViewCallback, completeCallback) {

            var conversationId = getConversationId();

            if ( conversationId ) {
                
                // load history
                getConversationHistory( conversationId, function( list ) {

                    if (beforeUpdateViewCallback) beforeUpdateViewCallback();

                    // tell modal is can load more historys
                    getModal() && getModal().setLoadable(list.length > 0);
                    
                    // update view
                    prependMessages(list, function() {
                        if (completeCallback) completeCallback(list); 
                    });
                });
                
            }
            
        },

        // TODO:
        // 'click' event will conflict with 'onStartMove' event
        onConversationContentClicked = function() { // 'click' event

            Ctrl.$emojiSelector.get().showSelector(false); // hide emoji-selector panel
            Ctrl.$groupMembers.hide(); // hide `group-members` if exist

            if (Service.$device.isMobileBrowser()) { // hide keyboard if on mobile browser
                View.$composerContainer.blur();
            }
            
        },
    
        getConversationHistory = function( conversationId, callback ) {
            getModal().getConversationHistory( conversationId, callback );
        },

        /**
         * 聊天信息初始化
         */
        onConversationContentInit = function() {
            // add pull to refresh button to get history
            // 
            // There seems like some bug in `pulltorefresh.jquery.js` library, in mobile browser, when click `conversation-content` element,
            // it will never trigger `click` event, instead of, if not trigger `move` event, will end up with trigger `end` event,
            // so we trigger `click` event when `end` event callback happens on this situtation.
            $(selector).append(View.$pulltoRefresh.build().getHTML());
        },

        /**
         * Append Message at tail
         */
        appendMessage = function( message ) {

            var modal = getModal( message.conversation.uuid );
            
            if ( modal ) {
                var timestampMsg = modal.addMessage(message);
                if ( timestampMsg ) {
                    $(selector).append(new View.PPConversationPartTimestamp( timestampMsg ).getElement()[0].outerHTML);
                }
                $(selector).append(new View.PPConversationPart( message ).getElement()[0].outerHTML);                
            }

        },

        // push a new messageid to messageIdArrays for message duplicate check
        updateMessageIdsArray = function( messageId ) {
            getModal() && getModal().updateMessageIdsArray(messageId);
        },

        // show conversation-content panel with callback
        //
        // @param settings:
        // {
        //     delay: 200,
        //     fadeIn: true/false, default: true
        // }
        show = function( conversation, settings, callback) {
            var delay = ( settings && settings.delay && settings.delay ) || DEFAULT_SHOW_TIMEOUT,
                fadeIn = ( settings && settings.fadeIn && settings.fadeIn ) || true,

                showCallback = function() {// Make callback
                    $timeout(function() {

                        // replace origin `click` event to pulltorefresh.js
                        Ctrl.$pulltoRefreshController
                            .get( Ctrl.$conversationContent )
                            .loadable(isLoadable())
                            .onend( onConversationContentClicked )
                            .bindEvent();

                        // When the user second pressed `launcher` to open PPCom,
                        // then the keyboard will cover the textarea in mobile browser,
                        // currently, the best way is let the user trigger `focus` event manually
                        if (!Service.$device.isMobileBrowser()) {
                            View.$composerContainer.focus();
                        }
                        
                        // show
                        View.$conversationContentContainer.show( fadeIn );

                        // callback
                        if (callback) callback();                
                    }, delay);
                };

            // We need to disable body scroll, so let textarea move up correctly on iPhone/iPod... devices when focus,
            // avoid move up too high
            // @see `sheetheaderctrl.js` `minimize` methods
            if (Service.$device.isIOS()) {
                Service.$device.disableScroll();
            }

            // Make sure `conversation` is ok, and really exist
            if ( conversation && conversation.token ) {

                var old = activeConversation;

                if ( old !== conversation ) {
                    onHide( old ); // `onHide` old conversation
                    onStart( conversation ); // `onStart` new conversation
                } else {
                    onResume( conversation ); // same conversation call `onResume` event
                }

                showCallback();   
            }
            
        },

        isLoadable = function() {
            return getModal() && getModal().isLoadable();
        };

    return {
        init: init,
        show: show,
        hide: hide,

        // Events
        onConversationContentClicked: onConversationContentClicked,
        onConversationContentInit: onConversationContentInit,

        appendMessage: appendMessage,
        loadHistorys: loadHistorys,
        updateMessageIdsArray: updateMessageIdsArray,

        isLoadable: isLoadable
    }

    ///////////////////////////////////////////////////////////
    //// Conversation Content State Control ( Life Cycle ) ////
    ///////////////////////////////////////////////////////////
    
    ////////////// `onStart` -> `onResume` -> `onHide /////////

    function onStart ( conversation ) {

        activeConversation = conversation;
        
        Ctrl.$conversationPanel.mode( Ctrl.$conversationPanel.MODE.CONTENT );

        // If this method has been called, generally this was clicked by user manually, so we consider
        // this is an ACTIVE CLICK
        Ctrl.$hoverCard.get().notifyUserActiveClickPPCom();
        
        __Monitor.report( __MonitorEvent.show, activeConversation );

        // watch conversation typing
        // Or we can delay `watch action` after the service user send the first message ?
        conversation && conversation.uuid && Service.$notifyTyping
            .get( Service.$notification )
            .watch( conversation.uuid );

        onResume( conversation );
    }

    // reload all data associated with this `conversation`
    function onResume( conversation ) {
        
        // Update view associated with this conversation
        // CLEAR data except for `pull to refresh` element
        // NOTE: `html` method will remove the events bind to `pull to refresh` element, so you MUST bind events again
        View.$conversationContent.html( View.$pulltoRefresh.el() );
        var messageArray = getModal() && getModal().getMessages() || [],
            html = '';
        $.each(messageArray, function(index, item) {
            html += new View.PPConversationPart(messageArray[index]).getElement()[0].outerHTML;
        });
        View.$conversationContent.append(html);

        // Clear unread count associated with this `conversation`
        //
        // because currently, when user click to the `conversation-list` panel, the html are all removed and
        // re create again based the conversation list's new state, so it needn't call the method
        // `View.$groupContentItem.hideUnread( getConversationId() );`
        var m = Modal.$conversationContentGroup.get ( getConversationId() );
        Ctrl.$sheetheader.decrUnread ( m.unreadCount() );
        m.clearUnread();

        __Monitor.report( __MonitorEvent.resume, activeConversation );
        
    }

    function onHide ( conversation ) {

        // unWatch conversation typing
        conversation && conversation.uuid &&
            Service.$notifyTyping.get( Service.$notification )
            .unWatch( conversation.uuid );

        // Close audio player
        Service.$audioContext.close();

        if ( conversation ) __Monitor.report( __MonitorEvent.hide, conversation );
        
    }

    function hide() {
        View.$conversationContentContainer.hide();
        onHide( activeConversation );
        activeConversation = undefined;
    }

    /////// Tools ///////////
    
    function getToken() {
        return activeConversation && activeConversation.token;
    }

    function getConversationId() {
        return activeConversation && activeConversation.uuid;
    }
    
})();
