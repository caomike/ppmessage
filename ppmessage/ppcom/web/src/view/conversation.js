View.$conversation = (function() {

    var id = 'pp-conversation',
        selector = '#' + id,

        clsMaximize = 'pp-conversation-content-maximize',
        clsMinimize = 'pp-conversation-sheet-minimized';

    return {
        
        build: function() {
            return new PPConversation();
        },

        show: function() {
            $( selector ).removeClass( clsMinimize ).addClass( clsMaximize );
        },

        hide: function() {
            $( selector ).removeClass( clsMaximize ).addClass( clsMinimize );
        }
        
    }

    /**
     * @constructor
     */
    function PPConversation() {
        View.PPDiv.call(this, {
            id: id,
            style: 'background-color:' + View.Style.Color.base,
            'class': 'pp-messenger-panel pp-box-sizing'
        });
        
        this.add(View.$sheetHeader.build())
            .add(View.$groupContent.build())
            .add(View.$conversationContentContainer.build())
            .add(View.$loading.build());
    }
    extend(PPConversation, View.PPDiv);
    
})();
