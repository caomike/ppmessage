View.$pulltoRefresh = (function() {

    function PulltoRefreshButton(text) {
        var ctrl = Ctrl.$pulltoRefreshController.get(),
            initialText = (text !== undefined ? text : ctrl.getLoadHistortyHintText());
        
        View.PPDiv.call(this, {
            id: id,
            'class': id + ' pp-conversation-part-center'
        });

        this.text(initialText);
    }
    extend(PulltoRefreshButton, View.PPDiv);

    var id = 'pp-conversation-part-pulltorefreshbutton',
        selector = '.' + id,

        build = function(text) {
            return new PulltoRefreshButton(text);
        },

        hide = function() {
            $(selector).hide();
        },

        show = function() {
            $(selector).show();
        },

        el = function() { // return jQuery('element');
            return $(selector);
        };

    return {
        build: build,

        hide: hide,
        show: show,

        el: el
    }
    
})();
