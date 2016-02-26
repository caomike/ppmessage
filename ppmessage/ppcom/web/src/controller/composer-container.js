Ctrl.$composerContainer = (function() {

    function PPComposerContainerCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var $tools = Service.$tools,
            $device = Service.$device,
            Constants = Service.Constants,

            inMobile = $device.isMobileBrowser(),

            self = this,
            
            selector = '#pp-composer-container',
            composerContainerEmojiBtnSelector = '#pp-composer-container-emoji-btn',
            composerContainerTextareaSelector = '#pp-composer-container-textarea',
            conversationContentSelector = 'pp-conversation-content', //NOTE: No '#'
            composerContainerFileSelector = '#pp-composer-container-file-selector',
            composerContainerWarning = '#pp-composer-container-warning',

            // After send text finish , place cursor at the beginning of textarea
            resetCursor = function() {

                // find element
                var txtElement = $(composerContainerTextareaSelector)[0];
                
                if (txtElement.setSelectionRange) { 
                    txtElement.focus(); 
                    txtElement.setSelectionRange(0, 0); 
                } else if (txtElement.createTextRange) { 
                    var range = txtElement.createTextRange();  
                    range.moveStart('character', 0); 
                    range.select(); 
                }     
            };

        this.getTextareaPaddingStyle = function() {
            return this.isShowEmojiIcon() ? 'padding: 10px 70px 5px 14px' : 'padding: 10px 45px 5px 14px';
        };

        this.hide = function() {
            $(selector).css('margin-bottom', '-59px');
        };

        this.show = function(cb) {
            $(selector).animate({
                'margin-bottom': '0px'
            }, 200, function() {
                if (cb) cb();
            });
        };

        this.onEmojiSelectorSiblingClicked = function() {
            Ctrl.$emojiSelector.get().showSelector(false);
        };
        
        this.onEmojiSelectorBtnClicked = function() {
            Ctrl.$emojiSelector.get().toggleSelector();
        };

        this.onEmojiSelectorBtnMouseOver = function() {
            $(composerContainerEmojiBtnSelector).css('opacity', 1.0);
        };

        this.onEmojiSelectorBtnMouseLeave = function() {
            $(composerContainerEmojiBtnSelector).css('opacity', 0.4);
        };

        this.onFileSelectorBtnClicked = function() {
            Ctrl.$emojiSelector.get().showSelector(false);
            $("#pp-composer-container-input").trigger('click');
        };

        this.onFileSelectorBtnMouseOver = function() {
            $(composerContainerFileSelector).css('opacity', 1.0);
        };

        this.onFileSelectorBtnMouseLeave = function() {
            $(composerContainerFileSelector).css('opacity', 0.4);
        };

        // 显示不正常的：
        this.onChatTextareaFocus = function() {
            Ctrl.$groupMembers.hide();
            View.$conversationContent.scrollToBottom();
            $( composerContainerTextareaSelector ).addClass('pp-textarea-focus');
        };

        this.onTextareaFocusOut = function() {
            $(composerContainerTextareaSelector).removeClass('pp-textarea-focus');
        };

        this.onTextareaChange = function() {
            if (!this.isSendButtonShow()) {
                return;
            }
            var text = $(composerContainerTextareaSelector).val();
            var enableSendButton = text && text.length > 0;
            this.disableSendButton(!enableSendButton);
        };

        this.onChatTextareaKeyDown = function(event) {        
            if (event.which == 13) {
                event.preventDefault(); // Don't make a new line
                this.sendText();
            }
        };

        this.sendText = function() {            
            var text = $(composerContainerTextareaSelector).val();
            if (text) {
                Ctrl.$emojiSelector.get().showSelector(false);
                $(composerContainerTextareaSelector).val('');
                $(composerContainerTextareaSelector).focus();
                View.$composerContainer.fixInputRows();
                $(composerContainerTextareaSelector)[0].rows = 1;

                // Send text message
                new Service.PPMessage.Builder('TEXT')
                    .textMessageBody(text)
                    .build().send();

                // Place cursor to the begining
                // resetCursor();
            }
            this.disableSendButton(true);
        };

        this.onTextareaInit = function() {
            if ($device.isIE()) {
                $(composerContainerTextareaSelector).val('');
            }
        };

        this.onFileSelect = function(file) {
            
            var filePath = $(file).val();
            var isImage = $tools.isImage(filePath);
            var f = file.files[0];

            //read file info and send it
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                // Image 
                if (isImage) {
                    if (e.target && e.target.result) {

                        // Send image message
                        new Service.PPMessage.Builder('IMAGE')
                            .imageBody({
                                file: f, url: filePath, data: e.target.result
                            })
                            .build().send();
                        
                    }
                } else {
                    // Not a Image
                    var fileName = filePath;
                    var slash = -1;
                    if ((slash = filePath.lastIndexOf('\\')) > 0) {
                        fileName = filePath.substring(slash + 1);
                    }

                    // Send file message
                    new Service.PPMessage.Builder('FILE')
                        .fileBody({
                            fileUrl: filePath,
                            file: f,
                            fileName: fileName,
                            fileSize: e.total
                        })
                        .build().send();

                }
            };
            fileReader.onerror = function(e) {
                Service.$debug.d('FileReader upload file error. filePath: %s, error: %s.', filePath, e);
            };

            if (file && file.files[0]) {
                var size = file.files[0].size;
                if (size > Constants.MAX_UPLOAD_SIZE) {
                    //TODO
                    var hint = Constants.i18n('MAXIMUM_UPLOAD_SIZE_HINT') + Constants.MAX_UPLOAD_SIZE_STR;
                    
                    $(composerContainerWarning).css('display', 'block');
                    $('#pp-composer-container-warning-span').text(hint);
                    setTimeout(function() {
                        $(composerContainerWarning).animate({
                            'opacity': 0.01
                        }, 3000, function() {
                            $(composerContainerWarning).css('display', 'none');
                            $(composerContainerWarning).css('opacity', '1.0');
                        });
                    }, 2000);
                } else {
                    fileReader.readAsDataURL(file.files[0]);
                }
                //clear it
                $(file).val('');
            }
        };

        this.isShowEmojiIcon = function() {
            return $tools.isShowEmojiIcon();
        };

        this.isSendButtonShow = function() {
            return inMobile;
        };

        this.onSendButtonInit = function() {
            this.disableSendButton(true);
        };

        this.onSendButtonMouseDown = function(e) {
            e.stopImmediatePropagation();
            e.preventDefault(); // prevent fire focus event

            this.sendText();
        };

        this.disableSendButton = function(disable) {
            // $('#pp-composer-send-button').prop('disabled', disable);
            $('#pp-composer-send-button').css('background', disable ? '#CCCCCC' : '#0074b0');
        };

        this.resetCursor = resetCursor;
    };
    extend(PPComposerContainerCtrl, Ctrl.PPBaseCtrl);

    var instance = null,

        get = function() {
            if (instance == null) {
                instance = new PPComposerContainerCtrl();
            }
            return instance;
        };

    return {
        get: get
    }
    
})();
