((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartTimestamp(item) {
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-timestamp-' + item.messageId ,
            'class': 'pp-conversation-part-center pp-font'
        });

        this.add(new View.PPDiv({
            'class': 'pp-conversation-part-timestamp-time'
        }).text(item.message.timestamp.timeStr));
    }
    extend(PPConversationPartTimestamp, View.PPDiv);

    View.PPConversationPartTimestamp = PPConversationPartTimestamp;
    
})(View));
