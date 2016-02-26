((function(View) {

    /**
     * @constructor
     */
    function PPEmojiIcon(emoji, index, ctrl) {
        View.PPElement.call(this, 'span', {
            title: emoji.title,
            selector: '#pp-emoji-selector-content > span:eq(' + index + ')',
            event: {
                click: function() {
                    ctrl.onEmojiIconClicked(index, emoji);
                },
                
                mouseover: function() {
                    ctrl.onEmojiIconMouseOver(index, emoji);
                },
                
                mouseleave: function() {
                    ctrl.onEmojiIconMouseLeave(index, emoji);
                }
                
            }
        }, ctrl);

        this.text(emoji.value);
    }
    extend(PPEmojiIcon, View.PPElement);

    View.PPEmojiIcon = PPEmojiIcon;
    
})(View));
