((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartTextByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-text-by-admin');

        var html = View.$textUrlChecker.match(item.message.text.body).trustAsHtml();
        var defaultServeNameMarginLeft = '37px';

        Service.$pubsub.subscribe('user/infochange/' + item.user.id, function(topics, user) {

            var selector = '#pp-conversation-part-' + item.messageId,
                userInfo = user.getInfo();

            // Change user avatar src
            $(selector)
                .find('.pp-conversation-part-text-by-admin-avatar')
                .attr('src', userInfo.user_avatar);

            // Change user name text
            $(selector)
                .find('.pp-conversation-part-serve-name')
                .text(userInfo.user_fullname);           
            
        });
        
        this.add(new View.PPDiv('pp-conversation-part-text-by-admin-outer')
                 .add(new View.PPDiv('pp-conversation-part-text-by-admin-outer-2')
                      .add(new View.PPElement('img', {
                          id: 'pp-conversation-part-text-by-admin-avatar',
                          src: item.user.avatar
                      }))
                      .add(new View.PPDiv('pp-conversation-part-text-by-admin-outer-3')
                           .add(new View.PPDiv()
                                .add(new View.PPDiv({
                                    id: '',
                                    style: 'margin-left:' + defaultServeNameMarginLeft,
                                    'class': 'pp-conversation-part-serve-name pp-font'
                                }).text(item.user.name))
                                .add(new View.PPDiv('pp-conversation-part-text-by-admin-body-container')
                                     .add(new View.PPDiv({
                                         id: 'pp-conversation-part-text-by-admin-body',
                                         'class': 'pp-conversation-part-text-by-admin-body pp-font pp-text-link-admin pp-selectable'
                                     })
                                          .html(html)))
                                .add(new View.PPDiv('pp-conversation-part-text-by-admin-triangle')))
                           .add(new View.PPDiv('pp-conversation-part-text-by-admin-timestamp-container')
                                .add(new View.PPElement('span', {
                                    'class': 'pp-selectable pp-font',
                                    id: 'pp-conversation-part-text-by-admin-timestamp-' + item.messageId
                                }))))));
    }
    extend(PPConversationPartTextByAdmin, View.PPDiv);

    View.PPConversationPartTextByAdmin = PPConversationPartTextByAdmin;
    
})(View));
