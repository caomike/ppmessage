((function(View) {

    /**
     * @constructor
     */
    function PPConversationPartFileByUser(item) {
        View.PPDiv.call(this, {
            id: 'pp-conversation-part-file-by-user-' + item.messageId ,
            'class': 'pp-conversation-part-file-by-user'
        });

        var $tools = Service.$tools,
            error = $tools.isMessageSendError(item),
            extra = error ? item.extra.errorDescription : item.extra.description,
            showUploadingBar = $tools.isUploading(item),
            isIE = Service.$device.isIE();
        
        this.add(new View.PPDiv({
            id: 'pp-conversation-part-file-by-user-o-' + item.messageId,
            'class': 'pp-conversation-part-file-by-user-o'
        })
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-o2-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-o2',
                     style: error ? 'opacity: 0.6' : ''
                 })
                      .add(new View.PPDiv({
                          id: 'pp-conversation-part-file-by-user-upload-icon',
                          style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-white.png)'
                      }))
                      .add(new View.PPDiv({
                          'class': 'pp-conversation-part-file-by-user-link-container',
                          style: isIE ? 'margin-left: 0px;' : null // <- fix IE bug
                      })
                           .add(new View.PPElement('a', {
                               id: 'pp-conversation-part-file-by-user-a-' + item.messageId,
                               'class': 'pp-font',
                               title: item.message.file.fileName,
                               style: error ? 'cursor:default' : 'cursor:pointer',
                               href: item.message.file.fileServerUrl ? item.message.file.fileServerUrl : undefined
                           }).text(item.message.file.fileName
                                   // 'LongTextLongTextLongTextLongTextLongText'
                                  ))))
                 .add(new View.PPDiv({
                     id: 'pp-conversation-part-file-by-user-timestamp-' + item.messageId,
                     'class': 'pp-conversation-part-file-by-user-timestamp pp-selectable pp-font',
                     style: error ? "color:red; display:block;" : "color:#c9cbcf; display:none;"
                 })
                      .text(extra)
                      .show(error))
                 .add(new View.PPDiv({
                     'class': 'pp-fixme'
                 })
                      .add(new View.PPUploadingBar(item).show(showUploadingBar))));
    }
    extend(PPConversationPartFileByUser, View.PPDiv);

    View.PPConversationPartFileByUser = PPConversationPartFileByUser;
    
})(View));
