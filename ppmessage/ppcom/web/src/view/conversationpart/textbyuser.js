View.$userTextMessage = ( function() {

    var Div = View.PPDiv,
        prefix = 'pp-conversation-part-',
        prefixId = '#' + prefix;

    //////// API ///////////
    
    return {
        build: build,
        onSendFail: onSendFail
    }

    function build( item ) {
        return new PPConversationPartTextByUser( item );
    }

    function onSendFail( ppMessageJsonBody ) {
        
        $( prefixId + ppMessageJsonBody.messageId )
            .find( '.extra' )
            .text( ppMessageJsonBody.extra.errorDescription )
            .css({ 'color': 'red' })
            .show();
        
    }

    /**
     * @constructor
     */
    function PPConversationPartTextByUser( item ) {
        Div.call(this, 'pp-conversation-part-text-by-user');

        var error = Service.$tools.isMessageSendError(item);
        var extra = error ? item.extra.errorDescription : item.extra.description;
        
        var html = View.$textUrlChecker.match(item.message.text.body).trustAsHtml();
        
        this.add(new Div('pp-conversation-part-text-by-user-outer')
                 .add(new Div( 'pp-wrapper' )
                      .add(new Div('pp-conversation-part-text-by-user-body-outer')
                           .add(new Div({
                               id: 'pp-conversation-part-text-by-user-body',
                               'class': 'pp-conversation-part-text-by-user-body pp-font pp-text-link-user pp-selectable'
                           })
                                .html(html)))
                      .add(new Div('pp-conversation-part-text-by-user-triangle')))
                 .add(new Div('pp-conversation-part-text-by-user-timestamp-outer')
                      .add(new View.Span({
                          'class': 'extra pp-selectable',
                          style: error ? 'color:red; display:block' : 'color:#c9cbcf; display:none'
                      }).text(extra))));
    }
    extend(PPConversationPartTextByUser, Div);
    
} )();
