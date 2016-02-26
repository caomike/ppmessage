((function(View) {

    /**
     * @constructor
     */
    function PPEmojiSelectorPanelHeader(items, ctrl) {
        View.PPDiv.call(this, {
            id: 'pp-emoji-selector-panel-header',
            style: 'background-color:' + View.Style.Color.base
        }, ctrl);

        if (items && items.length > 0) {
            for (var i=0; i<items.length; ++i) {
                this.add(new View.PPEmojiSelectorGroupIcon(items[i], i, ctrl));
            }
        }
    }
    extend(PPEmojiSelectorPanelHeader, View.PPDiv);

    View.PPEmojiSelectorPanelHeader = PPEmojiSelectorPanelHeader;
    
})(View));
