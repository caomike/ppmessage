View.$conversationContent = (function() {

    /**
     * @constructor
     */
    function PPConversationContent(items) {
        var ctrl = Ctrl.$conversationContent.init();
        View.PPDiv.call(this, {
            id: id,
            'class': id + ' pp-unselectable pp-box-sizing-borderbox',
            style: 'background-color:' + View.Style.Color.base,
            event: {
                click: function() {
                    ctrl.onConversationContentClicked();
                },
                init: function() {
                    ctrl.onConversationContentInit();
                }
            }
        }, ctrl);
        if (items && items.length > 0) {
            for (var i=0; i<items.length; ++i) {
                this.add(new View.PPConversationPart(items[i]));
            }
        }
    }
    extend(PPConversationContent, View.PPDiv);

    var id = 'pp-conversation-content',
        selector = '#' + id;

    return {
        
        build: function(items) {
            return new PPConversationContent(items);
        },

        scrollToBottom: function() { //scroll to bottom
            $(selector).stop().animate({
                scrollTop: $(selector)[0].scrollHeight
            }, 600, 'swing');
            // $(selector).scrollTop($(selector)[0].scrollHeight);
        },

        html: function($el) {
            $(selector).html($el);
        },

        append: function(html) {
            $(selector).append(html);
        },

        show: function(fadeIn) {
            if (fadeIn) $(selector).show();
            else $(selector).fadeIn();
        }
    }
    
})();
