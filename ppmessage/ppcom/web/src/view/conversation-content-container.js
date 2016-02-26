View.$conversationContentContainer = (function() {

    var id = 'pp-conversation-container',
        selector = '.' + id,

        hide = function() {
            $(selector).hide();
        },

        show = function(fadeIn) {
            if (fadeIn) {
                $(selector).show();    
            } else {
                $(selector).fadeIn();    
            }
        },

        visible = function() {
            return $(selector).is(':visible');
        },

        build = function() {
            return new View.PPDiv(id)
                .add(View.$conversationContent.build())
                .add(View.$composerContainer.build());
        };
    
    return {
        hide: hide,
        show: show,
        visible: visible,

        build: build
    }
    
})();
