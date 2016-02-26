//autoExpandHeight-TextArea
//see-->http://codepen.io/vsync/pen/frudD
View.$composerContainer = (function() {

    /**
     * @constructor
     */
    function PPComposerContainer() {
        var ctrl = Ctrl.$composerContainer.get();
        View.PPDiv.call(this, {
            id: containerId,
            style: 'background-color:' + View.Style.Color.base,
            'class': containerId + ' pp-box-sizing-borderbox pp-font'
        }, ctrl);
        
        var self = this;
        
        this.add(self.getUploadingWarningHtml(ctrl))
            .add(self.getComposerEmojiContainerHtml(ctrl))
            .add(new View.PPDiv({id: 'pp-composer'})
                 .add(self.getComposerSendButtonContainer(ctrl))
                 .add(self.getComposerFormContainerHtml(ctrl)))
            .add(View.$poweredBy.build());
        
        $timeout( View.$poweredBy.bindEvent );
        
        this.calcInputTextAreaRows();
    }
    extend(PPComposerContainer, View.PPDiv);

    /**
     * Uploading warning html code
     */
    PPComposerContainer.prototype.getUploadingWarningHtml = function(ctrl) {
        return new View.PPDiv('pp-composer-container-warning')
            .add(new View.PPElement('span', {
                id: 'pp-composer-container-warning-span',
                'class': 'pp-composer-container-warning-span pp-font'
            }))
            .show(false);
    };

    /**
     * emoji container html code
     */
    PPComposerContainer.prototype.getComposerEmojiContainerHtml = function(ctrl) {
        var container = new View.PPDiv({style: 'position: relative'});
        
        container.add(new View.$emojiSelector.build());
        container.add(new View.PPDiv({
            'class': 'pp-emoji-selector-sibling',
            id: 'pp-emoji-selector-sibling',
            event: {
                click: function() {
                    ctrl.onEmojiSelectorSiblingClicked();
                },
                init: function() {
                    $('#pp-emoji-selector-sibling').css('display', 'none');
                }
            }
        }, ctrl));

        return container;
        
    };

    /**
     * form container html code
     */
    PPComposerContainer.prototype.getComposerFormContainerHtml = function(ctrl) {

        var container = new View.PPDiv({
            style: "position: relative; overflow: hidden;"
        }),

            inMobile = Service.$device.isMobileBrowser(),

            self = this,
            
            form = new View.PPElement('form', {
                id: "pp-composer-container-form",
                name: "pp-composer-container-form",
                enctype: "multipart/form-data",
                target: "pp-composer-uploadframe",
                method: "post"
            }),

            placeHolder = Service.Constants.i18n(inMobile ? 'START_CONVERSATION_MOBILE_HINT' : 'START_CONVERSATION_HINT'),

            textareaClass = 'pp-composer-container-textarea pp-box-sizing-borderbox pp-font';
        
        if (Service.$device.isIE()) {
            textareaClass += ' pp-composer-container-textarea-min-height';
        }
        form.add(new View.PPElement('textarea', {
            id: inputID,
            'class': textareaClass,
            'data-min-rows': 1,
            placeholder: placeHolder,
            style: ctrl.getTextareaPaddingStyle(),
            rows: 1,
            event: {
                keydown: function(event) {
                    ctrl.onChatTextareaKeyDown(event);
                },
                focus: function() {
                    ctrl.onChatTextareaFocus();
                },
                blur: function() {
                    ctrl.onTextareaFocusOut();
                },
                init: function() {
                    ctrl.onTextareaInit();
                },
                'input propertychange': function() {
                    ctrl.onTextareaChange();
                }
            }
        }, ctrl));
        form.add(new View.PPElement('input', {
            id: 'pp-composer-container-content-txt',
            name: 'content_txt',
            type: 'hidden'
        }));
        form.add(new View.PPElement('input', {
            name: 'upload_type',
            type: 'hidden',
            value: 'content_txt'
        }));
        form.add(new View.PPElement('iframe', {
            id: 'pp-composer-uploadframe',
            name: "pp-composer-uploadframe",
            style: 'display:none'
        }));

        form.add(self.getComposerToolsContainerHtml(ctrl));

        container.add(form);

        return container;
    };

    /**
     * composer tools container html code
     */
    PPComposerContainer.prototype.getComposerToolsContainerHtml = function(ctrl) {
        var container = new View.PPDiv('pp-composer-container-tools-container');

        var emojiIconCssUrl = 'background-image: url(' + Configuration.assets_path + 'img/icon-emoji.png)';
        container.add(new View.PPElement('strong', {
            id: 'pp-composer-container-emoji-btn',
            'class': 'pp-composer-container-action-btn pp-composer-container-emoji-btn pp-box-sizing',
            style: ctrl.isShowEmojiIcon() ? 'display:block;' + emojiIconCssUrl : 'display:none',
            event: {
                click: function() {
                    ctrl.onEmojiSelectorBtnClicked();
                },
                mouseover: function() {
                    ctrl.onEmojiSelectorBtnMouseOver();
                },
                mouseleave: function() {
                    ctrl.onEmojiSelectorBtnMouseLeave();
                }
            }
        }));

        var fileSelectorIconCssUrl = 'background-image: url(' + Configuration.assets_path + 'img/icon-upload.png)';
        container.add(new View.PPElement('strong', {
            id: 'pp-composer-container-file-selector',
            'class': 'pp-composer-container-action-btn pp-box-sizing',
            style: fileSelectorIconCssUrl,
            event: {
                click: function() {
                    ctrl.onFileSelectorBtnClicked();
                },
                mouseover: function() {
                    ctrl.onFileSelectorBtnMouseOver();
                },
                mouseleave: function() {
                    ctrl.onFileSelectorBtnMouseLeave();
                }
            }
        }, ctrl));
        
        container.add(new View.PPElement('input', {
            id: 'pp-composer-container-input',
            type: 'file',
            event: {
                change: function(file) {
                    ctrl.onFileSelect(file);
                }
            }
        }, ctrl));
        
        return container;
    };

    /**
     * composer send button container html code
     *
     * Used for Android, iOS ... Mobile Devices
     */
    PPComposerContainer.prototype.getComposerSendButtonContainer = function(ctrl) {
        var show = ctrl.isSendButtonShow(),
            sendText = Service.Constants.i18n('SEND');

        return new View.PPDiv({
            id: 'pp-composer-send-button',
            'class': 'pp-composer-send-button pp-unselectable',
            style: 'display:' + (show ? 'block' : 'none'),
            event: {
                mousedown: function(e) {
                    ctrl.onSendButtonMouseDown(e);
                },
                init: function() {
                    ctrl.onSendButtonInit();
                }
            }
        })
            .add(new View.PPElement('p', {
                style: 'padding-top: 7.5px;',
                'class': 'pp-p-no-margin'
            }).text(sendText));
    };

    /**
     * Calculate textarea initial rows
     */
    PPComposerContainer.prototype.calcInputTextAreaRows = function() {
        $(document)
            .one('focus.textarea', inputSelector, function() {
                var savedValue = this.value;
                this.value = '';
                baseScrollHeight = this.scrollHeight || this[0].scrollHeight;
                this.value = savedValue;
                minRows = this.rows;
            })
            .on('input.textarea', inputSelector, function() {
                onTyping();
                fixInputRows();
            });
    };

    var containerId = 'pp-composer-container',
        inputID = 'pp-composer-container-textarea',
        inputSelector = '#' + inputID,
        
        minRows, // input min rows
        baseScrollHeight, // input initial height

        getSingleRowHeight = function() {
            return Service.$device.inMobile() ? 28 : Service.$device.isIE() ? 17 : 23; // how height single row
        },
        
        fixInputRows = function() {
            var _minRows = 1;
            var _baseScrollHeight = baseScrollHeight;
            var _e = jQuery(inputSelector)[0];
            var _rowHeight = getSingleRowHeight();

            //in IE, if set _e.rows = 0, will throw Error ("Invalid Value");
            if (_e && _e.rows && _e.scrollHeight) {
                _e.rows = _minRows;
                _e.rows = _minRows + Math.ceil((_e.scrollHeight - _baseScrollHeight) / _rowHeight);
            }
        },

        onTyping = function () {
            // every 2 seconds, only send once `typing` info to server
            Service.$schedule.once ( Service.$notifyTyping.get( Service.$notification ).typing, 'typing', 2 * 1000 );
        };

    return {
        
        build: function() { // build a PPComposerContainer
            return new PPComposerContainer();
        },

        fixInputRows: function() {
            fixInputRows();
            View.$emojiSelector.changeBottomMarginByInputHeight($(inputSelector).height());
        },

        focus: function() {
            $(inputSelector).focus();
        },

        blur: function() {
            $(inputSelector).blur();
        }
        
    }
    
})();
