((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartEmojiByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-emoji-by-admin');

        Service.$pubsub.subscribe('user/infochange/' + item.user.id, function(topics, user) {

            var selector = '#pp-conversation-part-' + item.messageId,
                userInfo = user.getInfo();

            // Change user avatar src
            $(selector)
                .find('.pp-conversation-part-emoji-by-admin-avatar')
                .attr('src', userInfo.user_avatar);

            // Change user name text
            $(selector)
                .find('.pp-conversation-part-serve-name')
                .text(userInfo.user_fullname);
            
        });

        this.add(new View.PPDiv('pp-conversation-part-emoji-by-admin-outer')
                 .add(new View.PPElement('img', {
                     src: item.user.avatar,
                     id: 'pp-conversation-part-emoji-by-admin-avatar'
                 }))
                 .add(new View.PPDiv('pp-conversation-part-emoji-by-admin-body-container')
                      .add(new View.PPDiv({
                          id: '',
                          'class': 'pp-conversation-part-serve-name pp-font'
                      }).text(item.user.name))
                      .add(new View.PPElement('span', {
                          id: 'pp-conversation-part-emoji-by-admin-body',
                          'class': 'pp-conversation-part-emoji-by-admin-body pp-selectable'
                      }).text(item.message.emoji.code))
                      .add(new View.PPElement('span', {
                          id: 'pp-conversation-part-emoji-by-admin-timestamp-' + item.messageId,
                          'class': 'pp-conversation-part-emoji-by-admin-timestamp pp-selectable pp-font'
                      }).text())));
    }
    extend(PPConversationPartEmojiByAdmin, View.PPDiv);

    View.PPConversationPartEmojiByAdmin = PPConversationPartEmojiByAdmin;
    
})(View));
