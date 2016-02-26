Ctrl.$emojiSelector = ( function() {

    var instance;
    
    return {
        get: function() {
            if ( !instance ) {
                instance = new PPEmojiSelectorCtrl();
            }
            return instance;
        }
    }

    function PPEmojiSelectorCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var _groupIndex = -1,
            self = this,

            chatBoxSelector = "#pp-composer-container-textarea",
            emojiSelector = '#pp-emoji-selector',

            // find $(emoji) at the specified index
            findEmoji = function(index) {
                var selector = '#pp-emoji-selector-content > span:eq(' + index + ')';
                return $(selector);
            },

            // find $(groupEmoji) at the sepcified index
            findGroupEmoji = function(index) {
                var selector = '.pp-emoji-selector-panel-header span:eq(' + index + ')';
                return $(selector);
            },

            // get group title by groupIndex
            findGroupTitle = function(index) {
                return self.getDefaultEmojiGroup()[index].title;
            };
        
        this._showSelector = false;

        this.toggleSelector = function() {
            this._showSelector = !this._showSelector;
            this.showSelector(this._showSelector);
            View.$composerContainer.focus();
        };

        this.showSelector = function(show) {
            this._showSelector = show;
            this.show(emojiSelector, this._showSelector);
            this.show('#pp-emoji-selector-sibling', this._showSelector);
        };

        this.getDefaultEmojiGroup = function() {
            return [{
                value: Service.$emoji.getEmojiCode('People', 'smile').value,
                title: 'People'
            },{
                value: Service.$emoji.getEmojiCode('Nature', 'cherry_blossom').value,
                title: 'Nature'
            },{
                value: Service.$emoji.getEmojiCode('Objects', 'bell').value,
                title: 'Objects'
            },{
                value: Service.$emoji.getEmojiCode('Places', 'blue_car').value,
                title: 'Places'
            },{
                value: Service.$emoji.getEmojiCode('Symbols', 'capital_abcd').value,
                title: 'Symbols'
            }];
        };

        this.onEmojiIconClicked = function(index, emoji) {

            //get emoji body
            var txtToAdd = findEmoji(index)[0].textContent;

            if (!$(chatBoxSelector).val()) {
                this.showSelector(false);

                // Send emoji message
                new Service.PPMessage.Builder('EMOJI')
                    .emojiMessageCode(txtToAdd)
                    .build().send();
                
            } else {
                //find insert position
                var caretPos = document.getElementById("pp-composer-container-textarea").selectionStart;
                var textAreaTxt = $(chatBoxSelector).val();
                var text = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
                //insert emoji to textarea
                $(chatBoxSelector).val(text);
                //focus , move cursor to the right position
                $(chatBoxSelector)[0].focus();
                $(chatBoxSelector)[0].setSelectionRange(caretPos + txtToAdd.length, caretPos + txtToAdd.length);

                View.$composerContainer.fixInputRows();
            }
        };

        this.onEmojiIconMouseOver = function(index, emoji) {
            findEmoji(index).css({
                'background-color': '#E4E4E4'});
        };

        this.onEmojiIconMouseLeave = function(index, emoji) {
            findEmoji(index).css({
                'background-color': '#FFF'});
        };

        /**
         * Emoji group icon on mouse leave event
         */
        this.onEmojiGroupIconMouseLeave = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            findGroupEmoji(groupIndex).css('background-color', View.Style.Color.base);
        };

        /**
         * Emoji group icon on mouse over event
         */
        this.onEmojiGroupIconMouseOver = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            findGroupEmoji(groupIndex).css('background-color', View.Style.Color.base_darker);
        };

        /**
         * filter emoji function
         */
        this._filterEmojiFunc = function(emojiKey) {
            var that = this;
            if (Service.$device.isIE()) {
                var index = $.inArray(emojiKey, that._IE_EMOJI_FILTER_ARRAY);
                return index >= 0;
            } else if (Service.$device.isWindowsPlatform()) {
                if (Service.$device.isFirefox()) {
                    var index = $.inArray(emojiKey, that._WINDOWS_FIREFOX_EMOJI_FILTER_ARRAY);
                    return index >= 0;
                }
            }
            return false;
        };

        this.selectGroup = function(groupIndex) {
            // Same group
            if (_groupIndex == groupIndex) return;
            
            var _groupItems = [],
                _cacheGroupIndex = _groupIndex,
                groupTitle = findGroupTitle(groupIndex);

            // Cache group index
            _groupIndex = groupIndex;
            
            // Filter Emojis to _groupItems
            var emojis = Service.$emoji.getEmojiGroup(groupTitle, this._filterEmojiFunc);
            for (var emoji in emojis) {
                var obj = emojis[emoji];
                _groupItems.push({
                    value: obj.value,
                    title: obj.title
                });
            }

            // Clear last active group css style
            if (_cacheGroupIndex != -1) {
                findGroupEmoji(_cacheGroupIndex).removeClass('active');   
            }
            // Active the new group one
            findGroupEmoji(groupIndex).removeAttr('style').addClass('active');

            // update emojis under the group
            this.empty('.pp-emoji-selector-content');

            var self = this;
            var html = '';
            $.each(_groupItems, function(index, item) {
                html += new View.PPEmojiIcon(item, index, self).getElement()[0].outerHTML;
            });
            $('.pp-emoji-selector-content').append(html);

        };
        
    }
    extend(PPEmojiSelectorCtrl, Ctrl.PPBaseCtrl);

    PPEmojiSelectorCtrl._IE_EMOJI_FILTER_ARRAY = ['grinning', 'stuck_out_tongue', 'open_mouth', 'confused'];
    PPEmojiSelectorCtrl._WINDOWS_FIREFOX_EMOJI_FILTER_ARRAY = ['grinning', 'stuck_out_tongue', 'open_mouth', 'confused'];
    
} )();
