((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorGroupIcon(emoji, index, ctrl) {
        View.PPElement.call(this, 'span', {
            title: emoji.title,
            selector: '.pp-emoji-selector-panel-header span:eq(' + index + ')',
            event: {
                click: function() {
                    ctrl.selectGroup(index);
                },
                mouseleave: function() {
                    ctrl.onEmojiGroupIconMouseLeave(index);
                },
                mouseover: function() {
                    ctrl.onEmojiGroupIconMouseOver(index);
                }
            }
        });
        
        this.text(emoji.value);
    }
    extend(PPEmojiSelectorGroupIcon, View.PPElement);

    View.PPEmojiSelectorGroupIcon = PPEmojiSelectorGroupIcon;
    
})(View));
