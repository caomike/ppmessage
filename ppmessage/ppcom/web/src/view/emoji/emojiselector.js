((function(View) {

    View.$emojiSelector = (function() {
        
        /**
         * @constructor
         */
        function PPEmojiSelector() {
            var ctrl = Ctrl.$emojiSelector.get();
            View.PPDiv.call(this, {
                id: emojiSelectorId,
                'class': emojiSelectorClass + ' pp-box-sizing pp-unselectable',
                event: {
                    init: function() {
                        $(emojiSelectorSelector).css({
                            'display': 'none'
                        });
                    }
                }
            }, ctrl);
            
            this.add(new View.PPEmojiSelectorPanelHeader(ctrl.getDefaultEmojiGroup(), ctrl))
                .add(new View.PPEmojiSelectorContent(ctrl))
                .add(new View.PPDiv('pp-emoji-selector-triangle'))
                .add(new View.PPDiv('pp-emoji-selector-triangle-mask'));
        }
        extend(PPEmojiSelector, View.PPDiv);

        var emojiSelectorId = 'pp-emoji-selector',
            emojiSelectorClass = emojiSelectorId,
            emojiSelectorSelector = '#' + emojiSelectorId,
            emojiSelectorToolsContainerSelector = '#pp-composer-container-tools-container';

        return {
            build: function() {
                return new PPEmojiSelector();
            },

            changeBottomMarginByInputHeight: function(height) {
                var fixBottom = height + 3; // 3 is fix number
                
                $(emojiSelectorToolsContainerSelector).css('bottom', fixBottom);
            }
        }
        
    })();
    
})(View));
