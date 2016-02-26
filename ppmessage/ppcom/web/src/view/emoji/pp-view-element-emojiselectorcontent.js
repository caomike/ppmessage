((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorContent(ctrl) {
        View.PPDiv.call(this, {
            id: 'pp-emoji-selector-content',
            'class': 'pp-emoji-selector-content pp-box-sizing'
        }, ctrl);
        setTimeout(function() {
            ctrl.selectGroup(0);
        });
    }
    extend(PPEmojiSelectorContent, View.PPDiv);

    View.PPEmojiSelectorContent = PPEmojiSelectorContent;
    
})(View));
