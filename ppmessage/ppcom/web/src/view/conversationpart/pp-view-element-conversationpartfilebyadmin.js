((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartFileByAdmin(item) {
        View.PPDiv.call(this, 'pp-conversation-part-file-by-admin');

        var userAvatar = item.user.avatar,
            userName = item.user.name,
            userId = item.user.id,
            fileUrl = item.message.file.fileUrl,
            fileName = item.message.file.fileName,
            messageId = item.messageId,

            // 当用户信息(通常：头像或姓名)改变的时候，回调
            onAdminUserInfoChangeEvent = function(topics, user) {

                var selector = '#pp-conversation-part-' + messageId,
                    userInfo = user.getInfo();

                // Change user avatar src
                $(selector)
                    .find('.pp-conversation-part-file-by-admin-avatar')
                    .attr('src', userInfo.user_avatar);

                // Change user name text
                $(selector)
                    .find('.pp-conversation-part-serve-name')
                    .text(userInfo.user_fullname);                    
                
            };

        // subscribe 'user/infochange/xxxx-xxx-xxxx(user_uuid)' event
        Service.$pubsub.subscribe("user/infochange/" + userId, onAdminUserInfoChangeEvent);

        this.add(new View.PPDiv('pp-conversation-part-file-by-admin-outer')
                 .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-2')
                      .add(new View.PPElement('img', {
                          'class': 'pp-conversation-part-file-by-admin-avatar',
                          src: userAvatar
                      }))
                      .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-3')
                           .add(new View.PPDiv({
                               id: '',
                               'class': 'pp-conversation-part-serve-name pp-font'
                           }).text(userName))
                           .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-4')
                                .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-5')
                                     .add(new View.PPDiv({
                                         id: 'pp-conversation-part-file-by-admin-upload-icon',
                                         style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-white.png)'
                                     }))
                                     .add(new View.PPDiv('pp-conversation-part-file-by-admin-outer-6')
                                          .add(new View.PPElement('a', {
                                              href: fileUrl,
                                              download: fileName,
                                              'class': "pp-conversation-part-file-by-admin-file-link pp-font",
                                              title: fileName
                                          })
                                               .text(fileName
                                                    ))))
                                .add(new View.PPDiv('pp-conversation-part-file-by-admin-timestamp-container')
                                     .add(new View.PPElement('span', {
                                         'class': 'pp-selectable pp-font',
                                         id: 'pp-conversation-part-file-by-admin-timestamp-' + messageId
                                     })
                                          .text()))))));
    }
    extend(PPConversationPartFileByAdmin, View.PPDiv);

    View.PPConversationPartFileByAdmin = PPConversationPartFileByAdmin;
    
})(View));
