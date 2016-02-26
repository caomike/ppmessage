View.$userEmojiMessage = ( function() {

    var prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix,
        id = prefix + 'emoji-by-user',
        clsTextSelectable = 'pp-selectable';

    //////// API ////////////
    
    return {
        build: build,
        onSendFail: onSendFail
    }

    function build( item ) {
        return new PPConversationPartEmojiByUser( item );
    }

    function onSendFail( ppMessageJsonBody ) {
        
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( ppMessageJsonBody.extra.errorDescription )
            .css( { color: 'red' } )
            .show();

    }

    /**
     * @constructor
     */
    function PPConversationPartEmojiByUser(item) {
        View.PPDiv.call(this, id);

        var error = Service.$tools.isMessageSendError(item);
        var extra = error ? item.extra.errorDescription : item.extra.description;

        this.add(new View.PPDiv({
            className: 'pp-emoji-container'
        })
                 .add(new View.PPDiv({
                     className: 'pp-emoji ' + clsTextSelectable
                 }).text(item.message.emoji.code))
                 .add(new View.PPDiv()
                      .add(new View.PPElement('span', {
                          className: 'extra ' + clsTextSelectable,
                          style: error ? 'color:red; display:block;' : 'color:#c9cbcf; display:none;'
                      })
                           .text(extra))));
    }
    extend(PPConversationPartEmojiByUser, View.PPDiv);
    
} )();
