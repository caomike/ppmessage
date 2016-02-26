((function(View) {

    /**
     * @constructor
     */
    function PPConversationPart(item) {
        var id = item.messageId;
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-' + id,
            'class': 'pp-conversation-part'
        });

        switch(item.messageType) {
        case 'WELCOME':
            item && this.add(new View.AppProfileContainer(item));
            break;

        case 'TEXT':
            this.add((item.user.admin) ? new View.PPConversationPartTextByAdmin(item) : View.$userTextMessage.build(item));
            break;

        case 'EMOJI':
            this.add((item.user.admin) ? new View.PPConversationPartEmojiByAdmin(item) : View.$userEmojiMessage.build(item));
            break;

        case 'IMAGE':
            this.add((item.user.admin) ? View.$adminImageMessage.build(item) : View.$userImageMessage.build(item));
            break;

        case 'AUDIO':
            item.user.admin && this.add( View.$adminAudioMessage.build( item ) );
            break;

        case 'FILE':
            this.add((item.user.admin) ? new View.PPConversationPartFileByAdmin(item) : new View.PPConversationPartFileByUser(item));
            break;

        case 'TIMESTAMP':
            this.add(new View.PPConversationPartTimestamp(item));
            break;
        }
    }
    extend(PPConversationPart, View.PPDiv);

    View.PPConversationPart = PPConversationPart;
    
})(View));
